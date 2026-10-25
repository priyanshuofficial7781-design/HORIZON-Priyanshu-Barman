import {
  UserProfile,
  Task,
  SubjectCourse,
  RoadmapMilestone,
  CybersecurityModule,
  AIModule,
  ProjectItem,
  PlacementTracker,
  NotificationSettings,
  FocusSession,
  YouTubePlaylist,
  YouTubePlaylistItem,
} from '../types';

export const initialNotificationSettings: NotificationSettings = {
  enabled: true,
  leadTimeMinutes: 10,
  soundEnabled: true,
  permissionState: typeof Notification !== 'undefined' ? (Notification.permission as 'default' | 'granted' | 'denied') : 'default',
};

export const initialUserProfile: UserProfile = {
  name: 'Priyanshu',
  email: 'priyanshu.bca@horizon.edu',
  semester: 3,
  dailyStudyHours: '4-6 hrs',
  studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  goals: [
    'Learn DSA & Competitive Programming',
    'Build Cybersecurity Skills',
    'Explore AI / ML Foundations',
    'Build Production Projects',
    'Top Tier Campus Placement',
  ],
  learningPriorities: [
    'C++ / DSA',
    'Java',
    'Cybersecurity',
    'Python',
    'AI / ML',
    'Aptitude',
    'University Subjects',
    'Projects & Placement',
  ],
  wakeUpWeekday: '08:00',
  wakeUpWeekend: '10:00',
  collegeHours: '09:00 - 16:00',
  dinnerHours: '22:00 - 23:00',
  onboarded: false,
};

export const initialSubjects: SubjectCourse[] = [
  {
    id: 'cpp-dsa',
    name: 'C++ / DSA',
    shortName: 'C++ / DSA',
    category: 'core',
    color: '#8B5CFF',
    accentColor: '#35D9FF',
    iconName: 'Code',
    description: 'Master Object-Oriented C++, memory management, algorithms and LeetCode problem patterns.',
    totalLessons: 45,
    completedLessons: 0,
    modules: [
      {
        id: 'cpp-m1',
        title: 'C++ Memory Model & OOP Foundations',
        lessons: [
          { id: 'cpp-l1', title: 'Pointers, References & Dynamic Memory (new/delete)', durationMinutes: 60, completed: false, notes: 'Stack vs heap, pointer arithmetic, dangling pointers.' },
          { id: 'cpp-l2', title: 'Classes, Constructors, Destructors & Rule of Three/Five', durationMinutes: 75, completed: false, notes: 'Deep copy vs shallow copy, copy constructors.' },
          { id: 'cpp-l3', title: 'Inheritance, Virtual Functions & VTables', durationMinutes: 90, completed: false, notes: 'Runtime polymorphism through vptr and vtable lookup.' },
          { id: 'cpp-l4', title: 'Templates, STL Containers & Iterators', durationMinutes: 70, completed: false, notes: 'Vector vs Deque vs List, iterator invalidation rules.' },
        ],
        practiceTasks: [
          { id: 'cpp-p1', title: 'Build a custom Smart Pointer (UniquePtr)', difficulty: 'Medium', completed: false },
          { id: 'cpp-p2', title: 'Implement generic vector class with dynamic resizing', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cpp-r1', text: 'Explain virtual destructor necessity when deleting derived object', checked: false },
          { id: 'cpp-r2', text: 'Difference between pass-by-reference and pass-by-pointer in assembly', checked: false },
        ],
      },
      {
        id: 'cpp-m2',
        title: 'Linear Data Structures & Two Pointers',
        lessons: [
          { id: 'cpp-l5', title: 'Dynamic Arrays & Vector Amortized O(1) Push', durationMinutes: 60, completed: false },
          { id: 'cpp-l6', title: 'Sliding Window & Two Pointer Optimization Patterns', durationMinutes: 90, completed: false },
          { id: 'cpp-l7', title: 'Linked Lists: Reversal, Fast-Slow Cycle Detection', durationMinutes: 90, completed: false },
          { id: 'cpp-l8', title: 'Monotonic Stacks & Next Greater Element', durationMinutes: 75, completed: false },
        ],
        practiceTasks: [
          { id: 'cpp-p3', title: 'LeetCode 42: Trapping Rain Water using Two Pointers', difficulty: 'Hard', completed: false },
          { id: 'cpp-p4', title: 'LeetCode 3: Longest Substring Without Repeating Characters', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cpp-r3', text: 'Floyd Cycle finding proof for linked lists', checked: false },
          { id: 'cpp-r4', text: 'Stack application in arithmetic expression evaluation (infix to postfix)', checked: false },
        ],
      },
      {
        id: 'cpp-m3',
        title: 'Non-Linear Trees, Heaps & Graphs',
        lessons: [
          { id: 'cpp-l9', title: 'Binary Trees & Traversals (Inorder, Preorder, Postorder, Level)', durationMinutes: 90, completed: false },
          { id: 'cpp-l10', title: 'Binary Search Trees & AVL Self-Balancing Rotations', durationMinutes: 90, completed: false },
          { id: 'cpp-l11', title: 'Priority Queue & Binary Min/Max Heaps', durationMinutes: 75, completed: false },
          { id: 'cpp-l12', title: 'Graph Representations (Adjacency Matrix vs List) & BFS/DFS', durationMinutes: 90, completed: false },
          { id: 'cpp-l13', title: 'Dijkstra Shortest Path & Topological Sort', durationMinutes: 100, completed: false },
        ],
        practiceTasks: [
          { id: 'cpp-p5', title: 'Lowest Common Ancestor in Binary Tree (LeetCode 236)', difficulty: 'Medium', completed: false },
          { id: 'cpp-p6', title: 'Course Schedule I & II (Cycle detection in Directed Graph)', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cpp-r5', text: 'Time complexity proof for Heapify O(N)', checked: false },
          { id: 'cpp-r6', text: 'When to choose Bellman-Ford over Dijkstra', checked: false },
        ],
      },
      {
        id: 'cpp-m4',
        title: 'Dynamic Programming & Advanced Patterns',
        lessons: [
          { id: 'cpp-l14', title: 'Memoization vs Tabulation Foundations', durationMinutes: 75, completed: false },
          { id: 'cpp-l15', title: '0/1 Knapsack & Unbounded Variations', durationMinutes: 90, completed: false },
          { id: 'cpp-l16', title: 'Longest Common Subsequence & Edit Distance', durationMinutes: 90, completed: false },
        ],
        practiceTasks: [
          { id: 'cpp-p7', title: 'Coin Change I (Minimum Coins)', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cpp-r7', text: 'State transitions and space optimization in 2D DP', checked: false },
        ],
      },
    ],
  },
  {
    id: 'java',
    name: 'Java & Enterprise Core',
    shortName: 'Java',
    category: 'core',
    color: '#3B82F6',
    accentColor: '#60A5FA',
    iconName: 'Coffee',
    description: 'Core Java, JVM internals, Collections Framework, Multithreading, JDBC and Spring Boot fundamentals.',
    totalLessons: 38,
    completedLessons: 0,
    modules: [
      {
        id: 'java-m1',
        title: 'Core Java & OOP Architecture',
        lessons: [
          { id: 'java-l1', title: 'JVM Architecture: ClassLoader, Memory Model & JIT', durationMinutes: 60, completed: false },
          { id: 'java-l2', title: 'Encapsulation, Inheritance & Abstract Classes vs Interfaces', durationMinutes: 80, completed: false },
          { id: 'java-l3', title: 'Exception Handling & Custom Checked/Unchecked Exceptions', durationMinutes: 60, completed: false },
          { id: 'java-l4', title: 'Java Generics & Type Erasure', durationMinutes: 60, completed: false },
        ],
        practiceTasks: [
          { id: 'java-p1', title: 'Build a Banking Transaction Management system with custom exceptions', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'java-r1', text: 'Difference between equals() and == and hashCode contract', checked: false },
        ],
      },
      {
        id: 'java-m2',
        title: 'Collections Framework & Streams API',
        lessons: [
          { id: 'java-l5', title: 'ArrayList, LinkedList & CopyOnWriteArrayList', durationMinutes: 70, completed: false },
          { id: 'java-l6', title: 'HashMap internal workings (Hashing, Collisions, Red-Black Trees in Java 8)', durationMinutes: 90, completed: false },
          { id: 'java-l7', title: 'Java 8 Lambdas, Functional Interfaces & Stream API', durationMinutes: 80, completed: false },
        ],
        practiceTasks: [
          { id: 'java-p2', title: 'Process a 10,000-record student CSV using Java Streams pipeline', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'java-r2', text: 'Why HashMap capacity is always powers of two', checked: false },
        ],
      },
      {
        id: 'java-m3',
        title: 'Multithreading & Concurrency',
        lessons: [
          { id: 'java-l8', title: 'Thread Lifecycle, Runnable vs Callable', durationMinutes: 70, completed: false },
          { id: 'java-l9', title: 'Synchronization, Locks & Deadlock Scenarios', durationMinutes: 80, completed: false },
          { id: 'java-l10', title: 'ExecutorService, ThreadPools & CompletableFuture', durationMinutes: 90, completed: false },
        ],
        practiceTasks: [
          { id: 'java-p3', title: 'Producer-Consumer queue with BlockingQueue and ReentrantLock', difficulty: 'Hard', completed: false },
        ],
        revisionChecklist: [
          { id: 'java-r3', text: 'Volatile keyword vs AtomicInteger semantics', checked: false },
        ],
      },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Defenses',
    shortName: 'Cybersecurity',
    category: 'specialization',
    color: '#10B981',
    accentColor: '#35D9FF',
    iconName: 'ShieldAlert',
    description: 'Computer networking, Linux security, ethical hacking fundamentals, OWASP Top 10, safe educational labs.',
    totalLessons: 40,
    completedLessons: 0,
    modules: [
      {
        id: 'cyber-m1',
        title: 'Networking & Protocol Security',
        lessons: [
          { id: 'cyber-l1', title: 'OSI & TCP/IP Stack Deep Dive', durationMinutes: 75, completed: false, notes: 'Encapsulation, headers, IP fragmentation.' },
          { id: 'cyber-l2', title: 'DNS, DHCP, ARP & Common Protocol Vulnerabilities', durationMinutes: 80, completed: false, notes: 'ARP spoofing, DNS poisoning mitigation.' },
          { id: 'cyber-l3', title: 'TLS/SSL Handshake & Cryptographic Foundations', durationMinutes: 90, completed: false, notes: 'Symmetric vs asymmetric keys, certificates.' },
        ],
        practiceTasks: [
          { id: 'cyber-p1', title: 'Capture and inspect HTTP vs HTTPS traffic in safe Wireshark session', difficulty: 'Easy', completed: false },
        ],
        revisionChecklist: [
          { id: 'cyber-r1', text: 'Three-way TCP handshake and SYN flood defense with SYN cookies', checked: false },
        ],
      },
      {
        id: 'cyber-m2',
        title: 'Linux Hardening & Command Line',
        lessons: [
          { id: 'cyber-l4', title: 'Linux Permissions, SUID/SGID, and Capabilities', durationMinutes: 70, completed: false },
          { id: 'cyber-l5', title: 'Bash Scripting for System Automation & Log Auditing', durationMinutes: 80, completed: false },
          { id: 'cyber-l6', title: 'IPTables, UFW & Host-based Intrusion Detection', durationMinutes: 90, completed: false },
        ],
        practiceTasks: [
          { id: 'cyber-p2', title: 'Audit `/etc/passwd` and identify SUID binaries using safe bash script', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cyber-r2', text: 'Chmod octal math vs ACL permissions', checked: false },
        ],
      },
      {
        id: 'cyber-m3',
        title: 'Web Application Security (OWASP Top 10)',
        lessons: [
          { id: 'cyber-l7', title: 'SQL Injection: Blind, Error-based & Prepared Statement Defense', durationMinutes: 90, completed: false },
          { id: 'cyber-l8', title: 'Cross-Site Scripting (XSS) & Content Security Policy (CSP)', durationMinutes: 90, completed: false },
          { id: 'cyber-l9', title: 'Broken Authentication & Secure Session Management', durationMinutes: 80, completed: false },
        ],
        practiceTasks: [
          { id: 'cyber-p3', title: 'Solve OWASP Juice Shop Level 1 in isolated local container', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'cyber-r3', text: 'Difference between Stored XSS and DOM XSS', checked: false },
        ],
      },
    ],
  },
  {
    id: 'python',
    name: 'Python for Systems & Data',
    shortName: 'Python',
    category: 'core',
    color: '#06B6D4',
    accentColor: '#3B82F6',
    iconName: 'Terminal',
    description: 'Python fundamentals, automation scripts, data science tooling (NumPy, Pandas) and API development.',
    totalLessons: 40,
    completedLessons: 0,
    modules: [
      {
        id: 'py-m1',
        title: 'Python Language Fundamentals',
        lessons: [
          { id: 'py-l1', title: 'Data Types, Mutable vs Immutable, Memory References', durationMinutes: 60, completed: false },
          { id: 'py-l2', title: 'Functions, *args, **kwargs, Closures & Decorators', durationMinutes: 75, completed: false },
          { id: 'py-l3', title: 'File Handling, JSON Parsing & Regular Expressions', durationMinutes: 70, completed: false },
        ],
        practiceTasks: [
          { id: 'py-p1', title: 'Automated Log File Parser with Regex extraction', difficulty: 'Easy', completed: false },
        ],
        revisionChecklist: [
          { id: 'py-r1', text: 'Explain how Python GIL (Global Interpreter Lock) works', checked: false },
        ],
      },
      {
        id: 'py-m2',
        title: 'Data Analysis with NumPy & Pandas',
        lessons: [
          { id: 'py-l4', title: 'NumPy Ndarray Vectorization & Broadcasting', durationMinutes: 75, completed: false },
          { id: 'py-l5', title: 'Pandas DataFrames, Indexing, GroupBy & Filtering', durationMinutes: 90, completed: false },
          { id: 'py-l6', title: 'Data Cleaning, Handling Missing Values & Outlier Detection', durationMinutes: 80, completed: false },
        ],
        practiceTasks: [
          { id: 'py-p2', title: 'Clean and visualize BCA university marks distribution dataset', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'py-r2', text: 'loc vs iloc behavior on non-consecutive indexed DataFrames', checked: false },
        ],
      },
    ],
  },
  {
    id: 'aiml',
    name: 'AI / Machine Learning',
    shortName: 'AI / ML',
    category: 'specialization',
    color: '#EC4899',
    accentColor: '#8B5CFF',
    iconName: 'Brain',
    description: 'Mathematical foundations, supervised and unsupervised learning, neural networks, and modern GenAI concepts.',
    totalLessons: 40,
    completedLessons: 0,
    modules: [
      {
        id: 'ai-m1',
        title: 'Math for ML & Supervised Algorithms',
        lessons: [
          { id: 'ai-l1', title: 'Vectors, Matrices, Dot Products & Eigenvalues', durationMinutes: 80, completed: false },
          { id: 'ai-l2', title: 'Gradient Descent & Cost Optimization Math', durationMinutes: 80, completed: false },
          { id: 'ai-l3', title: 'Linear & Logistic Regression with Scikit-Learn', durationMinutes: 90, completed: false },
          { id: 'ai-l4', title: 'Decision Trees, Random Forests & Ensemble Methods', durationMinutes: 90, completed: false },
        ],
        practiceTasks: [
          { id: 'ai-p1', title: 'Predict student placement probabilities with logistic regression model', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'ai-r1', text: 'Bias-Variance tradeoff curve and L1/L2 regularization', checked: false },
        ],
      },
      {
        id: 'ai-m2',
        title: 'Neural Networks & Deep Learning Basics',
        lessons: [
          { id: 'ai-l5', title: 'Perceptrons, Activation Functions (ReLU, Sigmoid, Softmax)', durationMinutes: 75, completed: false },
          { id: 'ai-l6', title: 'Forward & Backpropagation with Chain Rule', durationMinutes: 90, completed: false },
          { id: 'ai-l7', title: 'Convolutional Neural Networks (CNNs) for Image Processing', durationMinutes: 90, completed: false },
        ],
        practiceTasks: [
          { id: 'ai-p2', title: 'Train MNIST handwritten digit classifier in PyTorch/Keras', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'ai-r2', text: 'Vanishing gradient problem and how Residual connections solve it', checked: false },
        ],
      },
    ],
  },
  {
    id: 'aptitude',
    name: 'Aptitude & Reasoning',
    shortName: 'Aptitude',
    category: 'career',
    color: '#F59E0B',
    accentColor: '#FBBF24',
    iconName: 'Sparkles',
    description: 'Quantitative aptitude, logical reasoning, verbal ability, and speed-math tricks for campus recruitment tests.',
    totalLessons: 35,
    completedLessons: 0,
    modules: [
      {
        id: 'apt-m1',
        title: 'Quantitative Ability',
        lessons: [
          { id: 'apt-l1', title: 'Percentages, Profit & Loss Shortcuts', durationMinutes: 60, completed: false },
          { id: 'apt-l2', title: 'Time, Speed, Distance & Relative Velocity Problems', durationMinutes: 75, completed: false },
          { id: 'apt-l3', title: 'Permutations, Combinations & Probability Distributions', durationMinutes: 75, completed: false },
        ],
        practiceTasks: [
          { id: 'apt-p1', title: 'Timed 30-question speed quiz on Ratio & Proportion', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'apt-r1', text: 'Derivation of harmonic mean formula for equal distance speed', checked: false },
        ],
      },
      {
        id: 'apt-m2',
        title: 'Logical Reasoning & Data Interpretation',
        lessons: [
          { id: 'apt-l4', title: 'Seating Arrangement (Linear & Circular)', durationMinutes: 70, completed: false },
          { id: 'apt-l5', title: 'Syllogisms & Venn Diagram Deductions', durationMinutes: 60, completed: false },
          { id: 'apt-l6', title: 'Bar Graphs, Pie Charts & Tabular Data Analysis', durationMinutes: 70, completed: false },
        ],
        practiceTasks: [
          { id: 'apt-p2', title: 'Solve 5 complex puzzle sets with multiple constraints', difficulty: 'Hard', completed: false },
        ],
        revisionChecklist: [
          { id: 'apt-r2', text: 'Either/or conditions in 3-premise syllogisms', checked: false },
        ],
      },
    ],
  },
  {
    id: 'university',
    name: 'University Subjects (BCA)',
    shortName: 'University',
    category: 'foundations',
    color: '#8B5CF6',
    accentColor: '#A78BFA',
    iconName: 'BookOpen',
    description: 'Semester curriculum: DBMS, Operating Systems, Computer Architecture, Software Engineering.',
    totalLessons: 40,
    completedLessons: 0,
    modules: [
      {
        id: 'uni-m1',
        title: 'Database Management Systems (DBMS)',
        lessons: [
          { id: 'uni-l1', title: 'ER Modeling, Keys & Relational Schema', durationMinutes: 60, completed: false },
          { id: 'uni-l2', title: 'Advanced SQL: Joins, Subqueries & Window Functions', durationMinutes: 80, completed: false },
          { id: 'uni-l3', title: 'Normalization (1NF, 2NF, 3NF, BCNF) & Anomalies', durationMinutes: 90, completed: false },
          { id: 'uni-l4', title: 'ACID Properties, Transaction Isolation & 2PL', durationMinutes: 75, completed: false },
        ],
        practiceTasks: [
          { id: 'uni-p1', title: 'Design normalized schema for a hospital management database', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'uni-r1', text: 'Lossless join and dependency preserving decomposition tests', checked: false },
        ],
      },
      {
        id: 'uni-m2',
        title: 'Operating Systems Principles',
        lessons: [
          { id: 'uni-l5', title: 'Processes, Threads, PCB & Context Switching', durationMinutes: 75, completed: false },
          { id: 'uni-l6', title: 'CPU Scheduling Algorithms (FCFS, SJF, Round Robin)', durationMinutes: 80, completed: false },
          { id: 'uni-l7', title: 'Virtual Memory, Paging, Page Replacement (LRU, FIFO)', durationMinutes: 85, completed: false },
        ],
        practiceTasks: [
          { id: 'uni-p2', title: 'Simulate LRU and FIFO page fault rates in Python/C++', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'uni-r2', text: 'Belady anomaly in FIFO page replacement algorithm', checked: false },
        ],
      },
    ],
  },
  {
    id: 'projects-placement',
    name: 'Projects & Placement Studio',
    shortName: 'Placement',
    category: 'career',
    color: '#14B8A6',
    accentColor: '#2DD4BF',
    iconName: 'Briefcase',
    description: 'Technical portfolio building, mock interviews, system design and campus recruitment preparation.',
    totalLessons: 30,
    completedLessons: 0,
    modules: [
      {
        id: 'prep-m1',
        title: 'Resume & Professional Presence',
        lessons: [
          { id: 'prep-l1', title: 'Crafting ATS-Compliant Tech Resume with Impact Metrics', durationMinutes: 60, completed: false },
          { id: 'prep-l2', title: 'GitHub Portfolio Optimization & README Architecting', durationMinutes: 60, completed: false },
          { id: 'prep-l3', title: 'LinkedIn Networking & Cold Outreach Strategy', durationMinutes: 50, completed: false },
        ],
        practiceTasks: [
          { id: 'prep-p1', title: 'Rewrite 3 project descriptions using Action Verb + Tech + Outcome formula', difficulty: 'Easy', completed: false },
        ],
        revisionChecklist: [
          { id: 'prep-r1', text: 'Check resume for passive language and missing quantitative metrics', checked: false },
        ],
      },
      {
        id: 'prep-m2',
        title: 'Technical & HR Interview Mastery',
        lessons: [
          { id: 'prep-l4', title: 'Behavioral Questions using STAR (Situation, Task, Action, Result)', durationMinutes: 60, completed: false },
          { id: 'prep-l5', title: 'System Design for College Graduates (URL Shortener, Cache)', durationMinutes: 90, completed: false },
          { id: 'prep-l6', title: 'Live Coding Communication & Thought Process Articulation', durationMinutes: 70, completed: false },
        ],
        practiceTasks: [
          { id: 'prep-p2', title: 'Conduct peer mock interview with 1 DSA question and 1 behavioral scenario', difficulty: 'Medium', completed: false },
        ],
        revisionChecklist: [
          { id: 'prep-r2', text: 'Prepare response for: Tell me about a time you faced a difficult bug and solved it', checked: false },
        ],
      },
    ],
  },
];

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getOffsetDateStr = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'DSA — Arrays & Sliding Window (Lecture 12)',
    subjectId: 'cpp-dsa',
    date: getTodayStr(),
    time: '18:30',
    durationMinutes: 120,
    priority: 'high',
    completed: false,
    notes: 'Cover maximum sum subarray of size K and dynamic sliding window.',
    isRecurringClass: true,
  },
  {
    id: 't-2',
    title: 'Python — Basics & File Automation Practice',
    subjectId: 'python',
    date: getTodayStr(),
    time: '13:00',
    durationMinutes: 60,
    priority: 'medium',
    completed: false,
    notes: 'Write script to parse CSV records into JSON format.',
    isRecurringClass: false,
  },
  {
    id: 't-3',
    title: 'Cybersecurity — Networking & Packet Tracing',
    subjectId: 'cybersecurity',
    date: getTodayStr(),
    time: '16:00',
    durationMinutes: 120,
    priority: 'high',
    completed: false,
    notes: 'Safe Wireshark traffic inspection of DNS lookups.',
    isRecurringClass: true,
  },
  {
    id: 't-4',
    title: 'College Fixed Course Lecture & Lab',
    subjectId: 'university',
    date: getTodayStr(),
    time: '09:00',
    durationMinutes: 420,
    priority: 'medium',
    completed: false,
    notes: 'DBMS lecture and Computer Networks practical lab.',
    isRecurringClass: true,
  },
  {
    id: 't-5',
    title: 'Java — OOPs Concepts & Polymorphism',
    subjectId: 'java',
    date: getOffsetDateStr(1),
    time: '18:30',
    durationMinutes: 120,
    priority: 'high',
    completed: false,
    notes: 'Prepare implementation of virtual method tables & interfaces.',
    isRecurringClass: true,
  },
  {
    id: 't-6',
    title: 'Aptitude — Time, Speed & Distance Drills',
    subjectId: 'aptitude',
    date: getOffsetDateStr(1),
    time: '21:00',
    durationMinutes: 60,
    priority: 'low',
    completed: false,
    notes: 'Solve 20 questions from campus test question bank.',
    isRecurringClass: false,
  },
];

export const initialRoadmapMilestones: RoadmapMilestone[] = [
  // Year 1: Foundations
  {
    id: 'rm-1',
    title: 'C++ & DSA Fundamentals',
    category: 'Foundations',
    status: 'in_progress',
    progress: 0,
    semester: 1,
    year: 1,
  },
  {
    id: 'rm-2',
    title: 'Linux CLI & Git/GitHub',
    category: 'Foundations',
    status: 'in_progress',
    progress: 0,
    semester: 1,
    year: 1,
  },
  {
    id: 'rm-3',
    title: 'Java & Python Basics',
    category: 'Foundations',
    status: 'upcoming',
    progress: 0,
    semester: 2,
    year: 1,
  },
  {
    id: 'rm-4',
    title: 'Computer Fundamentals & Web Basics',
    category: 'Foundations',
    status: 'upcoming',
    progress: 0,
    semester: 2,
    year: 1,
  },

  // Year 2: Specialization
  {
    id: 'rm-5',
    title: 'Intermediate DSA (Trees & Graphs)',
    category: 'DSA & Algorithms',
    status: 'upcoming',
    progress: 0,
    semester: 3,
    year: 2,
  },
  {
    id: 'rm-6',
    title: 'Cybersecurity Fundamentals & Safe Labs',
    category: 'Security Operations',
    status: 'upcoming',
    progress: 0,
    semester: 3,
    year: 2,
  },
  {
    id: 'rm-7',
    title: 'AI / ML Foundations & Math',
    category: 'AI & Data Science',
    status: 'upcoming',
    progress: 0,
    semester: 4,
    year: 2,
  },
  {
    id: 'rm-8',
    title: 'Production Full-Stack Project',
    category: 'Software Engineering',
    status: 'upcoming',
    progress: 0,
    semester: 4,
    year: 2,
  },

  // Year 3: Career Readiness
  {
    id: 'rm-9',
    title: 'Advanced DSA Interview Patterns',
    category: 'Placement Prep',
    status: 'upcoming',
    progress: 0,
    semester: 5,
    year: 3,
  },
  {
    id: 'rm-10',
    title: 'Resume & GitHub Portfolio Polish',
    category: 'Career Launch',
    status: 'upcoming',
    progress: 0,
    semester: 5,
    year: 3,
  },
  {
    id: 'rm-11',
    title: 'Mock Technical & Behavioral Interviews',
    category: 'Placement Prep',
    status: 'upcoming',
    progress: 0,
    semester: 6,
    year: 3,
  },
  {
    id: 'rm-12',
    title: 'Campus & Off-Campus Job Applications',
    category: 'Career Launch',
    status: 'upcoming',
    progress: 0,
    semester: 6,
    year: 3,
  },
];

export const initialCybersecurityModules: CybersecurityModule[] = [
  {
    id: 'cs-mod-1',
    order: 1,
    title: 'Networking Fundamentals & Packet Inspection',
    status: 'in_progress',
    objectives: [
      'Understand OSI 7-Layer and TCP/IP stack mapping',
      'Learn IP addressing, CIDR subnetting, and routing concepts',
      'Explore common network tools (ping, traceroute, dig, netstat)',
      'Inspect packet captures safely with Wireshark',
    ],
    labs: [
      {
        id: 'cs-lab-1',
        title: 'Wireshark Safe Packet Trace',
        scenario: 'Analyze local loopback HTTP vs HTTPS connection to observe TLS encryption in action.',
        safeLabCommandOrTool: 'wireshark -i lo -k -Y "http or tls"',
        completed: false,
        difficulty: 'Beginner',
      },
      {
        id: 'cs-lab-2',
        title: 'DNS Resolution Investigation',
        scenario: 'Query authoritative name servers using dig to trace DNS resolution chain.',
        safeLabCommandOrTool: 'dig +trace horizon.edu',
        completed: false,
        difficulty: 'Beginner',
      },
    ],
    notes: 'Ready to audit local loopback traffic.',
  },
  {
    id: 'cs-mod-2',
    order: 2,
    title: 'Linux & Command Line Hardening',
    status: 'upcoming',
    objectives: [
      'Master Linux filesystem hierarchy, /etc permissions, and secure sudo config',
      'Analyze SUID/SGID executable flags and privilege boundaries',
      'Configure UFW firewall rules to block unauthorized inbound ports',
      'Automate authentication log monitoring with Bash',
    ],
    labs: [
      {
        id: 'cs-lab-3',
        title: 'SUID Binary Audit',
        scenario: 'Find all executables on a local Linux test container with the setuid permission bit set.',
        safeLabCommandOrTool: 'find / -perm -4000 -type f 2>/dev/null',
        completed: false,
        difficulty: 'Intermediate',
      },
      {
        id: 'cs-lab-4',
        title: 'UFW Firewall Rule Policy',
        scenario: 'Set default deny for incoming traffic and only permit SSH and HTTPS.',
        safeLabCommandOrTool: 'sudo ufw default deny incoming && sudo ufw allow 22/tcp',
        completed: false,
        difficulty: 'Intermediate',
      },
    ],
    notes: '',
  },
  {
    id: 'cs-mod-3',
    order: 3,
    title: 'Python Scripting for Security Analysis',
    status: 'upcoming',
    objectives: [
      'Write safe socket scanners to audit open ports on local host',
      'Parse Apache/Nginx web server access logs for repeated 404/403 bursts',
      'Hash integrity checker using Python hashlib (SHA-256 baseline verification)',
    ],
    labs: [
      {
        id: 'cs-lab-5',
        title: 'SHA-256 File Integrity Monitor',
        scenario: 'Create a Python script that hashes sensitive files in a folder and alerts on alterations.',
        safeLabCommandOrTool: 'python3 integrity_checker.py --watch /safe-lab/config/',
        completed: false,
        difficulty: 'Intermediate',
      },
    ],
    notes: '',
  },
  {
    id: 'cs-mod-4',
    order: 4,
    title: 'Web Application Security & OWASP Top 10',
    status: 'upcoming',
    objectives: [
      'Understand SQL Injection vulnerabilities and parameterized queries',
      'Mitigate Reflected and Stored Cross-Site Scripting (XSS)',
      'Analyze insecure direct object references (IDOR)',
      'Implement strict Content Security Policy (CSP) headers',
    ],
    labs: [
      {
        id: 'cs-lab-6',
        title: 'OWASP Juice Shop Safe Docker Lab',
        scenario: 'Practice identifying input sanitization issues inside an isolated offline Docker instance.',
        safeLabCommandOrTool: 'docker run --rm -p 3000:3000 bkimminich/juice-shop',
        completed: false,
        difficulty: 'Intermediate',
      },
    ],
    notes: '',
  },
  {
    id: 'cs-mod-5',
    order: 5,
    title: 'Defensive Security & Threat Detection',
    status: 'upcoming',
    objectives: [
      'Explore SIEM concepts and centralized log analysis',
      'Understand Snort/Suricata network intrusion detection rules',
      'Analyze incident response lifecycle (NIST SP 800-61)',
    ],
    labs: [],
    notes: '',
  },
];

export const initialAIModules: AIModule[] = [
  {
    id: 'ai-mod-1',
    order: 1,
    title: 'Python Foundations for AI & Data Science',
    status: 'in_progress',
    objectives: [
      'Vector operations with NumPy',
      'Data manipulation and cleaning with Pandas',
      'Data visualization with Matplotlib & Seaborn',
    ],
    keyConcepts: ['Broadcasting', 'Vectorization', 'Data Imputation', 'One-Hot Encoding'],
    labs: [
      { id: 'ai-l-1', title: 'Vectorized Matrix Dot-Product Benchmark', completed: false },
      { id: 'ai-l-2', title: 'Data Cleaning Pipeline on Missing College Grades', completed: false },
    ],
    projectIdea: 'Student Performance & Attendance Correlator',
  },
  {
    id: 'ai-mod-2',
    order: 2,
    title: 'Mathematics & Optimization for Machine Learning',
    status: 'upcoming',
    objectives: [
      'Linear algebra: matrices, eigenvectors, singular value decomposition',
      'Multivariate calculus: gradients, partial derivatives, chain rule',
      'Probability & statistics: Bayes theorem, normal distributions, p-values',
    ],
    keyConcepts: ['Gradient Descent', 'Convex Optimization', 'Loss Functions', 'Learning Rate Scheduling'],
    labs: [
      { id: 'ai-l-3', title: 'Implement Gradient Descent from Scratch in Pure Python', completed: false },
      { id: 'ai-l-4', title: 'Loss Surface 3D Visualization', completed: false },
    ],
    projectIdea: 'Interactive Cost Function Visualizer',
  },
  {
    id: 'ai-mod-3',
    order: 3,
    title: 'Classical Machine Learning (Scikit-Learn)',
    status: 'upcoming',
    objectives: [
      'Linear & Logistic Regression with regularization (Lasso & Ridge)',
      'Decision Trees, Random Forests, and Gradient Boosted Trees (XGBoost)',
      'Unsupervised K-Means clustering & Principal Component Analysis (PCA)',
      'Model evaluation: Precision, Recall, F1-Score, ROC-AUC curve',
    ],
    keyConcepts: ['Cross-Validation', 'Hyperparameter Tuning', 'Overfitting Prevention', 'Confusion Matrix'],
    labs: [
      { id: 'ai-l-5', title: 'Predict Student Placement Eligibility using Random Forest', completed: false },
    ],
    projectIdea: 'Campus Placement Predictor with Feature Importance Explanations',
  },
  {
    id: 'ai-mod-4',
    order: 4,
    title: 'Neural Networks & Deep Learning Foundations',
    status: 'upcoming',
    objectives: [
      'Multi-layer perceptron architecture',
      'Activation functions: ReLU, Leaky ReLU, Softmax',
      'Backpropagation algorithm derivation',
      'Intro to PyTorch tensors and autograd',
    ],
    keyConcepts: ['Weights & Biases', 'Epochs & Batches', 'Dropout', 'Adam Optimizer'],
    labs: [],
    projectIdea: 'Handwritten Digit Recognizer in PyTorch',
  },
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'BCA Career Planner (Horizon)',
    description: 'A futuristic command-center dashboard for scheduling, DSA roadmap tracking, safe cybersecurity labs, and placement preparation.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    status: 'Planned',
    category: 'web',
    progress: 0,
    tasks: [
      { id: 'pt-1', title: 'Cinematic cosmic splash screen', completed: false },
      { id: 'pt-2', title: 'Guided multi-step mission setup onboarding', completed: false },
      { id: 'pt-3', title: 'Study planner with time orchestration', completed: false },
      { id: 'pt-4', title: 'Cybersecurity operations console', completed: false },
      { id: 'pt-5', title: 'Placement preparation tracker & analytics', completed: false },
    ],
    startDate: getTodayStr(),
    dueDate: getOffsetDateStr(60),
    githubUrl: '',
    liveUrl: '',
  },
];

export const initialPlacementTracker: PlacementTracker = {
  dsaTarget: 200,
  dsaSolved: 0,
  dsaCategories: [
    { name: 'Arrays & Hashing', solved: 0, total: 25 },
    { name: 'Two Pointers & Sliding Window', solved: 0, total: 20 },
    { name: 'Linked Lists', solved: 0, total: 15 },
    { name: 'Stack & Queues', solved: 0, total: 15 },
    { name: 'Trees & BST', solved: 0, total: 30 },
    { name: 'Graphs', solved: 0, total: 25 },
    { name: 'Dynamic Programming', solved: 0, total: 35 },
  ],
  aptitudeModules: [
    { id: 'apt-1', title: 'Time, Speed & Distance', completed: false },
    { id: 'apt-2', title: 'Profit, Loss & Percentages', completed: false },
    { id: 'apt-3', title: 'Ratio, Proportion & Variations', completed: false },
    { id: 'apt-4', title: 'Permutations, Combinations & Probability', completed: false },
    { id: 'apt-5', title: 'Logical Deductions & Syllogisms', completed: false },
    { id: 'apt-6', title: 'Circular & Linear Seating Arrangements', completed: false },
    { id: 'apt-7', title: 'Data Interpretation (Bar & Pie Charts)', completed: false },
  ],
  technicalTopics: [
    { id: 'tt-1', title: 'DBMS: SQL Joins & Subqueries', completed: false, category: 'DBMS' },
    { id: 'tt-2', title: 'DBMS: Normalization (1NF to BCNF)', completed: false, category: 'DBMS' },
    { id: 'tt-3', title: 'DBMS: ACID & Transaction Isolation Levels', completed: false, category: 'DBMS' },
    { id: 'tt-4', title: 'OS: Process vs Thread & Context Switching', completed: false, category: 'Operating Systems' },
    { id: 'tt-5', title: 'OS: CPU Scheduling (Round Robin, SJF)', completed: false, category: 'Operating Systems' },
    { id: 'tt-6', title: 'OS: Deadlocks & Banker Algorithm', completed: false, category: 'Operating Systems' },
    { id: 'tt-7', title: 'CN: TCP 3-Way Handshake & Teardown', completed: false, category: 'Computer Networks' },
    { id: 'tt-8', title: 'CN: DNS & HTTP/HTTPS Protocols', completed: false, category: 'Computer Networks' },
    { id: 'tt-9', title: 'OOP: Polymorphism, Virtual Functions & VTables', completed: false, category: 'OOP Concepts' },
  ],
  resumeChecklist: [
    { id: 'rc-1', text: 'Clean single-page ATS-compliant format (Overleaf LaTeX or clean layout)', completed: false },
    { id: 'rc-2', text: 'All project descriptions follow Action Verb + Technology + Outcome pattern', completed: false },
    { id: 'rc-3', text: 'GitHub profile pinned with top 3 projects having descriptive READMEs', completed: false },
    { id: 'rc-4', text: 'LeetCode / GeeksForGeeks problem profile linked with active streak', completed: false },
    { id: 'rc-5', text: 'LinkedIn profile headline updated with target role (e.g., Software Engineering Trainee)', completed: false },
    { id: 'rc-6', text: 'PDF version tested with ATS parser score > 80%', completed: false },
  ],
  mockInterviews: [],
  jobApplications: [],
};

export const initialYouTubeLectures = [
  {
    id: 'yt-1',
    title: "Striver's A2Z DSA Complete Roadmap & Masterclass",
    videoId: 'EAR7De6G0HY',
    url: 'https://www.youtube.com/watch?v=EAR7De6G0HY',
    category: 'DSA & Algorithms',
    channel: 'take U forward',
    duration: '1h 45m',
    notes: 'Covers step-by-step roadmap from Arrays to Graphs & Dynamic Programming.',
  },
  {
    id: 'yt-2',
    title: 'CS50P: Harvard Introduction to Programming with Python',
    videoId: 'nLRL_NcnK-4',
    url: 'https://www.youtube.com/watch?v=nLRL_NcnK-4',
    category: 'Python',
    channel: 'CS50',
    duration: '15h 57m',
    notes: 'Functions, variables, conditionals, loops, exceptions, libraries, unit tests, file I/O, regex, OOP.',
  },
  {
    id: 'yt-3',
    title: 'Full Stack Web Development: Modern Architecture',
    videoId: 'nu_pCVPKzTk',
    url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
    category: 'Web Dev',
    channel: 'freeCodeCamp.org',
    duration: '8h 20m',
    notes: 'Frontend React, TypeScript, backend Express REST APIs, database persistence.',
  },
  {
    id: 'yt-4',
    title: 'Practical Ethical Hacking & Kali Linux Mastery',
    videoId: '3Kq1MIfTWCE',
    url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    category: 'Cybersecurity',
    channel: 'NetworkChuck',
    duration: '3h 12m',
    notes: 'Network reconnaissance, port scanning with nmap, Wireshark packet inspection, password hashing.',
  },
  {
    id: 'yt-5',
    title: 'Operating Systems: Architecture & Process Management',
    videoId: 'vBURTt97EkA',
    url: 'https://www.youtube.com/watch?v=vBURTt97EkA',
    category: 'Core CS',
    channel: 'Neso Academy',
    duration: '2h 10m',
    notes: 'CPU scheduling, threads vs processes, memory virtual memory paging, deadlock prevention.',
  },
  {
    id: 'yt-6',
    title: 'SQL & Relational Database Design Intensive',
    videoId: 'HXV3zeQKqGY',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    category: 'DBMS',
    channel: 'freeCodeCamp.org',
    duration: '4h 15m',
    notes: 'Relational algebra, indexes, B-Trees, normalization rules (1NF-BCNF), ACID transaction guarantees.',
  },
];

export const initialFocusSessions: FocusSession[] = [];

import { CURATED_PLAYLISTS } from '../data/curatedPlaylists';
export const initialYouTubePlaylists: YouTubePlaylist[] = CURATED_PLAYLISTS;

