import React, { useState } from 'react';
import {
  Laptop,
  Video,
  Smartphone,
  Tv,
  ArrowRight,
  Info,
  CalendarDays,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Resource, Reservation, ResourceType } from '../types';

interface BookingFormViewProps {
  resources: Resource[];
  preselectedResourceId: string | null;
  onConfirmBooking: (bookingData: {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => void;
}

export default function BookingFormView({
  resources,
  preselectedResourceId,
  onConfirmBooking
}: BookingFormViewProps) {
  // Setup standard list to show for quick select
  // If preselected is not in this quick select, we will show all
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    preselectedResourceId || resources[0]?.id || ''
  );

  // Available dates based on standard company calendar
  // 2026-05-26 is Tuesday based on current time
  const dateOptions = [
    { value: '2026-05-26', dayName: '화', dayNum: '26', label: '오늘' },
    { value: '2026-05-27', dayName: '수', dayNum: '27', label: '내일' },
    { value: '2026-05-28', dayName: '목', dayNum: '28', label: '28일' },
    { value: '2026-05-29', dayName: '금', dayNum: '29', label: '29일' },
    { value: '2026-05-30', dayName: '토', dayNum: '30', label: '주말' }
  ];

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].value);
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('12:00');
  const [purpose, setPurpose] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedResource = resources.find((r) => r.id === selectedResourceId);

  // Core submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedResourceId) {
      setErrorMsg('예약할 자산을 선택해 주세요.');
      return;
    }

    // Basic time structure check
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);

    if (startHour >= endHour) {
      setErrorMsg('종료 시간은 시작 시간보다 미래여야 합니다.');
      return;
    }

    onConfirmBooking({
      resourceId: selectedResourceId,
      date: selectedDate,
      startTime,
      endTime,
      purpose: purpose || '기타 업무용 대여'
    });
  };

  const renderResourceOptionIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('macbook') || nameLower.includes('laptop')) {
      return <Laptop className="w-8 h-8 text-blue-600 mb-3" />;
    }
    if (nameLower.includes('webcam') || nameLower.includes('camera')) {
      return <Video className="w-8 h-8 text-blue-600 mb-3" />;
    }
    if (nameLower.includes('device') || nameLower.includes('phone') || nameLower.includes('tablet')) {
      return <Smartphone className="w-8 h-8 text-blue-600 mb-3" />;
    }
    return <Tv className="w-8 h-8 text-blue-600 mb-3" />;
  };

  // Divide resources to show first 3 popular (Macbook, Webcam, Test device) as big cards, and a dropdown for others
  const quickSelectResources = resources.filter(r =>
    ['equip-1', 'equip-4', 'equip-5', 'room-1'].includes(r.id)
  );

  return (
    <div className="max-w-4xl mx-auto w-full p-6 pb-16 animate-fade-in mt-16 text-left">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">자산 예약 생성</h1>
        <p className="text-sm text-gray-500 mt-1">
          대여를 원하시는 회의실 또는 사내 공용 비품 장비를 선택하고 대여 일정을 확정하세요.
        </p>
      </div>

      {/* Main reservation card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8">
        <form onSubmit={handleSubmit} id="booking-form" className="space-y-8">
          
          {/* Step 1: 자산 선택 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                <span>예약 대상 선택</span>
              </h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">필수</span>
            </div>

            {/* Quick Cards select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {quickSelectResources.map((res) => {
                const isSelected = selectedResourceId === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedResourceId(res.id);
                      setErrorMsg('');
                    }}
                    className={`border-2 rounded-xl p-4 cursor-pointer relative transition-all select-none hover:shadow-sm ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-600 font-bold bg-blue-100 rounded-full p-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {renderResourceOptionIcon(res.name)}
                    <h4 className="text-xs font-bold text-gray-900 truncate mb-0.5">{res.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate mb-2">{res.spec}</p>
                    <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded">
                      {res.capacity || '대여 가능'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* General Dropdown Selection for All Resources */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">상세 리소스 리스트에서 직접 선택</label>
              <select
                value={selectedResourceId}
                onChange={(e) => {
                  setSelectedResourceId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="" disabled>-- 예약 대상을 선택하세요 --</option>
                <optgroup label="회의실 자산">
                  {resources.filter(r => r.type === 'room').map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.location}) &middot; {r.spec}</option>
                  ))}
                </optgroup>
                <optgroup label="공용 비품 장비">
                  {resources.filter(r => r.type === 'equipment').map(r => (
                    <option key={r.id} value={r.id}>{r.name} &middot; {r.spec}</option>
                  ))}
                </optgroup>
                <optgroup label="업무용 차량">
                  {resources.filter(r => r.type === 'vehicle').map(r => (
                    <option key={r.id} value={r.id}>{r.name} &middot; {r.location}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Step 2: 일정 선택 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                <span>대여 및 반납 일정 선택</span>
              </h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">필수</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Date quick select */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 pl-1">대여 희망 일자</label>
                <div className="flex gap-2">
                  {dateOptions.map((opt) => {
                    const isDateSelected = selectedDate === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => setSelectedDate(opt.value)}
                        className={`flex-1 border rounded-xl py-3 flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
                          isDateSelected
                            ? 'border-blue-600 bg-blue-50/40 text-blue-600 ring-2 ring-blue-100 font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider mb-0.5">{opt.dayName}</span>
                        <span className="text-base font-extrabold">{opt.dayNum}</span>
                        <span className="text-[9px] opacity-75">{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time inputs */}
              <div className="flex-1 flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-2 pl-1">대여 시작 시간</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock className="w-4 h-4" />
                    </span>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 font-semibold text-xs rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="09:00">오전 09:00</option>
                      <option value="10:00">오전 10:00</option>
                      <option value="11:00">오전 11:00</option>
                      <option value="12:00">오후 12:00 (점심)</option>
                      <option value="13:00">오후 01:00</option>
                      <option value="14:00">오후 02:00</option>
                      <option value="15:00">오후 03:00</option>
                      <option value="16:00">오후 04:00</option>
                      <option value="17:00">오후 05:00</option>
                      <option value="18:00">오후 06:00 (종료)</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-2 pl-1">반납 예정 시간</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock className="w-4 h-4" />
                    </span>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 font-semibold text-xs rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="10:00">오전 10:00</option>
                      <option value="11:00">오전 11:00</option>
                      <option value="12:00">오후 12:00 (점심)</option>
                      <option value="13:00">오후 01:00</option>
                      <option value="14:00">오후 02:00</option>
                      <option value="15:00">오후 03:00</option>
                      <option value="16:00">오후 04:00</option>
                      <option value="17:00">오후 05:00</option>
                      <option value="18:00">오후 06:00 (종료)</option>
                      <option value="19:00">오후 07:00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Step 3: 사용 목적 */}
          <section className="space-y-3">
            <label className="block text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>사용 목적 <span className="text-xs text-gray-400 font-normal ml-1">(선택사항)</span></span>
            </label>
            <p className="text-xs text-gray-400 pl-8">총무팀 감사 및 용도 증빙을 위한 간략한 사유를 기재해 주세요.</p>
            <div className="pl-8">
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                placeholder="예약 목적을 입력해 주세요. (예: 주간 마케팅 프레젠테이션, 제품 시연 미팅룸 셋업 등)"
                className="w-full p-4 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none transition-shadow"
              />
            </div>
          </section>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 flex justify-between items-center bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              <span>중복 예약이 있을 경우, 즉시 다른 시간대와 대체 기기가 제안됩니다.</span>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3.5 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2 hover:gap-3 cursor-pointer"
              id="booking-확정-btn"
            >
              <span>예약 확정하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
