import { LeetCodeProblem } from '../types/leetcode';

export const INITIAL_LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    id: 'two-sum',
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptanceRate: '52.8%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Your O(N) hash map solution here
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0, 1]' },
      { input: 'nums = [1,5,8,12,19], target = 20', expected: '[0, 4]', isHidden: true },
      { input: 'nums = [-3,4,3,90], target = 0', expected: '[0, 2]', isHidden: true },
    ],
    socraticHints: [
      'What happens if you check every single pair (O(N^2))? Can we do faster with extra space?',
      'If you are standing at number X, what exact number Y are you looking for to hit target?',
      'What data structure gives you O(1) average lookup time to check if you have seen number Y before?',
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(N)',
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Sliding Window',
    acceptanceRate: '54.2%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Amazon', 'Meta', 'Google', 'Microsoft'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    starterCode: {
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit
`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int p : prices) {
            minPrice = std::min(minPrice, p);
            maxProfit = std::max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) minPrice = price;
            else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
        }
        return maxProfit;
    }
}`,
    },
    testCases: [
      { input: 'prices = [7,1,5,3,6,4]', expected: '5' },
      { input: 'prices = [7,6,4,3,1]', expected: '0' },
      { input: 'prices = [2,4,1]', expected: '2' },
      { input: 'prices = [3,2,6,5,0,3]', expected: '4', isHidden: true },
    ],
    socraticHints: [
      'As you iterate from left to right, what is the best possible price to have bought at in the past?',
      'Can you maintain the running minimum buy price in a single pass?',
      'If you sell today at prices[i], what is the net profit relative to your minimum buy price?',
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(1)',
  },
  {
    id: 'lru-cache',
    number: 146,
    title: 'LRU Cache',
    difficulty: 'Medium',
    category: 'Linked List',
    acceptanceRate: '42.1%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict** the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    starterCode: {
      python: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # key -> node
        self.left, self.right = Node(), Node()
        self.left.next, self.right.prev = self.right, self.left

    def _remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _insert(self, node):
        prev, nxt = self.right.prev, self.right
        prev.next = nxt.prev = node
        node.next, node.prev = nxt, prev

    def get(self, key: int) -> int:
        if key in self.cache:
            self._remove(self.cache[key])
            self._insert(self.cache[key])
            return self.cache[key].val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.left.next
            self._remove(lru)
            del self.cache[lru.key]
`,
      cpp: `#include <unordered_map>

class LRUCache {
    struct Node {
        int key, val;
        Node *prev, *next;
        Node(int k=0, int v=0): key(k), val(v), prev(nullptr), next(nullptr) {}
    };
    int cap;
    std::unordered_map<int, Node*> map;
    Node *head, *tail;
public:
    LRUCache(int capacity) : cap(capacity) {
        head = new Node(); tail = new Node();
        head->next = tail; tail->prev = head;
    }
    int get(int key) {
        if (!map.count(key)) return -1;
        Node* node = map[key];
        remove(node);
        insert(node);
        return node->val;
    }
    void put(int key, int value) {
        if (map.count(key)) remove(map[key]);
        Node* node = new Node(key, value);
        map[key] = node;
        insert(node);
        if (map.size() > cap) {
            Node* lru = head->next;
            remove(lru);
            map.erase(lru->key);
            delete lru;
        }
    }
private:
    void remove(Node* n) {
        n->prev->next = n->next;
        n->next->prev = n->prev;
    }
    void insert(Node* n) {
        Node* prev = tail->prev;
        prev->next = n; n->prev = prev;
        n->next = tail; tail->prev = n;
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private int capacity;
    private Map<Integer, Node> map = new HashMap<>();
    private Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        remove(n); insert(n);
        return n.val;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        Node n = new Node(key, value);
        map.put(key, n);
        insert(n);
        if (map.size() > capacity) {
            Node lru = head.next;
            remove(lru);
            map.remove(lru.key);
        }
    }
    private void remove(Node n) {
        n.prev.next = n.next; n.next.prev = n.prev;
    }
    private void insert(Node n) {
        Node prev = tail.prev;
        prev.next = n; n.prev = prev;
        n.next = tail; tail.prev = n;
    }
}`,
    },
    testCases: [
      { input: 'capacity=2, ops: put(1,1), put(2,2), get(1), put(3,3), get(2)', expected: '[null, null, 1, null, -1]' },
      { input: 'capacity=1, ops: put(2,1), get(2), put(3,2), get(2)', expected: '[null, 1, null, -1]' },
      { input: 'capacity=3, ops: put(1,1), put(2,2), put(3,3), put(4,4), get(1)', expected: '[null, null, null, null, -1]', isHidden: true },
    ],
    socraticHints: [
      'To get O(1) key access, what data structure is necessary? (Hash Map)',
      'To get O(1) removal of the least recently used element and O(1) moving an element to the front, what data structure works best? (Doubly Linked List)',
      'How can sentinel dummy head and tail nodes eliminate tricky edge cases?',
    ],
    timeComplexityOptimal: 'O(1) for both get and put',
    spaceComplexityOptimal: 'O(Capacity)',
  },
  {
    id: 'trapping-rain-water',
    number: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    acceptanceRate: '61.4%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height: return 0
        l, r = 0, len(height) - 1
        left_max, right_max = height[l], height[r]
        water = 0
        while l < r:
            if left_max < right_max:
                l += 1
                left_max = max(left_max, height[l])
                water += left_max - height[l]
            else:
                r -= 1
                right_max = max(right_max, height[r])
                water += right_max - height[r]
        return water
`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        if (height.empty()) return 0;
        int l = 0, r = height.size() - 1;
        int leftMax = height[l], rightMax = height[r];
        int water = 0;
        while (l < r) {
            if (leftMax < rightMax) {
                l++;
                leftMax = std::max(leftMax, height[l]);
                water += leftMax - height[l];
            } else {
                r--;
                rightMax = std::max(rightMax, height[r]);
                water += rightMax - height[r];
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int l = 0, r = height.length - 1;
        int leftMax = height[l], rightMax = height[r];
        int water = 0;
        while (l < r) {
            if (leftMax < rightMax) {
                l++;
                leftMax = Math.max(leftMax, height[l]);
                water += leftMax - height[l];
            } else {
                r--;
                rightMax = Math.max(rightMax, height[r]);
                water += rightMax - height[r];
            }
        }
        return water;
    }
}`,
    },
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
      { input: 'height = [4,2,0,3,2,5]', expected: '9' },
      { input: 'height = [2,0,2]', expected: '2', isHidden: true },
      { input: 'height = [5,4,1,2]', expected: '1', isHidden: true },
    ],
    socraticHints: [
      'At any bar i, what determines the water level directly above it? (min(max_left, max_right) - height[i])',
      'Can you compute this using two pointers without precalculating arrays for left and right maxes?',
      'If left_max < right_max, do we even care about whatever bars lie in between right_max and us?',
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(1)',
  },
  {
    id: 'course-schedule',
    number: 207,
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptanceRate: '47.5%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you **must** take course \`b_i\` first if you want to take course \`a_i\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.',
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There are 2 courses to take. Cycle detected between 0 and 1, so it is impossible.',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= a_i, b_i < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    starterCode: {
      python: `from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        # Kahn's algorithm (Topological sort using in-degrees)
        adj = {i: [] for i in range(numCourses)}
        indegree = [0] * numCourses
        for course, pre in prerequisites:
            adj[pre].append(course)
            indegree[course] += 1
        q = deque([i for i in range(numCourses) if indegree[i] == 0])
        count = 0
        while q:
            node = q.popleft()
            count += 1
            for neighbor in adj[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    q.append(neighbor)
        return count == numCourses
`,
      cpp: `#include <vector>
#include <queue>

class Solution {
public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        std::vector<std::vector<int>> adj(numCourses);
        std::vector<int> inDegree(numCourses, 0);
        for (const auto& edge : prerequisites) {
            adj[edge[1]].push_back(edge[0]);
            inDegree[edge[0]]++;
        }
        std::queue<int> q;
        for (int i = 0; i < numCourses; ++i) {
            if (inDegree[i] == 0) q.push(i);
        }
        int visited = 0;
        while (!q.empty()) {
            int curr = q.front(); q.pop();
            visited++;
            for (int neighbor : adj[curr]) {
                if (--inDegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return visited == numCourses;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] inDegree = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        int visited = 0;
        while (!q.isEmpty()) {
            int node = q.poll();
            visited++;
            for (int next : adj.get(node)) {
                if (--inDegree[next] == 0) q.offer(next);
            }
        }
        return visited == numCourses;
    }
}`,
    },
    testCases: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', expected: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', expected: 'false' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', expected: 'true', isHidden: true },
      { input: 'numCourses = 3, prerequisites = [[0,1],[1,2],[2,0]]', expected: 'false', isHidden: true },
    ],
    socraticHints: [
      'How can this problem be modeled as a graph where courses are nodes?',
      'If course A requires course B, and course B requires course A, what graph property is violated? (Directed Acyclic Graph)',
      'What happens when you continuously take courses with zero prerequisites remaining (Kahn\'s algorithm)?',
    ],
    timeComplexityOptimal: 'O(V + E)',
    spaceComplexityOptimal: 'O(V + E)',
  },
  {
    id: 'coin-change',
    number: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    category: '1-D DP',
    acceptanceRate: '43.9%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for a in range(1, amount + 1):
            for c in coins:
                if a - c >= 0:
                    dp[a] = min(dp[a], 1 + dp[a - c])
        return dp[amount] if dp[amount] != float('inf') else -1
`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; ++a) {
            for (int c : coins) {
                if (a - c >= 0) {
                    dp[a] = std::min(dp[a], 1 + dp[a - c]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) {
                    dp[a] = Math.min(dp[a], 1 + dp[a - c]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    },
    testCases: [
      { input: 'coins = [1,2,5], amount = 11', expected: '3' },
      { input: 'coins = [2], amount = 3', expected: '-1' },
      { input: 'coins = [1], amount = 0', expected: '0' },
      { input: 'coins = [186,419,83,408], amount = 6249', expected: '20', isHidden: true },
    ],
    socraticHints: [
      'Does a greedy choice (always picking the largest coin) work here? Consider coins [1, 3, 4] and amount 6.',
      'If you knew the minimum coins to make amount - c for every coin c in your wallet, how would you find dp[amount]?',
      'What is your base case when amount = 0?',
    ],
    timeComplexityOptimal: 'O(Amount * len(coins))',
    spaceComplexityOptimal: 'O(Amount)',
  },
  {
    id: 'valid-parentheses',
    number: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    acceptanceRate: '40.6%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                if not stack or stack.pop() != mapping[char]:
                    return False
            else:
                stack.append(char)
        return not stack
`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> st;
        std::unordered_map<char, char> map = {{')','('}, {'}','{'}, {']','['}};
        for (char c : s) {
            if (map.count(c)) {
                if (st.empty() || st.top() != map[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
    },
    testCases: [
      { input: 's = "()"', expected: 'true' },
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' },
      { input: 's = "([{}])"', expected: 'true', isHidden: true },
      { input: 's = "[(])"', expected: 'false', isHidden: true },
    ],
    socraticHints: [
      'Which opening parenthesis must match a closing parenthesis? The most recently seen one!',
      'What data structure adheres strictly to Last-In, First-Out (LIFO)?',
      'What does a non-empty stack at the very end of the string indicate?',
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(N)',
  },
  {
    id: 'merge-k-sorted-lists',
    number: 23,
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    category: 'Heap',
    acceptanceRate: '51.3%',
    sheets: ['Blind 75', 'NeetCode 150', 'Striver SDE', 'FAANG Tags'],
    companyTags: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Uber'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
      },
      {
        input: 'lists = []',
        output: '[]',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
    ],
    starterCode: {
      python: `import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: list[ListNode]) -> ListNode:
        min_heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(min_heap, (node.val, i, node))
        dummy = ListNode(0)
        curr = dummy
        while min_heap:
            val, i, node = heapq.heappop(min_heap)
            curr.next = node
            curr = curr.next
            if node.next:
                heapq.heappush(min_heap, (node.next.val, i, node.next))
        return dummy.next
`,
      cpp: `#include <vector>
#include <queue>

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
    struct Compare {
        bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }
    };
public:
    ListNode* mergeKLists(std::vector<ListNode*>& lists) {
        std::priority_queue<ListNode*, std::vector<ListNode*>, Compare> pq;
        for (auto list : lists) {
            if (list) pq.push(list);
        }
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top(); pq.pop();
            tail->next = node;
            tail = tail->next;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`,
      java: `import java.util.PriorityQueue;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode node : lists) {
            if (node != null) pq.offer(node);
        }
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            curr.next = node;
            curr = curr.next;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }
}`,
    },
    testCases: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', expected: '[]' },
      { input: 'lists = [[]]', expected: '[]', isHidden: true },
    ],
    socraticHints: [
      'If you merge 2 lists, it takes O(N). If you merge K lists sequentially, what is the complexity? (O(N * K))',
      'At any moment, you only need to choose the minimum value among the current heads of K lists. What data structure maintains the minimum of K elements in O(log K)?',
      'What happens when you extract a node from the min-heap? Which node should be inserted next?',
    ],
    timeComplexityOptimal: 'O(N log K) where N is total nodes',
    spaceComplexityOptimal: 'O(K) for priority queue',
  },
];
