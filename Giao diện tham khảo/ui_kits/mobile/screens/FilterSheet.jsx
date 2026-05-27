// Filter / preference bottom sheet — slides up from below.

const UNIS = ['HCMUS', 'BK', 'UEH', 'FTU', 'RMIT', 'USSH', 'UEL', 'IU'];

const FilterSheet = ({ open, onClose, onApply }) => {
  const [ageMin, setAgeMin] = React.useState(19);
  const [ageMax, setAgeMax] = React.useState(25);
  const [distance, setDistance] = React.useState(10);
  const [unis, setUnis] = React.useState(new Set(['HCMUS', 'BK', 'UEH']));
  const [showVerified, setShowVerified] = React.useState(true);
  const [showOnline, setShowOnline] = React.useState(false);

  const toggleUni = (u) => {
    setUnis(prev => {
      const next = new Set(prev);
      next.has(u) ? next.delete(u) : next.add(u);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <style>{`
        @keyframes sheetSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scrimFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20,20,26,0.55)',
        animation: 'scrimFade 250ms ease',
      }}/>

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        maxHeight: '88%',
        display: 'flex', flexDirection: 'column',
        animation: 'sheetSlide 350ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      }}>
        {/* Handle */}
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--outline)' }}/>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '8px 18px 4px',
        }}>
          <h2 style={{
            flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 22, letterSpacing: '-0.01em',
            color: 'var(--fg-1)', margin: 0,
          }}>Bộ lọc khám phá</h2>
          <button onClick={() => { setAgeMin(18); setAgeMax(30); setDistance(25); setUnis(new Set()); setShowVerified(false); setShowOnline(false); }}
            style={{
              border: 'none', background: 'transparent',
              color: 'var(--primary)', fontFamily: 'var(--font-body)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Đặt lại</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 24px' }}>
          {/* Age range */}
          <Section label="Độ tuổi" trailing={`${ageMin} – ${ageMax}`}>
            <DualRange min={18} max={35} valueMin={ageMin} valueMax={ageMax}
              onChangeMin={setAgeMin} onChangeMax={setAgeMax}/>
          </Section>

          {/* Distance */}
          <Section label="Khoảng cách tối đa" trailing={`≤ ${distance} km`}>
            <SingleRange min={1} max={50} value={distance} onChange={setDistance}/>
          </Section>

          {/* University */}
          <Section label="Trường đại học" trailing={`${unis.size} đã chọn`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {UNIS.map(u => {
                const on = unis.has(u);
                return (
                  <button key={u} onClick={() => toggleUni(u)} style={{
                    padding: '7px 12px 7px 5px',
                    border: on ? 'none' : '1.5px solid var(--outline)',
                    background: on ? 'var(--tertiary-container)' : 'transparent',
                    color: on ? 'var(--on-tertiary-container)' : 'var(--fg-1)',
                    borderRadius: 999,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: on ? 'var(--tertiary)' : 'var(--surface-container)',
                      color: on ? '#fff' : 'var(--fg-3)',
                      fontSize: 9, fontWeight: 800,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>{u}</span>
                    {u}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Toggles */}
          <Section label="Tuỳ chọn khác">
            <ToggleRow icon="verified" label="Đã xác thực .edu.vn" sub="Ẩn người chưa xác thực"
              value={showVerified} onChange={setShowVerified}/>
            <ToggleRow icon="bolt" label="Chỉ hiển thị người đang online" sub="Trong 15 phút qua"
              value={showOnline} onChange={setShowOnline}/>
          </Section>
        </div>

        {/* CTA */}
        <div style={{
          padding: '12px 18px 28px',
          borderTop: '1px solid var(--outline-variant)',
          background: 'var(--surface)',
        }}>
          <button onClick={onApply} style={{
            width: '100%', padding: '15px',
            border: 'none', borderRadius: 999, cursor: 'pointer',
            background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
            color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
            boxShadow: 'var(--elev-love)',
          }}>Xem 84 người phù hợp</button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ label, trailing, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{
      display: 'flex', alignItems: 'baseline',
      marginBottom: 12,
    }}>
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
        color: 'var(--fg-1)',
      }}>{label}</span>
      {trailing && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--primary)', fontWeight: 700,
        }}>{trailing}</span>
      )}
    </div>
    {children}
  </div>
);

const ToggleRow = ({ icon, label, sub, value, onChange }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0',
    borderTop: '1px solid var(--outline-variant)',
  }}>
    <Icon name={icon} size={22} color="var(--fg-2)"/>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg-1)' }}>{label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 1 }}>{sub}</div>
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

const SingleRange = ({ min, max, value, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const [active, setActive] = React.useState(false);
  return (
    <div style={{ padding: '8px 0 18px' }}>
      <div style={{ position: 'relative', height: 32 }}>
        {/* Track inactive */}
        <div style={{
          position: 'absolute', top: 14, left: 0, right: 0, height: 4,
          background: 'var(--surface-container-high)',
          borderRadius: 2,
        }}/>
        {/* Track active (filled) */}
        <div style={{
          position: 'absolute', top: 14, left: 0, width: `${pct}%`, height: 4,
          background: 'var(--primary)',
          borderRadius: 2,
        }}/>
        {/* Tick marks at stops */}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 15, left: `calc(${i * 20}% - 1px)`,
            width: 2, height: 2, borderRadius: 1,
            background: i * 20 < pct ? 'rgba(255,255,255,0.6)' : 'var(--outline)',
          }}/>
        ))}
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          top: 6, left: `calc(${pct}% - 10px)`,
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: active
            ? '0 0 0 10px rgba(214, 51, 108, 0.16), 0 1px 3px rgba(0,0,0,0.20)'
            : '0 1px 3px rgba(0,0,0,0.20)',
          transition: 'box-shadow 200ms',
          pointerEvents: 'none',
        }}/>
        {/* Value label (M3 floating) */}
        {active && (
          <div style={{
            position: 'absolute',
            top: -32, left: `calc(${pct}% - 22px)`,
            width: 44, height: 28,
            background: 'var(--primary)', color: '#fff',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            animation: 'm3LabelIn 150ms ease',
          }}>{value}</div>
        )}
        {/* Real input (invisible, full-width) */}
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
          onTouchStart={() => setActive(true)} onTouchEnd={() => setActive(false)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', WebkitAppearance: 'none',
          }}/>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: 'var(--fg-3)', fontWeight: 600,
        marginTop: 2, fontFamily: 'var(--font-mono)',
      }}>
        <span>{min} km</span>
        <span>{max} km</span>
      </div>
    </div>
  );
};

const DualRange = ({ min, max, valueMin, valueMax, onChangeMin, onChangeMax }) => {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;
  const [active, setActive] = React.useState(null); // 'min' | 'max' | null

  return (
    <div style={{ padding: '8px 0 18px' }}>
      <style>{`
        @keyframes m3LabelIn { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      <div style={{ position: 'relative', height: 32 }}>
        {/* Track inactive */}
        <div style={{
          position: 'absolute', top: 14, left: 0, right: 0, height: 4,
          background: 'var(--surface-container-high)',
          borderRadius: 2,
        }}/>
        {/* Track active */}
        <div style={{
          position: 'absolute', top: 14, height: 4,
          left: `${pctMin}%`, right: `${100 - pctMax}%`,
          background: 'var(--primary)',
          borderRadius: 2,
        }}/>
        {/* Tick stops */}
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const tickPct = (i / (max - min)) * 100;
          const inRange = tickPct >= pctMin && tickPct <= pctMax;
          if (i % 2 !== 0) return null;
          return (
            <div key={i} style={{
              position: 'absolute',
              top: 15, left: `calc(${tickPct}% - 1px)`,
              width: 2, height: 2, borderRadius: 1,
              background: inRange ? 'rgba(255,255,255,0.6)' : 'var(--outline)',
            }}/>
          );
        })}

        {/* Min thumb */}
        <div style={{
          position: 'absolute',
          top: 6, left: `calc(${pctMin}% - 10px)`,
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: active === 'min'
            ? '0 0 0 10px rgba(214, 51, 108, 0.16), 0 1px 3px rgba(0,0,0,0.20)'
            : '0 1px 3px rgba(0,0,0,0.20)',
          transition: 'box-shadow 200ms',
          pointerEvents: 'none',
          zIndex: 2,
        }}/>
        {active === 'min' && (
          <div style={{
            position: 'absolute',
            top: -32, left: `calc(${pctMin}% - 22px)`,
            width: 44, height: 28,
            background: 'var(--primary)', color: '#fff',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            animation: 'm3LabelIn 150ms ease',
            zIndex: 3,
          }}>{valueMin}</div>
        )}

        {/* Max thumb */}
        <div style={{
          position: 'absolute',
          top: 6, left: `calc(${pctMax}% - 10px)`,
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: active === 'max'
            ? '0 0 0 10px rgba(214, 51, 108, 0.16), 0 1px 3px rgba(0,0,0,0.20)'
            : '0 1px 3px rgba(0,0,0,0.20)',
          transition: 'box-shadow 200ms',
          pointerEvents: 'none',
          zIndex: 2,
        }}/>
        {active === 'max' && (
          <div style={{
            position: 'absolute',
            top: -32, left: `calc(${pctMax}% - 22px)`,
            width: 44, height: 28,
            background: 'var(--primary)', color: '#fff',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            animation: 'm3LabelIn 150ms ease',
            zIndex: 3,
          }}>{valueMax}</div>
        )}

        {/* Min input (left half) */}
        <input type="range" min={min} max={max} value={valueMin}
          onChange={e => onChangeMin(Math.min(valueMax - 1, parseInt(e.target.value)))}
          onMouseDown={() => setActive('min')} onMouseUp={() => setActive(null)}
          onTouchStart={() => setActive('min')} onTouchEnd={() => setActive(null)}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: `calc(${(pctMin + pctMax) / 2}% + 10px)`, height: '100%',
            opacity: 0, cursor: 'pointer', zIndex: 1,
          }}/>
        {/* Max input (right half) */}
        <input type="range" min={min} max={max} value={valueMax}
          onChange={e => onChangeMax(Math.max(valueMin + 1, parseInt(e.target.value)))}
          onMouseDown={() => setActive('max')} onMouseUp={() => setActive(null)}
          onTouchStart={() => setActive('max')} onTouchEnd={() => setActive(null)}
          style={{
            position: 'absolute', top: 0, right: 0,
            width: `calc(${100 - (pctMin + pctMax) / 2}% + 10px)`, height: '100%',
            opacity: 0, cursor: 'pointer', zIndex: 1,
          }}/>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: 'var(--fg-3)', fontWeight: 600,
        marginTop: 6, fontFamily: 'var(--font-mono)',
      }}>
        <span>{min}</span>
        <span>{max}+</span>
      </div>
    </div>
  );
};

Object.assign(window, { FilterSheet });
