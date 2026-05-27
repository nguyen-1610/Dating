// Empty states — used when a list is empty: no profiles, no matches, no messages.

const EmptyState = ({ kind = 'no-profiles' }) => {
  const variants = {
    'no-profiles': {
      title: 'Hết người rồi 😅',
      sub: 'Bạn đã xem hết người trong khu vực. Mở rộng bộ lọc hoặc quay lại sau 12 giờ nữa nhé.',
      cta: 'Mở rộng khoảng cách',
      cta2: 'Boost profile',
      art: <PaperPlane/>,
    },
    'no-matches': {
      title: 'Chưa có match nào',
      sub: 'Tiếp tục khám phá — đừng dừng. Profile có nhiều ảnh + bio rõ ràng được match nhiều hơn 3 lần.',
      cta: 'Tiếp tục khám phá',
      cta2: 'Chỉnh hồ sơ',
      art: <Hearts/>,
    },
    'no-messages': {
      title: 'Chưa có tin nhắn',
      sub: 'Hãy là người gửi lời chào đầu tiên. Hỏi về sở thích chung trong profile để mở đầu cuộc trò chuyện nhé.',
      cta: 'Xem match mới',
      cta2: null,
      art: <ChatBubbles/>,
    },
  };
  const v = variants[kind];

  return (
    <div style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 32px 120px',
      textAlign: 'center',
      background: 'var(--surface)',
    }}>
      <div style={{ marginBottom: 28 }}>{v.art}</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 26, letterSpacing: '-0.02em',
        color: 'var(--fg-1)', margin: 0,
        lineHeight: 1.1,
      }}>{v.title}</h2>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5,
        color: 'var(--fg-3)', margin: '10px 0 26px',
        maxWidth: 280,
      }}>{v.sub}</p>
      <button style={{
        padding: '14px 32px', borderRadius: 999, border: 'none',
        background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
        color: '#fff', fontFamily: 'var(--font-body)',
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
        boxShadow: 'var(--elev-love)',
        marginBottom: v.cta2 ? 8 : 0,
      }}>{v.cta}</button>
      {v.cta2 && (
        <button style={{
          padding: '12px 24px', borderRadius: 999,
          border: 'none', background: 'transparent',
          color: 'var(--primary)', fontFamily: 'var(--font-body)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{v.cta2}</button>
      )}
    </div>
  );
};

// Illustrations — friendly, brand-colored, SVG.

const PaperPlane = () => (
  <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
    <defs>
      <linearGradient id="ppg" x1="0" y1="0" x2="140" y2="120">
        <stop offset="0%" stopColor="#d6336c" stopOpacity=".15"/>
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".15"/>
      </linearGradient>
      <linearGradient id="ppg2" x1="0" y1="0" x2="100" y2="80">
        <stop offset="0%" stopColor="#d6336c"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    {/* Backing blob */}
    <ellipse cx="70" cy="60" rx="62" ry="50" fill="url(#ppg)"/>
    {/* Dotted curved path */}
    <path d="M 20 90 Q 50 30, 110 50" stroke="var(--outline)" strokeWidth="2" strokeDasharray="3 5" fill="none" strokeLinecap="round"/>
    {/* Plane */}
    <g transform="translate(75, 32) rotate(20)">
      <path d="M 0 0 L 44 14 L 14 18 L 0 0 Z" fill="url(#ppg2)"/>
      <path d="M 14 18 L 22 28 L 30 16 Z" fill="#d6336c" opacity="0.7"/>
    </g>
    {/* Stars */}
    <circle cx="25" cy="35" r="2" fill="#d6336c"/>
    <circle cx="115" cy="85" r="2.5" fill="#8b5cf6"/>
    <circle cx="100" cy="20" r="1.5" fill="#3b82f6"/>
  </svg>
);

const Hearts = () => (
  <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="140" y2="120">
        <stop offset="0%" stopColor="#d6336c" stopOpacity=".15"/>
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".15"/>
      </linearGradient>
      <linearGradient id="hg2" x1="0" y1="0" x2="60" y2="60">
        <stop offset="0%" stopColor="#d6336c"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <ellipse cx="70" cy="60" rx="62" ry="50" fill="url(#hg)"/>
    {/* Big heart center */}
    <path d="M 70 90 C 67 90, 65 88, 63 86 C 56 80, 42 70, 42 56 C 42 49, 47 44, 53 44 C 58 44, 63 47, 70 53 C 77 47, 82 44, 87 44 C 93 44, 98 49, 98 56 C 98 70, 84 80, 77 86 C 75 88, 73 90, 70 90 Z"
      fill="url(#hg2)" opacity="0.9"/>
    {/* Tiny hearts */}
    <path d="M 28 50 c -1 -.4 -1.7 -1, -2.3 -1.7 c -2 -2 -6 -5 -6 -9 c 0 -2, 1.4 -3.7, 3.4 -3.7 c 1.5 0, 3 1, 5 3 c 2 -2, 3.5 -3, 5 -3 c 2 0, 3.4 1.7, 3.4 3.7 c 0 4, -4 7, -6 9 c -.7 .7, -1.3 1.3, -2.3 1.7"
      transform="translate(-3, -5)" fill="#d6336c" opacity="0.7"/>
    <path d="M 110 40 c -.6 -.3, -1.2 -.7, -1.7 -1.2 c -1.5 -1.5, -4.3 -3.5, -4.3 -6.5 c 0 -1.4, 1 -2.6, 2.4 -2.6 c 1 0, 2.2 .7, 3.6 2.1 c 1.4 -1.4, 2.6 -2.1, 3.6 -2.1 c 1.4 0, 2.4 1.2, 2.4 2.6 c 0 3, -2.8 5, -4.3 6.5 c -.5 .5, -1 .9, -1.7 1.2"
      fill="#8b5cf6"/>
    <path d="M 118 80 c -.4 -.2, -.8 -.5, -1.1 -.8 c -1 -1, -3 -2.5, -3 -4.6 c 0 -1, .7 -1.8, 1.7 -1.8 c .7 0, 1.5 .5, 2.4 1.5 c 1 -1, 1.7 -1.5, 2.4 -1.5 c 1 0, 1.7 .8, 1.7 1.8 c 0 2, -2 3.6, -3 4.6 c -.3 .3, -.7 .6, -1.1 .8"
      fill="#3b82f6"/>
  </svg>
);

const ChatBubbles = () => (
  <svg width="140" height="120" viewBox="0 0 140 120" fill="none">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="140" y2="120">
        <stop offset="0%" stopColor="#d6336c" stopOpacity=".15"/>
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".15"/>
      </linearGradient>
      <linearGradient id="cg2" x1="0" y1="0" x2="80" y2="40">
        <stop offset="0%" stopColor="#d6336c"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <ellipse cx="70" cy="60" rx="62" ry="50" fill="url(#cg)"/>
    {/* Left bubble (received) */}
    <path d="M 30 36
             a 14 14 0 0 1 14 -14 l 24 0
             a 14 14 0 0 1 14 14 l 0 14
             a 14 14 0 0 1 -14 14 l -14 0 l -10 8 l 0 -8 l 0 0
             a 14 14 0 0 1 -14 -14 z"
       fill="var(--surface-container)" stroke="var(--outline-variant)" strokeWidth="1.5"/>
    {/* Three dots */}
    <circle cx="46" cy="43" r="3" fill="var(--fg-3)"/>
    <circle cx="56" cy="43" r="3" fill="var(--fg-3)"/>
    <circle cx="66" cy="43" r="3" fill="var(--fg-3)"/>

    {/* Right bubble (sent) */}
    <path d="M 60 80
             a 14 14 0 0 1 14 -14 l 28 0
             a 14 14 0 0 1 14 14 l 0 12
             a 14 14 0 0 1 -14 14 l -22 0 l 0 0 l -10 8 l 0 -8 l 4 0
             a 14 14 0 0 1 -14 -14 z"
       transform="translate(-2, -4)" fill="url(#cg2)"/>
    <path d="M 70 80 L 82 84 L 84 78 L 96 82" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9"/>
    <circle cx="105" cy="78" r="2" fill="#fff" opacity="0.9"/>
  </svg>
);

Object.assign(window, { EmptyState });
