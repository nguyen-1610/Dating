// Onboarding intro splash — shown before the 5-step wizard.
// Brand-first hero with the value prop and primary CTA.

const OnboardingSplash = ({ onContinue, onSignIn }) => (
  <div style={{
    height: '100%', position: 'relative',
    background: 'linear-gradient(160deg, #fff8fb 0%, #f1ebff 50%, #dbeafe 100%)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  }}>
    <style>{`
      @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-8px) rotate(-6deg); } }
      @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(8deg); } 50% { transform: translateY(-10px) rotate(8deg); } }
      @keyframes floatC { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(-3deg); } }
      @keyframes orbit { from { transform: rotate(0deg) translateX(0); } to { transform: rotate(360deg) translateX(0); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>

    {/* Decorative blurred blobs */}
    <div style={{
      position: 'absolute', top: -60, right: -60,
      width: 240, height: 240, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(214,51,108,0.35) 0%, transparent 70%)',
      filter: 'blur(20px)',
    }}/>
    <div style={{
      position: 'absolute', bottom: 100, left: -40,
      width: 200, height: 200, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 70%)',
      filter: 'blur(24px)',
    }}/>

    {/* Floating preview cards (the value prop, visualized) */}
    <div style={{
      position: 'absolute', top: 80, left: 0, right: 0,
      height: 380,
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 30, left: 30,
        width: 130, height: 180, borderRadius: 22,
        background: 'linear-gradient(180deg, #c4b5fd 0%, #d6336c 100%)',
        boxShadow: '0 16px 40px rgba(20,20,26,0.18)',
        animation: 'floatA 5s ease-in-out infinite',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 12, color: '#fff',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, opacity: .85, letterSpacing: '0.04em' }}>HCMUS · Năm 3</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginTop: 2 }}>Linh, 21</div>
      </div>
      <div style={{
        position: 'absolute', top: 0, right: 30,
        width: 130, height: 180, borderRadius: 22,
        background: 'linear-gradient(180deg, #93c5fd 0%, #8b5cf6 100%)',
        boxShadow: '0 16px 40px rgba(20,20,26,0.18)',
        animation: 'floatB 5.5s ease-in-out infinite',
        animationDelay: '0.5s',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 12, color: '#fff',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, opacity: .85, letterSpacing: '0.04em' }}>BK · Năm 4</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginTop: 2 }}>Đăng, 22</div>
      </div>
      <div style={{
        position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)',
        width: 140, height: 180, borderRadius: 22,
        background: 'linear-gradient(180deg, #fbbf24 0%, #d6336c 100%)',
        boxShadow: '0 18px 44px rgba(20,20,26,0.20)',
        animation: 'floatC 6s ease-in-out infinite',
        animationDelay: '0.25s',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 12, color: '#fff',
        zIndex: 2,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, opacity: .85, letterSpacing: '0.04em' }}>UEH · Năm 2</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginTop: 2 }}>Mai, 20</div>
      </div>

      {/* Verified seal floating */}
      <div style={{
        position: 'absolute', top: 96, right: 12,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 999,
        padding: '6px 12px 6px 8px',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '0 8px 18px rgba(20,20,26,0.12)',
        fontSize: 11, fontWeight: 700, color: 'var(--success)',
        zIndex: 3,
      }}>
        <Icon name="verified" size={16} fill={1} color="var(--success)"/>
        .edu.vn verified
      </div>
    </div>

    {/* Bottom content */}
    <div style={{
      marginTop: 'auto',
      padding: '32px 28px 40px',
      position: 'relative', zIndex: 5,
      display: 'flex', flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 14px 5px 5px',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 999,
        boxShadow: '0 4px 12px rgba(20,20,26,0.06)',
        alignSelf: 'flex-start',
        animation: 'fadeUp 600ms 100ms backwards ease',
      }}>
        <img src="../../assets/logo-mark.svg" width={24} height={24} alt=""/>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
          color: 'var(--fg-1)', letterSpacing: '-0.005em',
        }}>UniDate · Chỉ dành cho sinh viên</span>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.03em',
        margin: 0,
        background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent',
        animation: 'fadeUp 700ms 200ms backwards ease',
      }}>
        Yêu ở<br/>giảng đường.
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.45,
        color: 'var(--fg-2)', margin: 0,
        animation: 'fadeUp 700ms 300ms backwards ease',
      }}>
        Match với sinh viên đã xác thực <code style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}>.edu.vn</code> từ các trường ở Việt Nam. Hồ sơ thật. Bạn cùng trường. Không drama.
      </p>

      <button onClick={onContinue} style={{
        marginTop: 8,
        width: '100%', padding: '16px',
        border: 'none', borderRadius: 999, cursor: 'pointer',
        background: 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)',
        color: '#fff',
        fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700,
        boxShadow: 'var(--elev-love)',
        animation: 'fadeUp 700ms 400ms backwards ease',
      }}>Tạo hồ sơ — mất 2 phút</button>

      <button onClick={onSignIn} style={{
        width: '100%', padding: '12px',
        border: 'none', background: 'transparent',
        color: 'var(--fg-2)',
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>Đã có tài khoản? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Đăng nhập</span></button>

      <div style={{
        textAlign: 'center', fontSize: 10.5, color: 'var(--fg-3)',
        marginTop: 4, lineHeight: 1.4,
      }}>
        Bằng cách tiếp tục, bạn đồng ý với <u>Điều khoản</u> & <u>Chính sách bảo mật</u>.
      </div>
    </div>
  </div>
);

Object.assign(window, { OnboardingSplash });
