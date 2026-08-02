// ─── SOURCE OF TRUTH: Resume(Nan).pdf (current) ────────────────
// All copy below is transcribed/condensed from the resume. No
// metrics, dates, or links are invented — placeholders are marked
// explicitly where the resume didn't provide a URL.

export const ME = {
  name: 'Nandu Panakanti',
  title: 'Software Engineer',
  subtitle: 'Backend & Distributed Systems · AI/LLM Engineering · Cloud Infrastructure',
  summary:
    "Software engineer with production backend experience in an Agile engineering team and six full systems designed, built, and deployed end to end over the past year across Java, Python, TypeScript, and Node.js. Builds distributed and event-driven services with Spring Boot, FastAPI, and Express, backed by PostgreSQL, MongoDB, and Redis, and ships them on AWS with Docker and GitHub Actions CI/CD. Designs LLM agent systems with LangGraph and the Claude and OpenAI APIs, including conditional reasoning graphs, tool calling, and retrieval.",
  email: 'panakantinandu@gmail.com',
  phone: '+1 (913) 206-2988',
  linkedin: 'https://www.linkedin.com/in/nandu-panakanti-41839731a/',
  github: 'https://github.com/panakantinandu',
  resume: '/assets/Resume(Nan).pdf',
  location: 'Overland Park, KS',
  relocate: true,
  degree: 'M.S. Computer Science',
  school: 'University of Central Missouri',
  gradDate: 'May 2026',
  available: true,
};

// 7 projects, resume priority order. `linksPending: true` marks
// projects whose GitHub/live URLs the resume didn't expose as
// plain text — swap in real URLs when available.
export const PROJECTS = [
  {
    id: 1,
    num: '01',
    name: 'FactoryFlow AI Agent',
    subtitle: 'Manufacturing Operations Copilot',
    category: 'AI Agents',
    date: 'Jun 2026',
    accent: '#6366f1',
    desc: 'A polyglot distributed system splitting concerns across two services: a Java Spring Boot service owning the REST API surface, JPA entities, and PostgreSQL persistence, and a Python FastAPI service owning all LangGraph agent reasoning, tool execution, and LLM calls — communicating over HTTP with versioned interface contracts.',
    bullets: [
      'Conditional LangGraph reasoning graph routes high-confidence alarms to a fast path using validated prior fixes; low-confidence alarms trigger retrieval, incident search, and Tavily web search before diagnosis.',
      'Compounding institutional-knowledge layer persists resolved incidents with a times_reused counter, so resolution speed measurably improves as usage accumulates.',
      'Delivered solo in a 24-hour build window — 7-table normalized PostgreSQL schema through AWS deployment, GitHub Actions CI/CD, and a React frontend streaming live agent reasoning over Server-Sent Events.',
    ],
    stack: ['Java 17', 'Spring Boot', 'Python', 'FastAPI', 'LangGraph', 'LangChain', 'PostgreSQL', 'React', 'AWS', 'GitHub Actions', 'Featherless AI', 'Tavily'],
    github: 'https://github.com/panakantinandu/factoryflow-ai',
    live: 'https://factoryflow-ai.vercel.app/',
  },
  {
    id: 2,
    num: '02',
    name: 'PropMind',
    subtitle: 'Multi-Tenant Property Management SaaS',
    category: 'AI SaaS',
    date: 'Apr – May 2026',
    accent: '#22d3ee',
    desc: 'Multi-tenant SaaS serving two distinct user classes through separate admin and tenant portals with independent auth flows, built on a shared backend service layer to avoid duplicated business logic.',
    bullets: [
      'Stripe Checkout with idempotent webhook processing and a double-entry ledger — every transaction is traceable and replay-safe under unreliable network conditions.',
      'BullMQ/Redis background job pipelines automate invoice generation, late-fee enforcement, and rent reminders.',
      'Three production LLM features on the OpenAI API: tenant risk scoring, maintenance ticket triage with priority classification, and a natural-language support assistant over live database records.',
      'JWT auth, OAuth 2.0, CSRF protection, rate limiting, and input sanitization; dual-portal monorepo on AWS-backed infrastructure with GitHub Actions CI/CD and Socket.io real-time notifications.',
    ],
    stack: ['Node.js', 'TypeScript', 'Express', 'React', 'PostgreSQL', 'MongoDB', 'Redis', 'BullMQ', 'Socket.io', 'OpenAI API', 'Stripe', 'AWS'],
    github: 'https://github.com/panakantinandu/PropMind',
    live: 'https://propmind-6mkn.onrender.com/',
    liveLabel: 'Admin Demo',
    liveSecondary: 'https://propmind-tenant.onrender.com/',
    liveSecondaryLabel: 'Tenant Demo',
  },
  {
    id: 3,
    num: '03',
    name: 'Raki',
    subtitle: 'AI-Powered Practice Management for Chartered Accountants',
    category: 'AI SaaS',
    date: 'Jul 2026',
    accent: '#a855f7',
    desc: 'Multi-tenant SaaS that automates GST, ITR, and TDS filing schedules for chartered-accountant firms, owned end to end from relational schema through production deployment.',
    bullets: [
      'Strict tenant data isolation across 15+ REST endpoints via Spring Security with JWT and Google OAuth2, account-scoped query filtering, and Redis-backed rate limiting.',
      'Anthropic Claude API extracts structured fields automatically from unstructured client invoice documents, cutting repetitive data entry on recurring filings.',
      'Containerized, horizontally scalable deployment on Railway with Docker, managed PostgreSQL, Redis, and load-balanced backend instances.',
    ],
    stack: ['Java 17', 'Spring Boot 3', 'Spring Security', 'Spring Data JPA', 'PostgreSQL', 'Redis', 'React 18', 'Tailwind CSS', 'JWT', 'OAuth2', 'Claude API', 'Docker', 'Railway'],
    github: 'https://github.com/panakantinandu/raki-ca-platform',
    live: 'https://frontend-production-d7f3.up.railway.app/',
  },
  {
    id: 4,
    num: '04',
    name: 'AI SaaS Operations Copilot',
    subtitle: 'GitHub Intelligence Platform',
    category: 'Dev Tools',
    date: 'May – Jun 2026',
    accent: '#f472b6',
    desc: 'Analytics platform that authenticates via GitHub OAuth 2.0, syncs repository data, and flags security exposures, dormant repositories, and CI/CD spend through modular analytics services.',
    bullets: [
      'LLM recommendation engine produces per-repository guidance, plus a conversational copilot answering natural-language questions over live engineering data.',
      'FastAPI backend with clear service-layer separation, SQLAlchemy ORM, and a PostgreSQL schema indexed for analytics aggregation queries.',
    ],
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'React', 'TypeScript', 'GitHub API', 'OAuth 2.0', 'LLM APIs', 'Vercel'],
    github: 'https://github.com/panakantinandu/ai-saas-copilot',
    live: 'https://ai-saas-copilot.vercel.app/',
  },
  {
    id: 5,
    num: '05',
    name: 'AI Workflow Automation Platform',
    subtitle: 'Orchestrated LLM Task Execution',
    category: 'Automation',
    date: 'Mar – Apr 2026',
    accent: '#6366f1',
    desc: 'Orchestration layer making multi-step LLM workflows reliable in the presence of transient API failures — structured output parsing, retry logic, and persistent job status tracking.',
    bullets: [
      'FastAPI + PostgreSQL backend for workflow storage and analytics, paired with a role-based-access-controlled React/TypeScript frontend.',
      'Deployed on AWS EC2 with Docker containerization and a GitHub Actions CI/CD pipeline.',
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'AWS EC2', 'AWS S3', 'Docker', 'GitHub Actions'],
    github: 'https://github.com/panakantinandu/ai-workflow-platform',
    live: 'https://ai-workflow-platform-sigma.vercel.app/',
  },
  {
    id: 6,
    num: '06',
    name: 'Employee Attrition Prediction System',
    subtitle: 'End-to-End ML Pipeline',
    category: 'ML / XAI',
    date: 'Oct – Nov 2025',
    accent: '#22d3ee',
    desc: 'Supervised ML pipeline making attrition predictions auditable rather than opaque, addressing the explainability requirement that blocks ML adoption in HR decision contexts.',
    bullets: [
      'SHAP TreeExplainer for per-prediction feature attribution; SMOTE class balancing for imbalanced attrition data.',
      'Deployed as a Streamlit app supporting batch CSV prediction, model performance monitoring, and visual feature-importance analysis.',
    ],
    stack: ['Python', 'Scikit-Learn', 'SHAP', 'Pandas', 'NumPy', 'Streamlit'],
    github: 'https://github.com/panakantinandu/ML_Project-Nan-',
    live: 'https://ml-project-nan.onrender.com/',
  },
  {
    id: 7,
    num: '07',
    name: 'StudyMate',
    subtitle: 'Full-Stack Learning Platform',
    category: 'Full-Stack',
    date: '2024 – 2025',
    accent: '#a855f7',
    desc: 'Learning platform with prepared statements throughout, password hashing, and role-based session authentication separating Student and Admin privileges — prevents SQL injection and credential exposure.',
    bullets: [
      'Normalized MySQL schema across 10+ tables with foreign keys, cascading deletes, and multi-table joins.',
      'Admin CRUD interface with cascaded database cleanup, analytics views, rating systems, notifications, and login-history tracking.',
    ],
    stack: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'Bootstrap', 'jQuery', 'JavaScript', 'Session Auth', 'OOP'],
    github: 'https://propmind-tenant.onrender.com/', live: null, linksPending: true,
  },
];

// 9 categories / 61 items — curated cut of the full resume skills
// list (Languages, Backend, Frontend, AI/LLM, Databases, Cloud,
// Security, ML, Fundamentals & Practices merged into one).
export const SKILL_CATEGORIES = [
  { key: 'languages', label: 'Languages', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'] },
  { key: 'backend', label: 'Backend & APIs', items: ['Spring Boot', 'Spring Security', 'FastAPI', 'Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'Microservices'] },
  { key: 'ai', label: 'AI & LLM Engineering', items: ['LangGraph', 'LangChain', 'Claude API', 'OpenAI API', 'Agent Orchestration', 'RAG Pipelines', 'Prompt Engineering', 'Claude Code'] },
  { key: 'frontend', label: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Bootstrap'] },
  { key: 'data', label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Query Optimization'] },
  { key: 'cloud', label: 'Cloud & Infrastructure', items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Terraform', 'Docker', 'GitHub Actions', 'NGINX', 'Linux'] },
  { key: 'security', label: 'Security', items: ['JWT', 'OAuth 2.0', 'RBAC', 'API Security', 'Web App Firewalls'] },
  { key: 'ml', label: 'Machine Learning', items: ['Scikit-Learn', 'SHAP', 'Pandas', 'NumPy', 'Streamlit'] },
  { key: 'fundamentals', label: 'Fundamentals & Practices', items: ['Data Structures & Algorithms', 'OOP', 'Design Patterns', 'System Design', 'Distributed Systems', 'Git', 'Agile / Scrum', 'Testing', 'Code Reviews'] },
];

// Chronological — oldest first (feeds the SVG draw-in timeline).
export const EXPERIENCE = [
  {
    date: 'Aug 2023 – Jun 2024',
    title: 'Research Analyst, Software Systems',
    place: 'Central Institute of Tool Design',
    tags: ['Embedded Systems', 'Signal Processing', 'Python'],
    bullets: [
      'Built a real-time embedded object detection system on Arduino with ultrasonic sensors, implementing time-of-flight signal processing to produce accurate distance measurements in a Linux/Unix environment.',
      'Improved measurement reliability with Python data-visualization workflows and structured calibration testing.',
    ],
  },
  {
    date: 'Sep 2025 – Jan 2026',
    title: 'Software Engineer Intern',
    place: 'Jio Robotics · Overland Park, KS',
    tags: ['Backend Engineering', 'REST APIs', 'Agile / Scrum'],
    bullets: [
      'Reduced average response latency by 25% across key production endpoints by profiling SQL queries and API execution paths and eliminating identified bottlenecks.',
      'Designed and delivered backend services and internal REST APIs for real-time operational workflows, shipping across consecutive Agile sprints with peer code review at every stage.',
      'Translated ambiguous business requirements into concrete backend technical designs, partnering directly with cross-functional stakeholders through sprint planning and standups.',
    ],
  },
  {
    date: 'May 2026',
    title: 'M.S. Computer Science',
    place: 'University of Central Missouri',
    tags: ['Distributed Computing', 'Machine Learning', 'System Design'],
    bullets: [
      'Coursework: Algorithms and Data Structures, Distributed Computing Systems, Machine Learning, Computer Architecture, Software Engineering, Network Security.',
    ],
  },
];

export const CERTS = [
  { name: 'Building with the Claude API', issuer: 'Anthropic', date: 'Apr 2026', link: 'https://verify.skilljar.com/c/k997obwezamm' },
  { name: 'Claude Code in Action', issuer: 'Anthropic', date: 'Apr 2026', link: 'https://verify.skilljar.com/c/kpere2qc4net' },
  { name: 'AWS Cloud Architecting', issuer: 'AWS Academy', date: 'Apr 2026', link: 'https://www.credly.com/badges/60e3c565-1c17-4a49-a70e-630da5cacac1' },
  { name: 'AWS Cloud Security Foundations', issuer: 'AWS Academy', date: 'Apr 2026', link: 'https://www.credly.com/badges/41edff27-62fc-481c-9fea-998259e90231' },
];

// All resume-sourced — no invented figures.
export const STATS = [
  { v: '7', l: 'Projects Shipped' },
  { v: '200+', l: 'LeetCode Solved' },
  { v: '25%', l: 'Latency Cut in Prod' },
  { v: '4', l: 'Certifications' },
];
