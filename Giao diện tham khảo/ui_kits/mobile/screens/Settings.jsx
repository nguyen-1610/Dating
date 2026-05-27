// Settings — grouped list with section headers, toggles, destructive zone at bottom.

const SettingsScreen = ({ onBack, theme = 'light', onToggleTheme }) => {
  const [notif, setNotif] = React.useState(true);
  const [matchNotif, setMatchNotif] = React.useState(true);
  const [messageNotif, setMessageNotif] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  const [showAge, setShowAge] = React.useState(true);
  const [language, setLanguage] = React.useState('Tiếng Việt');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-dim)' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 12px',
        background: 'var(--surface-dim)',
      }}>
        {onBack && <IconBtn icon="arrow_back_ios_new" onClick={onBack}/>}
        <h2 style={{
          flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 22, letterSpacing: '-0.01em',
          color: 'var(--fg-1)', margin: 0,
          paddingLeft: onBack ? 0 : 8,
        }}>Cài đặt</h2>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* Profile card top */}
        <div style={{
          margin: '4px 16px 18px',
          padding: '14px 16px',
          background: 'var(--surface)',
          borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--elev-1)',
        }}>
          <Avatar initial="B" size={52}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              color: 'var(--fg-1)',
            }}>Bạn, 21</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
              <Icon name="verified" size={12} fill={1} color="var(--success)" style={{ verticalAlign: 'middle', marginRight: 3 }}/>
              hcmus.edu.vn · Đã xác thực
            </div>
          </div>
          <IconBtn icon="chevron_right" color="var(--fg-3)"/>
        </div>

        <SettingsGroup title="Tài khoản">
          <SettingsRow icon="person" label="Hồ sơ" sub="Bạn, HCMUS"/>
          <SettingsRow icon="school" label="Trường đại học" sub="HCMUS · Khoa học Máy tính"/>
          <SettingsRow icon="lock" label="Bảo mật & mật khẩu"/>
          <SettingsRow icon="payments" label="UniDate Premium" badge="Nâng cấp" badgeColor="love"/>
        </SettingsGroup>

        <SettingsGroup title="Thông báo">
          <SettingsToggle icon="notifications" label="Thông báo đẩy" value={notif} onChange={setNotif}/>
          <SettingsToggle icon="favorite" label="Match mới" sub="Khi có người match với bạn" value={matchNotif} onChange={setMatchNotif}/>
          <SettingsToggle icon="forum" label="Tin nhắn" sub="Khi có người nhắn tin" value={messageNotif} onChange={setMessageNotif}/>
          <SettingsToggle icon="campaign" label="Tin tức & ưu đãi" value={marketing} onChange={setMarketing}/>
        </SettingsGroup>

        <SettingsGroup title="Hiển thị & ngôn ngữ">
          <SettingsToggle icon="dark_mode" label="Chế độ tối" sub={theme === 'dark' ? 'Bật' : 'Tắt'} value={theme === 'dark'} onChange={onToggleTheme}/>
          <SettingsRow icon="language" label="Ngôn ngữ" sub={language} onClick={() => setLanguage(language === 'Tiếng Việt' ? 'English' : 'Tiếng Việt')}/>
          <SettingsToggle icon="badge" label="Hiển thị tuổi trên profile" value={showAge} onChange={setShowAge}/>
        </SettingsGroup>

        <SettingsGroup title="Khám phá">
          <SettingsRow icon="tune" label="Bộ lọc khám phá" sub="≤ 10 km · 19–25 tuổi"/>
          <SettingsRow icon="block" label="Đã chặn" sub="3 người"/>
          <SettingsRow icon="visibility_off" label="Tạm ẩn hồ sơ"/>
        </SettingsGroup>

        <SettingsGroup title="Hỗ trợ">
          <SettingsRow icon="help" label="Trung tâm trợ giúp"/>
          <SettingsRow icon="policy" label="Điều khoản & chính sách"/>
          <SettingsRow icon="info" label="Phiên bản" sub="2.4.1 (build 1024)"/>
        </SettingsGroup>

        {/* Destructive */}
        <div style={{ margin: '8px 16px 0' }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: 'var(--elev-1)',
          }}>
            <SettingsRow icon="logout" label="Đăng xuất" color="var(--fg-1)" noChevron/>
            <div style={{ height: 1, background: 'var(--outline-variant)', margin: '0 16px' }}/>
            <SettingsRow icon="delete_forever" label="Xoá tài khoản" color="var(--error)" noChevron/>
          </div>
        </div>

        <div style={{
          textAlign: 'center', color: 'var(--fg-4)',
          fontSize: 11, fontWeight: 600,
          padding: '20px 0',
          letterSpacing: '0.02em',
        }}>UniDate · Yêu ở giảng đường · Made in Việt Nam 🇻🇳</div>
      </div>
    </div>
  );
};

const SettingsGroup = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{
      fontSize: 11, fontWeight: 700, color: 'var(--fg-3)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '0 28px 8px',
    }}>{title}</div>
    <div style={{
      margin: '0 16px',
      background: 'var(--surface)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: 'var(--elev-1)',
    }}>
      {React.Children.map(children, (child, i) => (
        <React.Fragment>
          {i > 0 && <div style={{ height: 1, background: 'var(--outline-variant)', marginLeft: 54 }}/>}
          {child}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const SettingsRow = ({ icon, label, sub, badge, badgeColor, color, onClick, noChevron }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px', cursor: onClick ? 'pointer' : 'default',
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: 'var(--surface-container)',
      color: color || 'var(--fg-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
        color: color || 'var(--fg-1)',
      }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 1 }}>{sub}</div>}
    </div>
    {badge && (
      <span style={{
        padding: '3px 10px', borderRadius: 999,
        background: badgeColor === 'love' ? 'var(--primary-container)' : 'var(--success-container)',
        color: badgeColor === 'love' ? 'var(--on-primary-container)' : '#065f46',
        fontSize: 10.5, fontWeight: 700,
      }}>{badge}</span>
    )}
    {!noChevron && <Icon name="chevron_right" size={20} color="var(--fg-3)"/>}
  </div>
);

const SettingsToggle = ({ icon, label, sub, value, onChange }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px',
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: 'var(--surface-container)',
      color: 'var(--fg-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--fg-1)' }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 1 }}>{sub}</div>}
    </div>
    <button onClick={() => onChange(!value)} style={{
      width: 44, height: 26, borderRadius: 999, border: 'none',
      background: value ? 'var(--primary)' : 'var(--surface-container-high)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 200ms',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
        transition: 'left 200ms cubic-bezier(0.2, 0, 0, 1)',
      }}/>
    </button>
  </div>
);

Object.assign(window, { SettingsScreen });
