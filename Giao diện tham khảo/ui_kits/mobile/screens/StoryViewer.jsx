// Story viewer — full-screen, taps to navigate, progress bars + 24h countdown.

const STORY_USER = {
  name: 'Linh',
  uni: 'HCMUS',
  initial: 'L',
  palette: 'linear-gradient(180deg, #c4b5fd, #d6336c)',
};

const STORY_FRAMES = [
  {
    bg: 'linear-gradient(160deg, #fef3c7 0%, #d6336c 100%)',
    text: 'Sáng nay ở Highland sương đẹp quá ☕',
    posted: '4 giờ trước',
    countdown: '20 giờ',
  },
  {
    bg: 'linear-gradient(160deg, #c4b5fd 0%, #8b5cf6 50%, #3b82f6 100%)',
    text: 'Ai cùng đi Đà Lạt cuối tuần này không 🏔️',
    posted: '3 giờ trước',
    countdown: '21 giờ',
  },
  {
    bg: 'linear-gradient(160deg, #a7f3d0 0%, #06b6d4 100%)',
    text: 'Demo robot tại CLB BK — xịn quá xá 🤖',
    posted: '1 giờ trước',
    countdown: '23 giờ',
  },
];

const StoryViewer = ({ onClose }) => {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const FRAME_DURATION = 5000; // ms

  React.useEffect(() => {
    if (paused) return;
    let raf;
    let start = performance.now() - (progress * FRAME_DURATION);
    const tick = (t) => {
      const elapsed = t - start;
      const pct = elapsed / FRAME_DURATION;
      if (pct >= 1) {
        if (idx < STORY_FRAMES.length - 1) {
          setIdx(i => i + 1);
          setProgress(0);
        } else {
          onClose && onClose();
        }
      } else {
        setProgress(pct);
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, paused]);

  React.useEffect(() => { setProgress(0); }, [idx]);

  const frame = STORY_FRAMES[idx];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Story bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: frame.bg,
        transition: 'background 350ms',
      }}/>

      {/* Subtle dark scrim top + bottom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 140,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
      }}/>

      {/* Progress bars */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12,
        display: 'flex', gap: 4, zIndex: 5,
      }}>
        {STORY_FRAMES.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.35)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: i < idx ? '100%' : i === idx ? `${progress * 100}%` : '0%',
              background: '#fff',
              transition: i === idx ? 'none' : 'width 200ms',
            }}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 28, left: 12, right: 12,
        display: 'flex', alignItems: 'center', gap: 10,
        zIndex: 5,
      }}>
        <Avatar initial={STORY_USER.initial} size={36} gradient={STORY_USER.palette}/>
        <div style={{ flex: 1, color: '#fff' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}>
            {STORY_USER.name}, 21
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '1px 6px 1px 4px',
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 999,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)', color: 'var(--tertiary)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 7, fontWeight: 800,
              }}>{STORY_USER.uni}</span>
              {STORY_USER.uni}
            </span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, opacity: 0.85,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            marginTop: 1,
          }}>
            {frame.posted} · còn lại {frame.countdown}
          </div>
        </div>
        <IconBtn icon="volume_off" color="#fff" bg="rgba(255,255,255,0.18)" size={36}/>
        <IconBtn icon="more_vert" color="#fff" bg="rgba(255,255,255,0.18)" size={36}/>
        <IconBtn icon="close" color="#fff" bg="rgba(255,255,255,0.18)" size={36} onClick={onClose}/>
      </div>

      {/* Big initial as photo placeholder */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 260,
        color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.04em',
        userSelect: 'none',
      }}>{STORY_USER.initial}</div>

      {/* Caption — Instagram-style, left-aligned, bottom area */}
      <div style={{
        position: 'absolute', left: 18, right: 100, bottom: 96,
        color: '#fff',
        fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 16,
        textShadow: '0 2px 8px rgba(0,0,0,0.45)',
        lineHeight: 1.35,
        letterSpacing: '-0.005em',
        zIndex: 4,
      }}>{frame.text}</div>

      {/* Tap zones (left/right/center) */}
      <div onClick={() => setIdx(i => Math.max(0, i - 1))} style={{
        position: 'absolute', left: 0, top: 60, bottom: 90, width: '30%', zIndex: 3,
      }}/>
      <div onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)} onMouseLeave={() => setPaused(false)}
        style={{ position: 'absolute', left: '30%', right: '30%', top: 60, bottom: 90, zIndex: 3 }}/>
      <div onClick={() => setIdx(i => Math.min(STORY_FRAMES.length - 1, i + 1))} style={{
        position: 'absolute', right: 0, top: 60, bottom: 90, width: '30%', zIndex: 3,
      }}/>

      {/* Reply composer */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 32,
        display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 5,
      }}>
        <div style={{
          flex: 1,
          padding: '11px 18px',
          background: 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 999,
          color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
        }}>Trả lời {STORY_USER.name}…</div>
        <button style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="favorite_border" size={20}/></button>
        <button style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="send" size={20}/></button>
      </div>
    </div>
  );
};

Object.assign(window, { StoryViewer });
