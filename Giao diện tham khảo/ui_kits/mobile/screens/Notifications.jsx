// Notifications inbox — grouped by today / this week.

const NOTIFS = {
  today: [
    { id: 1, type: 'match', who: 'Đăng', initial: 'Đ', uni: 'BK',
      text: 'đã match với bạn', time: '12 phút', read: false,
      palette: 'linear-gradient(180deg, #93c5fd, #8b5cf6)' },
    { id: 2, type: 'message', who: 'Mai', initial: 'M', uni: 'UEH',
      text: 'gửi cho bạn 2 tin nhắn mới', time: '34 phút', read: false,
      palette: 'linear-gradient(180deg, #fbbf24, #d6336c)' },
    { id: 3, type: 'superlike', who: 'Quân', initial: 'Q', uni: 'FTU',
      text: 'đã super-like bạn — xem profile ngay!', time: '1 giờ', read: false,
      palette: 'linear-gradient(180deg, #a7f3d0, #06b6d4)' },
    { id: 4, type: 'like', who: '12 người', initial: '?',
      text: 'đã thích bạn tuần này', time: '2 giờ', read: true,
      palette: 'linear-gradient(135deg, #d6336c, #8b5cf6)', isLikesYou: true },
  ],
  week: [
    { id: 5, type: 'event', who: 'CLB IT HCMUS', initial: '🎓',
      text: 'mời bạn tham gia "Cà phê & Code night"', time: 'Thứ 5', read: true,
      palette: 'linear-gradient(180deg, #8b5cf6, #3b82f6)', isEvent: true },
    { id: 6, type: 'comment', who: 'Phúc', initial: 'P', uni: 'FTU',
      text: 'đã comment bài đăng của bạn', time: 'Thứ 4', read: true,
      palette: 'linear-gradient(180deg, #06b6d4, #3b82f6)' },
    { id: 7, type: 'system', who: 'UniDate', initial: 'U',
      text: 'Profile của bạn đã được xác thực ✓', time: 'Thứ 3', read: true,
      palette: 'linear-gradient(135deg, #10b981, #06b6d4)', isSystem: true },
    { id: 8, type: 'match', who: 'Hằng', initial: 'H', uni: 'RMIT',
      text: 'đã match với bạn', time: 'Thứ 2', read: true,
      palette: 'linear-gradient(180deg, #c4b5fd, #d6336c)' },
  ],
};

const NOTIF_META = {
  match:     { ico: 'favorite',  color: 'var(--love-60)' },
  message:   { ico: 'forum',     color: 'var(--spark-60)' },
  superlike: { ico: 'star',      color: 'var(--superlike)' },
  like:      { ico: 'whatshot',  color: 'var(--love-60)' },
  comment:   { ico: 'mode_comment', color: 'var(--campus-60)' },
  event:     { ico: 'event',     color: 'var(--spark-60)' },
  system:    { ico: 'verified',  color: 'var(--success)' },
};

const NotifRow = ({ n }) => {
  const meta = NOTIF_META[n.type] || NOTIF_META.system;
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center',
      padding: '12px 16px',
      background: n.read ? 'transparent' : 'var(--primary-container)',
      borderRadius: 16,
      cursor: 'pointer',
      position: 'relative',
    }}>
      <div style={{ position: 'relative' }}>
        {n.isLikesYou ? (
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
            position: 'relative',
          }}>
            12
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: '50%',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="lock" size={12} color="var(--fg-1)" fill={1}/>
            </div>
          </div>
        ) : n.isSystem || n.isEvent ? (
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: n.palette,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}>
            <Icon name={meta.ico} size={24} fill={1}/>
          </div>
        ) : (
          <Avatar initial={n.initial} size={48} gradient={n.palette}/>
        )}
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 22, height: 22, borderRadius: '50%',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}>
          <Icon name={meta.ico} size={13} fill={1} color={meta.color}/>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: '19px',
          color: 'var(--fg-1)',
        }}>
          <span style={{ fontWeight: 700 }}>{n.who}</span>{' '}
          <span style={{ color: 'var(--fg-2)', fontWeight: 500 }}>{n.text}</span>
        </div>
        <div style={{
          fontSize: 11, color: 'var(--fg-3)', fontWeight: 600,
          marginTop: 3, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {n.uni && <UniBadge code={n.uni}/>}
          <span>{n.time}</span>
        </div>
      </div>
      {!n.read && (
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--love-60)', flex: '0 0 8px',
        }}/>
      )}
    </div>
  );
};

const NotificationsScreen = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
    <header style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '10px 12px',
    }}>
      {onBack && <IconBtn icon="arrow_back_ios_new" onClick={onBack}/>}
      <h2 style={{
        flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 22, letterSpacing: '-0.01em',
        color: 'var(--fg-1)', margin: 0,
        paddingLeft: onBack ? 0 : 8,
      }}>Thông báo</h2>
      <IconBtn icon="done_all"/>
      <IconBtn icon="tune"/>
    </header>

    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{
        padding: '6px 16px 8px',
        fontSize: 11, fontWeight: 700, color: 'var(--fg-3)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>Hôm nay</div>
      <div style={{ padding: '0 6px' }}>
        {NOTIFS.today.map(n => <NotifRow key={n.id} n={n}/>)}
      </div>

      <div style={{
        padding: '14px 16px 8px',
        fontSize: 11, fontWeight: 700, color: 'var(--fg-3)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>Tuần này</div>
      <div style={{ padding: '0 6px' }}>
        {NOTIFS.week.map(n => <NotifRow key={n.id} n={n}/>)}
      </div>

      <div style={{
        textAlign: 'center', color: 'var(--fg-3)',
        fontSize: 12, fontWeight: 600,
        padding: '20px 0',
      }}>Bạn đã xem hết · Quay lại sau nhé 👋</div>
    </div>
  </div>
);

Object.assign(window, { NotificationsScreen });
