"""
Generator script to populate data/*.csv with real skills, destinations, prerequisites,
destination requirements, and authentic opportunities matching frontend/lib/mock-data.
"""
import os
import csv

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Destinations
DESTINATIONS = [
    {
        "id": "ai-ml-engineer",
        "title": "AI / ML Engineer",
        "description": "Design and build production machine learning systems, deep neural networks, and generative models.",
        "icon": "🧠",
        "category": "Artificial Intelligence",
        "avg_salary": "₹12-24 LPA",
        "tags": "Python;Deep Learning;PyTorch;MLOps;Generative AI",
    },
    {
        "id": "software-engineer",
        "title": "Software Engineer (SDE)",
        "description": "Architect scalable backend services, distributed systems, clean APIs, and enterprise cloud infrastructure.",
        "icon": "💻",
        "category": "Software Engineering",
        "avg_salary": "₹10-22 LPA",
        "tags": "DSA;System Design;Python;APIs;Cloud Infrastructure",
    },
    {
        "id": "cybersecurity-engineer",
        "title": "Cybersecurity & Defence Specialist",
        "description": "Protect critical infrastructure, conduct red/blue team simulations, ethical penetration tests, and cryptographic hardening.",
        "icon": "🛡️",
        "category": "Security & Systems",
        "avg_salary": "₹10-20 LPA",
        "tags": "Network Security;Pen Testing;Cryptography;SOC;Incident Response",
    },
    {
        "id": "mtech-gate",
        "title": "Higher Technical Studies (GATE / M.Tech)",
        "description": "Excel in GATE CS/IT, securing master admission to IISc, IITs, or elite research institutes and PSU recruitment.",
        "icon": "🎓",
        "category": "Higher Education",
        "avg_salary": "₹15-30 LPA (Post-M.Tech)",
        "tags": "GATE CS;TOC;Algorithms;Compilers;Computer Architecture",
    },
    {
        "id": "foreign-studies-ms",
        "title": "Global Masters (MS Abroad)",
        "description": "Secure admission and research funding at top international universities (US, Germany, Europe, Singapore).",
        "icon": "✈️",
        "category": "Global Academia",
        "avg_salary": "$90,000 - $140,000",
        "tags": "GRE;SOP;IELTS/TOEFL;Research Publications;Scholarships",
    },
    {
        "id": "mba-tech-mgmt",
        "title": "Tech Management & MBA (CAT / Product)",
        "description": "Lead product management, digital business strategy, and venture growth by clearing CAT/GMAT for premier B-schools.",
        "icon": "💼",
        "category": "Business & Strategy",
        "avg_salary": "₹22-35 LPA (IIM/ISB)",
        "tags": "CAT Exam;Product Strategy;Quantitative Aptitude;Data Interpretation",
    },
    {
        "id": "civil-services-ias",
        "title": "Public Administration & Civil Services (UPSC / State PSC)",
        "description": "Drive public policy, governance, and national administrative systems through UPSC CSE and state public service exams.",
        "icon": "🏛️",
        "category": "Public Policy",
        "avg_salary": "Govt Pay Scales (Level 10-14)",
        "tags": "UPSC CSE;Indian Polity;Current Affairs;Public Policy;CSAT",
    },
    {
        "id": "research-phd",
        "title": "Frontier Academic Research & PhD",
        "description": "Publish in top-tier peer-reviewed conferences (NeurIPS, ICSE, ACM) and pursue high-impact doctoral research with fellowships.",
        "icon": "🔬",
        "category": "Research & Academia",
        "avg_salary": "PMRF / Doctoral Grants (₹70k-80k/mo)",
        "tags": "PMRF;Research Papers;Literature Review;Doctoral Thesis",
    },
]

# 2. Raw Skills definitions
RAW_SKILLS = [
    # AI/ML & Core
    ("python", "Python", "Programming", "General-purpose programming language widely used in data science, systems, and ML.", "Python is the primary lingua franca for ML/AI and rapid prototyping.", 0, []),
    ("cpp", "C++", "Programming", "High-performance compiled language, standard for algorithms and competitive coding.", "Provides deep intuition about memory management, pointers, and cache efficiency.", 0, []),
    ("html-css", "HTML / CSS", "Programming", "Foundational web technologies for building interactive browser interfaces.", "Useful for building frontend dashboards and presenting data projects to stakeholders.", 0, []),
    ("git", "Git", "Tools", "Distributed version control system for tracking code changes and team collaboration.", "Crucial for managing repositories, continuous integration, and open-source contributions.", 0, []),
    ("data-structures", "Data Structures", "Foundations", "Core memory layouts: arrays, linked lists, hash maps, binary trees, heaps, and graphs.", "Prerequisite for all scalable engineering, algorithm design, and technical interviews.", 3, ["python"]),
    ("linear-algebra", "Linear Algebra", "Mathematics", "Vector spaces, matrix decomposition, eigenvalues, SVD, and high-dimensional transformations.", "Linear algebra forms the structural foundation of almost all deep learning and embeddings.", 4, []),
    ("statistics", "Statistics & Probability", "Mathematics", "Probability distributions, Bayes theorem, hypothesis testing, confidence intervals, and variance.", "Provides the mathematical rigor needed to interpret loss curves, model validation, and significance.", 4, ["linear-algebra"]),
    ("sql", "SQL & Relational Databases", "Databases", "Querying, joins, indexing, normalization, transactions (ACID), and schema optimization.", "Data in enterprise production is stored in relational DBs. Core data extraction skill.", 2, ["data-structures"]),
    ("data-analysis", "Data Analysis & EDA", "Data Science", "Data wrangling with Pandas, exploratory visualization with Matplotlib/Seaborn, feature cleaning.", "Raw real-world datasets are noisy. Analysis is mandatory before training predictive models.", 3, ["python", "sql", "statistics"]),
    ("machine-learning", "Machine Learning", "Machine Learning", "Supervised regression/classification, decision trees, boosting (XGBoost), unsupervised clustering.", "The foundational pillar of modern intelligent software and predictive modeling.", 6, ["python", "data-structures", "statistics", "linear-algebra", "data-analysis"]),
    ("deep-learning", "Deep Learning", "Machine Learning", "Multi-layer perceptrons, backpropagation, CNNs for vision, RNNs, and Attention mechanisms.", "Enables complex pattern recognition across unstructured audio, image, and textual domains.", 5, ["machine-learning", "linear-algebra"]),
    ("nlp", "Natural Language Processing", "Machine Learning", "Tokenization, embeddings, language modeling, fine-tuning, and Transformer architectures.", "Powers Large Language Models (LLMs), semantic search, conversational agents, and machine translation.", 3, ["deep-learning"]),
    ("computer-vision", "Computer Vision", "Machine Learning", "Image processing, convolution kernels, object detection (YOLO), segmentation, and generative diffusion.", "Applied across autonomous driving, robotics, biomedical imaging, and satellite analytics.", 3, ["deep-learning"]),
    ("mlops", "MLOps & Deployment", "Tools", "Containerizing models with Docker, experiment tracking with MLflow, FastAPI serving, and CI/CD pipelines.", "Bridges theoretical ML notebooks and scalable, high-availability production services.", 3, ["machine-learning", "git"]),
    ("cloud-basics", "Cloud Computing (AWS / GCP)", "Tools", "Virtual machines, object storage (S3), serverless compute, and container orchestration.", "Industry workflows almost exclusively operate on AWS, Azure, or Google Cloud.", 2, ["git"]),

    # Software Engineering & Systems
    ("algorithms", "Algorithms", "Foundations", "Sorting, searching, recursion, dynamic programming and complexity analysis.", "Algorithmic thinking is tested in interviews, GATE and is the base of efficient software.", 4, ["data-structures"]),
    ("oop", "Object-Oriented Programming", "Programming", "Classes, inheritance, encapsulation and design principles.", "Real-world codebases are organised around OOP concepts.", 3, ["python"]),
    ("os-fundamentals", "Operating Systems", "Foundations", "Processes, threads, memory management, scheduling and file systems.", "Understanding the OS explains how every program actually runs.", 3, []),
    ("computer-networks", "Computer Networks", "Foundations", "TCP/IP, HTTP, DNS, routing and network layers.", "Every modern application and security tool depends on networking.", 3, []),
    ("backend-apis", "Backend & APIs", "Programming", "Building REST APIs, authentication and database-backed services.", "APIs are how software components and products talk to each other.", 4, ["oop", "sql"]),
    ("testing", "Testing & Quality", "Tools", "Unit tests, integration tests and CI basics.", "Tested code is what teams are willing to ship.", 2, ["oop", "git"]),
    ("system-design", "System Design", "Foundations", "Scalability, caching, load balancing and data modelling.", "System design separates junior from mid-level engineers.", 4, ["backend-apis", "computer-networks", "algorithms"]),

    # Cybersecurity
    ("cryptography", "Cryptography", "Mathematics", "Symmetric and public-key encryption, hashing and TLS.", "Cryptography protects data in transit and at rest.", 3, ["computer-networks"]),
    ("network-security", "Network Security", "Foundations", "Firewalls, IDS/IPS, VPNs and secure network design.", "Most attacks cross a network boundary.", 3, ["computer-networks"]),
    ("web-security", "Web Security", "Programming", "OWASP Top 10: injection, XSS, CSRF and broken authentication.", "Web apps are the most common attack surface.", 3, ["html-css", "sql"]),
    ("ethical-hacking", "Ethical Hacking", "Tools", "Reconnaissance, exploitation and penetration-testing methodology.", "Thinking like an attacker is how defences get tested.", 4, ["network-security", "os-fundamentals", "web-security"]),
    ("incident-response", "Incident Response", "Tools", "Detection, triage, forensics and reporting of security incidents.", "Security teams are judged on how they respond when things break.", 3, ["network-security", "os-fundamentals"]),

    # GATE
    ("engineering-math", "Engineering Mathematics", "Mathematics", "Calculus, linear algebra, probability and numerical methods.", "A significant portion of the GATE paper is mathematics.", 5, []),
    ("discrete-math", "Discrete Mathematics", "Mathematics", "Logic, sets, graphs, combinatorics and recurrences.", "Foundation for algorithms and theory of computation.", 4, []),
    ("digital-logic", "Digital Logic", "Foundations", "Boolean algebra, combinational and sequential circuits.", "Base for computer organisation questions.", 3, []),
    ("comp-org", "Computer Organization", "Foundations", "CPU design, pipelining, memory hierarchy and I/O.", "High-weightage GATE subject.", 4, ["digital-logic"]),
    ("toc", "Theory of Computation", "Foundations", "Automata, regular languages, context-free grammars and decidability.", "Core theory subject with predictable GATE patterns.", 4, ["discrete-math"]),
    ("compiler-design", "Compiler Design", "Foundations", "Lexical analysis, parsing and code generation.", "Scoring subject once TOC is clear.", 3, ["toc"]),
    ("dbms", "Database Management Systems", "Databases", "ER models, normalisation, transactions and indexing.", "Consistently tested in GATE and interviews.", 3, []),
    ("gate-aptitude", "General Aptitude", "Aptitude & Management", "Verbal and numerical reasoning for GATE.", "15% of the GATE paper - easy marks if practised.", 3, []),
    ("gate-practice", "GATE Mock Tests", "Foundations", "Full-length timed mock tests and error analysis.", "Mock performance is the best predictor of your final rank.", 4, ["algorithms", "os-fundamentals", "comp-org", "toc", "dbms", "engineering-math"]),

    # MS Abroad
    ("gre-quant", "GRE Quantitative", "Aptitude & Management", "Quantitative reasoning for the GRE.", "A strong quant score is expected for technical MS programmes.", 4, []),
    ("gre-verbal", "GRE Verbal", "Aptitude & Management", "Reading comprehension and vocabulary for the GRE.", "Contributes to overall GRE competitiveness.", 4, []),
    ("english-test", "IELTS / TOEFL", "Aptitude & Management", "English proficiency exam preparation.", "Most universities require a minimum score.", 3, []),
    ("research-exposure", "Projects & Research Experience", "Academic Research", "Final-year project, internship or publication experience.", "Admissions committees weigh research and project experience heavily.", 5, []),
    ("university-shortlist", "University Shortlisting", "General Studies", "Researching programmes, deadlines and fit.", "A good shortlist balances ambition with realistic chances.", 2, ["research-exposure"]),
    ("sop-writing", "Statement of Purpose", "General Studies", "Writing a clear and personal SOP.", "The SOP is where you tell your story.", 3, ["research-exposure"]),
    ("application-docs", "Recommendations & Documents", "General Studies", "Letters of recommendation, transcripts and forms.", "Complete, on-time applications avoid avoidable rejection.", 2, ["university-shortlist", "sop-writing"]),
    ("funding-visa", "Funding & Visa Planning", "General Studies", "Scholarships, loans and visa process.", "Financial planning decides whether an offer is actionable.", 2, ["university-shortlist"]),

    # MBA
    ("quant-aptitude", "Quantitative Aptitude", "Aptitude & Management", "Arithmetic, algebra, geometry and number systems.", "Quant is a make-or-break section in CAT-style exams.", 5, []),
    ("logical-reasoning", "Logical Reasoning", "Aptitude & Management", "Puzzles, arrangements, sets and logical deduction.", "Forms half of the LRDI section.", 4, []),
    ("verbal-ability", "Verbal Ability", "Aptitude & Management", "Reading comprehension, para-jumbles and grammar.", "Verbal skill also feeds directly into interviews.", 4, []),
    ("data-interpretation", "Data Interpretation", "Aptitude & Management", "Reading tables, charts and caselets quickly.", "Needs both calculation speed and logical thinking.", 3, ["quant-aptitude", "logical-reasoning"]),
    ("business-fundamentals", "Business Fundamentals", "Aptitude & Management", "Marketing, finance, operations and current business news.", "Interviewers expect business awareness.", 3, []),
    ("cat-mocks", "Mock Exams", "Aptitude & Management", "Timed mocks with sectional analysis.", "Mocks build speed, strategy and stamina.", 4, ["data-interpretation", "verbal-ability"]),
    ("gd-pi", "Group Discussion & Interview", "Aptitude & Management", "GD practice and personal interview preparation.", "Final selection depends on GD/PI performance.", 3, ["business-fundamentals"]),

    # Civil Services
    ("polity", "Indian Polity", "General Studies", "Constitution, governance and institutions.", "Polity is a high-scoring, high-weightage GS subject.", 5, []),
    ("indian-history", "History", "General Studies", "Ancient, medieval, modern history and culture.", "Appears in both Prelims and Mains.", 4, []),
    ("geography", "Geography", "General Studies", "Physical, human and Indian geography.", "Overlaps with environment and current affairs.", 4, []),
    ("economy", "Indian Economy", "General Studies", "Macroeconomics, budgeting and economic survey.", "Linked to many current-affairs questions.", 4, []),
    ("environment", "Environment & Ecology", "General Studies", "Ecology, biodiversity and climate policy.", "Increasingly weighted in Prelims.", 3, ["geography"]),
    ("current-affairs", "Current Affairs", "General Studies", "Daily news analysis linked to the syllabus.", "Connects static knowledge to what is happening now.", 3, ["polity", "economy"]),
    ("ethics", "Ethics & Integrity", "General Studies", "Ethics, aptitude and case studies.", "GS Paper 4 rewards structured thinking.", 3, ["polity"]),
    ("csat", "CSAT", "Aptitude & Management", "Comprehension, reasoning and basic numeracy.", "Qualifying paper - failing it ends the attempt.", 4, []),
    ("essay-writing", "Essay Writing", "General Studies", "Structured essays with examples and balance.", "A full paper in Mains.", 3, ["current-affairs"]),
    ("answer-writing", "Answer Writing", "General Studies", "Writing concise, structured Mains answers.", "Mains is a writing exam - practice decides the score.", 4, ["ethics", "essay-writing", "indian-history"]),
    ("prelims-mocks", "Prelims Mock Tests", "General Studies", "Test series and revision cycles.", "Mocks calibrate accuracy and negative marking.", 4, ["csat", "current-affairs", "environment", "indian-history", "geography"]),

    # Research / PhD
    ("research-methods", "Research Methods", "Academic Research", "Formulating questions, designing studies and validity.", "The foundation of all academic work.", 4, []),
    ("literature-review", "Literature Review", "Academic Research", "Finding, reading and synthesising papers.", "Shows you know where the field stands.", 4, ["research-methods"]),
    ("academic-writing", "Academic Writing", "Academic Research", "Writing papers in a clear, structured style.", "Publications are the currency of research.", 3, ["research-methods"]),
    ("research-proposal", "Research Proposal", "Academic Research", "Writing a focused proposal with a feasible plan.", "The proposal is the centre of a PhD application.", 4, ["literature-review", "academic-writing"]),
    ("publication-record", "First Publication", "Academic Research", "Producing a workshop or conference paper.", "A publication strongly signals research readiness.", 6, ["research-proposal", "statistics"]),
    ("faculty-outreach", "Supervisor Outreach", "General Studies", "Identifying and contacting potential supervisors.", "Supervisor fit matters as much as the institution.", 2, ["research-proposal"]),
]

# Destination requirements mapping (Skill IDs and importance)
DESTINATION_REQUIREMENTS = {
    "ai-ml-engineer": [
        ("python", "Intermediate", "core"),
        ("git", "Beginner", "supporting"),
        ("data-structures", "Intermediate", "core"),
        ("linear-algebra", "Intermediate", "core"),
        ("statistics", "Intermediate", "core"),
        ("sql", "Intermediate", "core"),
        ("data-analysis", "Intermediate", "core"),
        ("machine-learning", "Advanced", "core"),
        ("deep-learning", "Intermediate", "core"),
        ("mlops", "Beginner", "supporting"),
        ("cloud-basics", "Beginner", "supporting"),
        ("nlp", "Beginner", "optional"),
        ("computer-vision", "Beginner", "optional"),
    ],
    "software-engineer": [
        ("python", "Intermediate", "core"),
        ("git", "Beginner", "supporting"),
        ("data-structures", "Intermediate", "core"),
        ("algorithms", "Intermediate", "core"),
        ("oop", "Intermediate", "core"),
        ("sql", "Intermediate", "core"),
        ("os-fundamentals", "Intermediate", "core"),
        ("computer-networks", "Intermediate", "core"),
        ("backend-apis", "Intermediate", "core"),
        ("testing", "Beginner", "supporting"),
        ("system-design", "Intermediate", "core"),
        ("cloud-basics", "Beginner", "supporting"),
    ],
    "cybersecurity-engineer": [
        ("python", "Intermediate", "core"),
        ("git", "Beginner", "supporting"),
        ("data-structures", "Intermediate", "core"),
        ("computer-networks", "Intermediate", "core"),
        ("os-fundamentals", "Intermediate", "core"),
        ("html-css", "Beginner", "supporting"),
        ("sql", "Intermediate", "core"),
        ("cryptography", "Intermediate", "core"),
        ("network-security", "Intermediate", "core"),
        ("web-security", "Intermediate", "core"),
        ("ethical-hacking", "Intermediate", "core"),
        ("incident-response", "Beginner", "supporting"),
    ],
    "mtech-gate": [
        ("python", "Intermediate", "supporting"),
        ("engineering-math", "Advanced", "core"),
        ("discrete-math", "Intermediate", "core"),
        ("digital-logic", "Intermediate", "core"),
        ("comp-org", "Intermediate", "core"),
        ("toc", "Intermediate", "core"),
        ("compiler-design", "Beginner", "supporting"),
        ("data-structures", "Intermediate", "core"),
        ("algorithms", "Advanced", "core"),
        ("os-fundamentals", "Intermediate", "core"),
        ("dbms", "Intermediate", "core"),
        ("computer-networks", "Intermediate", "core"),
        ("gate-aptitude", "Beginner", "supporting"),
        ("gate-practice", "Advanced", "core"),
    ],
    "foreign-studies-ms": [
        ("gre-quant", "Advanced", "core"),
        ("gre-verbal", "Beginner", "supporting"),
        ("english-test", "Intermediate", "core"),
        ("research-exposure", "Intermediate", "core"),
        ("university-shortlist", "Beginner", "supporting"),
        ("sop-writing", "Intermediate", "core"),
        ("application-docs", "Beginner", "supporting"),
        ("funding-visa", "Beginner", "supporting"),
    ],
    "mba-tech-mgmt": [
        ("quant-aptitude", "Advanced", "core"),
        ("logical-reasoning", "Advanced", "core"),
        ("verbal-ability", "Intermediate", "core"),
        ("data-interpretation", "Intermediate", "core"),
        ("business-fundamentals", "Beginner", "supporting"),
        ("cat-mocks", "Advanced", "core"),
        ("gd-pi", "Beginner", "supporting"),
    ],
    "civil-services-ias": [
        ("polity", "Advanced", "core"),
        ("indian-history", "Intermediate", "core"),
        ("geography", "Intermediate", "core"),
        ("economy", "Intermediate", "core"),
        ("environment", "Intermediate", "core"),
        ("current-affairs", "Advanced", "core"),
        ("ethics", "Intermediate", "core"),
        ("csat", "Beginner", "supporting"),
        ("essay-writing", "Intermediate", "core"),
        ("answer-writing", "Advanced", "core"),
        ("prelims-mocks", "Advanced", "core"),
    ],
    "research-phd": [
        ("research-methods", "Intermediate", "core"),
        ("literature-review", "Intermediate", "core"),
        ("academic-writing", "Intermediate", "core"),
        ("research-proposal", "Advanced", "core"),
        ("statistics", "Intermediate", "core"),
        ("linear-algebra", "Intermediate", "core"),
        ("publication-record", "Advanced", "core"),
        ("faculty-outreach", "Beginner", "supporting"),
    ],
}

def write_csvs():
    # 1. skills.csv
    skills_csv_path = os.path.join(DATA_DIR, "skills.csv")
    with open(skills_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["skill_id", "skill_name", "category", "description", "why_it_matters", "estimated_weeks"])
        for sid, name, cat, desc, why, weeks, _ in RAW_SKILLS:
            writer.writerow([sid, name, cat, desc, why, weeks])
    print(f"Wrote {len(RAW_SKILLS)} skills to {skills_csv_path}")

    # 2. prerequisites.csv
    prereqs_csv_path = os.path.join(DATA_DIR, "prerequisites.csv")
    prereq_rows = []
    for sid, _, _, _, _, _, prereqs in RAW_SKILLS:
        for pid in prereqs:
            prereq_rows.append((sid, pid, 1.0))
    with open(prereqs_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["skill_id", "prerequisite_id", "dependency_strength"])
        for r in prereq_rows:
            writer.writerow(r)
    print(f"Wrote {len(prereq_rows)} prerequisites to {prereqs_csv_path}")

    # 3. destinations.csv
    dests_csv_path = os.path.join(DATA_DIR, "destinations.csv")
    with open(dests_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["destination_id", "title", "description", "icon", "category", "avg_salary", "tags"])
        for d in DESTINATIONS:
            writer.writerow([d["id"], d["title"], d["description"], d["icon"], d["category"], d["avg_salary"], d["tags"]])
    print(f"Wrote {len(DESTINATIONS)} destinations to {dests_csv_path}")

    # 4. destination_requirements.csv
    dest_reqs_path = os.path.join(DATA_DIR, "destination_requirements.csv")
    req_rows = []
    for did, reqs in DESTINATION_REQUIREMENTS.items():
        for sid, lvl, imp in reqs:
            req_rows.append((did, sid, lvl, imp))
    with open(dest_reqs_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["destination_id", "skill_id", "required_level", "importance"])
        for r in req_rows:
            writer.writerow(r)
    print(f"Wrote {len(req_rows)} requirements to {dest_reqs_path}")

    # 5. opportunities.csv (18 verified authentic programs)
    opps_csv_path = os.path.join(DATA_DIR, "opportunities.csv")
    OPPORTUNITIES = [
        ("sih-2026", "Smart India Hackathon (SIH 2026)", "Ministry of Education & AICTE", "Hackathon", "World's biggest open innovation hackathon.", "Rolling (Sept-Nov)", "₹1,00,000 / problem", "Pan-India", "UG/PG Engineering", "https://www.sih.gov.in", "Hybrid", "all;software-engineer;ai-ml-engineer;cybersecurity-engineer", "National;Ministry;Flagship", True, 99),
        ("kavach-cyber-2026", "Kavach Cybersecurity Grand Challenge", "MHA & AICTE", "Hackathon", "National cybersecurity threat detection challenge.", "Annual Cohort", "₹20,00,000 pool", "National Police Academy & Virtual", "Higher Education Students", "https://kavach.mic.gov.in", "Hybrid", "cybersecurity-engineer;software-engineer", "Cyber Defence;Forensics", True, 96),
        ("amazon-ml-summer-school", "Amazon ML Summer School 2026", "Amazon Science India", "Internship", "Frontier ML curriculum taught by Amazon Scientists.", "June-July", "Free + Direct Interview Slot", "Virtual Classroom", "Pre-final/Final Year", "https://www.amazon.science", "Online", "ai-ml-engineer;software-engineer;research-phd", "Frontier AI;Amazon", True, 98),
        ("google-solution-challenge", "Google Solution Challenge", "Google Developer Student Clubs", "Hackathon", "Annual challenge solving UN SDGs using Google tech.", "March annually", "$3,000 / member", "Global", "Active Students", "https://developers.google.com/community/gdsc-solution-challenge", "Online", "software-engineer;ai-ml-engineer;all", "Google;UN SDGs", False, 88),
        ("flipkart-grid", "Flipkart GRiD 6.0 Engineering Challenge", "Flipkart Labs", "Hackathon", "Flagship e-commerce scale problem solving.", "July-August", "₹5,00,000 + PPIs", "Virtual / Bengaluru", "B.Tech/M.Tech", "https://unstop.com/hackathons/flipkart-grid", "Online", "software-engineer;ai-ml-engineer;cybersecurity-engineer", "E-Commerce;PPIs", False, 91),
        ("ethindia", "ETHIndia Global Hackathon", "Devfolio & Ethereum Foundation", "Hackathon", "Asia's biggest decentralized protocol hackathon.", "December annually", "$100,000+ pool", "Bengaluru", "Open to all", "https://ethindia.co", "In-person", "software-engineer;cybersecurity-engineer", "Cryptography;Web3", False, 86),
        ("gsoc-2026", "Google Summer of Code (GSoC)", "Google Open Source", "Internship", "12-22 week open source mentored fellowship.", "March annually", "$1,500 - $3,000", "Remote", "18+ worldwide", "https://summerofcode.withgoogle.com", "Online", "software-engineer;ai-ml-engineer;cybersecurity-engineer;research-phd", "Open Source;Global", True, 97),
        ("drdo-isro-internship", "DRDO & ISRO Student Apprenticeship", "DRDO / ISRO", "Internship", "Avionics, cryptographic protocols, satellite ML.", "Summer & Winter", "Govt Certificate + Sponsor", "National Labs", "CGPA > 7.5", "https://www.isro.gov.in/Internship.html", "In-person", "cybersecurity-engineer;mtech-gate;research-phd;ai-ml-engineer", "Defence;Aerospace", True, 94),
        ("microsoft-research-fellow", "Microsoft Research India Fellows Program", "Microsoft Research (MSR)", "Internship", "1-2 year full-time research fellowship before PhD.", "Nov-Jan", "₹12-16 LPA equivalent", "Bengaluru Lab", "Graduating Seniors", "https://www.microsoft.com/en-us/research/lab/microsoft-research-india/", "Hybrid", "research-phd;ai-ml-engineer;foreign-studies-ms", "Frontier AI;Systems", True, 95),
        ("iasc-srfp", "Indian Academy of Sciences Summer Fellowship", "IASc, INSA, NASI", "Internship", "2-month premier research fellowship under Academy Fellows.", "November annually", "₹12,500/mo + train fare", "IISc, IITs, TIFR", "2nd/3rd Year >65%", "https://web-japps.ias.ac.in/fellowship2024/", "In-person", "research-phd;mtech-gate;foreign-studies-ms", "Academic Rigor;Premier Labs", False, 85),
        ("pmrf-fellowship", "Prime Minister's Research Fellowship (PMRF)", "Ministry of Education (Govt of India)", "Research", "Highest-paying doctoral fellowship in India.", "Bi-annual", "₹70,000-₹80,000/mo", "IITs, IISc, IISERs", "CGPA >= 8.0 or GATE", "https://www.pmrf.in", "In-person", "research-phd;mtech-gate", "Elite Scheme;₹80k/mo", True, 98),
        ("daad-wise", "DAAD WISE Research Internships", "DAAD Germany", "Research", "Funded 2-3 month research at German public universities.", "November annually", "€934/mo + €1,050 travel", "Germany (TUM, RWTH)", "5th/6th Semester B.Tech", "https://www.daad.in", "In-person", "foreign-studies-ms;research-phd", "Germany;Euro Stipend", True, 92),
        ("ieee-acm-src", "ACM / IEEE Student Research Competitions", "ACM & IEEE Computer Society", "Research", "Present original research papers at major global conferences.", "Conference calls", "$500 travel + $500 medal", "Global Venues", "Undergrad members", "https://src.acm.org", "Hybrid", "research-phd;foreign-studies-ms", "Publication;Travel Grant", False, 84),
        ("idex-defence", "iDEX Student Defence Open Challenge", "Ministry of Defence & DIO", "Incubator", "Up to ₹1.5 Crore grant for defence hardware & software.", "Rolling Calls", "Up to ₹1.5 Cr Grant", "Partner TBIs (IITM, SINE)", "Students & MSMEs", "https://idex.gov.in", "Hybrid", "cybersecurity-engineer;mba-tech-mgmt;software-engineer", "Defence Grant;₹1.5 Cr", True, 97),
        ("hult-prize", "Hult Prize Student Enterprise Challenge", "Hult Prize & United Nations", "Incubator", "The Nobel prize for student social entrepreneurs.", "Oct-Dec campus rounds", "$1,000,000 Seed Prize", "Global Accelerator", "Teams of 3-4", "https://www.hultprize.org", "Hybrid", "mba-tech-mgmt;all", "UN Partnered;$1M Seed", True, 95),
        ("nidhi-eir", "DST NIDHI-EIR Scheme", "DST (Govt of India)", "Incubator", "Founder stipend for engineering graduates exploring startups.", "Quarterly intake", "₹30,000/month", "DST Incubators", "Indian Graduates", "https://nidhi-eir.uk/home/", "Hybrid", "mba-tech-mgmt;software-engineer;all", "Founder Stipend;No Equity", False, 89),
        ("yc-startup-school", "Y Combinator Startup School", "Y Combinator", "Incubator", "World-class startup curriculum & founder matching.", "Year-round", "$500,000 batch pipeline", "Online / San Francisco", "Anyone building tech", "https://www.startupschool.org", "Online", "mba-tech-mgmt;software-engineer;ai-ml-engineer", "Silicon Valley;YC", False, 93),
        ("tata-crucible", "Tata Crucible Campus Hackathon", "Tata Sons", "Competition", "Collegiate business strategy and architecture challenge.", "Annual Oct-Dec", "₹2,50,000 + PPIs", "Pan-India / Mumbai", "Full-time students", "https://tatacrucible.com", "Hybrid", "mba-tech-mgmt;software-engineer;all", "Tata Group;Fast-track", False, 87),
    ]

    with open(opps_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["opportunity_id", "title", "organization", "type", "description", "deadline", "stipend_or_prize", "location", "eligibility", "url", "mode", "destinations", "tags", "featured", "trending_score"])
        for op in OPPORTUNITIES:
            writer.writerow(list(op))
    print(f"Wrote {len(OPPORTUNITIES)} opportunities to {opps_csv_path}")

if __name__ == "__main__":
    write_csvs()
