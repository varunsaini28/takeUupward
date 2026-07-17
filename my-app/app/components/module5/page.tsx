'use client';

import { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

/* ---------------- Types ---------------- */

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface NoteSection {
  heading: string;
  items: string[];
}

type ViewType = 'notes' | 'practice' | 'quiz';

/* ---------------- Data ---------------- */

const notes: NoteSection[] = [
  {
    heading: '1. Cloud SLA & Availability Guarantee',
    items: [
      'A cloud provider guarantees a certain percentage of service availability, e.g. 99% of the time.',
      'To check for violation: calculate expected uptime = total hours in the period \u00d7 availability %, then compare it with actual uptime = total service hours \u2212 outage hours. If actual uptime is below the expected uptime, the SLA has been violated.',
      'Example: a 99% guarantee with the application running 12 hours/day and a 10.75-hour monthly outage works out to about 97% actual availability \u2014 a violation.',
    ],
  },
  {
    heading: '2. Service Credits & Penalties',
    items: [
      'A typical SLA might guarantee 99.95% availability over a 30-day period (max 12 hours/day) at $50/day, with service credits if the guarantee is missed: below 99.95% uptime gives a 10% credit, and below 99% uptime gives a 25% credit.',
      'Steps to compute effective cost: convert all outages to the same unit, sum them for total outage, compute total service hours (days \u00d7 hours/day), derive actual uptime % , compare against the SLA thresholds to find the credit %, then effective cost = total cost \u2212 (credit % \u00d7 total cost).',
    ],
  },
  {
    heading: '3. Utility Pricing Model',
    items: [
      'Demand function D(t) over time T; peak demand P = max(D(t)); average demand A = avg(D(t)); baseline (owned) unit cost B; cloud unit cost C; utility premium U = C/B.',
      'Total cloud cost: C_T = \u222b\u2080\u1d40 (U \u00d7 B \u00d7 D(t)) dt = A \u00d7 U \u00d7 B \u00d7 T.',
      'Total baseline (owned) cost, sized to handle peak demand: B_T = P \u00d7 B \u00d7 T.',
    ],
  },
  {
    heading: '4. When Is Cloud Cheaper Than Owning?',
    items: [
      'Condition: C_T < B_T \u21d2 U < P/A \u21d2 A \u00d7 U \u00d7 B \u00d7 T < P \u00d7 B \u00d7 T.',
      'Cloud is cheaper than owning when the utility premium is less than the peak-to-average demand ratio.',
    ],
  },
  {
    heading: '5. Hybrid Model & Penalty Costs',
    items: [
      'Hybrid model: own baseline resources for predictable demand, and rent cloud resources for spikes; the key factor is the peak-to-average demand ratio.',
      'Penalty cost for mismatched resources is proportional to \u222b |D(t) \u2212 R(t)| dt, the area of mismatch between instantaneous demand D(t) and owned resources R(t).',
      'If demand grows exponentially (D(t) = e\u1d57) while provisioning stays fixed, the mismatch \u2014 and therefore the penalty \u2014 grows exponentially; for linear or periodic demand, fixed provisioning is acceptable; for flat demand, the penalty is zero; continuous (zero-interval) provisioning drives the penalty to zero as well.',
    ],
  },
  {
    heading: '6. MapReduce — Overview',
    items: [
      'Developed by Google for large-scale text processing such as search and web data, built on top of BigTable and the Google File System (GFS); it is massively parallel and fault-tolerant.',
      'Hadoop is the open-source implementation (originally from Yahoo!), available on AWS EC2 AMIs.',
    ],
  },
  {
    heading: '7. MapReduce Phases',
    items: [
      'Map phase: takes (k\u2081, v\u2081) input and outputs a list of (k\u2082, v\u2082) pairs; each mapper reads roughly 1/M of the input from the global file system and writes intermediate results to local files, one per reducer.',
      'Reduce phase: takes (k\u2082, [v\u2082]) input, groups by key, applies a function such as sum or average, and outputs (k\u2082, f([v\u2082])).',
      'The master process coordinates mappers and reducers; reducers fetch intermediate data from mappers via RPC (the "shuffle" phase); fault tolerance comes from the ability to re-execute failed mappers or reducers.',
    ],
  },
  {
    heading: '8. MapReduce — Example Applications',
    items: [
      'Word count: Map emits (word, 1) for each word in a document; Reduce sums the 1s for each word to get the total count.',
      'Average of integers: Map emits (key, (value, 1)); Reduce sums all the partial sums and counts, then divides total_sum by total_count.',
      'Group by gender for total/average salary: Map emits (gender, salary); Reduce aggregates salaries per gender.',
      'Word length categorization: categories are tiny (1\u20132 letters), small (3\u20135), medium (6\u20139), big (\u226510); Map emits (category, 1) per word, Reduce sums counts per category.',
    ],
  },
  {
    heading: '9. HDFS Block Size Example',
    items: [
      'With a 64 MB block size, a 64 KB file needs 1 block, a 65 MB file needs 2 blocks (64 MB + 1 MB), and a 127 MB file needs 2 blocks (64 MB + 63 MB) \u2014 a total of 5 blocks across the three files.',
    ],
  },
  {
    heading: '10. Resource Management — Definition & Objectives',
    items: [
      'Resource management means controlling how cloud resources and services are made available to users, applications, and services efficiently.',
      'Objectives include scalability, QoS, optimal utility, reduced overhead, improved throughput, reduced latency, cost-effectiveness, and a simplified interface.',
      'Aspects of resource management: provisioning, allocation, mapping, adaptation, discovery, brokering, estimation, and modeling.',
    ],
  },
  {
    heading: '11. Resource Types',
    items: [
      'Physical resources: computer, disk, database, network, instruments.',
      'Logical resources: execution, monitoring, communication, OS, energy, bandwidth, security.',
    ],
  },
  {
    heading: '12. Data Center Power Consumption & Motivation for Green Computing',
    items: [
      'Servers consume roughly 0.5% of the world\u2019s electricity, and server energy demand doubles every 5\u20136 years, contributing significant CO\u2082 emissions from fossil fuels.',
      'Economic motivation: megawatt-scale data center operation costs millions, and peak capacity limits expansion. Environmental motivation: dependence on fossil fuels, with sustainable energy not yet fully ready.',
    ],
  },
  {
    heading: '13. Green Computing Strategies',
    items: [
      'Power-aware and thermal-aware scheduling; Performance/Watt is not keeping pace with Moore\u2019s law.',
      'Improving Power Usage Effectiveness (PUE) through optimized cooling systems and rack design.',
    ],
  },
  {
    heading: '14. VM Scheduling on Multi-core Systems',
    items: [
      'The relationship between cores used and power consumption is non-linear.',
      'A greedy scheduling algorithm tracks cores per node and schedules VMs to fill a node\u2019s capacity before moving to the next, consolidating VMs onto fewer nodes to save power.',
      'Example from the PDF: consolidating VMs onto 4 nodes (170W + 105W + 105W + 105W = 485W) saves power compared to 552W under poor scheduling.',
    ],
  },
  {
    heading: '15. VM Management for Energy Efficiency',
    items: [
      'When load is low: live-migrate VMs onto fewer nodes and shut down the now-unused nodes.',
      'When load is high: use Wake-on-LAN (WOL) to start up additional nodes and schedule new VMs onto them.',
    ],
  },
  {
    heading: '16. Minimizing VM Image Size',
    items: [
      'Default cloud Linux images often contain unwanted packages such as X11 and window managers.',
      'A custom lightweight VM removes unnecessary packages, optimizes the kernel (e.g. building modules directly into a minimalistic Xen DomU kernel with no sound), and uses readahead profiling to reorder the boot sequence and prefetch files.',
      'Result: boot time dropped from 38s to 8s, and image size dropped from 4GB to 635MB.',
      'Savings: a small cloud creating ~100 images/hour saves about $262/year; a large cloud creating 1000 images/minute saves more than $1 million/year.',
    ],
  },
  {
    heading: '17. Resource Provisioning Approaches',
    items: [
      'Game theory (Nash equilibrium): runtime allocation under incomplete information.',
      'Network queuing model: captures the behavior of tiers with different performance characteristics.',
      'K-means + queuing: predicts workload mix and capacity needs; SEDF scheduler: weighted fair CPU sharing.',
      'SLA-oriented provisioning: autonomic provisioning aimed at meeting SLAs; OCRP (Optimal Cloud Resource Provisioning): handles both demand and price uncertainty.',
    ],
  },
  {
    heading: '18. Resource Allocation Approaches & Performance Metrics',
    items: [
      'Market-oriented allocation (maximize revenue, minimize energy); intelligent multi-agent allocation (for mobile devices); energy-aware allocation using ant colony optimization (mimicking ants finding the shortest path via pheromone density); dynamic allocation based on VM load; real-time scheduling combined with migration.',
      'Key performance metrics: reliability, ease of deployment, Quality of Service (QoS), delay, and control overhead.',
    ],
  },
];

const questions: Question[] = [
  { question: 'A cloud provider guarantees 99% availability. A third-party application runs 12 hours per day. At month end, total outage is 10.75 hours. Has the SLA been violated?', options: ['No, because outage is less than 1% of total time', 'Yes, because actual availability is below 99%', 'No, because the application runs only 12 hours/day', 'Yes, because total uptime is less than 99.9%'], answer: 1 },
  { question: 'For the scenario above, calculate the actual availability percentage over the month (assume 30 days).', options: ['98.5%', '99.0%', '97.0%', '99.5%'], answer: 2 },
  { question: 'An SLA guarantees 99.95% availability over a 30-day service period with maximum 12 hours/day. What is the maximum allowed total outage (in hours) without violating the SLA?', options: ['0.18 hrs', '1.8 hrs', '0.018 hrs', '0.5 hrs'], answer: 0 },
  { question: 'If the monthly uptime percentage falls below 99.95% but remains \u226599%, what service credit is awarded as per the PDF?', options: ['5%', '10%', '25%', '0%'], answer: 1 },
  { question: 'If monthly uptime is 98.5%, what service credit applies?', options: ['10%', '15%', '25%', '50%'], answer: 2 },
  { question: 'A cloud service costs $50 per day. Over 30 days, total outages sum to 2.5 hours. The monthly uptime percentage is 99.3%. What is the effective cost payable after service credit?', options: ['$1500', '$1350', '$1125', '$150'], answer: 1 },
  { question: 'Which of the following outage durations (total over 30 days, 12h/day) would cause a 25% service credit?', options: ['1.0 hour', '3.6 hours', '5.0 hours', '0.5 hour'], answer: 1 },
  { question: 'The primary purpose of service credits in an SLA is to:', options: ['Increase provider profit', 'Compensate customers when guarantees are not met', 'Reduce cloud pricing', 'Eliminate outages'], answer: 1 },
  { question: 'A provider guarantees 99.9% availability over a month (30 days, 24/7). What is the maximum permissible downtime?', options: ['43.2 minutes', '4.32 hours', '43.2 seconds', '7.2 hours'], answer: 0 },
  { question: 'If an application runs only during business hours (8 hours/day) but the SLA is based on 24/7 availability, the effective risk of violation is:', options: ['Higher', 'Lower', 'Same', 'Independent of runtime'], answer: 1 },
  { question: 'In the utility pricing model, what does the variable "P" represent?', options: ['Average demand', 'Peak demand', 'Utility premium', 'Cloud unit cost'], answer: 1 },
  { question: 'The condition for cloud being cheaper than owning resources is:', options: ['U > P/A', 'U < P/A', 'U = P/A', 'U < A/P'], answer: 1 },
  { question: 'If peak demand (P) = 150 units, average demand (A) = 100 units, baseline unit cost = $10, cloud unit cost = $15, then utility premium (U) is:', options: ['1.0', '1.5', '2.0', '0.67'], answer: 1 },
  { question: 'Using data from the previous question, is cloud cheaper than owning?', options: ['Yes, U < P/A (1.5 < 1.5) \u2013 equal', 'Yes, U < P/A (1.5 < 1.5) \u2013 false, equal not cheaper', 'No, because U > P/A', 'No, U = P/A, so break-even'], answer: 3 },
  { question: 'If peak demand is 200, average demand is 50, baseline cost $8, cloud cost $20, then cloud is:', options: ['Cheaper', 'More expensive', 'Same cost', 'Cannot be determined'], answer: 0 },
  { question: 'The utility premium (U) is defined as:', options: ['Peak demand / Average demand', 'Cloud unit cost / Baseline unit cost', 'Baseline unit cost / Cloud unit cost', 'Total cloud cost / Total baseline cost'], answer: 1 },
  { question: 'In the hybrid cloud model, an organization should:', options: ['Use only cloud for everything', 'Own resources for baseline demand and rent for spikes', 'Use only owned resources', 'Never use cloud'], answer: 1 },
  { question: 'Which factor is most critical in deciding between owned and cloud resources?', options: ['Color of the data center', 'Ratio of peak to average demand', 'Number of employees', 'Brand of servers'], answer: 1 },
  { question: 'Total baseline (owned) cost over time T is given by:', options: ['A \u00d7 B \u00d7 T', 'P \u00d7 B \u00d7 T', 'U \u00d7 B \u00d7 T', '\u222b D(t) dt'], answer: 1 },
  { question: 'Total cloud cost over time T is given by:', options: ['A \u00d7 U \u00d7 B \u00d7 T', 'P \u00d7 U \u00d7 B \u00d7 T', 'A \u00d7 B \u00d7 T', 'P \u00d7 B \u00d7 T'], answer: 0 },
  { question: 'If peak demand is 100, average demand 80, baseline cost $5, cloud cost $6, then U = 1.2, P/A = 1.25. Cloud is:', options: ['Cheaper', 'More expensive', 'Same', 'Not comparable'], answer: 0 },
  { question: 'In utility pricing, the term "statistical multiplexing" refers to:', options: ['Using one server for one user', 'Pooling resources to serve variable demand efficiently', 'Charging per minute', 'Fixed pricing'], answer: 1 },
  { question: 'Which of the following is NOT a benefit of utility pricing?', options: ['Pay-per-use', 'Works well for variable demand', 'Eliminates all network costs', 'Reduces waste'], answer: 2 },
  { question: 'According to the PDF, an example of a hybrid model is:', options: ['Owning a car for daily commute and renting a van for moving', 'Using only public transport', 'Never using cloud', 'Always using the most expensive option'], answer: 0 },
  { question: 'The "utility premium" for a rental car example given in the PDF is:', options: ['1.5', '2.0', '4.5', '10.0'], answer: 2 },
  { question: 'Network cost, interoperability overhead, reliability, and accessibility are:', options: ['Ignored in cloud economics', 'Additional factors to consider in cloud vs. owned decisions', 'Only relevant for owned resources', 'Not mentioned in the PDF'], answer: 1 },
  { question: 'If demand is flat (constant), the penalty for owning resources is:', options: ['Maximum', 'Zero', 'Infinite', 'Negative'], answer: 1 },
  { question: 'In the utility pricing derivation, why must owned resources be sized for peak demand?', options: ['Because cloud is always cheaper', 'Because you cannot instantly scale owned resources', 'Because average demand is irrelevant', 'Because utility premium is zero'], answer: 1 },
  { question: 'A company has peak demand 500, average demand 200, baseline unit cost $10, cloud unit cost $30. Compute U and P/A.', options: ['U=3, P/A=2.5 \u2192 cloud more expensive', 'U=3, P/A=2.5 \u2192 cloud cheaper', 'U=0.33, P/A=2.5 \u2192 cloud cheaper', 'U=3, P/A=0.4 \u2192 cloud cheaper'], answer: 0 },
  { question: 'The variable "A" in the utility pricing formulas stands for:', options: ['Average demand', 'Availability', 'Actual cost', 'Amortization'], answer: 0 },
  { question: 'The penalty cost for mismatched resources is proportional to:', options: ['\u222b (D(t) + R(t)) dt', '\u222b |D(t) \u2013 R(t)| dt', '\u222b D(t) \u00d7 R(t) dt', '\u222b (D(t) / R(t)) dt'], answer: 1 },
  { question: 'If demand is exponential (D(t) = e\u1d57) and resources are provisioned at fixed intervals, the penalty cost grows:', options: ['Linearly', 'Exponentially', 'Logarithmically', 'Constant'], answer: 1 },
  { question: 'For linear periodic demand, the penalty cost is:', options: ['Zero', 'High', 'Acceptable', 'Infinite'], answer: 2 },
  { question: 'In the exponential demand example, R(t) = e^(t \u2013 t\u209a). The difference D(t) \u2212 R(t) equals:', options: ['e\u1d57 (1 \u2013 e^(\u2013t\u209a))', 'e\u1d57 (1 \u2013 e^(t\u209a))', 'e\u1d57 (e^(t\u209a) \u2013 1)', 'e^(t\u209a) (1 \u2013 e\u1d57)'], answer: 1 },
  { question: 'What does the variable t\u209a represent in the penalty cost derivation?', options: ['Peak time', 'Provisioning interval', 'Total time', 'Penalty threshold'], answer: 1 },
  { question: 'If provisioning interval becomes zero (continuous provisioning), penalty cost becomes:', options: ['Maximum', 'Zero', 'Exponential', 'Infinite'], answer: 1 },
  { question: 'The penalty cost formula encourages:', options: ['Over-provisioning always', 'Under-provisioning always', 'Matching resources to demand as closely as possible', 'Ignoring demand changes'], answer: 2 },
  { question: 'Which demand pattern causes the highest penalty for fixed provisioning?', options: ['Flat', 'Linear', 'Exponential', 'Sinusoidal'], answer: 2 },
  { question: 'In the PDF, the penalty cost is denoted as proportional to \u222b|D(t)\u2013R(t)|dt. This is essentially the:', options: ['Area of mismatch', 'Peak mismatch', 'Average mismatch squared', 'Maximum mismatch'], answer: 0 },
  { question: 'If an organization over-provisions resources (R(t) > D(t) always), the penalty cost:', options: ['Is zero because demand is always met', 'Is positive due to unused resources', 'Is negative', 'Is not defined'], answer: 1 },
  { question: 'MapReduce is a programming model developed by:', options: ['Microsoft', 'Google', 'Amazon', 'Yahoo'], answer: 1 },
  { question: 'The open-source implementation of MapReduce is:', options: ['Spark', 'Hadoop', 'BigTable', 'GFS'], answer: 1 },
  { question: 'In MapReduce, the Map phase transforms:', options: ['(k\u2082, v\u2082) \u2192 [(k\u2081, v\u2081)]', '(k\u2081, v\u2081) \u2192 [(k\u2082, v\u2082)]', '(k\u2082, [v\u2082]) \u2192 (k\u2082, f([v\u2082]))', '(k\u2081, [v\u2081]) \u2192 (k\u2081, sum)'], answer: 1 },
  { question: 'The Reduce phase performs:', options: ['(k\u2081, v\u2081) \u2192 [(k\u2082, v\u2082)]', '(k\u2082, [v\u2082]) \u2192 (k\u2082, f([v\u2082]))', 'Splitting input into blocks', 'Writing to local disk'], answer: 1 },
  { question: 'HDFS block size is 64 MB. How many blocks for a file of size 65 MB?', options: ['1', '2', '3', '4'], answer: 1 },
  { question: 'Three files: 64 KB, 65 MB, 127 MB. HDFS block size = 64 MB. Total blocks created?', options: ['3', '4', '5', '6'], answer: 2 },
  { question: 'In MapReduce, the master process is responsible for:', options: ['Only Map phase', 'Only Reduce phase', 'Coordinating mappers and reducers', 'Storing final output'], answer: 2 },
  { question: 'Mappers write intermediate results to:', options: ['Global file system', 'Local file system (one file per reducer)', "Master's memory", "Reducer's memory"], answer: 1 },
  { question: 'Reducers fetch intermediate data from mappers using:', options: ['Shared memory', 'Remote Procedure Calls (RPC)', 'Broadcast', 'Direct disk access'], answer: 1 },
  { question: 'Which of the following is NOT a feature of MapReduce?', options: ['Fault tolerance', 'Parallel processing', 'Real-time streaming', 'Large-scale data processing'], answer: 2 },
  { question: 'In the word count example, the Map function emits:', options: ['(word, 1) for each word', '(word, count)', '(doc, word)', '(word, document)'], answer: 0 },
  { question: 'In word count, the Reduce function receives (word, [1,1,1,\u2026]) and emits:', options: ['(word, sum)', '(word, count)', 'Both A and B are essentially same', '(word, list)'], answer: 2 },
  { question: 'If HDFS block size is 128 MB, how many blocks for a 300 MB file?', options: ['2', '3', '4', '5'], answer: 1 },
  { question: 'The number of mappers is typically:', options: ['Fixed to 1', 'Configurable, often based on input splits', 'Equal to number of reducers', 'Determined by the master randomly'], answer: 1 },
  { question: 'The number of reducers in a MapReduce job is:', options: ['Always 1', 'Configurable by the programmer', 'Equal to number of mappers', 'Determined by input size'], answer: 1 },
  { question: 'To compute the average of a set of integers using MapReduce, the Map function should emit:', options: ['(key, value)', '(key, (value, 1))', '(key, value/count)', '(value, 1)'], answer: 1 },
  { question: 'For average calculation, the Reduce function receives (key, list of (sum, count)) and emits:', options: ['(key, total_sum)', '(key, total_count)', '(key, total_sum / total_count)', '(key, total_sum * total_count)'], answer: 2 },
  { question: 'Given integers {10,20,30,40,50}, after Map phase (assuming one mapper) the intermediate output would be:', options: ['(10,1),(20,1),(30,1),(40,1),(50,1)', '(10,10),(20,20),\u2026', '(10,(10,1)),(20,(20,1)),\u2026', '(1,10),(1,20),\u2026'], answer: 2 },
  { question: 'For grouping by gender to compute total salary, the Map function input is (name, (gender, salary)). The output key should be:', options: ['name', 'gender', 'salary', '(gender, salary)'], answer: 1 },
  { question: 'In the gender-based salary aggregation, the Reduce function will output:', options: ['(gender, total_salary)', '(gender, average_salary)', '(name, total_salary)', '(gender, count)'], answer: 0 },
  { question: 'For word length categorization, categories are: tiny (1-2), small (3-5), medium (6-9), big (\u226510). The word "cloud" (5 letters) falls into:', options: ['tiny', 'small', 'medium', 'big'], answer: 1 },
  { question: 'In word length categorization, the Map function emits:', options: ['(word, 1)', '(length, word)', '(category, 1)', '(category, word)'], answer: 2 },
  { question: 'The output of the Reduce function for word length categorization is:', options: ['(category, total_count)', '(word, category)', '(category, list of words)', '(length, count)'], answer: 0 },
  { question: 'If a paragraph contains "a" (1 letter), "an" (2), "the" (3), "example" (7), "extraordinarily" (14), how many words fall into "tiny" category?', options: ['1', '2', '3', '4'], answer: 1 },
  { question: 'In the word count MapReduce example shown in the PDF (with 3 mappers, 2 reducers), the intermediate files are sorted by:', options: ['Value', 'Key', 'Timestamp', 'Mapper ID'], answer: 1 },
  { question: 'The MapReduce model is fault-tolerant because:', options: ['Mappers and reducers can be re-executed on failure', 'It uses a single master that never fails', 'Data is never replicated', 'It does not use networks'], answer: 0 },
  { question: 'Which of the following problems is NOT suitable for MapReduce?', options: ['Word count', 'Average calculation', 'Real-time stock trading', 'Log analysis'], answer: 2 },
  { question: 'In MapReduce, the "shuffle" phase refers to:', options: ['Map execution', 'Transferring intermediate data from mappers to reducers', 'Reduce execution', 'Input splitting'], answer: 1 },
  { question: 'For the input "John, M, 10000" and "Martha, F, 15000", the Map output for gender-based total salary would be:', options: ['(M,10000), (F,15000)', '(John,10000), (Martha,15000)', '(10000,M), (15000,F)', '(M, (John,10000)), (F, (Martha,15000))'], answer: 0 },
  { question: 'In the average integer problem, if the input is split across two mappers, how will the Reduce function combine partial sums?', options: ['Sum all partial sums and counts separately', "Only take one mapper's output", 'Average the averages', 'Ignore partial counts'], answer: 0 },
  { question: 'Servers currently consume approximately what percentage of the world\u2019s total electricity?', options: ['0.1%', '0.5%', '2%', '5%'], answer: 1 },
  { question: 'Server energy demand doubles every:', options: ['1-2 years', '3-4 years', '5-6 years', '10 years'], answer: 2 },
  { question: 'Green computing aims to reduce energy consumption with:', options: ['No regard for performance', 'Minimal performance impact', 'Only cost savings', 'Only environmental benefits'], answer: 1 },
  { question: 'Power Usage Effectiveness (PUE) is improved by:', options: ['Adding more servers', 'Optimizing cooling systems and rack design', 'Increasing CPU frequency', 'Reducing number of users'], answer: 1 },
  { question: 'Which scheduling approach considers both energy and temperature?', options: ['Power-aware only', 'Thermal-aware only', 'Combined power-aware and thermal-aware', 'Random scheduling'], answer: 2 },
  { question: 'Performance/Watt is:', options: ["Following Moore's law", "Not following Moore's law", "Improving faster than Moore's law", 'Irrelevant to green computing'], answer: 1 },
  { question: 'The relationship between number of processing cores and power consumption is:', options: ['Linear', 'Non-linear (as shown in Intel Core i7 920 graph)', 'Inverse', 'Constant'], answer: 1 },
  { question: 'The greedy scheduling algorithm for VMs aims to:', options: ['Spread VMs evenly across all cores', 'Schedule as many VMs as possible on a node before using another node', 'Keep all nodes partially loaded', 'Maximize idle cores'], answer: 1 },
  { question: 'In the power-aware scheduling example, consolidating VMs onto fewer nodes reduced power from 552W to:', options: ['485W', '500W', '450W', '400W'], answer: 0 },
  { question: 'When load decreases, an energy-efficient cloud manager should:', options: ['Keep all nodes running', 'Live migrate VMs to fewer nodes and shut down unused nodes', 'Add more VMs', 'Increase CPU frequency'], answer: 1 },
  { question: 'Wake-on-LAN (WOL) is used to:', options: ['Shut down nodes', 'Start up waiting nodes when load increases', 'Migrate VMs', 'Reduce power during idle'], answer: 1 },
  { question: 'A typical cloud Linux image often contains:', options: ['Only necessary services', 'Unwanted packages like X11 and window managers', 'No operating system', 'Only the kernel'], answer: 1 },
  { question: 'By optimizing the Linux image (removing X11, using readahead), boot time was reduced from 38 seconds to:', options: ['10 seconds', '8 seconds', '5 seconds', '15 seconds'], answer: 1 },
  { question: 'The optimized image size was reduced from 4GB to:', options: ['2GB', '1GB', '635MB', '100MB'], answer: 2 },
  { question: 'In a large cloud where 1000 images are created every minute, the yearly savings from optimized images is estimated over:', options: ['$10,000', '$100,000', '$1 million', '$10 million'], answer: 2 },
  { question: 'Live migration of VMs is used to:', options: ['Increase power consumption', 'Move VMs without downtime for consolidation', 'Delete VMs', 'Reduce CPU speed'], answer: 1 },
  { question: 'What is the benefit of reducing VM image size?', options: ['Faster live migration', 'Less network latency', 'Lower storage cost', 'All of the above'], answer: 3 },
  { question: 'The readahead profiling utility is used to:', options: ['Increase boot time', 'Reorder boot sequence and prefetch files', 'Remove packages', 'Compress images'], answer: 1 },
  { question: 'Which kernel optimization is mentioned for Xen DomU?', options: ['Include 3D graphics', 'Build modules within kernel directly, no sound, minimalistic', 'Use generic desktop kernel', 'Enable all sound drivers'], answer: 1 },
  { question: 'In the example, saving 0.2 kWh per hour at $0.152 per kWh results in yearly savings of approximately:', options: ['$26', '$262', '$2,620', '$26,200'], answer: 1 },
  { question: 'The primary motivation for green data centers includes:', options: ['Economic and environmental', 'Only economic', 'Only environmental', 'Aesthetic'], answer: 0 },
  { question: 'Which of the following is a logical resource as per the PDF?', options: ['CPU', 'Memory', 'Network throughput/bandwidth', 'Hard disk'], answer: 2 },
  { question: 'Physical resources include:', options: ['Operating system', 'Energy', 'Computer and disk', 'Load balancing mechanisms'], answer: 2 },
  { question: 'The term "resource management" refers to:', options: ['Only hardware control', 'Operations to control how cloud capabilities are made available efficiently', 'Only pricing', 'Only security'], answer: 1 },
  { question: 'Which is NOT a performance metric for resource management mentioned?', options: ['Reliability', 'Color of the server', 'QoS', 'Control overhead'], answer: 1 },
  { question: 'Which approach uses Nash equilibrium from game theory?', options: ['Network queuing model', 'Market-oriented resource allocation', 'Nash equilibrium approach for runtime management', 'Energy-aware ant colony'], answer: 2 },
  { question: 'The network queuing model for resource provisioning captures:', options: ['Only CPU usage', 'Behavior of tiers with different performance characteristics', 'Network latency only', 'Storage I/O only'], answer: 1 },
  { question: 'In energy-aware resource allocation, the behavior of ants is mimicked to:', options: ['Find shortest path (high pheromone density)', 'Randomly allocate resources', 'Increase energy consumption', 'Ignore load'], answer: 0 },
  { question: 'The OCRP (Optimal Cloud Resource Provisioning) approach considers:', options: ['Only demand', 'Only price', 'Demand and price uncertainty', 'Only server count'], answer: 2 },
  { question: 'The Symmetric Mapping Pattern for resource supply divides functions into:', options: ['Two functions: match and place tasks', 'Three functions: match & engage, place tasks, place containers', 'Four functions: discover, allocate, map, adapt', 'Single function: provision'], answer: 1 },
];

/* ---------------- Notes view ---------------- */

function NotesView() {
  return (
    <div className="space-y-6">
      {notes.map((section, i) => (
        <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
          <h3 className="mb-3 font-semibold text-indigo-300">{section.heading}</h3>
          <ul className="space-y-2">
            {section.items.map((item, j) => (
              <li key={j} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Practice / Quiz view ---------------- */

function QuestionSet({ mode }: { mode: 'practice' | 'quiz' }) {
  const [selected, setSelected] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const choose = (qIndex: number, optIndex: number) => {
    if (mode === 'practice') {
      if (selected[qIndex] !== null) return;
    } else if (submitted) {
      return;
    }
    const next = [...selected];
    next[qIndex] = optIndex;
    setSelected(next);
  };

  const reset = () => {
    setSelected(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const answeredCount = selected.filter((s) => s !== null).length;
  const score = selected.reduce((acc: number, s, i) => (s === questions[i].answer ? acc + 1 : acc), 0);
  const showFeedback = (qIndex: number) => (mode === 'practice' ? selected[qIndex] !== null : submitted);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/95 p-4 backdrop-blur">
        <div className="text-sm text-slate-300">
          <span className="font-semibold text-slate-100">{answeredCount}</span> / {questions.length} answered
          {mode === 'quiz' && submitted && (
            <span className="ml-3 font-semibold text-amber-400">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {mode === 'quiz' && !submitted && (
            <button
              onClick={() => setSubmitted(true)}
              disabled={answeredCount === 0}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              Submit quiz
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {questions.map((q, qi) => {
        const userAns = selected[qi];
        const feedback = showFeedback(qi);
        return (
          <div key={qi} className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
            <p className="mb-4 text-sm font-medium text-slate-100">
              <span className="mr-2 text-indigo-400">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isSelected = userAns === oi;
                const isCorrectOpt = oi === q.answer;
                let stateClasses = 'border-slate-600 bg-slate-800 hover:border-indigo-400 hover:bg-slate-750 text-slate-200';

                if (feedback) {
                  if (isCorrectOpt) stateClasses = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                  else if (isSelected && !isCorrectOpt) stateClasses = 'border-rose-500 bg-rose-500/10 text-rose-300';
                  else stateClasses = 'border-slate-700 bg-slate-800/50 text-slate-500';
                } else if (isSelected) {
                  stateClasses = 'border-indigo-400 bg-indigo-500/10 text-indigo-200';
                }

                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${stateClasses}`}
                  >
                    <span>
                      <span className="mr-2 font-semibold">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </span>
                    {feedback && isCorrectOpt && <Check size={16} className="flex-shrink-0 text-emerald-400" />}
                    {feedback && isSelected && !isCorrectOpt && <X size={16} className="flex-shrink-0 text-rose-400" />}
                  </button>
                );
              })}
            </div>
            {mode === 'practice' && feedback && (
              <p className={`mt-3 text-xs font-medium ${userAns === q.answer ? 'text-emerald-400' : 'text-rose-400'}`}>
                {userAns === q.answer ? 'Correct!' : `Not quite — the correct answer is "${q.options[q.answer]}".`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Module 5 page ---------------- */

export default function Module5Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 05 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud SLA Economics, MapReduce &amp; Green Computing / Resource Management
        </h1>
        {view === 'practice' && (
          <p className="mt-2 text-sm text-slate-400">
            Pick an answer to instantly see if it&apos;s correct — great for learning as you go.
          </p>
        )}
        {view === 'quiz' && (
          <p className="mt-2 text-sm text-slate-400">
            Answer all the questions, then submit to see your score and review your answers.
          </p>
        )}
      </div>

      {view === 'notes' && <NotesView />}
      {view === 'practice' && <QuestionSet mode="practice" />}
      {view === 'quiz' && <QuestionSet mode="quiz" />}
    </div>
  );
}