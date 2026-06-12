import { Reservation, Resource } from './types';

// Check if two time periods overlap on the same date
// times are in format "HH:MM"
export function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const [h1s, m1s] = start1.split(':').map(Number);
  const [h1e, m1e] = end1.split(':').map(Number);
  const [h2s, m2s] = start2.split(':').map(Number);
  const [h2e, m2e] = end2.split(':').map(Number);

  const t1s = h1s * 60 + m1s;
  const t1e = h1e * 60 + m1e;
  const t2s = h2s * 60 + m2s;
  const t2e = h2e * 60 + m2e;

  // Overlap if starting time of one is before ending time of another
  return t1s < t2e && t2s < t1e;
}

// Check if resource has overlap on a specific date for proposed time slot
export function checkCollision(
  resourceId: string,
  date: string,
  startTime: string,
  endTime: string,
  reservations: Reservation[],
  excludeReservationId?: string
): Reservation | null {
  for (const res of reservations) {
    if (res.status === 'cancelled') continue;
    if (res.resourceId === resourceId && res.date === date) {
      if (excludeReservationId && res.id === excludeReservationId) {
        continue;
      }
      if (isTimeOverlapping(startTime, endTime, res.startTime, res.endTime)) {
        return res;
      }
    }
  }
  return null;
}

// Format static dates back to relative representation or high-quality Korean display
export function formatKoreanDate(dateStr: string): string {
  const today = '2026-05-26';
  const tomorrow = '2026-05-27';

  if (dateStr === today) {
    return '오늘';
  }
  if (dateStr === tomorrow) {
    return '내일';
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dow = weekdays[d.getDay()];
      return `${month}월 ${day}일 (${dow})`;
    }
  } catch (e) {
    // Return original if parsing issues
  }
  return dateStr;
}

export function formatFullSchedule(dateStr: string, start: string, end: string): string {
  const koreanDate = formatKoreanDate(dateStr);
  return `${koreanDate} ${start} ~ ${end}`;
}

// Generate alternative time recommendations
export function getAlternateTimes(
  resourceId: string,
  date: string,
  reservations: Reservation[]
): Array<{ start: string; end: string; label: string; recommended?: boolean }> {
  // Let's offer:
  // 1. "12:30 - 14:00"
  // 2. "15:30 - 17:00" (Recommended, after the requested block)
  // 3. "17:00 - 18:30"
  // We can dynamically check if these actually collide; if they don't, list them!
  const proposals = [
    { start: '12:30', end: '14:00', label: '이전 시간' },
    { start: '15:30', end: '17:00', label: '가장 가까운 시간', recommended: true },
    { start: '17:00', end: '18:30', label: '다음 시간' }
  ];

  return proposals.map((p) => {
    const isColliding = !!checkCollision(resourceId, date, p.start, p.end, reservations);
    return {
      start: p.start,
      end: p.end,
      label: p.label,
      recommended: p.recommended,
      available: !isColliding
    };
  }).filter(p => p.available);
}

// Find alternative resources of the SAME type that are free during the conflicting slot
export function getAvailableAlternateResources(
  type: 'room' | 'equipment' | 'vehicle',
  date: string,
  startTime: string,
  endTime: string,
  resources: Resource[],
  reservations: Reservation[],
  currentResourceId: string
): Resource[] {
  return resources.filter((res) => {
    if (res.id === currentResourceId) return false;
    if (res.type !== type) return false;
    // Must NOT have a collision in this slot
    const collision = checkCollision(res.id, date, startTime, endTime, reservations);
    return !collision;
  });
}
