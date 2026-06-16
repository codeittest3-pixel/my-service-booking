import React, { useState } from 'react';
import { ArrowLeft, Clock, Info, Hammer, CheckSquare, Sparkles, HelpCircle } from 'lucide-react';
import { Resource, Reservation } from '../types';
import { formatKoreanDate } from '../utils';

interface ReturnViewProps {
  reservation: Reservation | null;
  resources: Resource[];
  onConfirmReturn: (reservationId: string, notes: string) => void;
  onCancel: () => void;
}

export default function ReturnView({
  reservation,
  resources,
  onConfirmReturn,
  onCancel
}: ReturnViewProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [reportNotes, setReportNotes] = useState<string>('');

  if (!reservation) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-gray-500 mt-16 text-left">
        반납을 조율할 예약 정보를 찾지 못했습니다.
        <button onClick={onCancel} className="mt-4 block text-blue-600 font-bold mx-auto cursor-pointer">
          돌아가기
        </button>
      </div>
    );
  }

  const resource = resources.find((r) => r.id === reservation.resourceId);
  const resourceName = resource ? resource.name : 'MacBook Pro 16"';
  const resourceTag = resource ? resource.tag : 'AST-2023-041';
  const resourceImage = resource?.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400';

  const friendlySchedule = `오늘 ${reservation.startTime} - ${reservation.endTime} 사용`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) return;
    onConfirmReturn(reservation.id, reportNotes);
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6 pb-20 animate-fade-in mt-16 text-left">
      {/* Transactional Minimal Sub-Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-150 pb-4">
        <button
          onClick={onCancel}
          className="mr-2 text-gray-500 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-all shrink-0 cursor-pointer"
          title="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">자산 반납 피드백</h1>
          <p className="text-xs text-gray-400 mt-0.5">대여 완료 후 기기를 원위치에 수납하고 체크리스트를 점검하십시오.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Asset Info Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Asset Photo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 relative shadow-sm">
              <img
                src={resourceImage}
                alt={resourceName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Meta details */}
            <div className="flex flex-col gap-1 flex-1">
              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded w-max">
                대여 자산번호: #{resourceTag}
              </span>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight mt-1">{resourceName}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1 select-none">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs font-semibold">{friendlySchedule}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Mandatory checklist slide toggle container */}
          <div className="flex flex-col gap-4 bg-blue-50/20 p-5 rounded-2xl border border-blue-100/50">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">물품을 올바른 제자리에 정돈하셨나요?</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed font-semibold">
                    사내 다음 임직원을 위해 보관 보관함에 주파수 충전선 코드를 바로 거치하고 거치 위치를 전원 투입하셔야 합니다.
                  </p>
                </div>
                
                {/* Standard custom Slide Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="confirm-toggle"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Issue reporting */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-gray-900 flex items-center gap-2 pl-1 select-none" htmlFor="return-issues">
            <Hammer className="w-4 h-4 text-amber-500 shrink-0" />
            <span>운영팀이나 총무팀에 자산 수리/이슈 제보가 있으신가요?</span>
          </label>
          <p className="text-xs text-gray-400 pl-1">
            기기 파손, 구성품(케이블, 마우스 등) 분실, 인화 문제 등 기술적인 비정상 상태를 솔직히 공유해 주시면 사내 유지 보수에 신속히 반영됩니다. (선택)
          </p>
          <textarea
            id="return-issues"
            value={reportNotes}
            onChange={(e) => setReportNotes(e.target.value)}
            rows={4}
            placeholder="예: 오른쪽 휠 클릭 및 연결 상태가 때에 따라 약간 헐겁거나 원활하지 않습니다."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-y transition-shadow placeholder:text-gray-450"
          />
        </div>

        {/* Section 3: Final action confirmation */}
        <div className="pt-2">
          {isChecked ? (
            <button
              type="submit"
              className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ease-out shadow-xs cursor-pointer hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              id="return-submit-btn-active"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>최종 반납 확정하기</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full h-14 bg-gray-100 text-gray-400 border border-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
              id="return-submit-btn-disabled"
              title="물품 거치 및 정위치 체크에 먼저 동의해 주세요."
            >
              <span>반납 확인 서명 필요 (체크리스트 동의)</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
