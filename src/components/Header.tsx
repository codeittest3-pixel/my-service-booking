import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Check, CheckCheck, Info, FileText, X } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

interface Alarm {
  id: string;
  category: 'booking' | 'system' | 'guide';
  message: string;
  time: string;
  isRead: boolean;
}

const INITIAL_ALARMS: Alarm[] = [
  {
    id: 'alarm-1',
    category: 'booking',
    message: '오늘 오후 14:00 - 15:30 대회의실 A 예약 일정이 시작됩니다.',
    time: '10분 전',
    isRead: false,
  },
  {
    id: 'alarm-2',
    category: 'system',
    message: 'IT 지원팀: 공용 비품 대여 시 구성품(충전기 등)을 꼭 확인하고 반납해 주세요.',
    time: '1시간 전',
    isRead: false,
  },
  {
    id: 'alarm-3',
    category: 'guide',
    message: '새로운 회의실 및 자산 예약 가이드라인이 공지사항에 업로드되었습니다.',
    time: '어제',
    isRead: false,
  }
];

export default function Header({ onSearchChange, searchTerm = '' }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    try {
      const saved = localStorage.getItem('office_hub_alarms_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignored
    }
    return INITIAL_ALARMS;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Persist alarms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('office_hub_alarms_v1', JSON.stringify(alarms));
    } catch (e) {
      // Ignored
    }
  }, [alarms]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasUnread = alarms.some((alarm) => !alarm.isRead);
  const unreadCount = alarms.filter((alarm) => !alarm.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, isRead: true } : alarm))
    );
  };

  const handleMarkAllAsRead = () => {
    setAlarms((prev) => prev.map((alarm) => ({ ...alarm, isRead: true })));
  };

  const handleRemoveAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 w-[calc(100%-280px)] z-10 flex items-center justify-between px-6">
      {/* Search Input on Desktop Left */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center bg-gray-50 hover:bg-gray-100 focus-within:bg-white border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 rounded-full px-4 py-1.5 w-72 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="회의실 또는 비품 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder:text-gray-400 p-0 focus:ring-0"
          />
        </div>
      </div>

      {/* Global Actions Block */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" ref={dropdownRef}>
          {/* Notifications Button & Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all relative cursor-pointer"
              id="header-notification-btn"
              title="알람 목록"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown Grid */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-92 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 animate-fade-in divide-y divide-gray-100 py-1">
                {/* Dropdown Header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">알림 목록</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 font-extrabold px-1.5 py-0.5 rounded-full border border-red-100">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {hasUnread && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 p-1 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* Dropdown Body */}
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                  {alarms.length === 0 ? (
                    <div className="py-10 px-4 text-center flex flex-col items-center justify-center text-gray-400">
                      <Bell className="w-8 h-8 opacity-40 mb-2" />
                      <p className="text-xs">수신된 알림이 없습니다.</p>
                    </div>
                  ) : (
                    alarms.map((alarm) => (
                      <div
                        key={alarm.id}
                        onClick={() => handleMarkAsRead(alarm.id)}
                        className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                          !alarm.isRead ? 'bg-blue-50/20' : ''
                        }`}
                      >
                        {/* Category Symbol */}
                        <div className="mt-0.5 shrink-0">
                          {alarm.category === 'booking' ? (
                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                              <FileText className="w-4 h-4" />
                            </div>
                          ) : alarm.category === 'system' ? (
                            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                              <Info className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Text and Info */}
                        <div className="flex-1 text-left min-w-0">
                          <p
                            className={`text-xs leading-relaxed break-all ${
                              !alarm.isRead ? 'font-semibold text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {alarm.message}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] text-gray-400 font-medium">{alarm.time}</span>
                            {!alarm.isRead && (
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Side Options Column */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {!alarm.isRead ? (
                            <button
                              onClick={() => handleMarkAsRead(alarm.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              title="읽음 완료"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveAlarm(alarm.id)}
                              className="p-1 text-gray-300 hover:text-red-500 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              title="삭제"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:ring-2 ring-blue-500 transition-all">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe9Wm4AFX7Xsl7Jz9XOoKHzZf3O-iU0ZQXxsxnphvQ6GQUMBSccPsDNVeB5MysZB-j-745i4Tvrt_XwJ6sQV9nJTpWRLxD76AemCTVE64O21M0cXtr-L39yZurdBENeZqSY5AXtoM8xqoFdTWvozMM_1PVLYEF-W8CT7HBNZdtp38jW1Y7Pz_RubmKc62ipqftbiclEdS40Z696vsxA4oZ9DEq05xeXMyjNbbRACwOVn2X5sYYWp_xrxw7myb1x_03_vdkGU8PQw"
              alt="사용자 프로필 아바타"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-none">임직원 (Admin)</span>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">learn@codeit.com</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
