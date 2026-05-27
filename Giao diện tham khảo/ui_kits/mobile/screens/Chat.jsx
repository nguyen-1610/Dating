// Chat screen — 1-on-1 messaging with Đăng.

const SEED_MSGS = [
  { from: 'them', text: 'Hi! Cảm ơn vì super-like nha 😄', time: '14:02' },
  { from: 'me',   text: 'Hi Đăng! Profile bạn ngầu thiệt, robot là sở thích của mình từ hồi cấp 3 á', time: '14:04' },
  { from: 'them', text: 'Trùng hợp ghê 🤩', time: '14:04' },
  { from: 'them', image: 'linear-gradient(135deg, #a7f3d0 0%, #06b6d4 50%, #8b5cf6 100%)', caption: 'Demo robot tuần trước', time: '14:05' },
  { from: 'them', text: 'Cuối tuần này CLB Robotics BK có demo, bạn ghé chơi không?', time: '14:05' },
  { from: 'me',   text: 'Wow nghe hấp dẫn quá! Mấy giờ vậy?', time: '14:06' },
];

const Bubble = ({ msg, prevSameSide, onOpenImage }) => {
  const isMe = msg.from === 'me';
  if (msg.image) {
    return (
      <div style={{
        display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
        gap: 6, alignItems: 'flex-end',
        marginTop: prevSameSide ? 4 : 10,
      }}>
        {!isMe && (
          <div style={{ width: 28, opacity: prevSameSide ? 0 : 1 }}>
            {!prevSameSide && <Avatar initial="Đ" size={28}/>}
          </div>
        )}
        <div onClick={() => onOpenImage(msg)}
          style={{
            width: 200, borderRadius: 20,
            overflow: 'hidden',
            cursor: 'zoom-in',
            boxShadow: 'var(--elev-2)',
            border: '1px solid var(--outline-variant)',
          }}>
          <div style={{
            height: 240,
            background: msg.image,
            position: 'relative',
            display: 'flex', alignItems: 'flex-end',
          }}>
            {/* Fake content placeholder */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 800,
              color: 'rgba(255,255,255,0.40)',
            }}>📷</div>
          </div>
          {msg.caption && (
            <div style={{
              padding: '8px 12px',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg-1)',
              background: 'var(--surface-container)',
            }}>{msg.caption}</div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
      gap: 6, alignItems: 'flex-end',
      marginTop: prevSameSide ? 3 : 10,
    }}>
      {!isMe && (
        <div style={{ width: 28, opacity: prevSameSide ? 0 : 1 }}>
          {!prevSameSide && <Avatar initial="Đ" size={28}/>}
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '10px 14px',
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: '20px',
        borderRadius: 20,
        ...(isMe ? {
          background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
          color: '#fff',
          borderBottomRightRadius: prevSameSide ? 20 : 6,
          borderTopRightRadius: prevSameSide ? 6 : 20,
          boxShadow: '0 3px 8px rgba(214, 51, 108,0.18)',
        } : {
          background: 'var(--surface-container)',
          color: 'var(--fg-1)',
          borderBottomLeftRadius: prevSameSide ? 20 : 6,
          borderTopLeftRadius: prevSameSide ? 6 : 20,
        }),
      }}>{msg.text}</div>
    </div>
  );
};

// Full-screen image viewer (tap-to-dismiss).
const ImageLightbox = ({ msg, onClose }) => {
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      animation: 'lbFade 220ms ease',
    }}>
      <style>{`
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbScale { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      <header style={{
        padding: '14px 14px 10px',
        display: 'flex', alignItems: 'center', gap: 8,
        color: '#fff',
      }}>
        <Avatar initial="Đ" size={36}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Đăng, 22</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>{msg.time}</div>
        </div>
        <IconBtn icon="download" color="#fff" bg="rgba(255,255,255,0.16)" size={40}/>
        <IconBtn icon="close" color="#fff" bg="rgba(255,255,255,0.16)" size={40} onClick={onClose}/>
      </header>
      <div onClick={onClose} style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, cursor: 'zoom-out',
      }}>
        <div style={{
          width: '100%', maxWidth: 340, aspectRatio: '1 / 1',
          borderRadius: 24,
          background: msg.image,
          animation: 'lbScale 280ms cubic-bezier(0.05, 0.7, 0.1, 1)',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 100,
          }}>📷</div>
        </div>
      </div>
      {msg.caption && (
        <div style={{
          padding: '0 24px 16px',
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center', fontSize: 14,
        }}>{msg.caption}</div>
      )}
      <div style={{
        padding: '0 16px 28px',
        display: 'flex', gap: 10,
      }}>
        <div style={{
          flex: 1,
          padding: '12px 18px',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 999, color: '#fff',
          fontSize: 13, fontWeight: 500,
        }}>Trả lời ảnh này…</div>
        <button style={{
          width: 44, height: 44, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.16)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}><Icon name="favorite_border" size={20}/></button>
      </div>
    </div>
  );
};

const ChatScreen = ({ onBack }) => {
  const [msgs, setMsgs] = React.useState(SEED_MSGS);
  const [draft, setDraft] = React.useState('');
  const [lightbox, setLightbox] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { from: 'me', text: draft, time: 'now' }]);
    setDraft('');
    // Auto-reply
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'them', text: 'Mình check lại rồi nhắn bạn nha 👌', time: 'now' }]);
    }, 1200);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--outline-variant)',
        zIndex: 5,
      }}>
        <IconBtn icon="arrow_back_ios_new" onClick={onBack}/>
        <Avatar initial="Đ" size={40} online/>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
            color: 'var(--fg-1)', lineHeight: '20px',
          }}>Đăng, 22</div>
          <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: 'var(--success)', marginRight: 5, verticalAlign: 'middle',
            }}/>Đang online
          </div>
        </div>
        <IconBtn icon="videocam" color="var(--primary)"/>
        <IconBtn icon="more_vert"/>
      </header>

      {/* Match banner */}
      <div style={{
        margin: '12px 16px 6px',
        padding: '10px 14px',
        background: 'var(--primary-container)',
        color: 'var(--on-primary-container)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 12,
      }}>
        <Icon name="favorite" size={18} fill={1} color="var(--primary)"/>
        <div>
          <div style={{ fontWeight: 700 }}>Match từ 2 giờ trước</div>
          <div style={{ opacity: 0.85 }}>BK · Cơ điện tử · Năm 4</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto',
        padding: '8px 14px 12px',
      }}>
        {msgs.map((m, i) => (
          <Bubble key={i} msg={m} prevSameSide={i > 0 && msgs[i-1].from === m.from}
            onOpenImage={setLightbox}/>
        ))}
        <div style={{
          textAlign: 'right', fontSize: 10, color: 'var(--fg-3)',
          fontWeight: 600, marginTop: 4, paddingRight: 4,
        }}>Đã xem · vừa xong</div>
      </div>

      {/* Composer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px 100px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--outline-variant)',
      }}>
        <IconBtn icon="add" bg="var(--surface-container)" color="var(--primary)"/>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 4,
          background: 'var(--surface-container)',
          borderRadius: 999,
          padding: '4px 4px 4px 14px',
        }}>
          <input
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Nhắn tin..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-body)', fontSize: 14, padding: '8px 0',
              color: 'var(--fg-1)',
            }}/>
          <IconBtn icon="mood" color="var(--fg-3)" size={36}/>
        </div>
        <button onClick={send} style={{
          width: 40, height: 40, borderRadius: '50%', border: 'none',
          background: draft.trim() ? 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)' : 'var(--surface-container-high)',
          color: draft.trim() ? '#fff' : 'var(--fg-3)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms',
        }}>
          <Icon name="send" size={20} fill={draft.trim() ? 1 : 0}/>
        </button>
      </div>

      <ImageLightbox msg={lightbox} onClose={() => setLightbox(null)}/>
    </div>
  );
};

Object.assign(window, { ChatScreen });
