// Match modal — overlays on top of any screen. Used after a successful like.
// With confetti burst on entry for extra satisfaction.

const Confetti = () => {
  // 30 staggered confetti pieces flying outward
  const pieces = React.useMemo(() => Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 220 + Math.random() * 140;
    const rot = Math.random() * 720 - 360;
    const delay = Math.random() * 120;
    const dur = 900 + Math.random() * 600;
    const colors = ['#D6336C', '#8B5CF6', '#3B82F6', '#FBBF24', '#10B981', '#00C8FF', '#FFFFFF'];
    const shapes = ['rect', 'circle', 'streak'];
    return {
      i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      rot, delay, dur,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      size: 6 + Math.random() * 8,
    };
  }), []);
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '40%',
      width: 0, height: 0, pointerEvents: 'none', zIndex: 2,
    }}>
      <style>{`
        @keyframes confettiFly {
          0% { transform: translate(0, 0) rotate(0); opacity: 0; }
          12% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(var(--cx), calc(var(--cy) + 120px)) rotate(var(--cr)); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.i} style={{
          position: 'absolute',
          width: p.shape === 'streak' ? p.size * 0.4 : p.size,
          height: p.shape === 'streak' ? p.size * 2.2 : p.size,
          background: p.color,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          left: -p.size / 2, top: -p.size / 2,
          '--cx': `${p.x}px`,
          '--cy': `${p.y}px`,
          '--cr': `${p.rot}deg`,
          animation: `confettiFly ${p.dur}ms ${p.delay}ms cubic-bezier(0.15, 0.7, 0.25, 1) forwards`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}/>
      ))}
    </div>
  );
};

const MatchModal = ({ profile, onMessage, onDismiss }) => {
  if (!profile) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'matchFade 350ms ease',
    }}>
      <style>{`
        @keyframes matchFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes matchPop {
          0% { transform: scale(.7) rotate(-4deg); opacity: 0 }
          55% { transform: scale(1.04) rotate(1deg); opacity: 1 }
          100% { transform: scale(1) rotate(0); opacity: 1 }
        }
        @keyframes avBounce {
          0% { transform: translateY(30px) scale(.8) rotate(0); opacity: 0 }
          55% { transform: translateY(-10px) scale(1.05); opacity: 1 }
          100% { transform: translateY(0) scale(1); opacity: 1 }
        }
        @keyframes shimmer {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
      {/* Scrim */}
      <div onClick={onDismiss} style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(214, 51, 108,0.92) 0%, rgba(139,92,246,0.92) 50%, rgba(15,15,20,0.85) 100%)',
      }}/>

      <Confetti/>

      <div style={{
        position: 'relative', zIndex: 1,
        width: 320,
        padding: '32px 24px 22px',
        animation: 'matchPop 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 44, lineHeight: 1,
          letterSpacing: '-0.03em',
          textShadow: '0 2px 24px rgba(0,0,0,0.25)',
          animation: 'shimmer 2400ms ease-in-out 600ms infinite',
        }}>It's a Match!</div>
        <div style={{
          fontSize: 14, fontWeight: 500, opacity: 0.95, marginTop: 8,
          lineHeight: 1.4,
        }}>Bạn và {profile.name} đã thích nhau. <br/>Hãy gửi lời chào đầu tiên!</div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: -20,
          margin: '28px 0 22px',
        }}>
          <div style={{
            width: 116, height: 116, borderRadius: '50%',
            border: '5px solid #fff',
            background: 'linear-gradient(180deg, #c4b5fd, #d6336c)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: 14,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36,
            color: 'rgba(255,255,255,0.85)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            margin: '0 -16px',
            transform: 'rotate(-6deg)',
            animation: 'avBounce 700ms 150ms backwards cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>B</div>
          <div style={{
            width: 116, height: 116, borderRadius: '50%',
            border: '5px solid #fff',
            background: profile.palette || 'linear-gradient(180deg, #93c5fd, #8b5cf6)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            paddingBottom: 14,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36,
            color: 'rgba(255,255,255,0.85)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            margin: '0 -16px',
            transform: 'rotate(6deg)',
            animation: 'avBounce 700ms 300ms backwards cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>{profile.initial}</div>
        </div>

        <button onClick={onMessage} style={{
          width: '100%', padding: '15px',
          background: '#fff', color: 'var(--love-30)',
          border: 'none', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
          marginBottom: 10,
          boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
        }}>Nhắn tin cho {profile.name}</button>

        <button onClick={onDismiss} style={{
          width: '100%', padding: '14px',
          background: 'rgba(255,255,255,0.16)', color: '#fff',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
        }}>Tiếp tục khám phá</button>
      </div>
    </div>
  );
};

Object.assign(window, { MatchModal });
