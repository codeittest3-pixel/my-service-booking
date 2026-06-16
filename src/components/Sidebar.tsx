import React from 'react';
import {
  LayoutDashboard,
  Presentation,
  Package,
  CalendarCheck,
  Settings,
  LogOut,
  Megaphone,
  HelpCircle,
  Plus
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenNewBooking: () => void;
}

export default function Sidebar({ currentView, onNavigate, onOpenNewBooking }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] p-4 flex flex-col bg-white border-r border-gray-200 z-20">
      {/* Brand */}
      <div className="mb-8 px-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Presentation className="text-blue-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline-md text-lg font-extrabold text-gray-900 tracking-tight">오피스 허브</h2>
            <p className="text-xs text-gray-500 font-medium">임직원 포털 &middot; Enterprise</p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-2 mb-6">
        <button
          onClick={onOpenNewBooking}
          id="sidebar-new-booking-btn"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          새 예약하기
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="flex-1 space-y-1 px-2">
        <button
          id="nav-tab-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">대시보드</span>
        </button>

        <button
          id="nav-tab-booking"
          onClick={() => onNavigate('booking')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'booking' || currentView === 'conflict' || currentView === 'success'
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">자산 예약</span>
        </button>

        <button
          id="nav-tab-my-reservations"
          onClick={() => onNavigate('my_reservations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'my_reservations' || currentView === 'return' || currentView === 'edit'
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CalendarCheck className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">내 예약 내역</span>
        </button>

        {/* Disabled tab styled beautifully */}
        <div
          title="운영 규칙에 따라 보기 권한이 제한되어 있습니다."
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60"
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">시스템 설정</span>
        </div>
      </nav>

      {/* CTA Footer */}
      <div className="border-t border-gray-100 pt-4 space-y-1">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('공지사항: 오피스 허브 예약 시스템에 오신 것을 환영합니다!');
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Megaphone className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium">공지사항</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('고객지원: 헬프데스크 (내선 1104)로 문의하세요.');
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium">고객지원</span>
        </a>
        <div className="text-[11px] text-gray-400 text-center pt-2 select-none">
          &copy; 2026 오피스 허브 &bull; Codeit
        </div>
      </div>
    </aside>
  );
}
