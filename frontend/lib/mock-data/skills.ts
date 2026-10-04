import type { Skill } from '@/lib/types'

export const mockSkills: Skill[] = [
  // ── Already completed ──────────────────────────────────────────────
  {
    id: 'python',
    name: 'Python',
    category: 'Programming',
    description: 'General-purpose programming language widely used in data science, systems, and ML.',
    currentLevel: 'Intermediate',
    requiredLevel: 'Intermediate',
    status: 'completed',
    priority: 'critical',
    prerequisites: [],
    dependents: ['data-structures', 'data-analysis', 'machine-learning'],
    estimatedWeeks: 0,
    whyItMatters: 'Python is the primary lingua franca for ML/AI and rapid prototyping. Prerequisite for 6 downstream skills.',
    resources: [
      { title: 'Python for Data Analysis (3rd Edition)', type: 'Book', provider: "Wes McKinney (O'Reilly)" },
      { title: 'Official Python Documentation & Tutorial', type: 'Official Guide', provider: 'python.org' },
    ],
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'Programming',
    description: 'High-performance compiled language, standard for algorithms and competitive coding.',
    currentLevel: 'Intermediate',
    requiredLevel: 'Beginner',
    status: 'completed',
    priority: 'recommended',
    prerequisites: [],
    dependents: ['data-structures'],
    estimatedWeeks: 0,
    whyItMatters: 'Provides deep intuition about memory management, pointers, and cache efficiency.',
    resources: [
      { title: 'LearnCpp.com Free Comprehensive Guide', type: 'Course', provider: 'LearnCpp' },
    ],
  },
  {
    id: 'html-css',
    name: 'HTML / CSS',
    category: 'Programming',
    description: 'Foundational web technologies for building interactive browser interfaces.',
    currentLevel: 'Intermediate',
    requiredLevel: 'Beginner',
    status: 'completed',
    priority: 'recommended',
    prerequisites: [],
    dependents: [],
    estimatedWeeks: 0,
    whyItMatters: 'Useful for building frontend dashboards and presenting data projects to stakeholders.',
    resources: [
      { title: 'MDN Web Docs (HTML/CSS Guide)', type: 'Official Guide', provider: 'Mozilla' },
    ],
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Tools',
    description: 'Distributed version control system for tracking code changes and team collaboration.',
    currentLevel: 'Beginner',
    requiredLevel: 'Beginner',
    status: 'completed',
    priority: 'recommended',
    prerequisites: [],
    dependents: ['mlops'],
    estimatedWeeks: 0,
    whyItMatters: 'Crucial for managing repositories, continuous integration, and open-source contributions.',
    resources: [
      { title: 'Pro Git Book (Free Online)', type: 'Book', provider: 'Scott Chacon & Ben Straub' },
    ],
  },

  // ── Skill Gaps ──────────────────────────────────────────────────────
  {
    id: 'data-structures',
    name: 'Data Structures',
    category: 'Foundations',
    description: 'Fundamental structures (Trees, Graphs, Hashmaps, Heaps) for organizing and accessing data efficiently.',
    currentLevel: 'Beginner',
    requiredLevel: 'Intermediate',
    status: 'next',
    priority: 'critical',
    prerequisites: ['python'],
    dependents: ['machine-learning', 'sql'],
    estimatedWeeks: 3,
    whyItMatters: 'Data structures underpin algorithm efficiency and are required in technical interviews, GATE CS, and ML architectures.',
    resources: [
      { title: 'NeetCode 150 Core DSA Patterns', type: 'Practice', provider: 'NeetCode.io' },
      { title: 'Algorithms, Part I & II (Sedgewick)', type: 'Course', provider: 'Princeton / Coursera' },
      { title: 'Introduction to Algorithms (CLRS)', type: 'Book', provider: 'MIT Press' },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    category: 'Mathematics',
    description: 'Probability distributions, Bayes theorem, hypothesis testing, and statistical inference.',
    currentLevel: 'None',
    requiredLevel: 'Intermediate',
    status: 'locked',
    priority: 'critical',
    prerequisites: ['linear-algebra'],
    dependents: ['machine-learning', 'data-analysis'],
    estimatedWeeks: 4,
    whyItMatters: 'Statistics is the mathematical engine of ML. Necessary for loss functions, p-values, and model validation.',
    resources: [
      { title: 'StatQuest with Josh Starmer (ML & Stats)', type: 'Course', provider: 'YouTube / StatQuest' },
      { title: 'Introduction to Probability (Blitzstein & Hwang)', type: 'Book', provider: 'Harvard University' },
      { title: 'Khan Academy College Statistics', type: 'Practice', provider: 'Khan Academy' },
    ],
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    category: 'Mathematics',
    description: 'Vectors, matrix multiplications, eigenvalues, eigenvectors, and geometric transformations.',
    currentLevel: 'None',
    requiredLevel: 'Intermediate',
    status: 'locked',
    priority: 'critical',
    prerequisites: [],
    dependents: ['statistics', 'machine-learning', 'deep-learning'],
    estimatedWeeks: 4,
    whyItMatters: 'Neural networks, embeddings, PCA dimensionality reduction, and quantum computing rely entirely on linear algebra.',
    resources: [
      { title: 'Essence of Linear Algebra (3Blue1Brown)', type: 'Course', provider: '3Blue1Brown' },
      { title: 'MIT 18.06 Linear Algebra (Gilbert Strang)', type: 'Course', provider: 'MIT OpenCourseWare' },
      { title: 'Linear Algebra Done Right (Axler)', type: 'Book', provider: 'Springer' },
    ],
  },
  {
    id: 'sql',
    name: 'SQL & Relational DBs',
    category: 'Databases',
    description: 'Structured Query Language for querying, indexing, and aggregating data from relational databases.',
    currentLevel: 'None',
    requiredLevel: 'Intermediate',
    status: 'locked',
    priority: 'high',
    prerequisites: ['data-structures'],
    dependents: ['data-analysis'],
    estimatedWeeks: 2,
    whyItMatters: 'Over 90% of real-world corporate data sits in relational warehouses. Essential for data ingestion in industry and CAT/MBA data analytics.',
    resources: [
      { title: 'Mode Analytics SQL Tutorial', type: 'Practice', provider: 'Mode.com' },
      { title: 'LeetCode 50 SQL Study Plan', type: 'Practice', provider: 'LeetCode' },
    ],
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis & EDA',
    category: 'Data Science',
    description: 'Exploratory data analysis, cleaning, feature engineering, and visualization with pandas and seaborn.',
    currentLevel: 'None',
    requiredLevel: 'Intermediate',
    status: 'locked',
    priority: 'high',
    prerequisites: ['python', 'sql', 'statistics'],
    dependents: ['machine-learning'],
    estimatedWeeks: 3,
    whyItMatters: 'Raw data is noisy and imperfect. EDA is how you clean datasets before passing them to neural models.',
    resources: [
      { title: 'Kaggle Micro-courses (Pandas & Data Cleaning)', type: 'Practice', provider: 'Kaggle' },
      { title: 'Data Analysis with Python (freeCodeCamp)', type: 'Course', provider: 'freeCodeCamp' },
    ],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning Core',
    category: 'Machine Learning',
    description: 'Supervised, unsupervised, ensemble methods, decision trees, SVMs, and gradient boosting.',
    currentLevel: 'None',
    requiredLevel: 'Advanced',
    status: 'locked',
    priority: 'critical',
    prerequisites: ['python', 'data-structures', 'statistics', 'linear-algebra', 'data-analysis'],
    dependents: ['deep-learning', 'nlp', 'computer-vision'],
    estimatedWeeks: 6,
    whyItMatters: 'The central milestone of AI Engineering. Everything in classical data science and modern AI builds from this skill.',
    resources: [
      { title: 'Machine Learning Specialization by Andrew Ng', type: 'Course', provider: 'DeepLearning.AI / Coursera' },
      { title: 'Hands-On ML with Scikit-Learn & PyTorch', type: 'Book', provider: "O'Reilly Media" },
    ],
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning & Neural Nets',
    category: 'Machine Learning',
    description: 'Multi-layer perceptrons, backpropagation, CNNs, RNNs, and Attention/Transformer architectures.',
    currentLevel: 'None',
    requiredLevel: 'Intermediate',
    status: 'locked',
    priority: 'high',
    prerequisites: ['machine-learning', 'linear-algebra'],
    dependents: ['nlp', 'computer-vision'],
    estimatedWeeks: 5,
    whyItMatters: 'Deep Learning powers generative AI, computer vision, speech synthesis, and modern frontier models.',
    resources: [
      { title: 'Deep Learning Book (Goodfellow, Bengio, Courville)', type: 'Book', provider: 'MIT Press' },
      { title: 'Practical Deep Learning for Coders (Fast.ai)', type: 'Course', provider: 'Fast.ai' },
    ],
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    category: 'Machine Learning',
    description: 'Tokenization, embeddings, language modeling, fine-tuning, and Transformer architectures.',
    currentLevel: 'None',
    requiredLevel: 'Beginner',
    status: 'locked',
    priority: 'recommended',
    prerequisites: ['deep-learning'],
    dependents: [],
    estimatedWeeks: 3,
    whyItMatters: 'Powers Large Language Models (LLMs), semantic search, conversational agents, and machine translation.',
    resources: [
      { title: 'Stanford CS224N: NLP with Deep Learning', type: 'Course', provider: 'Stanford University' },
      { title: 'Hugging Face NLP Course (Free)', type: 'Practice', provider: 'HuggingFace.co' },
    ],
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    category: 'Machine Learning',
    description: 'Image processing, convolution kernels, object detection (YOLO), segmentation, and generative diffusion.',
    currentLevel: 'None',
    requiredLevel: 'Beginner',
    status: 'locked',
    priority: 'recommended',
    prerequisites: ['deep-learning'],
    dependents: [],
    estimatedWeeks: 3,
    whyItMatters: 'Applied across autonomous driving, robotics, biomedical imaging, and satellite analytics.',
    resources: [
      { title: 'Stanford CS231n: Deep Learning for Computer Vision', type: 'Course', provider: 'Stanford University' },
    ],
  },
  {
    id: 'mlops',
    name: 'MLOps & Deployment',
    category: 'Tools',
    description: 'Containerizing models with Docker, experiment tracking with MLflow, FastAPI serving, and CI/CD pipelines.',
    currentLevel: 'None',
    requiredLevel: 'Beginner',
    status: 'locked',
    priority: 'recommended',
    prerequisites: ['machine-learning', 'git'],
    dependents: [],
    estimatedWeeks: 3,
    whyItMatters: 'Bridges theoretical ML notebooks and scalable, high-availability production services.',
    resources: [
      { title: 'Made With ML (Goku Mohandas)', type: 'Course', provider: 'madewithml.com' },
      { title: 'Full Stack Deep Learning Course', type: 'Course', provider: 'FSDL' },
    ],
  },
  {
    id: 'cloud-basics',
    name: 'Cloud Computing (AWS / GCP)',
    category: 'Tools',
    description: 'Virtual machines, object storage (S3), serverless compute, and container orchestration.',
    currentLevel: 'None',
    requiredLevel: 'Beginner',
    status: 'locked',
    priority: 'recommended',
    prerequisites: ['git'],
    dependents: ['mlops'],
    estimatedWeeks: 2,
    whyItMatters: 'Industry workflows almost exclusively operate on AWS, Azure, or Google Cloud.',
    resources: [
      { title: 'AWS Cloud Practitioner Essentials', type: 'Course', provider: 'Amazon Web Services' },
    ],
  },
]

const s = (
  id: string,
  name: string,
  category: Skill['category'],
  estimatedWeeks: number,
  prerequisites: string[],
  description: string,
  whyItMatters: string,
  requiredLevel: Skill['requiredLevel'] = 'Intermediate'
): Skill => ({
  id,
  name,
  category,
  description,
  currentLevel: 'None',
  requiredLevel,
  status: 'locked',
  priority: 'recommended',
  prerequisites,
  dependents: [],
  estimatedWeeks,
  whyItMatters,
})

const extraSkills: Skill[] = [
  // Software / systems foundations
  s('algorithms', 'Algorithms', 'Foundations', 4, ['data-structures'], 'Sorting, searching, recursion, dynamic programming and complexity analysis.', 'Algorithmic thinking is tested in interviews, GATE and is the base of efficient software.'),
  s('oop', 'Object-Oriented Programming', 'Programming', 3, ['python'], 'Classes, inheritance, encapsulation and design principles.', 'Real-world codebases are organised around OOP concepts.'),
  s('os-fundamentals', 'Operating Systems', 'Foundations', 3, [], 'Processes, threads, memory management, scheduling and file systems.', 'Understanding the OS explains how every program actually runs.'),
  s('computer-networks', 'Computer Networks', 'Foundations', 3, [], 'TCP/IP, HTTP, DNS, routing and network layers.', 'Every modern application and security tool depends on networking.'),
  s('backend-apis', 'Backend & APIs', 'Programming', 4, ['oop', 'sql'], 'Building REST APIs, authentication and database-backed services.', 'APIs are how software components and products talk to each other.'),
  s('testing', 'Testing & Quality', 'Tools', 2, ['oop', 'git'], 'Unit tests, integration tests and CI basics.', 'Tested code is what teams are willing to ship.', 'Beginner'),
  s('system-design', 'System Design', 'Foundations', 4, ['backend-apis', 'computer-networks', 'algorithms'], 'Scalability, caching, load balancing and data modelling.', 'System design separates junior from mid-level engineers.'),

  // Cybersecurity
  s('cryptography', 'Cryptography', 'Mathematics', 3, ['computer-networks'], 'Symmetric and public-key encryption, hashing and TLS.', 'Cryptography protects data in transit and at rest.'),
  s('network-security', 'Network Security', 'Foundations', 3, ['computer-networks'], 'Firewalls, IDS/IPS, VPNs and secure network design.', 'Most attacks cross a network boundary.'),
  s('web-security', 'Web Security', 'Programming', 3, ['html-css', 'sql'], 'OWASP Top 10: injection, XSS, CSRF and broken authentication.', 'Web apps are the most common attack surface.'),
  s('ethical-hacking', 'Ethical Hacking', 'Tools', 4, ['network-security', 'os-fundamentals', 'web-security'], 'Reconnaissance, exploitation and penetration-testing methodology.', 'Thinking like an attacker is how defences get tested.'),
  s('incident-response', 'Incident Response', 'Tools', 3, ['network-security', 'os-fundamentals'], 'Detection, triage, forensics and reporting of security incidents.', 'Security teams are judged on how they respond when things break.', 'Beginner'),

  // GATE / M.Tech
  s('engineering-math', 'Engineering Mathematics', 'Mathematics', 5, [], 'Calculus, linear algebra, probability and numerical methods.', 'A significant portion of the GATE paper is mathematics.'),
  s('discrete-math', 'Discrete Mathematics', 'Mathematics', 4, [], 'Logic, sets, graphs, combinatorics and recurrences.', 'Foundation for algorithms and theory of computation.'),
  s('digital-logic', 'Digital Logic', 'Foundations', 3, [], 'Boolean algebra, combinational and sequential circuits.', 'Base for computer organisation questions.'),
  s('comp-org', 'Computer Organization', 'Foundations', 4, ['digital-logic'], 'CPU design, pipelining, memory hierarchy and I/O.', 'High-weightage GATE subject.'),
  s('toc', 'Theory of Computation', 'Foundations', 4, ['discrete-math'], 'Automata, regular languages, context-free grammars and decidability.', 'Core theory subject with predictable GATE patterns.'),
  s('compiler-design', 'Compiler Design', 'Foundations', 3, ['toc'], 'Lexical analysis, parsing and code generation.', 'Scoring subject once TOC is clear.', 'Beginner'),
  s('dbms', 'Database Management Systems', 'Databases', 3, [], 'ER models, normalisation, transactions and indexing.', 'Consistently tested in GATE and interviews.'),
  s('gate-aptitude', 'General Aptitude', 'Aptitude & Management', 3, [], 'Verbal and numerical reasoning for GATE.', '15% of the GATE paper - easy marks if practised.', 'Beginner'),
  s('gate-practice', 'GATE Mock Tests', 'Foundations', 4, ['algorithms', 'os-fundamentals', 'comp-org', 'toc', 'dbms', 'engineering-math'], 'Full-length timed mock tests and error analysis.', 'Mock performance is the best predictor of your final rank.'),

  // Study abroad (MS)
  s('gre-quant', 'GRE Quantitative', 'Aptitude & Management', 4, [], 'Quantitative reasoning for the GRE.', 'A strong quant score is expected for technical MS programmes.'),
  s('gre-verbal', 'GRE Verbal', 'Aptitude & Management', 4, [], 'Reading comprehension and vocabulary for the GRE.', 'Contributes to overall GRE competitiveness.', 'Beginner'),
  s('english-test', 'IELTS / TOEFL', 'Aptitude & Management', 3, [], 'English proficiency exam preparation.', 'Most universities require a minimum score.'),
  s('research-exposure', 'Projects & Research Experience', 'Academic Research', 5, [], 'Final-year project, internship or publication experience.', 'Admissions committees weigh research and project experience heavily.'),
  s('university-shortlist', 'University Shortlisting', 'General Studies', 2, ['research-exposure'], 'Researching programmes, deadlines and fit.', 'A good shortlist balances ambition with realistic chances.', 'Beginner'),
  s('sop-writing', 'Statement of Purpose', 'General Studies', 3, ['research-exposure'], 'Writing a clear and personal SOP.', 'The SOP is where you tell your story.'),
  s('application-docs', 'Recommendations & Documents', 'General Studies', 2, ['university-shortlist', 'sop-writing'], 'Letters of recommendation, transcripts and forms.', 'Complete, on-time applications avoid avoidable rejection.', 'Beginner'),
  s('funding-visa', 'Funding & Visa Planning', 'General Studies', 2, ['university-shortlist'], 'Scholarships, loans and visa process.', 'Financial planning decides whether an offer is actionable.', 'Beginner'),

  // MBA
  s('quant-aptitude', 'Quantitative Aptitude', 'Aptitude & Management', 5, [], 'Arithmetic, algebra, geometry and number systems.', 'Quant is a make-or-break section in CAT-style exams.'),
  s('logical-reasoning', 'Logical Reasoning', 'Aptitude & Management', 4, [], 'Puzzles, arrangements, sets and logical deduction.', 'Forms half of the LRDI section.'),
  s('verbal-ability', 'Verbal Ability', 'Aptitude & Management', 4, [], 'Reading comprehension, para-jumbles and grammar.', 'Verbal skill also feeds directly into interviews.'),
  s('data-interpretation', 'Data Interpretation', 'Aptitude & Management', 3, ['quant-aptitude', 'logical-reasoning'], 'Reading tables, charts and caselets quickly.', 'Needs both calculation speed and logical thinking.'),
  s('business-fundamentals', 'Business Fundamentals', 'Aptitude & Management', 3, [], 'Marketing, finance, operations and current business news.', 'Interviewers expect business awareness.', 'Beginner'),
  s('cat-mocks', 'Mock Exams', 'Aptitude & Management', 4, ['data-interpretation', 'verbal-ability'], 'Timed mocks with sectional analysis.', 'Mocks build speed, strategy and stamina.'),
  s('gd-pi', 'Group Discussion & Interview', 'Aptitude & Management', 3, ['business-fundamentals'], 'GD practice and personal interview preparation.', 'Final selection depends on GD/PI performance.', 'Beginner'),

  // Civil services
  s('polity', 'Indian Polity', 'General Studies', 5, [], 'Constitution, governance and institutions.', 'Polity is a high-scoring, high-weightage GS subject.'),
  s('indian-history', 'History', 'General Studies', 4, [], 'Ancient, medieval, modern history and culture.', 'Appears in both Prelims and Mains.'),
  s('geography', 'Geography', 'General Studies', 4, [], 'Physical, human and Indian geography.', 'Overlaps with environment and current affairs.'),
  s('economy', 'Indian Economy', 'General Studies', 4, [], 'Macroeconomics, budgeting and economic survey.', 'Linked to many current-affairs questions.'),
  s('environment', 'Environment & Ecology', 'General Studies', 3, ['geography'], 'Ecology, biodiversity and climate policy.', 'Increasingly weighted in Prelims.'),
  s('current-affairs', 'Current Affairs', 'General Studies', 3, ['polity', 'economy'], 'Daily news analysis linked to the syllabus.', 'Connects static knowledge to what is happening now.'),
  s('ethics', 'Ethics & Integrity', 'General Studies', 3, ['polity'], 'Ethics, aptitude and case studies.', 'GS Paper 4 rewards structured thinking.'),
  s('csat', 'CSAT', 'Aptitude & Management', 4, [], 'Comprehension, reasoning and basic numeracy.', 'Qualifying paper - failing it ends the attempt.', 'Beginner'),
  s('essay-writing', 'Essay Writing', 'General Studies', 3, ['current-affairs'], 'Structured essays with examples and balance.', 'A full paper in Mains.'),
  s('answer-writing', 'Answer Writing', 'General Studies', 4, ['ethics', 'essay-writing', 'indian-history'], 'Writing concise, structured Mains answers.', 'Mains is a writing exam - practice decides the score.'),
  s('prelims-mocks', 'Prelims Mock Tests', 'General Studies', 4, ['csat', 'current-affairs', 'environment', 'indian-history', 'geography'], 'Test series and revision cycles.', 'Mocks calibrate accuracy and negative marking.'),

  // Research / PhD
  s('research-methods', 'Research Methods', 'Academic Research', 4, [], 'Formulating questions, designing studies and validity.', 'The foundation of all academic work.'),
  s('literature-review', 'Literature Review', 'Academic Research', 4, ['research-methods'], 'Finding, reading and synthesising papers.', 'Shows you know where the field stands.'),
  s('academic-writing', 'Academic Writing', 'Academic Research', 3, ['research-methods'], 'Writing papers in a clear, structured style.', 'Publications are the currency of research.'),
  s('research-proposal', 'Research Proposal', 'Academic Research', 4, ['literature-review', 'academic-writing'], 'Writing a focused proposal with a feasible plan.', 'The proposal is the centre of a PhD application.'),
  s('publication-record', 'First Publication', 'Academic Research', 6, ['research-proposal', 'statistics'], 'Producing a workshop or conference paper.', 'A publication strongly signals research readiness.'),
  s('faculty-outreach', 'Supervisor Outreach', 'General Studies', 2, ['research-proposal'], 'Identifying and contacting potential supervisors.', 'Supervisor fit matters as much as the institution.', 'Beginner'),
]

export const allSkills: Skill[] = [...mockSkills, ...extraSkills]

export const destinationSkillIds: Record<string, string[]> = {
  'ai-ml-engineer': ['machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'mlops', 'cloud-basics', 'statistics', 'sql'],
  'software-engineer': ['system-design', 'testing', 'cloud-basics', 'algorithms', 'backend-apis'],
  'cybersecurity-engineer': ['ethical-hacking', 'incident-response', 'cryptography', 'python'],
  'mtech-gate': ['gate-practice', 'compiler-design', 'gate-aptitude', 'discrete-math'],
  'foreign-studies-ms': ['application-docs', 'funding-visa', 'gre-quant', 'gre-verbal', 'english-test'],
  'mba-tech-mgmt': ['cat-mocks', 'gd-pi'],
  'civil-services-ias': ['prelims-mocks', 'answer-writing', 'economy'],
  'research-phd': ['publication-record', 'faculty-outreach'],
}

export function getSkillsForDestination(
  destinationId?: string,
  currentSkillIds: string[] = []
): Skill[] {
  const targetKey = destinationId && destinationSkillIds[destinationId] ? destinationId : 'ai-ml-engineer'
  const targetIds = destinationSkillIds[targetKey]
  const visited = new Set<string>()

  function collectPrereqs(id: string) {
    if (visited.has(id)) return
    visited.add(id)
    const skill = allSkills.find((sk) => sk.id === id)
    if (!skill) return
    for (const prereq of skill.prerequisites) {
      collectPrereqs(prereq)
    }
  }

  for (const id of targetIds) {
    collectPrereqs(id)
  }

  const destinationSkills = Array.from(visited)
    .map((id) => allSkills.find((sk) => sk.id === id))
    .filter(Boolean) as Skill[]

  const dependentMap: Record<string, string[]> = {}
  destinationSkills.forEach((sk) => {
    dependentMap[sk.id] = []
  })
  destinationSkills.forEach((sk) => {
    sk.prerequisites.forEach((pId) => {
      if (dependentMap[pId]) {
        dependentMap[pId].push(sk.id)
      }
    })
  })

  return destinationSkills.map((skill, index) => {
    const isCompleted = currentSkillIds.includes(skill.id)
    const prereqsMet = skill.prerequisites.every((pid) => currentSkillIds.includes(pid))
    const status: Skill['status'] = isCompleted ? 'completed' : prereqsMet ? 'next' : 'locked'

    const dependentsCount = dependentMap[skill.id]?.length ?? 0
    let priority: Skill['priority'] = skill.priority
    if (skill.priority === 'recommended') {
      if (skill.prerequisites.length === 0 || dependentsCount >= 2) {
        priority = 'critical'
      } else if (dependentsCount === 1 || index % 2 === 0) {
        priority = 'high'
      }
    }

    return {
      ...skill,
      status,
      priority,
      dependents: dependentMap[skill.id] ?? [],
      currentLevel: isCompleted ? skill.requiredLevel : 'None',
    }
  })
}

export const getSkillById = (id: string): Skill | undefined =>
  allSkills.find((s) => s.id === id) ?? mockSkills.find((s) => s.id === id)

export const getCurrentSkills = (currentSkillIds: string[], destinationId?: string): Skill[] => {
  const destSkills = getSkillsForDestination(destinationId, currentSkillIds)
  return destSkills.filter((s) => currentSkillIds.includes(s.id))
}

export const getSkillGaps = (currentSkillIds: string[], destinationId?: string): Skill[] => {
  const destSkills = getSkillsForDestination(destinationId, currentSkillIds)
  return destSkills.filter((s) => !currentSkillIds.includes(s.id) && s.status !== 'completed')
}