export interface DiagnosticQuestion {
  id: string;
  category: 'DSA' | 'SQL' | 'OOP' | 'OS' | 'Networks' | 'ML' | 'Aptitude' | 'Communication';
  skillId: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  weight: number;
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    category: 'DSA',
    skillId: 'dsa',
    question: 'What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 1,
    explanation: 'Self-balancing binary search trees maintain height <= c * log N, guaranteeing O(log N) search, insertion, and deletion.',
    weight: 10,
  },
  {
    id: 'diag-2',
    category: 'SQL',
    skillId: 'sql',
    question: 'Which SQL clause is strictly executed BEFORE the SELECT and WHERE clauses in relational query processing?',
    options: ['ORDER BY', 'FROM / JOIN', 'HAVING', 'LIMIT'],
    correctIndex: 1,
    explanation: 'Query execution order begins with FROM and JOIN to identify the dataset, followed by WHERE, GROUP BY, HAVING, SELECT, and ORDER BY.',
    weight: 10,
  },
  {
    id: 'diag-3',
    category: 'OOP',
    skillId: 'oop',
    question: 'Which OOP principle is best demonstrated by declaring private member variables and providing public getter/setter methods?',
    options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Multiple Dispatch'],
    correctIndex: 1,
    explanation: 'Encapsulation restricts direct access to an object’s internal state, enforcing controlled mutation through public interfaces.',
    weight: 10,
  },
  {
    id: 'diag-4',
    category: 'OS',
    skillId: 'os_networks',
    question: 'What happens during a context switch in a multi-tasking operating system?',
    options: [
      'The CPU completely flushes RAM memory to disk',
      'The OS saves the state (registers, program counter) of the running process and loads another process state',
      'The CPU shuts down idle cores',
      'All thread variables are garbage collected'
    ],
    correctIndex: 1,
    explanation: 'A context switch stores the Process Control Block (PCB) state of the outgoing process and restores the PCB of the incoming process.',
    weight: 10,
  },
  {
    id: 'diag-5',
    category: 'Networks',
    skillId: 'os_networks',
    question: 'Why is TCP considered a connection-oriented protocol compared to UDP?',
    options: [
      'TCP does not use IP addresses',
      'TCP performs a three-way handshake (SYN, SYN-ACK, ACK) and provides guaranteed packet ordering & retransmission',
      'TCP only runs over optical fiber',
      'TCP encrypts data by default'
    ],
    correctIndex: 1,
    explanation: 'TCP guarantees reliability, flow control, and sequence numbers via the three-way handshake mechanism.',
    weight: 10,
  },
  {
    id: 'diag-6',
    category: 'ML',
    skillId: 'ml_core',
    question: 'What is the consequence of high variance (overfitting) in a machine learning model?',
    options: [
      'The model has low error on training data but high error on unseen test data',
      'The model performs equally poorly on both training and test data',
      'The model has too few parameters',
      'The model underfits and has high bias'
    ],
    correctIndex: 0,
    explanation: 'High variance means the model captures noise in the training set and fails to generalize to unseen test distributions.',
    weight: 10,
  },
  {
    id: 'diag-7',
    category: 'Aptitude',
    skillId: 'aptitude',
    question: 'A train 180 meters long is traveling at 54 km/hr. How much time does it take to cross a signal post?',
    options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
    correctIndex: 1,
    explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 180 / 15 = 12 seconds.',
    weight: 10,
  },
  {
    id: 'diag-8',
    category: 'Communication',
    skillId: 'communication',
    question: 'In a behavioral placement interview, what does the STAR technique stand for?',
    options: [
      'Skills, Talent, Attitude, Resilience',
      'Situation, Task, Action, Result',
      'Software, Testing, Automation, Release',
      'Strategy, Teamwork, Analysis, Reflection'
    ],
    correctIndex: 1,
    explanation: 'STAR is the universally recognized structure for behavioral questions: Situation, Task, Action, Result.',
    weight: 10,
  }
];

// Learning Games Datasets
export interface CodeDetectiveProblem {
  id: string;
  title: string;
  language: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  snippet: string;
  bugLine: number;
  options: { line: number; explanation: string }[];
  fixExplanation: string;
  xp: number;
}

export const codeDetectiveProblems: CodeDetectiveProblem[] = [
  {
    id: 'cd-1',
    title: 'Off-By-One in Binary Search',
    language: 'Python',
    difficulty: 'Easy',
    snippet: `def binary_search(arr, target):
    left = 0
    right = len(arr)        # Line 3
    while left < right:     # Line 4
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid      # Line 9
        else:
            right = mid - 1 # Line 11
    return -1`,
    bugLine: 9,
    options: [
      { line: 3, explanation: 'right should always start at 100' },
      { line: 4, explanation: 'while loop condition should be while left == right' },
      { line: 9, explanation: 'left = mid causes an infinite loop when left and mid coincide; it should be left = mid + 1' },
      { line: 11, explanation: 'mid - 1 should be mid + 1' },
    ],
    fixExplanation: 'When arr[mid] < target, we already know mid is not the target. Failing to increment to mid + 1 leads to an infinite loop when right - left == 1.',
    xp: 30,
  },
  {
    id: 'cd-2',
    title: 'Mutable Default Argument Trap',
    language: 'Python',
    difficulty: 'Medium',
    snippet: `def append_to_cache(item, cache=[]): # Line 1
    cache.append(item)               # Line 2
    return cache                     # Line 3

print(append_to_cache('A')) # ['A']
print(append_to_cache('B')) # ['A', 'B'] instead of ['B']!`,
    bugLine: 1,
    options: [
      { line: 1, explanation: 'Default list [] is evaluated once at function definition time, sharing state across all invocations' },
      { line: 2, explanation: 'append() does not work on list objects' },
      { line: 3, explanation: 'return cache should be return item' },
    ],
    fixExplanation: 'In Python, default arguments are evaluated only once when the function is defined. A mutable default like [] persists across calls. Use cache=None and initialize cache = [] inside.',
    xp: 40,
  },
  {
    id: 'cd-3',
    title: 'Asynchronous JavaScript Loop Scope',
    language: 'JavaScript',
    difficulty: 'Medium',
    snippet: `for (var i = 0; i < 3; i++) { // Line 1
    setTimeout(() => {        // Line 2
        console.log(i);       // Line 3: Prints 3, 3, 3!
    }, 100);
}`,
    bugLine: 1,
    options: [
      { line: 1, explanation: 'Using var creates a function-scoped variable shared by all timeout callbacks. Use let i for block scope.' },
      { line: 2, explanation: 'setTimeout does not support arrow functions' },
      { line: 3, explanation: 'console.log should take this.i' },
    ],
    fixExplanation: 'var has function scope, so by the time the callbacks execute, i has already been incremented to 3. Replacing var with let binds a new block-scoped i for each iteration.',
    xp: 40,
  },
];

export interface SQLQuestProblem {
  id: string;
  title: string;
  schemaDescription: string;
  task: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export const sqlQuestProblems: SQLQuestProblem[] = [
  {
    id: 'sqlq-1',
    title: 'Find Second Highest Salary',
    schemaDescription: 'Table: Employees (id INT, name VARCHAR, salary INT, department_id INT)',
    task: 'Write an optimal SQL query to return the second highest distinct salary from Employees, returning NULL if no second highest exists.',
    options: [
      'SELECT salary FROM Employees ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      'SELECT MAX(salary) AS SecondHighestSalary FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees);',
      'SELECT DISTINCT salary FROM Employees WHERE salary = 2;',
      'SELECT salary FROM Employees GROUP BY salary HAVING COUNT(*) = 2;'
    ],
    correctIndex: 1,
    explanation: 'Using MAX(salary) WHERE salary < (SELECT MAX(salary)) gracefully returns NULL if there is only 1 employee, which satisfies the edge case.',
    xp: 35,
  },
  {
    id: 'sqlq-2',
    title: 'Active Users with More Than 3 Orders',
    schemaDescription: 'Table: Orders (order_id INT, user_id INT, order_date DATE, amount DECIMAL)',
    task: 'Which query correctly finds all user_ids who made more than 3 orders in 2026?',
    options: [
      'SELECT user_id FROM Orders WHERE COUNT(*) > 3 AND YEAR(order_date) = 2026;',
      'SELECT user_id FROM Orders WHERE YEAR(order_date) = 2026 GROUP BY user_id HAVING COUNT(order_id) > 3;',
      'SELECT user_id FROM Orders GROUP BY user_id WHERE COUNT(order_id) > 3;',
      'SELECT user_id FROM Orders HAVING order_date >= 2026;'
    ],
    correctIndex: 1,
    explanation: 'HAVING filters aggregated groups (COUNT > 3), while WHERE filters individual rows before grouping.',
    xp: 35,
  },
];

export interface DSARaceProblem {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timeComplexityReason: string;
  xp: number;
}

export const dsaRaceProblems: DSARaceProblem[] = [
  {
    id: 'dsar-1',
    scenario: 'You are implementing an LRU (Least Recently Used) cache where get(key) and put(key, value) must both run in strictly O(1) time.',
    options: ['Array + Binary Search', 'HashMap + Doubly Linked List', 'Min-Heap + Queue', 'Stack + Balanced BST'],
    correctIndex: 1,
    explanation: 'The HashMap gives O(1) key lookups, and the Doubly Linked List allows O(1) node removal and insertion at the head/tail.',
    timeComplexityReason: 'O(1) get and O(1) eviction/update.',
    xp: 30,
  },
  {
    id: 'dsar-2',
    scenario: 'You need to find the top K most frequent elements in a massive stream of 10 million search queries.',
    options: ['Min-Heap of size K', 'Quicksort the entire array', 'Single Stack', 'Unsorted Linked List'],
    correctIndex: 0,
    explanation: 'Maintaining a Min-Heap of size K requires only O(N log K) time and O(K) space, keeping memory usage constant and bounded.',
    timeComplexityReason: 'O(N log K) time and O(K) memory.',
    xp: 30,
  },
  {
    id: 'dsar-3',
    scenario: 'You need to check for cycles in a directed workflow dependency graph (e.g. build tasks).',
    options: ['Breadth First Search (BFS)', 'Depth First Search (DFS) with 3 color states (White, Gray, Black) or Kahn’s Algorithm', 'Binary Search', 'Prefix Sum Array'],
    correctIndex: 1,
    explanation: 'A back-edge pointing to a node currently in the recursion stack (Gray) indicates a directed cycle in O(V + E) time.',
    timeComplexityReason: 'O(V + E) linear time.',
    xp: 35,
  }
];

export interface OutputPredictorProblem {
  id: string;
  language: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export const outputPredictorProblems: OutputPredictorProblem[] = [
  {
    id: 'op-1',
    language: 'Python',
    code: `a = [1, 2, 3]
b = a
b.append(4)
print(len(a))`,
    options: ['3', '4', 'TypeError', 'AttributeError'],
    correctIndex: 1,
    explanation: 'In Python, assignments copy object references, not values. b points to the exact same list in heap memory as a. Appending to b modifies a.',
    xp: 25,
  },
  {
    id: 'op-2',
    language: 'JavaScript',
    code: `console.log(typeof null);
console.log([] == false);`,
    options: [
      '"null" and false',
      '"object" and true',
      '"undefined" and true',
      '"object" and false'
    ],
    correctIndex: 1,
    explanation: 'typeof null is "object" due to a historical legacy bug in JS engine type tags. [] == false converts [] to "" then to 0, and false to 0, evaluating to true.',
    xp: 30,
  }
];

export interface ConceptMatchCard {
  id: string;
  concept: string;
  definition: string;
  productionExample: string;
}

export const conceptMatchCards: ConceptMatchCard[] = [
  {
    id: 'cm-1',
    concept: 'Idempotency',
    definition: 'An operation produces the exact same result whether executed once or repeated multiple times with the same input.',
    productionExample: 'Payment gateway API retry token or HTTP PUT/DELETE requests.',
  },
  {
    id: 'cm-2',
    concept: 'Database Indexing (B-Tree)',
    definition: 'A balanced tree data structure holding sorted keys and row pointers for logarithmic search speed.',
    productionExample: 'Accelerating user lookup by email from full table scan O(N) to index seek O(log N).',
  },
  {
    id: 'cm-3',
    concept: 'Sharding',
    definition: 'Horizontal partitioning of database rows across multiple distinct database server nodes.',
    productionExample: 'Partitioning customer accounts across shard clusters based on hash(user_id) % N.',
  },
];

export const confusionTopics = [
  {
    id: 'conf-1',
    question: 'Should I prioritize mastering Java or Python for campus placements?',
    category: 'Language Choice',
    summary: 'For service companies & enterprise product firms (Amazon, Oracle, Infosys, TCS), Java OOP fundamentals are revered. For AI/ML, data science, and modern startups, Python is dominant. If you already know one, stick to it for DSA rather than switching back and forth.',
    actionPlan: [
      'If targeting ML/Data: Master Python and its scientific stack.',
      'If targeting enterprise SDE: Polish Java with Collections and OOP design patterns.',
      'Core rule: Problem-solving logic matters 10x more than syntax.'
    ],
  },
  {
    id: 'conf-2',
    question: 'I only have 60 days left before campus drives. Where should I focus?',
    category: 'Time Crunch',
    summary: 'Do not try to learn 10 new frameworks. Apply the 80/20 rule: 70% time on high-frequency DSA patterns (HashMaps, Two Pointers, Trees, Sliding Window), 20% on explaining 1 solid project end-to-end, and 10% on CS core fundamentals (SQL, OS, OOP).',
    actionPlan: [
      'Solve 2 curated medium DSA questions every morning.',
      'Prepare a 1-minute STAR pitch for your primary portfolio project.',
      'Review top 50 SQL queries and OS deadlock/scheduling concepts.'
    ],
  },
  {
    id: 'conf-3',
    question: 'My portfolio projects feel too simple / like basic tutorials. How can I fix them?',
    category: 'Project Depth',
    summary: 'A simple project with production depth beats an unfinished fancy idea. You do NOT need to build a new app from scratch. Elevate your existing project by adding 3 engineering features: authentication, database indexing with query profiling, and automated tests with Docker deployment.',
    actionPlan: [
      'Add Dockerfile and docker-compose for one-click setup.',
      'Implement structured error handling and API rate limiting.',
      'Quantify your README with benchmarks (e.g. handles 50 concurrent requests in <60ms).'
    ],
  },
  {
    id: 'conf-4',
    question: 'I freeze up during technical interviews and forget basic syntax. How can I overcome this?',
    category: 'Interview Anxiety',
    summary: 'Interview anxiety happens when you code in silence. Tech interviewers do not expect instant perfect code; they evaluate your thought process. Practice "thinking out loud" — declare your assumptions, talk through brute force first, then optimize.',
    actionPlan: [
      'Always start by clarifying edge cases (e.g. empty array, negative numbers).',
      'Speak for 30 seconds before writing a single line of code.',
      'Use the AI Interview Arena in this app 2-3 times a week to get comfortable talking to an interviewer.'
    ],
  }
];
