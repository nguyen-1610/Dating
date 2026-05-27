// Discover — swipe deck. Tap pass/like/super-like to advance.

const DECK = [
  {
    name: 'Linh', age: 21, uni: 'HCMUS', major: 'Khoa học Máy tính · Năm 3',
    distance: '1.2 km', online: true, boost: true,
    bio: 'Cà phê sáng + chạy bộ buổi tối. Đang học AI và sưu tầm phim Studio Ghibli 🍿',
    interests: ['Cà phê', 'Chạy bộ', 'Anime', 'AI'],
    palette: 'linear-gradient(160deg, #fbcfe8 0%, #c4b5fd 55%, #d6336c 100%)',
    initial: 'L',
  },
  {
    name: 'Đăng', age: 22, uni: 'BK', major: 'Cơ điện tử · Năm 4',
    distance: '3.4 km', online: false, superLikedYou: true,
    bio: 'Robot, board game và đi phượt cuối tuần. Tìm người cùng leo Bidoup tháng 6 này.',
    interests: ['Robot', 'Phượt', 'Board game'],
    palette: 'linear-gradient(160deg, #bfdbfe 0%, #93c5fd 50%, #8b5cf6 100%)',
    initial: 'Đ',
  },
  {
    name: 'Mai', age: 20, uni: 'UEH', major: 'Marketing · Năm 2',
    distance: '2.1 km', online: true,
    bio: 'K-Pop stan, bún bò Huế đỉnh nhất, và mình rất hay cười nha ✨',
    interests: ['K-Pop', 'Food', 'Du lịch'],
    palette: 'linear-gradient(160deg, #fef3c7 0%, #fbbf24 50%, #d6336c 100%)',
    initial: 'M',
  },
  {
    name: 'Phúc', age: 23, uni: 'FTU', major: 'Tài chính · Năm 4',
    distance: '5.0 km', online: false,
    bio: 'Đọc sách, chạy marathon, và tập tành chơi guitar. Coffee chat anytime ☕',
    interests: ['Sách', 'Marathon', 'Guitar'],
    palette: 'linear-gradient(160deg, #a7f3d0 0%, #06b6d4 50%, #3b82f6 100%)',
    initial: 'P',
  },
];

const ProfileCard = ({ profile, offset = 0, scale = 1, dragX = 0, opacity = 1 }) => (
  <div style={{
    position: 'absolute', inset: 0,
    borderRadius: 28, overflow: 'hidden',
    background: profile.palette,
    boxShadow: '0 12px 32px -8px rgba(20,20,26,0.25), 0 4px 12px -2px rgba(20,20,26,0.15)',
    transform: `translateY(${offset}px) scale(${scale}) translateX(${dragX}px) rotate(${dragX * 0.03}deg)`,
    transition: dragX === 0 ? 'transform 350ms cubic-bezier(0.2, 0, 0, 1)' : 'none',
    opacity,
  }}>
    {/* Top tag */}
    {profile.boost && (
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 3,
        padding: '5px 12px 5px 8px', borderRadius: 999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <Icon name="whatshot" size={14} fill={1} color="#fbbf24"/> BOOST · 4 phút
      </div>
    )}
    {profile.superLikedYou && (
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 3,
        padding: '5px 12px 5px 8px', borderRadius: 999,
        background: 'var(--superlike)', color: '#003a4a',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <Icon name="star" size={14} fill={1}/> SUPER-LIKE BẠN
      </div>
    )}

    {/* Photo placeholder (big initial) */}
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800,
      fontSize: 220, color: 'rgba(255,255,255,0.30)',
      letterSpacing: '-0.04em',
      userSelect: 'none',
    }}>{profile.initial}</div>

    {/* Photo counter pips */}
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 4, zIndex: 3,
    }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{
          width: 38, height: 3, borderRadius: 2,
          background: i === 1 ? '#fff' : 'rgba(255,255,255,0.35)',
        }}/>
      ))}
    </div>

    {/* Scrim */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(0,0,0,0.85) 100%)',
    }}/>

    {/* Online dot */}
    {profile.online && (
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 3,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 11px 5px 9px', borderRadius: 999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        color: '#fff', fontSize: 11, fontWeight: 700,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}/>
        Đang online
      </div>
    )}

    {/* Body */}
    <div style={{
      position: 'absolute', left: 18, right: 18, bottom: 18,
      color: '#fff', zIndex: 2,
    }}>
      <UniBadge code={profile.uni} label={profile.major} variant="glass"/>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.02em',
        marginTop: 8,
      }}>{profile.name}, <span style={{ fontWeight: 500 }}>{profile.age}</span></div>
      <div style={{
        fontSize: 13, fontWeight: 500, opacity: 0.92, marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <Icon name="location_on" size={14} fill={1}/> Cách bạn {profile.distance}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 400, lineHeight: 1.4,
        marginTop: 10, opacity: 0.95,
      }}>{profile.bio}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
        {profile.interests.map(int => (
          <span key={int} style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            fontSize: 11, fontWeight: 600,
          }}>{int}</span>
        ))}
      </div>
    </div>

    {/* LIKE / NOPE overlay during drag */}
    {dragX > 40 && (
      <div style={{
        position: 'absolute', top: 60, left: 24, zIndex: 4,
        padding: '8px 18px', border: '4px solid var(--love-60)', borderRadius: 12,
        transform: `rotate(-12deg)`, color: 'var(--love-60)',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '0.05em',
        opacity: Math.min(1, dragX / 100),
      }}>LIKE</div>
    )}
    {dragX < -40 && (
      <div style={{
        position: 'absolute', top: 60, right: 24, zIndex: 4,
        padding: '8px 18px', border: '4px solid var(--neutral-40)', borderRadius: 12,
        transform: `rotate(12deg)`, color: 'var(--neutral-40)', background: 'rgba(255,255,255,0.7)',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '0.05em',
        opacity: Math.min(1, -dragX / 100),
      }}>NOPE</div>
    )}
  </div>
);

const DiscoverScreen = ({ onMatch, onOpenFilter, onOpenBoost }) => {
  const [idx, setIdx] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);

  const advance = (dir) => {
    // dir: 'like' | 'pass' | 'super'
    setDragX(dir === 'like' ? 400 : dir === 'pass' ? -400 : 0);
    setTimeout(() => {
      // Trigger match modal sometimes
      if (dir === 'like' && idx === 0) onMatch && onMatch(DECK[idx]);
      setIdx((i) => (i + 1) % DECK.length);
      setDragX(0);
    }, 300);
  };

  const top = DECK[idx];
  const below = DECK[(idx + 1) % DECK.length];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        title="Khám phá"
        leading={<IconBtn icon="tune" onClick={onOpenFilter}/>}
        trailing={<><IconBtn icon="bolt" color="var(--spark-60)" fill={1} onClick={onOpenBoost}/><IconBtn icon="favorite_border"/></>}
      />

      {/* Deck */}
      <div style={{
        flex: 1, position: 'relative',
        padding: '8px 18px 12px',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ProfileCard profile={below} offset={10} scale={0.95} opacity={0.6}/>
          <ProfileCard profile={top} dragX={dragX}/>
        </div>
      </div>

      {/* Action bar */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 14,
        padding: '14px 16px 90px',
        alignItems: 'center',
      }}>
        <button onClick={() => {}} style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none',
          background: '#fff', boxShadow: 'var(--elev-2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--warning)',
        }}><Icon name="replay" size={22} fill={1}/></button>

        <button onClick={() => advance('pass')} style={{
          width: 60, height: 60, borderRadius: '50%', border: 'none',
          background: '#fff', boxShadow: 'var(--elev-3)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--neutral-40)',
        }}><Icon name="close" size={30} weight={600}/></button>

        <button onClick={() => advance('super')} style={{
          width: 52, height: 52, borderRadius: '50%', border: 'none',
          background: '#fff', boxShadow: '0 4px 14px rgba(0,200,255,0.35), 0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--superlike)',
        }}><Icon name="star" size={26} fill={1}/></button>

        <button onClick={() => advance('like')} style={{
          width: 60, height: 60, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
          boxShadow: 'var(--elev-love)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}><Icon name="favorite" size={30} fill={1}/></button>

        <button onClick={onOpenBoost} style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none',
          background: '#fff', boxShadow: 'var(--elev-2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--spark-60)',
        }}><Icon name="bolt" size={22} fill={1}/></button>
      </div>
    </div>
  );
};

Object.assign(window, { DiscoverScreen, DECK });
