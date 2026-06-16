import React, { useState, useEffect } from 'react';
import { ViewState, Resource, Reservation } from './types';
import { mockResources } from './data';
import { checkCollision } from './utils';
import { 
  subscribeReservations, 
  createReservation, 
  updateReservationSchedule, 
  updateReservationStatus 
} from './firebaseService';

// Import Modular Sub-Views
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import BookingFormView from './components/BookingFormView';
import MyReservationsView from './components/MyReservationsView';
import SuccessView from './components/SuccessView';
import ConflictView from './components/ConflictView';
import ReturnView from './components/ReturnView';
import EditView from './components/EditView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [resources] = useState<Resource[]>(mockResources);

  // Load and persist reservations in real-time from Firebase Firestore
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    // Synchronous immediate initial load from localStorage backup to prevent any blank state on refresh
    const localBackup = localStorage.getItem('office_hub_reservations_v1');
    return localBackup ? JSON.parse(localBackup) : [];
  });

  useEffect(() => {
    console.log("Subscribing to reservations in App.tsx...");
    const unsubscribe = subscribeReservations((updatedList) => {
      console.log("Reservations updated from Firebase:", updatedList);
      setReservations(updatedList);
      // Update local dual backup
      localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updatedList));
    }, (error) => {
      console.error("Failed to subscribe reservations:", error);
    });
    return () => unsubscribe();
  }, []);

  // Global search term
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Workspace transaction state tracking
  const [preselectedResourceId, setPreselectedResourceId] = useState<string | null>(null);
  const [lastReservation, setLastReservation] = useState<Reservation | null>(null);
  const [conflictData, setConflictData] = useState<{
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  } | null>(null);
  const [activeReturnId, setActiveReturnId] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  // Navigation controller
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // Clear details if resetting
    if (view === 'dashboard' || view === 'booking') {
      setActiveEditId(null);
      setActiveReturnId(null);
    }
  };

  // Immediate Quick Booking Trigger from Dashboard Cards
  const handleBookResource = (resourceId: string) => {
    setPreselectedResourceId(resourceId);
    setCurrentView('booking');
  };

  const handleOpenNewBooking = () => {
    setPreselectedResourceId(null);
    setCurrentView('booking');
  };

  // Submit Reservation logic with constraint checker
  const handleConfirmReservation = (bookingData: {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => {
    // Check list for colliding schedules
    const collision = checkCollision(
      bookingData.resourceId,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime,
      reservations
    );

    if (collision) {
      // OVERLAP PRESENT -> Route to conflict view to suggest recommendations
      setConflictData(bookingData);
      setCurrentView('conflict');
    } else {
      // NO COLLISION -> Succeed immediately
      const newBooking: Reservation = {
        id: `res-${Date.now()}`,
        resourceId: bookingData.resourceId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose,
        status: 'confirmed'
      };

      setPrevAndSuccess(newBooking);
    }
  };

  // Dynamic quick-slots alternate booking confirmations
  const handleSelectAlternativeSlot = (newStart: string, newEnd: string) => {
    if (!conflictData) return;

    const newBooking: Reservation = {
      id: `res-${Date.now()}`,
      resourceId: conflictData.resourceId,
      date: conflictData.date,
      startTime: newStart,
      endTime: newEnd,
      purpose: conflictData.purpose,
      status: 'confirmed'
    };

    setPrevAndSuccess(newBooking);
  };

  const handleSelectAlternativeResource = (alternateResourceId: string) => {
    if (!conflictData) return;

    const newBooking: Reservation = {
      id: `res-${Date.now()}`,
      resourceId: alternateResourceId,
      date: conflictData.date,
      startTime: conflictData.startTime,
      endTime: conflictData.endTime,
      purpose: conflictData.purpose,
      status: 'confirmed'
    };

    setPrevAndSuccess(newBooking);
  };

  const setPrevAndSuccess = (newBooking: Reservation) => {
    // Optimistic local state update
    setReservations(prev => {
      if (prev.some(r => r.id === newBooking.id)) return prev;
      const updated = [newBooking, ...prev];
      localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updated));
      return updated;
    });
    setLastReservation({
      ...newBooking,
      createdAt: new Date().toISOString()
    });
    setConflictData(null);
    setCurrentView('success');

    // Perform database creation in the background
    createReservation(newBooking).catch((e) => {
      console.error('Failed to create reservation in Firestore:', e);
      // Rollback local state on error
      setReservations(prev => {
        const rolledBack = prev.filter(r => r.id !== newBooking.id);
        localStorage.setItem('office_hub_reservations_v1', JSON.stringify(rolledBack));
        return rolledBack;
      });
    });
  };

  // Return asset actions
  const handleInitiateReturn = (reservationId: string) => {
    setActiveReturnId(reservationId);
    setCurrentView('return');
  };

  const handleConfirmReturn = (reservationId: string, notes: string) => {
    const resolvedNotes = notes || '특이사항 없음';
    // Optimistic local state update
    setReservations(prev => {
      const updated = prev.map(r => r.id === reservationId ? { ...r, status: 'completed', notes: resolvedNotes } : r);
      localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updated));
      return updated;
    });
    alert('반납 처리가 완료되었습니다. 감사합니다!');
    setActiveReturnId(null);
    setCurrentView('my_reservations');

    // Perform database update in the background
    updateReservationStatus(reservationId, 'completed', resolvedNotes).catch((e) => {
      console.error('Failed to update reservation status to completed:', e);
    });
  };

  // Edit/Modify actions
  const handleInitiateEdit = (reservationId: string) => {
    setActiveEditId(reservationId);
    setCurrentView('edit');
  };

  const handleConfirmEdit = (
    reservationId: string,
    updatedData: { date: string; startTime: string; endTime: string }
  ) => {
    // Optimistic local state update
    setReservations(prev => {
      const updated = prev.map(r => r.id === reservationId ? { ...r, ...updatedData } : r);
      localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updated));
      return updated;
    });
    alert('예약 일정이 수정 완료되었습니다!');
    setActiveEditId(null);
    setCurrentView('my_reservations');

    // Perform database update in the background
    updateReservationSchedule(reservationId, updatedData).catch((e) => {
      console.error('Failed to update reservation schedule:', e);
    });
  };

  // Cancel reservation
  const handleCancelBooking = (reservationId: string) => {
    // Optimistic local state update
    setReservations(prev => {
      const updated = prev.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r);
      localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updated));
      return updated;
    });

    // Perform database update in the background
    updateReservationStatus(reservationId, 'cancelled').catch((e) => {
      console.error('Failed to cancel reservation in database:', e);
    });
  };

  // Master Render View Selector
  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            resources={resources}
            reservations={reservations}
            searchTerm={searchTerm}
            onBookResource={handleBookResource}
            onNavigateToMyReservations={() => handleNavigate('my_reservations')}
          />
        );
      case 'booking':
        return (
          <BookingFormView
            resources={resources}
            preselectedResourceId={preselectedResourceId}
            onConfirmBooking={handleConfirmReservation}
          />
        );
      case 'success':
        return (
          <SuccessView
            lastReservation={lastReservation}
            resources={resources}
            onNavigateToMyReservations={() => handleNavigate('my_reservations')}
            onBookMore={handleOpenNewBooking}
          />
        );
      case 'conflict':
        return (
          <ConflictView
            conflictData={conflictData}
            resources={resources}
            reservations={reservations}
            onSelectAlternativeSlot={handleSelectAlternativeSlot}
            onSelectAlternativeResource={handleSelectAlternativeResource}
            onCancel={() => setCurrentView('booking')}
          />
        );
      case 'return': {
        const targetRes = reservations.find((r) => r.id === activeReturnId) || null;
        return (
          <ReturnView
            reservation={targetRes}
            resources={resources}
            onConfirmReturn={handleConfirmReturn}
            onCancel={() => handleNavigate('my_reservations')}
          />
        );
      }
      case 'edit': {
        const targetRes = reservations.find((r) => r.id === activeEditId) || null;
        return (
          <EditView
            reservation={targetRes}
            resources={resources}
            reservations={reservations}
            onConfirmEdit={handleConfirmEdit}
            onCancel={() => handleNavigate('my_reservations')}
          />
        );
      }
      case 'my_reservations':
      default:
        return (
          <MyReservationsView
            reservations={reservations}
            resources={resources}
            onCancelBooking={handleCancelBooking}
            onInitiateEdit={handleInitiateEdit}
            onInitiateReturn={handleInitiateReturn}
             onInitiateInstantCheckout={(id) => {
               // Optimistic local state update
               setReservations(prev => {
                 const updated = prev.map(r => r.id === id ? { ...r, status: 'in_use' } : r);
                 localStorage.setItem('office_hub_reservations_v1', JSON.stringify(updated));
                 return updated;
               });
               alert('자산 조기 체크아웃 및 사용 개시 처리가 완료되었습니다!');

               // Perform database update in the background
               updateReservationStatus(id, 'in_use').catch((e) => {
                 console.error('Failed to checkout asset:', e);
               });
             }}
            onBookMore={handleOpenNewBooking}
          />
        );
    }
  };

  return (
    <div className="flex bg-gray-50 text-gray-800 min-h-screen font-sans antialiased overflow-x-hidden">
      {/* Persistant Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenNewBooking={handleOpenNewBooking}
      />

      {/* Main Container Wrapper */}
      <div className="flex-1 ml-[280px] flex flex-col relative h-full">
        {/* Dynamic Header Block */}
        <Header onSearchChange={setSearchTerm} searchTerm={searchTerm} />

        {/* Core view section rendered inside card viewports */}
        <main className="flex-1 w-full relative">
          {renderMainView()}
        </main>
      </div>
    </div>
  );
}
