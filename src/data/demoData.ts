import {
  UserProfile,
  SkillDetail,
  RoadmapPhase,
  StudyTask,
  Project,
  JobOpportunity,
  ApplicationItem,
  DailyChallenge,
  ReminderItem,
} from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Alex Chen',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  year: '3rd Year (6th Sem)',
  graduationYear: '2026',
  targetRole: 'Machine Learning Engineer',
  roleSuitability: [
    { role: 'Machine Learning Engineer', score: 88, matchReason: 'Strong math intuition, Python fluency, interest in model training and data preprocessing.' },
    { role: 'Data Scientist', score: 82, matchReason: 'High statistics aptitude and SQL capability; good analytical problem solving.' },
    { role: 'Full Stack Developer', score: 71, matchReason: 'Solid JavaScript and basic React experience, but prefers backend/data workflows.' },
    { role: 'Software Developer', score: 79, matchReason: 'Strong algorithmic fundamentals and OOP understanding.' },
  ],
  overallReadiness: 64,
  skillReadiness: {
    technical: 68,
    coding: 60,
    aptitude: 75,
    communication: 65,
    interview: 58,
    project: 72,
    resume: 70,
    roleSpecific: 62,
  },
  streak: {
    currentDays: 7,
    bestDays: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    restDaysLeft: 2,
    codingStreak: 5,
    interviewStreak: 3,
    quizStreak: 7,
  },
  xp: 1420,
  level: 4,
  studyPreferences: {
    hoursPerDay: 2.5,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    preferredTime: 'Evening',
    placementDeadline: '2026-11-15',
    workload: 'Moderate',
  },
  isOnboarded: true,
};

export const initialSkills: SkillDetail[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'core_cs',
    currentLevel: 48,
    targetLevel: 80,
    gap: 32,
    priority: 'High',
    recommendation: 'Practice Dynamic Programming, Two Pointers, and Binary Trees for 40 mins daily.',
    whyItMatters: 'Every tier-1 and product-based hiring drive conducts a mandatory DSA screening round (70%+ weightage).',
  },
  {
    id: 'python',
    name: 'Python for ML & Systems',
    category: 'programming',
    currentLevel: 82,
    targetLevel: 85,
    gap: 3,
    priority: 'Low',
    recommendation: 'Keep active with memory management, generators, and decorators.',
    whyItMatters: 'Core scripting and prototyping language required across all ML and backend pipelines.',
  },
  {
    id: 'sql',
    name: 'SQL & Database Design',
    category: 'core_cs',
    currentLevel: 62,
    targetLevel: 85,
    gap: 23,
    priority: 'High',
    recommendation: 'Master window functions (ROW_NUMBER, DENSE_RANK), indexing, and query optimization.',
    whyItMatters: 'Data querying is heavily tested in technical interviews for data, ML, and backend positions.',
  },
  {
    id: 'ml_core',
    name: 'Machine Learning Fundamentals',
    category: 'role_specific',
    currentLevel: 65,
    targetLevel: 85,
    gap: 20,
    priority: 'High',
    recommendation: 'Study bias-variance trade-off, regularizations (L1/L2), and model evaluation metrics (ROC-AUC, F1).',
    whyItMatters: 'Direct interview questions probe mathematical understanding behind common models rather than just library calls.',
  },
  {
    id: 'deep_learning',
    name: 'Deep Learning & Neural Networks',
    category: 'role_specific',
    currentLevel: 45,
    targetLevel: 75,
    gap: 30,
    priority: 'Medium',
    recommendation: 'Understand backpropagation math, CNN architectures, and Transformer attention mechanisms.',
    whyItMatters: 'Crucial differentiator for high-package AI/ML campus roles.',
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming (OOP)',
    category: 'core_cs',
    currentLevel: 74,
    targetLevel: 85,
    gap: 11,
    priority: 'Medium',
    recommendation: 'Practice explaining Polymorphism vs Abstraction with production code examples.',
    whyItMatters: 'Standard technical interview screening question in technical rounds.',
  },
  {
    id: 'os_networks',
    name: 'Operating Systems & Networks',
    category: 'core_cs',
    currentLevel: 55,
    targetLevel: 75,
    gap: 20,
    priority: 'Medium',
    recommendation: 'Review Process Scheduling, Virtual Memory, Deadlocks, and TCP vs UDP handshake.',
    whyItMatters: 'Asked in almost every campus placement technical round by service and product firms.',
  },
  {
    id: 'communication',
    name: 'Communication & Pitching',
    category: 'soft_skills',
    currentLevel: 64,
    targetLevel: 85,
    gap: 21,
    priority: 'High',
    recommendation: 'Practice 60-second technical explanations and eliminate filler words like "basically" and "um".',
    whyItMatters: 'Clear verbal explanation separates candidates who code well from those who get hired.',
  },
  {
    id: 'interview_conf',
    name: 'Mock Interview Confidence',
    category: 'soft_skills',
    currentLevel: 58,
    targetLevel: 80,
    gap: 22,
    priority: 'High',
    recommendation: 'Take 2 simulated AI mock interviews weekly using STAR response framing.',
    whyItMatters: 'Translates theoretical knowledge into confident articulation under pressure.',
  },
  {
    id: 'aptitude',
    name: 'Quantitative Aptitude & Logic',
    category: 'aptitude',
    currentLevel: 76,
    targetLevel: 85,
    gap: 9,
    priority: 'Low',
    recommendation: 'Solve 5 quick puzzles and speed-math questions every weekend.',
    whyItMatters: 'Required to clear round 1 online assessment (OA) cutoffs.',
  },
];

export const initialRoadmapPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'Foundational Programming & Mathematics',
    description: 'Establish rock-solid programming syntax, core data structures, and mathematical prerequisites.',
    duration: 'Weeks 1-3',
    topics: [
      {
        id: 'p1-t1',
        title: 'Python Mastery & NumPy Vectorization',
        duration: '4 Days',
        whyItMatters: 'Vectorized calculations run 50x faster than loops in numerical pipelines.',
        explanation: 'Understand how NumPy arrays store contiguous blocks of memory, avoiding the overhead of Python object pointers. Master slicing, broadcasting rules, and boolean masking.',
        codeExample: `import numpy as np\n# Fast vectorized operation vs slow python loop\narr = np.random.rand(1000000)\nnormalized = (arr - np.mean(arr)) / np.std(arr)`,
        keyInterviewQuestions: [
          'What is NumPy broadcasting and what are the dimensional compatibility rules?',
          'Why is vectorization faster than iterating over Python lists?',
          'What is the difference between view and copy in NumPy arrays?'
        ],
        miniChallenge: 'Write a vectorized function to compute the Euclidean distance matrix between two 2D arrays without for-loops.',
        quizQuestion: {
          question: 'What happens when you add a 1D NumPy array of shape (3,) to a 2D array of shape (2, 3)?',
          options: [
            'ValueError: shapes do not match',
            'Broadcasting expands the 1D array across both rows and adds element-wise',
            'Only the first row is added',
            'It creates a 3D tensor'
          ],
          correctIndex: 1,
          explanation: 'NumPy broadcasting matches trailing dimensions and automatically stretches dimensions of size 1 across larger dimensions.',
        },
        completed: true,
      },
      {
        id: 'p1-t2',
        title: 'Core Data Structures: Arrays, HashMaps & Two Pointers',
        duration: '5 Days',
        whyItMatters: 'Over 40% of technical interview questions boil down to hash map lookups or two pointer traversal.',
        explanation: 'Learn when to trade O(N) space for O(1) average lookup time using hash tables. Practice left/right pointer convergence on sorted arrays.',
        codeExample: `# Two Sum using HashMap in O(N)\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
        keyInterviewQuestions: [
          'How do HashMaps resolve collisions (Chaining vs Open Addressing)?',
          'What is the amortized time complexity of rehashing?',
          'When is Two Pointers preferred over a Hash Map?'
        ],
        miniChallenge: 'Solve the 3Sum problem in O(N^2) time and O(1) extra space using sorting and two pointers.',
        quizQuestion: {
          question: 'What is the worst-case lookup time of a poorly implemented hash table with many collisions?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctIndex: 2,
          explanation: 'If all keys hash to the same bucket, searching through the chained linked list takes O(N) linear time.',
        },
        completed: true,
      },
      {
        id: 'p1-t3',
        title: 'Linear Algebra & Statistics for ML',
        duration: '5 Days',
        whyItMatters: 'Interviews evaluate if you understand what algorithms optimize under the hood.',
        explanation: 'Master Eigenvalues, Matrix Decomposition (SVD), Dot products as projections, Expectation, Variance, Covariance matrix, and Normal Distribution.',
        keyInterviewQuestions: [
          'What is the geometric interpretation of an Eigenvector and Eigenvalue?',
          'Why is the Covariance matrix symmetric and positive semi-definite?',
          'Explain the Central Limit Theorem and why it matters in hypothesis testing.'
        ],
        miniChallenge: 'Derive why PCA maximizes variance by finding the primary eigenvector of the covariance matrix.',
        quizQuestion: {
          question: 'If two random variables X and Y have a covariance of 0, what can be strictly concluded?',
          options: [
            'They are always completely independent',
            'There is no linear relationship between them',
            'Both variables must have zero mean',
            'Their correlation coefficient is 1'
          ],
          correctIndex: 1,
          explanation: 'Zero covariance proves absence of linear association, but non-linear dependency could still exist.',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Data Wrangling, SQL & Core Machine Learning',
    description: 'Master relational data manipulation, feature engineering, and foundational ML algorithms.',
    duration: 'Weeks 4-6',
    topics: [
      {
        id: 'p2-t1',
        title: 'Advanced SQL: Window Functions & Aggregations',
        duration: '4 Days',
        whyItMatters: 'Every data and tech role has a live SQL screen in technical round 1.',
        explanation: 'Learn partition by, over clauses, moving averages, self-joins, CTEs (WITH queries), and subqueries.',
        codeExample: `-- Find 2nd highest salary per department\nWITH RankedSalaries AS (\n  SELECT dept_id, name, salary,\n         DENSE_RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) as rank_num\n  FROM employees\n)\nSELECT dept_id, name, salary FROM RankedSalaries WHERE rank_num = 2;`,
        keyInterviewQuestions: [
          'What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?',
          'How does GROUP BY differ from PARTITION BY?',
          'Explain Indexing (B-Tree vs Hash Index) and when an index slows down queries.'
        ],
        miniChallenge: 'Write a query to calculate a 7-day rolling average of daily user signups.',
        quizQuestion: {
          question: 'In SQL, if two rows have identical values, what does DENSE_RANK() assign to the subsequent distinct row?',
          options: [
            'It skips the next integer rank (e.g. 1, 1, 3)',
            'It assigns the immediate next sequential integer (e.g. 1, 1, 2)',
            'It throws a syntax error',
            'It assigns NULL'
          ],
          correctIndex: 1,
          explanation: 'DENSE_RANK leaves no gaps in ranking sequence, whereas regular RANK skips ranks.',
        },
        completed: true,
      },
      {
        id: 'p2-t2',
        title: 'Classical ML: Regression, Trees, Ensemble (RandomForest, XGBoost)',
        duration: '6 Days',
        whyItMatters: 'Ensemble trees are the most battle-tested models in industry tabular data competitions and production systems.',
        explanation: 'Deep dive into cost functions (MSE, Log-Loss), Information Gain, Gini Impurity, Bagging vs Boosting, Gradient Boosting mechanics, and handling class imbalance.',
        keyInterviewQuestions: [
          'What is the fundamental difference between Bagging and Boosting?',
          'How does XGBoost prevent overfitting compared to standard Gradient Boosting?',
          'Explain the Bias-Variance trade-off using Random Forest and Deep Trees as examples.'
        ],
        miniChallenge: 'Implement decision tree splitting criterion (Gini Impurity) from scratch in pure Python.',
        quizQuestion: {
          question: 'Why does a Random Forest decrease variance without increasing bias?',
          options: [
            'By pruning each tree to depth 2',
            'By averaging predictions across decorrelated trees trained on bootstrapped data and random feature subsets',
            'By using gradient descent on the residuals',
            'By normalizing all input features between 0 and 1'
          ],
          correctIndex: 1,
          explanation: 'Averaging independent or weakly correlated estimators reduces variance proportionally to the number of estimators while maintaining low individual bias.',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'Deep Learning, NLP & LLMs',
    description: 'Neural network architectures, PyTorch implementation, and modern generative AI foundations.',
    duration: 'Weeks 7-9',
    topics: [
      {
        id: 'p3-t1',
        title: 'Deep Neural Networks & Backpropagation Math',
        duration: '5 Days',
        whyItMatters: 'Proves you understand gradients, vanishing gradients, and optimizer dynamics.',
        explanation: 'Understand chain rule calculus, computational graphs, activation functions (ReLU, GELU, Sigmoid), batch normalization, dropout, and Adam optimizer.',
        keyInterviewQuestions: [
          'Why does the vanishing gradient problem occur with Sigmoid activations?',
          'How does Batch Normalization accelerate training and what happens during test time?',
          'Explain the mechanics of Adam optimizer (momentum + RMSprop).'
        ],
        miniChallenge: 'Write a 2-layer neural network with forward pass and backprop using NumPy only.',
        quizQuestion: {
          question: 'What is the derivative of the ReLU activation function for inputs x > 0?',
          options: ['0', '1', 'x', 'e^x'],
          correctIndex: 1,
          explanation: 'For x > 0, ReLU is f(x) = x, whose derivative with respect to x is 1. This prevents gradient vanishing.',
        },
        completed: false,
      },
      {
        id: 'p3-t2',
        title: 'Transformers, Self-Attention & LLM Prompting/RAG',
        duration: '6 Days',
        whyItMatters: 'Hot topic in modern tech placement rounds for AI and software roles.',
        explanation: 'Query, Key, Value computation, Scaled Dot-Product Attention, Positional Encoding, Fine-tuning vs RAG (Retrieval Augmented Generation), vector embeddings.',
        keyInterviewQuestions: [
          'Explain the mathematical formula for Scaled Dot-Product Attention: Softmax(QK^T / sqrt(d_k)) * V.',
          'Why is the division by sqrt(d_k) crucial?',
          'What are the trade-offs between RAG and fine-tuning an LLM?'
        ],
        miniChallenge: 'Diagram a complete RAG pipeline with chunking, embedding generation, vector search, and LLM context injection.',
        quizQuestion: {
          question: 'Why is the dot product of Q and K scaled by 1/sqrt(d_k) in Transformer attention?',
          options: [
            'To make the matrix square',
            'To prevent dot products from growing excessively large, which pushes Softmax into regions with near-zero gradients',
            'To convert logits into probabilities',
            'To ensure the matrix is invertible'
          ],
          correctIndex: 1,
          explanation: 'For large d_k, dot products grow large, causing softmax to yield extremely peaked distributions with tiny gradients. Scaling stabilizes training.',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'Computer Science Core & System Design',
    description: 'Operating systems, networks, DBMS ACID properties, and scalable system design fundamentals.',
    duration: 'Weeks 10-11',
    topics: [
      {
        id: 'p4-t1',
        title: 'Operating Systems & Concurrency',
        duration: '4 Days',
        whyItMatters: 'Mandatory technical interview screening for all campus placements.',
        explanation: 'Processes vs Threads, Mutex vs Semaphore, Deadlock conditions (Coffman conditions), Virtual Memory, Paging, Thrashing.',
        keyInterviewQuestions: [
          'What are the 4 Coffman conditions required for a deadlock to occur?',
          'Explain the difference between a Process and a Thread in terms of memory space.',
          'What is Thrashing in virtual memory and how does the OS detect it?'
        ],
        miniChallenge: 'Explain how you would prevent race conditions when two threads write to a shared counter.',
        quizQuestion: {
          question: 'Which of the following is NOT shared among threads belonging to the same process?',
          options: ['Code segment', 'Data segment / Heap', 'Stack and CPU Registers', 'Open file descriptors'],
          correctIndex: 2,
          explanation: 'Each thread has its own private Stack and CPU registers (program counter), while sharing the Heap, code, and global resources.',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    title: 'Capstone Projects, Resume & Mock Placement Sprints',
    description: 'Polishing portfolio code, quantifying resume bullets, and surviving pressure mock interviews.',
    duration: 'Weeks 12-14',
    topics: [
      {
        id: 'p5-t1',
        title: 'Project Deep-Dive: Architecture, Trade-offs & Production Polish',
        duration: '4 Days',
        whyItMatters: '60% of technical interview questions branch from what you wrote on your resume.',
        explanation: 'Prepare the 30-sec pitch, 1-min STAR breakdown, and deep technical architecture defence. Know why you picked PostgreSQL over MongoDB, how you tested it, and what happens if traffic spikes 100x.',
        keyInterviewQuestions: [
          'Walk me through your most complex project from architecture down to database schema.',
          'What was the biggest technical roadblock you encountered and how did you diagnose it?',
          'If you had 2 more weeks, what would you re-architect?'
        ],
        miniChallenge: 'Create a clean README with architecture diagram, API documentation, and Docker instructions for your GitHub project.',
        quizQuestion: {
          question: 'What is the most effective way to describe an accomplishment on a tech resume?',
          options: [
            'Listing all technologies you used in one long sentence',
            'Using the XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]',
            'Explaining the tutorial you followed',
            'Focusing purely on your personal feelings about the project'
          ],
          correctIndex: 1,
          explanation: 'Google and top tech recruiters explicitly look for quantifiable XYZ impact statements.',
        },
        completed: false,
      },
    ],
  },
];

export const initialStudyTasks: StudyTask[] = [
  {
    id: 'st-1',
    title: 'Solve 2 Array Problems (Two Pointers & Sliding Window)',
    durationMinutes: 30,
    category: 'DSA',
    priority: 'High',
    day: 'Monday',
    completed: true,
    skipped: false,
    whyRecommended: 'Assessment showed DSA is your highest gap (32% away from target). Two Pointers is a high-frequency pattern.',
  },
  {
    id: 'st-2',
    title: 'Practice SQL Window Functions (DENSE_RANK & Moving Avg)',
    durationMinutes: 20,
    category: 'SQL',
    priority: 'High',
    day: 'Monday',
    completed: true,
    skipped: false,
    whyRecommended: 'SQL is tested in round 1 technical rounds for ML/Data roles.',
  },
  {
    id: 'st-3',
    title: 'Answer 1 Behavioral Interview Question (STAR method)',
    durationMinutes: 15,
    category: 'Interview Practice',
    priority: 'Medium',
    day: 'Monday',
    completed: false,
    skipped: false,
    whyRecommended: 'Consistent daily speaking builds interview fluency and reduces hesitation.',
  },
  {
    id: 'st-4',
    title: 'Review Random Forest vs XGBoost Math & Hyperparameters',
    durationMinutes: 35,
    category: 'ML Core',
    priority: 'High',
    day: 'Tuesday',
    completed: false,
    skipped: false,
    whyRecommended: 'Target role is Machine Learning Engineer; deep model mechanics are frequently quizzed.',
  },
  {
    id: 'st-5',
    title: 'Quantify 2 Bullet Points in Your Resume Project Section',
    durationMinutes: 20,
    category: 'Resume Polish',
    priority: 'Medium',
    day: 'Tuesday',
    completed: false,
    skipped: false,
    whyRecommended: 'Resume impact score is currently 70%. Adding numbers increases callback rate by 40%.',
  },
  {
    id: 'st-6',
    title: 'Solve 1 Medium Binary Tree Problem (LCA or Level Order)',
    durationMinutes: 30,
    category: 'DSA',
    priority: 'High',
    day: 'Wednesday',
    completed: false,
    skipped: false,
    whyRecommended: 'Tree traversals test recursion and DFS/BFS intuition.',
  },
  {
    id: 'st-7',
    title: 'Run a 60-Second Impromptu Speech on "Explain Latency vs Throughput"',
    durationMinutes: 15,
    category: 'Communication',
    priority: 'Medium',
    day: 'Wednesday',
    completed: false,
    skipped: false,
    whyRecommended: 'Communication lab exercise to eliminate filler words.',
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'SmartHealth Disease Risk Predictor',
    techStack: 'Python, FastAPI, Scikit-learn, XGBoost, Streamlit, Docker',
    description: 'An end-to-end medical risk stratification pipeline trained on clinical datasets with real-time risk scoring and SHAP explainability.',
    problemSolved: 'Helps triage incoming clinical records by calculating probabilities for cardiovascular risk with transparent model reasoning.',
    features: 'REST API with FastAPI, data imputation & normalization pipeline, SHAP feature importance plot generator, containerized deployment.',
    contribution: 'Wrote the data pipeline, trained and tuned the XGBoost classifier, handled class imbalance with SMOTE, built REST endpoints and Dockerfile.',
    githubUrl: 'https://github.com/alexchen/smarthealth-predictor',
    liveUrl: 'https://smarthealth-demo.example.com',
    analysis: {
      strengthScore: 78,
      technicalDepth: 74,
      innovation: 80,
      realWorldRelevance: 85,
      resumeValue: 76,
      interviewReadiness: 72,
      missingFeatures: [
        'Add Redis caching for duplicate query hashes to drop latency from 60ms to 4ms',
        'Write GitHub Actions CI pipeline running pytest and flake8',
        'Add data drift monitoring (Evidently AI or simple Kolmogorov-Smirnov test)'
      ],
      improvements: [
        'Show before/after metric comparisons (e.g. F1 improved from 0.76 to 0.89 using SMOTE + tuning)',
        'Host interactive API docs with Swagger/OpenAPI specifications'
      ],
      interviewerQA: [
        {
          question: 'How did you handle severe class imbalance in the medical dataset?',
          answer: 'I analyzed precision-recall AUC rather than raw accuracy. I experimented with class-weighted loss in XGBoost and synthetic oversampling via SMOTE on the training split only, ensuring no data leakage into the test set.'
        },
        {
          question: 'Why did you select SHAP over LIME for model explainability?',
          answer: 'SHAP has solid theoretical foundations in cooperative game theory (Shapley values), guaranteeing properties like local accuracy and consistency, whereas LIME is based on local perturbation surrogates which can vary with sample seeds.'
        }
      ],
      pitch30s: 'I developed SmartHealth Predictor, an end-to-end clinical risk triage system that analyzes patient diagnostic metrics using an XGBoost model. It features SHAP model explainability, sub-50ms FastAPI inference, and containerized deployment.',
      pitch1m: 'In healthcare analytics, black-box predictions are rarely trusted by physicians. To solve this, I designed SmartHealth: a machine learning platform that not only predicts cardiovascular risk with an 89% F1-score, but breaks down individual risk factor contributions using SHAP TreeExplainer. I engineered the preprocessing pipeline, addressed class imbalance, wrapped it in a production FastAPI service, and packaged it with Docker.',
      pitch3mStar: 'Situation: During clinical triaging, healthcare workers lack automated tools to spot multi-variable risk markers early.\nTask: My goal was to create a reliable, explainable ML microservice that could score incoming patient labs in real time.\nAction: I collected and cleaned standard clinical benchmarks, evaluated Logistic Regression, Random Forest, and XGBoost with 5-fold cross-validation. I used Optuna for hyperparameter tuning and built a FastAPI service with pydantic data validation.\nResult: The final model attained an 89% F1-score with 42ms response latency, complete with automated unit tests and Docker image.',
      technicalPitch: 'The architecture separates feature engineering, inference, and serialization. Data ingestion uses Pydantic schemas. Preprocessing utilizes Scikit-learn Pipelines to eliminate leakage. Model persistence is managed via ONNX runtime for accelerated inference latency, and the microservice runs on Uvicorn behind a reverse proxy.'
    }
  }
];

export const initialJobs: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Machine Learning Engineering Intern',
    company: 'Nexus AI Labs',
    type: 'Internship',
    location: 'Bangalore / Hybrid',
    isRemote: true,
    stipendOrSalary: '₹45,000 / month',
    requiredSkills: ['Python', 'SQL', 'Scikit-learn', 'PyTorch', 'Git', 'FastAPI'],
    eligibility: '2025/2026 Batch, B.Tech/M.Tech in CS/AI/Data Science, CGPA 7.5+',
    deadline: '2026-10-15',
    matchPercentage: 86,
    matchedSkills: ['Python', 'SQL', 'Scikit-learn', 'Git', 'FastAPI'],
    missingSkills: ['PyTorch (Advanced)'],
    applyUrl: 'https://nexusailabs.careers/intern-ml',
    roleDomain: 'AI/ML',
  },
  {
    id: 'job-2',
    title: 'Associate Data Scientist',
    company: 'QuantMatrix Solutions',
    type: 'Full-Time',
    location: 'Hyderabad / On-site',
    isRemote: false,
    stipendOrSalary: '₹12 - 16 LPA',
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Tableau/Power BI', 'Machine Learning', 'Communication'],
    eligibility: 'Graduating 2026, 70%+ throughout academics',
    deadline: '2026-10-25',
    matchPercentage: 78,
    matchedSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Communication'],
    missingSkills: ['Power BI'],
    applyUrl: 'https://quantmatrix.com/jobs/ads-2026',
    roleDomain: 'Data Science',
  },
  {
    id: 'job-3',
    title: 'Software Development Engineer - Backend / AI Services',
    company: 'AuraCloud Platforms',
    type: 'Full-Time',
    location: 'Bengaluru / Remote',
    isRemote: true,
    stipendOrSalary: '₹14 - 18 LPA',
    requiredSkills: ['Python', 'DSA', 'OOP', 'SQL', 'Docker', 'System Design Basics'],
    eligibility: '2026 Grads, CS/IT/Circuital branches',
    deadline: '2026-11-01',
    matchPercentage: 74,
    matchedSkills: ['Python', 'OOP', 'SQL', 'Docker'],
    missingSkills: ['DSA (Advanced Trees/DP)', 'System Design Basics'],
    applyUrl: 'https://auracloud.tech/careers/sde1-2026',
    roleDomain: 'Software Development',
  },
  {
    id: 'job-4',
    title: 'Data Analyst Intern',
    company: 'FinPulse Analytics',
    type: 'Internship',
    location: 'Mumbai / Hybrid',
    isRemote: false,
    stipendOrSalary: '₹30,000 / month',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Aptitude'],
    eligibility: 'Pre-final or Final year students',
    deadline: '2026-10-18',
    matchPercentage: 92,
    matchedSkills: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Aptitude'],
    missingSkills: [],
    applyUrl: 'https://finpulse.io/internships',
    roleDomain: 'Data Analyst',
  }
];

export const initialApplications: ApplicationItem[] = [
  {
    id: 'app-1',
    company: 'Nexus AI Labs',
    role: 'ML Engineering Intern',
    applyDate: '2026-09-18',
    status: 'Assessment',
    ctcOrStipend: '₹45,000 / month',
    notes: 'Online coding & ML quiz scheduled for this Saturday. Focus on NumPy vectorization & SQL queries.',
    nextFollowUp: '2026-09-28',
  },
  {
    id: 'app-2',
    company: 'AuraCloud Platforms',
    role: 'SDE 1 (Campus Pool)',
    applyDate: '2026-09-10',
    status: 'Interview',
    ctcOrStipend: '₹14 LPA',
    notes: 'Technical Round 1 scheduled with Senior Engineering Lead. Expect questions on SmartHealth architecture and tree algorithms.',
    nextFollowUp: '2026-09-29',
  },
  {
    id: 'app-3',
    company: 'FinPulse Analytics',
    role: 'Data Analyst Intern',
    applyDate: '2026-09-02',
    status: 'Selected',
    ctcOrStipend: '₹30,000 / month',
    notes: 'Offer letter received! Reviewing joining date vs 7th sem exams.',
    nextFollowUp: '2026-10-05',
  }
];

export const initialDailyChallenge: DailyChallenge = {
  id: 'dc-today',
  title: 'Optimize the Two-Pointer Window',
  category: 'DSA',
  difficulty: 'Medium',
  description: 'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If no such subarray exists, return 0.',
  problemPrompt: `What is the optimal time and space complexity to solve the "Minimum Size Subarray Sum" problem?`,
  options: [
    'O(N^2) time and O(1) space using nested loops',
    'O(N) time and O(1) space using a Sliding Window / Two Pointers approach',
    'O(N log N) time and O(N) space using Merge Sort',
    'O(2^N) time using recursion'
  ],
  correctIndex: 1,
  xp: 50,
  completed: false,
  hint: 'Expand the right pointer until the current window sum is >= target, then contract the left pointer while keeping sum >= target to minimize window length.',
  explanation: 'Since all elements are positive integers, the window sum is monotonic. Each element is visited at most twice (once by the right pointer and once by the left pointer), yielding O(N) linear time and O(1) auxiliary space.'
};

export const initialReminders: ReminderItem[] = [
  { id: 'rem-1', title: 'Daily DSA Practice (2 Problems)', time: '18:00', frequency: 'Daily', enabled: true, category: 'study' },
  { id: 'rem-2', title: 'Daily Skill Challenge', time: '12:30', frequency: 'Daily', enabled: true, category: 'challenge' },
  { id: 'rem-3', title: 'AuraCloud Tech Interview Round 1', time: '10:00', frequency: 'Custom', enabled: true, category: 'interview' },
  { id: 'rem-4', title: 'Nexus AI Assessment Test', time: '15:00', frequency: 'Custom', enabled: true, category: 'application' },
];

export const initialResumeText = `Alex Chen
Email: alex.chen@nit.edu | Phone: +91 98765 43210 | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen

EDUCATION
National Institute of Technology — B.Tech in Computer Science & Engineering (2022 - 2026)
CGPA: 8.42 / 10.0

TECHNICAL SKILLS
Languages: Python, C++, SQL, JavaScript
Machine Learning & Data: Scikit-learn, XGBoost, Pandas, NumPy, Matplotlib, PyTorch (Basics)
Web & Cloud: FastAPI, Flask, React (Basics), Docker, Git/GitHub, Linux

PROJECTS
SmartHealth: Disease Risk Predictor & Explainability Engine
- Built an end-to-end medical risk stratification pipeline using Python and FastAPI
- Implemented XGBoost and Random Forest models achieving 89% F1-score on clinical datasets
- Handled class imbalance using SMOTE technique and conducted 5-fold cross-validation
- Integrated SHAP TreeExplainer for feature importance visualization
- Packaged the application into a Docker container for deployment

Distributed Task Scheduler & Monitor
- Created a lightweight job scheduling service in Python using thread pools
- Stored execution logs and task states in SQLite with automated retry mechanisms
- Developed a clean web dashboard to monitor task queues and latency

ACADEMIC ACHIEVEMENTS & CERTIFICATIONS
- Solved 180+ problems on LeetCode across Arrays, HashMaps, Trees, and Dynamic Programming
- Finalist in College Hackathon 2025 (Top 5 among 80 teams)
- Completed Deep Learning Specialization by Andrew Ng (Coursera)`;
