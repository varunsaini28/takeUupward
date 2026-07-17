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
    heading: '1. Dew Computing — Overview & Definition',
    items: [
      'Dew computing is a computing paradigm that combines the core concept of cloud computing with the capabilities of end devices (personal computers, mobile phones, etc.), enhancing the end-user experience compared to using the cloud alone.',
      'Dew computing attempts to solve one of the major problems of cloud computing: reliance on internet access.',
      'Dew Computing is a model for enabling ubiquitous, pervasive, and convenient ready-to-go, plug-in facility empowered personal networks, including a Single-Super-Hybrid-Peer P2P communication link.',
      'Primary goal: access a pool of raw data equipped with meta-data that can be rapidly created, edited, stored, and deleted with minimal internetwork management effort (i.e. offline mode) — whereas using all cloud functionality normally requires heavy dependence on constant internet connectivity.',
      'Dew computing (DC) is a new, user-centric, flexible, and personalized-supported paradigm located very close to the end devices; it is the first layer in the IoT-fog-cloud continuum, and is micro-service-based with a vertically distributed hierarchy.',
    ],
  },
  {
    heading: '2. Dew Computing — Characteristics & Typical Example',
    items: [
      'DC comprises smart devices (smartphones, smart-watches, tablets, etc.) located at the edge of the network that connect with end devices, collect and process IoT-sensed data, and offer other services.',
      'Services in DC remain relatively available and do not mandate a permanent internet connection; DC does not depend on any centralized server or cloud data center, nor on a permanent internet connection.',
      'Typical example: Dropbox exemplifies dew computing, since it provides access to files/folders in the cloud while also keeping copies on local devices, allowing access without an internet connection; once a connection is re-established, files and folders synchronize back to the cloud server.',
    ],
  },
  {
    heading: '3. Dew Computing — Features',
    items: [
      'Key features of dew computing are independence and collaboration.',
      'Independence means the local device must be able to provide service without a continuous connection to the internet.',
      'Collaboration means the application must be able to connect to the cloud service and synchronize data when appropriate.',
      'The word "dew" reflects natural phenomena: clouds are far from the ground, fog is closer to the ground, and dew is on the ground — analogically, cloud computing is a remote service, fog computing is beside the user, and dew computing is at the user end.',
    ],
  },
  {
    heading: '4. Dew Service Models & Typical Applications',
    items: [
      'Infrastructure-as-Dew (IaD): the local device is dynamically supported by cloud services; can be realized either as an exact duplicate DVM instance kept in the same state as the local instance, or as full settings/data (system and per-application) saved in the cloud.',
      'Software-in-Dew (SiD): the configuration and ownership of software are saved in the cloud (e.g. Apple App Store, Google Play — installed apps are tied to the user\u2019s account and can be reinstalled on any linked device).',
      'Platform-in-Dew (PiD): a software development suite is installed on the local device with settings and application data synchronized to the cloud, synchronizing development data, deployment data, and online backups (example: GitHub).',
      'Storage-in-Dew: the storage of the local device is partially or fully copied into the cloud, meeting independence (offline access) and collaboration (automatic sync) simultaneously.',
      'Web-in-Dew (WiD): the local device holds a duplicated (or modified) fraction of the World Wide Web (WWW); synchronizing this fraction with the web satisfies the collaboration feature.',
      'Database-in-Dew (DBiD): both the local device and the cloud store copies of the same database, with one designated the main version by the database administrator; this increases database reliability since either copy can back up the other.',
    ],
  },
  {
    heading: '5. Dew Computing — Architecture',
    items: [
      'To establish a cloud-dew architecture on a local machine, a Dew Virtual Machine (DVM) is needed — an isolated environment for executing the dew server on the local system.',
      'The architecture links IoT devices/sensors and a host machine (running the Dew Client Program and Dew Server, inside the DVM alongside the Dew Client Service and Dew DBMS) to the cloud server via a Single Hybrid P2P communication link.',
      'Dew Server functions: serves the user with requested services, and performs synchronization and correlation between local data and remote data.',
      'The Dew Server architecture attempts to achieve three goals: Data Replication, Data Distribution, and Synchronization.',
    ],
  },
  {
    heading: '6. Dew Computing — Application Areas',
    items: [
      'Web in Dew (WiD): possesses a duplicated (or modified) fraction of the WWW to satisfy independence; synchronizing this fraction with the web satisfies the collaboration feature.',
      'Storage in Dew: local storage partially/fully copied into the cloud, satisfying independence (anytime file access without internet) and collaboration (automatic folder/content sync with the cloud).',
      'Database in Dew (DBiD): local device and cloud both store copies of the same database, with one considered the main version, increasing database reliability since either copy can act as backup.',
      'Software in Dew: software configuration/ownership saved in the cloud (e.g. Apple App Store, Google Play).',
      'Platform in Dew (PiD): a development suite installed locally with settings/application data synced to the cloud, syncing development data, deployment data, and online backups — example: GitHub.',
      'Infrastructure as Dew (IaD): the local device is dynamically supported by cloud services, either via a duplicate DVM instance in the cloud kept in sync, or via full settings/data (system and per-application) saved in the cloud.',
    ],
  },
  {
    heading: '7. Dew Computing — Challenges',
    items: [
      'Key challenges listed: Power Management, Processor Utility, Data Storage, Viability of Operating System, Programming Principles, and Database Security.',
    ],
  },
  {
    heading: '8. Serverless Computing — Overview & Definition',
    items: [
      'Serverless computing is a method of providing backend services on an as-used basis; a serverless provider lets users write and deploy code without worrying about the underlying infrastructure.',
      'Serverless architecture simplifies code deployment and eliminates system administration, letting developers focus on core logic without the overhead of instantiating/monitoring resources such as VMs or containers.',
      'Developers execute their logic as functions submitted to the cloud provider, which runs them in a shared runtime environment and manages scalability by running multiple functions in parallel.',
      'Following wide-scale containerization, cloud services now offer better-fitting containers that load (boot) faster and provide increased automation (orchestration) on the client\u2019s behalf; serverless computing promises full automation in managing fine-grained containers.',
      '"Serverless computing is a form of cloud computing that allows users to run event-driven and granular applications, without having to address the operational logic." It acts as a computing abstraction: developers focus on high-level abstractions (functions, queries, events), while infrastructure operators map these to concrete resources and supporting services.',
      'Service providers ensure serverless applications are orchestrated — containerized, deployed, provisioned, and available on demand — while billing the user only for resources actually used.',
      'The cloud provider dynamically allocates and provisions servers; code executes in almost-stateless containers that are event-triggered and ephemeral (may last for just one invocation).',
    ],
  },
  {
    heading: '9. Serverless — Backend-as-a-Service (BaaS) vs Function-as-a-Service (FaaS)',
    items: [
      'Serverless technologies are grouped into two categories: Backend-as-a-Service (BaaS) and Functions-as-a-Service (FaaS).',
      'BaaS lets developers replace server-side components with off-the-shelf services, outsourcing "behind the scenes" aspects so developers can focus on writing/maintaining frontend application logic; typical examples include remote authentication systems, database management, cloud storage, and hosting (e.g. Google Firebase, a fully managed database used directly from an application).',
      'FaaS is a form of serverless computing where the cloud provider manages the resources, lifecycle, and event-driven execution of user-provided functions; users provide small, stateless functions and the provider manages all operational aspects of running them.',
      'Example: the ExCamera application uses cloud functions and workflows to edit, transform, and encode videos with low latency and cost; most such tasks can execute concurrently, improving performance through parallelization.',
      'Serverless applications are event-driven cloud-based systems relying solely on a combination of third-party services, client-side logic, and cloud-hosted remote procedure calls; each function typically describes a small part of an entire application, with limited execution time.',
      'Functions are not constantly active — FaaS platforms listen for events (client requests, events from external systems, data streams, etc.) that instantiate the functions, and the FaaS provider horizontally scales function executions in response to incoming events.',
    ],
  },
  {
    heading: '10. Serverless Computing — Challenges',
    items: [
      'Asynchronous calls: asynchronous calls to/between serverless functions increase system complexity, since remote API calls following a request-response model are usually easier to implement synchronously.',
      'Functions calling other functions: leads to complex debugging and loose isolation of features; calling functions synchronously adds extra cost since two functions run at the same time.',
      'Shared code between functions: changing shared code might break dependent serverless functions; there is risk of hitting the image size limit (50MB in AWS Lambda), and bigger images increase warm-up time.',
      'Usage of too many libraries increases the risk of hitting the image size limit and increases warm-up time.',
      'Adoption of too many technologies (libraries, frameworks, languages) adds maintenance complexity and increases required skills for the team.',
      'Too many functions: since non-active serverless functions cost nothing, there is a temptation to create new functions rather than modify existing ones, leading to decreased maintainability and lower system understandability.',
    ],
  },
  {
    heading: '11. AWS Lambda',
    items: [
      'AWS Lambda is an event-driven, serverless computing platform provided by Amazon as part of AWS; users need not worry about which AWS resources to launch or how to manage them — code is simply placed on Lambda and it runs.',
      'Code executes based on the response of events in AWS services, such as add/delete operations on an S3 bucket or an HTTP request from Amazon API Gateway; however, AWS Lambda can only be used to execute background tasks.',
      'AWS Lambda helps developers focus on core product/business logic instead of managing OS access control, OS patching, right-sizing, provisioning, and scaling.',
      'Workflow: (1) upload Lambda code in a supported language (Java, Python, Go, C#, etc.); (2) configure AWS services that trigger the Lambda; (3) upload code and event details specifying when it should trigger; (4) Lambda executes the code when triggered; (5) AWS charges only when the Lambda code executes, not otherwise.',
    ],
  },
  {
    heading: '12. AWS Lambda — Key Concepts',
    items: [
      'Function: a program/script that runs in AWS Lambda; Lambda passes invocation events into the function, which processes the event and returns a response.',
      'Runtimes: allow functions in various languages to run on the same base execution environment, matching the selected programming language.',
      'Event source: an AWS service (e.g. Amazon SNS) or custom service that triggers the function to execute its logic.',
      'Lambda Layers: an important distribution mechanism for libraries, custom runtimes, and other function dependencies.',
      'Log streams: allow annotating function code with custom logging statements to analyze execution flow and performance.',
    ],
  },
  {
    heading: '13. Google Cloud Functions',
    items: [
      'Google Cloud Functions is a serverless execution environment for building and connecting cloud services; developers write simple, single-purpose functions attached to events emitted from cloud infrastructure/services, triggered when a watched event fires.',
      'Code executes in a fully managed environment — there is no need to provision infrastructure or manage servers.',
      'Working: an event (e.g. object uploaded to a Cloud Storage bucket) is generated with associated event data; if a Cloud Function is configured for that event, it is invoked, receives the event data, may invoke other APIs, and may write back to cloud services; when finished, it signals completion.',
      'Multiple event occurrences trigger multiple invocations, handled automatically by the Cloud Functions infrastructure; functions should stay single-purpose, use minimal execution time, and finish promptly to avoid timeouts. The model works best statelessly — state from a previous invocation cannot be relied upon, though state can be maintained outside the framework.',
      'Events occur in Google Cloud Platform services (e.g. file uploaded to storage, message published to a queue, direct HTTP invocation); a Trigger is the event plus its associated data; Event Data is the data passed to the function upon triggering.',
      'Event providers include HTTP (direct invocation), Cloud Storage, Cloud Pub/Sub, Firebase (DB, Analytics, Auth), Stackdriver Logging, Cloud Firestore, Google Compute Engine, and BigQuery.',
    ],
  },
  {
    heading: '14. Azure Functions',
    items: [
      'Azure Functions is a serverless solution allowing developers to write less code, maintain less infrastructure, and save on costs, since the cloud infrastructure provides up-to-date resources instead of requiring server deployment/maintenance.',
      'A function is the primary concept in Azure Functions, containing two parts: the code (written in a variety of languages) and configuration in the function.json file — auto-generated from code annotations for compiled languages, or provided manually for scripting languages.',
      'Build options: use a preferred language (C#, Java, JavaScript, PowerShell, Python, or a custom handler for other languages); automate deployment via tools or external pipelines; troubleshoot using monitoring/testing tools; and choose flexible pricing (Consumption plan pays only while functions run; Premium and App Service plans offer specialized features).',
      'Common serverless architecture patterns with Azure Functions: serverless APIs and mobile/web backends; event and stream processing (IoT data, big data, ML pipelines); integration/enterprise service bus and pub/sub for business events; automation and digital transformation; and middleware/SaaS (e.g. Dynamics) and big data projects.',
    ],
  },
  {
    heading: '15. Sustainable Cloud Computing — Motivation',
    items: [
      'Cloud Service Providers (CSPs) rely heavily on Cloud Data Centers (CDCs) to support ever-increasing demand for computational and application services; the financial and carbon-footprint costs of running such large infrastructure negatively impact sustainability.',
      'Sustainable Cloud Computing focuses on minimizing energy consumption and carbon footprints while ensuring reliability of CDCs.',
      'CDC components (network devices, storage devices, servers) must be available round-the-clock to ensure availability/reliability, but creating, processing, and storing each bit of data adds energy cost, increases carbon footprint, and impacts the environment.',
      'Energy consumed by CDCs is increasing regularly and is expected to reach 8000 Tera Watt hours (TWh) by 2030.',
      'Due to under-loading/over-loading of infrastructure resources, energy consumption in CDCs is often inefficient — much energy is consumed while resources (network, storage, memory, processor) sit idle, raising overall service cost.',
      'Major CSPs (Google, Amazon, Microsoft, IBM) are planning to power their datacenters using renewable energy sources; future CDCs are required to minimize carbon-footprint emissions and heat release (greenhouse gases).',
      'Datacenters can be relocated based on opportunities for waste heat recovery, accessibility of green resources, and proximity of free cooling resources — requiring cloud architectures that enable sustainable services through holistic resource management.',
    ],
  },
  {
    heading: '16. Sustainable Cloud Computing — Conceptual Model',
    items: [
      'The conceptual model is a layered architecture offering holistic management of cloud computing resources to make cloud services more energy-efficient and sustainable.',
      'Cloud Architecture: divided into three sub-components — Software as a Service, Platform as a Service, and Infrastructure as a Service.',
      'Cooling Manager: generates thermal alerts if temperature exceeds a threshold, and the heat controller acts to control temperature with minimal performance impact on the CDC.',
      'Power Manager: controls power from renewable energy resources and fossil fuels (grid electricity); grid energy can be used for deadline-oriented workloads to maintain service reliability. An Automatic Transfer Switch (ATS) manages energy from both sources, and a Power Distribution Unit transfers electricity to all CDCs and cooling devices.',
      'Remote CDC: VMs and workloads can be migrated to a remote CDC to balance load effectively.',
    ],
  },
  {
    heading: '17. Reliability and Sustainability — Issues',
    items: [
      'Energy-related issues: reduce CDC energy consumption; reduce under-loading/overloading of resources to improve load balancing; minimize heat concentration and dissipation; reduce carbon footprints for a more eco-friendly environment; improve bandwidth and computing capacity; and improve storage management (e.g. disk drives).',
      'Reliability-related issues: identify system failures and their causes to manage risk; reduce SLA violation and service delay; protect critical information from security attacks; use encryption/decryption for point-to-point communication; provide a secure VM migration mechanism; improve system capability; and reduce Turn of Investment (ToI).',
      'Implication of reliability on sustainability: improving energy utilization reduces electricity bills/operational costs and enables sustainability, but providing reliable services often means replicating operations across providers, which needs additional resources and increases energy consumption — so a trade-off between energy consumption and reliability is required.',
      'Existing energy-efficient resource management techniques can still consume large amounts of energy during workload execution, decreasing resources leased from CDCs; Dynamic Voltage and Frequency Scaling (DVFS) reduces energy consumption but increases response time/service delay due to switching between high- and low-scaling modes.',
      'Reliability of system components is also affected by excessive turning on/off of servers; power modulation decreases the reliability of components like storage devices and memory. Reducing CDC energy consumption can improve resource utilization, reliability, and server performance, but new energy-aware resource management techniques are needed that reduce power without hurting reliability.',
    ],
  },
  {
    heading: '18. Sustainable Cloud Computing — Components: Application Model & Energy-Targeted Resources',
    items: [
      'Application Model: the efficient structure of an application can improve CDC energy efficiency; application models can be data parallel, function parallel, and message passing.',
      'Resources Targeted in Energy Management: energy consumption of processor, memory, storage, network, and cooling in CDCs is typically reported as approximately 45%, 15%, 10%, 10%, and 20% respectively.',
      'Power regulation approaches can increase energy consumption during workload execution, affecting CDC resource utilization; DVFS attempts to address resource utilization, but switching between scaling modes increases response time/service delay and may violate SLAs.',
      'Putting servers to sleep or turning them on/off can affect the availability/reliability of system components — so improving energy efficiency affects resource utilization, reliability, and server performance together.',
    ],
  },
  {
    heading: '19. Sustainable Cloud Computing — Components: Thermal-Aware Scheduling & Virtualization',
    items: [
      'Thermal-aware scheduling has two components — architecture (single-core or multi-core) and scheduling mechanism (reactive or proactive) — designed to minimize the cooling set-point temperature, hotspots, and thermal gradient caused by workload heating.',
      'Existing thermal-aware techniques focus on reducing Power Usage Efficiency (PUE), but a lower PUE may not reduce the Total Cost of Ownership (TCO).',
      'Virtualization: VM migration balances load effectively to utilize renewable energy resources in decentralized CDCs; when on-site renewable energy is lacking, workloads are distributed to geographically distant machines. VM technology also enables migrating workloads from renewable-energy-based CDCs to CDCs that can utilize waste heat at another site, and VM-based migration/consolidation techniques provide virtual resources using fewer physical servers.',
    ],
  },
  {
    heading: '20. Sustainable Cloud Computing — Components: Capacity Planning, Renewable Energy & Waste Heat',
    items: [
      'Capacity Planning: effective, organized capacity planning (for power infrastructure, IT resources, and workloads) helps CSPs attain expected ROI; merging applications during virtualization improves resource utilization and reduces capacity cost; workloads should be analyzed before execution, especially for deadline-oriented workloads, and storage capacity planning must also be handled cost-effectively.',
      'Renewable Energy: the renewable source (solar, wind, etc.), storage device, and location (on-site or off-site) are key factors; Carbon Usage Efficiency (CUE) can be reduced by adding more renewable resources, though unpredictability and high capital cost are major challenges — workload migration and energy-aware load balancing help address supply unpredictability, and datacenters are ideally placed near renewable sources for cost effectiveness.',
      'Waste Heat Utilization: cooling mechanisms and heat transfer models help utilize waste heat effectively, since CDCs act as heat generators; vapor-absorption-based cooling systems can use and evaporate waste heat, reducing cooling expenses and improving energy efficiency.',
    ],
  },
  {
    heading: '21. Sustainable Cloud Computing — Taxonomy & Summary',
    items: [
      'With the huge growth of IoT-based applications, cloud service usage is increasing exponentially, so cloud computing must become energy efficient and sustainable to meet growing end-user needs.',
      'Research initiatives on sustainable cloud computing are categorized as: application design, sustainability metrics, capacity planning, energy management, virtualization, thermal-aware scheduling, cooling management, renewable energy, and waste heat utilization.',
      'Sustainability metrics and energy management are important CSP concerns — improving energy use reduces electricity bills/operational costs; essential requirements include optimal software system design, optimized air ventilation, and installing temperature-monitoring tools for adequate resource utilization.',
      'The next generation of cloud computing must be energy efficient and sustainable; in sustainable cloud computing, CDCs are powered by renewable energy resources in place of conventional fossil-fuel-based grid electricity ("brown energy") to reduce carbon emissions, with sustainability alongside high performance and reliability as a primary goal.',
    ],
  },
];

const questions: Question[] = [
  { question: 'Dew computing combines the core concept of cloud computing with:', options: ['Only wireless sensor networks', 'The capabilities of end devices (PCs, mobile phones, etc.)', 'Only quantum processors', 'Only satellite communication'], answer: 1 },
  { question: 'What major cloud computing problem does dew computing attempt to solve?', options: ['Reliance on internet access', 'Excess battery life', 'Too much local storage', 'Too many CPU cores'], answer: 0 },
  { question: 'Dew Computing enables a personal network with which communication link?', options: ['Single-Super-Hybrid-Peer P2P communication link', 'Only client-server communication', 'Only satellite uplink', 'Only Bluetooth mesh'], answer: 0 },
  { question: 'The primary goal of dew computing is to access a pool of raw data equipped with meta-data that can be:', options: ['Rapidly created, edited, stored, and deleted with minimal internetwork management effort', 'Permanently locked and unmodifiable', 'Only accessible with a paid subscription', 'Stored exclusively on tape backups'], answer: 0 },
  { question: 'Dew computing is described as the first layer in which continuum?', options: ['IoT-fog-cloud continuum', 'CPU-GPU-TPU continuum', 'LAN-WAN-MAN continuum', 'Client-server-peer continuum'], answer: 0 },
  { question: 'DC (Dew Computing) is described as a micro-service-based paradigm with which kind of hierarchy?', options: ['Vertically distributed hierarchy', 'Fully centralized hierarchy', 'No hierarchy at all', 'Randomized hierarchy'], answer: 0 },
  { question: 'Which of the following best describes the availability requirement of services in DC?', options: ['Services are relatively available and do not require a permanent internet connection', 'Services require a permanent internet connection at all times', 'Services are only available once a year', 'Services require a dedicated fiber line'], answer: 0 },
  { question: 'Which application is given as a typical example of the dew computing paradigm?', options: ['Dropbox', 'A basic calculator app', 'An offline text editor with no cloud sync', 'A local-only photo viewer'], answer: 0 },
  { question: 'What are the two key features of dew computing?', options: ['Independence and collaboration', 'Speed and cost', 'Security and encryption', 'Compression and caching'], answer: 0 },
  { question: 'In dew computing, "independence" means:', options: ['The local device can provide service without a continuous internet connection', 'The device must always be connected to the internet', 'The application cannot ever sync with the cloud', 'The device must be manufactured independently'], answer: 0 },
  { question: 'In dew computing, "collaboration" means:', options: ['The application can connect to the cloud service and synchronize data when appropriate', 'The device can never connect to any cloud service', 'Only manual data transfer via USB is allowed', 'Devices must never share any data'], answer: 0 },
  { question: 'According to the "dew" analogy, which computing paradigm is described as being "at the user end"?', options: ['Dew computing', 'Cloud computing', 'Grid computing', 'Mainframe computing'], answer: 0 },
  { question: 'According to the analogy, fog computing is described as being:', options: ['Beside the user', 'Far from the ground', 'On the moon', 'Inside a data center only'], answer: 0 },
  { question: 'In Infrastructure-as-Dew (IaD), the local device is:', options: ['Dynamically supported by cloud services', 'Completely disconnected from any cloud service', 'Only used for gaming', 'Replaced entirely by the cloud'], answer: 0 },
  { question: 'Software-in-Dew (SiD) is exemplified by which examples in the notes?', options: ['Apple App Store and Google Play', 'Microsoft Excel only', 'A local file manager', 'An offline calculator'], answer: 0 },
  { question: 'Platform-in-Dew (PiD) requires a software development suite with settings/application data synchronized to the cloud; which example is given?', options: ['GitHub', 'Notepad', 'A physical whiteboard', 'A paper notebook'], answer: 0 },
  { question: 'Storage-in-Dew refers to:', options: ['The storage of the local device being partially or fully copied into the cloud', 'Deleting all local storage permanently', 'Storing data only on removable USB drives', 'Preventing any cloud storage access'], answer: 0 },
  { question: 'Web-in-Dew (WiD) means the local device possesses:', options: ['A duplicated (or modified) fraction of the World Wide Web', 'No internet content at all', 'A complete offline copy of every website ever created', 'Only a browser bookmark list'], answer: 0 },
  { question: 'In Database-in-Dew (DBiD), how many copies of the database typically exist?', options: ['Both the local device and the cloud store copies', 'Only the cloud stores a copy', 'Only the local device stores a copy', 'No copies are stored anywhere'], answer: 0 },
  { question: 'What is needed to establish a cloud-dew architecture on a local machine?', options: ['A Dew Virtual Machine (DVM)', 'A satellite uplink', 'A dedicated mainframe', 'A quantum computer'], answer: 0 },
  { question: 'The Dew Virtual Machine (DVM) is described as:', options: ['An isolated environment for executing the dew server on the local system', 'A cloud-only virtual machine with no local presence', 'A hardware chip installed in routers', 'A type of physical server rack'], answer: 0 },
  { question: 'Which of the following are functions of the Dew Server?', options: ['Serving user requests and synchronizing/correlating local and remote data', 'Manufacturing hardware components', 'Printing physical documents', 'Managing employee payroll'], answer: 0 },
  { question: 'The Dew Server architecture attempts to achieve which three goals?', options: ['Data Replication, Data Distribution, and Synchronization', 'Marketing, Sales, and Billing', 'Cooling, Heating, and Ventilation', 'Hiring, Training, and Payroll'], answer: 0 },
  { question: 'Which of the following is listed as a challenge of dew computing?', options: ['Power Management', 'Excess bandwidth availability', 'Too much local storage', 'Unlimited processing power'], answer: 0 },
  { question: 'Which of the following is also listed as a dew computing challenge?', options: ['Database Security', 'Free unlimited internet access', 'Zero power consumption', 'Guaranteed infinite storage'], answer: 0 },
  { question: 'Serverless computing is a method of providing backend services on which basis?', options: ['An as-used basis', 'A fixed annual subscription only', 'A one-time perpetual license', 'A hardware-purchase basis'], answer: 0 },
  { question: 'Serverless architecture eliminates the need for:', options: ['System administration', 'Internet access entirely', 'Programming logic', 'User authentication in general'], answer: 0 },
  { question: 'In serverless computing, developers execute their logic in the form of:', options: ['Functions submitted to the cloud provider', 'Physical hardware installations', 'Manual batch scripts run by IT staff only', 'Static HTML pages only'], answer: 0 },
  { question: 'Cloud providers manage the scalability needs of serverless functions by:', options: ['Running multiple functions in parallel', 'Limiting execution to one function at a time forever', 'Disabling scaling entirely', 'Charging a flat fee regardless of usage'], answer: 0 },
  { question: 'Serverless computing promises to achieve full automation in managing:', options: ['Fine-grained containers', 'Physical server racks', 'Office furniture', 'Employee schedules'], answer: 0 },
  { question: 'As a computing abstraction, serverless computing lets developers focus on high-level abstractions such as:', options: ['Functions, queries, and events', 'Physical wiring diagrams', 'Manual server racking', 'Paper documentation only'], answer: 0 },
  { question: 'Serverless service providers bill the user based on:', options: ['Only the resources actually used', 'A flat fee regardless of usage', 'The number of employees at the company', 'The size of the office building'], answer: 0 },
  { question: 'The two main categories of serverless computing technologies are:', options: ['Backend-as-a-Service (BaaS) and Functions-as-a-Service (FaaS)', 'Hardware-as-a-Service and Data-as-a-Service', 'Only IaaS and PaaS', 'Only SaaS and DaaS'], answer: 0 },
  { question: 'BaaS enables developers to:', options: ['Replace server-side components with off-the-shelf services', 'Manually configure every physical server', 'Avoid writing any frontend code', 'Eliminate all cloud services entirely'], answer: 0 },
  { question: 'Which example of BaaS is given in the notes?', options: ['Google Firebase', 'Microsoft Word', 'Adobe Photoshop', 'A local text editor'], answer: 0 },
  { question: 'FaaS is a form of serverless computing where the cloud provider manages:', options: ['The resources, lifecycle, and event-driven execution of user-provided functions', 'Only the user\u2019s billing address', 'Only the marketing of the application', 'Only the company\u2019s hiring process'], answer: 0 },
  { question: 'The ExCamera application example in the notes uses cloud functions and workflows to:', options: ['Edit, transform, and encode videos with low latency and cost', 'Manage payroll systems', 'Print physical documents', 'Design furniture layouts'], answer: 0 },
  { question: 'FaaS platforms instantiate functions by:', options: ['Listening for events that trigger them', 'Running continuously at all times regardless of events', 'Requiring manual daily restarts', 'Ignoring all external triggers'], answer: 0 },
  { question: 'Which of the following is listed as a serverless computing challenge related to calls between functions?', options: ['Asynchronous calls increasing system complexity', 'Complete elimination of any complexity', 'Guaranteed zero cost for all calls', 'No challenges exist at all'], answer: 0 },
  { question: 'What is the AWS Lambda image size limit mentioned as a risk factor for shared code?', options: ['50MB', '5MB', '500MB', '5GB'], answer: 0 },
  { question: 'Why might developers be tempted to create too many serverless functions?', options: ['Non-active serverless functions do not cost anything', 'Functions are physically limited to one per account', 'Functions must be paid for even when inactive', 'Functions cannot be deleted once created'], answer: 0 },
  { question: 'AWS Lambda is described as:', options: ['An event-driven, serverless computing platform provided by Amazon', 'A physical server rack sold by Amazon', 'A programming language created by Amazon', 'A hardware chip for mobile phones'], answer: 0 },
  { question: 'In AWS Lambda, code execution is triggered by events such as:', options: ['Add/delete files in an S3 bucket or an HTTP request from API Gateway', 'Turning on a physical light switch', 'Manually rebooting a laptop', 'Printing a document'], answer: 0 },
  { question: 'AWS Lambda can only be used to execute:', options: ['Background tasks', 'Frontend UI rendering exclusively', 'Physical hardware assembly', 'Office scheduling only'], answer: 0 },
  { question: 'AWS Lambda helps developers focus on business logic instead of managing:', options: ['OS access control, patching, right-sizing, provisioning, and scaling', 'Marketing campaigns', 'Employee benefits', 'Office real estate'], answer: 0 },
  { question: 'Which languages are mentioned as supported by AWS Lambda?', options: ['Java, Python, Go, and C#', 'Only assembly language', 'Only COBOL', 'Only Fortran'], answer: 0 },
  { question: 'When does AWS charge for Lambda usage?', options: ['Only when the Lambda code executes', 'A flat monthly fee regardless of execution', 'Only once per year', 'Only when the account is created'], answer: 0 },
  { question: 'In AWS Lambda concepts, a "Function" is described as:', options: ['A program or script which runs in AWS Lambda, processing invocation events and returning a response', 'A physical server unit', 'A billing statement', 'An employee job title'], answer: 0 },
  { question: 'In AWS Lambda, "Runtimes" allow:', options: ['Functions in various languages to run on the same base execution environment', 'Only one language to ever be used', 'Functions to run without any code', 'Billing to be waived entirely'], answer: 0 },
  { question: 'In AWS Lambda, an "Event source" can be:', options: ['An AWS service such as Amazon SNS, or a custom service', 'Only a physical button on a server', 'Only a human operator typing commands', 'A printed report'], answer: 0 },
  { question: 'What are "Lambda Layers" used for?', options: ['Distribution mechanism for libraries, custom runtimes, and other function dependencies', 'Painting server racks different colors', 'Assigning employee parking spots', 'Creating marketing layers for ads'], answer: 0 },
  { question: 'What do "Log streams" in AWS Lambda allow?', options: ['Annotating function code with custom logging to analyze execution flow and performance', 'Streaming music during code execution', 'Broadcasting video calls', 'Printing physical logs on paper only'], answer: 0 },
  { question: 'Google Cloud Functions is described as:', options: ['A serverless execution environment for building and connecting cloud services', 'A physical data center tour service', 'A hardware manufacturing division of Google', 'A marketing analytics dashboard only'], answer: 0 },
  { question: 'With Google Cloud Functions, developers write functions that are:', options: ['Attached to events emitted from cloud infrastructure and services', 'Manually triggered by phone calls only', 'Executed once per year on a fixed schedule only', 'Unable to connect to any cloud service'], answer: 0 },
  { question: 'Google Cloud Functions code executes in:', options: ['A fully managed environment with no need to provision infrastructure', 'A manually provisioned physical server every time', 'An environment requiring constant manual server administration', 'A local-only environment with no cloud access'], answer: 0 },
  { question: 'In Google Cloud Functions, a "Trigger" is defined as:', options: ['The event plus the data associated with that event', 'Only the raw event with no data', 'A physical button on a keyboard', 'A scheduled meeting reminder'], answer: 0 },
  { question: 'Which of the following is listed as a Google Cloud Functions event provider?', options: ['Cloud Pub/Sub', 'A fax machine', 'A physical mailbox', 'A landline telephone'], answer: 0 },
  { question: 'What happens when multiple event occurrences happen for a Google Cloud Function?', options: ['Multiple invocations of the function result, handled by the Cloud Functions infrastructure', 'Only the first event is ever processed', 'The function is permanently disabled', 'All events are discarded'], answer: 0 },
  { question: 'The Google Cloud Functions execution model works best in which fashion?', options: ['A stateless fashion', 'A fully stateful fashion where state always persists automatically', 'A manual paper-based fashion', 'A purely offline fashion with no events'], answer: 0 },
  { question: 'Azure Functions is described as a serverless solution that allows developers to:', options: ['Write less code and maintain less infrastructure', 'Manually configure every physical server', 'Avoid writing any code entirely', 'Eliminate cloud usage completely'], answer: 0 },
  { question: 'In Azure Functions, the "function.json" file typically contains:', options: ['Configuration for the function', 'The entire operating system kernel', 'A list of company employees', 'A marketing brochure'], answer: 0 },
  { question: 'Which languages can be used to write Azure Functions according to the notes?', options: ['C#, Java, JavaScript, PowerShell, or Python', 'Only machine code', 'Only binary', 'Only punch-card programming'], answer: 0 },
  { question: 'Which Azure Functions pricing plan charges only while functions are running?', options: ['The Consumption plan', 'A flat annual license fee', 'A one-time hardware purchase', 'A per-employee licensing fee'], answer: 0 },
  { question: 'Which of the following is a common serverless architecture pattern for Azure Functions?', options: ['Event and stream processing, IoT data processing', 'Manual paper filing', 'Physical mail sorting', 'In-person customer service only'], answer: 0 },
  { question: 'Why do Cloud Service Providers rely heavily on Cloud Data Centers (CDCs)?', options: ['To support ever-increasing demand for computational and application services', 'To reduce the number of customers they serve', 'To avoid using any computing resources', 'To eliminate the need for the internet'], answer: 0 },
  { question: 'What is the primary goal of Sustainable Cloud Computing?', options: ['Minimizing energy consumption and carbon footprints while ensuring CDC reliability', 'Maximizing carbon emissions for faster processing', 'Eliminating all data storage', 'Increasing electricity costs intentionally'], answer: 0 },
  { question: 'By 2030, the energy consumed by CDCs is expected to reach approximately:', options: ['8000 Tera Watt hours (TWh)', '8 Watt hours', '800 Kilowatt hours', '80 Giga Watt hours'], answer: 0 },
  { question: 'Why is energy consumption in CDCs often inefficient?', options: ['Much energy is consumed while resources sit idle due to under/over-loading', 'CDCs never consume any energy', 'All resources are always perfectly utilized', 'Energy consumption decreases every year automatically'], answer: 0 },
  { question: 'Which major CSPs are mentioned as planning to power datacenters with renewable energy?', options: ['Google, Amazon, Microsoft, and IBM', 'Only small local startups', 'No companies are pursuing renewable energy', 'Only government agencies'], answer: 0 },
  { question: 'Datacenters can be relocated based on which of the following factors?', options: ['Opportunities for waste heat recovery and proximity of free cooling resources', 'Proximity to the nearest coffee shop', 'Distance from any renewable energy source', 'Random selection with no criteria'], answer: 0 },
  { question: 'In the sustainable cloud computing conceptual model, Cloud Architecture is divided into which three sub-components?', options: ['Software as a Service, Platform as a Service, and Infrastructure as a Service', 'Marketing, Sales, and Finance', 'Hardware, Firmware, and Wetware', 'Cooling, Heating, and Lighting only'], answer: 0 },
  { question: 'The Cooling Manager generates thermal alerts when:', options: ['Temperature is higher than a threshold value', 'Temperature is always at zero', 'The server is powered off', 'A new employee is hired'], answer: 0 },
  { question: 'The Power Manager controls power generated from which two sources?', options: ['Renewable energy resources and fossil fuels (grid electricity)', 'Only solar panels', 'Only wind turbines', 'Only nuclear reactors'], answer: 0 },
  { question: 'What device is used to manage energy coming from both renewable and grid sources?', options: ['Automatic Transfer Switch (ATS)', 'A simple light switch', 'A manual lever', 'A rotary telephone dial'], answer: 0 },
  { question: 'What is used to transfer electricity to all the CDCs and cooling devices?', options: ['Power Distribution Unit', 'A garden hose', 'A single extension cord', 'A wireless charger'], answer: 0 },
  { question: 'The "Remote CDC" component allows VMs and workloads to be:', options: ['Migrated to a remote CDC to balance load effectively', 'Permanently deleted', 'Printed on paper', 'Manually retyped by employees'], answer: 0 },
  { question: 'Which of the following is listed as an energy-related reliability/sustainability issue?', options: ['Reducing under-loading and overloading of resources to improve load balancing', 'Increasing carbon footprints intentionally', 'Ignoring bandwidth and computing capacity', 'Disabling all storage management'], answer: 0 },
  { question: 'Which of the following is listed as a reliability-related issue?', options: ['Identifying system failures and their reasons to manage risks', 'Maximizing SLA violations', 'Removing all encryption', 'Disabling secure VM migration'], answer: 0 },
  { question: 'The implication of reliability on sustainability suggests that improving energy utilization:', options: ['Reduces electricity bills and operational costs, enabling sustainable computing', 'Always increases electricity bills with no benefit', 'Has no effect on operational costs', 'Eliminates the need for any cloud providers'], answer: 0 },
  { question: 'Why can providing reliable cloud services increase energy consumption?', options: ['Business operations often replicate services, requiring additional resources', 'Reliable services never require any additional resources', 'Reliability always reduces resource needs to zero', 'Reliability has no relationship to resource usage'], answer: 0 },
  { question: 'DVFS (Dynamic Voltage and Frequency Scaling) reduces energy consumption but can increase:', options: ['Response time and service delay', 'Carbon emissions exponentially', 'The number of employees needed', 'The physical size of the datacenter'], answer: 0 },
  { question: 'Excessive turning on/off of servers can affect:', options: ['The reliability of system components like storage devices and memory', 'Nothing at all — it has zero impact', 'Only the color of the server casing', 'Only the marketing budget'], answer: 0 },
  { question: 'In sustainable cloud computing components, "Application Model" notes that applications can be:', options: ['Data parallel, function parallel, and message passing', 'Only single-threaded and sequential', 'Only manually executed by a human operator', 'Only executed on paper'], answer: 0 },
  { question: 'According to the notes, what percentage of CDC energy consumption is typically attributed to the processor?', options: ['45%', '5%', '95%', '1%'], answer: 0 },
  { question: 'According to the notes, what percentage of CDC energy consumption is attributed to cooling?', options: ['20%', '80%', '2%', '60%'], answer: 0 },
  { question: 'Thermal-aware scheduling architecture can be:', options: ['Single-core or multi-core', 'Only quantum-based', 'Only analog-based', 'Only mechanical'], answer: 0 },
  { question: 'Thermal-aware scheduling mechanisms can be:', options: ['Reactive or proactive', 'Only manual and paper-based', 'Only randomized with no logic', 'Only performed once per decade'], answer: 0 },
  { question: 'A reduction in Power Usage Efficiency (PUE) may not necessarily reduce:', options: ['Total Cost of Ownership (TCO)', 'Carbon emissions to zero instantly', 'The number of servers to zero', 'The need for any cooling at all'], answer: 0 },
  { question: 'VM migration in sustainable CDCs helps to:', options: ['Balance load effectively to utilize renewable energy resources in decentralized CDCs', 'Permanently delete all workloads', 'Increase carbon emissions intentionally', 'Disable all virtualization technology'], answer: 0 },
  { question: 'Effective capacity planning in sustainable cloud computing can be done for:', options: ['Power infrastructure, IT resources, and workloads', 'Only employee vacation schedules', 'Only marketing budgets', 'Only office furniture layouts'], answer: 0 },
  { question: 'Merging applications during virtualization primarily helps to:', options: ['Improve resource utilization and reduce capacity cost', 'Increase costs without any benefit', 'Eliminate the need for any servers', 'Disable renewable energy usage'], answer: 0 },
  { question: 'What is Carbon Usage Efficiency (CUE) reduced by, according to the notes?', options: ['Adding more renewable energy resources', 'Increasing fossil fuel consumption', 'Removing all cooling systems', 'Ignoring datacenter location entirely'], answer: 0 },
  { question: 'What are the major challenges of renewable energy mentioned in the notes?', options: ['Unpredictability and high capital cost', 'Zero cost and perfect predictability', 'No challenges exist at all', 'Excessive availability with no drawbacks'], answer: 0 },
  { question: 'Vapor-absorption-based cooling systems help CDCs by:', options: ['Using and evaporating waste heat to reduce cooling expenses', 'Increasing cooling expenses intentionally', 'Eliminating the need for any cooling entirely', 'Generating additional carbon emissions'], answer: 0 },
  { question: 'According to the sustainable cloud computing taxonomy, which of the following is a listed research category?', options: ['Thermal-aware scheduling', 'Office interior design', 'Employee dress code policy', 'Marketing slogan creation'], answer: 0 },
  { question: 'Which of the following is also listed in the sustainable cloud computing taxonomy?', options: ['Renewable energy', 'Physical mail delivery', 'Paper document archiving', 'In-person sales meetings'], answer: 0 },
  { question: 'Why must cloud computing become energy efficient and sustainable, according to the notes?', options: ['Due to the huge growth of IoT-based applications increasing cloud usage exponentially', 'Because IoT usage is decreasing to zero', 'Because energy is now completely free everywhere', 'Because cloud usage has stopped growing entirely'], answer: 0 },
  { question: 'In sustainable cloud computing, CDCs are increasingly powered by renewable energy instead of:', options: ['Conventional fossil-fuel-based grid electricity ("brown energy")', 'Only manual human-powered generators', 'Only battery power from mobile phones', 'Only candle-based lighting'], answer: 0 },
  { question: 'Which of the following is stated as a primary goal alongside sustainability in next-generation cloud computing?', options: ['High performance and reliability', 'Eliminating all performance requirements', 'Maximizing carbon emissions', 'Removing all reliability guarantees'], answer: 0 },
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

/* ---------------- Module 11 page ---------------- */

export default function Module11Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 11 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud Computing Paradigms: Dew Computing, Serverless Computing &amp; Sustainable Cloud Computing
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