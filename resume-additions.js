const resumeProjects=[
{slug:'badge',category:'CONSUMER PRODUCT × INTERACTION',title:'An Emotional Digital Companion',zh:'二次元电子吧唧',desc:'Turning gestures, expressions and content updates into a playful everyday companion.',role:'商业调研 · 交互功能 · 跨校协作',date:'2026.01 — 至今',owner:'商业调研主要负责人、软件研发与硬件协同',status:'原型迭代 · 商业化推进阶段',tag:'Market research & prototyping',tags:['Product Research','Interaction','ESP32-S3','FreeRTOS','RFID'],lead:'从潮玩与陪伴场景出发，把动作、表情、音效和内容更新组织成一套可体验的互动。',coverLabel:'Working prototype',coverCaption:'真实电子吧唧原型；外观与功能仍在迭代。',phase:'Developed project'},
{slug:'bed-robot',category:'ROBOTICS × PRODUCT DESIGN',title:'A Robot for Everyday Care',zh:'扫床机器人',desc:'Framing a cleaning task as a product, from feasibility and core functions to a testable robot.',role:'产品方案 · 商业分析 · 研发推进',date:'2026.04',owner:'产品方向负责人、嵌入式软件方向负责人',status:'可验证原型与功能联调',tag:'Product definition & delivery',tags:['Product Definition','Robotics','ESP32-S3','ESP-IDF','ADRC'],lead:'把自动扫床的使用场景，转化为清晰的产品方案、核心功能与验证路径。',coverLabel:'Product workflow study',coverCaption:'功能与验证链路示意；非产品实物照片。',phase:'Developed project'}
];
const resumeCases={
badge:[
['Overview','把静态潮玩，变成可回应的陪伴体验。','面向二次元潮玩与陪伴场景，承担商业调研、独立软件研发与硬件协同工作，将动作触发、表情音效反馈、内容更新需求落实为交互功能。'],
['Problem','互动不仅需要反馈，也需要持续更新的内容。','围绕潮玩与陪伴场景，项目探索如何让用户的动作与接触触发不同反馈，并让后续内容更新成为产品体验的一部分。'],
['Context','产品与商业方案一起推进。','自 2026.01 持续参与，与中南大学、华南农业大学等成员协作，推进设计、版本迭代和联调。项目目前处于商业化推进阶段。'],
['Research','从商业可行性与场景需求出发。','开展商业可行性分析，撰写商业计划书，准备路演材料并参与项目评审，结合反馈完善产品与商业方案。','<p class="case-note">未提供独立竞品清单、访谈样本数或市场规模数字，因此不呈现未经证实的量化结论。</p>'],
['Key Insight','让触发、反馈与更新构成连续体验。','动作触发、表情音效与内容更新需要共同设计。产品价值不仅来自一次互动，也来自内容和体验能够持续迭代。','quote'],
['Product Decision','以明确的交互链路承接陪伴场景。','将动作触发、表情音效、媒体更新分别拆解为功能，并与硬件协同验证。商业调研与评审反馈同时进入产品方案迭代。','<div class="decision-grid"><div class="decision"><strong>交互链路</strong><p>姿态识别 / RFID 触发 → 表情与音视频反馈，形成可体验的回应。</p></div><div class="decision"><strong>持续使用</strong><p>通过局域网媒体更新承接内容变化，让内容维护进入产品功能范围。</p></div></div>'],
['Solution','将动作、内容和多媒体反馈连接起来。','独立研发软件，协同硬件完成姿态识别、RFID 触发、音视频播放与局域网媒体更新，并推进初代演示与后续原型迭代。'],
['Technical Implementation','多任务协作支撑流畅的交互链路。','基于 ESP32-S3 / FreeRTOS 协调显示、音频、传感器与存储任务。产品功能与硬件协作并行推进，通过联调确认触发、播放与更新环节。','tech'],
['Validation','在版本迭代中验证功能协同。','已完成初代演示及后续原型迭代；结合项目评审与联调反馈完善方案。','<div class="evidence-grid"><figure><img src="assets/badge-v1.jpg" alt="二次元电子吧唧初代演示"><figcaption>初代演示 · 媒体反馈</figcaption></figure><figure><img src="assets/badge-iterations.jpg" alt="电子吧唧迭代后的实物原型"><figcaption>迭代后的实物原型</figcaption></figure></div>'],
['Outcome','形成演示原型，继续推进商业化。','完成可演示的交互原型与版本迭代，形成商业计划、路演和评审材料。商业化仍在推进，不展示未经证实的销售或用户增长数据。','<p><a class="text-link" href="https://github.com/titfly77-cyber/emotion_screen" target="_blank" rel="noopener">Explore project source ↗</a></p>'],
['Reflection','把原型反馈转化为下一版的产品优先级。','后续继续梳理触发可靠性、反馈体验、内容更新与商业场景之间的关系，用实际体验和评审意见决定下一版的重点。','<p class="case-note">本节为后续复盘方向。</p>']
],
'bed-robot':[
['Overview','从自动清洁场景，到可以验证的产品原型。','担任产品方向负责人和嵌入式软件方向负责人，围绕自动扫床规划产品方案、核心功能与实现路径，并推进商业评估、研发分工和联调。'],
['Problem','把一个日常清洁任务，转化为明确的设备目标。','以自动扫床场景为切入点，需要将“完成清洁”拆解为设备运动、环境感知与执行协作等可推进的功能。'],
['Context','产品定义与工程可行性共同推进。','项目时间为 2026.04。我负责产品方向与嵌入式软件方向，同时作为商业调研主要负责人推进可行性分析与评审沟通。'],
['Research','让商业评估与产品方案相互校验。','完成可行性分析、商业计划书、路演材料与评审沟通，结合反馈优化产品方案、核心功能和实现路径。','<p class="case-note">现有材料未提供用户访谈数量、市场规模或清洁性能数据。</p>'],
['Key Insight','产品目标需要成为可分工、可验证的研发任务。','把产品方案拆成清晰的软件任务与联调目标，有助于让团队围绕同一条实现路径推进，而不止于功能清单。','quote'],
['Product Decision','优先建立原型与验证路径。','将产品目标拆解为嵌入式软件任务，协调团队分工与迭代节奏，通过底盘控制、感知与功能联调逐步验证方案。','<div class="decision-grid"><div class="decision"><strong>产品侧</strong><p>明确自动扫床场景、核心功能与可行性，用评审反馈完善方案。</p></div><div class="decision"><strong>交付侧</strong><p>协调分工与迭代节奏，推进运动、感知和控制功能的联调。</p></div></div>'],
['Solution','让运动控制与感知功能形成可验证链路。','基于 ESP32-S3 / ESP-IDF 推进差速底盘、控制、里程计及巡线 / 避障能力，形成可验证原型与功能联调基础。'],
['Technical Implementation','从底盘控制到多传感器协作。','开发差速底盘、ADRC 控制、编码器与 IMU 融合里程计及巡线 / 避障，将产品目标与嵌入式实现连接起来。','tech'],
['Validation','以原型和功能联调检查实现路径。','已推进可验证原型与功能联调。清洁覆盖、任务完成和边界条件的量化测试记录尚未提供，需要后续补充。'],
['Outcome','完成方案推进与可验证原型实践。','形成产品与商业方案、商业计划书、路演材料，并推进团队研发与联调，不将原型实践描述为量产交付。'],
['Reflection','让下一轮验证回到使用场景。','后续复盘将把整机功能与具体清洁任务对应起来，优先补充任务过程、边界条件及测试记录，再判断需要怎样的产品迭代。','<p class="case-note">本节为后续验证方向。</p>']
]
};
const resumeTechnical=[
['人脸视觉门禁系统','2025.06','在 Ubuntu / 树莓派 5B 部署 YOLOv8n，搭建实时人脸检测链路，通过总线舵机实现视觉结果与门禁动作联动。'],
['STM32F4 机械臂控制系统','2025.04','负责电控与运动学，基于 HAL、逆运动学及分段运动控制完成目标点到达与实机联调；机械结构由队友负责。'],
['巡线声光小车','电控、机械设计与组装','使用 STM32、编码器反馈和 PID 实现双轮速度闭环，集成巡线、测距、IMU 与声光状态反馈。'],
['烟草划筋机研发','驱动与设备联调','负责金属传感器驱动开发与气动装置联调，参与整机电控及结构方案辅助设计、设备调试。'],
['模拟电赛控制实践','2025.09','设计电控架构，编写 ADRC、传感器融合及巡线 / 避障程序，协同团队完成嵌入式功能开发。'],
['无人机硬件与手部外骨骼','硬件迭代与数据采集','完成无人机主体板、遥控器板的硬件改版与焊接；参与编码式手部外骨骼穿戴、操作及数据采集。']
];
const resumeCampus=[
['农业人工智能实验室','2024.12 — 至今 · 本科生成员','参与农业机器人研发，担任智能桌游项目发起人与负责人；对接企业烟草打顶、菜心采摘机器人项目，协助需求沟通、技术方案衔接与研发协同。'],
['智慧农业协会','2024.12 — 至今 · 副会长','制定部门职能规划，统筹部门协作、日常工作及团队事务，推进协会工作执行。'],
['湘江卓越工程师学院','2025.09 — 至今 · 教务科科室助理','协助教学管理与学生事务对接，参与网络教学平台搭建维护、课程信息录入、教学资源配置及通知传达。'],
['暑期“三下乡”社会实践','2025.08 · 永州实践团队成员','参与活动策划、实地调研走访、宣传服务、资料收集与成果整理，协同完成执行与总结汇报。'],
['农眸 AIvideo 团队','团队成员 · AIGC 内容实践','负责农业机械宣传片的素材生成、音轨铺设与剪辑；茶叶采摘、萎凋设备宣传片获合作公司采用，相关宣传视频业务实现盈利。']
];
function resumeExtras(){const rows=arr=>arr.map(([title,meta,body])=>`<div class="mini-project"><div><h3>${title}</h3><small>${meta}</small></div><p>${body}</p></div>`).join('');return `${resumeInternships()}<section class="section" id="technical-practice"><div class="wrap">${sectionHead('05 / TECHNICAL PRACTICE','Engineering as a product advantage.')}<p class="section-summary">工程实践帮助我更早识别实现约束，也让我能与研发围绕具体问题沟通。</p>${rows(resumeTechnical)}</div></section><section class="section about-section" id="collaboration"><div class="wrap">${sectionHead('06 / COLLABORATION & COMMUNICATION','Make collaboration happen.')}<p class="section-summary">需求沟通、团队组织、现场调研与内容汇报，是产品推进中的另一部分工作。</p>${rows(resumeCampus)}</div></section><section class="section" id="education"><div class="wrap">${sectionHead('07 / EDUCATION & TOOLS','Always learning.')}<div class="mini-project"><div><h3>湖南农业大学</h3><small>湘江卓越工程师学院 · 2024.09 — 至今</small></div><p>智能科学与技术本科在读，预计 2028.07 毕业。主修自动化、机械设计、深度学习。CET-4，可独立读写英文技术文档、用英语介绍产品并沟通。</p></div><div class="mini-project"><div><h3>产品与表达工具</h3><small>调研 · 原型 · 数据 · 内容</small></div><p>Figma、TAPD、Excel、Word、PPT；使用 Codex 辅助设计与开发，使用 Perplexity、NotebookLM 开展网络调研。具备摄影、短片拍摄、小红书 / 抖音内容策划与运营经验，使用 PS、AE、PR 及 AI 工具辅助内容创作；参加大学生创业比赛。</p></div></div></section>`}

function resumeInternships(){const items=[
['长沙市康通电子科技有限公司','2026.08 — 至今 · AI 体锻机项目','围绕人脸识别和体测场景，对接产品、开发与测试，梳理需求及验证要点，参与问题复现、定位与联调验证。独立完成内部知识问答 Agent 方案设计，规划资料共享、部门分区及分级授权；尚未实际应用。','参与 RK3588 摄像头联调、YOLO-Face / ArcFace 接口调试及 MediaPipe Pose 功能验证，参与 Android 体锻屏运维 App 编写与调试。'],
['深圳市纬尔科技','2026.07 — 2026.08 · 棉花打顶机器人项目','赴新疆开展田间联调，围绕车体运动、执行机构响应以及漏切 / 误伤现象分析问题，协同工程师优化并完成实机验证。','参与 STM32F4 切割时序分析，梳理视觉目标、轮速计、IMU 与刀片触发关系，连接现场问题与控制链路。'],
['深圳科创学院','2026.01 · 机器人研发部 HMI / 上位机实习','独立完成串口屏的需求梳理、页面架构与交互设计，覆盖运行控制、参数设置、状态显示及报警提示。协同控制端解决指令解析、数据刷新与页面同步问题；独立向沙特团队用英语介绍产品。','经团队讨论后独立设计串口协议，实现参数下发与状态同步；完成通信异常测试、编译烧录和整机验证，交付可部署 HMI 工程；开展 URDF 导入、ROS 2 / Gazebo 机械臂控制实践。']
];return '<section class="section about-section" id="internship-detail"><div class="wrap">'+sectionHead('04 / INTERNSHIP PRACTICE','Connect requirements with validation.')+items.map(([title,meta,product,tech])=>'<article class="internship-detail"><h3>'+title+'</h3><p class="meta">'+meta+'</p><div class="decision-grid"><div class="decision"><strong>产品协作与推进</strong><p>'+product+'</p></div><div class="decision"><strong>技术实现与验证</strong><p>'+tech+'</p></div></div></article>').join('')+'</div></section>';}
