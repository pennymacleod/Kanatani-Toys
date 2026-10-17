// Opening hours, shared by the Find Us page and the Google structured data.
// Tue–Sat are fixed. Sunday is open every other week: OPEN_SUNDAY_ANCHOR is a
// known open Sunday and every second Sunday after (or before) it is open too.
export const OPEN_SUNDAY_ANCHOR = { year: 2026, month: 10, day: 18 };

export const HOURS = [
  { day: 'Monday',    open: null,    close: null },
  { day: 'Tuesday',   open: '11:00', close: '17:00' },
  { day: 'Wednesday', open: '11:00', close: '17:00' },
  { day: 'Thursday',  open: '11:00', close: '17:00' },
  { day: 'Friday',    open: '11:00', close: '17:00' },
  { day: 'Saturday',  open: '11:00', close: '17:00' },
  { day: 'Sunday',    open: '12:00', close: '15:00', alternate: true },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// The current moment as UK wall-clock time, so "open now" is right for visitors
// in any timezone. Returns a Date whose local fields read as the time in the UK.
export function shopTime(date = new Date()) {
  const parts = {};
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date).forEach(p => { parts[p.type] = p.value; });
  return new Date(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
}

function dayNumber(date) {
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

const ANCHOR_DAY = Math.round(
  Date.UTC(OPEN_SUNDAY_ANCHOR.year, OPEN_SUNDAY_ANCHOR.month - 1, OPEN_SUNDAY_ANCHOR.day) / DAY_MS
);

// True if this date is a Sunday the shop is open.
export function isOpenSunday(date) {
  if (date.getDay() !== 0) return false;
  const weeks = (dayNumber(date) - ANCHOR_DAY) / 7;
  return Math.abs(weeks % 2) === 0;
}

// The next open Sunday on or after `from` (today counts).
export function nextOpenSunday(from) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  if (!isOpenSunday(d)) d.setDate(d.getDate() + 7);
  return d;
}

export function hoursFor(date) {
  const entry = HOURS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  if (entry.alternate && !isOpenSunday(date)) return { ...entry, open: null, close: null };
  return entry;
}

export function isOpenNow(date) {
  const today = hoursFor(date);
  if (!today.open) return false;
  const [oh, om] = today.open.split(':').map(Number);
  const [ch, cm] = today.close.split(':').map(Number);
  const current = date.getHours() * 60 + date.getMinutes();
  return current >= oh * 60 + om && current < ch * 60 + cm;
}
