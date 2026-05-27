// Feed — Threads-style social posts, story rail at the top.

const POSTS = [
  {
    id: 1, name: 'Linh', initial: 'L', uni: 'HCMUS', time: '12 phút',
    palette: 'linear-gradient(180deg, #c4b5fd, #d6336c)',
    text: 'Vừa thi xong môn Hệ điều hành 🥲 ai biết quán nào gần Q.5 có matcha ngon recommend mình với, mình cần được chữa lành sau cú này',
    likes: 34, comments: 12, image: false,
  },
  {
    id: 2, name: 'Quân', initial: 'Q', uni: 'FTU', time: '1 giờ',
    palette: 'linear-gradient(180deg, #a7f3d0, #06b6d4)',
    text: 'CLB Nhiếp ảnh FTU đang tuyển thành viên mới khoá 12 nè 📸 ai mê chụp ảnh DM mình lấy form nha',
    likes: 89, comments: 28, image: 'linear-gradient(135deg, #fef3c7 0%, #06b6d4 50%, #8b5cf6 100%)',
  },
  {
    id: 3, name: 'Mai', initial: 'M', uni: 'UEH', time: '3 giờ',
    palette: 'linear-gradient(180deg, #fbbf24, #d6336c)',
    text: 'Match được crush rồi mn ơiiiii 🫶 nhưng mà ko biết nhắn gì luôn, ai có template "lời chào đầu" cứu mình với',
    likes: 142, comments: 47,
  },
];

const Post = ({ post }) => (
  <article style={{
    display: 'flex', gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid var(--outline-variant)',
  }}>
    <Avatar initial={post.initial} size={40} gradient={post.palette}/>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          color: 'var(--fg-1)',
        }}>{post.name}</span>
        <UniBadge code={post.uni}/>
        <span style={{ fontSize: 12, color: 'var(--fg-3)', marginLeft: 'auto' }}>{post.time}</span>
        <Icon name="more_horiz" size={18} color="var(--fg-3)"/>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: '20px',
        color: 'var(--fg-1)', marginTop: 6,
      }}>{post.text}</div>
      {post.image && (
        <div style={{
          marginTop: 10, height: 200, borderRadius: 16,
          background: post.image,
          boxShadow: 'inset 0 0 0 1px rgba(20,20,26,0.04)',
          position: 'relative', overflow: 'hidden',
        }}/>
      )}
      <div style={{
        display: 'flex', gap: 18,
        marginTop: 12,
        color: 'var(--fg-2)',
        fontSize: 12, fontWeight: 600,
        alignItems: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="favorite_border" size={20}/> {post.likes}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="mode_comment" size={19}/> {post.comments}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="repeat" size={20}/>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
          <Icon name="bookmark_border" size={20}/>
        </span>
      </div>
    </div>
  </article>
);

const STORY_RAIL = [
  { name: 'Của bạn', initial: '+', add: true },
  { name: 'Linh', initial: 'L', palette: 'linear-gradient(180deg, #c4b5fd, #d6336c)' },
  { name: 'Đăng', initial: 'Đ', palette: 'linear-gradient(180deg, #93c5fd, #8b5cf6)' },
  { name: 'Mai', initial: 'M', palette: 'linear-gradient(180deg, #fbbf24, #d6336c)' },
  { name: 'Phúc', initial: 'P', palette: 'linear-gradient(180deg, #06b6d4, #3b82f6)', seen: true },
  { name: 'Thảo', initial: 'T', palette: 'linear-gradient(180deg, #34d399, #06b6d4)', seen: true },
];

const FeedScreen = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <AppBar title="Feed"
      trailing={<><IconBtn icon="search"/><IconBtn icon="edit_square" color="var(--primary)"/></>}
    />

    {/* Stories */}
    <div style={{
      display: 'flex', gap: 14, padding: '4px 16px 16px',
      overflowX: 'auto',
      borderBottom: '1px solid var(--outline-variant)',
    }}>
      {STORY_RAIL.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
          <div style={{
            width: 62, height: 62, borderRadius: '50%',
            padding: 2.5,
            background: s.add ? 'transparent' : (s.seen ? 'var(--outline)' : 'linear-gradient(135deg, #d6336c 0%, #8b5cf6 100%)'),
            border: s.add ? '2px dashed var(--outline)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {s.add ? (
              <Icon name="add" size={26} color="var(--primary)"/>
            ) : (
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                border: '2.5px solid var(--surface)',
                background: s.palette,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: 8,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                color: 'rgba(255,255,255,0.85)',
              }}>{s.initial}</div>
            )}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--fg-2)' }}>{s.name}</span>
        </div>
      ))}
    </div>

    {/* Posts */}
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
      {POSTS.map(p => <Post key={p.id} post={p}/>)}
    </div>
  </div>
);

Object.assign(window, { FeedScreen });
