import { Resource, Reservation } from './types';

export const mockResources: Resource[] = [
  {
    id: 'room-1',
    name: '대회의실 A',
    type: 'room',
    spec: '최대 12인 | 빔프로젝터 완비',
    tag: 'ROOM-001',
    location: '10층 남측 윙',
    capacity: '12인실',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'equip-1',
    name: 'MacBook Pro 16" (M2 Max)',
    type: 'equipment',
    spec: 'M2 Max, 32GB RAM',
    tag: 'AST-2023-041',
    location: 'IT 지원팀 (3층)',
    capacity: '잔여 3대',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'vehicle-1',
    name: '업무용 차량 (스타리아 123가4567)',
    type: 'vehicle',
    spec: '지하 2층 주차장 B구역',
    tag: 'VEH-002',
    location: '지하 2층 주차장 B구역',
    capacity: '대여 가능',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'equip-2',
    name: 'DSLR 카메라 세트',
    type: 'equipment',
    spec: 'Sony Alpha 7 IV | 렌즈 2종',
    tag: 'AST-2023-009',
    location: 'IT 지원팀',
    capacity: '대여 가능',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'equip-3',
    name: '이동식 프로젝터',
    type: 'equipment',
    spec: 'LG CineBeam | 4K 지원',
    tag: 'AST-2023-010',
    location: '대여 기기 보관함',
    capacity: '잔여 1대',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'equip-4',
    name: 'Logitech 4K Webcam',
    type: 'equipment',
    spec: '회의용 고해상도 캠',
    tag: 'AST-2023-012',
    location: '회의실 서랍 B',
    capacity: '잔여 8대',
    image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'equip-5',
    name: 'Test Device Pack',
    type: 'equipment',
    spec: 'iOS & Android 단말기',
    tag: 'AST-2023-015',
    location: '단말기 보관 캐비닛',
    capacity: '잔여 2세트',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'room-2',
    name: 'Boardroom B',
    type: 'room',
    spec: '모니터 포함',
    tag: 'ROOM-002',
    location: '10층 북측 윙',
    capacity: '8인실',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'room-3',
    name: 'Huddle Room 1',
    type: 'room',
    spec: '화상회의 장비',
    tag: 'ROOM-003',
    location: '9층 서측 윙',
    capacity: '4인실',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'room-4',
    name: 'Training Room Alpha',
    type: 'room',
    spec: '프로젝터 포함',
    tag: 'ROOM-004',
    location: '8층 대강당 옆',
    capacity: '12인실',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'room-5',
    name: '회의실 C (소회의실)',
    type: 'room',
    spec: '4인실 | 화이트보드 완비',
    tag: 'ROOM-005',
    location: '9층 중앙',
    capacity: '4인실'
  },
  {
    id: 'equip-6',
    name: '컬러 레이저 프린터',
    type: 'equipment',
    spec: '고속 양면 인쇄 | 10층 복도 복합기',
    tag: 'AST-2023-088',
    location: '10층 복도 구역',
    capacity: '사용 가능'
  }
];

export const defaultReservations: Reservation[] = [
  {
    id: 'res-1',
    resourceId: 'equip-1', // MacBook Pro 16"
    date: '2026-05-26', // Today
    startTime: '09:00',
    endTime: '18:00',
    purpose: '개발 프로젝트 긴급 테스팅 지원',
    status: 'in_use'
  },
  {
    id: 'res-2',
    resourceId: 'vehicle-1', // 업무용 차량
    date: '2026-05-27', // Tomorrow
    startTime: '10:00',
    endTime: '15:00',
    purpose: '외근 및 클라이언트 부지 방문 미팅',
    status: 'confirmed'
  },
  {
    id: 'res-3',
    resourceId: 'room-1', // 대회의실 A
    date: '2026-05-26', // Today
    startTime: '14:00',
    endTime: '15:30',
    purpose: '총무팀 신규 정책 연간 기획 회의',
    status: 'confirmed',
    attendees: 8
  },
  {
    id: 'res-4',
    resourceId: 'room-5', // 회의실 C
    date: '2026-05-20', // Past
    startTime: '10:00',
    endTime: '11:00',
    purpose: '개발팀 데일리 스탠드업',
    status: 'completed'
  },
  {
    id: 'res-5',
    resourceId: 'equip-6', // 컬러 레이저 프린터
    date: '2026-05-18', // Past
    startTime: '14:00',
    endTime: '16:00',
    purpose: '사업 계획서 대외비 인쇄',
    status: 'completed'
  },
  {
    id: 'res-6',
    resourceId: 'vehicle-1', // 업무용 차량
    date: '2026-05-10', // Past
    startTime: '09:00',
    endTime: '18:00',
    purpose: '지방 지사 기술 미팅 지원',
    status: 'cancelled'
  }
];

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];
