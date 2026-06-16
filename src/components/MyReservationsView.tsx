import React, { useState } from 'react';
import {
  Laptop,
  Presentation,
  Car,
  Video,
  Tv,
  Smartphone,
  Printer,
  Hash,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  MoreVertical,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import { Resource, Reservation, ReservationStatus } from '../types';
import { formatKoreanDate } from '../utils';

interface MyReservationsViewProps {
  reservations: Reservation[];
  resources: Resource[];
  onCancelBooking: (reservationId: string) => void;
  onInitiateEdit: (reservationId: string) => void;
  onInitiateReturn: (reservationId: string) => void;
  onInitiateInstantCheckout: (reservationId: string) => void;
  onBookMore: () => void;
}

export default function MyReservationsView({
  reservations,
  resources,
  onCancelBooking,
  onInitiateEdit,
  onInitiateReturn,
  onInitiateInstantCheckout,
  onBookMore
}: MyReservationsViewProps) {
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Sort reservations: upcoming vs past
  // Today is '2026-05-26'
  const todayDate = '2026-05-26';

  // Upcoming: status is pending, confirmed, or in_use
  const upcomingReservations = reservations.filter(
    (res) => res.status === 'confirmed' || res.status === 'in_use' || res.status === 'pending'
  );

  // Past: status is completed or cancelled
  const pastReservations = reservations.filter(
    (res) => res.status === 'completed' || res.status === 'cancelled'
  );

  const getResourceIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('macbook') || nameLower.includes('laptop')) {
      return <Laptop className="w-5 h-5 text-blue-600" />;
    }
    if (nameLower.includes('차량') || nameLower.includes('스타리아') || nameLower.includes('법인')) {
      return <Car className="w-5 h-5 text-blue-600" />;
    }
    if (nameLower.includes('카메라') || nameLower.includes('webcam') || nameLower.includes('dslr')) {
      return <Video className="w-5 h-5 text-blue-600" />;
    }
    if (nameLower.includes('프로젝터') || nameLower.includes('cinebeam') || nameLower.includes('프린터')) {
      return <Tv className="w-5 h-5 text-blue-600" />;
    }
    return <Presentation className="w-5 h-5 text-blue-600" />;
  };

  const renderStatusBadge = (status: ReservationStatus, isRoom: boolean) => {
    switch (status) {
      case 'in_use':
        return (
          <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
            이용 중
          </span>
        );
      case 'confirmed':
        return isRoom ? (
          <span className="bg-blue-550 bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-blue-200">
            곧 시작
          </span>
        ) : (
          <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded-full border border-indigo-200">
            이용 예정
          </span>
        );
      case 'completed':
        return (
          <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2.5 py-1 rounded">
            반납 완료
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-50 text-red-750 text-red-600 font-bold text-[10px] px-2.5 py-1 rounded">
            취소됨
          </span>
        );
      default:
        return (
          <span className="bg-yellow-50 text-yellow-800 font-bold text-[10px] px-2.5 py-1 rounded">
            대기 중
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in mt-16 max-w-5xl mx-auto w-full p-6 text-left">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">내 예약 조회</h1>
          <p className="text-sm text-gray-500 mt-0.5">사내 비품 대여 및 예약 정보의 이력 취소를 손쉽게 관리해 보세요.</p>
        </div>
        <button
          onClick={onBookMore}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          신규 대여 예약 탭 이동
        </button>
      </div>

      {/* Section 1: Upcoming Reservations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-base font-extrabold text-gray-900">다가오는 예약 신청 내역</h2>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
            총 {upcomingReservations.length}건 대기 중
          </span>
        </div>

        {upcomingReservations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-300" />
            <p className="text-xs">이용 예정 중인 사내 회의실 또는 공용 비품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {upcomingReservations.map((res) => {
              const resource = resources.find((r) => r.id === res.resourceId);
              if (!resource) return null;

              const isRoomItem = resource.type === 'room';
              const isMacBook = resource.id === 'equip-1';

              return (
                <div
                  key={res.id}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all"
                >
                  <div>
                    {/* Header: Icon, Name Badge */}
                    <div className="flex justify-between items-start gap-4 mb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center shrink-0">
                          {getResourceIcon(resource.name)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1.5">
                            {resource.name}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-mono font-bold flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" /> ID: {resource.tag}
                          </p>
                        </div>
                      </div>
                      {renderStatusBadge(res.status, isRoomItem)}
                    </div>

                    {/* Details Box */}
                    <div className="bg-gray-50 border border-gray-150/60 rounded-xl p-4.5 mb-5 space-y-2.5 text-xs">
                      {isRoomItem ? (
                        <>
                          <div className="flex items-center gap-2.5 text-gray-800">
                            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="font-semibold">
                              {formatKoreanDate(res.date)} {res.startTime} - {res.endTime} ({res.startTime === '14:00' ? '1시간 30분' : '대화 설정'})
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 text-gray-500 pl-0.5">
                            <Users className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>참석 규모: {res.attendees || 8}명 예상 (장비 설치 요청됨)</span>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[10px] text-gray-400 font-bold mb-0.5">대여 일시</span>
                            <span className="font-semibold text-gray-800 font-mono">
                              {formatKoreanDate(res.date)} {res.startTime}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-gray-400 font-bold mb-0.5">반납 예정</span>
                            <span className="font-semibold text-gray-800 font-mono">
                              {formatKoreanDate(res.date)} {res.endTime}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 mt-auto select-none">
                    <button
                      onClick={() => setCancelTargetId(res.id)}
                      className="font-bold text-xs text-red-600 hover:bg-red-50 hover:text-red-700 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                      id={`cancel-booking-btn-${res.id}`}
                    >
                      취소
                    </button>
                    <button
                      onClick={() => onInitiateEdit(res.id)}
                      className="font-bold text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                      id={`edit-booking-btn-${res.id}`}
                    >
                      시간 변경
                    </button>

                    {/* Returning equipment */}
                    {isRoomItem ? (
                      <button
                        onClick={() => {
                          if (confirm('대회의실 회의 및 사용이 완전히 오프라인 종료되었습니까?')) {
                            alert('예약이 정상 사용 종료되었습니다!');
                            onCancelBooking(res.id); // Cancel/complete
                          }
                        }}
                        className="font-bold text-xs bg-gray-50 text-gray-400 border border-gray-200 px-5 py-2.5 rounded-lg cursor-not-allowed"
                        id={`complete-room-btn-${res.id}`}
                      >
                        사용 종료
                      </button>
                    ) : (
                      <button
                        onClick={() => onInitiateReturn(res.id)}
                        className="font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-all shadow-xs cursor-pointer"
                        id={`return-equip-btn-${res.id}`}
                      >
                        반납하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Past Reservations History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-base font-extrabold text-gray-900">지난 예약 내역 히스토리</h2>
          <span className="text-[11px] font-bold text-gray-400">사내 보관 기간 정책에 의해 자동 보관</span>
        </div>

        {pastReservations.length === 0 ? (
          <p className="text-xs text-gray-400">지난 사용 이력이 존재하지 않습니다.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {pastReservations.map((res) => {
              const resource = resources.find((r) => r.id === res.resourceId);
              if (!resource) return null;

              const isCompleted = res.status === 'completed';

              return (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 rounded-xl border border-gray-200/70 hover:border-gray-300 transition-colors group cursor-default shadow-xs"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      {getResourceIcon(resource.name)}
                    </div>
                    <div className="text-left truncate min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {resource.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold tracking-tight mt-1 font-mono">
                        {formatKoreanDate(res.date)} &middot; {res.startTime} - {res.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}
                    >
                      {isCompleted ? '사용 완료' : '취소됨'}
                    </span>
                    <button
                      className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={() => alert(`이력 정보: [${resource.name}] ${res.purpose}`)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Custom Reservation Cancel Confirmation Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCancelTargetId(null)}
          />
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-150 shadow-2xl relative z-10 animate-fade-in text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight mb-2">
              정말 예약을 취소하시겠습니까?
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              취소한 예약 정보는 목록에서 완전히 삭제되며 다시 되돌릴 수 없습니다.
            </p>
            
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setCancelTargetId(null)}
                className="flex-1 font-bold text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancelBooking(cancelTargetId);
                  setCancelTargetId(null);
                }}
                className="flex-1 font-bold text-xs bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
