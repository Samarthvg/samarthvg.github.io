// ─────────────────────────────────────────────────────────────
//  All site content lives here. Edit freely — components adapt.
//  Sourced from Samarth_Galchar_Resume_SE.pdf and _CM.pdf.
// ─────────────────────────────────────────────────────────────

export const profile = {
  first: 'Samarth',
  last: 'Galchar',
  roles: ['Software Engineer', 'ML / Gen AI'],
  location: 'Boston, MA',
  status: 'Open to full-time roles',
  // taglineAccent has to appear verbatim in the tagline; Hero splits on it to
  // set the emphasis, and silently renders no emphasis if it does not match.
  tagline:
    'A software engineer who reads the source before the docs and the stack trace before the search bar.',
  taglineAccent: 'the source before the docs',
}

export const links = {
  email: 'galchar.sa@northeastern.edu',
  github: 'https://github.com/Samarthvg',
  linkedin: 'https://www.linkedin.com/in/samarthgalchar',
  // Vite rewrites public-asset URLs in CSS and HTML for you, but not ones
  // written as strings in JS. BASE_URL keeps this right if the site is ever
  // served from a subpath, e.g. a GitHub project page.
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  statement: [
    'Three years shipping production web products, plus a research track in applied machine learning. Most of what I build now sits between the two.',
    'With experience in full-stack web development, REST and microservices, ML pipelines, RAG systems, and computer vision.',
  ],
  specs: [
    { label: 'Education', value: 'M.S. Computer Science, Northeastern University, 2026' },
    { label: 'Before', value: 'B.Tech Computer Engineering, Charotar University' },
    { label: 'Focus', value: 'Full-stack engineering · Applied ML · Generative AI' },
    { label: 'Building', value: 'Web apps · REST & microservices · RAG systems · Vision & ML pipelines' },
    { label: 'Based', value: 'Boston, Massachusetts' },
  ],
}

export const experience = [
  {
    id: 'cognitus',
    company: 'Cognitus',
    role: 'Full Stack Developer Intern',
    period: 'Jul 2025 - Jan 2026',
    location: 'Dallas, TX',
    summary: 'Internal cost-estimation platform used by 50+ staff, built offline-capable.',
    highlights: [
      'Owned the data model for travel costing, one of the product’s primary estimation paths',
      'Resolved production defects and reshaped UI flows across an async Vue.js interface, working from direct stakeholder feedback',
      'Extended Node.js REST endpoints and their persistence layer as new estimation workflows landed',
      'Introduced PouchDB for offline-first storage with sync on reconnect, raising fault tolerance for internal users',
      'Completed an internal Generative AI certification covering LLM-assisted development workflows',
    ],
    stack: ['Vue.js', 'Node.js', 'PouchDB', 'REST'],
  },
  {
    id: 'simform',
    company: 'Simform',
    role: 'Full Stack Developer',
    period: 'Jun 2022 - Aug 2023',
    location: 'Gujarat, India',
    summary: 'Full-stack delivery on client products, interface through to service layer.',
    highlights: [
      'React and Angular front ends built from design wireframes and hardened across browsers',
      'Node.js and MongoDB microservices, decomposed to accelerate REST call processing',
      'Query-level optimisation that held data integrity under load',
      'Code review, version control and CI/CD on a cross-functional Scrum team',
    ],
    stack: ['React.js', 'Angular', 'Node.js', 'MongoDB', 'Bootstrap'],
  },
  {
    id: 'charotar',
    company: 'Charotar University',
    role: 'Machine Learning Research Intern',
    period: 'Apr - Sep 2020',
    location: 'Gujarat, India',
    summary: 'Embedding research into which similarity relationships survive vectorisation.',
    highlights: [
      'Benchmarked Word2Vec (CBOW, Skip-gram) against FastText on syntactic and semantic similarity preservation',
      'Raised syntactic similarity to 0.46 and semantic to 0.38 over the Skip-gram and FastText baselines',
      'Wrote the evaluation pipeline in Python with Gensim and NLTK',
      'Documented experiments and synthesised findings for the group’s NLP publications',
    ],
    stack: ['Python', 'Gensim', 'NLTK', 'NumPy'],
  },
]

export const projects = [
  {
    id: 'ai-thelete',
    index: '01',
    name: 'AI-thelete',
    kicker: 'Retrieval-Augmented Generation',
    tagline: 'A personal gym trainer that actually cites its sources.',
    description:
      'A RAG chatbot on FastAPI and LangChain over the OpenAI API. Retrieval runs against Pinecone with HuggingFace embeddings so answers stay tied to real source material rather than confabulated, and LangGraph checkpointing keeps agent state and prompt versions intact across multi-turn sessions.',
    highlights: [
      'FastAPI + LangChain service over the OpenAI API',
      'LangGraph checkpointing for agent state across multi-turn sessions',
      'Pinecone vector search with HuggingFace embeddings',
      'Dockerised and deployed on GCP, redeployed automatically via GitHub Actions',
    ],
    stack: ['FastAPI', 'LangChain', 'LangGraph', 'Pinecone', 'Docker', 'GCP'],
    visual: 'retrieval',
    github: '',
    demo: '',
  },
  {
    id: 'cmapss',
    index: '02',
    name: 'Remaining Useful Life',
    kicker: 'NASA C-MAPSS · arXiv:2604.27234',
    tagline: 'Telling a turbofan engine how long it has left.',
    description:
      'A benchmark of Ridge Regression, XGBoost, 1D CNN and LSTM across the NASA C-MAPSS FD001 and FD003 subsets, testing raw sensor sequences against hand-crafted engineered features on a physically degrading system.',
    highlights: [
      'LSTM predicting remaining life within ~14-15 cycles of failure, beating prior benchmarks',
      'XGBoost matched to ~13 cycles using engineered features',
      'Temporal dependency established through hidden-state visualisation',
      'Sequence-length sensitivity analysis across both subsets',
    ],
    stack: ['PyTorch', 'Scikit-learn', 'XGBoost', 'Time Series'],
    visual: 'timeseries',
    github: '',
    demo: '',
  },
  {
    id: 'vision',
    index: '03',
    name: 'Deepfake Detection',
    kicker: 'Pattern Recognition & Computer Vision',
    tagline: 'Catching synthetic faces in the frequency domain.',
    description:
      'Generated faces look convincing to an eye and wrong to an FFT. This benchmarks radial 1D spectral models and a spectrally augmented ResNet18 against ResNet50 and VGG16, using log-magnitude and phase features picked for surviving compression. Alongside it: camera calibration, augmented reality and real-time video work in C++ and OpenCV.',
    highlights: [
      '91.3% accuracy on a 140k real-vs-fake dataset under varied lighting and adversarial conditions',
      'FFT log-magnitude and phase features resilient to compression artifacts',
      'Camera calibration and augmented reality, plus real-time video special effects',
      'Real-time 2D object recognition under per-frame latency constraints',
      'Content-based image retrieval with feature descriptors, and recognition with deep networks',
    ],
    stack: ['PyTorch', 'OpenCV', 'C++', 'FFT'],
    visual: 'vision',
    github: '',
    demo: '',
  },
  {
    id: 'music',
    index: '04',
    name: 'Music Transcription',
    kicker: 'Source Separation · arXiv:2412.06703',
    tagline: 'Turning piano recordings back into notes.',
    description:
      'Onset detection from spectrogram features on the Maestro dataset. Most frames in a recording contain no note at all, so the interesting problem was the imbalance rather than the classifier. A custom focal loss did more for recall than any architecture change.',
    highlights: [
      'Onset detection from spectrogram features on the Maestro dataset',
      '73% accuracy on note onset classification',
      'Custom focal loss correcting class imbalance',
      'Recall improved 34% over the baseline',
    ],
    stack: ['TensorFlow', 'Librosa', 'Python'],
    visual: 'audio',
    github: '',
    demo: '',
  },
  {
    id: 'kanbas',
    index: '05',
    name: 'Kanbas LMS',
    kicker: 'MERN · Full Stack',
    tagline: 'A learning platform where the access control is real.',
    description:
      'A learning management system on the MERN stack, with REST APIs, role-based authentication and S3-backed course assets. The quiz rules are enforced server-side per role, because access control that only exists in the UI is decoration.',
    highlights: [
      'RESTful API layer with role-based authentication',
      'AWS S3 storage for course assets',
      'Quiz functionality with conditional access enforced server-side',
      'MongoDB data model covering courses, enrolment and submissions',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3'],
    visual: 'system',
    github: '',
    demo: '',
  },
  {
    id: 'portfolio-sim',
    index: '06',
    name: 'Portfolio Simulator',
    kicker: 'Core Java · MVC',
    tagline: 'A hundred stock portfolios, no framework in sight.',
    description:
      'A Java desktop application managing 100+ portfolios, built on MVC and classic object-oriented design patterns. Real-time quotes come from Alpha Vantage, which meant budgeting requests carefully enough to keep 25 tickers current inside a hard rate limit.',
    highlights: [
      'MVC architecture and object-oriented design patterns throughout',
      'Alpha Vantage integration handling call limits across 25 tickers',
      'Portfolio performance metrics computed from historical quotes',
      'Packaged as an executable cross-platform JAR',
    ],
    stack: ['Java', 'Swing', 'MVC', 'Alpha Vantage'],
    visual: 'market',
    github: '',
    demo: '',
  },
]

export const skills = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'C++', 'C#', 'SQL'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'Bootstrap'],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'Express', 'FastAPI', 'REST APIs', 'Microservices'],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    items: [
      'PyTorch',
      'TensorFlow',
      'Scikit-learn',
      'LangChain',
      'LangGraph',
      'HuggingFace',
      'OpenCV',
      'RAG',
    ],
  },
  {
    id: 'data',
    label: 'Data',
    items: ['pandas', 'NumPy', 'SciPy', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
  },
  {
    id: 'cloud',
    label: 'Cloud & Tools',
    items: ['AWS', 'GCP', 'Docker', 'Git', 'GitHub Actions', 'Pinecone'],
  },
]

export const offTheClock = {
  onLoop: ['King Crimson', 'Nujabes'],
  learning: 'Currently working out Low-Rank Adaptation in stable diffusion.',
  dota: { hours: 10000, label: 'hours in Dota 2' },
}
