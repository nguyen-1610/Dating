// Events list + Event detail with GPS check-in.

const EVENTS = [
  {
    id: 1, title: 'Cà phê & Code night', host: 'CLB IT HCMUS',
    date: 'Thứ 7, 30/05', time: '18:30 – 21:30',
    venue: 'Highland Coffee Sư Vạn Hạnh', distance: '0.8 km',
    attendees: 28, max: 40,
    palette: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    icon: 'laptop_mac', tags: ['Tech', 'Networking'],
  },
  {
    id: 2, title: 'Đêm nhạc acoustic SV',
    host: 'CLB Âm nhạc BK',
    date: 'CN, 31/05', time: '19:00 – 22:00',
    venue: 'Sân BK cơ sở Lý Thường Kiệt', distance: '2.4 km',
    attendees: 89, max: 150,
    palette: 'linear-gradient(135deg, #d6336c 0%, #fbbf24 100%)',
    icon: 'music_note', tags: ['Âm nhạc'],
  },
  {
    id: 3, title: 'Workshop CV cho intern',
    host: 'UEH Career Center',
    date: 'Thứ 3, 02/06', time: '09:00 – 11:30',
    venue: 'Hội trường A, UEH', distance: '4.1 km',
    attendees: 56, max: 80,
    palette: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    icon: 'work', tags: ['Career'],
  },
];

const EventListScreen = ({ onOpen }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <AppBar title="Sự kiện"
      trailing={<><IconBtn icon="map" color="var(--tertiary)"/><IconBtn icon="filter_list"/></>}
    />

    {/* filters */}
    <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }}>
      {['Tất cả', 'Tuần này', 'Gần tôi', 'Tech', 'Âm nhạc', 'Career'].map((t, i) => (
        <span key={t} style={{
          padding: '7px 14px', borderRadius: 999,
          background: i === 0 ? 'var(--fg-1)' : 'var(--surface-container)',
          color: i === 0 ? 'var(--surface)' : 'var(--fg-1)',
          fontSize: 12, fontWeight: 600,
          flex: '0 0 auto', cursor: 'pointer',
        }}>{t}</span>
      ))}
    </div>

    {/* Featured */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 90px' }}>
      {EVENTS.map(e => (
        <div key={e.id} onClick={() => onOpen && onOpen(e)} style={{
          marginBottom: 14, borderRadius: 24, overflow: 'hidden',
          background: 'var(--surface)',
          boxShadow: 'var(--elev-1)',
          cursor: 'pointer',
          border: '1px solid var(--outline-variant)',
        }}>
          <div style={{
            height: 100, background: e.palette,
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '0 20px',
          }}>
            <Icon name={e.icon} size={64} color="rgba(255,255,255,0.4)" fill={1}/>
            <div style={{
              position: 'absolute', left: 16, top: 12,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
            }}>{e.date.toUpperCase()}</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 18, color: 'var(--fg-1)', letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>{e.title}</div>
            <div style={{
              fontSize: 12, color: 'var(--fg-3)', fontWeight: 500,
              marginTop: 4, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Icon name="location_on" size={14}/> {e.venue} · {e.distance}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginTop: 10,
            }}>
              <div style={{ display: 'flex' }}>
                {['L', 'Đ', 'M'].map((c, i) => (
                  <Avatar key={i} initial={c} size={24}
                    gradient={['linear-gradient(180deg, #c4b5fd, #d6336c)','linear-gradient(180deg, #93c5fd, #8b5cf6)','linear-gradient(180deg, #fbbf24, #d6336c)'][i]}/>
                ))}
              </div>
              <span style={{ fontSize: 12, color: 'var(--fg-2)', fontWeight: 600 }}>
                {e.attendees} / {e.max} tham gia
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventDetailScreen = ({ event, onBack }) => {
  const e = event || EVENTS[0];
  const [checkedIn, setCheckedIn] = React.useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      {/* Hero */}
      <div style={{
        height: 220, background: e.palette,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 5,
        }}>
          <IconBtn icon="arrow_back_ios_new" bg="rgba(255,255,255,0.85)" onClick={onBack}/>
        </div>
        <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 5, display: 'flex', gap: 6 }}>
          <IconBtn icon="share" bg="rgba(255,255,255,0.85)"/>
          <IconBtn icon="bookmark_border" bg="rgba(255,255,255,0.85)"/>
        </div>
        <Icon name={e.icon} size={140} fill={1} color="rgba(255,255,255,0.35)"
          style={{ position: 'absolute', right: 20, bottom: 0 }}/>
        <div style={{
          position: 'absolute', left: 18, bottom: 16,
          color: '#fff',
        }}>
          <div style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
            display: 'inline-block', marginBottom: 8,
          }}>{e.date.toUpperCase()} · {e.time}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 100px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
          letterSpacing: '-0.01em', color: 'var(--fg-1)', margin: 0,
        }}>{e.title}</h1>
        <div style={{
          marginTop: 6, display: 'flex', alignItems: 'center', gap: 8,
          color: 'var(--fg-2)', fontSize: 13, fontWeight: 500,
        }}>
          <Icon name="groups" size={16}/> Tổ chức bởi {e.host}
        </div>

        {/* Info rows */}
        <div style={{
          marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <InfoRow icon="schedule" title={e.time} sub={e.date}/>
          <InfoRow icon="location_on" title={e.venue} sub={`${e.distance} · Xem bản đồ`} link/>
          <InfoRow icon="groups" title={`${e.attendees} / ${e.max} đang tham gia`} sub="3 bạn của bạn cũng đi"/>
        </div>

        {/* GPS check-in */}
        <div style={{
          marginTop: 20,
          padding: 16, borderRadius: 20,
          background: checkedIn ? 'var(--success-container)' : 'var(--primary-container)',
          color: checkedIn ? '#065f46' : 'var(--on-primary-container)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: checkedIn ? 'var(--success)' : 'var(--primary)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={checkedIn ? 'check' : 'my_location'} size={22} fill={1}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {checkedIn ? 'Đã check-in!' : 'GPS check-in'}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {checkedIn ? '+5 điểm UniDate · Mở chat nhóm' : 'Bật vị trí để check-in khi đến nơi'}
            </div>
          </div>
          {!checkedIn && (
            <button onClick={() => setCheckedIn(true)} style={{
              padding: '8px 16px', borderRadius: 999, border: 'none',
              background: 'var(--primary)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            }}>Bật</button>
          )}
        </div>

        {/* Attendees grid */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
              color: 'var(--fg-1)', margin: 0,
            }}>Người tham gia</h3>
            <span style={{
              fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer',
            }}>Xem tất cả</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10,
          }}>
            {[
              {i: 'L', g: 'linear-gradient(180deg, #c4b5fd, #d6336c)'},
              {i: 'Đ', g: 'linear-gradient(180deg, #93c5fd, #8b5cf6)'},
              {i: 'M', g: 'linear-gradient(180deg, #fbbf24, #d6336c)'},
              {i: 'P', g: 'linear-gradient(180deg, #06b6d4, #3b82f6)'},
              {i: 'T', g: 'linear-gradient(180deg, #34d399, #06b6d4)'},
              {i: 'H', g: 'linear-gradient(180deg, #fcd34d, #f97316)'},
              {i: 'A', g: 'linear-gradient(180deg, #c4b5fd, #3b82f6)'},
              {i: 'Q', g: 'linear-gradient(180deg, #a7f3d0, #06b6d4)'},
              {i: 'N', g: 'linear-gradient(180deg, #fbcfe8, #8b5cf6)'},
              {i: '+', g: 'var(--surface-container)' },
            ].map((x, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {x.i === '+' ? (
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: x.g, color: 'var(--fg-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600,
                  }}>+19</div>
                ) : (
                  <Avatar initial={x.i} size={52} gradient={x.g}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 16px 30px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--outline-variant)',
        display: 'flex', gap: 10,
      }}>
        <IconBtn icon="forum" bg="var(--surface-container)" color="var(--primary)" size={48}/>
        <button style={{
          flex: 1, padding: '14px',
          background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
          color: '#fff', border: 'none', borderRadius: 999,
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: 'var(--elev-love)',
        }}>Tham gia sự kiện · Miễn phí</button>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, title, sub, link }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: 'var(--surface-container)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--fg-2)',
    }}><Icon name={icon} size={20}/></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{title}</div>
      <div style={{
        fontSize: 12, color: link ? 'var(--primary)' : 'var(--fg-3)',
        fontWeight: link ? 600 : 500, marginTop: 2,
      }}>{sub}</div>
    </div>
  </div>
);

Object.assign(window, { EventListScreen, EventDetailScreen });
