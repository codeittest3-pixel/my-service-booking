import React from 'react';
import { CheckCircle2, ArrowRight, Info, RotateCcw } from 'lucide-react';
import { Resource, Reservation } from '../types';
import { formatFullSchedule } from '../utils';

interface SuccessViewProps {
  lastReservation: Reservation | null;
  resources: Resource[];
  onNavigateToMyReservations: () => void;
  onBookMore: () => void;
}

export default function SuccessView({
  lastReservation,
  resources,
  onNavigateToMyReservations,
  onBookMore
}: SuccessViewProps) {
  if (!lastReservation) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-gray-500 mt-16">
        예약 정보를 불러올 수 없습니다. 다시 시도해 주세요.
      </div>
    );
  }

  const resource = resources.find((r) => r.id === lastReservation.resourceId);
  const resourceName = resource ? resource.name : '사내 공용 자산';
  const resourceLocation = resource ? ` (${resource.location})` : '';

  const scheduleText = formatFullSchedule(
    lastReservation.date,
    lastReservation.startTime,
    lastReservation.endTime
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 mt-16 pb-24 text-left animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm max-w-2xl w-full p-8 md:p-10 flex flex-col items-center relative overflow-hidden">
        {/* Sky blue gradient top decorative background overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

        {/* Top Success Header Banner */}
        <div className="flex flex-col items-center text-center z-10 w-full">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100">
            <CheckCircle2 className="w-9 h-9 text-blue-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">예약이 확정되었습니다</h2>
          <p className="text-xs text-gray-400 font-medium max-w-sm">
            요청하신 회의실 / 기기 예약 요청이 시스템에 올바르게 처리되었습니다.
          </p>

          {/* Core Booking Details Box */}
          <div className="bg-gray-50 rounded-2xl p-5 w-full border border-gray-100 mt-8 mb-8 flex flex-col gap-3.5 text-left">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-200/60">
              <span className="text-[11px] font-bold text-gray-400 uppercase">예약 항목</span>
              <span className="text-sm font-extrabold text-gray-900 select-all">
                {resourceName}
                <span className="text-xs text-blue-600 font-bold ml-1">{resourceLocation}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase">예약 일시</span>
              <span className="text-xs font-semibold text-gray-800 font-mono">
                {scheduleText}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center z-10 mb-8 max-w-md">
          <button
            onClick={onNavigateToMyReservations}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors shadow-xs flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
            id="success-my-list-btn"
          >
            <span>내 예약 목록으로 가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onBookMore}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors border border-gray-200 flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
            id="success-book-more-btn"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
            <span>추가 예약하기</span>
          </button>
        </div>

        {/* Compliance Warning Section */}
        <div className="w-full bg-amber-50/50 rounded-xl p-4 border border-amber-100/60 z-10 flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              <strong className="text-gray-900 font-bold block mb-0.5">매너 반납 &amp; 마감시간 정돈</strong>
              다음 사용자를 위해 예약 사용 종료 정각 5분 전까지 정리 정돈 및 기기 반납 접수를 완료해 주십시오.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              대여 기기는 사용을 모두 마친 후 반드시 지정된 보관 수납함에 거치하고 전원 충전선을 연결해 주셔야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
