import type { Opportunity, OpportunityType } from '@/lib/types'

export const baseOpportunities: Opportunity[] = [
  // ── Hackathons & Challenges ────────────────────────────────────────────────
  {
    id: 'sih-2026',
    title: 'Smart India Hackathon (SIH 2026)',
    organization: 'Ministry of Education & AICTE (Govt of India)',
    type: 'Hackathon',
    description: 'World’s biggest open innovation model. Solve 500+ pressing problem statements from 50+ government ministries, departments, and private industries across hardware and software tracks.',
    deadline: 'Rolling (Annual Sept–Nov)',
    stipendOrPrize: '₹1,00,000 per problem statement',
    location: 'Pan-India Nodal Centers',
    eligibility: 'UG / PG students across all engineering branches (teams of 6)',
    url: 'https://www.sih.gov.in',
    mode: 'Hybrid',
    destinations: ['all', 'software-engineer', 'ai-ml-engineer', 'cybersecurity-engineer'],
    tags: ['National Flagship', 'Ministry Problem Statements', 'Hardware & Software'],
    featured: true,
  },
  {
    id: 'kavach-cyber-2026',
    title: 'Kavach Cybersecurity Grand Challenge',
    organization: 'MHA (Ministry of Home Affairs) & AICTE',
    type: 'Hackathon',
    description: 'National cybersecurity hackathon to identify innovative solutions for modern cyber threat detection, dark web monitoring, phishing, and forensic analysis.',
    deadline: 'Annual Cohort Call',
    stipendOrPrize: '₹20,00,000 total prize pool + deployment pilot',
    location: 'National Police Academy & Virtual',
    eligibility: 'Higher education students, security researchers, and early innovators',
    url: 'https://kavach.mic.gov.in',
    mode: 'Hybrid',
    destinations: ['cybersecurity-engineer', 'software-engineer'],
    tags: ['Cyber Defence', 'Forensics', 'Govt Defense Pilot'],
    featured: true,
  },
  {
    id: 'amazon-ml-summer-school',
    title: 'Amazon ML Summer School 2026',
    organization: 'Amazon Science & Machine Learning India',
    type: 'Internship',
    description: 'Intensive curriculum covering Deep Learning, Probabilistic Graphical Models, LLMs, and Generative AI taught directly by top Amazon Scientists.',
    deadline: 'June–July Call annually',
    stipendOrPrize: 'Free Immersion + Direct Interview Slot for Amazon ML Internships',
    location: 'Virtual Classroom (Pan-India)',
    eligibility: 'Enrolled B.Tech/M.Tech/PhD students (Pre-final & Final year)',
    url: 'https://www.amazon.science',
    mode: 'Online',
    destinations: ['ai-ml-engineer', 'software-engineer', 'research-phd'],
    tags: ['Frontier AI', 'Amazon Scientists', 'Direct Interview Slot'],
    featured: true,
  },
  {
    id: 'google-solution-challenge',
    title: 'Google Solution Challenge',
    organization: 'Google Developer Student Clubs (GDSC)',
    type: 'Hackathon',
    description: 'Annual contest challenging university students around the globe to build practical solutions for one or more of the 17 United Nations Sustainable Development Goals using Google technologies.',
    deadline: 'Submissions close March annually',
    stipendOrPrize: '$3,000 per member (Top 3) + Google Mentorship',
    location: 'Global (Online)',
    eligibility: 'Any actively enrolled college undergraduate or graduate student',
    url: 'https://developers.google.com/community/gdsc-solution-challenge',
    mode: 'Online',
    destinations: ['software-engineer', 'ai-ml-engineer', 'all'],
    tags: ['UN SDGs', 'Flutter', 'Google Cloud', 'TensorFlow'],
    featured: false,
  },
  {
    id: 'flipkart-grid',
    title: 'Flipkart GRiD Flagship Engineering Challenge',
    organization: 'Flipkart Engineering & Supply Chain Labs',
    type: 'Hackathon',
    description: 'Industry engineering competition testing problem-solving in Software Development, Robotics, Information Security, and GenAI algorithms for e-commerce scale.',
    deadline: 'July–August annually',
    stipendOrPrize: '₹5,00,000 + Pre-Placement Interviews (PPIs)',
    location: 'Virtual / Bengaluru Finals',
    eligibility: 'B.Tech / B.E / M.Tech students (Batches 2024–2028)',
    url: 'https://unstop.com/hackathons/flipkart-grid',
    mode: 'Online',
    destinations: ['software-engineer', 'ai-ml-engineer', 'cybersecurity-engineer'],
    tags: ['E-Commerce Scale', 'System Design', 'Direct Placements'],
    featured: false,
  },
  {
    id: 'ethindia',
    title: 'ETHIndia Global Hackathon',
    organization: 'Devfolio & Ethereum Foundation',
    type: 'Hackathon',
    description: 'Asia’s biggest hackathon connecting 2,000+ top developers, cryptographers, and protocol architects building decentralised protocols, zero-knowledge proofs, and web infrastructure.',
    deadline: 'December annually',
    stipendOrPrize: '$100,000+ in track bounties and grants',
    location: 'KTPO, Bengaluru',
    eligibility: 'Open to all developers and students based on project application',
    url: 'https://ethindia.co',
    mode: 'In-person',
    destinations: ['software-engineer', 'cybersecurity-engineer'],
    tags: ['Cryptography', 'Distributed Systems', 'Global Dev Community'],
    featured: false,
  },

  // ── Internships & Fellowships ──────────────────────────────────────────────
  {
    id: 'gsoc-2026',
    title: 'Google Summer of Code (GSoC)',
    organization: 'Google Open Source Programs Office',
    type: 'Internship',
    description: 'Renowned international fellowship program pairing student contributors with open-source organizations (Linux, Apache, PyTorch, OWASP, Mozilla) for 12–22 week mentored development.',
    deadline: 'Applications open March annually',
    stipendOrPrize: '$1,500 – $3,000 (Adjusted by country PPP)',
    location: '100% Remote',
    eligibility: 'Students & beginner contributors 18+ worldwide',
    url: 'https://summerofcode.withgoogle.com',
    mode: 'Online',
    destinations: ['software-engineer', 'ai-ml-engineer', 'cybersecurity-engineer', 'research-phd'],
    tags: ['Open Source', 'Global Credential', 'Top Resume Multiplier'],
    featured: true,
  },
  {
    id: 'drdo-isro-internship',
    title: 'DRDO & ISRO Student Research Apprenticeship',
    organization: 'Defence R&D Organisation / Indian Space Research Organisation',
    type: 'Internship',
    description: 'Work directly inside national laboratories (SAC, VSSC, CAIR, SAG) on cryptographic protocols, avionics, satellite imagery ML, and secure real-time embedded systems.',
    deadline: 'Twice yearly (Summer & Winter calls)',
    stipendOrPrize: 'Official Govt Certificate + Project Sponsorship',
    location: 'Bengaluru / Hyderabad / Delhi Labs',
    eligibility: 'Pre-final and final year B.Tech/M.Tech with CGPA > 7.5',
    url: 'https://www.isro.gov.in/Internship.html',
    mode: 'In-person',
    destinations: ['cybersecurity-engineer', 'mtech-gate', 'research-phd', 'ai-ml-engineer'],
    tags: ['Defence Security', 'National Aerospace', 'Lab Experience'],
    featured: true,
  },
  {
    id: 'microsoft-research-fellow',
    title: 'Microsoft Research India Research Fellows Program',
    organization: 'Microsoft Research (MSR) India',
    type: 'Internship',
    description: 'Prestigious 1 to 2-year full-time fellowship for graduating Bachelor’s/Master’s students to conduct cutting-edge research alongside world-renowned scientists before PhD or industry.',
    deadline: 'November–January annually',
    stipendOrPrize: 'Competitive Salary (~₹12–16 LPA equivalent)',
    location: 'MSR Lab, Bengaluru',
    eligibility: 'Final year students or recent graduates in CS, Math, EE, or related branches',
    url: 'https://www.microsoft.com/en-us/research/lab/microsoft-research-india/opportunities-for-students-and-fellows/',
    mode: 'Hybrid',
    destinations: ['research-phd', 'ai-ml-engineer', 'foreign-studies-ms'],
    tags: ['Frontier AI', 'Systems Research', 'Direct PhD Pipeline'],
    featured: true,
  },
  {
    id: 'iasc-srfp',
    title: 'Indian Academy of Sciences Summer Research Fellowship (SRFP)',
    organization: 'IASc (Bangalore), INSA (New Delhi), NASI (Prayagraj)',
    type: 'Internship',
    description: 'Premier national academic fellowship pairing students with Academy Fellows and leading faculty across IITs, IISc, TIFR, and IISERs for a 2-month summer research stay.',
    deadline: 'Applications close November annually',
    stipendOrPrize: '₹12,500/month stipend + Round-trip train fare',
    location: 'Premier Institutes (IISc, IITs, TIFR)',
    eligibility: 'B.Tech/B.Sc students with min 65% aggregate from 2nd/3rd year',
    url: 'https://web-japps.ias.ac.in/fellowship2024/',
    mode: 'In-person',
    destinations: ['research-phd', 'mtech-gate', 'foreign-studies-ms'],
    tags: ['Academic Rigor', 'Faculty Recommendation', 'Premier Labs'],
    featured: false,
  },

  // ── Research & Grants ──────────────────────────────────────────────────────
  {
    id: 'pmrf-fellowship',
    title: 'Prime Minister’s Research Fellowship (PMRF)',
    organization: 'Ministry of Education, Government of India',
    type: 'Research',
    description: 'Highest-paying doctoral fellowship in India designed to attract top engineering talent into doctoral research at IITs, IISc, and NITs with direct entry from B.Tech.',
    deadline: 'Bi-annual selection cycles',
    stipendOrPrize: '₹70,000–₹80,000/month + ₹2,00,000/year research grant',
    location: 'IITs, IISc, IISERs',
    eligibility: 'B.Tech students with CGPA ≥ 8.0 (from CFTIs) or qualified GATE score',
    url: 'https://www.pmrf.in',
    mode: 'In-person',
    destinations: ['research-phd', 'mtech-gate'],
    tags: ['Govt Elite Scheme', '₹70k-80k Monthly', 'Direct PhD Entry'],
    featured: true,
  },
  {
    id: 'daad-wise',
    title: 'DAAD WISE (Working Internships in Science & Engineering)',
    organization: 'German Academic Exchange Service (DAAD)',
    type: 'Research',
    description: 'Funded 2 to 3-month research internship at top German public universities (TUM, RWTH Aachen, KIT) under a German university professor.',
    deadline: 'November annually',
    stipendOrPrize: '€934/month stipend + €1,050 travel subsidy + health insurance',
    location: 'Germany (Universities & Max Planck Institutes)',
    eligibility: '5th or 6th semester B.Tech students from select Indian universities',
    url: 'https://www.daad.in/en/find-funding/scholarship-database/',
    mode: 'In-person',
    destinations: ['foreign-studies-ms', 'research-phd'],
    tags: ['German Universities', 'Euro Stipend', 'International Exposure'],
    featured: true,
  },
  {
    id: 'ieee-acm-src',
    title: 'ACM / IEEE Student Research Competitions (SRC)',
    organization: 'ACM & IEEE Computer Society',
    type: 'Research',
    description: 'Global forum for undergraduate and graduate students to present their original research posters and papers at major conferences with full travel grants.',
    deadline: 'Varies per conference (SIGCOMM, SIGGRAPH, ICSE, NeurIPS)',
    stipendOrPrize: '$500 travel grant + $500 monetary medal prize',
    location: 'International Conference Venues',
    eligibility: 'Undergraduate student members of ACM/IEEE with accepted abstract',
    url: 'https://src.acm.org',
    mode: 'Hybrid',
    destinations: ['research-phd', 'foreign-studies-ms'],
    tags: ['Paper Publication', 'Global Travel Grant', 'Top Peer Review'],
    featured: false,
  },

  // ── Business, Incubators & Management ─────────────────────────────────────
  {
    id: 'idex-defence',
    title: 'iDEX (Innovations for Defence Excellence) Student Open Challenge',
    organization: 'Ministry of Defence & Defence Innovation Organisation (DIO)',
    type: 'Incubator',
    description: 'Government grant scheme awarding student founders and innovators grants up to ₹1.5 Crore to develop indigenous hardware, secure communication, radar AI, and drone technologies.',
    deadline: 'Rolling Challenge Rounds',
    stipendOrPrize: 'Up to ₹1.50 Crore Grant-in-aid + Armed Forces Trials',
    location: 'Partner Incubators (IIT Madras, IIT Kanpur, SINE IITB)',
    eligibility: 'Engineering student innovators, MSMEs, and early-stage tech ventures',
    url: 'https://idex.gov.in',
    mode: 'Hybrid',
    destinations: ['cybersecurity-engineer', 'mba-tech-mgmt', 'software-engineer'],
    tags: ['Govt Defence Grant', 'Up to ₹1.5 Cr', 'Armed Forces Pilots'],
    featured: true,
  },
  {
    id: 'hult-prize',
    title: 'Hult Prize Challenge for Student Entrepreneurs',
    organization: 'Hult Prize Foundation & United Nations',
    type: 'Incubator',
    description: 'Often called the "Nobel Prize for Students". Annual year-long competition challenging college students to solve pressing global social issues through viable, for-profit business enterprises.',
    deadline: 'Campus rounds: Oct–Dec | Global finals: Sept',
    stipendOrPrize: '$1,00,000 USD Seed Investment for winner',
    location: 'Campus → Regional Summits → Global Accelerator (London/Paris)',
    eligibility: 'Teams of 3–4 university students across any discipline',
    url: 'https://www.hultprize.org',
    mode: 'Hybrid',
    destinations: ['mba-tech-mgmt', 'all'],
    tags: ['$1M Seed Prize', 'UN Partnered', 'Social Enterprise'],
    featured: true,
  },
  {
    id: 'nidhi-eir',
    title: 'NIDHI-EIR (Entrepreneur-in-Residence) Scheme',
    organization: 'Department of Science and Technology (DST, Govt of India)',
    type: 'Incubator',
    description: 'Support grant for young science and engineering graduates wanting to explore tech entrepreneurship instead of taking an immediate corporate job.',
    deadline: 'Quarterly intake at approved TBIs',
    stipendOrPrize: '₹30,000/month fellowship for up to 18 months',
    location: 'DST-Recognized Technology Business Incubators across India',
    eligibility: 'Indian engineering / science graduates with innovative product concept',
    url: 'https://nidhi-eir.uk/home/',
    mode: 'Hybrid',
    destinations: ['mba-tech-mgmt', 'software-engineer', 'all'],
    tags: ['Govt Founder Stipend', 'TBI Incubator Access', 'No Equity Taken'],
    featured: false,
  },
  {
    id: 'yc-startup-school',
    title: 'Y Combinator Startup School & Co-Founder Portal',
    organization: 'Y Combinator (Silicon Valley)',
    type: 'Incubator',
    description: 'Free, world-class online course and mentorship portal taught by YC partners. Direct pipeline for applying to the YC flagship $500k batch investment.',
    deadline: 'Self-paced year-round access',
    stipendOrPrize: '$500,000 equity seed fund for accepted batch companies',
    location: 'Online / San Francisco, CA',
    eligibility: 'Anyone building software, AI, or innovative tech products',
    url: 'https://www.startupschool.org',
    mode: 'Online',
    destinations: ['mba-tech-mgmt', 'software-engineer', 'ai-ml-engineer'],
    tags: ['YC Silicon Valley', 'Startup Curriculum', 'Founder Matching'],
    featured: false,
  },
  {
    id: 'tata-crucible',
    title: 'Tata Crucible Campus Hackathon & Strategy League',
    organization: 'Tata Sons & Tata Group',
    type: 'Competition',
    description: 'Premier national collegiate competition challenging engineering and management students to solve disruptive business strategy and tech architecture scenarios.',
    deadline: 'Annual October–December Call',
    stipendOrPrize: '₹2,50,000 Cash Prize + Fast-Track Interviews with Tata Group companies',
    location: 'Pan-India Zonal & Mumbai Finals',
    eligibility: 'Full-time college students from recognized universities',
    url: 'https://tatacrucible.com',
    mode: 'Hybrid',
    destinations: ['mba-tech-mgmt', 'software-engineer', 'all'],
    tags: ['Tata Group', 'Strategy & Tech', 'Fast-Track Placement'],
    featured: false,
  },
  {
    id: 'upsc-gs-mentorship',
    title: 'Sankalp IAS & State Civil Service Foundation Scholarships',
    organization: 'National Public Policy & Administrative Initiatives',
    type: 'Competition',
    description: 'Merit-based free residential training and scholarship tests for engineers aspiring for Civil Services (UPSC CSE, IFS, State PSCs) with answer evaluation by ex-bureaucrats.',
    deadline: 'Announced post-prelims and annual June calls',
    stipendOrPrize: '100% Tuition & Accommodation Scholarship',
    location: 'New Delhi / State Capital Centers',
    eligibility: 'Graduating college seniors preparing for UPSC CSE',
    url: 'https://upsc.gov.in',
    mode: 'Hybrid',
    destinations: ['civil-services-ias'],
    tags: ['Civil Services Training', 'Mains Answer Review', 'Bureaucracy Mentors'],
    featured: false,
  },
]

export const mockOpportunities = baseOpportunities

// ── Deterministic Daily Seed Engine ──────────────────────────────────────────
// Generates live, daily-changing metrics (Trending Scores, Daily Badges, Views Today)
// so the radar continuously surfaces fresh and trending opportunities every single day.

function getDaySeed(): number {
  const now = new Date()
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
}

export function getEnrichedDailyOpportunities(): Opportunity[] {
  const seed = getDaySeed()

  return baseOpportunities.map((opp, idx) => {
    // Daily pseudo-hash
    const hash = (seed * (idx + 7) + idx * 31) % 1000

    // Trending score between 72 and 99
    const trendingScore = 75 + (hash % 25)

    // Daily rotating status badges
    let dailyBadge = '🌟 Recommended'
    let isTrending = false
    let isClosingSoon = false
    let isNewToday = false

    if (idx % 4 === 0 || trendingScore >= 95) {
      dailyBadge = '🔥 Trending Today'
      isTrending = true
    } else if (idx % 5 === 1 || hash % 10 === 0) {
      dailyBadge = '⚡ Closing in 48h'
      isClosingSoon = true
    } else if (idx % 6 === 2 || hash % 7 === 0) {
      dailyBadge = '🟢 Just Opened'
      isNewToday = true
    }

    // Dynamic daily applicant counter
    const applicantsToday = 140 + (hash % 480)

    // Calculated days remaining
    const daysRemaining = isClosingSoon ? 2 : (hash % 20) + 3

    // Dynamic posted timestamp
    const postedTimes = ['2 hours ago', '4 hours ago', 'Today, 08:30 AM', 'Today, 11:15 AM', 'Yesterday', '2 days ago']
    const postedAt = postedTimes[hash % postedTimes.length]

    return {
      ...opp,
      trendingScore,
      dailyBadge,
      applicantsToday,
      daysRemaining,
      isTrending,
      isClosingSoon,
      isNewToday,
      postedAt,
    }
  })
}

export function getOpportunities(
  destinationId?: string,
  type?: OpportunityType | 'all',
  filterMode?: 'all' | 'trending' | 'closing-soon' | 'new-today'
): Opportunity[] {
  let list = getEnrichedDailyOpportunities()

  if (destinationId) {
    list = list.filter(
      (op) => op.destinations.includes('all') || op.destinations.includes(destinationId)
    )
  }

  if (type && type !== 'all') {
    list = list.filter((op) => op.type === type)
  }

  if (filterMode === 'trending') {
    list = [...list].sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
  } else if (filterMode === 'closing-soon') {
    list = list.filter((op) => op.isClosingSoon || (op.daysRemaining ?? 30) <= 7)
    list.sort((a, b) => (a.daysRemaining ?? 30) - (b.daysRemaining ?? 30))
  } else if (filterMode === 'new-today') {
    list = list.filter((op) => op.isNewToday || (op.postedAt ?? '').includes('Today'))
  }

  return list
}
