import React from 'react';
import { AlertTriangle, Clock, Presentation, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Resource, Reservation } from '../types';
import { getAlternateTimes, getAvailableAlternateResources, formatKoreanDate } from '../utils';

interface ConflictViewProps {
  conflictData: {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  } | null;
  resources: Resource[];
  reservations: Reservation[];
  onSelectAlternativeSlot: (newStart: string, newEnd: string) => void;
  onSelectAlternativeResource: (alternateResourceId: string) => void;
  onCancel: () => void;
}

export default function ConflictView({
  conflictData,
  resources,
  reservations,
  onSelectAlternativeSlot,
  onSelectAlternativeResource,
  onCancel
}: ConflictViewProps) {
  if (!conflictData) {
    return (
      <div className="max-w-md mx-auto p-12 text-center text-gray-500 mt-16 text-left">
        충돌 세부 정보를 불러올 수 없습니다.
        <button onClick={onCancel} className="mt-4 block text-blue-600 font-bold mx-auto cursor-pointer">
          뒤로 가기
        </button>
      </div>
    );
  }

  const resource = resources.find((r) => r.id === conflictData.resourceId);
  const resourceName = resource ? resource.name : '요청하신 자산';
  const resourceType = resource ? resource.type : 'room';

  const friendlyDate = formatKoreanDate(conflictData.date);

  // Generate dynamic alternative times using helper
  const alternativeTimes = getAlternateTimes(conflictData.resourceId, conflictData.date, reservations);

  // Generate dynamic alternative devices/rooms of same category that are free during the requested block
  const alternativeResources = getAvailableAlternateResources(
    resourceType,
    conflictData.date,
    conflictData.startTime,
    conflictData.endTime,
    resources,
    reservations,
    conflictData.resourceId
  );

  return (
    <div className="max-w-4xl mx-auto w-full p-6 pb-20 animate-fade-in mt-16 text-left">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        자산 예약 폼으로 돌아가기
      </button>

      <div className="flex flex-col gap-8">
        {/* 1. Alert Section */}
        <section className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-red-800 leading-snug mb-1">
              선택하신 시간에는 이미 예약이 있어요
            </h2>
            <p className="text-xs text-red-700 leading-relaxed max-w-2xl font-medium">
              요청하신 <strong className="font-extrabold underline">{resourceName}</strong>의{' '}
              {friendlyDate} {conflictData.startTime} - {conflictData.endTime} 시간대는 다른 사용자가
              먼저 예약했습니다. 아래의 합리적인 시간대 대안이나 다른 동일 기기 추천을 선택해 보세요.
            </p>
          </div>
        </section>

        {/* 2. Alternative Times Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-3">
            <Clock className="text-blue-600 w-5 h-5" />
            <h3 className="text-sm font-extrabold text-gray-900">같은 예약 항목의 다른 시간대 대안</h3>
          </div>

          {alternativeTimes.length === 0 ? (
            <p className="text-xs text-gray-400">당일 해당 자산의 잔여 여유 시간대가 존재하지 않습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alternativeTimes.map((item, index) => {
                if (item.recommended) {
                  return (
                    <div
                      key={index}
                      className="border-2 border-blue-600 bg-blue-50/20 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group select-none shadow-xs"
                    >
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-bl-lg">
                        추천
                      </div>
                      <div className="flex justify-between items-start mt-2">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600">가장 추천하는 슬롯</span>
                          <p className="text-sm font-extrabold text-gray-900 mt-1">{item.start} - {item.end}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      </div>
                      <button
                        onClick={() => onSelectAlternativeSlot(item.start, item.end)}
                        className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-xs cursor-pointer transition-colors text-center"
                        id={`alternate-slot-rec-btn`}
                      >
                        이 시간으로 예약 생성
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="border border-gray-200 hover:border-gray-300 rounded-xl p-5 flex flex-col justify-between bg-gray-50/50 select-none group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded">
                          {item.label}
                        </span>
                        <p className="text-sm font-extrabold text-gray-900 mt-2">{item.start} - {item.end}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectAlternativeSlot(item.start, item.end)}
                      className="w-full mt-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center bg-white"
                      id={`alternate-slot-opt-${index}`}
                    >
                      선택하기
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. Alternative Rooms / Assets Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 pb-3">
            <Presentation className="text-blue-600 w-5 h-5" />
            <h3 className="text-sm font-extrabold text-gray-900">
              요청하신 시간({conflictData.startTime} - {conflictData.endTime})에 바로 대여 가능한 대체 항목
            </h3>
          </div>

          {alternativeResources.length === 0 ? (
            <p className="text-xs text-gray-400">동일 시간대 내에 다른 대체 가능한 동종 자산이 모두 마감되었습니다.</p>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin select-none">
              {alternativeResources.map((altRes) => (
                <div
                  key={altRes.id}
                  className="min-w-[260px] max-w-[260px] border border-gray-200 hover:border-gray-300 rounded-xl p-4 flex flex-col bg-white hover:shadow-xs transition-shadow shrink-0"
                >
                  <div className="h-28 rounded-lg bg-gray-100 mb-3 relative overflow-hidden shrink-0">
                    {altRes.image ? (
                      <img
                        src={altRes.image}
                        alt={altRes.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-blue-700">
                      {altRes.capacity || '대여 가능'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 truncate mb-0.5">{altRes.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium truncate mb-4">{altRes.spec}</p>
                  <button
                    onClick={() => onSelectAlternativeResource(altRes.id)}
                    className="w-full py-2 border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-blue-600 font-bold text-[11px] rounded-lg transition-colors cursor-pointer text-center"
                    id={`alternate-resource-btn-${altRes.id}`}
                  >
                    이 자산으로 즉시 대체 예약
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
