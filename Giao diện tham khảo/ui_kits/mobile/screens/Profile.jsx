// Profile — full profile with photos carousel, bio, interests, university badge.

const ME = {
  name: 'Bạn',
  age: 21,
  uni: 'HCMUS', major: 'Khoa học Máy tính', year: 'Năm 3',
  bio: 'Mình thích cà phê sáng, đọc sách cuối tuần, và phim Studio Ghibli. Đang học AI và tập chơi guitar 🎸 Tìm người cùng đi cà phê và tám chuyện hợp gu nha.',
  interests: ['Cà phê', 'Đọc sách', 'AI', 'Anime', 'Guitar', 'Phim Hàn', 'Du lịch bụi'],
  height: '1m65', sign: 'Bảo Bình', looking: 'Hẹn hò nghiêm túc',
  initial: 'B',
};

const ProfileScreen = ({ profile = ME, onBack, hideBottomChrome = true }) => {
  const [photoIdx, setPhotoIdx] = React.useState(0);
  const photos = [
    'linear-gradient(160deg, #fbcfe8 0%, #c4b5fd 50%, #d6336c 100%)',
    'linear-gradient(160deg, #bfdbfe 0%, #8b5cf6 100%)',
    'linear-gradient(160deg, #fef3c7 0%, #fbbf24 100%)',
    'linear-gradient(160deg, #a7f3d0 0%, #06b6d4 100%)',
  ];

  return (
    <div style={{ height: '100%', background: 'var(--surface-dim)', overflowY: 'auto', paddingBottom: hideBottomChrome ? 90 : 100 }}>
      {/* Floating photo card — rounded 16, on surface-dim with side padding */}
      <div style={{ padding: '12px 12px 0' }}>
        <div style={{
          position: 'relative', aspectRatio: '0.85 / 1',
          background: photos[photoIdx],
          borderRadius: 16, overflow: 'hidden',
          boxShadow: 'var(--elev-2)',
        }}>
        {/* pips */}
        <div style={{
          position: 'absolute', top: 12, left: 14, right: 14,
          display: 'flex', gap: 4, zIndex: 5,
        }}>
          {photos.map((_, i) => (
            <div key={i} onClick={() => setPhotoIdx(i)} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
            }}/>
          ))}
        </div>

        {/* big initial */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 240,
          color: 'rgba(255,255,255,0.30)', letterSpacing: '-0.04em',
        }}>{profile.initial}</div>

        {/* back */}
        {onBack && (
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 6 }}>
            <IconBtn icon="arrow_back_ios_new" bg="rgba(255,255,255,0.85)" onClick={onBack}/>
          </div>
        )}

        {/* tap zones */}
        <div onClick={() => setPhotoIdx(i => Math.max(0, i - 1))}
          style={{ position: 'absolute', left: 0, top: 30, bottom: 0, width: '40%' }}/>
        <div onClick={() => setPhotoIdx(i => Math.min(photos.length - 1, i + 1))}
          style={{ position: 'absolute', right: 0, top: 30, bottom: 0, width: '40%' }}/>

        {/* scrim + name */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65) 100%)',
        }}/>
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 14,
          color: '#fff',
        }}>
          <UniBadge code={profile.uni} label={`${profile.major} · ${profile.year}`} variant="glass"/>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30,
            letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1,
          }}>{profile.name}, <span style={{ fontWeight: 500 }}>{profile.age}</span></div>
        </div>
        </div>
      </div>

      {/* Verified + quick stats */}
      <div style={{
        margin: '16px 16px 0',
        padding: '12px 14px', borderRadius: 16,
        background: 'var(--success-container)', color: '#065f46',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="verified" size={20} fill={1}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Sinh viên đã xác thực</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Email @hcmus.edu.vn · 2024</div>
        </div>
      </div>

      {/* Bio */}
      <section style={{ padding: '20px 18px 8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
          color: 'var(--fg-1)', letterSpacing: '-0.005em', margin: '0 0 8px',
        }}>Về mình</h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: '20px',
          color: 'var(--fg-2)', margin: 0,
        }}>{profile.bio}</p>
      </section>

      {/* Quick facts */}
      <section style={{ padding: '8px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Fact icon="height" label={profile.height}/>
          <Fact icon="star" label={profile.sign}/>
          <Fact icon="favorite" label={profile.looking}/>
          <Fact icon="local_cafe" label="Cà phê đen · No sugar"/>
        </div>
      </section>

      {/* Interests */}
      <section style={{ padding: '16px 18px 8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
          color: 'var(--fg-1)', margin: '0 0 10px',
        }}>Sở thích</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profile.interests.map(int => (
            <span key={int} style={{
              padding: '7px 14px', borderRadius: 999,
              background: 'var(--primary-container)',
              color: 'var(--on-primary-container)',
              fontSize: 12.5, fontWeight: 600,
            }}>{int}</span>
          ))}
        </div>
      </section>

      {/* Prompt cards */}
      <section style={{ padding: '16px 18px 8px' }}>
        <PromptCard
          q="Cuối tuần tớ thường…"
          a="Lê la quán cà phê, đọc sách, hoặc đi phượt gần nếu trời đẹp."
        />
        <PromptCard
          q="Trận đấu tớ luôn thắng…"
          a="Đoán xem ai trong nhóm sẽ trễ giờ. Mình toàn đúng 🏆"
        />
      </section>

      {/* Sub-actions */}
      <div style={{
        margin: '20px 18px', display: 'flex', gap: 10, justifyContent: 'center',
      }}>
        <button style={{
          padding: '11px 22px', borderRadius: 999, border: '1.5px solid var(--outline)',
          background: 'transparent', color: 'var(--fg-1)',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}><Icon name="edit" size={16}/>Chỉnh hồ sơ</button>
        <button style={{
          padding: '11px 22px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(135deg, #fbbf24 0%, #d6336c 100%)',
          color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 6px 14px rgba(214, 51, 108,0.30)',
        }}><Icon name="bolt" size={16} fill={1}/>Nâng cấp Premium</button>
      </div>

      <div style={{
        textAlign: 'center', color: 'var(--fg-3)', fontSize: 11, fontWeight: 600,
        padding: '8px 0 20px',
      }}>Ẩn hồ sơ · Báo cáo · Đăng xuất</div>
    </div>
  );
};

const Fact = ({ icon, label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 12px', borderRadius: 999,
    background: 'var(--surface-container)',
    color: 'var(--fg-1)',
    fontSize: 12.5, fontWeight: 600,
    border: '1px solid var(--outline-variant)',
  }}>
    <Icon name={icon} size={15} color="var(--fg-3)"/>
    {label}
  </span>
);

const PromptCard = ({ q, a }) => (
  <div style={{
    padding: '14px 16px',
    background: 'var(--surface-container-low)',
    border: '1px solid var(--outline-variant)',
    borderRadius: 20, marginBottom: 10,
  }}>
    <div style={{
      fontSize: 12, fontWeight: 700, color: 'var(--primary)',
      letterSpacing: '0.02em',
    }}>{q}</div>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600,
      color: 'var(--fg-1)', marginTop: 5, letterSpacing: '-0.005em',
      lineHeight: 1.3,
    }}>{a}</div>
  </div>
);

Object.assign(window, { ProfileScreen });
