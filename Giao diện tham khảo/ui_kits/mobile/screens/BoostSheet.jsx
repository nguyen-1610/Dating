// Boost / Premium upsell bottom sheet.
// Shown when user taps the boost button on Discover.

const BOOST_TIERS = [
  { id: '1x', label: '1 lần Boost', price: '49.000đ', priceVnd: 49000,
    sub: 'Được hiển thị đầu trong 30 phút', save: null },
  { id: '5x', label: '5 lần Boost', price: '199.000đ', priceVnd: 199000,
    sub: '40.000đ / lần · Tiết kiệm 18%', save: 'PHỔ BIẾN', highlight: true },
  { id: '10x', label: '10 lần Boost', price: '349.000đ', priceVnd: 349000,
    sub: '35.000đ / lần · Tiết kiệm 29%', save: 'TỐT NHẤT' },
];

const PREMIUM_PERKS = [
  { ico: 'all_inclusive', label: 'Like không giới hạn' },
  { ico: 'visibility', label: 'Xem ai đã thích bạn' },
  { ico: 'replay', label: 'Rewind không giới hạn' },
  { ico: 'public', label: 'Đổi vị trí — match ở thành phố khác' },
  { ico: 'tune', label: 'Bộ lọc nâng cao' },
  { ico: 'star', label: '5 super-like / tuần' },
];

const BoostSheet = ({ open, onClose }) => {
  const [tab, setTab] = React.useState('boost'); // 'boost' | 'premium'
  const [tier, setTier] = React.useState('5x');

  if (!open) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 85 }}>
      <style>{`
        @keyframes bsSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bsScrim { from { opacity: 0; } to { opacity: 1; } }
        @keyframes haloPulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.15); opacity: 0.85; } }
      `}</style>

      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,20,26,0.55)',
        animation: 'bsScrim 250ms ease',
      }}/>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        maxHeight: '92%',
        display: 'flex', flexDirection: 'column',
        animation: 'bsSlide 380ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>
        {/* Hero header */}
        <div style={{
          background: tab === 'boost'
            ? 'radial-gradient(circle at 50% -20%, rgba(139,92,246,0.35) 0%, transparent 65%), var(--surface)'
            : 'radial-gradient(circle at 50% -20%, rgba(214,51,108,0.35) 0%, transparent 65%), var(--surface)',
          padding: '14px 0 18px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--outline)' }}/>
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--surface-container)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="close" size={18} color="var(--fg-2)"/></button>

          {/* Icon halo */}
          <div style={{ position: 'relative', display: 'inline-flex', margin: '6px 0 8px' }}>
            <div style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              background: tab === 'boost'
                ? 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(214,51,108,0.45) 0%, transparent 70%)',
              animation: 'haloPulse 2.4s ease-in-out infinite',
            }}/>
            <div style={{
              position: 'relative', width: 64, height: 64, borderRadius: 20,
              background: tab === 'boost'
                ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #d6336c 0%, #fbbf24 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(20,20,26,0.15)',
            }}>
              <Icon name={tab === 'boost' ? 'bolt' : 'workspace_premium'} size={36} fill={1} color="#fff"/>
            </div>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
            letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: '4px 0 4px',
          }}>{tab === 'boost' ? 'Boost profile' : 'UniDate Premium'}</h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-2)',
            margin: 0, lineHeight: 1.4, padding: '0 32px',
          }}>{tab === 'boost'
            ? 'Hiển thị đầu danh sách trong 30 phút · Được match nhanh hơn 10 lần'
            : 'Mọi tính năng cao cấp · Hủy bất kỳ lúc nào'}</p>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex', gap: 4,
          margin: '0 18px 8px',
          padding: 4,
          background: 'var(--surface-container)',
          borderRadius: 999,
        }}>
          {[
            { id: 'boost', label: '⚡ Boost', sub: 'Một lần' },
            { id: 'premium', label: '★ Premium', sub: 'Hàng tháng' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 'none',
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              color: tab === t.id ? 'var(--fg-1)' : 'var(--fg-3)',
              borderRadius: 999, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
              boxShadow: tab === t.id ? 'var(--elev-1)' : 'none',
              transition: 'all 150ms',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 16px' }}>
          {tab === 'boost' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BOOST_TIERS.map(t => {
                const selected = tier === t.id;
                return (
                  <button key={t.id} onClick={() => setTier(t.id)} style={{
                    padding: '14px 16px',
                    border: selected ? '2px solid var(--primary)' : '1.5px solid var(--outline)',
                    background: selected ? 'var(--primary-container)' : 'var(--surface)',
                    borderRadius: 18, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: selected ? 'none' : '2px solid var(--outline)',
                      background: selected ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flex: '0 0 22px',
                    }}>
                      {selected && <Icon name="check" size={14} color="#fff" weight={700}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                        color: 'var(--fg-1)',
                      }}>{t.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{t.sub}</div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                      color: 'var(--fg-1)', letterSpacing: '-0.01em',
                    }}>{t.price}</div>
                    {t.save && (
                      <div style={{
                        position: 'absolute', top: -8, right: 16,
                        padding: '2px 8px', borderRadius: 999,
                        background: t.highlight ? 'var(--primary)' : 'var(--success)',
                        color: '#fff', fontSize: 9.5, fontWeight: 800, letterSpacing: '0.05em',
                      }}>{t.save}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'premium' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Plan card */}
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(214,51,108,0.08) 0%, rgba(139,92,246,0.08) 100%)',
                border: '2px solid var(--primary)',
                borderRadius: 18,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -10, right: 14,
                  padding: '3px 10px', borderRadius: 999,
                  background: 'var(--grad-love)', color: '#fff',
                  fontSize: 9.5, fontWeight: 800, letterSpacing: '0.06em',
                }}>TIẾT KIỆM 33%</div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)',
                }}>3 tháng</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                  color: 'var(--fg-1)', letterSpacing: '-0.02em', marginTop: 2,
                }}>
                  199.000đ<span style={{ fontSize: 14, color: 'var(--fg-3)', fontWeight: 500 }}>/tháng</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 4 }}>
                  Tổng 597.000đ · Hủy bất kỳ lúc nào
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)',
                letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>
                Bao gồm
              </div>
              {PREMIUM_PERKS.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 0',
                  borderBottom: i < PREMIUM_PERKS.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'var(--primary-container)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name={p.ico} size={18} fill={1}/></div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--fg-1)' }}>{p.label}</span>
                  <Icon name="check" size={18} color="var(--success)" weight={600}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{
          padding: '12px 18px 28px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--outline-variant)',
        }}>
          <button style={{
            width: '100%', padding: '15px',
            border: 'none', borderRadius: 999, cursor: 'pointer',
            background: tab === 'boost'
              ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
              : 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
            color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
            boxShadow: 'var(--elev-love)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name={tab === 'boost' ? 'bolt' : 'workspace_premium'} size={20} fill={1}/>
            {tab === 'boost'
              ? `Mua ${BOOST_TIERS.find(t => t.id === tier).label} — ${BOOST_TIERS.find(t => t.id === tier).price}`
              : 'Bắt đầu UniDate Premium'}
          </button>
          <div style={{
            textAlign: 'center', fontSize: 10.5, color: 'var(--fg-3)',
            marginTop: 8, fontWeight: 500,
          }}>
            Thanh toán qua App Store / Google Play · Có thể hủy
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BoostSheet });
