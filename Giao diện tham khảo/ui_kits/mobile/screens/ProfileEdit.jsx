// Profile edit — edit bio, drag-to-reorder photos, add/remove interests, social links.

const ALL_INTERESTS = [
  'Cà phê', 'Đọc sách', 'AI', 'Anime', 'Guitar', 'Phim Hàn', 'Du lịch bụi',
  'Chạy bộ', 'Bóng đá', 'K-Pop', 'Gym', 'Nhiếp ảnh', 'Bóng rổ', 'Board game',
  'Phượt', 'Bún bò Huế', 'Trà sữa', 'Code', 'Robot', 'Vẽ', 'Hát',
];

const ProfileEditScreen = ({ onBack, onSave }) => {
  const [bio, setBio] = React.useState('Mình thích cà phê sáng, đọc sách cuối tuần, và phim Studio Ghibli. Đang học AI và tập chơi guitar 🎸');
  const [interests, setInterests] = React.useState(new Set(['Cà phê', 'Đọc sách', 'AI', 'Anime', 'Guitar', 'Phim Hàn', 'Du lịch bụi']));
  const [photos, setPhotos] = React.useState([
    { id: 1, fill: 'linear-gradient(160deg, #fbcfe8, #c4b5fd, #d6336c)', initial: 'B' },
    { id: 2, fill: 'linear-gradient(160deg, #bfdbfe, #8b5cf6)', initial: '2' },
    { id: 3, fill: 'linear-gradient(160deg, #fef3c7, #fbbf24)', initial: '3' },
    { id: 4, fill: 'linear-gradient(160deg, #a7f3d0, #06b6d4)', initial: '4' },
  ]);
  const [drag, setDrag] = React.useState(null); // dragged photo id
  const [over, setOver] = React.useState(null);
  const tileRefs = React.useRef({});
  const prevRects = React.useRef({});

  // Capture positions BEFORE each render so we can FLIP-animate the delta.
  React.useLayoutEffect(() => {
    const rects = {};
    Object.entries(tileRefs.current).forEach(([id, el]) => {
      if (el) rects[id] = el.getBoundingClientRect();
    });
    // After paint, compare to previous frame and animate the delta.
    Object.entries(rects).forEach(([id, rect]) => {
      const prev = prevRects.current[id];
      if (prev && (prev.left !== rect.left || prev.top !== rect.top)) {
        const dx = prev.left - rect.left;
        const dy = prev.top - rect.top;
        const el = tileRefs.current[id];
        if (!el) return;
        el.style.transition = 'none';
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        // Force reflow then animate to identity.
        // eslint-disable-next-line no-unused-expressions
        el.offsetWidth;
        el.style.transition = 'transform 320ms cubic-bezier(0.2, 0, 0, 1)';
        el.style.transform = 'translate(0, 0)';
      }
    });
    prevRects.current = rects;
  }, [photos]);

  const onDragStart = (id) => setDrag(id);
  const onDragOver = (e, id) => { e.preventDefault(); setOver(id); };
  const onDrop = () => {
    if (drag != null && over != null && drag !== over) {
      setPhotos(prev => {
        const a = prev.findIndex(p => p.id === drag);
        const b = prev.findIndex(p => p.id === over);
        const next = [...prev];
        const [moved] = next.splice(a, 1);
        next.splice(b, 0, moved);
        return next;
      });
    }
    setDrag(null); setOver(null);
  };
  const removePhoto = (id) => setPhotos(p => p.filter(x => x.id !== id));
  const addPhotoSlot = () => setPhotos(p => [...p, { id: Date.now(), placeholder: true }]);

  const toggleInterest = (i) => {
    setInterests(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-dim)' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 12px',
        background: 'var(--surface-dim)',
        zIndex: 5,
      }}>
        <IconBtn icon="close" onClick={onBack}/>
        <h2 style={{
          flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 22, letterSpacing: '-0.01em',
          color: 'var(--fg-1)', margin: 0, paddingLeft: 4,
        }}>Sửa hồ sơ</h2>
        <button onClick={onSave} style={{
          padding: '7px 18px', borderRadius: 999, border: 'none',
          background: 'var(--primary)', color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>Lưu</button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* Photos */}
        <Section title="Ảnh" hint={`${photos.filter(p => !p.placeholder).length} / 6 · Kéo để sắp xếp lại`}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
          }}>
            {photos.map((p, i) => {
              const isOver = over === p.id;
              const isDrag = drag === p.id;
              return (
                <div key={p.id}
                  ref={(el) => { tileRefs.current[p.id] = el; }}
                  draggable
                  onDragStart={() => onDragStart(p.id)}
                  onDragOver={(e) => onDragOver(e, p.id)}
                  onDrop={onDrop}
                  onDragEnd={() => { setDrag(null); setOver(null); }}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 16,
                    background: p.fill || 'var(--surface-container)',
                    border: p.placeholder ? '2px dashed var(--outline)' : 'none',
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                    color: 'rgba(255,255,255,0.5)',
                    cursor: p.placeholder ? 'pointer' : 'grab',
                    boxShadow: isOver && !isDrag ? '0 0 0 3px var(--primary)' : 'var(--elev-1)',
                    opacity: isDrag ? 0.3 : 1,
                    transition: 'all 200ms',
                  }}>
                  {p.placeholder ? (
                    <Icon name="add_a_photo" size={26} color="var(--fg-3)"/>
                  ) : (
                    <>
                      <span>{p.initial}</span>
                      {i === 0 && (
                        <span style={{
                          position: 'absolute', top: 6, left: 6,
                          padding: '2px 7px', borderRadius: 999,
                          background: 'var(--primary)', color: '#fff',
                          fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
                        }}>CHÍNH</span>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); removePhoto(p.id); }} style={{
                        position: 'absolute', top: 6, right: 6,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.55)', color: '#fff',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Icon name="close" size={14}/></button>
                      <div style={{
                        position: 'absolute', bottom: 6, right: 6,
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                        borderRadius: 6, padding: '2px 5px',
                        color: '#fff', fontSize: 9, fontWeight: 600,
                      }}>
                        <Icon name="drag_indicator" size={11} style={{ verticalAlign: 'middle' }}/>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {photos.length < 6 && (
              <div onClick={addPhotoSlot} style={{
                aspectRatio: '1 / 1', borderRadius: 16,
                background: 'var(--surface)',
                border: '2px dashed var(--outline)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-3)', cursor: 'pointer',
              }}><Icon name="add_a_photo" size={24}/></div>
            )}
          </div>
        </Section>

        {/* Bio */}
        <Section title="Giới thiệu" hint={`${bio.length} / 300`}>
          <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 300))}
            style={{
              width: '100%', minHeight: 100,
              padding: 14, borderRadius: 16,
              border: '1.5px solid var(--outline)',
              background: 'var(--surface)',
              fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: '20px',
              color: 'var(--fg-1)', outline: 'none', resize: 'none',
              boxSizing: 'border-box',
            }}/>
        </Section>

        {/* Interests */}
        <Section title="Sở thích" hint={`${interests.size} / 8 đã chọn`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_INTERESTS.map(i => {
              const on = interests.has(i);
              return (
                <button key={i} onClick={() => toggleInterest(i)} style={{
                  padding: on ? '7px 10px 7px 14px' : '7px 14px',
                  borderRadius: 999,
                  border: on ? 'none' : '1.5px solid var(--outline)',
                  background: on ? 'var(--primary-container)' : 'transparent',
                  color: on ? 'var(--on-primary-container)' : 'var(--fg-1)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  {i}
                  {on && <Icon name="close" size={14}/>}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Quick facts */}
        <Section title="Thông tin nhanh">
          <FactInput icon="height" label="Chiều cao" value="1m65"/>
          <FactInput icon="star" label="Cung hoàng đạo" value="Bảo Bình"/>
          <FactInput icon="favorite" label="Đang tìm" value="Hẹn hò nghiêm túc"/>
          <FactInput icon="local_cafe" label="Cà phê yêu thích" value="Cà phê đen · No sugar"/>
        </Section>

        {/* Social links */}
        <Section title="Mạng xã hội" hint="Chỉ hiển thị với match">
          <SocialInput icon="photo_camera" label="Instagram" placeholder="@username" value="@minhlinhh"/>
          <SocialInput icon="music_note" label="Spotify" placeholder="Bài hát yêu thích" value="Linh Phan — Cõi mộng"/>
          <SocialInput icon="movie" label="TikTok" placeholder="@username" value=""/>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{
      display: 'flex', alignItems: 'baseline',
      padding: '4px 20px 10px',
    }}>
      <span style={{
        flex: 1, fontFamily: 'var(--font-body)',
        fontSize: 13, fontWeight: 700, color: 'var(--fg-1)',
      }}>{title}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600 }}>{hint}</span>}
    </div>
    <div style={{
      margin: '0 16px',
      padding: 14,
      background: 'var(--surface)',
      borderRadius: 20,
      boxShadow: 'var(--elev-1)',
    }}>{children}</div>
  </div>
);

const FactInput = ({ icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '8px 0',
    borderBottom: '1px solid var(--outline-variant)',
  }}>
    <Icon name={icon} size={18} color="var(--fg-3)"/>
    <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-2)', fontWeight: 500 }}>{label}</div>
    <input value={value} onChange={() => {}} style={{
      flex: 1, textAlign: 'right',
      border: 'none', background: 'transparent', outline: 'none',
      fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)',
    }}/>
    <Icon name="chevron_right" size={18} color="var(--fg-4)"/>
  </div>
);

const SocialInput = ({ icon, label, placeholder, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--outline-variant)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: 'var(--surface-container)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={18} color="var(--fg-2)"/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>{label}</div>
      <input value={value} placeholder={placeholder} onChange={() => {}} style={{
        width: '100%', border: 'none', background: 'transparent', outline: 'none',
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: value ? 'var(--fg-1)' : 'var(--fg-3)',
        marginTop: 1, padding: 0,
      }}/>
    </div>
    {value && <Icon name="check" size={18} color="var(--success)"/>}
  </div>
);

Object.assign(window, { ProfileEditScreen });
