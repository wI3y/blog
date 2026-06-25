document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initModal();
});

// ============================================
// Navbar
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  }));
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); }});
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
}

// ============================================
// Back to Top
// ============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================
// Modal
// ============================================
const projects = [
  {
    title: 'AI 智能会议纪要助手',
    date: '2026.03 — 2026.06',
    desc: [
      '基于 FastAPI + Vue3 + LangGraph + Whisper 的跨会议记忆 Agent 系统。支持音视频上传、语音转写、AI 摘要生成、向量语义检索。',
      '采用 LangGraph StateGraph 替代 LangChain Chain 线性执行，利用状态持久化与条件路由实现 Agent 自主决策，解决跨会议信息无法关联的问题；引入向量检索替代关键词匹配，实现跨会议语义搜索，模型不可用时自动降级为关键词匹配。',
      '设计 JSON 文件为主存储、Redis 为缓存的降级方案，Redis 故障时自动切换，保证服务可用性；抽象统一 Provider 接口，支持通义千问、智谱 GLM、OpenAI、Ollama 等 5 种后端，切换仅需修改环境变量。',
      '集成 Whisper 实现本地语音转写，设计结构化 Prompt 提取决策、待办、事实三类记忆；全栈架构自动生成 API 文档，Pinia 管理前端状态。',
    ],
    tech: ['Vue3', 'FastAPI', 'LangGraph', 'Whisper', 'Redis', '向量检索'],
    links: [{ text: 'GitHub', url: 'https://github.com/wI3y/ai-meeting-assistant' }],
  },
  {
    title: '实验室资产智能管理系统',
    date: '2025.10 — 2026.01',
    desc: [
      '集成大模型 API 构建"资产运维智能问答助手"，结合 RAG 技术挂载实验室设备操作手册与维修 SOP，实现自然语言交互式查询，解决师生查阅资料繁琐的问题。',
      '开发基于异常检测的智能预警模块，通过监控资产流转与设备状态数据，自动识别库存短缺与设备异常趋势，实现从被动响应到主动预警的转变。',
      '采用 FastAPI + Vue3 + Nacos 微服务架构，基于 RBAC 模型实现资产全生命周期的线上审批与流程管控；使用 AI 辅助编程工具（Codex）辅助完成代码生成与工程化开发，自主主导架构设计与代码审核。',
    ],
    tech: ['Vue3', 'FastAPI', 'Nacos', 'RAG', 'Codex', 'RBAC'],
    links: [],
  },
  {
    title: '大学排名分析平台',
    date: '2025.06 — 2025.07',
    desc: [
      '编写 Python 爬虫采集多源高校排名数据，通过正则匹配与动态解析处理结构不一致的网页，完成数据清洗与标准化，存入 MySQL 构建分析数据集。',
      '使用 Pandas 对排名数据进行统计分析，计算各维度的分布与变化趋势，识别排名波动特征；基于 ECharts 实现多维度排名数据的可视化展示，直观呈现不同年份与指标下的排名变化规律。',
    ],
    tech: ['Vue.js', 'Express', 'Python', 'MySQL', 'ECharts', '爬虫'],
    links: [],
  },
];

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const cards = document.querySelectorAll('.project-card[data-project]');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.project);
      const p = projects[idx];
      if (!p) return;

      document.getElementById('modalTitle').textContent = p.title;
      document.getElementById('modalDate').textContent = p.date;

      const body = document.getElementById('modalBody');
      body.innerHTML = p.desc.map(d => `<p>${d}</p>`).join('');

      const techEl = document.getElementById('modalTech');
      techEl.innerHTML = p.tech.map(t => `<span>${t}</span>`).join('');

      const linksEl = document.getElementById('modalLinks');
      linksEl.innerHTML = p.links.map(l =>
        `<a href="${l.url}" target="_blank" rel="noopener">${l.text}</a>`
      ).join('');

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}
