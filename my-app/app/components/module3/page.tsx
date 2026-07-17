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
    heading: '1. What is a Service Level Agreement (SLA)?',
    items: [
      'A formal contract between a Service Provider (SP) and a Service Consumer (SC).',
      'Forms the foundation of the consumer\u2019s trust in the provider and defines the formal basis for performance and availability guarantees.',
      'Contains Service Level Objectives (SLOs) — objectively measurable conditions — and is a key basis for selecting a cloud provider.',
    ],
  },
  {
    heading: '2. SLA Contents',
    items: [
      'The set of services to be delivered, with a complete, specific definition of each service.',
      'Responsibilities of both provider and consumer, metrics to measure service guarantees, and an auditing mechanism to monitor services.',
      'Remedies if terms are not satisfied, and how the SLA will change over time.',
    ],
  },
  {
    heading: '3. Web Service SLA vs. Cloud SLA',
    items: [
      'WS-Agreement is an XML-based language for negotiating, establishing, and managing service agreements at runtime, and supports discovering compatible providers.',
      'WSLA (Web Service Level Agreement Framework) is an XML-schema-based language plus a runtime interpreter that measures and monitors QoS parameters and reports violations — its main limitation is a lack of formal definitions for the semantics of its metrics.',
    ],
  },
  {
    heading: '4. Cloud SLA vs. Traditional Web Service SLA',
    items: [
      'Traditional web services focus on QoS parameters like response time, reliability, availability, and cost; cloud computing adds security, privacy, trust, and management.',
      'Traditional web service negotiation, provisioning, and monitoring are typically not automated; cloud SLAs are highly automated, which is required for dynamic scaling.',
      'Traditional web services rely on UDDI for discovery; cloud computing has no central directory, with resources distributed globally.',
    ],
  },
  {
    heading: '5. Types of SLAs in the Market',
    items: [
      'Off-the-shelf (non-negotiable / direct) SLAs: the provider creates a template covering contract period, billing, response time, and availability. Followed by most state-of-the-art clouds, but not well suited to mission-critical applications.',
      'Negotiable SLAs: negotiated via one or more external agents.',
    ],
  },
  {
    heading: '6. Service Level Objectives (SLOs)',
    items: [
      'Objectively measurable conditions covering availability, serviceability, billing, penalties, throughput, response time, and quality.',
      'Examples: availability of service X = 99.9%, response time of query Q = 3–5 seconds, throughput of server S at peak load = 0.875.',
    ],
  },
  {
    heading: '7. Service Level Management',
    items: [
      'Involves monitoring and measuring performance against the agreed SLOs.',
      'From the provider\u2019s perspective, decisions balance business objectives with technical realities; from the consumer\u2019s perspective, decisions concern how to use the cloud services.',
    ],
  },
  {
    heading: '8. Considerations for SLA',
    items: [
      'Business Level Objectives — understand why the cloud is being used before deciding how.',
      'Responsibilities vary by service type (IaaS, PaaS, SaaS); business continuity and disaster recovery must ensure the provider has adequate protection.',
      'System redundancy — massively redundant systems help prevent outages; maintenance affects all cloud offerings.',
      'Location of data — the consumer must be able to audit compliance with data location regulations; seizure of data is complicated by multi-tenancy, since law enforcement targeting one consumer may affect others.',
      'Failure of provider — consider the provider\u2019s financial health and have contingency plans; jurisdiction — understand which laws apply.',
    ],
  },
  {
    heading: '9. SLA Requirements',
    items: [
      'Security controls and federation patterns; data encryption details and access control policies; privacy through isolation of customer data in a multi-tenant environment.',
      'Data retention and deletion — some providers must retain data even after deletion and must prove compliance; hardware erasure and destruction requires zeroing memory or disk platters before disposal or recycling.',
      'Regulatory compliance that providers must prove; transparency through proactive notification when SLA terms are breached; certification that providers are responsible for proving and updating.',
      'Monitoring is best handled by a neutral third-party organization; auditability means consumers must be able to audit systems and procedures, within limits and possibly for a charge.',
    ],
  },
  {
    heading: '10. Key Performance Indicators (KPIs) and Metrics',
    items: [
      'Low-level resource metrics — such as downtime, uptime, inbytes, outbytes, and packet size — are composed, aggregated, or converted into high-level SLOs, e.g. Availability = 1 – (downtime/uptime).',
      'Monitoring/auditing metrics include: throughput, availability, reliability, load balancing, durability, elasticity, linearity, agility, automation, customer service response times, service-level violation rate, transaction time, and resolution time.',
      'SLA requirements — data encryption, privacy, data retention, hardware erasure, regulatory compliance, transparency, certification, KPIs, metrics, auditability, monitoring, machine-readable SLAs — apply equally across PaaS, IaaS, and SaaS.',
    ],
  },
  {
    heading: '11. Example Cloud SLAs',
    items: [
      'Amazon EC2 (Compute IaaS): 99.95% availability. Amazon S3 (Storage-as-a-Service): 99.9% availability. Amazon SimpleDB (DBaaS): no specific SLA.',
      'Salesforce CRM (PaaS): no SLA guarantees. Google App Engine (PaaS): 99.9% availability.',
      'Microsoft Azure Compute (IaaS/PaaS): 99.95% availability. Microsoft Azure Storage: 99.9% availability.',
      'Zoho suite (SaaS): customizable guarantees around resolution time and escalation. Rackspace Cloud Server (IaaS): 100% internal network and data center availability, 99.9% load balancers. Terremark vCloud Express (IaaS): 100% monthly uptime. Nirvanix (Storage-as-a-Service): 99.9% monthly availability.',
    ],
  },
  {
    heading: '12. Limitations of Current SLAs and Expected Parameters',
    items: [
      'There is a gap between QoS hype and actual SLA offerings; areas like governance, reliability, availability, security, and scalability are not well addressed, and there is no formal way to verify SLA compliance.',
      'Proper SLAs benefit providers (improved infrastructure, fair competition) and consumers (trust, choosing the right provider).',
      'IaaS parameters: CPU capacity, cache memory, boot time, storage, scale up/down, on-demand availability, auto-scaling, max VMs per physical server, cost by geographic location, and response time.',
      'PaaS parameters: integration, scalability, billing, deployment environment (licenses, patches, versions, upgrade capability, federation), servers, browsers, and number of developers.',
      'SaaS parameters: reliability, usability, scalability, availability, customizability, response time. Storage-as-a-Service parameters: geographic location, scalability, storage space, billing, security, privacy, backup, fault tolerance, recovery, throughput, bandwidth, and data lifecycle management.',
    ],
  },
  {
    heading: '13. Economics of Cloud Computing — Core Properties',
    items: [
      'Common Infrastructure: pooled, standardized resources that benefit from statistical multiplexing.',
      'Location Independence: ubiquitous availability that benefits from latency reduction and improved user experience.',
      'Online Connectivity: enables the other attributes, with quantifiable cost and performance impacts.',
      'Utility Pricing: usage-sensitive or pay-per-use pricing that benefits variable-demand environments.',
      'On-Demand Resources: scalable and elastic, allowing provisioning and deprovisioning without delay or extra cost.',
    ],
  },
  {
    heading: '14. Value of Common Infrastructure and Coefficient of Variation',
    items: [
      'Economies of scale reduce overhead and give buyer power through volume purchasing; multiplexing demand raises utilization and lowers cost per resource, and for infrastructure built below peak, it reduces unserved demand and SLA violation payouts.',
      'The coefficient of variation (Cv) is standard deviation divided by the absolute mean; a smaller Cv means smoother demand.',
      'Fixed assets serving highly variable demand achieve lower utilization; multiplexing demand from multiple sources can reduce Cv.',
      'Negatively correlated workloads (e.g. X and 1–X summing to a constant) smooth combined demand; perfectly correlated demands keep the coefficient of variation constant, and simultaneous peaks are problematic for resource planning.',
    ],
  },
  {
    heading: '15. Value of Location Independence and Utility Pricing',
    items: [
      'Latency is strongly correlated with distance and, to a lesser degree, with routing; the speed of light in fiber is roughly 124 miles per millisecond, while human response latency is 10–100 ms — a 2-second word-suggestion delay is bad, and VOIP latency of 200 ms or more is problematic.',
      'Cloud services don\u2019t need to be cheaper outright — they need to be economical for variable demand, much like renting a car versus buying one.',
      'Mathematical condition for cloud being cheaper than owning: U < P/A, where U is the utility premium (cloud cost / baseline cost), P is peak demand, and A is average demand.',
      'Real-world demand is often spiky (news, promotions, tax season); a hybrid model — owning baseline capacity and renting for peaks — is often best, with the peak-to-average demand ratio as the key factor, alongside network costs, interoperability overhead, reliability, and accessibility.',
    ],
  },
  {
    heading: '16. Value of On-Demand Services',
    items: [
      'Penalty cost is proportional to the integral of |D(t) – R(t)| over time — the mismatch between demand and provisioned resources.',
      'If demand is flat, penalty cost is zero; if demand is exponential, any fixed provisioning interval falls exponentially behind.',
    ],
  },
  {
    heading: '17. Managing Data — Relational and Parallel Databases',
    items: [
      'Relational databases (e.g. System R, Ingres) have been the default storage model since the 1980s and are efficient for transaction processing, with components including a SQL parser, disk-space management, and a database file system independent of the OS for control over paging, using parallel I/O such as RAID or multi-processor clusters.',
      'Shared-nothing parallel database architecture partitions tables across nodes, with the SQL optimizer handling distributed joins and two-phase commit locking; fault tolerance comes from stand-by systems for transaction processing and restore mechanisms for warehousing.',
      'Examples: Oracle, DB2, and SQL Server for transactional workloads; Netezza, Vertica, and Teradata for data warehousing.',
    ],
  },
  {
    heading: '18. Cloud File Systems — GFS and HDFS',
    items: [
      'Google File System (GFS) is designed for large files on commodity servers, handles failures during read/write, is fault-tolerant, and supports parallel reads, writes, and appends.',
      'Hadoop Distributed File System (HDFS) is an open-source implementation of GFS, available on Amazon EC2.',
      'GFS architecture: a single Master controls the file namespace; files are split into 64 MB chunks/blocks stored on Chunk Servers (GFS) or Data Nodes (HDFS), each replicated 3x across different racks or network segments.',
      'Reads: the client asks the Master for replica locations, caches the metadata, then reads directly from a chunk server. Writes/appends: the Master gives all replica locations, the client sends data to all of them, a primary is chosen, and the primary appends and coordinates the write.',
      'Fault tolerance relies on heartbeat messages; the master updates metadata on failure and reassigns the primary role as needed.',
    ],
  },
  {
    heading: '19. BigTable and Dynamo',
    items: [
      'BigTable is a distributed structured storage system built on GFS — a sparse, persistent, multi-dimensional sorted map of key-value pairs accessed by row key, column key, and timestamp.',
      'Column families form a fixed set, though labels within a family can be dynamic; row ranges called tablets are managed by Tablet Servers and stored as SSTables, with a metadata server locating tablets via a root tablet.',
      'Dynamo (Amazon) stores objects as <Key, Value> pairs, using an MD5 hash mapped to a 128-bit value placed on virtual nodes arranged in a ring.',
      'Replication uses a primary virtual node plus N-1 additional nodes, with load balancing for transient failures and network partitions; the quorum protocol uses R reads and W writes, achieving quorum consistency when R+W > N.',
      'Versioning uses timestamps, with conflicts resolved by application-independent logic; storage engines include Berkeley DB and MySQL.',
    ],
  },
  {
    heading: '20. Datastore',
    items: [
      'Google App Engine / Amazon SimpleDB\u2019s Datastore is a simple transactional <Key, Value> store, with all entities held in one BigTable table rather than column-oriented storage.',
      'Index tables support efficient queries, and data is horizontally partitioned (sharded), sorted lexicographically by key.',
      'Entity groups support transactions and are stored close together on disk.',
    ],
  },
  {
    heading: '21. Parallel Computing Models',
    items: [
      'Shared-memory model: any processor can access any memory location, though with unequal latency.',
      'Distributed-memory model: each processor accesses only its own memory and communicates via message passing.',
      'Parallel efficiency is T / (p \u00d7 Tp); a scalable system keeps efficiency roughly constant as data and processors grow together.',
    ],
  },
  {
    heading: '22. MapReduce Model',
    items: [
      'Illustrated by a word-frequency example: partitioning work by word is not scalable since each processor reads many words it doesn\u2019t need, while partitioning by document is scalable because every read is useful.',
      'Map phase: transforms (k1, v1) input into a list of (k2, v2) pairs; each mapper reads about 1/M of the input from GFS and writes sorted results to the local file system, one file per reducer.',
      'Reduce phase: takes (k2, [v2]) input and produces (k2, f([v2])) output; reducers fetch partial results from mappers via RPC, and final results are written back to GFS.',
      'Fault tolerance relies on heartbeat communication and duplicate tasks when no progress is detected; a failed mapper has its key-range reassigned and re-executed, while a failed reducer only has its remaining tasks reassigned since completed tasks are already in GFS.',
      'Parallel efficiency of MapReduce is 1 / (1 + (2c/w)\u03c3), where c is read/write time per word, w is work per word, and \u03c3 is the output/data ratio.',
    ],
  },
  {
    heading: '23. Applications of MapReduce',
    items: [
      'Indexing: the map phase emits (word, doc-id) pairs from (document, [words]) input, and the reduce phase turns (word, [doc-ids]) into an index entry.',
      'Also used for relational operations such as joins and group-by on large datasets, offering advantages over parallel databases in scale and fault tolerance.',
    ],
  },
  {
    heading: '24. What is OpenStack?',
    items: [
      'A cloud operating system that controls large pools of compute, storage, and networking resources, managed through a dashboard called Horizon.',
      'Started as a collaboration between NASA and Rackspace.',
      'Capabilities span IaaS (provisioning compute, network, and storage), PaaS built on top of IaaS (e.g. Cloud Foundry), and SaaS accessed via browser or thin client — with features like on-demand VMs (provisioning, snapshotting), network and storage for VMs and arbitrary files, multi-tenancy, quotas, and user-project association.',
    ],
  },
  {
    heading: '25. OpenStack Major Components',
    items: [
      'Nova (Compute): manages the lifecycle of compute instances — spawning, scheduling, and decommissioning VMs.',
      'Neutron (Networking): provides network-connectivity-as-a-service through a pluggable API.',
      'Swift (Object Storage): a RESTful HTTP API for unstructured data, highly fault-tolerant with data replicated across the cluster.',
      'Keystone (Identity): handles authentication, authorization, and the service catalog.',
      'Glance (Image Service): stores and retrieves VM disk images.',
      'Ceilometer (Telemetry): provides monitoring and metering for billing, benchmarking, and scalability.',
      'Horizon (Dashboard): a web-based self-service portal.',
      'Architecture highlights: a user logs into Horizon, Keystone returns an auth token, and Horizon sends a POST request to the Nova API with that token; the Nova Scheduler filters which compute node receives a VM; Neutron uses a pluggable networking architecture; Glance handles image storage and retrieval; Keystone acts as the central identity service.',
    ],
  },
];

const questions: Question[] = [
  { question: 'What is the primary purpose of a Service Level Agreement (SLA)?', options: ['To define pricing only', 'To define a formal basis for performance and availability guarantees', 'To replace legal contracts', 'To manage consumer billing'], answer: 1 },
  { question: 'What are the objectively measurable conditions in an SLA called?', options: ['KPIs', 'Service Level Objectives (SLOs)', 'QoS parameters', 'Service credits'], answer: 1 },
  { question: 'Which of the following is NOT a typical content of an SLA?', options: ['Responsibilities of provider and consumer', 'Metrics to measure service guarantees', 'Source code of the cloud service', 'Remedies if terms are not satisfied'], answer: 2 },
  { question: 'WS-Agreement is based on which language?', options: ['JSON', 'HTML', 'XML', 'YAML'], answer: 2 },
  { question: 'WSLA stands for:', options: ['Web Service Level Architecture', 'Web Service Level Agreement Framework', 'Web Service Latency Auditor', 'Web Service License Agreement'], answer: 1 },
  { question: 'Which of the following is a limitation of WSLA?', options: ['It cannot measure QoS', 'Lack of formal definitions for semantics of metrics', 'It does not support XML', 'It only works for storage services'], answer: 1 },
  { question: 'In traditional web services, QoS parameters typically include:', options: ['Security and privacy', 'Response time and availability', 'Trust and management', 'Data encryption'], answer: 1 },
  { question: 'Which QoS parameter is more specific to cloud computing than traditional web services?', options: ['Response time', 'Cost of service', 'Privacy', 'SLA violation rate'], answer: 2 },
  { question: 'In cloud computing, resource allocation is:', options: ['Managed by a central UDDI directory', 'Global without any central directory', 'Only through manual provisioning', 'Identical to web services'], answer: 1 },
  { question: 'What is an off-the-shelf SLA also called?', options: ['Negotiable SLA', 'Direct SLA', 'Custom SLA', 'Dynamic SLA'], answer: 1 },
  { question: 'Off-the-shelf SLAs are generally:', options: ['Negotiable per customer', 'Non-conducive for mission-critical data', 'Best for all applications', 'Fully automated'], answer: 1 },
  { question: 'Which type of SLA involves negotiation via an external agent?', options: ['Direct SLA', 'Off-the-shelf SLA', 'Negotiable SLA', 'Static SLA'], answer: 2 },
  { question: 'An example of an SLO is:', options: ['"Service will be cheap"', '"Availability of service X is 99.9%"', '"Customer must be happy"', '"Provider will be transparent"'], answer: 1 },
  { question: 'Service Level Management involves:', options: ['Only consumer decisions', 'Only provider decisions', 'Monitoring and measuring performance based on SLOs', 'Designing hardware'], answer: 2 },
  { question: 'From the consumer perspective, Service Level Management helps in:', options: ['Making decisions about how to use cloud services', "Designing the provider's infrastructure", 'Setting hardware prices', 'Writing legal contracts'], answer: 0 },
  { question: 'Which consideration ensures consumers know why they are using cloud services before deciding how to use them?', options: ['System redundancy', 'Business Level Objectives', 'Jurisdiction', 'Maintenance'], answer: 1 },
  { question: 'The balance of responsibilities between provider and consumer varies according to:', options: ['The color of the data center', 'The type of service (IaaS, PaaS, SaaS)', 'The age of the provider', 'The operating system used'], answer: 1 },
  { question: 'Why should consumers consider system redundancy?', options: ['To increase latency', 'To avoid outages even if hard drives or servers fail', 'To reduce costs', 'To comply with laws'], answer: 1 },
  { question: 'If a cloud provider promises to enforce data location regulations, the consumer must be able to:', options: ['Ignore the regulation', 'Audit the provider', 'Change the regulation', 'Store data locally only'], answer: 1 },
  { question: 'The multi-tenant nature of cloud computing implies that seizure of data of one consumer may:', options: ['Only affect that consumer', 'Affect other consumers as well', 'Never happen', 'Improve security'], answer: 1 },
  { question: 'Which SLA requirement involves zeroing out memory when a VM is powered off?', options: ['Data encryption', 'Privacy', 'Hardware erasure and destruction', 'Regulatory compliance'], answer: 2 },
  { question: 'To eliminate conflict of interest between provider and consumer, who is the best solution to monitor performance?', options: ["The provider's internal team", "The consumer's IT team", 'A neutral third-party organization', 'Government regulators'], answer: 2 },
  { question: 'Which of the following is a low-level KPI?', options: ['Customer satisfaction', 'Downtime', 'Business value', 'Service credit'], answer: 1 },
  { question: 'How is availability typically represented?', options: ['Percentage of uptime', 'Number of users', 'Total revenue', 'Number of servers'], answer: 0 },
  { question: 'Which metric measures how likely data is to be lost?', options: ['Throughput', 'Durability', 'Elasticity', 'Linearity'], answer: 1 },
  { question: "Which metric measures how quickly the provider responds as the consumer's resource load scales?", options: ['Agility', 'Automation', 'Resolution time', 'Transaction time'], answer: 0 },
  { question: 'The mean rate of SLA violation due to infringements of agreed warranty levels is called:', options: ['Transaction time', 'Service-level violation rate', 'Customer service response time', 'Load balancing'], answer: 1 },
  { question: 'According to the table on page 17, which requirement applies to IaaS, PaaS, and SaaS equally?', options: ['Only data encryption', 'Only privacy', 'All listed requirements (encryption, privacy, retention, etc.)', 'Only auditability'], answer: 2 },
  { question: 'Which Amazon service has no specific SLA defined?', options: ['EC2', 'S3', 'SimpleDB', 'All have defined SLAs'], answer: 2 },
  { question: 'Google App Engine guarantees availability of:', options: ['99.95%', '99.9%', '100%', '99.99%'], answer: 1 },
  { question: 'Microsoft Azure Compute (IaaS/PaaS) guarantees availability of:', options: ['99.9%', '99.95%', '99.99%', '100%'], answer: 1 },
  { question: 'Which provider allows users to customize SLA guarantees based on resolution time, business hours, and escalation?', options: ['Amazon', 'Google', 'Zoho suite', 'Rackspace'], answer: 2 },
  { question: 'Rackspace guarantees what percentage for internal network availability?', options: ['99.9%', '99.95%', '100%', '99.99%'], answer: 2 },
  { question: 'According to limitations, which QoS areas are not well addressed in current SLAs?', options: ['Governance, reliability, availability, security, scalability', 'Only security', 'Only availability', 'Only cost'], answer: 0 },
  { question: 'Expected SLA parameter for IaaS includes:', options: ['Number of developers', 'Boot time of standard images', 'Customizability', 'Usability'], answer: 1 },
  { question: 'Which cloud property involves pooled, standardized resources with benefits from statistical multiplexing?', options: ['Utility pricing', 'Common infrastructure', 'On-demand resources', 'Location independence'], answer: 1 },
  { question: 'What is the coefficient of variation (Cv) formula?', options: ['Mean / Standard deviation', 'Standard deviation / Mean', 'Variance / Mean', 'Mean / Variance'], answer: 1 },
  { question: 'A smaller coefficient of variation indicates:', options: ['More volatile demand', 'Smoother demand', 'Higher peak demand', 'Lower mean demand'], answer: 1 },
  { question: 'Multiplexing demand from multiple sources tends to:', options: ['Increase the coefficient of variation', 'Reduce the coefficient of variation', 'Have no effect on Cv', 'Double the mean'], answer: 1 },
  { question: 'If demand from two sources is perfectly correlated, the coefficient of variation of the aggregated demand:', options: ['Becomes zero', 'Remains constant', 'Increases', 'Decreases to half'], answer: 1 },
  { question: 'The condition for cloud being cheaper than owning is:', options: ['U > P/A', 'U < P/A', 'U = P/A', 'U < A/P'], answer: 1 },
  { question: 'In the utility pricing formula, U represents:', options: ['Peak demand', 'Average demand', 'Utility premium (cloud cost / baseline cost)', 'Utilization'], answer: 2 },
  { question: 'According to the rental car analogy, cloud is economical when:', options: ['Demand is flat', 'Demand is spiky (peak-to-average ratio high)', 'Demand is always at peak', 'Demand is zero'], answer: 1 },
  { question: 'Penalty cost for mismatched demand and resources is proportional to:', options: ['\u222b D(t) dt', '\u222b |D(t) \u2013 R(t)| dt', '\u222b R(t) dt', '\u222b (D(t)+R(t)) dt'], answer: 1 },
  { question: 'If demand is exponential and provisioning interval is fixed, the penalty cost grows:', options: ['Linearly', 'Exponentially', 'Logarithmically', 'Not at all'], answer: 1 },
  { question: 'Latency is strongly correlated with:', options: ['Color of the server', 'Distance', 'Storage capacity', 'Number of users'], answer: 1 },
  { question: 'Speed of light in fiber is approximately:', options: ['124 miles per millisecond', '100 miles per millisecond', '200 miles per millisecond', '50 miles per millisecond'], answer: 0 },
  { question: 'VOIP latency of 200 ms or more is generally:', options: ['Acceptable', 'Problematic', 'Ideal', 'Unnoticeable'], answer: 1 },
  { question: 'The hybrid model (own baseline + rent for peaks) is often best because:', options: ['It is simpler', 'Peak-to-average ratio is key factor', 'It eliminates all costs', 'It has no network costs'], answer: 1 },
  { question: 'In the assignment problem (page 43), the delay in provisioning is given as:', options: ['\u03c0/6', '\u03c0/12', '\u03c0/4', '\u03c0/2'], answer: 1 },
  { question: 'Which database system replaced hierarchical and network databases in the 1980s?', options: ['NoSQL', 'Relational database', 'Object-oriented database', 'XML database'], answer: 1 },
  { question: 'Google File System (GFS) is designed to manage:', options: ['Small files only', 'Relatively large files using a distributed cluster', 'Only metadata', 'Only structured data'], answer: 1 },
  { question: 'The default chunk size in GFS is typically:', options: ['4 KB', '64 MB', '1 GB', '512 bytes'], answer: 1 },
  { question: 'How many replicas of each chunk does GFS maintain by default?', options: ['1', '2', '3', '5'], answer: 2 },
  { question: 'In GFS, which component controls the file namespace?', options: ['Chunk server', 'Master', 'Client', 'Data node'], answer: 1 },
  { question: 'In a GFS read operation, the client first contacts:', options: ['Chunk server directly', 'Master to get metadata', 'Data node', 'Primary replica'], answer: 1 },
  { question: 'During a GFS write, who is designated as primary to coordinate the append?', options: ['The client', 'The master', 'One of the chunk servers', 'All chunk servers equally'], answer: 2 },
  { question: 'Fault tolerance in GFS is achieved partly through:', options: ['No replication', 'Heartbeat messages between master and chunk servers', 'Single point of failure', 'Manual intervention'], answer: 1 },
  { question: 'BigTable is built on top of:', options: ['HDFS', 'GFS', 'Dynamo', 'MySQL'], answer: 1 },
  { question: 'BigTable is a:', options: ['Relational database', 'Sparse, persistent, multi-dimensional sorted map', 'File system', 'Message queue'], answer: 1 },
  { question: 'In BigTable, data is accessed by:', options: ['Row key, column key, timestamp', 'Only row key', 'Only column key', 'Only timestamp'], answer: 0 },
  { question: 'In BigTable, a set of possible column families for a table is:', options: ['Dynamic at any time', 'Fixed when the table is created', 'Unlimited', 'Not allowed'], answer: 1 },
  { question: 'Each row range in BigTable is called a:', options: ['SSTable', 'Tablet', 'Chunk', 'Block'], answer: 1 },
  { question: 'In Dynamo, objects are stored as:', options: ['Relational rows', '<Key, Value> pairs', 'XML documents', 'JSON arrays'], answer: 1 },
  { question: 'Dynamo uses which hash function to generate a 128-bit hash?', options: ['SHA-1', 'MD5', 'CRC32', 'SHA-256'], answer: 1 },
  { question: 'In Dynamo, virtual nodes are arranged in a:', options: ['Tree', 'Ring', 'List', 'Stack'], answer: 1 },
  { question: 'N in Dynamo represents:', options: ['Number of virtual nodes', 'Number of physical nodes', 'Number of replicas', 'Number of data centers'], answer: 1 },
  { question: 'For quorum consistency in Dynamo, the condition is:', options: ['R + W > N', 'R + W < N', 'R = W', 'R > W'], answer: 0 },
  { question: 'Which storage engine can be used at node level in Dynamo?', options: ['Only MySQL', 'Only Berkeley DB', 'Berkeley DB or MySQL', 'Only PostgreSQL'], answer: 2 },
  { question: "Google App Engine's Datastore stores all entities in:", options: ['Multiple tables', 'One BigTable table', 'A file system', 'A relational database'], answer: 1 },
  { question: 'In Datastore, entities are grouped for transaction purposes using:', options: ['Random grouping', 'Lexicographic order by group ancestry', 'Timestamp', 'Size of entity'], answer: 1 },
  { question: 'Which parallel database architecture has no sharing of disks or memory?', options: ['Shared-memory', 'Shared-disk', 'Shared-nothing', 'Shared-everything'], answer: 2 },
  { question: 'An example of a data warehousing parallel database is:', options: ['Oracle', 'DB2', 'Vertica', 'SQL Server'], answer: 2 },
  { question: 'In GFS, if a chunk server fails, the master:', options: ['Does nothing', 'Updates metadata to reflect failure', 'Deletes all data', 'Shuts down the system'], answer: 1 },
  { question: 'In BigTable, each column family for a row range is stored in a separate distributed file called:', options: ['Tablet', 'SSTable', 'Chunk', 'Block'], answer: 1 },
  { question: 'In the shared-memory model, any processor can access:', options: ['Only its own memory', 'Any memory location', 'Only the disk', 'Only the network'], answer: 1 },
  { question: 'Parallel efficiency is defined as:', options: ['T / (p * Tp)', 'p * Tp / T', 'Tp / T', 'T * Tp / p'], answer: 0 },
  { question: 'In the word frequency example, the second approach (partition by document) is scalable because:', options: ['Each processor reads all words', 'Every read is useful for computation', 'No communication is needed', 'It uses shared memory'], answer: 1 },
  { question: 'In MapReduce, the Map function transforms:', options: ['(k2, [v2]) \u2192 (k2, f([v2]))', '(k1, v1) \u2192 [(k2, v2)]', '(k1, v1) \u2192 (k1, v1)', '(k2, v2) \u2192 (k1, v1)'], answer: 1 },
  { question: 'Mappers write their intermediate results to:', options: ['GFS directly', 'Local file system', 'Master node', "Reducer's memory"], answer: 1 },
  { question: 'In the Reduce phase, reducers fetch data from mappers using:', options: ['Direct memory access', 'Remote procedure calls (RPC)', 'Shared disk', 'Broadcast'], answer: 1 },
  { question: 'If a mapper fails in MapReduce, the master:', options: ['Ignores the failure', 'Reassigns the key-range to another node for re-execution', 'Stops the entire job', 'Only logs the failure'], answer: 1 },
  { question: 'If a reducer fails, only the remaining tasks are reassigned because:', options: ['Completed tasks are already in GFS', 'Reducers are not important', 'MapReduce cannot restart reducers', 'It is too expensive'], answer: 0 },
  { question: 'Heartbeat communication in MapReduce is used for:', options: ['Data transfer', 'Status updates and fault detection', 'Load balancing', 'Encryption'], answer: 1 },
  { question: 'The parallel efficiency of MapReduce is given by:', options: ['1 / (1 + (2c/w)\u03c3)', '1 / (1 + (w/2c)\u03c3)', '1 / (1 + 2\u03c3)', '(1 + (2c/w)\u03c3)'], answer: 0 },
  { question: 'In MapReduce efficiency formula, \u03c3 represents:', options: ['Standard deviation', 'Output/data ratio', 'Speed of light', 'Number of reducers'], answer: 1 },
  { question: 'An application of MapReduce is:', options: ['Only sorting', 'Indexing a large collection of documents', 'Real-time video processing', 'Compiling code'], answer: 1 },
  { question: 'MapReduce can execute relational operations like joins because:', options: ['It replaces SQL completely', 'It supports large scale and fault tolerance', 'It has built-in SQL parser', 'It is slower than databases'], answer: 1 },
  { question: 'In the map phase for indexing, the emitted key-value pair is:', options: ['(document, word)', '(word, document-id)', '(word, count)', '(document-id, word count)'], answer: 1 },
  { question: 'The reduce phase for indexing produces:', options: ['(word, [document-ids])', '(document, [words])', '(word, total count)', '(document-id, word list)'], answer: 0 },
  { question: 'OpenStack is a:', options: ['Proprietary cloud operating system', 'Cloud operating system that controls compute, storage, networking', 'Virtual machine monitor', 'Programming language'], answer: 1 },
  { question: 'OpenStack started as a collaboration between:', options: ['Google and Amazon', 'NASA and Rackspace', 'Microsoft and IBM', 'VMware and Citrix'], answer: 1 },
  { question: 'Which OpenStack project manages the lifecycle of compute instances?', options: ['Neutron', 'Nova', 'Swift', 'Keystone'], answer: 1 },
  { question: 'Which OpenStack project provides Network-Connectivity-as-a-Service?', options: ['Nova', 'Neutron', 'Glance', 'Horizon'], answer: 1 },
  { question: 'Swift is used for:', options: ['Object storage', 'Compute', 'Identity management', 'Image service'], answer: 0 },
  { question: 'Which OpenStack project provides authentication and authorization?', options: ['Nova', 'Swift', 'Keystone', 'Ceilometer'], answer: 2 },
  { question: 'Glance is responsible for:', options: ['Telemetry', 'Storing and retrieving VM disk images', 'Networking', 'Dashboard'], answer: 1 },
  { question: 'Ceilometer is used for:', options: ['Monitoring and metering', 'Object storage', 'Block storage', 'Identity'], answer: 0 },
  { question: 'Horizon provides:', options: ['Command-line interface', 'Web-based self-service portal', 'API gateway', 'Load balancer'], answer: 1 },
  { question: 'In OpenStack, a user can be associated with:', options: ['Only one project', 'Multiple projects', 'No project', 'Only the default project'], answer: 1 },
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
  const score = selected.reduce((acc, s, i) => (s === questions[i].answer ? acc + 1 : acc), 0);
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

/* ---------------- Module 3 page ---------------- */

export default function Module3Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 03 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          SLAs, Cloud Economics, Managing Data, MapReduce &amp; OpenStack
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