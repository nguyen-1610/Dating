// Matches tab — new matches grid + active conversations list.

const NEW_MATCHES = [
  { name: 'Đăng', initial: 'Đ', new: true, palette: 'linear-gradient(180deg, #93c5fd, #8b5cf6)' },
  { name: 'Mai', initial: 'M', new: true, palette: 'linear-gradient(180deg, #fbbf24, #d6336c)' },
  { name: 'Phúc', initial: 'P', palette: 'linear-gradient(180deg, #06b6d4, #3b82f6)' },
  { name: 'Thảo', initial: 'T', palette: 'linear-gradient(180deg, #34d399, #06b6d4)' },
];

const CONVERSATIONS = [
  { name: 'Đăng', initial: 'Đ', uni: 'BK', last: 'Cuối tuần này CLB Robotics BK có demo, bạn ghé chơi không?', time: '2 phút', unread: 2, online: true, palette: 'linear-gradient(180deg, #93c5fd, #8b5cf6)' },
  { name: 'Mai', initial: 'M', uni: 'UEH', last: 'Bạn đã gửi reaction ❤️', time: '1 giờ', mine: true, palette: 'linear-gradient(180deg, #fbbf24, #d6336c)' },
  { name: 'Hằng', initial: 'H', uni: 'RMIT', last: 'Hihi cảm ơn nha 🌷', time: '4 giờ', palette: 'linear-gradient(180deg, #c4b5fd, #d6336c)' },
  { name: 'Quân', initial: 'Q', uni: 'FTU', last: 'Mai mình free buổi chiều, sao bạn?', time: 'hôm qua', palette: 'linear-gradient(180deg, #a7f3d0, #06b6d4)' },
];

const MatchesScreen = ({ onOpenChat }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <AppBar title="Match"
      trailing={<><IconBtn icon="filter_list"/><IconBtn icon="search"/></>}
    />

    {/* New matches row */}
    <div style={{ padding: '4px 16px 12px' }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
        color: 'var(--fg-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        Match mới · 4
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {/* Likes-you tile */}
        <div style={{
          flex: '0 0 76px',
          height: 110, borderRadius: 18,
          background: 'linear-gradient(160deg, #d6336c 0%, #8b5cf6 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', position: 'relative',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, lineHeight: 1,
          }}>12</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4 }}>Thích bạn</div>
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 22, height: 22, borderRadius: 6,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="lock" size={12} color="#fff"/></div>
        </div>
        {NEW_MATCHES.map((m, i) => (
          <div key={i} style={{
            flex: '0 0 76px', height: 110, borderRadius: 18,
            background: m.palette,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            position: 'relative', cursor: 'pointer',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 44,
            paddingBottom: 10,
            boxShadow: 'var(--elev-1)',
          }}>
            {m.initial}
            <div style={{
              position: 'absolute', left: 6, bottom: 6, right: 6,
              fontSize: 11, fontWeight: 700, color: '#fff',
              textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              fontFamily: 'var(--font-body)',
            }}>{m.name}</div>
            {m.new && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--love-60)',
                boxShadow: '0 0 0 2px #fff',
              }}/>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Conversations */}
    <div style={{ padding: '0 16px', flex: 1, overflowY: 'auto' }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
        color: 'var(--fg-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 4,
      }}>Tin nhắn · {CONVERSATIONS.length}</div>
      {CONVERSATIONS.map((c, i) => (
        <div key={i} onClick={() => onOpenChat && onOpenChat(c)} style={{
          display: 'flex', gap: 12, alignItems: 'center',
          padding: '12px 0',
          borderBottom: i < CONVERSATIONS.length - 1 ? '1px solid var(--outline-variant)' : 'none',
          cursor: 'pointer',
        }}>
          <Avatar initial={c.initial} size={52} gradient={c.palette} online={c.online}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                color: 'var(--fg-1)',
              }}>{c.name}</span>
              <UniBadge code={c.uni}/>
            </div>
            <div style={{
              fontSize: 13, color: c.unread ? 'var(--fg-1)' : 'var(--fg-3)',
              fontWeight: c.unread ? 600 : 400,
              marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: 220,
            }}>{c.last}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 500 }}>{c.time}</span>
            {c.unread && (
              <span style={{
                background: 'var(--love-60)', color: '#fff',
                fontSize: 10, fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{c.unread}</span>
            )}
          </div>
        </div>
      ))}
      <div style={{ height: 100 }}/>
    </div>
  </div>
);

Object.assign(window, { MatchesScreen });
