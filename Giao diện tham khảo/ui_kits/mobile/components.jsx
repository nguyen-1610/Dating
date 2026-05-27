// Shared bits used by every UniDate screen.
// Loaded BEFORE the screen files. Exports to window so screens can use them.

const Icon = ({ name, size = 24, fill = 0, weight = 500, color = 'currentColor', style = {} }) => (
  <span className="msr" style={{
    fontSize: size,
    color,
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}`,
    userSelect: 'none',
    ...style,
  }}>{name}</span>
);

// University badge — light-on-photo and tonal variants
const UniBadge = ({ code = 'HCMUS', label, variant = 'tonal' }) => {
  const styles = variant === 'glass' ? {
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    backdropFilter: 'blur(10px) saturate(160%)',
    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
  } : {
    background: 'var(--tertiary-container)',
    color: 'var(--on-tertiary-container)',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px 3px 4px',
      borderRadius: 999,
      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
      ...styles,
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: variant === 'glass' ? 'rgba(255,255,255,0.85)' : 'var(--tertiary)',
        color: variant === 'glass' ? 'var(--tertiary)' : '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 800, letterSpacing: 0,
      }}>{code}</span>
      {label}
    </span>
  );
};

// Gradient initials avatar
const Avatar = ({ initial = 'A', size = 40, gradient, online = false, ring = false }) => {
  const gradients = [
    'linear-gradient(180deg, #c4b5fd, #d6336c)',
    'linear-gradient(180deg, #93c5fd, #8b5cf6)',
    'linear-gradient(180deg, #fbbf24, #d6336c)',
    'linear-gradient(180deg, #06b6d4, #3b82f6)',
    'linear-gradient(180deg, #34d399, #06b6d4)',
    'linear-gradient(180deg, #fcd34d, #f97316)',
  ];
  const g = gradient || gradients[(initial.charCodeAt(0) || 0) % gradients.length];
  return (
    <div style={{ position: 'relative', flex: '0 0 auto' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: g,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: size * 0.12,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: size * 0.42,
        ...(ring ? { boxShadow: '0 0 0 2.5px #fff, 0 0 0 5px var(--love-60)' } : {}),
      }}>{initial}</div>
      {online && (
        <div style={{
          position: 'absolute', right: 0, bottom: 0,
          width: Math.max(10, size * 0.28), height: Math.max(10, size * 0.28),
          borderRadius: '50%',
          background: 'var(--success)',
          border: '2.5px solid #fff',
        }}/>
      )}
    </div>
  );
};

const BottomNav = ({ active = 'discover', onChange = () => {}, badges = {} }) => {
  const items = [
    { id: 'discover', label: 'Khám phá', icon: 'whatshot' },
    { id: 'matches', label: 'Match', icon: 'favorite' },
    { id: 'feed', label: 'Feed', icon: 'dynamic_feed' },
    { id: 'events', label: 'Sự kiện', icon: 'event' },
    { id: 'profile', label: 'Hồ sơ', icon: 'person' },
  ];
  return (
    <nav style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28,
      background: 'var(--surface)',
      borderTop: '1px solid var(--outline-variant)',
      display: 'flex',
      paddingTop: 6,
      zIndex: 30,
    }}>
      {items.map(item => {
        const isActive = active === item.id;
        const hasBadge = badges[item.id];
        return (
          <button key={item.id} onClick={() => onChange(item.id)} style={{
            flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '6px 2px 4px',
          }}>
            <div style={{
              position: 'relative',
              width: 56, height: 32, borderRadius: 999,
              background: isActive ? 'var(--primary-container)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 200ms',
            }}>
              <Icon name={item.icon} size={22}
                fill={isActive ? 1 : 0}
                color={isActive ? 'var(--primary)' : 'var(--fg-2)'} />
              {hasBadge && (
                <span style={{
                  position: 'absolute', top: 2, right: 12,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--love-60)',
                  border: '2px solid var(--surface)',
                }}/>
              )}
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600,
              color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
              letterSpacing: 0.02,
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// Top app bar (M3-ish small variant)
const AppBar = ({ title, leading, trailing, transparent = false }) => (
  <header style={{
    display: 'flex', alignItems: 'center',
    padding: '12px 12px 8px',
    gap: 8,
    background: transparent ? 'transparent' : 'var(--surface)',
    position: 'relative', zIndex: 10,
  }}>
    {leading}
    <h2 style={{
      flex: 1,
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: 22, letterSpacing: '-0.01em',
      color: 'var(--fg-1)', margin: 0,
    }}>{title}</h2>
    <div style={{ display: 'flex', gap: 4 }}>{trailing}</div>
  </header>
);

// Icon button (circular)
const IconBtn = ({ icon, onClick, size = 40, color = 'var(--fg-1)', bg = 'transparent', fill = 0 }) => (
  <button onClick={onClick} style={{
    width: size, height: size, borderRadius: '50%', border: 'none',
    background: bg, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Icon name={icon} size={size * 0.55} color={color} fill={fill}/>
  </button>
);

Object.assign(window, { Icon, UniBadge, Avatar, BottomNav, AppBar, IconBtn });
