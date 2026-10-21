// The cream star medallion from the shop's red counter panel.
export default function Medallion({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden="true">
      <path d="M80 8 C104 8 112 30 106 42 C128 34 152 52 144 78 C152 104 128 124 106 116 C112 130 104 152 80 152 C56 152 48 130 54 116 C32 124 8 104 16 78 C8 52 32 34 54 42 C48 30 56 8 80 8Z" fill="#F3C66A" stroke="#7A5A12" strokeWidth="3" />
      <path d="M80 30 L90 70 L130 80 L90 90 L80 130 L70 90 L30 80 L70 70Z" fill="#2F7D59" />
      <path d="M80 30 L90 70 L80 80Z M130 80 L90 90 L80 80Z M80 130 L70 90 L80 80Z M30 80 L70 70 L80 80Z" fill="#14285E" />
      <path d="M80 30 L80 130 M30 80 L130 80" stroke="#C99A2E" strokeWidth="2" />
    </svg>
  );
}
