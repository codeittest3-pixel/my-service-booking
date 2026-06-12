import React, { useState } from 'react';
import {
  Laptop,
  Car,
  Video,
  Tv,
  Smartphone,
  Printer,
  ChevronRight,
  MapPin,
  Tag,
  Hash,
  Clock,
  Plus
} from 'lucide-react';
import { Resource, Reservation } from '../types';
import { formatKoreanDate } from '../utils';

interface DashboardViewProps {
  resources: Resource[];
  reservations: Reservation[];
  searchTerm: string;
  onBookResource: (resourceId: string) => void;
  onNavigateToMyReservations: () => void;
}

export default function DashboardView({
  resources,
  reservations,
  searchTerm,
  onBookResource,
  onNavigateToMyReservations
}: DashboardViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'room' | 'equipment' | 'vehicle'>('all');

  // Filter resources based on category and search term
  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'all' || res.type === selectedCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Today is defined as '2026-05-26'
  const todayDate = '2026-05-26';

  // Find active/ongoing bookings (all non-terminal reservation statuses: in_use, confirmed, pending)
  const activeBookings = reservations.filter(
    (res) => res.status === 'in_use' || res.status === 'confirmed' || res.status === 'pending'
  );

  // Helper to map Lucide resource icons
  const renderResourceIcon = (name: string, type: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('macbook') || nameLower.includes('laptop')) {
      return <Laptop className="w-6 h-6" />;
    }
    if (nameLower.includes('차량') || nameLower.includes('스타리아')) {
      return <Car className="w-6 h-6" />;
    }
    if (nameLower.includes('카메라') || nameLower.includes('webcam') || nameLower.includes('dslr')) {
      return <Video className="w-6 h-6" />;
    }
    if (nameLower.includes('프로젝터') || nameLower.includes('cinebeam') || nameLower.includes('cast')) {
      return <Tv className="w-6 h-6" />;
    }
    if (nameLower.includes('test') || nameLower.includes('device') || nameLower.includes('phone')) {
      return <Smartphone className="w-6 h-6" />;
    }
    if (nameLower.includes('프린터') || nameLower.includes('복합기')) {
      return <Printer className="w-6 h-6" />;
    }
    return <Tv className="w-6 h-6" />; // Fallback
  };

  // Check hourly schedule slots (09:00 to 18:00) to see if reserved
  const getResourceStatusForHour = (resourceId: string, hour: number): boolean => {
    // Return true if hour is booked
    return reservations.some((res) => {
      if (res.resourceId !== resourceId || res.date !== todayDate || res.status === 'cancelled') {
        return false;
      }
      const [startHour] = res.startTime.split(':').map(Number);
      const [endHour] = res.endTime.split(':').map(Number);
      return hour >= startHour && hour < endHour;
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in mt-16 max-w-[1200px] w-full mx-auto p-6">
      {/* 2026 Today Indicator Strip */}
      <div className="bg-transparent border border-gray-200 text-gray-900 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm tracking-wide uppercase text-blue-600">Company Notice</h3>
          <p className="text-xs mt-0.5 font-medium text-gray-600">
            총무팀 안내: 반납 마감 시간을 꼭 준수해 주시고 사용 후 지정된 장소나 충전함에 보관해 주세요.
          </p>
        </div>
        <div className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-[11px] font-semibold self-start sm:self-auto select-none">
          기준일 및 시간: 2026-05-26 07:37 UTC
        </div>
      </div>

      {/* Priority 1: Current In-Progress / Scheduled Reservations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>현재 진행 중인 예약</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
              {activeBookings.length}건
            </span>
          </h2>
          <button
            onClick={onNavigateToMyReservations}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            전체 보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            현재 진행 중인 대여 또는 예약이 없습니다. 우측 상단 새 버튼으로 예약을 시작하세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeBookings.slice(0, 4).map((res, index) => {
              const resource = resources.find((r) => r.id === res.resourceId);
              if (!resource) return null;

              const isInUse = res.status === 'in_use';

              return (
                <div
                  key={res.id}
                  onClick={onNavigateToMyReservations}
                  className="bg-white hover:border-blue-300 rounded-xl p-5 flex items-start gap-4 transition-all duration-200 cursor-pointer shadow-sm border-2 border-gray-200 hover:shadow-md group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isInUse ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}
                  >
                    {renderResourceIcon(resource.name, resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-[20px]">
                        {resource.name}
                      </h3>
                      {isInUse ? (
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-bold shrink-0 bg-blue-600 text-white">
                          이용 중
                        </span>
                      ) : res.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-bold shrink-0 bg-yellow-100 text-yellow-800 border border-yellow-200">
                          승인 대기
                        </span>
                      ) : resource.type === 'room' ? (
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-bold shrink-0 bg-blue-100 text-blue-800 border border-blue-200">
                          곧 시작
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-bold shrink-0 bg-indigo-50 text-indigo-700 border border-indigo-200">
                          이용 예정
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-2.5">
                      대여기간: {formatKoreanDate(res.date)} {res.startTime} ~ {res.endTime}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1 shrink-0 font-mono">
                        <Hash className="w-3.5 h-3.5 text-gray-400" /> {resource.tag}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {resource.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Priority 2: Asset Status Overview panel */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">회의실/비품 현황판</h2>
            <p className="text-xs text-gray-500 mt-0.5">원하는 항목의 타임라인을 확인하고 빠른 예약을 실행하세요.</p>
          </div>

          {/* Sub Navigation Category Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto shrink-0 select-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedCategory('room')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'room' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              회의실
            </button>
            <button
              onClick={() => setSelectedCategory('equipment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'equipment' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              공용 비품
            </button>
            <button
              onClick={() => setSelectedCategory('vehicle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'vehicle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              업무용 차량
            </button>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
            검색 결과에 매칭되는 리소스가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => {
              // Find if this resource is currently rented in this minute (2026-05-26 07:37 is standard: between 07 and 18 for instance)
              // Let's check status overall for today
              const isOccupiedRightNow = reservations.some(
                (book) =>
                  book.resourceId === res.id &&
                  book.date === todayDate &&
                  book.status === 'in_use'
              );

              return (
                <div
                  key={res.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div>
                    {/* Header: Icon, Type & Availability Tag */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                        {renderResourceIcon(res.name, res.type)}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isOccupiedRightNow
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}
                      >
                        {isOccupiedRightNow ? '사용 중' : '대여 가능'}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {res.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">{res.spec}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 block" /> {res.location}
                      </p>
                    </div>

                    {/* 항목별 예약 가능 시간 표시 (Today Hourly Status Blocks) */}
                    <div className="mb-5 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" /> 오늘 예약 타임라인 (09시 - 18시)
                        </span>
                      </div>
                      <div className="grid grid-cols-10 gap-1 select-none">
                        {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => {
                          const isBooked = getResourceStatusForHour(res.id, hour);
                          return (
                            <div
                              key={hour}
                              title={`${hour}시 - ${hour + 1}시: ${isBooked ? '예약 불가능(선점됨)' : '예약 가능(비어있음)'}`}
                              className={`h-4 rounded-sm flex flex-col justify-end text-[8px] font-mono font-black text-center pb-0.5 leading-none transition-colors border ${
                                isBooked
                                  ? 'bg-red-200 border-red-300 text-red-800'
                                  : 'bg-green-100 border-green-200 text-green-800'
                              }`}
                            >
                              <span className="block scale-75 opacity-55">{hour}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Immediate reservation quick button */}
                  <div className="pt-2">
                    {res.id === 'equip-2' && isOccupiedRightNow ? (
                      // Matches DSLR disabled scenario exactly
                      <button
                        disabled
                        className="w-full py-2 bg-gray-100 border border-gray-200 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        예약 불가
                      </button>
                    ) : (
                      <button
                        onClick={() => onBookResource(res.id)}
                        className="w-full py-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        예약하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
