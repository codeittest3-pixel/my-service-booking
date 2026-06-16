import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  Timestamp, 
  getDocs
} from 'firebase/firestore';
import { Reservation } from './types';
import { defaultReservations } from './data';

const COLLECTION_NAME = 'reservations_v2';

// Seeds default reservations if database is empty
export async function seedReservationsIfNeeded(): Promise<void> {
  console.log('Checking if seeding is needed...');
  const ref = collection(db, COLLECTION_NAME);
  try {
    const snapshot = await getDocs(ref);
    console.log('Seeding check: snapshot docs size =', snapshot.size);
    if (snapshot.empty) {
      console.log('Database is empty. Seeding default reservations...');
      for (const [index, res] of defaultReservations.entries()) {
        console.log(`Seeding reservation ${index}: ${res.id}`);
        // Convert mock data to fit firestore document format
        const resDoc = doc(db, COLLECTION_NAME, res.id);
        await setDoc(resDoc, {
          id: res.id,
          resourceId: res.resourceId,
          date: res.date,
          startTime: res.startTime,
          endTime: res.endTime,
          purpose: res.purpose,
          status: res.status,
          notes: res.notes || '',
          attendees: res.attendees || 8,
          createdAt: serverTimestamp()
        });
        console.log(`Reservation ${res.id} seeded.`);
      }
      console.log('Default reservations seeded successfully.');
    } else {
      console.log('Database not empty, no seeding needed.');
    }
  } catch (error) {
    console.error('Error seeding default reservations:', error);
  }
}

// Subscribes to reservations list in real-time
export function subscribeReservations(
  onUpdate: (reservations: Reservation[]) => void,
  onError?: (error: Error) => void
): () => void {
  // Try to seed initial data first asynchronously
  seedReservationsIfNeeded().catch(err => console.error("Seeding failed", err));

  const ref = collection(db, COLLECTION_NAME);
  const q = query(ref);
  
  console.log("Subscribing to reservations...");

  return onSnapshot(q, (snapshot) => {
    console.log("Snapshot received, number of docs:", snapshot.size);
    const reservations: Reservation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      
      // Determine creation time safely
      let createdAtStr = new Date().toISOString();
      if (data.createdAt instanceof Timestamp) {
        createdAtStr = data.createdAt.toDate().toISOString();
      }

      reservations.push({
        id: docSnap.id,
        resourceId: data.resourceId || '',
        date: data.date || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        purpose: data.purpose || '',
        status: data.status || 'confirmed',
        notes: data.notes || '',
        attendees: data.attendees || 8,
        createdAt: createdAtStr
      } as Reservation);
    });
    onUpdate(reservations);
  }, (error) => {
    if (onError) {
      onError(error);
    }
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  });
}

// Add a new reservation
export async function createReservation(res: Omit<Reservation, 'createdAt'>): Promise<void> {
  const path = `${COLLECTION_NAME}/${res.id}`;
  try {
    console.log('Attempting to create reservation doc:', res.id);
    const docRef = doc(db, COLLECTION_NAME, res.id);
    await setDoc(docRef, {
      id: res.id,
      resourceId: res.resourceId,
      date: res.date,
      startTime: res.startTime,
      endTime: res.endTime,
      purpose: res.purpose,
      status: res.status,
      notes: res.notes || '',
      attendees: res.attendees || 8,
      createdAt: serverTimestamp()
    });
    console.log('Reservation doc created successfully:', res.id);
  } catch (error) {
    console.error('Failed to create reservation in Firestore, error:', error);
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Update schedule of an existing reservation
export async function updateReservationSchedule(
  id: string, 
  data: { date: string; startTime: string; endTime: string }
): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Set reservation status (cancelled, in_use, completed)
export async function updateReservationStatus(
  id: string,
  status: Reservation['status'],
  notes?: string
): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Partial<Reservation> = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
