/**
 * JobNest - Initial Seed Data
 * Contains realistic default companies, job postings, demo user profiles,
 * and initial application history.
 */

const INITIAL_COMPANIES = [
  {
    id: "comp-1",
    name: "Tata Consultancy Services (TCS)",
    logo: "TCS",
    logoBg: "#0f4c81",
    industry: "IT Services & Consulting",
    location: "Mumbai, Maharashtra",
    size: "500,000+ Employees",
    website: "https://www.tcs.com",
    description: "Tata Consultancy Services is an IT services, consulting and business solutions organization that has been partnering with many of the world's largest businesses in their transformation journeys for over 50 years.",
    founded: 1968,
    verified: true,
    rating: 4.2
  },
  {
    id: "comp-2",
    name: "Infosys",
    logo: "INF",
    logoBg: "#007cc3",
    industry: "IT Services & Consulting",
    location: "Bengaluru, Karnataka",
    size: "300,000+ Employees",
    website: "https://www.infosys.com",
    description: "Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 56 countries to navigate their digital transformation.",
    founded: 1981,
    verified: true,
    rating: 4.1
  },
  {
    id: "comp-3",
    name: "Accenture",
    logo: "ACN",
    logoBg: "#7a1fa2",
    industry: "Consulting & Technology",
    location: "Hyderabad, Telangana",
    size: "700,000+ Employees",
    website: "https://www.accenture.com",
    description: "Accenture is a leading global professional services company, providing a broad range of services in strategy and consulting, interactive, technology and operations.",
    founded: 1989,
    verified: true,
    rating: 4.3
  },
  {
    id: "comp-4",
    name: "Wipro",
    logo: "WIP",
    logoBg: "#2e7d32",
    industry: "Information Technology",
    location: "Bengaluru, Karnataka",
    size: "250,000+ Employees",
    website: "https://www.wipro.com",
    description: "Wipro is a leading global information technology, consulting and business process services company. We harness cognitive computing, hyper-automation, and cloud.",
    founded: 1945,
    verified: true,
    rating: 4.0
  },
  {
    id: "comp-5",
    name: "Google India",
    logo: "GOO",
    logoBg: "#ea4335",
    industry: "Internet & Technology",
    location: "Gurugram, Haryana",
    size: "150,000+ Employees",
    website: "https://about.google",
    description: "Google's mission is to organize the world's information and make it universally accessible and useful through world-class software and infrastructure.",
    founded: 1998,
    verified: true,
    rating: 4.7
  },
  {
    id: "comp-6",
    name: "Microsoft India",
    logo: "MSF",
    logoBg: "#0288d1",
    industry: "Software & Cloud",
    location: "Noida, Uttar Pradesh",
    size: "200,000+ Employees",
    website: "https://www.microsoft.com",
    description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and organization to achieve more.",
    founded: 1975,
    verified: true,
    rating: 4.6
  },
  {
    id: "comp-7",
    name: "Amazon Development Center",
    logo: "AMZ",
    logoBg: "#f57c00",
    industry: "E-Commerce & Cloud",
    location: "Hyderabad, Telangana",
    size: "1,000,000+ Employees",
    website: "https://amazon.jobs",
    description: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
    founded: 1994,
    verified: true,
    rating: 4.3
  },
  {
    id: "comp-8",
    name: "Razorpay",
    logo: "RZP",
    logoBg: "#1565c0",
    industry: "Fintech",
    location: "Bengaluru, Karnataka",
    size: "3,500+ Employees",
    website: "https://razorpay.com",
    description: "Razorpay is India's first full-stack financial solutions company helping online merchants accept payments, disburse payouts, and manage neo-banking workflows.",
    founded: 2014,
    verified: true,
    rating: 4.5
  }
];

const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Python Developer",
    companyId: "comp-1",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "TCS",
    logoBg: "#0f4c81",
    location: "Mumbai, Maharashtra",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Junior",
    category: "Software Development",
    minSalary: 600000,
    maxSalary: 950000,
    salaryText: "₹6,00,000 - ₹9,50,000 / yr",
    postedDate: "2026-10-10",
    featured: true,
    deadline: "2026-11-20",
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Docker"],
    description: "We are seeking a talented Python Developer to join our enterprise solutions engineering team. You will be responsible for designing and deploying high-performance web services and automated data workflows.",
    responsibilities: [
      "Develop robust backend microservices with Python and Django / FastAPI.",
      "Integrate SQL databases and write optimized ORM queries.",
      "Collaborate with frontend engineers, QA, and product managers.",
      "Write automated unit tests and participate in code reviews.",
      "Maintain CI/CD pipeline deployments using Docker and GitHub Actions."
    ],
    qualifications: [
      "Bachelor's degree in Computer Science, IT, or related technical field.",
      "1-3 years of hands-on Python development experience.",
      "Strong understanding of object-oriented programming and RESTful standards.",
      "Familiarity with Git version control and relational databases (PostgreSQL/MySQL)."
    ],
    benefits: [
      "Comprehensive medical insurance for employee and immediate family.",
      "Flexible hybrid working schedule (2 days remote per week).",
      "Annual performance bonus and career development certifications.",
      "Generous paid time off and wellness leave."
    ],
    employerId: "emp-1"
  },
  {
    id: "job-2",
    title: "Web Developer (Frontend / Vanilla JS & React)",
    companyId: "comp-2",
    companyName: "Infosys",
    companyLogo: "INF",
    logoBg: "#007cc3",
    location: "Bengaluru, Karnataka",
    workMode: "On-site",
    jobType: "Full-Time",
    experienceLevel: "Mid-Level",
    category: "Software Development",
    minSalary: 850000,
    maxSalary: 1400000,
    salaryText: "₹8,50,000 - ₹14,00,000 / yr",
    postedDate: "2026-10-11",
    featured: true,
    deadline: "2026-11-25",
    skills: ["JavaScript", "HTML5", "CSS3", "React", "TypeScript", "Responsive Design"],
    description: "Infosys is looking for a passionate Web Developer who loves building high-traffic, accessible web interfaces. You will craft pixel-perfect user experiences across multiple devices.",
    responsibilities: [
      "Build modular, responsive UI components using modern HTML5, CSS3, and modern JavaScript.",
      "Ensure web performance optimization, fast load times, and cross-browser compatibility.",
      "Translate Figma / Adobe XD designs into accessible, interactive user journeys.",
      "Collaborate with backend developers to integrate REST and GraphQL endpoints.",
      "Champion web accessibility (WCAG 2.1 AA) and web standards."
    ],
    qualifications: [
      "2-5 years of professional frontend web development experience.",
      "Deep expertise in core JavaScript (ES6+), DOM APIs, CSS Grid & Flexbox.",
      "Experience with modern build tooling and component-driven architecture.",
      "Demonstrated portfolio of responsive web applications."
    ],
    benefits: [
      "Transport facility & on-campus sports recreation complexes.",
      "Health & life insurance coverage.",
      "Higher education sponsorship and certifications.",
      "Parental leaves and childcare support facilities."
    ],
    employerId: "emp-2"
  },
  {
    id: "job-3",
    title: "Software Engineer",
    companyId: "comp-3",
    companyName: "Accenture",
    companyLogo: "ACN",
    logoBg: "#7a1fa2",
    location: "Hyderabad, Telangana",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Junior",
    category: "Software Development",
    minSalary: 700000,
    maxSalary: 1100000,
    salaryText: "₹7,00,000 - ₹11,00,000 / yr",
    postedDate: "2026-10-12",
    featured: true,
    deadline: "2026-11-28",
    skills: ["Java", "Spring Boot", "Microservices", "SQL", "Git", "Kafka"],
    description: "Join Accenture's Technology Delivery group to design, build, and deploy enterprise-grade microservice platforms for Fortune 500 financial and healthcare institutions.",
    responsibilities: [
      "Design clean and maintainable backend APIs using Java and Spring Boot.",
      "Participate in agile ceremonies, sprint planning, and architectural reviews.",
      "Optimize SQL database performance and implement caching strategies.",
      "Ensure security best practices for API endpoints and data storage."
    ],
    qualifications: [
      "B.E./B.Tech/MCA in Computer Science or related degree.",
      "1-3 years of programming experience in Java.",
      "Familiarity with Spring Framework, REST APIs, and relational databases.",
      "Strong analytical and problem-solving abilities."
    ],
    benefits: [
      "Hybrid work flexibility and ergonomic work-from-home allowance.",
      "Comprehensive medical, dental, and vision insurance.",
      "Accenture employee stock purchase plan (ESPP).",
      "Mentorship programs and international mobility opportunities."
    ],
    employerId: "emp-3"
  },
  {
    id: "job-4",
    title: "Data Analyst",
    companyId: "comp-4",
    companyName: "Wipro",
    companyLogo: "WIP",
    logoBg: "#2e7d32",
    location: "Bengaluru, Karnataka",
    workMode: "On-site",
    jobType: "Full-Time",
    experienceLevel: "Fresher",
    category: "Data & Analytics",
    minSalary: 450000,
    maxSalary: 700000,
    salaryText: "₹4,50,000 - ₹7,00,000 / yr",
    postedDate: "2026-10-09",
    featured: true,
    deadline: "2026-11-18",
    skills: ["SQL", "Python", "PowerBI", "Excel", "Data Visualization", "Statistics"],
    description: "Kickstart your analytics career with Wipro! We are hiring entry-level and junior Data Analysts to turn large multi-source datasets into actionable operational dashboards.",
    responsibilities: [
      "Extract and clean data from diverse relational and warehouse databases using SQL.",
      "Build insightful visual reports and dashboards using PowerBI and Tableau.",
      "Conduct exploratory data analysis to identify trends and operational bottlenecks.",
      "Present findings clearly to internal stakeholders and client leads."
    ],
    qualifications: [
      "Graduate in Mathematics, Statistics, Computer Science, Economics or related fields.",
      "Fresher or up to 1 year of experience with SQL and data visualization tools.",
      "Proficient in Microsoft Excel (VLOOKUP, Pivot Tables, Macros).",
      "Eager to learn modern cloud data platforms."
    ],
    benefits: [
      "Structured onboarding and 6-month industry analytics training program.",
      "Subsidized cafeteria and shuttle services.",
      "Health insurance and annual health checkups.",
      "Clear promotional ladder to Senior Analyst positions."
    ],
    employerId: "emp-4"
  },
  {
    id: "job-5",
    title: "Cloud Solutions Architect",
    companyId: "comp-5",
    companyName: "Google India",
    companyLogo: "GOO",
    logoBg: "#ea4335",
    location: "Gurugram, Haryana",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Senior",
    category: "Cloud & DevOps",
    minSalary: 2800000,
    maxSalary: 4200000,
    salaryText: "₹28,00,000 - ₹42,00,000 / yr",
    postedDate: "2026-10-13",
    featured: true,
    deadline: "2026-12-05",
    skills: ["GCP", "Kubernetes", "Terraform", "Distributed Systems", "Cloud Security"],
    description: "Google Cloud is looking for an experienced Solutions Architect to collaborate with enterprise customers in architecting scalable, resilient, and secure cloud platforms.",
    responsibilities: [
      "Partner with technical decision-makers to design multi-region cloud architectures.",
      "Provide guidance on migration, modernization, containerization, and data architectures.",
      "Author reference architectures, technical whitepapers, and best practice blueprints.",
      "Serve as trusted advisor to CTOs and VP of Engineering teams."
    ],
    qualifications: [
      "7+ years of architecture or engineering leadership in cloud computing.",
      "Hands-on expertise with Kubernetes, cloud networking, and infrastructure as code.",
      "Relevant cloud certifications (Google Cloud Professional Architect preferred).",
      "Exceptional communication and stakeholder management skills."
    ],
    benefits: [
      "Top-tier competitive salary with Google stock units (GSUs).",
      "Free gourmet meals, micro-kitchens, and wellness centers.",
      "Extensive health, life, and disability coverage.",
      "Generous sabbatical policies and education reimbursement."
    ],
    employerId: "emp-5"
  },
  {
    id: "job-6",
    title: "UI/UX Product Designer",
    companyId: "comp-6",
    companyName: "Microsoft India",
    companyLogo: "MSF",
    logoBg: "#0288d1",
    location: "Noida, Uttar Pradesh",
    workMode: "Remote",
    jobType: "Full-Time",
    experienceLevel: "Mid-Level",
    category: "Design & Creative",
    minSalary: 1600000,
    maxSalary: 2400000,
    salaryText: "₹16,00,000 - ₹24,00,000 / yr",
    postedDate: "2026-10-08",
    featured: false,
    deadline: "2026-11-30",
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping", "Accessibility"],
    description: "Join the Microsoft Experience Design group to build empathetic, scalable design patterns for productivity tools used by hundreds of millions of users worldwide.",
    responsibilities: [
      "Lead user-centered product design from discovery and wireframes to high-fidelity prototypes.",
      "Conduct usability tests, interviews, and synthesize qualitative feedback.",
      "Contribute to Microsoft's Fluent Design System components.",
      "Partner closely with product managers and front-end engineers during implementation."
    ],
    qualifications: [
      "3-6 years of experience designing complex web or enterprise software applications.",
      "Stunning portfolio exhibiting end-to-end UX rationale and polished visual design.",
      "Mastery of Figma, component libraries, and interactive prototyping.",
      "Strong understanding of WCAG accessibility standards."
    ],
    benefits: [
      "100% remote work flexibility with home office stipend.",
      "Microsoft employee stock purchase program.",
      "Comprehensive family healthcare coverage.",
      "Annual wellness reimbursement of ₹60,000."
    ],
    employerId: "emp-6"
  },
  {
    id: "job-7",
    title: "DevOps Engineer (AWS / Kubernetes)",
    companyId: "comp-7",
    companyName: "Amazon Development Center",
    companyLogo: "AMZ",
    logoBg: "#f57c00",
    location: "Hyderabad, Telangana",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Mid-Level",
    category: "Cloud & DevOps",
    minSalary: 1800000,
    maxSalary: 2600000,
    salaryText: "₹18,00,000 - ₹26,00,000 / yr",
    postedDate: "2026-10-07",
    featured: false,
    deadline: "2026-11-22",
    skills: ["AWS", "Kubernetes", "CI/CD", "Terraform", "Python", "Prometheus"],
    description: "Amazon is looking for a DevOps Engineer to automate build, testing, and continuous delivery systems powering tier-1 retail ordering and logistics platforms.",
    responsibilities: [
      "Maintain automated infrastructure provisioning using Terraform and CloudFormation.",
      "Manage multi-cluster Kubernetes deployments with zero downtime updates.",
      "Build real-time monitoring and alerting using Prometheus, Grafana, and CloudWatch.",
      "Automate security vulnerability scanning and patch management."
    ],
    qualifications: [
      "3-5 years of dedicated DevOps or Site Reliability Engineering experience.",
      "Strong Linux systems administration and scripting (Bash / Python).",
      "Production experience running containers in Kubernetes (EKS).",
      "Knowledge of network security, VPCs, and IAM policies."
    ],
    benefits: [
      "Competitive base pay + Amazon restricted stock units.",
      "World-class health and dental insurance.",
      "Parental leaves and employee discounts.",
      "Relocation support for outstation candidates."
    ],
    employerId: "emp-7"
  },
  {
    id: "job-8",
    title: "Full Stack Engineer (Node.js & React)",
    companyId: "comp-8",
    companyName: "Razorpay",
    companyLogo: "RZP",
    logoBg: "#1565c0",
    location: "Bengaluru, Karnataka",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Mid-Level",
    category: "Software Development",
    minSalary: 1500000,
    maxSalary: 2200000,
    salaryText: "₹15,00,000 - ₹22,00,000 / yr",
    postedDate: "2026-10-12",
    featured: true,
    deadline: "2026-11-26",
    skills: ["Node.js", "React", "TypeScript", "PostgreSQL", "Redis", "Kafka"],
    description: "Razorpay's Payment Gateway team is looking for a Full Stack Engineer to architect high-throughput payment flow checkouts handling 10,000+ requests per second.",
    responsibilities: [
      "Build developer-friendly APIs and high-availability microservices.",
      "Develop responsive and resilient checkout interfaces for millions of consumers.",
      "Optimize database queries, distributed caches, and event streaming queues.",
      "Participate in high-severity incident resolution and on-call rotations."
    ],
    qualifications: [
      "2-5 years of full-stack product engineering experience.",
      "Deep understanding of JavaScript/TypeScript across client and server.",
      "Hands-on experience with SQL, Redis, and event brokers like Kafka/RabbitMQ.",
      "Obsession with performance, security, and developer ergonomics."
    ],
    benefits: [
      "Lucrative ESOPs package with flexible vesting options.",
      "Unlimited paid leave policy with mandatory unplug days.",
      "Full family medical coverage including parents.",
      "Annual learning and books allowance."
    ],
    employerId: "emp-8"
  },
  {
    id: "job-9",
    title: "Junior Frontend Intern",
    companyId: "comp-2",
    companyName: "Infosys",
    companyLogo: "INF",
    logoBg: "#007cc3",
    location: "Bengaluru, Karnataka",
    workMode: "Remote",
    jobType: "Internship",
    experienceLevel: "Fresher",
    category: "Software Development",
    minSalary: 250000,
    maxSalary: 350000,
    salaryText: "₹25,000 - ₹35,000 / month",
    postedDate: "2026-10-13",
    featured: false,
    deadline: "2026-11-15",
    skills: ["HTML5", "CSS3", "JavaScript", "Git", "Responsive Web"],
    description: "6-month paid internship opportunity for recent graduates and final-year students eager to learn enterprise frontend standards and modern web engineering.",
    responsibilities: [
      "Implement UI components according to design wireframes.",
      "Fix UI layout bugs and test compatibility across Safari, Chrome, and Firefox.",
      "Assist in writing technical documentation and component storybooks.",
      "Learn and apply clean code practices under senior engineering mentors."
    ],
    qualifications: [
      "Pursuing or recently completed degree in Computer Science or self-taught web dev.",
      "Solid understanding of HTML5, CSS3, and modern JavaScript basics.",
      "Basic familiarity with Git.",
      "Strong desire to learn and receive constructive code review feedback."
    ],
    benefits: [
      "Monthly stipend of ₹30,000.",
      "Full-time job offer (PPO) upon successful completion of internship.",
      "Mentorship from veteran architects.",
      "Certificate of excellence and official experience letter."
    ],
    employerId: "emp-2"
  },
  {
    id: "job-10",
    title: "Technical Content & Digital Marketing Specialist",
    companyId: "comp-3",
    companyName: "Accenture",
    companyLogo: "ACN",
    logoBg: "#7a1fa2",
    location: "Mumbai, Maharashtra",
    workMode: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Junior",
    category: "Marketing & Sales",
    minSalary: 600000,
    maxSalary: 900000,
    salaryText: "₹6,00,000 - ₹9,00,000 / yr",
    postedDate: "2026-10-06",
    featured: false,
    deadline: "2026-11-15",
    skills: ["SEO", "Content Strategy", "Google Analytics", "Social Media", "Copywriting"],
    description: "Shape the digital narrative of Accenture's innovation campaigns across social, search, and whitepaper syndication channels.",
    responsibilities: [
      "Draft high-impact technical articles, case studies, and social posts.",
      "Execute organic SEO audits, keyword research, and on-page optimizations.",
      "Track web traffic, conversion funnels, and prepare monthly performance metrics.",
      "Manage webinar outreach and digital newsletter campaigns."
    ],
    qualifications: [
      "1-3 years of digital marketing, content writing, or SEO experience.",
      "Superb English written and verbal communication.",
      "Experience with Google Analytics, Semrush, or Ahrefs.",
      "Passion for emerging technologies (AI, Cloud, Cybersecurity)."
    ],
    benefits: [
      "Flexible working arrangements.",
      "Healthcare insurance.",
      "Skill development budget for digital marketing certifications.",
      "Collaborative and diverse global work environment."
    ],
    employerId: "emp-3"
  },
  {
    id: "job-11",
    title: "Senior Product Manager (Fintech)",
    companyId: "comp-8",
    companyName: "Razorpay",
    companyLogo: "RZP",
    logoBg: "#1565c0",
    location: "Bengaluru, Karnataka",
    workMode: "On-site",
    jobType: "Full-Time",
    experienceLevel: "Senior",
    category: "Product Management",
    minSalary: 3000000,
    maxSalary: 4500000,
    salaryText: "₹30,00,000 - ₹45,00,000 / yr",
    postedDate: "2026-10-05",
    featured: false,
    deadline: "2026-12-01",
    skills: ["Product Strategy", "Fintech", "Agile", "Roadmapping", "Data Analysis", "User Research"],
    description: "Own the roadmap and execution of next-generation recurring payments and merchant onboarding systems at Razorpay.",
    responsibilities: [
      "Define multi-quarter product vision and measurable quarterly OKRs.",
      "Engage directly with merchant CTOs and finance heads to uncover pain points.",
      "Lead cross-functional squads of engineers, designers, and compliance officers.",
      "Monitor conversion metrics, drop-off funnels, and regulatory compliance requirements."
    ],
    qualifications: [
      "5+ years of software product management experience, preferably in payments or banking.",
      "Demonstrated track record of launching successful consumer or B2B SaaS products.",
      "Strong technical literacy — able to discuss APIs and system architecture.",
      "Master's degree or MBA is a plus, but practical experience counts most."
    ],
    benefits: [
      "Executive compensation package with significant equity.",
      "Premium family health coverage.",
      "Leadership coaching and executive education.",
      "Relocation package."
    ],
    employerId: "emp-8"
  },
  {
    id: "job-12",
    title: "Cybersecurity Analyst",
    companyId: "comp-1",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "TCS",
    logoBg: "#0f4c81",
    location: "Pune, Maharashtra",
    workMode: "Hybrid",
    jobType: "Contract",
    experienceLevel: "Mid-Level",
    category: "Cloud & DevOps",
    minSalary: 1100000,
    maxSalary: 1600000,
    salaryText: "₹11,00,000 - ₹16,00,000 / yr",
    postedDate: "2026-10-11",
    featured: false,
    deadline: "2026-11-20",
    skills: ["SIEM", "Network Security", "Vulnerability Assessment", "SOC", "Python"],
    description: "TCS Cyber Defense Operations is recruiting a Cybersecurity Analyst for our Security Operations Center (SOC) managing incident triage and threat hunting.",
    responsibilities: [
      "Monitor security event logs (SIEM) and investigate anomalous behaviors.",
      "Perform periodic vulnerability scans and verify remediation with infrastructure teams.",
      "Execute incident response playbooks during potential security incidents.",
      "Automate repetitive alert validation scripts using Python."
    ],
    qualifications: [
      "2-4 years of experience in SOC or cybersecurity analysis.",
      "Familiarity with Splunk, QRadar, or Sentinel.",
      "Certifications such as CEH, Security+, or CySA+ preferred.",
      "Solid understanding of TCP/IP, firewalls, and encryption standards."
    ],
    benefits: [
      "Attractive contract retention bonus.",
      "Shift allowances and overtime compensation.",
      "Opportunity for permanent absorption based on performance.",
      "Medical insurance coverage."
    ],
    employerId: "emp-1"
  }
];

const INITIAL_USERS = [
  {
    id: "seeker-1",
    name: "Aarav Sharma",
    email: "seeker@demo.com",
    password: "password123",
    role: "seeker",
    phone: "+91 9876543210",
    title: "Frontend & Full Stack Developer",
    location: "Bengaluru, Karnataka",
    bio: "Passionate developer with 2+ years of experience building accessible, responsive, and performance-oriented web applications. Dedicated to semantic web design and clean code.",
    skills: ["JavaScript", "HTML5", "CSS3", "React", "Python", "Git", "REST APIs", "SQL"],
    experience: [
      {
        title: "Junior Web Developer",
        company: "TechSolutions Pvt Ltd",
        duration: "Jan 2025 - Present",
        location: "Bengaluru, India",
        description: "Built responsive client portals, migrated legacy stylesheets to modern CSS variables, and improved Lighthouse scores by 25%."
      },
      {
        title: "Frontend Engineering Intern",
        company: "AppVibe Labs",
        duration: "May 2024 - Dec 2024",
        location: "Remote",
        description: "Collaborated in an agile team of 5 engineers to deliver 15+ reusable UI components with 100% responsive cross-device support."
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science and Engineering",
        institution: "National Institute of Technology Karnataka",
        year: "2020 - 2024",
        grade: "8.6 CGPA"
      }
    ],
    resume: {
      fileName: "Aarav_Sharma_FullStack_Resume.pdf",
      fileSize: "1.4 MB",
      uploadDate: "2026-10-01",
      previewText: "Aarav Sharma - Full Stack Developer | Phone: +91 9876543210 | Email: seeker@demo.com | GitHub: github.com/aarav-sharma | Skills: HTML5, CSS3, JavaScript, Python, SQL"
    }
  },
  {
    id: "emp-1",
    name: "Priya Patel",
    email: "employer@demo.com",
    password: "password123",
    role: "employer",
    phone: "+91 9123456789",
    companyName: "Tata Consultancy Services (TCS)",
    companyId: "comp-1",
    position: "Senior Technical Talent Acquisition Lead",
    location: "Mumbai, Maharashtra",
    bio: "Recruiting passionate engineering talent for enterprise digital transformation and cloud projects worldwide."
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Python Developer",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "TCS",
    logoBg: "#0f4c81",
    location: "Mumbai, Maharashtra",
    seekerId: "seeker-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "seeker@demo.com",
    applicantPhone: "+91 9876543210",
    coverNote: "I have 2+ years of experience with Python backend scripting and full-stack web integration. I would love to contribute to TCS enterprise projects.",
    resumeName: "Aarav_Sharma_FullStack_Resume.pdf",
    appliedDate: "2026-10-11",
    status: "Shortlisted",
    employerId: "emp-1"
  },
  {
    id: "app-2",
    jobId: "job-12",
    jobTitle: "Cybersecurity Analyst",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "TCS",
    logoBg: "#0f4c81",
    location: "Pune, Maharashtra",
    seekerId: "seeker-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "seeker@demo.com",
    applicantPhone: "+91 9876543210",
    coverNote: "Eager to apply my scripting skills and network security fundamentals to the SOC defense team.",
    resumeName: "Aarav_Sharma_FullStack_Resume.pdf",
    appliedDate: "2026-10-12",
    status: "Under Review",
    employerId: "emp-1"
  },
  {
    id: "app-3",
    jobId: "job-2",
    jobTitle: "Web Developer (Frontend / Vanilla JS & React)",
    companyName: "Infosys",
    companyLogo: "INF",
    logoBg: "#007cc3",
    location: "Bengaluru, Karnataka",
    seekerId: "seeker-1",
    applicantName: "Aarav Sharma",
    applicantEmail: "seeker@demo.com",
    applicantPhone: "+91 9876543210",
    coverNote: "My strong background in modern responsive UI, semantic HTML, and JavaScript makes me a great fit for the Web Developer position at Infosys.",
    resumeName: "Aarav_Sharma_FullStack_Resume.pdf",
    appliedDate: "2026-10-13",
    status: "Applied",
    employerId: "emp-2"
  }
];

const INITIAL_SAVED_JOBS = ["job-2", "job-5"];

const INITIAL_CONTACT_MESSAGES = [
  {
    id: "msg-1",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    subject: "Partnership Query for Enterprise Hiring",
    message: "Hello JobNest team, we are interested in bulk hiring solutions for our upcoming tech campus. Please let us know the enterprise plan details.",
    date: "2026-10-12",
    status: "Read"
  }
];
