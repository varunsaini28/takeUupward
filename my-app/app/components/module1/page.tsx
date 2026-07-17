'use client';

import { useState } from 'react';
import { BookOpen, PencilLine, ClipboardCheck, Check, X, RotateCcw } from 'lucide-react';

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
    heading: '1. Introduction to Computing Paradigms',
    items: [
      'ACM Computing Curricula (2005) defines computing as a goal-oriented activity requiring, benefiting from, or creating computers.',
      'Major trends in computing: Distributed Computing, Grid Computing, Cluster Computing, Utility Computing, and Cloud Computing.',
    ],
  },
  {
    heading: '2. Distributed Computing',
    items: [
      'Centralized computing uses a single processor (uniprocessor); distributed computing uses multiple autonomous entities, each with local memory, communicating via message passing.',
      'Key properties: fault tolerance, resource sharing, load sharing, easy expandability, and performance (parallel computing is a subset of distributed computing).',
      'Why go distributed? Computing-intensive tasks (e.g. Monte Carlo simulation), data-intensive tasks (e.g. Facebook, LHC), and eliminating any Single Point of Failure (SPOF).',
      'Distributed applications fall into two broad styles: client-server (centralized resource management) and peer-to-peer (truly distributed, no central authority).',
    ],
  },
  {
    heading: '3. Grid Computing',
    items: [
      'Definition: harnesses unused processing cycles across a network of computers to solve problems too intensive for any single machine, creating a single virtual "supercomputer" system image.',
      'Electrical power grid analogy: users draw on computing resources without needing to know where or how they are generated — just like plugging into a wall socket.',
      'Used when: sharing data, computing power, and applications across dynamic, multi-institutional environments (Virtual Organizations), for efficient cross-institution resource use, and transparent access to underlying resources.',
      'Types of grids: Computational Grid (shared processing power), Data Grid (storage, discovery, manipulation), Collaboration Grid (advanced multi-party collaboration), Network Grid (fault-tolerant communication), and Utility Grid (the most complete form — sharing software, equipment, and more).',
    ],
  },
  {
    heading: '4. Cluster Computing',
    items: [
      'Definition: a collection of interconnected, stand-alone computers working together as a single integrated computing resource.',
      'Key components: stand-alone computers, an operating system, high-performance interconnects, middleware, and parallel programming environments.',
      'Types of clusters: High Availability / Failover, Load Balancing, and Parallel/Distributed Processing.',
      'Benefits: system availability, hardware fault tolerance (e.g. RAID), OS/application reliability, scalability, and high performance.',
    ],
  },
  {
    heading: '5. Utility Computing',
    items: [
      'Definition: a service-provisioning model where computing resources are delivered on demand and billed based on usage — much like electricity or water.',
      'Characteristics: pay-for-use pricing, virtualized/provisioned data centers, solving resource-utilization problems, and outsourcing or automating service delivery.',
      'Common payment models: flat rate, tiered, subscription, metered, pay-as-you-go, and standing charges.',
      'Risks to watch for: data backup and security, partner competency, how the SLA is defined, and whether chargeback actually delivers value.',
    ],
  },
  {
    heading: '6. Cloud Computing — the NIST Definition',
    items: [
      'Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (networks, servers, storage, applications, services) that can be rapidly provisioned and released with minimal management effort or provider interaction.',
    ],
  },
  {
    heading: '7. Essential Characteristics (NIST)',
    items: [
      'On-demand self-service — a consumer can provision computing capabilities automatically, without needing human interaction with each service provider.',
      'Broad network access — capabilities are available over the network and accessed through standard mechanisms across heterogeneous devices (phones, laptops, tablets).',
      'Resource pooling — the provider’s resources are pooled to serve multiple consumers using a multi-tenant model, with resources dynamically assigned and reassigned.',
    ],
  },
  {
    heading: '8. Common Characteristics',
    items: [
      'Massive scale, resilient computing, homogeneity, geographic distribution, virtualization, service orientation, low-cost software, and advanced security.',
    ],
  },
  {
    heading: '9. Service Models (XaaS)',
    items: [
      'SaaS (Software as a Service) — use the provider’s applications running on cloud infrastructure over the internet. Example: Google Spreadsheet.',
      'PaaS (Platform as a Service) — deploy consumer-created applications using tools and infrastructure supplied by the provider. Examples: Google App Engine, Azure.',
      'IaaS (Infrastructure as a Service) — provision fundamental computing resources such as processing, storage, and networks. Examples: Amazon EC2, Flexiscale.',
      'Other XaaS variants worth knowing: BPaaS, Storage as a Service, Security as a Service, DaaS, MaaS, CaaS, IDaaS, BaaS, and Desktop as a Service.',
    ],
  },
  {
    heading: '10. Deployment Models',
    items: [
      'Private cloud — operated exclusively for a single organization.',
      'Community cloud — shared by several organizations that have common goals or concerns.',
      'Public cloud — infrastructure made available to the general public.',
      'Hybrid cloud — a composition of two or more distinct clouds, e.g. used for cloud bursting.',
    ],
  },
  {
    heading: '11. Virtualization',
    items: [
      'Virtual workspaces: an abstraction of an execution environment that can be defined by a resource quota and a specific software configuration.',
      'Virtual machines (VMs): an abstraction of a physical host, managed by a hypervisor such as VMware, Xen, or KVM.',
      'Advantages: running an OS that wouldn’t otherwise be available, easier backups and testing, emulating more machines than physically exist, timesharing, live migration, and running legacy systems.',
    ],
  },
  {
    heading: '12. Advantages of Cloud Computing',
    items: [
      'Lower computer and software costs, improved performance, instant software updates, improved document-format compatibility, unlimited storage capacity, increased data reliability, universal information access, access to the latest software version, easier group collaboration, and device independence.',
    ],
  },
  {
    heading: '13. Disadvantages & Concerns',
    items: [
      'Requires a constant internet connection and doesn’t work well over low-speed connections.',
      'Feature sets may be limited compared to desktop applications, and performance can be slow.',
      'Stored data may not be fully secure and can potentially be lost.',
      'Not ideal for HPC workloads (MPI/OpenMP) due to scheduling and network-latency constraints.',
      'Different APIs and protocols across providers can create vendor lock-in.',
    ],
  },
  {
    heading: '14. Economics & Business Drivers',
    items: [
      'Public cloud benefits: high resource utilization and scalability, no hardware procurement or power costs, no dedicated IT admin required, SLAs with high availability (roughly 99%) plus compensation, and paying only for what is used.',
      'Private cloud benefits: cost efficiency (one 12-core server is far cheaper than twelve single-core servers), preserved confidentiality, and VMs that are cheaper and faster to provision.',
      'PaaS vs IaaS economics: PaaS scales automatically with no cost for idle time, while IaaS typically requires some always-on minimal servers.',
      'SaaS benefit: subscribing to software instead of buying licenses outright — e.g. Google Docs vs. Microsoft Word.',
    ],
  },
  {
    heading: '15. Cloud Architecture',
    items: [
      'Key building blocks: the technical stack (XaaS stack, components, middleware, management, security) and deployment/operational concerns (geo-location, legal issues, monitoring).',
      'Elasticity: vertical scale-up (add resources to a single unit — cheaper for smaller scenarios) versus horizontal scale-out (add more units — the only real option at large scale).',
      'The shift from Legacy IT (dedicated, tightly coupled stacks) to Evergreen IT (simplified, on-demand infrastructure).',
    ],
  },
  {
    heading: '16. Client-Server vs Cloud Model',
    items: [
      'Client-server: a simple request-response pattern that may or may not be load balanced, and is scalable only to a limited extent, with no virtualization.',
      'Cloud: supports complex service models (IaaS, PaaS, SaaS), is load balanced, is theoretically scalable to a near-infinite degree, and treats virtualization as core to the architecture.',
      'The three-tier architecture underlying most cloud applications: Presentation → Logic → Data.',
    ],
  },
  {
    heading: '17. Networking in Cloud Computing',
    items: [
      'Cloud networking involves the dynamic provisioning of network resources, built around concepts like VLANs, VPNs, and layered protocols, using tools such as OpenSSH and OpenVPN.',
      'Layer responsibilities differ by service model: in IaaS the consumer manages the Application through Transport layers while the provider handles Network through Physical; in PaaS the provider manages Session through Physical (except Application); in SaaS the provider manages almost everything.',
      'Network Function Virtualization (NFV) implements network functions in software on standard servers, letting them be moved or instantiated without new hardware.',
    ],
  },
];

const questions: Question[] = [
  { question: 'According to the ACM Computing Curricula 2005, computing is best described as:', options: ['Only hardware design', 'Only software development', 'A goal-oriented activity requiring, benefiting from, or creating computers', 'Only data processing'], answer: 2 },
  { question: 'Which of the following is NOT considered one of the major trends in computing discussed in this module?', options: ['Distributed Computing', 'Grid Computing', 'Quantum Computing', 'Utility Computing'], answer: 2 },
  { question: 'In distributed computing, each processor typically has its own:', options: ['Local memory', 'Global memory', 'Shared hard disk', 'External bus'], answer: 0 },
  { question: 'Which property of distributed computing ensures the system keeps working even if some nodes fail?', options: ['Load sharing', 'Fault tolerance', 'Resource sharing', 'Performance'], answer: 1 },
  { question: 'Grid computing harnesses the unused ______ of computers connected across a network.', options: ['Memory', 'Processing cycles', 'Hard disk space', 'Power supply'], answer: 1 },
  { question: 'Which real-world system is commonly used as an analogy to explain Grid Computing?', options: ['Telephone network', 'Electrical power grid', 'Water supply system', 'Road network'], answer: 1 },
  { question: 'A cluster is a collection of interconnected ______ working together as a single integrated computing resource.', options: ['Stand-alone computers', 'Mobile phones', 'Mainframes only', 'Supercomputers'], answer: 0 },
  { question: 'Utility computing charges customers primarily based on:', options: ['A flat rate only', 'Usage, i.e. pay-per-use', 'Number of users', 'Data size only'], answer: 1 },
  { question: 'What does NIST stand for?', options: ['National Institute of Standards and Technology', 'Network for Internet Security and Trust', 'National Infrastructure for Software Testing', 'None of the above'], answer: 0 },
  { question: 'According to the NIST definition, cloud computing enables ______ network access to a shared pool of resources.', options: ['Occasional', 'On-demand', 'Scheduled', 'Offline'], answer: 1 },
  { question: 'Which essential characteristic allows a consumer to provision computing capabilities automatically, without human interaction with the provider?', options: ['Broad network access', 'Resource pooling', 'On-demand self-service', 'Measured service'], answer: 2 },
  { question: 'Resource pooling in cloud computing relies on a ______ model, where resources are dynamically assigned to multiple consumers.', options: ['Single-tenant', 'Multi-tenant', 'Dedicated', 'Isolated'], answer: 1 },
  { question: 'Which cloud service model delivers applications to users mainly through a web browser?', options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'], answer: 2 },
  { question: 'Which of the following is a commonly cited example of SaaS?', options: ['Amazon EC2', 'Google Spreadsheet', 'Microsoft Azure', 'VMware'], answer: 1 },
  { question: 'IaaS primarily provides consumers with:', options: ['Only software applications', 'Only a development platform', 'Processing, storage, and networking resources', 'Only databases'], answer: 2 },
  { question: 'PaaS allows consumers to deploy ______ onto the cloud infrastructure using tools supported by the provider.', options: ['Pre-built applications only', 'Consumer-created or acquired applications', 'Only operating systems', 'Only storage'], answer: 1 },
  { question: 'Which cloud deployment model is provisioned for the exclusive use of a single organization?', options: ['Public cloud', 'Private cloud', 'Community cloud', 'Hybrid cloud'], answer: 1 },
  { question: 'Virtualization allows multiple ______ to run on a single physical machine.', options: ['Operating systems', 'Applications only', 'Users', 'Networks'], answer: 0 },
  { question: 'Which of the following is an example of a hypervisor used to manage virtual machines?', options: ['Hyper-V', 'KVM', 'VMware', 'All of the above'], answer: 3 },
  { question: 'Which of the following is a genuine advantage of cloud computing?', options: ['Requires an expensive, high-powered computer', 'Unlimited storage capacity', 'No internet needed', 'Slower performance'], answer: 1 },
  { question: 'Which of the following is a genuine disadvantage of cloud computing?', options: ['No software updates', 'Requires a constant internet connection', 'No collaboration features', 'Limited storage'], answer: 1 },
  { question: 'Which of the following is a benefit typically associated with private cloud?', options: ['Data is publicly accessible', 'Confidentiality of data is preserved', 'No virtualization is used', 'Higher cost than public cloud for the same resources'], answer: 1 },
  { question: 'SaaS is most suitable for a use case such as:', options: ['Real-time stock trading systems', 'Web-based email', 'High-frequency trading', 'Custom hardware control'], answer: 1 },
  { question: 'Amazon EC2 is a well-known example of which service model?', options: ["Google's SaaS offering", "Microsoft's PaaS offering", "Amazon's IaaS offering", "IBM's DaaS offering"], answer: 2 },
  { question: 'In the three-tier client-server architecture, the user interface belongs to which tier?', options: ['Data tier', 'Logic tier', 'Presentation tier', 'Network tier'], answer: 2 },
  { question: 'In cloud networking, VLAN stands for:', options: ['Very Large Area Network', 'Virtual Local Area Network', 'Vertical Link Access Node', 'Virtual Logic Array Network'], answer: 1 },
  { question: 'NFV stands for:', options: ['Network Function Virtualization', 'Node Failure Verification', 'Network Frame Validation', 'Non-Functional Virtualization'], answer: 0 },
  { question: "Which cloud characteristic is best described as 'capabilities available over the network, accessed through standard mechanisms by heterogeneous devices'?", options: ['On-demand self-service', 'Broad network access', 'Resource pooling', 'Measured service'], answer: 1 },
  { question: 'Which type of cloud is formed by combining two or more distinct clouds (private, community, or public)?', options: ['Hybrid cloud', 'Multi-cloud', 'Federated cloud', 'Distributed cloud'], answer: 0 },
  { question: 'The term XaaS generally stands for:', options: ['X as a Service', 'Xen as a Service', 'XML as a Service', 'Xtreme as a Service'], answer: 0 },
  { question: 'In distributed systems, each individual node typically has:', options: ['A complete view of the entire system', 'A limited, incomplete view of the system', 'No view of other nodes at all', 'Global shared memory'], answer: 1 },
  { question: 'Which type of grid is designed to provide secure access to a large, shared pool of processing power?', options: ['Data Grid', 'Computational Grid', 'Collaboration Grid', 'Network Grid'], answer: 1 },
  { question: 'Before cloud adoption, private data centers were often reported to operate at what typical utilization level?', options: ['50-70%', '5-20%', '80-95%', '100%'], answer: 1 },
  { question: 'Which of the following is NOT typically classified as a type of cluster?', options: ['High Availability Clusters', 'Load Balancing Clusters', 'Parallel/Distributed Processing Clusters', 'Storage-only Clusters'], answer: 3 },
  { question: 'Which of the following is NOT a typical utility computing payment model?', options: ['Flat rate', 'Subscription', 'A one-time lifetime fee', 'Pay-as-you-go'], answer: 2 },
  { question: "In the electrical power grid analogy for Grid Computing, what do the 'wall sockets' represent?", options: ['Data centers', 'Users gaining access to computing resources', 'Power plants', 'Network cables'], answer: 1 },
  { question: 'Which of the following is a genuine risk associated with utility computing?', options: ['Unlimited scalability', 'Data security', 'Low cost', 'High performance'], answer: 1 },
  { question: 'Which cloud characteristic involves resources being spread across multiple physical locations?', options: ['Essential characteristic', 'Common characteristic', 'Service model', 'Deployment model'], answer: 1 },
  { question: 'In PaaS, which of the following is NOT managed or controlled by the consumer?', options: ['Deployed applications', 'Application hosting environment configuration', 'The underlying cloud infrastructure (network, servers, OS, storage)', 'Application code'], answer: 2 },
  { question: 'Which statement correctly describes vertical scaling (scale up)?', options: ['It adds more computation units', 'It splits the workload across multiple units', 'It adds more resources to a single computation unit', 'It requires database partitioning'], answer: 2 },
  { question: 'Horizontal scaling (scale out) is generally preferred for larger workloads because:', options: ['A single powerful server is always cheaper than many smaller ones', "Existing code always 'just works' without changes", 'Beyond a certain point, it becomes the only viable solution', 'It requires no networking at all'], answer: 2 },
  { question: 'Which of the following is an example of PaaS?', options: ['Amazon S3', 'Google App Engine', 'Salesforce CRM', 'Dropbox'], answer: 1 },
  { question: 'In the SaaS model, who is responsible for managing the runtime environment?', options: ['The consumer', 'The provider', 'A third-party auditor', 'Both consumer and provider equally'], answer: 1 },
  { question: 'Which of the following scenarios is generally LEAST suited to a PaaS solution?', options: ['Multiple developers collaborating on one project', 'Automating testing and deployment', 'An application that must remain highly portable across many hosting providers', 'Agile software development'], answer: 2 },
  { question: 'Eucalyptus is notable for providing an API compatible with which platform?', options: ['Google App Engine', 'Microsoft Azure', 'Amazon EC2', 'Rackspace'], answer: 2 },
  { question: 'What is the smallest billing unit historically used by Amazon EC2?', options: ['Second', 'Minute', 'Hour', 'Day'], answer: 2 },
  { question: 'Which of the following is NOT typically considered a benefit of PaaS?', options: ['No need to handle scaling and load balancing yourself', 'A web-based IDE for development', 'Full control over the underlying physical servers', 'Easier migration from development to production'], answer: 2 },
  { question: "The phrase 'Evergreen IT' refers to:", options: ['Legacy systems that never change', 'A simplified, on-demand, cloud-based IT stack', 'Hardware designed to last forever', "Environmentally 'green' computing only"], answer: 1 },
  { question: "In the layered responsibility model for IaaS, which layer remains under the consumer's control?", options: ['Physical layer', 'Data Link layer', 'Network layer', 'Application layer'], answer: 3 },
  { question: 'Which of the following is a defining characteristic of IaaS?', options: ['Infrastructure resources are delivered as a service', 'Pricing is always fixed regardless of usage', 'Hardware is dedicated to a single user only', 'No dynamic scaling is possible'], answer: 0 },
  { question: 'Which PaaS provider is associated with the programming language Apex?', options: ['Google App Engine', 'Microsoft Azure', 'Force.com', 'Heroku'], answer: 2 },
  { question: 'In legacy (classic) IT systems, applications are typically deployed as:', options: ['Loosely coupled horizontal layers', 'A tightly coupled vertical stack of layers', 'Independent microservices', 'Serverless functions'], answer: 1 },
  { question: 'Regarding cost efficiency, which statement about private cloud hardware is generally true?', options: ['A single server with 12 cores costs more than 12 single-core servers', 'A single server with 12 cores costs far less than 12 single-core servers', 'Virtual machines are slower to provision than physical servers', 'Confidentiality is not preserved in private cloud'], answer: 1 },
  { question: 'Which type of grid focuses on providing fault-tolerant, high-performance communication services?', options: ['Computational Grid', 'Data Grid', 'Collaboration Grid', 'Network Grid'], answer: 3 },
  { question: 'What is an important consideration when running HPC applications (such as those using MPI/OpenMP) on cloud infrastructure?', options: ['Cloud is always faster than on-premises HPC clusters', 'Scheduling should co-locate VMs to minimize network latency', 'It is completely impossible to run HPC workloads on cloud', 'No special scheduling considerations are needed'], answer: 1 },
  { question: 'In a common infrastructure analogy, IaaS (the raw compute, storage, and networking layer) is often compared to which part of a transportation system?', options: ["The vehicles' passengers", 'The traffic control software', 'The roads themselves', 'The delivered cargo'], answer: 2 },
  { question: 'Which of the following is NOT a typical characteristic of SaaS?', options: ['Web-based access to commercial software', 'End users handle their own software upgrades', 'Software managed from a central location', 'A one-to-many delivery model'], answer: 1 },
  { question: 'Which cloud deployment model is shared by several organizations that have common goals or concerns?', options: ['Private', 'Public', 'Community', 'Hybrid'], answer: 2 },
  { question: 'Cloud computing is often described as giving users the illusion of:', options: ['Limited capacity', 'Potentially infinite capacity', 'No scalability', 'Fixed resources'], answer: 1 },
  { question: 'Which of the following is a genuine advantage of virtualization?', options: ['Physical hardware is always required for every OS instance', "It's easier to create new machines and take backups", 'Legacy systems can no longer be run', 'Migration between hosts is not possible'], answer: 1 },
  { question: 'Public cloud providers typically offer availability SLAs around:', options: ['99.999%', 'Around 99%', '90%', '100%'], answer: 1 },
  { question: 'Which of the following is a genuine benefit of SaaS for an enterprise?', options: ['The enterprise must buy and license individual software instances', 'The enterprise can use a web-based CRM instead of buying servers and installing CRM software itself', 'The enterprise must manage all upgrades manually', 'It requires dedicated on-site hardware'], answer: 1 },
  { question: 'Among common IaaS providers, which one has historically offered OpenSolaris as a guest OS option?', options: ['Amazon EC2', 'Flexiscale', 'Joyent', 'Rackspace'], answer: 2 },
  { question: 'Which protocol is commonly cited as an example operating at the Session layer?', options: ['TCP', 'IP', 'SSL', 'Ethernet'], answer: 2 },
  { question: 'In cloud computing, network resources are typically:', options: ['Statically allocated only', 'Provisioned dynamically', 'Never changed once configured', 'Limited to physical connections only'], answer: 1 },
  { question: 'IaaS makes the most sense in which of the following scenarios?', options: ['Steady, highly predictable demand', 'An organization with large capital available to invest in hardware', 'A rapidly growing organization where scaling physical hardware is difficult', 'Strict regulatory requirements mandating on-premise-only infrastructure'], answer: 2 },
  { question: "Which PaaS characteristic refers to 'built-in scalability, including load balancing and failover'?", options: ['Multi-tenant architecture', 'Integration with web services', 'Built-in scalability', 'Collaboration tools'], answer: 2 },
  { question: 'What is generally cited as the main driver of interest in cloud computing among organizations?', options: ['Better security than on-premise systems', 'Public clouds can significantly reduce IT costs', 'Faster CPUs', 'No need for an internet connection'], answer: 1 },
  { question: 'Which of the following is NOT typically listed as a top cloud application driving adoption?', options: ['Mail and messaging', 'Archiving', 'Physical server manufacturing', 'CRM'], answer: 2 },
  { question: 'Compared to the traditional client-server model, the cloud model is generally:', options: ['Not virtualized at all', 'Theoretically scalable to a much greater, near-infinite degree', 'Limited to only simple request-response service models', 'Never load balanced'], answer: 1 },
  { question: "The idea that 'each computer in a distributed system may only know one part of the overall input' best describes which concept?", options: ['Fault tolerance', 'Resource sharing', 'Each node playing a partial role in the system', 'Load sharing'], answer: 2 },
  { question: 'Which type of grid would allow people from different companies to collaborate on separate components of a shared CAD project without disclosing their own proprietary technology?', options: ['Computational Grid', 'Data Grid', 'Collaboration Grid', 'Utility Grid'], answer: 2 },
  { question: 'What is generally the purpose of an organization like the Open Cloud Consortium?', options: ['To sell cloud services directly', 'To develop standards that improve portability between public clouds', 'To provide free cloud storage to the public', 'To replace Amazon EC2'], answer: 1 },
  { question: 'Which statement about para-virtualization (as used in Xen) is accurate?', options: ['It performs noticeably slower than raw physical hardware', 'Its performance is very close to raw physical hardware', 'It does not allow multiple virtual machines', 'It only works through hardware modifications'], answer: 1 },
  { question: 'In the IaaS model, which of the following is managed by the provider rather than the consumer?', options: ['Applications', 'Data', 'Physical servers, storage, and networking', 'The operating system'], answer: 2 },
  { question: 'Across IaaS, PaaS, and SaaS, which network layer is consistently managed by the provider in all three models?', options: ['Application layer', 'Transport layer', 'Data Link layer', 'Session layer'], answer: 2 },
  { question: 'Cloud bursting, where a private cloud draws on public cloud capacity for extra load balancing, is an example of which deployment model?', options: ['Private', 'Public', 'Community', 'Hybrid'], answer: 3 },
  { question: 'What is the smallest billing unit historically used by Rackspace?', options: ['Hour', 'Month', 'Day', 'Second'], answer: 0 },
  { question: 'Which of the following is NOT typically listed as a purpose for which organizations use cloud computing?', options: ['Running CRM, ERP, or supply chain management systems', 'Providing personal productivity tools', 'Manufacturing computer hardware', 'Analyzing customer data'], answer: 2 },
  { question: 'Among PaaS providers, which one is known for offering BigTable as a persistence option?', options: ['Aneka', 'Google App Engine', 'Force.com', 'Microsoft Azure'], answer: 1 },
  { question: "XaaS ('Anything as a Service') is often said to fulfill which four demands of cloud service consumers?", options: ['Increased productivity, end-user satisfaction, innovation, and agility', 'Low cost, high speed, security, and scalability', 'Storage, network, compute, and database', 'Public, private, hybrid, and community'], answer: 0 },
  { question: 'Which of the following is a commonly raised concern regarding cloud computing standards?', options: ['The lack of a single standard API, with a mix of SOAP and REST approaches', 'There are too many identical standards', 'Cloud services generally offer low scalability', 'High cost specifically for small users'], answer: 0 },
  { question: 'For a 24x7 web application with unpredictable transaction volume, which statement about PaaS vs IaaS economics is true?', options: ['IaaS costs nothing when the application is idle', 'PaaS scales automatically and mainly costs based on actual usage', 'PaaS always requires a minimum set of servers to stay running', 'IaaS scales automatically without any manual provisioning'], answer: 1 },
  { question: 'Which of the following is NOT typically considered a key building block of cloud computing architecture?', options: ['The XaaS stack', 'Geo-location and legal considerations', 'Physical CPU manufacturing', 'Middleware and communication components'], answer: 2 },
  { question: "What best describes the purpose of 'Virtual Workspaces' in cloud computing?", options: ['Physical office space for remote workers', 'An abstraction of an execution environment with a defined resource quota and software configuration', 'A specific type of hypervisor', 'A cloud deployment model'], answer: 1 },
  { question: 'Which of the following is a genuine advantage of virtual machines?', options: ['They cannot be suspended or resumed', 'They can emulate more machines than are physically available', 'They can only run modern operating systems', 'They cannot be migrated between hosts'], answer: 1 },
  { question: 'Among cloud storage providers offering a subscription-based SaaS model, which is commonly cited as an example?', options: ['SmugMug', 'XDrive', 'Box.net', 'OpSource'], answer: 1 },
  { question: 'In three-tier architecture, what is the main function of the Logic (application) tier?', options: ['Presenting the user interface', 'Storing and retrieving data', 'Coordinating the application, processing commands, and handling logical decisions', 'Handling raw network communication'], answer: 2 },
  { question: 'The requirement of having constant internet access in order to use cloud services is best described as:', options: ['A security issue', 'A key disadvantage related to connectivity dependence', 'A performance issue only', 'A feature limitation only'], answer: 1 },
  { question: 'Which of the following is NOT a genuine benefit typically associated with utility computing?', options: ['Low or no upfront initial cost', 'Resources are essentially rented rather than owned', 'Guaranteed 100% availability', 'A pay-per-use pricing model'], answer: 2 },
  { question: "According to common ACM-style definitions, which of the following is NOT typically included as part of 'computing'?", options: ['Designing hardware and software', 'Processing, structuring, and managing information', 'Manufacturing computer chips', 'Finding and gathering information'], answer: 2 },
  { question: 'Parallel computing is generally considered a subset of distributed computing. This implies that:', options: ['All parallel systems are distributed, but not every distributed system is parallel', 'All distributed systems are necessarily parallel', 'The two terms are identical in meaning', 'The two concepts have no relationship at all'], answer: 0 },
  { question: 'Clusters are generally deployed to improve speed and/or reliability compared to a single computer, while remaining more cost-effective than a single computer of comparable capability. This best implies that:', options: ['A single computer of comparable speed is always cheaper', 'A cluster is always faster than any single computer', 'A cluster tends to offer better price-performance for comparable reliability', 'Clusters only improve reliability, never speed'], answer: 2 },
  { question: "Utility computing pricing is essentially an expression of the provider's costs plus a profit margin. This implies that:", options: ['All providers necessarily use identical pricing', 'Pricing has no real relationship to underlying costs', 'Different pricing models can reflect different cost structures and profit goals', 'Profit margins are fixed by regulation'], answer: 2 },
  { question: 'Which of the following statements about cloud storage is generally correct?', options: ['Data stored in the cloud is never replicated', 'Data is theoretically kept safe by being replicated across multiple machines', 'Cloud storage always includes a physical local backup as well', 'Only one provider in the market offers cloud storage'], answer: 1 },
  { question: 'The fact that different cloud systems use different protocols and APIs, making it hard to run the same application across providers, refers to which issue?', options: ['A portability problem', 'A security advantage', 'A cost benefit', 'A performance improvement'], answer: 0 },
  { question: "In the context of PaaS, 'vendor lock-in' is considered a concern because:", options: ['PaaS is always free to use', 'Proprietary languages or platform-specific approaches can make it hard to move to another provider', 'All PaaS providers use exactly the same programming language', 'Lock-in is not actually possible with PaaS'], answer: 1 },
  { question: 'Compared to individual desktop users who rarely back up their own data, cloud computing is often promoted as a safer, data-conscious computing platform. This claim is:', options: ['Always true under every circumstance', "True mainly in the sense that it depends on the provider's practices and reliability", 'False, because cloud storage is never safe', 'Only applicable to large businesses, not individuals'], answer: 1 },
  { question: "Cloud computing is often described as offering 'increased data reliability' while also carrying the risk that 'stored data can be lost'. This apparent contradiction suggests that:", options: ['The claims about cloud computing are simply contradictory and unreliable', "Reliability in practice depends on the provider's practices and the user's own precautions", 'Cloud storage never actually loses data', 'Only local storage can ever be considered reliable'], answer: 1 },
  { question: 'Which of the following is NOT typically cited as a factor driving organizational investment in cloud computing?', options: ['Cost savings', 'Business agility', 'Reduction in IT headcount', 'A guarantee of 100% uptime'], answer: 3 },
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

/* ---------------- Module 1 page ---------------- */
/* ---------------- Module 1 page ---------------- */

export default function Module1Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 01 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">Computing Paradigms & Cloud Fundamentals</h1>
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