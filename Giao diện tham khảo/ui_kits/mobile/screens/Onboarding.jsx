// Onboarding — 5-step wizard: name, birthday, gender, university, photos.

const STEPS = [
  { id: 'name',  title: 'Tên bạn là gì?',         sub: 'Đây là tên hiển thị trên hồ sơ.' },
  { id: 'bday',  title: 'Sinh nhật của bạn?',     sub: 'Chúng tớ chỉ hiển thị tuổi, không phải ngày.' },
  { id: 'gender',title: 'Bạn là...?',             sub: 'Bạn có thể đổi sau.' },
  { id: 'uni',   title: 'Trường của bạn?',        sub: 'Cần email .edu.vn để xác thực sinh viên.' },
  { id: 'photo', title: 'Thêm ảnh đầu tiên',      sub: 'Hồ sơ có ảnh nhận nhiều match hơn 8 lần.' },
];

const OnboardingScreen = ({ onDone }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    name: '', day: '', month: '', year: '',
    gender: '', uni: '', major: '',
  });
  const cur = STEPS[step];
  const progress = (step + 1) / STEPS.length;

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onDone && onDone();
  };
  const back = () => step > 0 && setStep(step - 1);

  const canNext = (() => {
    if (cur.id === 'name') return data.name.length >= 2;
    if (cur.id === 'bday') return data.day && data.month && data.year;
    if (cur.id === 'gender') return !!data.gender;
    if (cur.id === 'uni') return !!data.uni;
    return true;
  })();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      {/* Top: progress + back */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 18,
        }}>
          <IconBtn icon="arrow_back_ios_new" onClick={back}
            color={step === 0 ? 'var(--fg-4)' : 'var(--fg-1)'}/>
          <div style={{ flex: 1, height: 4, background: 'var(--surface-container-high)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${progress * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #d6336c, #8b5cf6)',
              borderRadius: 2,
              transition: 'width 350ms cubic-bezier(0.2, 0, 0, 1)',
            }}/>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', minWidth: 32, textAlign: 'right' }}>
            {step + 1}/{STEPS.length}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0, lineHeight: 1.15,
        }}>{cur.title}</h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'var(--fg-3)', margin: '8px 0 28px', lineHeight: 1.4,
        }}>{cur.sub}</p>

        {cur.id === 'name' && (
          <input autoFocus value={data.name} onChange={e => set('name', e.target.value)}
            placeholder="VD: Minh Linh"
            style={{
              width: '100%', padding: '18px 0',
              border: 'none', borderBottom: '2px solid var(--primary)',
              background: 'transparent', outline: 'none',
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600,
              color: 'var(--fg-1)',
            }}/>
        )}

        {cur.id === 'bday' && (
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { k: 'day',   ph: 'NGÀY',  max: 2 },
              { k: 'month', ph: 'THÁNG', max: 2 },
              { k: 'year',  ph: 'NĂM',   max: 4, flex: 1.4 },
            ].map(f => (
              <div key={f.k} style={{ flex: f.flex || 1 }}>
                <input
                  value={data[f.k]}
                  onChange={e => set(f.k, e.target.value.replace(/\D/g, '').slice(0, f.max))}
                  placeholder={f.ph}
                  style={{
                    width: '100%', padding: '18px 14px',
                    border: '1.5px solid var(--outline)', borderRadius: 16,
                    background: 'var(--surface-container-low)',
                    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
                    color: 'var(--fg-1)', textAlign: 'center',
                    outline: 'none',
                  }}/>
              </div>
            ))}
          </div>
        )}

        {cur.id === 'gender' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { v: 'female',  l: 'Nữ', icon: 'female' },
              { v: 'male',    l: 'Nam', icon: 'male' },
              { v: 'nonbin',  l: 'Phi nhị nguyên', icon: 'transgender' },
              { v: 'other',   l: 'Khác / không muốn nói', icon: 'more_horiz' },
            ].map(opt => (
              <button key={opt.v} onClick={() => set('gender', opt.v)} style={{
                padding: '16px 18px', borderRadius: 18,
                border: data.gender === opt.v ? '2px solid var(--primary)' : '1.5px solid var(--outline)',
                background: data.gender === opt.v ? 'var(--primary-container)' : 'transparent',
                color: data.gender === opt.v ? 'var(--on-primary-container)' : 'var(--fg-1)',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <Icon name={opt.icon} size={22}
                  color={data.gender === opt.v ? 'var(--primary)' : 'var(--fg-3)'}/>
                {opt.l}
              </button>
            ))}
          </div>
        )}

        {cur.id === 'uni' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { c: 'HCMUS', n: 'ĐH Khoa học Tự nhiên TP.HCM' },
              { c: 'BK',    n: 'ĐH Bách Khoa TP.HCM' },
              { c: 'UEH',   n: 'ĐH Kinh tế TP.HCM' },
              { c: 'FTU',   n: 'ĐH Ngoại Thương' },
              { c: 'RMIT',  n: 'RMIT Việt Nam' },
              { c: 'USSH',  n: 'ĐH KHXH&NV' },
            ].map(u => (
              <button key={u.c} onClick={() => set('uni', u.c)} style={{
                padding: '12px 14px', borderRadius: 16,
                border: data.uni === u.c ? '2px solid var(--tertiary)' : '1.5px solid var(--outline)',
                background: data.uni === u.c ? 'var(--tertiary-container)' : 'transparent',
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                textAlign: 'left',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--tertiary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                }}>{u.c}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>{u.c}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{u.n}</div>
                </div>
                {data.uni === u.c && <Icon name="check_circle" fill={1} color="var(--tertiary)"/>}
              </button>
            ))}
          </div>
        )}

        {cur.id === 'photo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div style={{
              gridColumn: 'span 2', gridRow: 'span 2',
              aspectRatio: '1 / 1',
              borderRadius: 20,
              background: 'linear-gradient(160deg, #fbcfe8 0%, #c4b5fd 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80,
              color: 'rgba(255,255,255,0.6)',
              position: 'relative',
            }}>
              L
              <div style={{
                position: 'absolute', bottom: 8, right: 8,
                width: 34, height: 34, borderRadius: '50%',
                background: '#fff', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--elev-2)',
              }}><Icon name="check" size={20} fill={1}/></div>
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                aspectRatio: '1 / 1', borderRadius: 16,
                background: 'var(--surface-container)',
                border: '2px dashed var(--outline)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-3)',
              }}><Icon name="add_a_photo" size={24}/></div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 30px' }}>
        <button onClick={next} disabled={!canNext} style={{
          width: '100%', padding: '16px',
          border: 'none', borderRadius: 999, cursor: canNext ? 'pointer' : 'not-allowed',
          background: canNext
            ? 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)'
            : 'var(--surface-container-high)',
          color: canNext ? '#fff' : 'var(--fg-4)',
          fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700,
          boxShadow: canNext ? 'var(--elev-love)' : 'none',
          transition: 'all 200ms',
        }}>
          {step === STEPS.length - 1 ? 'Hoàn tất hồ sơ' : 'Tiếp tục'}
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { OnboardingScreen });
