import React, { useState } from 'react';
import {
  FileCode2,
  Search,
  Copy,
  Check,
  Star,
  Bookmark,
  Sparkles,
  Database,
  Layers,
  Cpu,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Code2,
  Terminal,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export interface CheatItem {
  id: string;
  category: 'dsa' | 'sql' | 'system_design' | 'os_networks' | 'hr_star';
  title: string;
  badge: string;
  complexity?: string;
  description: string;
  codeOrFormula: string;
  keyTakeaway: string;
  interviewerTip: string;
}

const CHEAT_ITEMS: CheatItem[] = [
  // DSA PATTERNS
  {
    id: 'dsa-1',
    category: 'dsa',
    title: 'Sliding Window (Dynamic Size)',
    badge: 'DSA Pattern',
    complexity: 'O(N) Time · O(K) Space',
    description: 'Used for subarray/substring problems looking for maximum, minimum, or target condition.',
    codeOrFormula: `def minSubArrayLen(target, nums):
    left = 0
    curr_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        curr_sum += nums[right]
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= nums[left]
            left += 1
            
    return min_len if min_len != float('inf') else 0`,
    keyTakeaway: 'The right pointer expands the window; the while loop contracts the left pointer until valid condition restores.',
    interviewerTip: 'Mention each element enters and leaves the window at most once, proving linear O(N) runtime.'
  },
  {
    id: 'dsa-2',
    category: 'dsa',
    title: 'Binary Search on Answer Space',
    badge: 'DSA Pattern',
    complexity: 'O(N log(Max-Min)) Time',
    description: 'When the search space is monotonic (e.g., Koko Eating Bananas, Capacity to Ship Packages).',
    codeOrFormula: `def shipWithinDays(weights, days):
    low = max(weights)          # Min capacity needed
    high = sum(weights)         # Max capacity needed
    
    def feasible(cap):
        d, curr = 1, 0
        for w in weights:
            if curr + w > cap:
                d += 1
                curr = 0
            curr += w
        return d <= days

    while low < high:
        mid = (low + high) // 2
        if feasible(mid):
            high = mid         # Try smaller capacity
        else:
            low = mid + 1      # Needs more capacity
    return low`,
    keyTakeaway: 'Condition: If a capacity C works, every capacity > C also works. Binary search over range [max(arr), sum(arr)].',
    interviewerTip: 'Identify monotonicity: "If f(x) is monotonic, convert an optimization problem into a decision problem."'
  },
  {
    id: 'dsa-3',
    category: 'dsa',
    title: 'Monotonic Stack (Next Greater Element)',
    badge: 'DSA Pattern',
    complexity: 'O(N) Time · O(N) Space',
    description: 'Solves "Find next greater/smaller element" or "Largest Rectangle in Histogram" in single pass.',
    codeOrFormula: `def nextGreaterElements(nums):
    res = [-1] * len(nums)
    stack = []  # Stores indices
    
    for i in range(len(nums)):
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            res[idx] = nums[i]
        stack.append(i)
        
    return res`,
    keyTakeaway: 'Maintain stack in descending order. When a larger number arrives, pop all smaller elements.',
    interviewerTip: 'Highlight why naive approach is O(N^2) while monotonic stack reduces it to amortized O(N).'
  },
  {
    id: 'dsa-4',
    category: 'dsa',
    title: 'Fast & Slow Pointers (Floyd Cycle)',
    badge: 'DSA Pattern',
    complexity: 'O(N) Time · O(1) Space',
    description: 'Detects cycles in linked lists, finds the midpoint, or identifies the cycle entry point.',
    codeOrFormula: `def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:       # Collision detected
            # Reset one pointer to head to find entry
            entry = head
            while entry != slow:
                entry = entry.next
                slow = slow.next
            return entry
    return None`,
    keyTakeaway: 'Distance from head to cycle start equals distance from collision node to cycle start modulo cycle length.',
    interviewerTip: 'Explain mathematical proof: 2 * (F + a) = F + n*C + a  =>  F = n*C - a.'
  },

  // SQL & DBMS CHEAT SHEET
  {
    id: 'sql-1',
    category: 'sql',
    title: 'Top N Salaries Per Department (DENSE_RANK)',
    badge: 'SQL Window Func',
    complexity: 'Single Pass Windowing',
    description: 'Frequently asked by Amazon, Microsoft, and Uber in placement rounds.',
    codeOrFormula: `WITH RankedSalaries AS (
    SELECT 
        dept_id,
        emp_name,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY dept_id 
            ORDER BY salary DESC
        ) AS rank_order
    FROM employees
)
SELECT dept_id, emp_name, salary
FROM RankedSalaries
WHERE rank_order <= 3;`,
    keyTakeaway: 'Use DENSE_RANK() instead of RANK() so tied salaries do not skip ranks (1, 1, 2 vs 1, 1, 3).',
    interviewerTip: 'Explain PARTITION BY splits data logically while ORDER BY dictates window evaluation inside each partition.'
  },
  {
    id: 'sql-2',
    category: 'sql',
    title: 'Month-Over-Month Growth Rate (LAG Window)',
    badge: 'SQL Analytics',
    complexity: 'Analytical Query',
    description: 'Calculates percentage change compared to the previous row in sequential time series.',
    codeOrFormula: `SELECT 
    revenue_month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY revenue_month) AS prev_month_revenue,
    ROUND(
        ((revenue - LAG(revenue, 1) OVER (ORDER BY revenue_month)) * 100.0) / 
        LAG(revenue, 1) OVER (ORDER BY revenue_month), 
        2
    ) AS mom_growth_percent
FROM monthly_sales;`,
    keyTakeaway: 'LAG(column, offset, default) fetches value from the preceding row without expensive self-joins.',
    interviewerTip: 'Demonstrate performance: Window function runs in O(N log N) sort vs O(N^2) Cartesian self-join.'
  },
  {
    id: 'sql-3',
    category: 'sql',
    title: 'Index Design & SARGable Queries',
    badge: 'DBMS Architecture',
    complexity: 'B-Tree Indexing',
    description: 'How to write queries that utilize indexes instead of triggering full table scans.',
    codeOrFormula: `-- NON-SARGABLE (Index cannot be used! Triggers Full Table Scan):
SELECT * FROM users WHERE YEAR(created_at) = 2026;

-- SARGABLE (Optimized B-Tree Range Scan!):
SELECT * FROM users 
WHERE created_at >= '2026-01-01' 
  AND created_at < '2027-01-01';`,
    keyTakeaway: 'Avoid wrapping indexed columns inside functions like LOWER(name) or YEAR(date) because the index tree cannot compute the expression ahead of time.',
    interviewerTip: 'Explain Composite Indexes: Index on (A, B) supports WHERE A=1 AND B=2 or WHERE A=1, but NOT WHERE B=2 alone (Leftmost Prefix Rule).'
  },

  // SYSTEM DESIGN & ARCHITECTURE
  {
    id: 'sd-1',
    category: 'system_design',
    title: 'Latency Numbers Every Engineer Must Know',
    badge: 'System Design',
    complexity: 'Hardware Telemetry',
    description: 'Hardware latency benchmarks to justify architecture choices in system design rounds.',
    codeOrFormula: `L1 Cache Reference:             ~0.5 ns
L2 Cache Reference:             ~7 ns
Main Memory (RAM) Read:         ~100 ns
SSD Sequential Read:            ~16,000 ns   (16 microseconds)
Read 1 MB sequentially from RAM:~250,000 ns  (250 microseconds)
SSD Random Read:                ~150,000 ns  (150 microseconds)
Cross-Datacenter RTT (SF to NY):~65,000,000 ns (65 ms)`,
    keyTakeaway: 'RAM is ~1000x faster than disk. Network calls across regions are 100,000x slower than local memory lookups.',
    interviewerTip: 'Use these numbers to explain why Redis in-memory cache is placed in front of relational databases.'
  },
  {
    id: 'sd-2',
    category: 'system_design',
    title: 'Consistent Hashing with Virtual Nodes',
    badge: 'Distributed Systems',
    complexity: 'O(log N) Server Lookup',
    description: 'Minimizes key reallocation when cache servers are added or removed in distributed clusters.',
    codeOrFormula: `1. Map Hash Ring from 0 to 2^32 - 1.
2. Hash server nodes to positions on the ring: hash(server_ip).
3. Hash object keys to positions: hash(key).
4. Assign key to the first server encountered moving clockwise.
5. Virtual Nodes: Assign each physical server 100-300 virtual tokens 
   (e.g., hash('ServerA_#1'), hash('ServerA_#2')) to ensure uniform key balance.`,
    keyTakeaway: 'When a node crashes, only K/N keys are moved instead of re-hashing all keys as in traditional (hash % N).',
    interviewerTip: 'Mention DynamoDB and Apache Cassandra use Consistent Hashing with virtual tokens for partition management.'
  },
  {
    id: 'sd-3',
    category: 'system_design',
    title: 'Cache Invalidation & Write Policies',
    badge: 'System Design',
    complexity: 'Concurrency & Consistency',
    description: 'How to maintain consistency between distributed cache (Redis) and persistent storage (DB).',
    codeOrFormula: `1. Cache-Aside (Lazy Loading):
   App checks cache. If miss -> read DB -> write to cache -> return.
   
2. Write-Through:
   App writes to Cache -> Cache synchronously writes to DB. High consistency.
   
3. Write-Back (Write-Behind):
   App writes to Cache -> returns immediately -> async batch flush to DB.
   (Ultra high throughput, but risk of data loss on crash).
   
4. Cache Stampede Mitigation:
   Use mutex lock or Probabilistic Early Expiration (XFetch algorithm).`,
    keyTakeaway: 'Cache-Aside is the default for read-heavy apps. Always invalidate (DELETE) cache key instead of updating it on DB write to avoid race conditions.',
    interviewerTip: 'Explain why: Two concurrent writes updating cache might execute out of order, leaving stale data.'
  },

  // CORE OS & NETWORKS
  {
    id: 'os-1',
    category: 'os_networks',
    title: 'What Happens When You Type "google.com"?',
    badge: 'Networking Flow',
    complexity: 'End-to-End Walkthrough',
    description: 'The #1 classic interview question across all technical placement screening rounds.',
    codeOrFormula: `1. Browser checks cache: Browser Cache -> OS Cache -> Router Cache.
2. DNS Resolution: Query Recursive Resolver -> Root Server (.) -> TLD (.com) -> Authoritative Nameserver.
3. TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK.
4. TLS 1.3 Handshake: ClientHello -> ServerHello + Cert -> Key Agreement -> Finished.
5. HTTP GET Request sent over encrypted tunnel.
6. Server processes request through Load Balancer -> App Server -> DB.
7. Server returns HTTP 200 OK with HTML payload.
8. Browser parsing: DOM Tree + CSSOM Tree -> Render Tree -> Layout -> Painting.`,
    keyTakeaway: 'Structure your answer cleanly in 4 stages: DNS Resolution, Network Connection (TCP/TLS), Server Processing, and Client Rendering.',
    interviewerTip: 'Mention TLS 1.3 reduces the cryptographic handshake to 1-RTT compared to 2-RTT in TLS 1.2.'
  },
  {
    id: 'os-2',
    category: 'os_networks',
    title: 'The 4 Necessary Conditions for Deadlock',
    badge: 'Operating Systems',
    complexity: 'Concurrency Theory',
    description: 'The Coffman conditions required for a system deadlock to occur and how to break them.',
    codeOrFormula: `1. Mutual Exclusion:
   At least one resource must be held in non-shareable mode.
   
2. Hold and Wait:
   A process is holding at least one resource and requesting additional resources.
   
3. No Preemption:
   Resources cannot be forcibly confiscated from a process holding them.
   
4. Circular Wait:
   A closed chain of processes exists, where each holds a resource needed by the next.

BREAKING DEADLOCK:
- Impose total ordering on all resources (breaks Circular Wait).
- Process must acquire all resources simultaneously (breaks Hold and Wait).`,
    keyTakeaway: 'Breaking any SINGLE one of these 4 conditions guarantees deadlock prevention.',
    interviewerTip: 'Cite practical example: Strict lock ordering in database engines prevents circular wait.'
  },

  // BEHAVIORAL & HR (STAR FORMULA)
  {
    id: 'hr-1',
    category: 'hr_star',
    title: 'Technical Disagreement with a Teammate',
    badge: 'STAR Behavioral',
    complexity: 'Conflict Resolution',
    description: 'How to answer questions about technical friction, code reviews, or design debates.',
    codeOrFormula: `[SITUATION]:
During our capstone project, my teammate wanted to use MongoDB while I advocated for PostgreSQL.
[TASK]:
We needed to decide our database stack within 48 hours to avoid delaying our sprint delivery.
[ACTION]:
Instead of arguing subjective opinions, I proposed a 2-hour benchmark spike:
- We modeled our relational user-order schema in both.
- I demonstrated that our queries required multi-table ACID transactions and JOINs.
- I listened to his concern about schema flexibility and showed how Postgres JSONB fields satisfy both requirements.
[RESULT]:
He agreed to adopt PostgreSQL with JSONB. We finished the sprint 2 days early with zero data inconsistency bugs.`,
    keyTakeaway: 'Focus on data-driven decision making, respectful listening, and shared team outcomes rather than "winning" the argument.',
    interviewerTip: 'Never speak negatively about a peer. Emphasize that diverse perspectives strengthen engineering solutions.'
  },
  {
    id: 'hr-2',
    category: 'hr_star',
    title: 'Handling a Missed Deadline or Production Bug',
    badge: 'STAR Behavioral',
    complexity: 'Accountability & Ownership',
    description: 'Demonstrating extreme ownership, rapid remediation, and post-mortem root cause analysis.',
    codeOrFormula: `[SITUATION]:
During my internship, a caching change I deployed caused stale user permissions for 12 minutes.
[TASK]:
I had to restore service immediately and prevent recurrence without hiding the issue.
[ACTION]:
- I immediately alerted the engineering on-call channel, took full ownership, and initiated a 1-click rollback.
- Within 15 minutes, service was restored.
- I wrote a blameless post-mortem document explaining the root cause (missing cache invalidation on role update).
- I added automated end-to-end integration tests to CI/CD verifying permission updates across cached endpoints.
[RESULT]:
Zero customer data was compromised. The engineering lead commended my transparency and adopted my post-mortem test suite into the main deployment gate.`,
    keyTakeaway: 'Three steps: 1) Rapid mitigation, 2) Complete accountability (no finger pointing), 3) Long-term preventive safeguards.',
    interviewerTip: 'Companies look for resilience and mature learning loops when candidates discuss mistakes.'
  }
];

export const CheatSheetView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lew_cheatsheet_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['dsa-1', 'sql-1', 'sd-1'];
  });
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const categories = [
    { id: 'all', label: 'All Cheats', icon: Sparkles },
    { id: 'dsa', label: 'DSA Patterns', icon: Code2 },
    { id: 'sql', label: 'SQL & DBMS', icon: Database },
    { id: 'system_design', label: 'System Design', icon: Layers },
    { id: 'os_networks', label: 'OS & Networks', icon: Cpu },
    { id: 'hr_star', label: 'HR STAR Templates', icon: MessageSquare },
  ];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((b) => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('lew_cheatsheet_bookmarks', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredItems = CHEAT_ITEMS.filter((item) => {
    if (onlyBookmarks && !bookmarkedIds.includes(item.id)) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.codeOrFormula.toLowerCase().includes(q) ||
        item.keyTakeaway.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>High-Yield Placement Vault</span>
            <span>·</span>
            <span className="text-indigo-400 font-semibold">Instant Interview Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 flex items-center space-x-2">
            <span>Placement Master Cheat Sheet</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold font-mono">
              2026 Edition
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Essential code templates, SQL analytical queries, distributed architecture formulas, and STAR behavioral blueprints to revise right before your interview.
          </p>
        </div>

        {/* Bookmarks Toggle Pill */}
        <div className="flex items-center space-x-2 self-start md:self-center">
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              onlyBookmarks
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarks ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>Saved ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter Track */}
      <div className="space-y-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patterns (e.g., Sliding Window, DENSE_RANK, CAP Theorem, Latency, STAR)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Cheat Sheet Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
          <FileCode2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No cheat sheet templates match your search</p>
          <p className="text-xs">Try searching for keywords like "Window", "Stack", "Latency", or "STAR".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyBookmarks(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredItems.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm hover:border-slate-750 transition-all"
              >
                {/* Item Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.badge}
                    </span>
                    <h3 className="font-bold text-base text-white">{item.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.complexity && (
                      <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                        {item.complexity}
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark formula'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyCode(item.id, item.codeOrFormula)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Copy code to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Syntax Code / Blueprint Container */}
                <div className="relative rounded-2xl bg-slate-950 border border-slate-800/90 p-4 font-mono text-xs overflow-x-auto text-slate-200">
                  <pre className="leading-relaxed selection:bg-indigo-500 selection:text-white">
                    <code>{item.codeOrFormula}</code>
                  </pre>
                </div>

                {/* Key Takeaway & Interviewer Tip Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 flex items-center space-x-1.5 text-[11px]">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>Key Takeaway:</span>
                    </span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {item.keyTakeaway}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center space-x-1.5 text-[11px]">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Interviewer Expectation:</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {item.interviewerTip}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
