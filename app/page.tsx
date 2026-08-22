'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const team = [
  ['کریستیان ایلیه بابرودی', 'Christianeley Babroudi', './team/christian-3d.png'],
  ['کریستوفر ایلیه بابرودی', 'Christopher Eley Babroudi', './team/christopher-3d.png'],
  ['آراد دباغی', 'Arad Dabbaghi', './team/arad-3d.png'],
  ['مهراد توفیقی', 'Mehrad Tofighi', './team/mehrad-3d.png'],
  ['آرکان محمدی', 'Arkan Mohammadi', './team/arkan-3d.png'],
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
  ['سرعت کواد چگونه تنظیم می‌شود؟', 'How are drone speeds configured?', 'پیش از اتصال، برنامه سرعت Patrol و سرعت نزدیک‌شدن به چهره را برحسب متر بر ثانیه از کاربر می‌گیرد. هنگام مشاهده چهره سرعت دوم فعال می‌شود، در اندازه هدف حرکت جلو صفر می‌شود و با گم‌شدن چهره سرعت Patrol برمی‌گردد.', 'Before connecting, the program asks for Patrol and face-approach speeds in meters per second. Face speed is used while tracking, forward motion stops at the target size, and Patrol resumes when the face disappears.'],
  ['ثبت هویت چگونه انجام می‌شود؟', 'How does identity enrollment work?', 'در نسخه وب‌کم چند تصویر واضح و متفاوت پس از کنترل کیفیت به embedding تبدیل و رمزگذاری می‌شوند. در Unreal هر هویت یک پوشه در known_people دارد و تصاویر همان کاراکتر از چند زاویه داخل آن قرار می‌گیرند.', 'In the webcam version, several clear and distinct images pass quality checks before encrypted embeddings are stored. In Unreal, every identity has a known_people folder containing multiple angles of the same character.'],
  ['کیفیت چهره چگونه سنجیده می‌شود؟', 'How is face quality measured?', 'اندازه چهره، روشنایی، sharpness، زاویه yaw و چرخش roll بررسی می‌شوند. شرایط ثبت سخت‌گیرانه‌تر است، چون template ضعیف روی تمام تطبیق‌های بعدی اثر می‌گذارد.', 'Face size, brightness, sharpness, yaw, and roll are checked. Enrollment is stricter because a weak template affects every future comparison.'],
  ['RPC چه کاری انجام می‌دهد؟', 'What does RPC do?', 'RPC پل ارتباطی Python و Cosys-AirSim داخل Unreal است و تصاویر Scene و Depth، وضعیت vehicle و فرمان‌های پرواز را منتقل می‌کند. نسخه Plugin و بسته Python باید با هم سازگار باشند.', 'RPC connects Python to Cosys-AirSim inside Unreal, transporting Scene and Depth images, vehicle state, and flight commands. The plugin and Python client versions must be compatible.'],
  ['Scene و Depth چه تفاوتی دارند؟', 'What is the difference between Scene and Depth?', 'Scene تصویر رنگی برای تشخیص و نمایش است. DepthPerspective فاصله هر بخش صحنه را برای تشخیص مانع فراهم می‌کند. این دو ورودی هم‌زمان دریافت می‌شوند.', 'Scene is the color image used for recognition and visualization. DepthPerspective provides scene distance for obstacle detection. Both inputs are acquired together.'],
  ['چرا از cosine similarity استفاده شده است؟', 'Why use cosine similarity?', 'SFace چهره را به embedding تبدیل می‌کند و cosine similarity جهت دو بردار را مقایسه می‌کند. این مقدار احتمال قطعی نیست و همراه threshold، ambiguity margin و رأی زمانی تفسیر می‌شود.', 'SFace converts a face into an embedding, and cosine similarity compares vector direction. It is not a guaranteed probability and is interpreted with a threshold, ambiguity margin, and temporal voting.'],
  ['برنامه با چه نسخه‌هایی اجرا می‌شود؟', 'Which software versions are used?', 'نسخه وب‌کم برای Python 3.12 آماده شده است. نسخه شبیه‌سازی از Unreal Engine 5.8 و Cosys-AirSim 3.4.1 همراه OpenCV، NumPy، YuNet و SFace استفاده می‌کند.', 'The webcam build targets Python 3.12. The simulation build uses Unreal Engine 5.8 and Cosys-AirSim 3.4.1 with OpenCV, NumPy, YuNet, and SFace.'],
  ['اعضای تیم چه کسانی هستند؟', 'Who are the team members?', 'اعضای گروه Ai Copter عبارت‌اند از کریستیان ایلیه بابرودی، کریستوفر ایلیه بابرودی، آراد دباغی، مهراد توفیقی و آرکان محمدی؛ با راهنمایی استاد فلاح و استاد موحد در دبیرستان دوره اول علامه حلی ۵.', 'The Ai Copter team includes Christianeley Babroudi, Christopher Eley Babroudi, Arad Dabbaghi, Mehrad Tofighi, and Arkan Mohammadi, mentored by Mr. Fallah and Mr. Movahed at Allameh Helli 5 Junior High School.'],
  ['چه مدل‌ها و کتابخانه‌هایی استفاده شده‌اند؟', 'Which models and libraries are used?', 'YuNet برای Detection، SFace برای embedding هویتی، MediaPipe برای landmark و Liveness، OpenCV برای پردازش تصویر، NumPy برای محاسبات، SQLite و Fernet برای ذخیره امن و Cosys-AirSim برای ارتباط با Unreal استفاده می‌شوند.', 'YuNet handles detection, SFace identity embeddings, MediaPipe landmarks and liveness, OpenCV vision processing, NumPy computation, SQLite and Fernet secure storage, and Cosys-AirSim Unreal communication.'],
  ['بعد از تشخیص چهره کواد چه می‌کند؟', 'What does the drone do after detecting a face?', 'کواد بزرگ‌ترین چهره را هدف می‌گیرد، با yaw آن را در مرکز نگه می‌دارد و با سرعت تعیین‌شده نزدیک می‌شود. وقتی عرض چهره به ۲۲ درصد تصویر برسد حرکت جلو متوقف می‌شود؛ با خروج چهره Patrol ادامه پیدا می‌کند.', 'The drone targets the largest face, centers it using yaw, and approaches at the configured speed. Forward movement stops when the face reaches 22% of image width; Patrol resumes when the face leaves the view.'],
  ['آیا پروژه به اینترنت نیاز دارد؟', 'Does the project need the internet?', 'پس از نصب وابستگی‌ها و دریافت مدل‌ها، تشخیص وب‌کم و ارتباط محلی Unreal بدون اینترنت اجرا می‌شوند. اینترنت برای نصب اولیه، دانلود فایل‌ها و مشاهده سایت لازم است.', 'After dependencies and models are installed, webcam recognition and local Unreal communication run without internet. Internet is needed for initial setup, downloads, and viewing the website.'],
  ['چگونه سیستم را ارزیابی می‌کنید؟', 'How is the system evaluated?', 'ارزیابی علمی باید روی تصاویر جدا از ثبت، افراد ناشناس، نور و زاویه‌های مختلف انجام شود و معیارهایی مانند False Accept، False Reject، نرخ Unknown، زمان پاسخ و نرخ فریم گزارش شوند. برای کواد، فاصله توقف و موفقیت اجتناب از مانع نیز مهم‌اند.', 'Scientific evaluation uses test images separate from enrollment, unknown people, and varied lighting and pose, reporting False Accept, False Reject, Unknown rate, latency, and frame rate. Drone tests also measure stopping distance and obstacle-avoidance success.'],
];

const tech = [
  ['YuNet', 'Face detection + 5 landmarks'], ['SFace', 'Identity embeddings'], ['MediaPipe', '478-point liveness mesh'],
  ['OpenCV', 'Vision pipeline + ONNX'], ['Cosys-AirSim', 'Python ↔ Unreal RPC'], ['Unreal 5.8', 'Simulation environment'],
];

export default function Home() {
  const [fa, setFa] = useState(true);
  const [light, setLight] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; text: string }>>([
    { role: 'bot', text: 'سلام! من دستیار تخصصی Ai Copter هستم. درباره تشخیص چهره، Liveness، Unreal، کواد، مدل‌ها، سرعت، ایمنی یا اعضای تیم از من سؤال کن.' },
  ]);
  const latestUserMessage = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    document.documentElement.lang = fa ? 'fa' : 'en';
  }, [fa, light]);

  useEffect(() => {
    latestUserMessage.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [messages, typing]);

  const t = (persian: string, english: string) => fa ? persian : english;

  const findAnswer = (question: string) => {
    const normalized = question.toLowerCase()
      .replace(/زنده[‌\s-]*بودن|لایونس/g, 'liveness')
      .replace(/پهپاد/g, 'کواد')
      .replace(/ایر[‌\s-]*سیم/g, 'airsim')
      .replace(/آنریل/g, 'unreal')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const stopWords = new Set(['این','اون','برای','چرا','چطور','چگونه','چیست','است','هست','های','the','and','what','how','why','does','is','are','about']);
    const tokens = normalized.split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));
    let bestScore = 0;
    let best = faq[0];
    for (const item of faq) {
      const searchable = `${item[0]} ${item[1]} ${item[2]} ${item[3]}`.toLowerCase();
      const score = tokens.reduce((total, token) => total + (searchable.includes(token) ? (item[0].toLowerCase().includes(token) || item[1].toLowerCase().includes(token) ? 3 : 1) : 0), 0);
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (bestScore === 0) return fa
      ? 'این سؤال را دقیق‌تر و با یکی از موضوع‌های پروژه بپرس: Webcam، ثبت هویت، Liveness، YuNet، SFace، Threshold، Unreal، RPC، Depth، سرعت کواد، اجتناب از مانع، امنیت، ارزیابی یا اعضای تیم.'
      : 'Please make the question more specific using a project topic: webcam, enrollment, liveness, YuNet, SFace, threshold, Unreal, RPC, depth, drone speed, obstacle avoidance, security, evaluation, or the team.';
    return fa ? best[2] : best[3];
  };

  const askQuestion = (value: string) => {
    const question = value.trim();
    if (!question || typing) return;
    setMessages(current => [...current, { role: 'user', text: question }]);
    setChatInput('');
    setTyping(true);
    window.setTimeout(() => {
      setMessages(current => [...current, { role: 'bot', text: findAnswer(question) }]);
      setTyping(false);
    }, 480);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    askQuestion(chatInput);
  };

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

    <div className="ticker"><div>{[...tech,...tech,...tech,...tech].map((x,i)=><span key={i}>{x[0]}<i>✦</i></span>)}</div></div>

    <section id="projects" className="section shell"><header className="section-head"><div><span>01 / SYSTEMS</span><h2>{t('یک هسته هوشمند؛ دو جهان متفاوت','One intelligent core. Two different worlds.')}</h2></div><p>{t('معماری مشترک، متناسب‌شده با نیازهای امنیتی و عملیاتی هر محیط.','A shared architecture, adapted to the security and operational needs of each environment.')}</p></header>
      <div className="project-grid">
        <article className="project webcam"><div className="project-no">01</div><div className="project-icon"><span className="lens"/></div><div><span className="tag">REAL WORLD · ACTIVE LIVENESS</span><h3>{t('سیمرغ فیس برای وب‌کم','Simorgh Face for Webcam')}</h3><p>{t('تشخیص و ثبت هویت محلی با کنترل کیفیت، دیتابیس رمزگذاری‌شده، رأی زمانی و چالش Blink یا چرخش سر.','Local identity detection and enrollment with quality gates, encrypted storage, temporal voting, and blink or head-turn challenges.')}</p></div><ul><li>YuNet + SFace + MediaPipe</li><li>Encrypted SQLite templates</li><li>Active liveness state machine</li><li>Privacy-first local processing</li></ul></article>
        <article className="project unreal"><div className="project-no">02</div><div className="project-icon cube"><span/></div><div><span className="tag">SIMULATION · AUTONOMOUS CONTROL</span><h3>{t('بینایی کواد در Unreal','Drone Vision in Unreal')}</h3><p>{t('تشخیص کاراکتر رندرشده از دوربین کواد، نمایش لحظه‌ای نتیجه، رهگیری هدف و اجتناب از مانع با تصویر عمق.','Rendered-character recognition from the onboard camera, live visualization, target tracking, and depth-based obstacle avoidance.')}</p></div><ul><li>Unreal Engine 5.8 + Cosys-AirSim</li><li>Scene + DepthPerspective</li><li>Face-guided yaw control</li><li>Safety-first obstacle priority</li></ul></article>
      </div>
    </section>

    <section className="character-showcase shell">
      <div className="character-copy"><span>SIMULATED IDENTITY / 001</span><h2>{t('آموزش با داده‌ای از همان جهان','Train in the world you operate in.')}</h2><p>{t('نمونه‌های ثبت نسخه Unreal مستقیماً از کاراکتر شبیه‌سازی‌شده و در زاویه‌های مختلف گرفته می‌شوند تا فاصله میان تصویر واقعی و رندرشده کاهش یابد.','Unreal enrollment samples are captured directly from the simulated character at varied angles, reducing the domain gap between real and rendered faces.')}</p><div><b>03</b> {t('زاویه ثبت','ENROLLMENT ANGLES')}<i/><b>01</b> {t('هویت شبیه‌سازی‌شده','SIMULATED IDENTITY')}</div></div>
      <div className="character-frames"><figure><img src="./characters/character-front-1.jpg" alt="Unreal character frontal enrollment sample"/><span>FRONTAL / 01</span></figure><figure className="featured"><img src="./characters/character-profile.jpg" alt="Unreal character profile enrollment sample"/><span>PROFILE / 02</span></figure><figure><img src="./characters/character-front-2.jpg" alt="Unreal character second frontal enrollment sample"/><span>FRONTAL / 03</span></figure><div className="scanline"/></div>
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

    <section id="team" className="section team-section"><div className="shell"><header className="section-head"><div><span>04 / THE TEAM</span><h2>{t('پنج ذهن؛ یک مأموریت','Five minds. One mission.')}</h2></div><p>{t('دبیرستان دوره اول علامه حلی ۵','Allameh Helli 5 Junior High School')}<br/>{t('با راهنمایی استاد فلاح و استاد موحد','Mentored by Mr. Fallah and Mr. Movahed')}</p></header><div className="team-grid">{team.map((x,i)=><article key={x[0]}><div className="avatar"><img src={x[2]} alt={fa?`پرتره سه‌بعدی ${x[0]}`:`3D portrait of ${x[1]}`}/><b>{String(i+1).padStart(2,'0')}</b><span/></div><h3>{fa?x[0]:x[1]}</h3><p>{t('پژوهشگر و توسعه‌دهنده','Researcher & Developer')}</p></article>)}</div></div></section>

    <section id="faq" className="section shell ai-chat-section">
      <header className="section-head chat-heading"><div><span>05 / AI PROJECT ASSISTANT</span><h2>{t('هر چیزی درباره پروژه می‌خواهی بپرس','Ask anything about the project')}</h2></div><p>{t('یک دستیار دو‌زبانه با دانش تخصصی Ai Copter؛ سریع، محلی و خصوصی.','A bilingual assistant with specialized Ai Copter knowledge—fast, local, and private.')}</p></header>
      <div className="chat-shell">
        <aside className="chat-sidebar">
          <div className="bot-avatar"><span>AI</span><i/></div>
          <h3>SIMORGH ASSISTANT</h3>
          <p>{t('دستیار تخصصی تشخیص چهره و پرواز خودمختار','Face intelligence & autonomous flight specialist')}</p>
          <div className="assistant-badges"><span>● {t('آنلاین','ONLINE')}</span><span>{t('دانش محلی','LOCAL KNOWLEDGE')}</span><span>FA / EN</span></div>
          <div className="assistant-note"><b>{t('بدون محدودیت موضوعی','OPEN CONVERSATION')}</b><span>{t('سؤال خودت را آزادانه بنویس؛ پیشنهادها فقط نقطه شروع هستند.','Type your own question freely. Suggestions are only a starting point.')}</span></div>
        </aside>
        <div className="chat-main">
          <div className="chat-topbar"><div><i/><b>{t('دستیار آماده پاسخ‌گویی است','Assistant is ready')}</b></div><span>{t(`${faq.length} موضوع تخصصی`,`${faq.length} expert topics`)}</span></div>
          <div className="chat-messages" aria-live="polite">
            <div className="topic-launcher">
              <div><span>✦</span><b>{t('از کجا شروع کنیم؟','Where should we start?')}</b><small>{t('یک موضوع را انتخاب کن یا سؤال خودت را پایین بنویس','Choose a topic or type anything below')}</small></div>
              <div className="suggestions">
                {[
                  t('Liveness چطور کار می‌کند؟','How does liveness work?'),
                  t('کواد بعد از دیدن چهره چه می‌کند؟','What does the drone do after seeing a face?'),
                  t('مدل‌های هوش مصنوعی پروژه کدام‌اند؟','Which AI models power the project?'),
                  t('امنیت اطلاعات هویتی چگونه است؟','How is identity data secured?'),
                  t('نسخه وب‌کم و Unreal چه تفاوتی دارند؟','How do the webcam and Unreal builds differ?'),
                  t('ثبت یک هویت جدید چگونه انجام می‌شود؟','How is a new identity enrolled?'),
                  t('Depth چطور مانع برخورد می‌شود؟','How does Depth prevent collisions?'),
                  t('رأی زمانی چه مشکلی را حل می‌کند؟','What problem does temporal voting solve?'),
                  t('سرعت حرکت کواد چگونه تنظیم می‌شود؟','How is drone speed configured?'),
                  t('YuNet و SFace دقیقاً چه می‌کنند؟','What exactly do YuNet and SFace do?'),
                  t('محدودیت‌های فعلی پروژه چیست؟','What are the project’s current limitations?'),
                  t('اعضای تیم چه کسانی هستند؟','Who are the team members?'),
                ].map(question => <button key={question} onClick={() => askQuestion(question)}><span>↗</span>{question}</button>)}
              </div>
            </div>
            {messages.map((message, index) => <div ref={message.role === 'user' ? latestUserMessage : undefined} className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span className="message-icon">{message.role === 'bot' ? 'AI' : t('شما','YOU')}</span><div><small>{message.role === 'bot' ? 'SIMORGH' : t('شما','YOU')}</small><p>{message.text}</p></div></div>)}
            {typing && <div className="chat-message bot"><span className="message-icon">AI</span><div><small>SIMORGH</small><p className="typing-dots"><i/><i/><i/></p></div></div>}
          </div>
          <form className="chat-form" onSubmit={sendMessage}>
            <div><input value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder={t('مثلاً: تفاوت نسخه وب‌کم و Unreal چیست؟','For example: How does obstacle avoidance work?')} aria-label={t('سؤال از دستیار پروژه','Ask the project assistant')}/><button type="submit" disabled={!chatInput.trim() || typing}>{t('ارسال','SEND')}<span>↗</span></button></div>
            <p><i>◆</i>{t('پاسخ‌ها داخل مرورگر تولید می‌شوند و هیچ پرسشی ارسال یا ذخیره نمی‌شود.','Answers are generated in your browser; no question is transmitted or stored.')}</p>
          </form>
        </div>
      </div>
    </section>

    <section className="final"><div className="shell"><span>{t('پروژه پژوهشی هوش مصنوعی','AN AI RESEARCH PROJECT')}</span><h2>{t('وقتی دیدن، فهمیدن و حرکت‌کردن به یک سامانه تبدیل می‌شوند.','Where seeing, understanding, and moving become one system.')}</h2><a className="primary back-to-top" href="#top">{t('بازگشت به آغاز','Back to the top')} ↑</a></div></section>
    <footer className="shell"><div className="brand"><span className="brand-mark"><b>AI</b></span><span><strong>AI COPTER</strong><small>2026 RESEARCH PROJECT</small></span></div><p>{t('ساخته‌شده با مسئولیت، رضایت و پردازش محلی.','Built with responsibility, consent, and local-first processing.')}</p><b>ALLAMEH HELLI 5</b></footer>
  </main>;
}
