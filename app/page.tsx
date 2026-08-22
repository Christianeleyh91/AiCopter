'use client';

import { useEffect, useRef, useState } from 'react';

const team = [
  ['کریستیان ایلیه بابرودی', 'Christian Eleyh Babrudy', './team/christian-uniform.webp'],
  ['کریستوفر ایلیه بابرودی', 'Christopher Eleyh Babrudy', './team/christopher-3d-v2.webp'],
  ['آراد دباغی', 'Arad Dabaghi', './team/arad-3d.webp'],
  ['مهراد توفیقی', 'Mehrad Tofighi', './team/mehrad-3d.webp'],
  ['آرکان محمدی', 'Arkan Mohammadi', './team/arkan-3d-v4.webp'],
];

const faq = [
  ['هدف اصلی پروژه چیست؟', 'What is the project’s main goal?', 'هدف Ai Copter ساخت یک زنجیرهٔ یکپارچه از دریافت تصویر تا یافتن و رهگیری یک هویت مشخص است. پیش از مأموریت، چهرهٔ فرد هدف با نمونه‌های مرجع ثبت می‌شود. کواد در Unreal محیط را در حالت Patrol جست‌وجو می‌کند، چهره‌های دیده‌شده را با هدف مقایسه می‌کند و فقط پس از تأیید همان هویت، رهگیری و نزدیک‌شدن کنترل‌شده را آغاز می‌کند. چهرهٔ ناشناس یا فرد غیرهدف با کادر نارنجی نمایش داده می‌شود و نباید فرمان تعقیب ایجاد کند؛ هدف تأییدشده با کادر سبز مشخص می‌شود. اجتناب از مانع در تمام مراحل بر تعقیب اولویت دارد.', 'Ai Copter builds an end-to-end pipeline for finding and tracking one designated identity. Before the mission, reference images of the target person are enrolled. In Unreal, the quadrotor searches in Patrol mode, compares detected faces with the target, and begins controlled tracking only after that identity is confirmed. An unknown or non-target face is shown in orange and must not trigger pursuit; the confirmed target is shown in green. Obstacle avoidance has priority over tracking at every stage.'],
  ['چرا دو نسخه ساخته شده است؟', 'Why are there two versions?', 'دو نسخه یک هستهٔ مشترک تشخیص چهره دارند، اما برای دو مسئلهٔ متفاوت بهینه شده‌اند. نسخهٔ وب‌کم با انسان واقعی، کنترل کیفیت سخت‌گیرانه، ثبت رمزگذاری‌شده و آزمون Liveness سروکار دارد؛ نسخهٔ Unreal تصاویر رندرشده را از Cosys-AirSim می‌گیرد و نتیجهٔ تشخیص را به فرمان پرواز تبدیل می‌کند. جداکردن این دو مسیر، پیچیدگی غیرضروری و تصمیم‌های امنیتی نامرتبط را حذف می‌کند.', 'Both builds share the same recognition concept but are optimized for different problems. The webcam build handles real people, strict quality gates, encrypted enrollment, and liveness; the Unreal build receives rendered imagery through Cosys-AirSim and converts recognition into flight commands. Separating them avoids irrelevant security checks and unnecessary complexity.'],
  ['\u2066YuNet\u2069 و \u2066SFace\u2069 چه کاری انجام می‌دهند؟', 'What do YuNet and SFace do?', '\u2066YuNet\u2069 مدل آشکارسازی چهره است. این مدل برای هر چهره، کادر محدودکننده، امتیاز اطمینان و پنج نقطهٔ کلیدی شامل مرکز چشم‌ها، نوک بینی و گوشه‌های دهان را استخراج می‌کند. این نقاط برای هم‌ترازسازی هندسی چهره به کار می‌روند تا اثر چرخش و جابه‌جایی کاهش یابد. سپس \u2066SFace\u2069 چهرهٔ هم‌تراز را به یک بردار ویژگی هویتی تبدیل می‌کند. سامانه شباهت این بردار را با الگوهای ثبت‌شده می‌سنجد و با استفاده از آستانهٔ پذیرش، فاصلهٔ ابهام و رأی‌گیری زمانی، نتیجه را به‌صورت هویت تأییدشده یا ناشناس اعلام می‌کند.', 'YuNet performs face detection. For every face, it returns a bounding box, a confidence score, and five landmarks representing the eye centers, nose tip, and mouth corners. These landmarks geometrically align the face to reduce pose and translation variation. SFace then converts the aligned face into an identity embedding. The system compares that embedding with enrolled templates and combines an acceptance threshold, an ambiguity margin, and temporal voting to produce either a confirmed identity or an Unknown result.'],
  ['Liveness چگونه کار می‌کند؟', 'How does liveness work?', 'در نسخهٔ وب‌کم، Liveness یک ماشین حالت فعال و زمان‌مند است که با landmarkهای چهره کار می‌کند. ابتدا سامانه چند فریم پایدار را برای تعیین وضعیت پایه جمع‌آوری می‌کند؛ سپس کاربر باید یک پلک کامل بزند و سر را در جهت خواسته‌شده بچرخاند. پلک با کاهش و بازیابی نسبت بازشدگی چشم‌ها تشخیص داده می‌شود و چرخش سر از تغییر هندسی landmarkها نسبت به حالت پایه برآورد می‌گردد. هر مرحله باید با ترتیب درست، دامنهٔ کافی و در بازهٔ زمانی مشخص انجام شود؛ در غیر این صورت چالش Reset یا Timeout می‌شود. پس از تکمیل تمام مراحل، وضعیت Liveness passed ثبت می‌شود و نتیجه به Timeout برنمی‌گردد. این روش برای مقابله با عکس ثابت طراحی شده، اما جایگزین حسگر عمق یا مدل تخصصی ضدجعل در کاربردهای پرخطر نیست.', 'In the webcam build, liveness is an active, time-bounded state machine driven by facial landmarks. The system first collects stable frames to establish a baseline; the user must then complete a full blink and turn their head in the requested direction. A blink is detected from the drop and recovery of eye-opening ratios, while head rotation is estimated from landmark geometry relative to the baseline. Every stage must occur in the correct order, with sufficient amplitude, and within its time window; otherwise the challenge resets or times out. After all stages complete, Liveness passed becomes a terminal success state and does not later change to Timeout. This approach is designed to resist static-photo attacks, but it does not replace depth sensing or a dedicated anti-spoofing model in high-risk applications.'],
  ['آیا Liveness ضدجعل کامل است؟', 'Is liveness completely spoof-proof?', 'خیر. Liveness این پروژه یک آزمون فعال مبتنی بر پلک‌زدن و چرخش جهت‌دار سر است و عمدتاً حمله با عکس ثابت را دشوار می‌کند. ویدئوی بازپخش‌شده، ماسک پیشرفته یا جعل سه‌بعدی ممکن است به کنترل‌های قوی‌تری نیاز داشته باشد؛ بنابراین در کاربردهای حساس باید حسگر عمق یا مادون‌قرمز، مدل تخصصی ضدجعل و سیاست چندعاملی نیز اضافه شود.', 'No. This project uses active liveness challenges based on blinking and directed head turns, which mainly resist static-photo attacks. Replayed video, sophisticated masks, or 3D spoofs may require stronger controls; high-risk deployments should add depth or infrared sensing, a dedicated anti-spoofing model, and multi-factor policy.'],
  ['چرا Liveness در Unreal وجود ندارد؟', 'Why is liveness absent in Unreal?', 'هدف نسخهٔ Unreal شناسایی کاراکتر رندرشده و کنترل کواد است، نه اثبات حضور یک انسان زنده. کاراکتر می‌تواند انیمیشن پلک یا چرخش سر داشته باشد، اما این رفتار در شبیه‌ساز نشانهٔ زیستی محسوب نمی‌شود و امنیت واقعی ایجاد نمی‌کند. به همین دلیل Liveness عمداً حذف شده تا پردازش و منطق مأموریت روی ادراک، رهگیری و ایمنی پرواز متمرکز بماند.', 'The Unreal build identifies rendered characters and controls a quadrotor; it does not prove that a living human is present. A character may animate a blink or head turn, but that is not biological evidence and adds no real security. Liveness is therefore intentionally removed so computation and mission logic remain focused on perception, tracking, and flight safety.'],
  ['اگر دو هویت نزدیک باشند چه می‌شود؟', 'What happens when two identities are close?', 'سامانه فقط بالاترین شباهت را قبول نمی‌کند. امتیاز بهترین نامزد باید از Threshold عبور کند و هم‌زمان فاصلهٔ آن با نامزد دوم از ambiguity margin بیشتر باشد. اگر دو نفر بیش از حد نزدیک باشند، نتیجه عمداً Unknown باقی می‌ماند؛ این سیاست احتمال پذیرش اشتباه را به قیمت افزایش رد محافظه‌کارانه کاهش می‌دهد.', 'The system does not accept the highest score blindly. The best candidate must pass the absolute threshold and remain sufficiently ahead of the runner-up according to the ambiguity margin. If two identities are too close, the result deliberately stays Unknown, reducing false acceptance at the cost of more conservative rejection.'],
  ['چرا از رأی زمانی استفاده شده است؟', 'Why use temporal voting?', 'تصمیم یک فریم می‌تواند بر اثر تاری حرکت، نور لحظه‌ای، زاویه یا آشکارسازی ناقص ناپایدار باشد. سامانه نتایج چند فریم متوالی را نگه می‌دارد و فقط پس از تکرار کافی یک هویت، آن را نهایی می‌کند. این روش لرزش نام روی تصویر و پذیرش تصادفی را کم می‌کند، هرچند چند فریم تأخیر کنترل‌شده به پاسخ می‌افزاید.', 'A single frame can be unreliable because of motion blur, transient lighting, pose, or imperfect detection. The system keeps a short history and confirms an identity only after sufficient repeated agreement. This reduces label flicker and accidental acceptance while adding a small, controlled confirmation delay.'],
  ['Depth چگونه از برخورد جلوگیری می‌کند؟', 'How does depth prevent collisions?', 'تصویر DepthPerspective به ناحیه‌های چپ، مرکز و راست تقسیم می‌شود و برای حذف نویز، یک صدک پایین از فاصله‌های معتبر هر ناحیه محاسبه می‌شود. اگر مانع مرکزی از فاصلهٔ امن نزدیک‌تر باشد، کواد سرعت جلو را کم کرده و به سمت فضای بازتر می‌چرخد؛ در فاصلهٔ اضطراری عقب‌نشینی می‌کند. فرمان ایمنی همیشه بر رهگیری چهره اولویت دارد.', 'The DepthPerspective image is divided into left, center, and right sectors, and a low percentile of valid distances is used to suppress noise. If a central obstacle enters the safe range, the quadrotor slows and turns toward the clearer side; inside the emergency range, it reverses. Safety commands always override face tracking.'],
  ['آیا اطلاعات افراد امن است؟', 'Is identity data secure?', 'نسخهٔ وب‌کم به‌جای ذخیرهٔ مستقیم تصویر، embeddingهای هویتی را در SQLite نگه می‌دارد و محتوای حساس را با Fernet رمزگذاری می‌کند. کلید رمزگذاری جداگانه در پوشهٔ داده قرار دارد. این طراحی ریسک افشای ساده را کاهش می‌دهد، اما دادهٔ بیومتریک همچنان حساس است؛ دسترسی فایل، نسخهٔ پشتیبان، رضایت افراد و حذف داده باید مدیریت شوند.', 'The webcam build stores identity embeddings in SQLite instead of relying on raw reference images and encrypts sensitive content with Fernet. The encryption key is stored separately in the data directory. This reduces straightforward exposure, but biometric data remains sensitive, so file access, backups, consent, retention, and deletion still require careful control.'],
  ['محدودیت اصلی سامانه چیست؟', 'What is the main limitation?', 'عملکرد به کیفیت و وضوح دوربین، نور، اندازه و زاویهٔ چهره، شباهت افراد و کیفیت نمونه‌های ثبت‌شده وابسته است. در Unreal نیز تفاوت میان تصاویر واقعی و رندرشده، نورپردازی صحنه و جزئیات کاراکتر یک domain gap ایجاد می‌کند. هیچ سامانهٔ تشخیص چهره‌ای بدون خطا نیست؛ Thresholdها باید با دادهٔ آزمون مستقل و متناسب با کاربرد کالیبره شوند.', 'Performance depends on camera resolution, lighting, face size and pose, look-alike identities, and enrollment quality. In Unreal, rendering style, scene lighting, and character detail create a real-to-synthetic domain gap. No face-recognition system is error-free; thresholds must be calibrated on independent test data for the intended operating conditions.'],
  ['سرعت کواد چگونه تنظیم می‌شود؟', 'How are drone speeds configured?', 'پیش از اتصال به شبیه‌ساز، برنامه سرعت Patrol و سرعت نزدیک‌شدن به هدف را برحسب متر بر ثانیه دریافت و اعتبارسنجی می‌کند. سرعت دوم فقط زمانی فعال می‌شود که هویت مشخص مأموریت با رأی زمانی تأیید شده باشد؛ دیدن کادر نارنجی یا چهرهٔ غیرهدف سرعت تعقیب را فعال نمی‌کند و کواد به جست‌وجو ادامه می‌دهد. وقتی کادر سبز هدف به نسبت اندازهٔ تعیین‌شده برسد، سرعت جلو صفر می‌شود و فقط اصلاح yaw ادامه می‌یابد؛ با گم‌شدن هدف، حالت Patrol بازمی‌گردد.', 'Before connecting to the simulator, the program requests and validates patrol speed and target-approach speed in meters per second. The second speed is enabled only after temporal voting confirms the mission’s designated identity; an orange or non-target face never activates pursuit, so the quadrotor continues searching. Once the green target box reaches the configured size ratio, forward speed becomes zero and only yaw correction continues; Patrol resumes after the target is lost.'],
  ['ثبت هویت چگونه انجام می‌شود؟', 'How does identity enrollment work?', 'در نسخهٔ وب‌کم، چند عکس واضح و واقعاً متفاوت از یک فرد بررسی می‌شوند؛ هر عکس باید دقیقاً یک چهرهٔ قابل‌قبول داشته باشد. چهره هم‌تراز و به embedding تبدیل می‌شود و templateهای رمزگذاری‌شده زیر یک نام در پایگاه داده ذخیره می‌شوند. در نسخهٔ Unreal، تصاویر کاراکتر هدف از چند زاویه و شرایط نوری در پوشهٔ اختصاصی او داخل known_people قرار می‌گیرند تا مدل در شروع برنامه آموزش ببیند. نام همان پوشه، هویت قابل‌تشخیص را تعیین می‌کند و هویت انتخاب‌شده برای مأموریت باید به‌عنوان Target مشخص باشد؛ صرف ثبت‌شدن یک فرد به معنی تعقیب خودکار او نیست.', 'In the webcam build, several clear and genuinely distinct photos are checked, and each must contain exactly one acceptable face. The face is aligned, converted into an embedding, and its encrypted templates are stored under one identity. In the Unreal build, multiple views and lighting conditions of the target character are placed in that identity’s folder under known_people and used for startup training. The folder name defines the recognizable identity, while the mission must explicitly designate which enrolled identity is the Target; enrollment alone does not authorize pursuit.'],
  ['کیفیت چهره چگونه سنجیده می‌شود؟', 'How is face quality measured?', 'سامانه حداقل اندازهٔ چهره، میانگین روشنایی، sharpness مبتنی بر تغییرات لبه، زاویهٔ تقریبی yaw و چرخش roll را بررسی می‌کند. نتیجه علاوه بر امتیاز کلی، دلیل رد مانند too_blurry یا more_light_needed را گزارش می‌دهد. معیارهای ثبت سخت‌گیرانه‌ترند، زیرا template ضعیف می‌تواند کیفیت تمام تطبیق‌های آینده را پایین بیاورد.', 'The system checks minimum face size, average brightness, edge-based sharpness, approximate yaw, and roll. Besides an overall score, it reports rejection reasons such as too_blurry or more_light_needed. Enrollment uses stricter limits because a weak template can degrade every later comparison.'],
  ['RPC چه کاری انجام می‌دهد؟', 'What does RPC do?', 'RPC کانال ارتباطی میان برنامهٔ Python و افزونهٔ Cosys-AirSim داخل Unreal است. از این مسیر، فریم‌های Scene و Depth، فهرست وسایل پرنده، وضعیت شبیه‌سازی و فرمان‌هایی مانند takeoff، حرکت، yaw و hover ردوبدل می‌شوند. بازبودن پورت به‌تنهایی کافی نیست؛ نسخهٔ افزونه، پروتکل سرور و بستهٔ Python باید با یکدیگر سازگار باشند تا handshake و ping موفق شوند.', 'RPC is the communication channel between the Python program and the Cosys-AirSim plugin running inside Unreal. It transports Scene and Depth frames, vehicle information, simulator state, and commands such as takeoff, movement, yaw, and hover. An open port alone is insufficient: plugin, server protocol, and Python package versions must be compatible for the handshake and ping to succeed.'],
  ['تصویر \u2066Scene\u2069 و تصویر \u2066Depth\u2069 چه تفاوتی دارند؟', 'What is the difference between Scene and Depth images?', 'تصویر \u2066Scene\u2069 خروجی رنگی دوربین مجازی است و برای آشکارسازی چهره، شناسایی هویت، ترسیم کادرها و نمایش زنده استفاده می‌شود. تصویر \u2066DepthPerspective\u2069 به‌جای رنگ، فاصلهٔ تقریبی هر پیکسل تا سطح قابل‌مشاهده را برحسب متر نگه می‌دارد و ورودی سامانهٔ اجتناب از مانع است. این دو تصویر هم‌زمان دریافت می‌شوند؛ سپس نقشهٔ عمق با اندازهٔ تصویر رنگی هماهنگ می‌شود تا ناحیه‌های چپ، مرکز و راست در هر دو ورودی بر یک بخش از صحنه منطبق باشند.', 'The Scene image is the virtual camera’s color output and is used for face detection, identity recognition, bounding-box overlays, and live visualization. The DepthPerspective image stores an approximate metric distance from each pixel to the visible surface instead of color, providing the input for obstacle avoidance. Both images are acquired together, and the depth map is aligned to the Scene image dimensions so the left, center, and right regions correspond spatially.'],
  ['چرا از cosine similarity استفاده شده است؟', 'Why use cosine similarity?', 'خروجی SFace یک بردار ویژگی پرابعاد است. cosine similarity زاویهٔ میان دو بردار را می‌سنجد و نسبت به بزرگی مطلق آن‌ها حساسیت کمتری دارد؛ بنابراین برای مقایسهٔ جهت الگوی هویتی مناسب است. این عدد احتمال آماری قطعی نیست و فقط همراه Threshold کالیبره‌شده، ambiguity margin، کیفیت فریم و رأی زمانی معنا پیدا می‌کند.', 'SFace outputs a high-dimensional feature vector. Cosine similarity measures the angle between two embeddings and is less sensitive to their absolute magnitude, making it suitable for comparing identity direction. The score is not a calibrated probability and must be interpreted together with a tuned threshold, ambiguity margin, frame quality, and temporal voting.'],
  ['برنامه با چه نسخه‌هایی اجرا می‌شود؟', 'Which software versions are used?', 'محیط آزمایش‌شدهٔ نسخهٔ وب‌کم Python 3.12 است و وابستگی‌های آن در virtual environment پروژه نصب می‌شوند. نسخهٔ شبیه‌سازی برای Unreal Engine 5.8 و Cosys-AirSim 3.4.1 آماده شده و از OpenCV، NumPy و مدل‌های YuNet و SFace استفاده می‌کند. یکسان‌بودن نسخهٔ افزونهٔ AirSim و کلاینت Python برای اتصال RPC ضروری است.', 'The tested webcam environment uses Python 3.12 with dependencies installed in the project virtual environment. The simulation build targets Unreal Engine 5.8 and Cosys-AirSim 3.4.1 and uses OpenCV, NumPy, YuNet, and SFace. Matching the AirSim plugin and Python client versions is essential for RPC connectivity.'],
  ['اعضای تیم چه کسانی هستند؟', 'Who are the team members?', 'گروه Ai Copter از پنج پژوهشگر و توسعه‌دهنده تشکیل شده است: کریستیان ایلیه بابرودی، کریستوفر ایلیه بابرودی، آراد دباغی، مهراد توفیقی و آرکان محمدی. این پروژه در دبیرستان دورهٔ اول علامه حلی ۵ و با راهنمایی استاد فلاح و استاد موحد توسعه یافته است.', 'The Ai Copter team consists of five researchers and developers: Christian Eleyh Babrudy, Christopher Eleyh Babrudy, Arad Dabaghi, Mehrad Tofighi, and Arkan Mohammadi. The project was developed at Allameh Helli 5 Junior High School under the mentorship of Mr. Fallah and Mr. Movahed.'],
  ['در پروژه از چه مدل‌ها و کتابخانه‌هایی استفاده شده است؟', 'Which models and libraries are used in the project?', 'مدل \u2066YuNet\u2069 برای آشکارسازی چهره و استخراج پنج نقطهٔ کلیدی استفاده می‌شود و مدل \u2066SFace\u2069 بردار ویژگی هویتی را تولید می‌کند. کتابخانهٔ \u2066MediaPipe\u2069 در نسخهٔ وب‌کم، نقاط متراکم صورت را برای آزمون زنده‌بودن فراهم می‌سازد. \u2066OpenCV\u2069 مسئول دریافت و پردازش تصویر، هم‌ترازسازی چهره، اجرای مدل‌ها و ترسیم رابط تصویری است و \u2066NumPy\u2069 محاسبات عددی و آرایه‌ای را انجام می‌دهد. \u2066SQLite\u2069 پایگاه دادهٔ محلی است، \u2066Fernet\u2069 از داده‌های هویتی رمزگذاری‌شده محافظت می‌کند و \u2066Cosys-AirSim\u2069 ارتباط دوربین، عمق، وضعیت پرنده و فرمان‌های پرواز را میان \u2066Python\u2069 و \u2066Unreal Engine\u2069 برقرار می‌کند.', 'The project uses YuNet for face detection and five-point landmark extraction, and SFace for identity-embedding generation. In the webcam build, MediaPipe supplies dense facial landmarks for active liveness checks. OpenCV handles image acquisition, face alignment, model inference, and visual overlays, while NumPy performs numerical and array operations. SQLite provides local structured storage, Fernet protects encrypted identity data, and Cosys-AirSim exchanges camera frames, depth data, vehicle state, and flight commands between Python and Unreal Engine.'],
  ['کواد بعد از تشخیص چهره چگونه هدف مشخص را پیدا و دنبال می‌کند؟', 'How does the drone find and follow the designated target after detecting faces?', 'تشخیص وجود چهره به‌تنهایی فرمان تعقیب صادر نمی‌کند. سامانه ابتدا هویت هر کادر را بررسی می‌کند: کادر نارنجی یعنی Unknown یا فرد غیرهدف و فقط برای نمایش ادراک سیستم است؛ کواد آن را دنبال نمی‌کند و Patrol را ادامه می‌دهد. فقط کادری که با هویت مشخص مأموریت تطبیق داده شده و با رأی چند فریم تأیید شود سبز می‌شود. سپس خطای افقی مرکز همان کادر سبز به نرخ yaw تبدیل می‌شود و کواد با سرعت هدف نزدیک می‌شود تا اندازهٔ کادر به نسبت توقف برسد. اگر هدف گم شود، تأیید زمانی پاک و جست‌وجو از سر گرفته می‌شود؛ فرمان اجتناب از مانع همیشه بالاترین اولویت را دارد.', 'Detecting a face alone never issues a pursuit command. The system first evaluates each identity: an orange box means Unknown or non-target and only visualizes perception; the quadrotor ignores it and continues Patrol. Only a face matching the mission’s designated identity and confirmed across multiple frames becomes green. Horizontal error from that green box then controls yaw, and the quadrotor approaches at target speed until the stopping size ratio is reached. If the target is lost, temporal confirmation is cleared and search resumes; obstacle avoidance always has the highest priority.'],
  ['کادر سبز و نارنجی چه معنایی دارند؟', 'What do the green and orange boxes mean?', 'کادر نارنجی نشان می‌دهد یک چهره آشکار شده، اما برای مأموریت هدف معتبر نیست؛ ممکن است ناشناس باشد، امتیازش از Threshold عبور نکرده باشد، تصمیم بین دو هویت مبهم باشد یا اصلاً شخص دیگری غیر از Target باشد. این کادر هیچ فرمان حرکتی برای تعقیب تولید نمی‌کند. کادر سبز فقط پس از عبور از کنترل کیفیت، تطبیق با هویت مشخص مأموریت و تأیید در چند فریم نمایش داده می‌شود و تنها همین کادر وارد کنترل yaw و نزدیک‌شدن کواد می‌شود.', 'An orange box means that a face was detected but is not a valid mission target: it may be unknown, below the similarity threshold, ambiguous between identities, or simply a different person from the designated Target. It produces no pursuit command. A green box appears only after quality checks, a match with the mission’s specific identity, and confirmation across multiple frames; only that green box is allowed to drive yaw and approach control.'],
  ['آیا پروژه به اینترنت نیاز دارد؟', 'Does the project need the internet?', 'پس از نصب کتابخانه‌ها، دریافت مدل‌ها و آماده‌سازی Unreal، پردازش چهره و ارتباط RPC روی همان رایانه یا شبکهٔ محلی انجام می‌شوند و برای اجرای اصلی به سرویس ابری وابسته نیستند. اینترنت فقط برای نصب اولیه، دریافت فایل‌ها، به‌روزرسانی‌ها و مشاهدهٔ نسخهٔ آنلاین سایت لازم است. چت‌بات همین صفحه نیز پاسخ‌ها را از دانش ازپیش‌نوشته‌شده در مرورگر انتخاب می‌کند و پرسش را به سرور ارسال نمی‌کند.', 'After libraries, models, and Unreal are prepared, face processing and RPC communication run on the same computer or local network without a cloud dependency. Internet is needed only for initial installation, downloads, updates, and the hosted website. This page’s assistant also selects answers from prewritten browser-side project knowledge and does not transmit the question to a server.'],
  ['چگونه سیستم را ارزیابی می‌کنید؟', 'How is the system evaluated?', 'دادهٔ آزمون باید از تصاویر ثبت هویت جدا باشد و شخص هدف، افراد ثبت‌شدهٔ غیرهدف و افراد کاملاً ناشناس را در نور، فاصله و زاویه‌های مختلف پوشش دهد. علاوه بر False Accept Rate، False Reject Rate، نرخ Unknown، latency و FPS، باید نرخ Target Confusion نیز اندازه‌گیری شود: چند بار یک فرد غیرهدف اشتباهاً سبز شده و فرمان تعقیب ایجاد کرده است. در بخش پرواز، زمان یافتن هدف، خطای مرکزکردن کادر سبز، فاصلهٔ توقف، بازگشت صحیح به Patrol پس از دیدن نارنجی یا گم‌شدن هدف و درصد موفقیت اجتناب از مانع گزارش می‌شوند.', 'Evaluation data must be separate from enrollment and include the designated target, enrolled non-target identities, and completely unknown people across varied lighting, distance, and pose. In addition to false-accept rate, false-reject rate, Unknown rate, latency, and FPS, evaluation should measure target confusion: how often a non-target incorrectly becomes green and triggers pursuit. Flight tests should report target acquisition time, green-box centering error, stopping distance, correct return to Patrol after orange detections or target loss, and obstacle-avoidance success.'],
];

const tech = [
  ['YuNet', 'Face detection + 5 landmarks'], ['SFace', 'Identity embeddings'], ['MediaPipe', '478-point liveness mesh'],
  ['OpenCV', 'Vision pipeline + ONNX'], ['Cosys-AirSim', 'Python ↔ Unreal RPC'], ['Unreal 5.8', 'Simulation environment'],
];

export default function Home() {
  const [fa, setFa] = useState(true);
  const [light, setLight] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; faText: string; enText: string }>>([
    {
      role: 'bot',
      faText: 'سلام! من دستیار تخصصی Ai Copter هستم. دربارهٔ تشخیص چهره، Liveness، Unreal، کواد، مدل‌ها، سرعت، ایمنی یا اعضای تیم از من سؤال کن.',
      enText: 'Hello! I am the Ai Copter project assistant. Ask me about face recognition, liveness, Unreal, the quadrotor, AI models, speed control, safety, or the team.',
    },
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
  const textDirection = (text: string): 'rtl' | 'ltr' => /[\u0600-\u06FF]/.test(text) ? 'rtl' : 'ltr';

  const findMatch = (question: string) => {
    const normalized = question.toLowerCase()
      .replace(/زنده[‌\s-]*بودن|لایونس|لایونز|لایبنیز|لایفنس/g, 'liveness')
      .replace(/پهپاد/g, 'کواد')
      .replace(/ایر[‌\s-]*سیم/g, 'airsim')
      .replace(/آنریل/g, 'unreal')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const stopWords = new Set(['این','اون','برای','چرا','چطور','چگونه','چیست','است','هست','های','کند','میکند','می‌کند','the','and','what','how','why','does','is','are','about','work','works']);
    const tokens = normalized.split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));
    let bestScore = 0;
    let best: typeof faq[number] | null = null;
    for (const item of faq) {
      const searchable = `${item[0]} ${item[1]}`.toLowerCase()
        .replace(/زنده[‌\s-]*بودن|لایونس|لایونز|لایبنیز|لایفنس/g, 'liveness')
        .replace(/ایر[‌\s-]*سیم/g, 'airsim')
        .replace(/آنریل/g, 'unreal');
      const score = tokens.reduce((total, token) => total + (searchable.includes(token) ? 4 : 0), 0)
        + (searchable.includes(normalized.trim()) ? 8 : 0);
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return bestScore > 0 ? best : null;
  };

  const askQuestion = (value: string) => {
    const question = value.trim();
    if (!question || typing) return;
    const match = findMatch(question);
    setMessages(current => [...current, {
      role: 'user',
      faText: match ? match[0] : question,
      enText: match ? match[1] : question,
    }]);
    setTyping(true);
    window.setTimeout(() => {
      setMessages(current => [...current, {
        role: 'bot',
        faText: match ? match[2] : 'سؤال را با یک موضوع مشخص‌تر مطرح کن؛ برای نمونه Liveness، ثبت هویت، YuNet، SFace، Unreal، RPC، Depth، سرعت کواد، امنیت داده یا ارزیابی علمی.',
        enText: match ? match[3] : 'Please include a more specific project topic—for example liveness, enrollment, YuNet, SFace, Unreal, RPC, depth, drone speed, data security, or scientific evaluation.',
      }]);
      setTyping(false);
    }, 480);
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
          <div className="assistant-note"><b>{t('موضوع‌های تخصصی','EXPERT TOPICS')}</b><span>{t('یکی از پانزده پرسش را انتخاب کن تا پاسخ دقیق و دوزبانه را ببینی.','Choose one of fifteen questions for a precise bilingual answer.')}</span></div>
        </aside>
        <div className="chat-main">
          <div className="chat-topbar"><div><i/><b>{t('دستیار آماده پاسخ‌گویی است','Assistant is ready')}</b></div><span>{t(`${faq.length} موضوع تخصصی`,`${faq.length} expert topics`)}</span></div>
          <div className="chat-messages" aria-live="polite">
            <div className="topic-launcher">
              <div><span>✦</span><b>{t('از کجا شروع کنیم؟','Where should we start?')}</b><small>{t('یک پرسش تخصصی را انتخاب کن','Choose an expert question')}</small></div>
              <div className="suggestions">
                {[
                  t('Liveness چطور کار می‌کند؟','How does liveness work?'),
                  t('کواد چگونه هدف مشخص را پیدا می‌کند؟','How does the drone find the designated target?'),
                  t('کادر سبز و نارنجی چه معنایی دارند؟','What do the green and orange boxes mean?'),
                  t('مدل‌های هوش مصنوعی پروژه کدام‌اند؟','Which AI models power the project?'),
                  t('امنیت اطلاعات هویتی چگونه است؟','How is identity data secured?'),
                  t('نسخه وب‌کم و Unreal چه تفاوتی دارند؟','How do the webcam and Unreal builds differ?'),
                  t('ثبت یک هویت جدید چگونه انجام می‌شود؟','How is a new identity enrolled?'),
                  t('Depth چطور مانع برخورد می‌شود؟','How does Depth prevent collisions?'),
                  t('رأی زمانی چه مشکلی را حل می‌کند؟','What problem does temporal voting solve?'),
                  t('سرعت حرکت کواد چگونه تنظیم می‌شود؟','How is drone speed configured?'),
                  t('\u2066YuNet\u2069 و \u2066SFace\u2069 دقیقاً چه کاری انجام می‌دهند؟','What exactly do YuNet and SFace do?'),
                  t('محدودیت‌های فعلی پروژه چیست؟','What are the project’s current limitations?'),
                  t('اعضای تیم چه کسانی هستند؟','Who are the team members?'),
                  t('RPC چگونه پایتون را به Unreal متصل می‌کند؟','How does RPC connect Python to Unreal?'),
                  t('تصویر Scene و Depth چه تفاوتی دارند؟','How do Scene and Depth images differ?'),
                ].map(question => <button key={question} onClick={() => askQuestion(question)}><span>↗</span>{question}</button>)}
              </div>
            </div>
            {messages.map((message, index) => { const text = fa ? message.faText : message.enText; const direction = textDirection(text); return <div ref={message.role === 'user' ? latestUserMessage : undefined} className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span className="message-icon">{message.role === 'bot' ? 'AI' : t('شما','YOU')}</span><div><small dir={direction}>{message.role === 'bot' ? 'SIMORGH' : t('شما','YOU')}</small><p dir={direction} lang={direction === 'rtl' ? 'fa' : 'en'}>{text}</p></div></div>; })}
            {typing && <div className="chat-message bot"><span className="message-icon">AI</span><div><small>SIMORGH</small><p className="typing-dots"><i/><i/><i/></p></div></div>}
          </div>
          <div className="chat-footnote"><i>◆</i>{t('پاسخ‌ها داخل مرورگر نمایش داده می‌شوند و هیچ داده‌ای ارسال یا ذخیره نمی‌شود.','Answers are displayed locally in your browser; no data is transmitted or stored.')}</div>
        </div>
      </div>
    </section>

    <section className="final"><div className="shell"><span>{t('پروژه پژوهشی هوش مصنوعی','AN AI RESEARCH PROJECT')}</span><h2>{t('وقتی دیدن، فهمیدن و حرکت‌کردن به یک سامانه تبدیل می‌شوند.','Where seeing, understanding, and moving become one system.')}</h2><a className="primary back-to-top" href="#top">{t('بازگشت به آغاز','Back to the top')} ↑</a></div></section>
    <footer className="shell"><div className="brand"><span className="brand-mark"><b>AI</b></span><span><strong>AI COPTER</strong><small>2026 RESEARCH PROJECT</small></span></div><p>{t('ساخته‌شده با مسئولیت، رضایت و پردازش محلی.','Built with responsibility, consent, and local-first processing.')}</p><b>ALLAMEH HELLI 5</b></footer>
  </main>;
}
