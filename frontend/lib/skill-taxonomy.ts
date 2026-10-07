/**
 * Comprehensive Academic & Career Skill Taxonomy
 * 
 * Covers 20 broad academic, scientific, mathematical, research, engineering,
 * communication, leadership, business, design, and domain categories.
 */

import type { Skill, SkillCategory } from '@/lib/types'

export interface TaxonomyCategory {
  id: string
  name: SkillCategory
  iconName: string
  description: string
}

export const SKILL_CATEGORIES: TaxonomyCategory[] = [
  { id: 'all', name: 'Other', iconName: 'Layers', description: 'All available skills' },
  { id: 'programming', name: 'Programming & Software', iconName: 'Code', description: 'Languages, frameworks, developer tools and system engineering' },
  { id: 'ai-ml', name: 'AI & Machine Learning', iconName: 'Brain', description: 'Machine learning, deep learning, NLP, computer vision and GenAI' },
  { id: 'data', name: 'Data & Analytics', iconName: 'BarChart2', description: 'Data analysis, statistics, visualization and database query tools' },
  { id: 'math', name: 'Mathematics', iconName: 'Sigma', description: 'Calculus, linear algebra, discrete math and optimization' },
  { id: 'physics', name: 'Physics', iconName: 'Atom', description: 'Quantum mechanics, electromagnetism, mechanics and optics' },
  { id: 'chemistry', name: 'Chemistry', iconName: 'FlaskConical', description: 'Organic, physical, analytical and laboratory methods' },
  { id: 'biology', name: 'Biology & Life Sciences', iconName: 'Dna', description: 'Molecular biology, genetics, biochemistry and bioinformatics' },
  { id: 'research', name: 'Research & Scientific Skills', iconName: 'Microscope', description: 'Methodology, literature review, experimental design and citation' },
  { id: 'electronics', name: 'Electronics & Hardware', iconName: 'Cpu', description: 'Embedded systems, microcontrollers, Arduino, PCB and sensors' },
  { id: 'engineering', name: 'Engineering', iconName: 'Wrench', description: 'System design, signals, robotics, thermodynamics and CAD' },
  { id: 'communication', name: 'Communication', iconName: 'MessageSquare', description: 'Public speaking, presentations, technical communication and debate' },
  { id: 'leadership', name: 'Leadership & Management', iconName: 'Users', description: 'Team management, decision making, mentorship and collaboration' },
  { id: 'business', name: 'Business & Entrepreneurship', iconName: 'Briefcase', description: 'Strategy, market research, product management and marketing' },
  { id: 'design', name: 'Design & Creativity', iconName: 'Palette', description: 'UI/UX design, Figma, 3D modeling, CAD and visual communication' },
  { id: 'finance', name: 'Finance & Economics', iconName: 'TrendingUp', description: 'Financial analysis, valuation, econometrics and accounting' },
  { id: 'writing', name: 'Writing & Documentation', iconName: 'FileText', description: 'Technical writing, scientific publishing, documentation and grant writing' },
  { id: 'project-mgmt', name: 'Project Management', iconName: 'CheckSquare', description: 'Agile, Scrum, sprint planning, risk management and Jira' },
  { id: 'productivity', name: 'Productivity', iconName: 'Clock', description: 'Workflow automation, time management and knowledge systems' },
  { id: 'domain', name: 'Domain Knowledge', iconName: 'Globe', description: 'Healthcare, fintech, space tech, climate, and cybersecurity domains' },
  { id: 'other', name: 'Other', iconName: 'Sparkles', description: 'Custom and interdisciplinary user skills' },
]

export type CanonicalSkill = Omit<
  Skill,
  'currentLevel' | 'requiredLevel' | 'status' | 'priority' | 'prerequisites' | 'dependents' | 'estimatedWeeks' | 'whyItMatters'
>

export const CANONICAL_SKILL_DEFINITIONS: CanonicalSkill[] = [
  // ── 1. Programming & Software ─────────────────────────────────────────────
  { id: 'python', name: 'Python', category: 'Programming & Software', description: 'General-purpose programming language widely used in AI/ML, data science, and scripting.' },
  { id: 'c', name: 'C', category: 'Programming & Software', description: 'Low-level procedural programming for systems, OS, and embedded software.' },
  { id: 'cpp', name: 'C++', category: 'Programming & Software', description: 'High-performance compiled language for competitive programming, games, and systems.' },
  { id: 'java', name: 'Java', category: 'Programming & Software', description: 'Object-oriented programming language widely used in enterprise backends and Android.' },
  { id: 'javascript', name: 'JavaScript', category: 'Programming & Software', description: 'Dynamic scripting language powering modern web applications and Node.js.' },
  { id: 'typescript', name: 'TypeScript', category: 'Programming & Software', description: 'Strict syntactical superset of JavaScript adding compile-time static types.' },
  { id: 'html-css', name: 'HTML / CSS', category: 'Programming & Software', description: 'Foundational markup and styling languages for building responsive web interfaces.' },
  { id: 'sql', name: 'SQL', category: 'Programming & Software', description: 'Standard language for storing, querying, and managing relational databases.' },
  { id: 'git', name: 'Git', category: 'Programming & Software', description: 'Distributed version control system for tracking code changes and team collaboration.' },
  { id: 'linux', name: 'Linux', category: 'Programming & Software', description: 'Unix-like operating system command line, shell scripting, and server administration.' },
  { id: 'apis', name: 'APIs & Web Services', category: 'Programming & Software', description: 'Designing, building, and consuming RESTful and GraphQL endpoints.' },
  { id: 'full-stack-dev', name: 'Full-Stack Development', category: 'Programming & Software', description: 'Architecting end-to-end client-server web applications.' },
  { id: 'rust', name: 'Rust', category: 'Programming & Software', description: 'Memory-safe systems programming language without garbage collection.' },
  { id: 'go', name: 'Go', category: 'Programming & Software', description: 'Concurrent, lightweight compiled language built for cloud backend microservices.' },

  // ── 2. AI & Machine Learning ──────────────────────────────────────────────
  { id: 'machine-learning', name: 'Machine Learning', category: 'AI & Machine Learning', description: 'Supervised, unsupervised, and reinforcement algorithms for predictive modeling.' },
  { id: 'deep-learning', name: 'Deep Learning', category: 'AI & Machine Learning', description: 'Neural network architectures including CNNs, RNNs, and transformer models.' },
  { id: 'computer-vision', name: 'Computer Vision', category: 'AI & Machine Learning', description: 'Visual feature extraction, object detection, segmentation, and image processing.' },
  { id: 'nlp', name: 'Natural Language Processing', category: 'AI & Machine Learning', description: 'Computational linguistics, text vectorization, tokenization, and language models.' },
  { id: 'generative-ai', name: 'Generative AI', category: 'AI & Machine Learning', description: 'Diffusion models, GANs, and autoregressive architectures for content generation.' },
  { id: 'reinforcement-learning', name: 'Reinforcement Learning', category: 'AI & Machine Learning', description: 'Markov decision processes, Q-learning, policy gradients, and reward optimization.' },
  { id: 'model-evaluation', name: 'Model Evaluation', category: 'AI & Machine Learning', description: 'Validation strategies, ROC/AUC, confusion matrices, and bias/fairness auditing.' },
  { id: 'prompt-engineering', name: 'Prompt Engineering', category: 'AI & Machine Learning', description: 'System prompting, few-shot conditioning, and chain-of-thought orchestration.' },

  // ── 3. Data & Analytics ───────────────────────────────────────────────────
  { id: 'data-analysis', name: 'Data Analysis', category: 'Data & Analytics', description: 'Exploratory data analysis, hypothesis testing, and discovering actionable insights.' },
  { id: 'statistics', name: 'Statistics', category: 'Data & Analytics', description: 'Descriptive and inferential statistical modeling, confidence intervals, and distributions.' },
  { id: 'data-visualization', name: 'Data Visualization', category: 'Data & Analytics', description: 'Presenting data visually using Matplotlib, Seaborn, Tableau, and D3.' },
  { id: 'probability', name: 'Probability', category: 'Data & Analytics', description: 'Combinatorics, random variables, Bayes theorem, and stochastic processes.' },
  { id: 'excel', name: 'Excel & Spreadsheets', category: 'Data & Analytics', description: 'Formulas, pivot tables, VLOOKUP/XLOOKUP, and business financial modeling.' },
  { id: 'data-cleaning', name: 'Data Cleaning & Preprocessing', category: 'Data & Analytics', description: 'Handling missing values, outlier detection, normalization, and feature scaling.' },

  // ── 4. Mathematics ────────────────────────────────────────────────────────
  { id: 'calculus', name: 'Calculus', category: 'Mathematics', description: 'Single and multivariable differentiation, integration, and gradient vectors.' },
  { id: 'linear-algebra', name: 'Linear Algebra', category: 'Mathematics', description: 'Vectors, matrix operations, eigenvalues, eigenvectors, and vector spaces.' },
  { id: 'differential-equations', name: 'Differential Equations', category: 'Mathematics', description: 'ODEs, PDEs, boundary value problems, and dynamic physical system modeling.' },
  { id: 'discrete-mathematics', name: 'Discrete Mathematics', category: 'Mathematics', description: 'Logic, set theory, combinatorics, graph theory, and proof techniques.' },
  { id: 'numerical-methods', name: 'Numerical Methods', category: 'Mathematics', description: 'Numerical integration, root-finding algorithms, and finite difference schemes.' },
  { id: 'optimization', name: 'Optimization', category: 'Mathematics', description: 'Convex optimization, gradient descent, Lagrange multipliers, and linear programming.' },

  // ── 5. Physics ────────────────────────────────────────────────────────────
  { id: 'classical-mechanics', name: 'Classical Mechanics', category: 'Physics', description: 'Newtonian dynamics, Lagrangian and Hamiltonian mechanics, and rotational motion.' },
  { id: 'quantum-mechanics', name: 'Quantum Mechanics', category: 'Physics', description: 'Wave functions, Schrödinger equation, quantum states, superposition, and entanglement.' },
  { id: 'electromagnetism', name: 'Electromagnetism', category: 'Physics', description: 'Maxwell equations, electrostatics, magnetostatics, and electromagnetic wave propagation.' },
  { id: 'thermodynamics', name: 'Thermodynamics', category: 'Physics', description: 'Laws of thermodynamics, heat engines, entropy, and statistical mechanics.' },
  { id: 'optics', name: 'Optics', category: 'Physics', description: 'Wave optics, geometric optics, laser physics, and photonic devices.' },
  { id: 'solid-state-physics', name: 'Solid State Physics', category: 'Physics', description: 'Crystal structures, electronic band theory, semiconductors, and superconductivity.' },
  { id: 'experimental-physics', name: 'Experimental Physics', category: 'Physics', description: 'Laboratory measurement, error analysis, sensor instrumentation, and physical testing.' },
  { id: 'quantum-computing', name: 'Quantum Computing', category: 'Physics', description: 'Qubits, quantum gates, quantum circuits, Qiskit, and quantum algorithms.' },

  // ── 6. Chemistry ──────────────────────────────────────────────────────────
  { id: 'organic-chemistry', name: 'Organic Chemistry', category: 'Chemistry', description: 'Structure, properties, reactions, and synthesis of organic compounds.' },
  { id: 'inorganic-chemistry', name: 'Inorganic Chemistry', category: 'Chemistry', description: 'Coordination chemistry, organometallics, and transition metal behaviors.' },
  { id: 'physical-chemistry', name: 'Physical Chemistry', category: 'Chemistry', description: 'Chemical kinetics, quantum chemistry, molecular thermodynamics, and spectroscopy.' },
  { id: 'analytical-chemistry', name: 'Analytical Chemistry', category: 'Chemistry', description: 'Separation science, chromatography, mass spectrometry, and titration.' },
  { id: 'laboratory-techniques', name: 'Laboratory Techniques', category: 'Chemistry', description: 'Chemical handling safety, bench titrations, spectroscopy, and reagent preparation.' },

  // ── 7. Biology & Life Sciences ────────────────────────────────────────────
  { id: 'cell-biology', name: 'Cell Biology', category: 'Biology & Life Sciences', description: 'Cell structure, organelle functions, membrane transport, and cellular signaling.' },
  { id: 'molecular-biology', name: 'Molecular Biology', category: 'Biology & Life Sciences', description: 'DNA replication, transcription, translation, and recombinant gene cloning.' },
  { id: 'genetics', name: 'Genetics', category: 'Biology & Life Sciences', description: 'Mendelian inheritance, population genetics, CRISPR, and genomic sequencing.' },
  { id: 'biochemistry', name: 'Biochemistry', category: 'Biology & Life Sciences', description: 'Enzymology, metabolic pathways, protein folding, and biomolecular kinetics.' },
  { id: 'bioinformatics', name: 'Bioinformatics', category: 'Biology & Life Sciences', description: 'Computational sequence alignment (BLAST), phylogenetics, and genome analysis.' },
  { id: 'microbiology', name: 'Microbiology', category: 'Biology & Life Sciences', description: 'Bacterial physiology, viral genetics, immunology, and culture techniques.' },

  // ── 8. Research & Scientific Skills ───────────────────────────────────────
  { id: 'literature-review', name: 'Literature Review', category: 'Research & Scientific Skills', description: 'Systematic searching, synthesizing prior literature, and mapping research gaps.' },
  { id: 'scientific-writing', name: 'Scientific Writing', category: 'Research & Scientific Skills', description: 'Drafting peer-reviewed manuscripts, abstracts, introductions, and conclusions.' },
  { id: 'research-methodology', name: 'Research Methodology', category: 'Research & Scientific Skills', description: 'Formulating hypotheses, selecting quantitative/qualitative designs, and methodology defense.' },
  { id: 'experimental-design', name: 'Experimental Design', category: 'Research & Scientific Skills', description: 'Control groups, randomization, factorial designs, and eliminating confounding variables.' },
  { id: 'data-interpretation', name: 'Data Interpretation', category: 'Research & Scientific Skills', description: 'Drawing valid scientific inferences and avoiding p-hacking or confirmation bias.' },
  { id: 'statistical-analysis', name: 'Statistical Analysis', category: 'Research & Scientific Skills', description: 'ANOVA, regression modeling, non-parametric tests, and statistical software tools.' },
  { id: 'scientific-computing', name: 'Scientific Computing', category: 'Research & Scientific Skills', description: 'Numerical simulations using SciPy, NumPy, MATLAB, and high-performance clusters.' },
  { id: 'citation-management', name: 'Citation Management', category: 'Research & Scientific Skills', description: 'Zotero, Mendeley, BibTeX, and managing references across IEEE, APA, and Nature styles.' },
  { id: 'research-presentation', name: 'Research Presentation', category: 'Research & Scientific Skills', description: 'Delivering conference slide talks, poster sessions, and answering defense inquiries.' },
  { id: 'critical-analysis', name: 'Critical Analysis', category: 'Research & Scientific Skills', description: 'Critiquing experimental rigor, peer-review evaluating papers, and identifying methodological flaws.' },

  // ── 9. Electronics & Hardware ─────────────────────────────────────────────
  { id: 'arduino', name: 'Arduino', category: 'Electronics & Hardware', description: 'Prototyping microcontroller circuits, analog/digital I/O, and actuator control.' },
  { id: 'raspberry-pi', name: 'Raspberry Pi', category: 'Electronics & Hardware', description: 'Single-board computer programming, Linux headless operation, and GPIO scripting.' },
  { id: 'embedded-systems', name: 'Embedded Systems', category: 'Electronics & Hardware', description: 'Firmware development in C, real-time operating systems (RTOS), and hardware timers.' },
  { id: 'digital-electronics', name: 'Digital Electronics', category: 'Electronics & Hardware', description: 'Logic gates, Boolean algebra, flip-flops, multiplexers, and state machine design.' },
  { id: 'analog-electronics', name: 'Analog Electronics', category: 'Electronics & Hardware', description: 'Op-amps, filters, amplifiers, transistor circuits, and frequency response.' },
  { id: 'microcontrollers', name: 'Microcontrollers', category: 'Electronics & Hardware', description: 'ARM Cortex, ESP32, PIC architecture, interrupts, and serial protocols (I2C, SPI, UART).' },
  { id: 'sensors', name: 'Sensors & Instrumentation', category: 'Electronics & Hardware', description: 'Signal conditioning, sensor calibration, IMUs, ultrasonic, and environmental transducers.' },
  { id: 'pcb-design', name: 'PCB Design', category: 'Electronics & Hardware', description: 'Schematic capture, component footprint placement, routing, and KiCad/EasyEDA.' },

  // ── 10. Engineering ───────────────────────────────────────────────────────
  { id: 'system-design', name: 'System Design', category: 'Engineering', description: 'Designing reliable, scalable, and modular software and hardware architectures.' },
  { id: 'cad', name: 'CAD & 3D Modeling', category: 'Engineering', description: 'Computer-aided design using SolidWorks, Fusion 360, and parametric geometry.' },
  { id: 'signal-processing', name: 'Signal Processing', category: 'Engineering', description: 'Fourier transforms, digital filters, sampling theorem, and frequency domain analysis.' },
  { id: 'control-systems', name: 'Control Systems', category: 'Engineering', description: 'Feedback loops, PID controllers, Bode plots, transfer functions, and stability analysis.' },
  { id: 'robotics', name: 'Robotics', category: 'Engineering', description: 'Kinematics, inverse kinematics, ROS (Robot Operating System), and trajectory planning.' },

  // ── 11. Communication ─────────────────────────────────────────────────────
  { id: 'technical-communication', name: 'Technical Communication', category: 'Communication', description: 'Explaining complex technical concepts clearly to non-technical stakeholders and engineers.' },
  { id: 'public-speaking', name: 'Public Speaking', category: 'Communication', description: 'Engaging audiences, pacing, vocal projection, and confidence during live addresses.' },
  { id: 'presentation', name: 'Presentation & Pitching', category: 'Communication', description: 'Designing high-impact slide decks, storytelling, and pitching concepts to panels.' },
  { id: 'debate', name: 'Debate & Persuasion', category: 'Communication', description: 'Constructing logical arguments, rebuttals, critical listening, and respectful discourse.' },
  { id: 'academic-writing', name: 'Academic Writing', category: 'Communication', description: 'Formal thesis writing, academic tone, coherent structure, and scholarly synthesis.' },
  { id: 'team-communication', name: 'Team Communication', category: 'Communication', description: 'Transparent stand-ups, active listening, async collaboration, and constructive feedback.' },

  // ── 12. Leadership & Management ───────────────────────────────────────────
  { id: 'leadership', name: 'Leadership', category: 'Leadership & Management', description: 'Inspiring teams, setting strategic direction, and aligning members toward common goals.' },
  { id: 'team-management', name: 'Team Management', category: 'Leadership & Management', description: 'Task delegation, 1-on-1 check-ins, performance support, and team morale.' },
  { id: 'mentoring', name: 'Mentoring', category: 'Leadership & Management', description: 'Guiding junior engineers, active listening, career coaching, and skill transference.' },
  { id: 'conflict-resolution', name: 'Conflict Resolution', category: 'Leadership & Management', description: 'De-escalating friction, mediating differing viewpoints, and finding common ground.' },
  { id: 'decision-making', name: 'Decision Making', category: 'Leadership & Management', description: 'Evaluating tradeoffs, deciding under uncertainty, and managing decision risk.' },
  { id: 'collaboration', name: 'Collaboration & Cross-Functional Work', category: 'Leadership & Management', description: 'Working effectively across design, product, engineering, and research functions.' },

  // ── 13. Business & Entrepreneurship ───────────────────────────────────────
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Business & Entrepreneurship', description: 'Identifying market opportunities, lean validation, MVP launches, and venture building.' },
  { id: 'business-strategy', name: 'Business Strategy', category: 'Business & Entrepreneurship', description: 'Competitive analysis, value proposition design, unit economics, and growth models.' },
  { id: 'market-research', name: 'Market Research', category: 'Business & Entrepreneurship', description: 'Customer interviews, competitor benchmarking, survey design, and TAM estimation.' },
  { id: 'product-management', name: 'Product Management', category: 'Business & Entrepreneurship', description: 'User stories, product roadmapping, prioritization matrix, and metric tracking.' },
  { id: 'financial-literacy', name: 'Financial Literacy', category: 'Business & Entrepreneurship', description: 'Understanding P&L, burn rate, cash flow, revenue models, and budget forecasting.' },
  { id: 'marketing', name: 'Marketing & Growth', category: 'Business & Entrepreneurship', description: 'Content marketing, distribution channels, conversion funnels, and branding.' },

  // ── 14. Design & Creativity ───────────────────────────────────────────────
  { id: 'ui-design', name: 'UI Design', category: 'Design & Creativity', description: 'Visual hierarchy, typography, color palettes, micro-interactions, and component systems.' },
  { id: 'ux-design', name: 'UX Design', category: 'Design & Creativity', description: 'User research, wireframing, usability testing, persona mapping, and empathy interviews.' },
  { id: 'graphic-design', name: 'Graphic Design', category: 'Design & Creativity', description: 'Brand identity, vector graphics, layout design, and visual asset generation.' },
  { id: 'figma', name: 'Figma', category: 'Design & Creativity', description: 'Auto-layout, design tokens, interactive prototyping, and shared team design libraries.' },
  { id: 'design-thinking', name: 'Design Thinking', category: 'Design & Creativity', description: 'Empathize, Define, Ideate, Prototype, and Test innovation framework.' },

  // ── 15. Finance & Economics ───────────────────────────────────────────────
  { id: 'financial-analysis', name: 'Financial Analysis', category: 'Finance & Economics', description: 'Ratio analysis, corporate finance modeling, DCF valuation, and risk assessment.' },
  { id: 'econometrics', name: 'Econometrics', category: 'Finance & Economics', description: 'Statistical regression analysis applied to economic data and forecasting.' },
  { id: 'accounting', name: 'Accounting Fundamentals', category: 'Finance & Economics', description: 'Balance sheets, income statements, ledger accounting, and double-entry book balancing.' },

  // ── 16. Writing & Documentation ───────────────────────────────────────────
  { id: 'technical-writing', name: 'Technical Writing', category: 'Writing & Documentation', description: 'Creating comprehensive developer docs, user manuals, and technical specification guides.' },
  { id: 'api-documentation', name: 'API Documentation', category: 'Writing & Documentation', description: 'Documenting endpoints, payload schemas, query parameters, and OpenAPI / Swagger specs.' },
  { id: 'grant-writing', name: 'Grant & Proposal Writing', category: 'Writing & Documentation', description: 'Drafting competitive research grant proposals, budgets, and project statements.' },
  { id: 'scientific-publishing', name: 'Scientific Publishing', category: 'Writing & Documentation', description: 'Navigating peer-review submission, LaTeX typesetting, and author response letters.' },

  // ── 17. Project Management ────────────────────────────────────────────────
  { id: 'agile', name: 'Agile Methodology', category: 'Project Management', description: 'Iterative delivery, sprint retrospectives, backlog grooming, and continuous adaptation.' },
  { id: 'scrum', name: 'Scrum Framework', category: 'Project Management', description: 'Scrum rituals, daily standups, sprint planning, and managing burndown charts.' },
  { id: 'project-planning', name: 'Project Planning & Roadmapping', category: 'Project Management', description: 'Gantt charts, critical path method, dependency mapping, and milestone delivery.' },
  { id: 'risk-management', name: 'Risk Management', category: 'Project Management', description: 'Identifying technical and schedule risks, mitigation planning, and contingency models.' },
  { id: 'documentation-mgmt', name: 'Documentation Management', category: 'Project Management', description: 'Maintaining team wikis, knowledge bases, Notion, Confluence, and change logs.' },

  // ── 18. Productivity ──────────────────────────────────────────────────────
  { id: 'time-management', name: 'Time Management', category: 'Productivity', description: 'Pomodoro, time-blocking, task triage using Eisenhower matrix, and priority focus.' },
  { id: 'workflow-automation', name: 'Workflow Automation', category: 'Productivity', description: 'Automating repetitive tasks using Zapier, Make, bash scripts, and GitHub Actions.' },
  { id: 'deep-work', name: 'Deep Work & Focus', category: 'Productivity', description: 'Sustained cognitive focus, minimizing context switching, and structured working sessions.' },

  // ── 19. Domain Knowledge ──────────────────────────────────────────────────
  { id: 'healthcare-tech', name: 'Healthcare & Biotech Tech', category: 'Domain Knowledge', description: 'EHR systems, medical device standards, HIPAA, and clinical data pipelines.' },
  { id: 'fintech', name: 'Fintech & Payment Systems', category: 'Domain Knowledge', description: 'Payment gateways, ledger consensus, fraud detection, and financial regulatory tech.' },
  { id: 'cybersecurity', name: 'Cybersecurity & Infosec', category: 'Domain Knowledge', description: 'Threat modeling, network penetration testing, cryptography, and zero-trust security.' },
  { id: 'space-tech', name: 'Space Technology', category: 'Domain Knowledge', description: 'Orbital mechanics, satellite telecommunications, telemetry, and payload engineering.' },
]

/**
 * Normalizes user skill input into a canonical ID
 * e.g., "Python", "python", "Python Programming" -> "python"
 * e.g., "Quantum Mechanics" -> "quantum-mechanics"
 */
export function normalizeSkillId(rawName: string): string {
  const cleaned = rawName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')

  // Known alias normalization dictionary
  const aliasMap: Record<string, string> = {
    'python-programming': 'python',
    'python3': 'python',
    'c-programming': 'c',
    'cpp-programming': 'cpp',
    'cplusplus': 'cpp',
    'c-plus-plus': 'cpp',
    'javascript-es6': 'javascript',
    'js': 'javascript',
    'ts': 'typescript',
    'html': 'html-css',
    'css': 'html-css',
    'html5': 'html-css',
    'htmlcss': 'html-css',
    'sql-database': 'sql',
    'structured-query-language': 'sql',
    'ml': 'machine-learning',
    'dl': 'deep-learning',
    'ai': 'generative-ai',
    'artificial-intelligence': 'machine-learning',
    'cv': 'computer-vision',
    'natural-language-processing': 'nlp',
    'data-structures-and-algorithms': 'data-structures',
    'dsa': 'data-structures',
    'linear-algebra-vectors': 'linear-algebra',
    'quantum': 'quantum-mechanics',
    'public-speaking-skills': 'public-speaking',
    'presentation-skills': 'presentation',
    'research-methodology-design': 'research-methodology',
    'technical-writing-documentation': 'technical-writing',
  }

  return aliasMap[cleaned] || cleaned
}

/**
 * Resolves a Skill object by ID or creates a custom skill representation
 */
export function resolveSkillById(idOrName: string): Skill {
  const normId = normalizeSkillId(idOrName)
  const canonical = CANONICAL_SKILL_DEFINITIONS.find((s) => s.id === normId)

  if (canonical) {
    return {
      ...canonical,
      currentLevel: 'Intermediate',
      requiredLevel: 'Intermediate',
      status: 'completed',
      priority: 'recommended',
      prerequisites: [],
      dependents: [],
      estimatedWeeks: 2,
      whyItMatters: `Essential skill for university academics and professional career growth.`,
      isCustom: false,
    }
  }

  // Fallback for custom or unrecognized skills
  const displayName = idOrName
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    id: normId,
    name: displayName,
    category: 'Other',
    description: `Custom verified skill: ${displayName}`,
    currentLevel: 'Intermediate',
    requiredLevel: 'Beginner',
    status: 'completed',
    priority: 'recommended',
    prerequisites: [],
    dependents: [],
    estimatedWeeks: 1,
    whyItMatters: `Tailored skill added by student to reflect personal academic profile.`,
    isCustom: true,
  }
}

/**
 * Search skills across all 20 categories
 */
export function searchSkillTaxonomy(query: string, categoryFilter?: string): Skill[] {
  const q = query.toLowerCase().trim()

  return CANONICAL_SKILL_DEFINITIONS
    .filter((def) => {
      const matchCat =
        !categoryFilter ||
        categoryFilter.toLowerCase() === 'all' ||
        def.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        (categoryFilter === 'programming' && def.category.includes('Programming')) ||
        (categoryFilter === 'ai-ml' && def.category.includes('AI')) ||
        (categoryFilter === 'data' && def.category.includes('Data')) ||
        (categoryFilter === 'math' && def.category.includes('Mathematics')) ||
        (categoryFilter === 'physics' && def.category.includes('Physics')) ||
        (categoryFilter === 'research' && def.category.includes('Research')) ||
        (categoryFilter === 'communication' && def.category.includes('Communication')) ||
        (categoryFilter === 'business' && def.category.includes('Business')) ||
        (categoryFilter === 'design' && def.category.includes('Design'))

      if (!matchCat) return false
      if (!q) return true

      return (
        def.name.toLowerCase().includes(q) ||
        def.category.toLowerCase().includes(q) ||
        def.description.toLowerCase().includes(q) ||
        def.id.includes(q)
      )
    })
    .map((def) => resolveSkillById(def.id))
}
