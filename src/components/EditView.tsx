import React, { useState, useEffect } from 'react';
import { X, Info, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Resource, Reservation } from '../types';
import { formatKoreanDate, checkCollision } from '../utils';

interface EditViewProps {
  reservation: Reservation | null;
  resources: Resource[];
  reservations: Reservation[];
  onConfirmEdit: (reservationId: string, updatedData: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  onCancel: () => void;
}

export default function EditView({
  reservation,
  resources,
  reservations,
  onConfirmEdit,
  onCancel
}: EditViewProps) {
  const [newDate, setNewDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isConflicting, setIsConflicting] = useState<boolean>(false);

  // Load reservation data upon open
  useEffect(() => {
    if (reservation) {
      setNewDate(reservation.date);
      setStartTime(reservation.startTime);
      setEndTime(reservation.endTime);
    }
  }, [reservation]);

  if (!reservation) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-gray-500 mt-16 text-left">
        수정할 예약 정보를 조회할 수 없습니다.
        <button onClick={onCancel} className="mt-4 block text-blue-600 font-bold mx-auto cursor-pointer">
          돌아가기
        </button>
      </div>
    );
  }

  const resource = resources.find((r) => r.id === reservation.resourceId);
  const resourceName = resource ? resource.name : '대여 자산';
  const originalSchedule = `${formatKoreanDate(reservation.date)} ${reservation.startTime} - ${reservation.endTime}`;

  // Live dynamic constraint validation matching Screen 6
  useEffect(() => {
    if (!newDate || !startTime || !endTime) return;

    // Check if start hour >= end hour
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if ((sh * 60 + sm) >= (eh * 60 + em)) {
      setIsConflicting(true);
      return;
    }

    // Check collision with other reservations (exclude current reservation itself!)
    const collision = checkCollision(
      reservation.resourceId,
      newDate,
      startTime,
      endTime,
      reservations,
      reservation.id
    );

    setIsConflicting(!!collision);
  }, [newDate, startTime, endTime, reservation, reservations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConflicting) return;

    onConfirmEdit(reservation.id, {
      date: newDate,
      startTime,
      endTime
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6 pb-20 animate-fade-in mt-16 text-left">
      <main className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header Block and original item reference */}
        <header className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">예약 수정</h1>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-0.5">변경 진행 중인 대상</p>
              <p className="text-xs font-bold text-gray-900">{resourceName}</p>
              <p className="text-[10px] text-gray-500 mt-1 font-semibold">기접수 일정: {originalSchedule}</p>
            </div>
          </div>
        </header>

        {/* Edit fields form */}
        <form onSubmit={handleSubmit} id="edit-reservation-form" className="p-6 space-y-6">
          {/* New Date Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 pl-1" htmlFor="new-date">
              변경 시각 날짜 선택
            </label>
            <div className="relative">
              <input
                type="date"
                id="new-date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 font-semibold text-xs text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none cursor-pointer"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Time pickers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Start time */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 pl-1" htmlFor="start-time">
                새로운 시작 시간
              </label>
              <div className="relative font-bold text-xs">
                <input
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none cursor-pointer"
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* End time - has error styles if conflicting, matching mockup Screen 6 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 pl-1" htmlFor="end-time">
                새로운 종료 시간
              </label>
              <div className="relative font-bold text-xs">
                <input
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full rounded-xl p-3.5 pl-11 focus:ring-2 transition-all outline-none cursor-pointer ${
                    isConflicting
                      ? 'bg-red-50 border-2 border-red-500 text-red-900 focus:ring-red-100'
                      : 'bg-gray-50 border border-gray-200 focus:ring-blue-100 focus:border-blue-500 text-gray-800'
                  }`}
                />
                <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  isConflicting ? 'text-red-500' : 'text-gray-400'
                }`} />
              </div>

              {/* Error warning tag matching Screen 6 */}
              {isConflicting && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 animate-pulse pl-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <p className="text-[11px] font-bold">해당 시간대는 선점되었거나 이미 예약 중입니다.</p>
                </div>
              )}
            </div>

          </div>
        </form>

        {/* Footer buttons */}
        <footer className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 select-none">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl font-bold text-xs text-gray-500 bg-white hover:bg-gray-150 border border-gray-205 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            form="edit-reservation-form"
            disabled={isConflicting}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs text-white shadow-xs transition-all ${
              isConflicting
                ? 'bg-gray-300 cursor-not-allowed opacity-60'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
            id="edit-confirm-btn"
          >
            수정 완료
          </button>
        </footer>
      </main>
    </div>
  );
}
