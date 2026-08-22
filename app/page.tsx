'use client';

import { useEffect, useMemo, useState } from 'react';

const team = [
  ['کریستیان ایلیه بابرودی', 'Christianeley Babroudi'],
  ['کریستوفر ایلیه بابرودی', 'Christopher Eley Babroudi'],
  ['آراد دباغی', 'Arad Dabbaghi'],
  ['مهراد توفیقی', 'Mehrad Tofighi'],
  ['آرکان محمدی', 'Arkan Mohammadi'],
];

const faq = [
  ['هدف اصلی پروژه چیست؟', 'What is the project’s main goal?', 'ساخت یک خط لوله کامل تشخیص چهره که کیفیت ورودی، هویت، زنده‌بودن و واکنش کواد را در دو محیط واقعی و شبیه‌سازی مدیریت می‌کند.', 'To build a complete face-intelligence pipeline that manages input quality, identity, liveness, and drone response across real and simulated environments.'],
  ['چرا دو نسخه ساخته شده است؟', 'Why are there two versions?', 'نسخه وب‌کم برای احراز هویت انسان واقعی و نسخه Unreal برای ادراک کاراکتر و کنترل کواد طراحی شده است؛ نیازهای امنیتی و عملیاتی آن‌ها متفاوت است.', 'The webcam build verifies real people; the Unreal build recognizes rendered characters and controls a quadrotor. Their security and operational needs differ.'],
  ['YuNet و SFace چه می‌کنند؟', 'What do YuNet and SFace do?', 'YuNet محل چهره و نقاط کلیدی را پیدا می‌کند؛ SFace از چهره هم‌تراز یک بردار هویتی می‌سازد و آن را با نمونه‌های ثبت‌شده مقایسه می‌کند.', 'YuNet locates faces and landmarks; SFace turns an aligned face into an identity vector and compares it with enrolled templates.'],
  ['آیا Liveness ضدجعل کامل است؟', 'Is liveness completely spoof-proof?', 'خیر. Blink و چرخش سر حمله با عکس ثابت را دشوارتر می‌کنند، اما سامانه‌های پرخطر به حسگر عمق، مادون قرمز و مدل تخصصی ضدجعل نیاز دارند.', 'No. Blink and head-turn challenges reduce simple photo attacks, while high-risk systems need depth, infrared, and specialized anti-spoofing models.'],
  ['چرا Liveness در Unreal وجود ندارد؟', 'Why is liveness absent in Unreal?', 'کاراکتر رندرشده انسان زنده نیست و چالش Blink معنای امنیتی ندارد؛ حذف آن یک تصمیم متناسب با محیط است.', 'A rendered character is not a live human, so a blink challenge has no security meaning. Its removal is an environment-specific design decision.'],
  ['اگر دو هویت نزدیک باشند چه می‌شود؟', 'What happens when two identities are close?', 'Threshold کیفیت مطلق و ambiguity margin فاصله نامزد اول و دوم را می‌سنجد؛ اگر تصمیم مبهم باشد، خروجی عمداً Unknown است.', 'A threshold checks absolute quality and an ambiguity margin compares the top candidates. Ambiguous matches intentionally return Unknown.'],
  ['چرا از رأی زمانی استفاده شده است؟', 'Why use temporal voting?', 'یک فریم ممکن است تار یا نامناسب باشد. تکرار نتیجه در چند زمان، جهش نام و پذیرش تصادفی را کاهش می‌دهد.', 'A single frame may be blurred or poorly lit. Repeated agreement across time reduces label flicker and accidental acceptance.'],
  ['Depth چگونه از برخورد جلوگیری می‌کند؟', 'How does depth prevent collisions?', 'عمق به سه ناحیه تقسیم می‌شود و نزدیک‌ترین موانع معتبر بررسی می‌شوند. فرمان اجتناب همیشه بر رهگیری چهره اولویت دارد.', 'Depth is split into three sectors and nearby valid obstacles are measured. Avoidance commands always override face tracking.'],
  ['آیا اطلاعات افراد امن است؟', 'Is identity data secure?', 'نسخه وب‌کم embedding رمزگذاری‌شده را در SQLite نگه می‌دارد؛ بااین‌حال داده بیومتریک همچنان حساس است و فقط با رضایت باید استفاده شود.', 'The webcam version stores encrypted embeddings in SQLite, but biometric data remains sensitive and must only be used with consent.'],
  ['محدودیت اصلی سامانه چیست؟', 'What is the main limitation?', 'دقت به نور، زاویه، دوربین، شباهت چهره‌ها و فاصله دامنه تصویر واقعی و رندرشده وابسته است؛ هیچ سامانه عملی بدون خطا نیست.', 'Accuracy depends on lighting, pose, camera quality, look-alike faces, and the real-to-rendered domain gap. No practical system is error-free.'],
];

const tech = [
  ['YuNet', 'Face detection + 5 landmarks'], ['SFace', 'Identity embeddings'], ['MediaPipe', '478-point liveness mesh'],
  ['OpenCV', 'Vision pipeline + ONNX'], ['Cosys-AirSim', 'Python ↔ Unreal RPC'], ['Unreal 5.8', 'Simulation environment'],
];

export default function Home() {
  const [fa, setFa] = useState(true);
  const [light, setLight] = useState(false);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(0);
  const [menu, setMenu] = useState(false);
  const filteredFaq = useMemo(() => faq.filter(x => `${x[0]} ${x[1]} ${x[2]} ${x[3]}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    document.documentElement.lang = fa ? 'fa' : 'en';
  }, [fa, light]);

  const t = (persian: string, english: string) => fa ? persian : english;

  return <main>
    <nav className="nav shell">
      <a className="brand" href="#top"><span className="brand-mark"><b>AI</b></span><span><strong>AI COPTER</strong><small>{t('ادراک هوشمند از آسمان','INTELLIGENCE FROM ABOVE')}</small></span></a>
      <div className={`links ${menu ? 'show' : ''}`}>
        <a href="#projects" onClick={() => setMenu(false)}>{t('سامانه‌ها','Systems')}</a><a href="#architecture" onClick={() => setMenu(false)}>{t('معماری','Architecture')}</a><a href="#team" onClick={() => setMenu(false)}>{t('تیم','Team')}</a><a href="#faq" onClick={() => setMenu(false)}>{t('سؤالات','FAQ')}</a>
      </div>
      <div className="nav-actions"><button onClick={() => setFa(!fa)}>{fa ? 'EN' : 'فا'}</button><button onClick={() => setLight(!light)} aria-label="Theme">{light ? '◐' : '☀'}</button><button className="menu" onClick={() => setMenu(!menu)}>☰</button></div>
    </nav>

    <section id="top" className="hero shell">
      <div className="hero-copy reveal"><div className="eyebrow"><span />{t('بینایی ماشین × پرواز خودمختار','COMPUTER VISION × AUTONOMOUS FLIGHT')}</div>
        <h1>{t('چشم‌هایی که می‌شناسند.','Vision that recognizes.')}<br/><em>{t('پروازی که تصمیم می‌گیرد.','Flight that decides.')}</em></h1>
        <p>{t('Ai Copter یک سامانه پژوهشی تشخیص چهره است که احراز هویت امن در دنیای واقعی را به ادراک و کنترل کواد در Unreal Engine متصل می‌کند.','Ai Copter is a research face-intelligence system connecting secure real-world verification to autonomous perception and quadrotor control in Unreal Engine.')}</p>
        <div className="hero-actions"><a className="primary" href="#projects">{t('کشف سامانه','Explore the system')} <span>↙</span></a><a className="ghost" href="#architecture">{t('مشاهده معماری','View architecture')}</a></div>
        <div className="metrics"><div><b>02</b><span>{t('محیط عملیاتی','Operational worlds')}</span></div><div><b>03</b><span>{t('مدل بینایی','Vision models')}</span></div><div><b>100%</b><span>{t('پردازش محلی','Local processing')}</span></div></div>
      </div>
      <div className="hero-visual">
        <div className="orbit o1"/><div className="orbit o2"/><div className="radar"/><div className="drone"><i className="arm a1"/><i className="arm a2"/><i className="rotor r1"/><i className="rotor r2"/><i className="rotor r3"/><i className="rotor r4"/><span>AI</span></div>
        <div className="telemetry top"><i/> LIVE VISION <b>98.7%</b></div><div className="face-target"><i/><i/><i/><i/><b>{t('هویت تأیید شد','IDENTITY VERIFIED')}</b></div><div className="telemetry bottom">DEPTH <b>2.84m</b> · PATROL</div><div className="floor"/>
      </div>
    </section>

    <div className="ticker"><div>{[...tech,...tech].map((x,i)=><span key={i}>{x[0]}<i>✦</i></span>)}</div></div>

    <section id="projects" className="section shell"><header className="section-head"><div><span>01 / SYSTEMS</span><h2>{t('یک هسته هوشمند؛ دو جهان متفاوت','One intelligent core. Two different worlds.')}</h2></div><p>{t('معماری مشترک، متناسب‌شده با نیازهای امنیتی و عملیاتی هر محیط.','A shared architecture, adapted to the security and operational needs of each environment.')}</p></header>
      <div className="project-grid">
        <article className="project webcam"><div className="project-no">01</div><div className="project-icon"><span className="lens"/></div><div><span className="tag">REAL WORLD · ACTIVE LIVENESS</span><h3>{t('سیمرغ فیس برای وب‌کم','Simorgh Face for Webcam')}</h3><p>{t('تشخیص و ثبت هویت محلی با کنترل کیفیت، دیتابیس رمزگذاری‌شده، رأی زمانی و چالش Blink یا چرخش سر.','Local identity detection and enrollment with quality gates, encrypted storage, temporal voting, and blink or head-turn challenges.')}</p></div><ul><li>YuNet + SFace + MediaPipe</li><li>Encrypted SQLite templates</li><li>Active liveness state machine</li><li>Privacy-first local processing</li></ul></article>
        <article className="project unreal"><div className="project-no">02</div><div className="project-icon cube"><span/></div><div><span className="tag">SIMULATION · AUTONOMOUS CONTROL</span><h3>{t('بینایی کواد در Unreal','Drone Vision in Unreal')}</h3><p>{t('تشخیص کاراکتر رندرشده از دوربین کواد، نمایش لحظه‌ای نتیجه، رهگیری هدف و اجتناب از مانع با تصویر عمق.','Rendered-character recognition from the onboard camera, live visualization, target tracking, and depth-based obstacle avoidance.')}</p></div><ul><li>Unreal Engine 5.8 + Cosys-AirSim</li><li>Scene + DepthPerspective</li><li>Face-guided yaw control</li><li>Safety-first obstacle priority</li></ul></article>
      </div>
    </section>

    <section className="character-showcase shell">
      <div className="character-copy"><span>SIMULATED IDENTITY / 001</span><h2>{t('آموزش با داده‌ای از همان جهان','Train in the world you operate in.')}</h2><p>{t('نمونه‌های ثبت نسخه Unreal مستقیماً از کاراکتر شبیه‌سازی‌شده و در زاویه‌های مختلف گرفته می‌شوند تا فاصله میان تصویر واقعی و رندرشده کاهش یابد.','Unreal enrollment samples are captured directly from the simulated character at varied angles, reducing the domain gap between real and rendered faces.')}</p><div><b>03</b> {t('زاویه ثبت','ENROLLMENT ANGLES')}<i/><b>01</b> {t('هویت شبیه‌سازی‌شده','SIMULATED IDENTITY')}</div></div>
      <div className="character-frames"><figure><img src="/characters/character-front-1.jpg" alt="Unreal character frontal enrollment sample"/><span>FRONTAL / 01</span></figure><figure className="featured"><img src="/characters/character-profile.jpg" alt="Unreal character profile enrollment sample"/><span>PROFILE / 02</span></figure><figure><img src="/characters/character-front-2.jpg" alt="Unreal character second frontal enrollment sample"/><span>FRONTAL / 03</span></figure><div className="scanline"/></div>
    </section>

    <section id="architecture" className="section architecture"><div className="shell"><header className="section-head"><div><span>02 / PIPELINE</span><h2>{t('از یک فریم تا یک تصمیم قابل اعتماد','From a single frame to a trusted decision')}</h2></div></header>
      <div className="pipeline">{[
        ['01','CAPTURE',t('دریافت تصویر','Scene acquisition')],['02','DETECT',t('کادر و نقاط کلیدی','Face + landmarks')],['03','ALIGN',t('استانداردسازی چهره','Geometric normalization')],['04','EMBED',t('بردار ویژگی SFace','Identity vector')],['05','DECIDE',t('آستانه، ابهام و رأی','Threshold + voting')],['06','ACT',t('هویت یا فرمان کواد','Identity or flight command')]
      ].map((x,i)=><div className="pipe" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small>{i<5&&<i>→</i>}</div>)}</div>
      <div className="decision-grid"><div className="code-panel"><div className="code-top"><span/><span/><span/><b>identity_decision.py</b></div><pre><code><em>matches</em> = store.match(embedding, top_k=2){'\n'}<em>best</em>, <em>second</em> = matches[0], matches[1]{'\n\n'}<strong>if</strong> best.score &lt; threshold:{'\n'}    <strong>return</strong> <i>"Unknown"</i>{'\n\n'}<strong>if</strong> best.score - second.score &lt; margin:{'\n'}    <strong>return</strong> <i>"Ambiguous"</i>{'\n\n'}<strong>return</strong> temporal_vote(best.identity)</code></pre></div>
        <div className="principles"><article><b>01</b><h3>{t('محافظه‌کار در تصمیم','Conservative by design')}</h3><p>{t('وقتی شواهد کافی نیستند، Unknown بهتر از هویت اشتباه است.','When evidence is insufficient, Unknown is safer than a wrong identity.')}</p></article><article><b>02</b><h3>{t('ایمنی پیش از مأموریت','Safety before mission')}</h3><p>{t('فرمان اجتناب از مانع همیشه رهگیری چهره را کنار می‌زند.','Obstacle avoidance always overrides face tracking.')}</p></article><article><b>03</b><h3>{t('شفاف درباره محدودیت‌ها','Honest about limits')}</h3><p>{t('این سامانه پژوهشی است؛ نه ابزار نظارت مخفی یا تصمیم پرخطر.','This is a research system, not a covert surveillance or high-risk decision tool.')}</p></article></div>
      </div></div>
    </section>

    <section className="section shell"><header className="section-head"><div><span>03 / TECHNOLOGY</span><h2>{t('فناوری‌هایی که سامانه را زنده می‌کنند','Technology that brings the system to life')}</h2></div></header><div className="tech-grid">{tech.map((x,i)=><article key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></section>

    <section id="team" className="section team-section"><div className="shell"><header className="section-head"><div><span>04 / THE TEAM</span><h2>{t('پنج ذهن؛ یک مأموریت','Five minds. One mission.')}</h2></div><p>{t('دبیرستان دوره اول علامه حلی ۵','Allameh Helli 5 Junior High School')}<br/>{t('با راهنمایی استاد فلاح و استاد موحد','Mentored by Mr. Fallah and Mr. Movahed')}</p></header><div className="team-grid">{team.map((x,i)=><article key={x[0]}><div className="avatar">{String(i+1).padStart(2,'0')}<span/></div><h3>{fa?x[0]:x[1]}</h3><p>{t('پژوهشگر و توسعه‌دهنده','Researcher & Developer')}</p></article>)}</div></div></section>

    <section id="faq" className="section shell faq"><header className="section-head"><div><span>05 / FAQ</span><h2>{t('سؤال‌های احتمالی؛ پاسخ‌های روشن','Hard questions. Clear answers.')}</h2></div></header><div className="faq-tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('جست‌وجو میان سؤال‌ها...','Search the questions...')} /><span>{filteredFaq.length} {t('پاسخ','answers')}</span></div><div className="faq-list">{filteredFaq.map((x,i)=><article className={open===i?'open':''} key={x[0]}><button onClick={()=>setOpen(open===i?-1:i)}><span>{String(i+1).padStart(2,'0')}</span><b>{fa?x[0]:x[1]}</b><i>+</i></button><div><p>{fa?x[2]:x[3]}</p></div></article>)}</div></section>

    <section className="final"><div className="shell"><span>{t('پروژه پژوهشی هوش مصنوعی','AN AI RESEARCH PROJECT')}</span><h2>{t('وقتی دیدن، فهمیدن و حرکت‌کردن به یک سامانه تبدیل می‌شوند.','Where seeing, understanding, and moving become one system.')}</h2><a className="primary" href="#top">{t('بازگشت به آغاز','Back to the top')} ↑</a></div></section>
    <footer className="shell"><div className="brand"><span className="brand-mark"><b>AI</b></span><span><strong>AI COPTER</strong><small>2026 RESEARCH PROJECT</small></span></div><p>{t('ساخته‌شده با مسئولیت، رضایت و پردازش محلی.','Built with responsibility, consent, and local-first processing.')}</p><b>ALLAMEH HELLI 5</b></footer>
  </main>;
}
