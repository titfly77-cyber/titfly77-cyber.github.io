import assets from './figma-assets.json';
import copy from './content.json';
import narrative from './narrative.json';
export {copy,narrative};
export const A=(page,key)=>assets[page+'.txt'][key];
export const homeAssets=assets['context-0.txt'];
export const projects=[
 {id:'board',title:'BOARD-MIND',tag:'AI Hardware / Product Design',category:'hardware',year:'2026',short:'我负责产品定义、设备设计与研发推进。',slogan:'让氛围，跟上故事。',cover:'assets/covers/board.png',image:A('context-0','imgVisual'),scene:A('122-1046','imgSceneHeroBoard'),role:'项目发起人与负责人',period:'2026.02 — 至今'},
 {id:'badge',title:'电子吧唧',tag:'Consumer Electronics',category:'hardware',year:'2026',short:'动作、表情、声音，组成随身陪伴体验。',slogan:'让随身陪伴，有回应。',cover:'assets/covers/badge.png',image:A('4-26','imgImageBadge'),scene:A('4-26','imgSceneHeroBadge'),role:'商业调研主要负责人 / 软件研发与硬件协同',period:'2026.01 — 至今',context:'面向二次元潮玩与陪伴场景，将动作、表情、音效与内容更新连接成随身交互体验。',define:'我负责商业可行性分析、商业计划书、路演及评审沟通，与中南大学、华南农业大学等成员协作。',outcome:'完成初代演示并持续推进原型迭代，处于商业化推进阶段。',technical:'我负责基于 ESP32-S3 / FreeRTOS 的软件研发，连接姿态识别、RFID 触发、音视频播放与局域网更新，并参与硬件协同。',source:'https://github.com/titfly77-cyber/emotion_screen'},
 {id:'robot',cover:'assets/covers/robot.png',title:'扫床机器人',tag:'Robotics / Product Design',category:'robot',year:'2026',short:'从清洁场景，到核心功能和原型联调。',slogan:'把清洁需求，变成可验证原型。',scene:A('4-29','imgSceneHeroRobot'),role:'产品方向负责人 / 嵌入式软件方向负责人',period:'2026.04',context:'围绕自动扫床场景定义方案与核心功能，将产品目标转化为可以迭代的研发任务。',define:'我负责自动扫床方案、核心功能及实现路径，推进商业分析、商业计划书、路演与评审。',outcome:'推进可验证原型与功能联调，在控制与任务协作中持续迭代。',technical:'我负责嵌入式软件方向，基于 ESP32-S3 / ESP-IDF 推进差速底盘、ADRC 控制、编码器与 IMU 融合里程计，以及巡线、避障联调。'},
 {id:'tobacco',title:'烟草秸秆智能清理机',tag:'Agricultural Equipment',category:'robot',year:'2024–2025',short:'从田间问题出发，贯通机械、视觉与电控。',slogan:'让技术，走进田间。',cover:'assets/covers/tobacco.png',image:A('4-32','imgImageTeam'),scene:A('4-32','imgSceneHeroTobacco'),role:'机械与电控技术负责人',period:'2024.11 — 2025.07',context:'面向烟草收割后的秸秆处理，贯通结构设计、视觉定位与清理执行。',define:'我负责整机结构、传动机构与刀辊设计，围绕秸秆清理任务整合机械与电控方案。',outcome:'项目获得“金种子计划”5 万元投资支持，并获人民日报、湖南卫视报道。',technical:'我负责使用 OpenCV / YOLO 识别定位秸秆并解算目标坐标，迭代底层驱动及清理路径。'},
 {id:'agent',cover:'assets/covers/agent.png',title:'项目知识问答 Agent',tag:'AI Product / Pilot',category:'ai',year:'2026',short:'依据 TAPD 需求生成测试用例，辅助测试理解需求。',slogan:'让信息，找到需要它的人。',scene:A('4-35','imgSceneHeroAgent'),role:'内部知识问答 Agent 方案独立设计',period:'2026.08 — 至今',context:'围绕跨部门信息对接，设计资料共享、部门分区与分级授权的知识问答方案。',define:'我负责梳理资料共享与访问边界，将不同部门的信息需求和授权层级组织为明确的方案。',outcome:'方案设计完成，已完成小范围试行。',outcomeDetail:'依据 TAPD 中的现有需求生成测试用例，并帮助测试人员理解需求，将项目资料转化为测试工作可使用的参考。',technical:'我负责内部知识问答 Agent 方案设计，规划按部门分区、分级授权访问。已完成小范围试行，试行中依据 TAPD 需求生成测试用例，并辅助测试人员理解需求。'}
];
export const process=[
 ['发现','先理解，为什么需要它。','结合场景观察、用户需求沟通与网络调研，识别真实问题，再用竞品和市场信息判断机会。','用户调研 · 需求分析 · 竞品与市场分析','场景梳理 / 需求清单 / 商业可行性'],
 ['定义','把问题，变成产品方向。','梳理业务流程与操作逻辑，明确产品边界、核心功能及优先级，建立可验证的目标。','业务流程 · 产品定义 · 功能优先级','业务流程 / 产品方案 / 功能优先级'],
 ['设计','让方案，可以被看见。','使用 Figma 表达页面结构、交互流程和关键状态；使用 TAPD 撰写需求，明确功能与验证要点。','原型设计 · PRD 文档','交互原型 / 需求文档 / 验证要点'],
 ['推进','让不同专业，走向同一个目标。','协调团队分工、软硬件协作与迭代节奏，跟进联调和问题验证，把产品目标转成可执行任务。','沟通推进 · 团队协作 · 项目管理','研发任务 / 迭代计划 / 问题跟踪'],
 ['验证','在真实反馈里，继续迭代。','结合现场测试、Excel 数据整理和统计对比复盘方案，以路演、PPT 和项目汇报清楚呈现决策与进展。','数据分析 · 验证复盘 · PPT 与汇报','测试记录 / 数据图表 / 复盘汇报']
];
export const experience=[
 ['2026.08 — 至今','长沙市康通电子科技有限公司','AI 体锻机 / 需求分析与功能验证','围绕人脸识别与体测场景，对接产品、开发和测试，梳理需求及验证要点，推进问题复现、联调和功能验证。独立完成内部知识问答 Agent 方案设计，已完成小范围试行：依据 TAPD 需求生成测试用例，并帮助测试人员理解现有需求。','PRODUCT · AI · VALIDATION'],
 ['2026.07 — 2026.08','深圳市纬尔科技','棉花打顶机器人 / 田间联调','赴新疆开展田间联调，结合车体运动、执行机构响应及漏切、误伤现象分析问题，协同工程师优化并完成实机验证。','FIELD · ROBOTICS · ITERATION'],
 ['2026.01','深圳科创学院','机器人研发部 / HMI 与上位机','独立完成串口屏需求梳理、页面架构、交互与串口协议设计，交付可部署 HMI。实践 ROS 2 / Gazebo 机械臂控制，并向沙特团队用英语介绍产品。','INTERACTION · HMI · ROBOTICS']
];
export const films=[
 {id:'film1',title:'茶叶采摘设备宣传片',cover:'assets/covers/tea-harvesting.png',video:'assets/videos/tea-harvesting.mp4',meta:'AIGC / 素材生成 / 音轨铺设 / 剪辑'},
 {id:'film2',title:'萎凋设备宣传片',cover:'assets/covers/tea-withering.png',video:'assets/videos/tea-withering.mp4',meta:'AIGC / 农业机械 / 产品传播'}
];
