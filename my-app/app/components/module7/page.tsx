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
    heading: '1. Mobile Cloud Computing — Motivation & Definition',
    items: [
      'Motivation: growth in smartphones/apps, increased device capability, and more internet access via mobile than PCs, but mobile devices face resource challenges (battery life, storage, bandwidth) that cloud computing can offset by offering infrastructure, platforms, and software on-demand at low cost.',
      'Mobile Cloud Computing (MCC) is the combination of cloud computing, mobile computing, and wireless networks to bring rich computational resources to mobile users, providing data storage and processing in the cloud so devices don\u2019t need powerful configurations.',
      'MBaaS (Mobile Backend-as-a-Service) connects mobile apps to backend cloud storage/processing, abstracting away infrastructure management so developers can focus on front-end development.',
      'Examples of augmenting mobiles with cloud: Amazon Silk (split browser), Apple Siri (cloud speech recognition), Apple iCloud (unlimited storage/sync), and image-recognition/augmented-reality apps (e.g. Google Glass).',
    ],
  },
  {
    heading: '2. Why & Key Features of MCC',
    items: [
      'Reasons to use MCC: speed and flexibility (apps built/revised quickly across devices/OSes), shared resources (apps not constrained by device storage/processing, seamless engagement across devices), and integrated data (quick, secure collection/integration of data from various sources).',
      'Key features: facilitates quick app development/delivery/management, uses fewer device resources, supports varied devices/approaches, connects via API architecture, and improves reliability through cloud backup.',
      'Pros: saves battery power, makes execution faster. Cons: must send program state/data to the cloud (consumes battery), and network latency can delay execution. MCC is a framework to augment a resource-constrained mobile device by executing parts of the program on cloud servers.',
    ],
  },
  {
    heading: '3. MCC Workflow & Key Components',
    items: [
      'MCC key components: the Profiler monitors app execution to collect data on execution time, power consumption, and network traffic; the Solver decides which parts of an app run on mobile vs. cloud; the Synchronizer collects the results of split execution, combines them, and keeps execution transparent to the user.',
      'Key requirements: simple APIs requiring no specific knowledge of underlying network technologies, a web interface, and internet access to remotely stored cloud applications.',
      'Typical architecture: mobile devices connect to mobile networks via base stations that establish/control connections; user requests/information travel to central processors connected to servers; requests are delivered to the cloud through the internet; cloud controllers process requests to provide the corresponding services.',
    ],
  },
  {
    heading: '4. Advantages of MCC',
    items: [
      'Extending battery lifetime: computation offloading migrates large/complex processing from resource-limited devices to resourceful cloud servers, and remote execution can save significant energy.',
      'Improving data storage capacity and processing power: MCC lets mobile users store/access large data on the cloud and reduces running costs for computation-intensive apps, so apps aren\u2019t constrained by on-device storage.',
      'Improving reliability and availability: keeping data/apps in the cloud reduces the chance of loss on the device; MCC can offer a comprehensive security model (protecting copyrighted content, virus scanning, malicious-code detection, authentication) and near-constant availability even as users move.',
      'Other advantages: dynamic provisioning, scalability, multi-tenancy (providers share resources/costs across many apps/users), and ease of integration (multiple providers\u2019 services combined via the cloud/internet).',
    ],
  },
  {
    heading: '5. MCC Challenges — Security',
    items: [
      'MCC security issues fall into two categories: security for mobile users, and securing data on the cloud.',
      'Mobile-user security/privacy: devices face threats like malicious code; GPS raises privacy concerns; installing security software is the simplest defense, but resource-constrained devices are harder to protect; location-based services (LBS) raise privacy issues, worsened if an adversary learns a user\u2019s important information.',
      'Approaches move threat detection to the cloud: a host agent inspects file activity on the device and sends unrecognized files to a cloud verification service; attack detection for a smartphone can be performed on a remote cloud server, with the phone sending only a minimal execution trace.',
    ],
  },
  {
    heading: '6. MCC Challenges — Context-Awareness, Network, QoS, Pricing',
    items: [
      'Context-aware mobile cloud services monitor user preferences and local context (data types, network status, device environment) to improve QoS.',
      'Network access management: efficient management improves link performance and optimizes bandwidth usage.',
      'Quality of Service: ensuring QoS (especially network delay) is a major issue; CloneCloud and Cloudlets aim to reduce network delay by cloning data/apps from the smartphone onto the cloud and selectively executing/reintegrating operations.',
      'Pricing: MCC involves both a Mobile Service Provider (MSP) and a Cloud Service Provider (CSP) with different management/payment models, requiring a carefully developed business model.',
    ],
  },
  {
    heading: '7. MCC Challenges — Standards & Service Convergence',
    items: [
      'Standard interface: interoperability is important as mobile users interact with the cloud; device/web-interface compatibility, and standard protocols/signaling/interfaces are needed.',
      'Service convergence: services differ by type, cost, availability, and quality; new schemes are needed for users to utilize multiple clouds in a unified fashion, with automatic discovery/composition of services. Sky computing leverages resources from multiple cloud providers to create a large-scale distributed infrastructure.',
    ],
  },
  {
    heading: '8. Dynamic Partitioning & Task Partitioning Problem',
    items: [
      'MCC requires dynamic partitioning of an application to optimize energy saving and execution time, via middleware that decides at app launch which parts run on the mobile device vs. the cloud — a classic optimization problem.',
      'The Task Partitioning Problem: input is a call graph representing an app\u2019s method-call sequence, with node attributes for (a) energy to execute a method locally and (b) energy to transfer program state to a remote server. Output: partition methods into a locally-executed set and a cloud-executed set. Goals/constraints: minimize energy, respect an execution-time limit, and possibly other constraints (e.g. required local methods, monetary cost).',
      'Mathematical formulation: the app call graph is a Directed Acyclic Graph; "native tasks" (highlighted nodes) must run on the mobile device, while other nodes may run locally or remotely. It is formulated as a 0-1 integer linear program, where Iv = 0 means executed locally and Iv = 1 means executed remotely, with terms for energy cost to execute locally (E), cost of data transfer (Cu,v), total execution latency (L), time to execute (T), and time to transfer state (B).',
      'Static partitioning invokes an ILP solver (or heuristics) at launch to decide where each method runs. Dynamic/adaptive partitioning re-evaluates during a long-running program since environmental conditions and per-input energy consumption can vary.',
    ],
  },
  {
    heading: '9. MCC Systems: MAUI & COMET',
    items: [
      'MAUI (Mobile Assistance Using Infrastructure): the programmer marks each method as "remoteable" or not (native methods cannot be remoteable); the MAUI framework uses these annotations, plus a cloud-side MAUI server, to decide whether a method should execute on the cloud to save energy and time.',
      'COMET (Code Offload by Migrating Execution Transparently): requires only program binaries (no source code), executes multi-threaded programs correctly, and allows threads to migrate between machines depending on workload. It implements a Distributed Shared Memory (DSM) model, where physically separate memories are addressed as one logically shared address space, enabling transparent thread migration; further optimization sends only modified parts of the heap during migration.',
    ],
  },
  {
    heading: '10. Code Offloading Using Cloudlets',
    items: [
      'A cloudlet is "a trusted, resource-rich computer or cluster of computers that is well-connected to the Internet and available for use by nearby mobile devices."',
      'Code offloading sends code to a remote server for execution; using a single-hop network to the cloudlet reduces latency and can lower battery consumption by favoring Wi-Fi/short-range radio over broadband wireless.',
      'A cloudlet is the middle tier of a 3-tier hierarchy: mobile device \u2014 cloudlet \u2014 cloud, placing compute resources physically closer to mobile devices to reduce latency.',
    ],
  },
  {
    heading: '11. When to Offload — Energy Model',
    items: [
      'Energy saved by offloading: Pc\u00d7(C/M) \u2212 Pi\u00d7(C/S) \u2212 Ptr\u00d7(D/B), where C = instructions to compute, M = mobile compute speed, S = cloud compute speed, D = data to transmit, B = wireless bandwidth, Pc = energy/sec while computing, Pi = energy/sec while idle, Ptr = energy/sec while transmitting.',
      'If the server is F times faster than the mobile device (S = F\u00d7M), the formula becomes (C/M)\u00d7(Pc \u2212 Pi/F) \u2212 Ptr\u00d7(D/B).',
      'Energy is saved (formula is positive) when D/B is small relative to C/M and F is large \u2014 i.e. offloading is most beneficial with large amounts of computation C and relatively small communication D. Not all applications save energy when migrated to the cloud, and services should account for the energy overhead of privacy, security, reliability, and communication before offloading.',
    ],
  },
  {
    heading: '12. Computation Offloading Approaches & Evaluation',
    items: [
      'Approaches: partitioning a program based on pre-execution energy estimation; dynamically calculating optimal partitioning at runtime based on the communication/computation cost trade-off; and profiling-based offloading, where a cost graph plus a branch-and-bound algorithm minimizes total energy and communication cost.',
      'Evaluating MCC performance: energy consumption (must reduce usage/extend battery life), time to completion (should not exceed local execution time), monetary cost (network/server usage must be optimized), and security (offloading transfers data to servers, so confidentiality/privacy of sensitive data must be protected).',
      'Open questions: how to design a practical, usable MCC framework and partitioning algorithm; whether a scalable partitioning algorithm exists given that the optimization is NP-hard and heuristics offer no performance guarantee; and which parameters matter most in MCC system design.',
    ],
  },
  {
    heading: '13. MCC Applications',
    items: [
      'Mobile healthcare: health-monitoring services, intelligent emergency management, health-aware devices (pulse rate, blood pressure, alcohol level).',
      'Mobile gaming: can offload the entire game engine (e.g. graphics rendering) to the cloud.',
      'Mobile commerce: business models for commerce via mobile (financial, advertising, shopping).',
      'Mobile learning (m-learning): combines e-learning and mobility; cloud-based m-learning overcomes device/network cost and limited educational resources, improving student-teacher communication and enabling collaborative learning.',
      'Assistive technologies: pedestrian crossing guidance for the blind/visually impaired, mobile currency readers, and lecture transcription for hearing-impaired students.',
    ],
  },
  {
    heading: '14. MuSIC: Mobility-Aware Optimal Service Allocation',
    items: [
      'User mobility adds complexity to optimally decomposing tasks across mobile clients and a tiered cloud architecture while balancing QoS goals (delay, power, cost). As users move, physical distance to provisioned cloud resources changes, adding delay, and poor WiFi handoff can cause packet loss \u2014 unaddressed mobility can result in suboptimal resource mapping and diminished QoS.',
      'MuSIC uses a Location-Time Workflow (LTW) to model mobile applications and capture user mobility, then optimally partitions execution across a 2-tier architecture using a utility metric combining service price, power consumption, and delay.',
      'Tier 1 (public cloud, e.g. Amazon EC2, Azure, Google AppEngine) is highly scalable/available but lacks fine-grained location granularity; Tier 2 (local cloud, nodes connected to access points) provides finer location granularity (campus/street level). Mobile users connect to local clouds via WiFi or cellular, and the system intelligently selects which local/public resources to use.',
      'Modeling concepts: the Cloud Service Set (all local/public services available), Local Cloud Capacity (limited concurrent requests), Location Map (partition of 2-D space), User Service Set (services on the user\u2019s own device), Mobile User Trajectory (list of location-time tuples), and Center of Mobility (the location where a user spends most of their time).',
    ],
  },
  {
    heading: '15. Case Study: Context-Aware Dynamic Parking Service',
    items: [
      'MCC combined with vehicular networks supports Context-aware Vehicular Cyber-physical systems (CVC), addressing the growing problem of insufficient parking in large cities using WSNs and cloud computing.',
      'Traditional parking garages: WSNs detect parking-space context and forward it via 3G/Internet to the traffic cloud, which processes and selectively transmits data to users (and can publish status on nearby billboards).',
      'Dynamic parking services: vehicles may temporarily park along a road when it won\u2019t impede traffic, with services dynamically arranged based on context such as rush-hour patterns and road conditions.',
      'Three studied aspects: (1) decision-making by traffic authorities based on historical traffic flow, road/weather conditions, and traffic-flow forecasting (with data mining and decision trees, and immediate service termination for fatal factors like an approaching typhoon); (2) parking reservation services, where users query the traffic cloud for available spaces; (3) context-aware optimization, using expected parking duration to optimize locations for drivers even when garages appear full.',
    ],
  },
  {
    heading: '16. Fog Computing — Motivation & Definition',
    items: [
      'Limitations of "cloud-only" computing: communication delay from human-smartphone interaction, centralized datacenters causing network congestion when data comes from many regions, and tasks needing very low response time (e.g. to prevent crashes/traffic jams) that cloud-only architectures struggle to meet.',
      'Fog computing (also called fogging/edge computing) concentrates data, processing, and applications in devices at the network edge rather than entirely in the cloud; the term was introduced by Cisco Systems to ease wireless data transfer to distributed IoT devices, aiming to run applications directly at the network edge on hardened routers/switches.',
      'Fog brings intelligence down from the cloud closer to end-users: cellular base stations, network routers, and WiFi gateways can run applications, and end devices (sensors) perform basic data processing, lowering response time for real-time applications.',
      'Fog reduces bandwidth needs by aggregating data at access points instead of sending every bit to the cloud, which can lower cost and improve efficiency.',
    ],
  },
  {
    heading: '17. Fog Computing — Enablers, Advantages & Relationship to Cloud',
    items: [
      'Enablers: virtualization (VMs on edge devices), containers (lightweight virtualization, e.g. Docker, reducing resource-management overhead), Service-Oriented Architecture (SOA \u2013 components provide services to others via a network protocol), and Software Defined Networking (SDN \u2013 open protocols like OpenFlow apply centralized, globally aware control at the network edge instead of proprietary firmware).',
      'Fog is not a replacement for cloud computing \u2014 handshaking between fog and cloud is needed. Benefits of fog: low latency and location awareness, wide geographical distribution, mobility support, very large numbers of nodes, predominant wireless access, strong support for streaming/real-time applications, and heterogeneity.',
      'Fog advantages: distinguished from cloud by proximity to end-users, dense geographical distribution, mobility support, low latency, location awareness, and improved QoS for real-time applications.',
      'Limitations of cloud computing that fog addresses: high bandwidth requirements, client access link constraints, high latency, and security \u2014 fog reduces data movement/congestion, eliminates centralized bottlenecks, and improves security by keeping encrypted data closer to the end user.',
    ],
  },
  {
    heading: '18. Fog Computing — Use Cases, Applicability & IoT',
    items: [
      'Use cases: emergency evacuation systems (real-time info on affected areas/exit routes), natural disaster management (real-time notifications for landslides/flash floods), pre-processing large sensor deployments before sending summarized data to the cloud (reducing network congestion), and IoT big-data applications (connected vehicles, smart cities, WSANs).',
      'Applicability: smart grids, smart traffic lights, wireless sensors, Internet of Things, and software-defined networks.',
      'Connected Vehicles (CV): rich connectivity scenarios (car-to-car, car-to-access-point, access-point-to-access-point); fog\u2019s geo-distribution, mobility/location awareness, low latency, heterogeneity, and real-time support make it ideal for infotainment, safety, traffic support, and analytics services.',
    ],
  },
  {
    heading: '19. Fog Computing — Security, Challenges & Resource Management',
    items: [
      'Security issues: authentication at different gateway/fog-node levels, man-in-the-middle attacks, privacy issues, and (for smart grids) risks of tampered smart meters, false reading reports, or spoofed IP addresses.',
      'Fog challenges: proper resource allocation among applications while ensuring end-to-end latency, resource management for throughput/availability/scalability, and security of applications/services/data.',
      'Resource management goals: utilizing idle fog nodes for better throughput, enabling more parallel operations, load balancing, meeting real-time delay requirements, providing crash fault-tolerance, and improving scalability.',
      'Resource management challenges: data may be unavailable at the executing fog node (requiring fetch from source), nodes may become unresponsive under heavy load (compromising latency), choosing a new node during micro-service migration, migrating partially processed persistent data (state migration), transferring final results quickly to clients/actuators, deploying components across nodes to meet latency needs, and isolating co-located applications for data security/integrity.',
      'Resource management approaches: migrating execution to the nearest node from the mobile client; minimizing carbon footprint for video streaming; emphasizing resource prediction/estimation/reservation and pricing for IoT customers; using Docker as an edge computing platform for fast deployment/elasticity; managing resources based on customer relinquish probability, service price/type; and formulating base-station association, task distribution, and VM placement (for cost-efficient fog-based medical cyber-physical systems) as a mixed-integer linear program solved via a two-phase heuristic.',
    ],
  },
  {
    heading: '20. Geospatial Information & GIS',
    items: [
      'Geographic information is explicitly linked to locations on earth\u2019s surface; it can be static (doesn\u2019t change position, e.g. a city/lake/park) or dynamic (changes over time, e.g. a city\u2019s population), and varies in scale from meters to the globe.',
      'Types of geospatial information: legal (cadastral, zoning), political (county lines, districts), cultural, climatic, topographic, biotic, medical, economic, infrastructure, and social.',
      'Geospatial data sources: social surveys, natural surveys (e.g. SOI maps), remotely sensed data (air photos, satellite imagery), reporting networks (weather stations), and field data collection (GPS data or map marking).',
      'A GIS (Geographic Information System) is a computer system for capturing, storing, querying, analyzing, and displaying geospatial data, turning spatial data into decision-relevant information. GIS components: computer hardware, software, data management/analysis procedures, spatial data, and the people who operate it.',
      'GIS challenges: data-intensive, computation-intensive, variable server load demanding dynamic scaling, high reliability/performance requirements, and reliance on network-intensive web services.',
    ],
  },
  {
    heading: '21. GIS Heterogeneity & Spatial Data Infrastructure',
    items: [
      'Heterogeneity issue: GIS layers are often developed by diverse departments using a mix of software/information systems, making cross-enterprise data/application sharing nearly impossible; issues to resolve include homogeneous data description, standard encoding, and standard sharing mechanisms.',
      'GIS user trends move from individual projects to groups/teams, to multi-user (enterprise), to societal-scale use.',
      'Spatial Data Infrastructure (SDI) implies coordination for policy formulation/implementation, providing a basis for spatial data discovery, evaluation, and application across government, commercial, non-profit, academic, and citizen users.',
    ],
  },
  {
    heading: '22. Need for Geospatial Cloud',
    items: [
      'Drivers: huge volume of data/metadata, the need for services and service orchestration, and evolving standards/policies.',
      'Benefits: organizations can share spatial data and access others\u2019 spatial services; less infrastructure/expertise is needed since spatial service images port easily to VMs; GIS decisions become easier (integrating databases, merging systems, exchanging information); shared resource pooling suits organizations with common goals; managed services reduce data/work loss from outages; and organizations can acquire web-service capacity as needed at nominal cost with strong security controls.',
      'NIST defines cloud computing as a model enabling convenient, on-demand network access to a shared pool of configurable computing resources (networks, servers, storage, applications, services) that can be rapidly provisioned and released with minimal management effort or provider interaction.',
    ],
  },
  {
    heading: '23. Cloud Characteristics, Advantages & Actors',
    items: [
      'Core cloud characteristics: on-demand self-service, ubiquitous network access, resource pooling, location independence, rapid elasticity, and measured (pay-as-you-use) services.',
      'Cloud advantages: on-demand scalability and better resource utilization; minimized IT resource management (outsourcing hardware/software/personnel management); improved focus on business processes and easier data sharing; minimized start-up/CAPEX costs; consumption-based billing; economy of scale via multiplexing; and green computing through reduced carbon footprint.',
      'Cloud actors: the Cloud Service Provider (CSP)/broker (provides infrastructure, platform, or service), the customer (a single user or organization), an optional negotiator (negotiates agreements and publishes services on the broker\u2019s behalf), and an SLA Manager/Security Auditor (not present in most current clouds).',
    ],
  },
  {
    heading: '24. Geospatial Cloud Architecture & Model',
    items: [
      'The cloud as a service provider hosts a collection of Enterprise GIS (eGIS) instances, comprising a Resource Service (allocation/manipulation of VMs and network properties, monitoring), a Data Service (persistent user/system data for a configurable environment), and an Interface Service (user-visible interfaces, authentication, and management tools).',
      'Web service is the key technology delivering geospatial services, integrating data from heterogeneous back-end data services that may sit inside or outside the cloud; data services inside the cloud typically run via the PaaS model, which makes load balancing, distributed replication, and dynamic scaling transparent.',
      'Data sources for a geospatial cloud: a central data repository within the cloud, and external data repositories providing data via WFS/WMS services; key performance metrics are computation power and network bandwidth.',
    ],
  },
  {
    heading: '25. IIT Kharagpur Experimental Geospatial Cloud — Case Studies',
    items: [
      'Case Study 1 (Service Integration for Query in Cloud): merges highway and local-road network layers into a single merged road network, then performs shortest-path calculation over the merged network.',
      'Case Study 2 (Service Integration for Query in Cloud): merges canal and river layers into a merged water network, then computes and visualizes a buffer zone on the merged water network.',
    ],
  },
  {
    heading: '26. Challenges in Geospatial Cloud & Interoperability',
    items: [
      'Challenges: implementing spatial databases, scaling spatial databases, needing multi-tenancy, policy management among tenants, geographically situated backups, and data security.',
      'Interoperability requires multiple levels: Data Level Interoperability (ability to "consume" information), Service Level Interoperability (ability to exchange/obtain information to be consumed), and Security Level Interoperability (ability to do the above reliably and trustworthily) \u2014 implemented via OGC and other standards bodies.',
      'Major security concern for geo-cloud: multi-tenancy and lack of complete control over data, applications, and services.',
      'Key concerns to assess: which assets (data, applications, functions, processes) should be deployed in the cloud, what value those assets hold, and the ways they could be compromised (becoming widely public, accessed by a rogue cloud-provider employee, manipulated by an outsider, unexpectedly changed, or made unavailable for a period of time).',
    ],
  },
];

const questions: Question[] = [
  { question: 'What is the primary motivation for Mobile Cloud Computing (MCC)?', options: ['To replace all mobile devices with desktops', 'To offset mobile resource challenges (battery, storage, bandwidth) using cloud infrastructure', 'To eliminate the need for wireless networks', 'To increase device manufacturing costs'], answer: 1 },
  { question: 'Mobile Cloud Computing (MCC) is defined as the combination of:', options: ['Cloud computing and mobile computing only', 'Cloud computing, mobile computing, and wireless networks', 'Only wireless networks and mobile devices', 'Grid computing and mobile computing'], answer: 1 },
  { question: 'What does MBaaS stand for?', options: ['Mobile Backend-as-a-Service', 'Mobile Broadband-as-a-Service', 'Mobile Business-as-a-Service', 'Mobile Bandwidth-as-a-Service'], answer: 0 },
  { question: 'Which of the following is an example of augmenting mobiles with cloud computing?', options: ['Apple Siri (cloud speech recognition)', 'A local calculator app', 'A device\u2019s built-in flashlight', 'Offline note-taking app'], answer: 0 },
  { question: 'According to the MCC pros/cons, what is a "con" of mobile cloud computing?', options: ['Saves battery power', 'Makes execution faster', 'Must send program state/data to the cloud, consuming battery', 'Reduces network usage'], answer: 2 },
  { question: 'In MCC key components, which module monitors execution time, power consumption, and network traffic?', options: ['Solver', 'Synchronizer', 'Profiler', 'Scheduler'], answer: 2 },
  { question: 'Which MCC component decides which parts of an app run on mobile vs. cloud?', options: ['Profiler', 'Solver', 'Synchronizer', 'Broker'], answer: 1 },
  { question: 'Which MCC component collects results of split execution and makes the process transparent to the user?', options: ['Profiler', 'Solver', 'Synchronizer', 'Negotiator'], answer: 2 },
  { question: 'One of the key requirements for MCC is:', options: ['Complex APIs requiring deep network knowledge', 'Simple APIs requiring no specific knowledge of underlying network technologies', 'No internet access needed', 'Mandatory desktop-only access'], answer: 1 },
  { question: 'Computation offloading in MCC primarily helps to:', options: ['Increase device weight', 'Extend battery lifetime by migrating processing to the cloud', 'Decrease cloud reliability', 'Eliminate the need for internet'], answer: 1 },
  { question: 'MCC improves reliability and availability primarily because:', options: ['Data/apps kept in the cloud reduce chance of loss on the device', 'Devices no longer need updates', 'Cloud servers never fail', 'Data is only stored locally'], answer: 0 },
  { question: 'Multi-tenancy as an MCC advantage means:', options: ['Only one user can use the cloud at a time', 'Service providers share resources/costs across many apps and users', 'Devices cannot connect simultaneously', 'Tenants must own their own servers'], answer: 1 },
  { question: 'MCC security issues are broadly categorized into:', options: ['Hardware and software security', 'Security for mobile users and securing data on clouds', 'Only network security', 'Only application security'], answer: 1 },
  { question: 'Which of the following is a mobile-user security/privacy concern mentioned in the notes?', options: ['GPS causing privacy issues', 'Faster charging', 'Unlimited storage', 'Lower cost'], answer: 0 },
  { question: 'A key approach for security in MCC is to:', options: ['Never scan mobile devices', 'Move threat detection capabilities to the cloud', 'Disable all network connections', 'Store passwords in plaintext'], answer: 1 },
  { question: 'Context-aware mobile cloud services aim to improve:', options: ['Battery manufacturing cost', 'Quality of Service (QoS) by using local context', 'Device screen resolution', 'Cloud provider revenue only'], answer: 1 },
  { question: 'CloneCloud and Cloudlets are expected to:', options: ['Increase network delay', 'Reduce the network delay by cloning data/apps to the cloud', 'Eliminate the need for cloud computing', 'Increase battery consumption'], answer: 1 },
  { question: 'In MCC pricing challenges, which two providers are typically involved?', options: ['Mobile Service Provider (MSP) and Cloud Service Provider (CSP)', 'Only hardware manufacturers', 'Only ISPs', 'Government regulators only'], answer: 0 },
  { question: 'Sky computing is described as:', options: ['A single-cloud model', 'A model leveraging resources from multiple cloud providers for a large-scale distributed infrastructure', 'A local-only computing model', 'A model that avoids cloud entirely'], answer: 1 },
  { question: 'MCC requires dynamic partitioning of an application to optimize:', options: ['Energy saving and execution time', 'Screen brightness only', 'App icon design', 'Marketing cost'], answer: 0 },
  { question: 'In the Task Partitioning Problem, the input is:', options: ['A call graph representing the app\u2019s method-call sequence', 'A list of app store reviews', 'A device\u2019s battery percentage only', 'A network diagram of routers'], answer: 0 },
  { question: 'In the ILP formulation of the Task Partitioning Problem, Iv = 1 means:', options: ['The method is executed locally', 'The method is executed remotely', 'The method is deleted', 'The method fails'], answer: 1 },
  { question: 'In the mathematical formulation, "native tasks" refer to:', options: ['Methods that must be executed on the mobile device', 'Methods that must run only on the cloud', 'Deprecated methods', 'Methods with no energy cost'], answer: 0 },
  { question: 'Static partitioning in MCC means:', options: ['Partitioning is decided once at app launch using an ILP solver or heuristics', 'Partitioning changes every millisecond', 'No partitioning is ever done', 'Partitioning only happens after the app crashes'], answer: 0 },
  { question: 'Dynamic or adaptive partitioning is needed because:', options: ['Environmental conditions and energy consumption can vary over a long-running program', 'Static partitioning is always faster', 'Devices never change location', 'Cloud servers never change load'], answer: 0 },
  { question: 'In MAUI, what must a programmer do to mark a method for offloading eligibility?', options: ['Mark each method as "remoteable" or not', 'Rewrite the method in a new language', 'Delete the method', 'Nothing, MAUI is fully automatic'], answer: 0 },
  { question: 'In MAUI, native methods:', options: ['Can always be remoteable', 'Cannot be remoteable', 'Must always run on the cloud', 'Have no energy cost'], answer: 1 },
  { question: 'COMET requires:', options: ['Modified source code only', 'Only program binaries (no source code required)', 'A brand-new programming language', 'Manual thread management by the user'], answer: 1 },
  { question: 'COMET implements which memory model for its runtime engine?', options: ['Distributed Shared Memory (DSM)', 'Local-only memory', 'Read-only memory', 'Static memory allocation'], answer: 0 },
  { question: 'A cloudlet is best described as:', options: ['A trusted, resource-rich computer/cluster well-connected to the internet, near mobile devices', 'A small mobile app', 'A type of battery', 'A cloud-only data center with no local presence'], answer: 0 },
  { question: 'A cloudlet represents which tier in the 3-tier hierarchy?', options: ['mobile device \u2014 cloudlet \u2014 cloud', 'cloud \u2014 cloud \u2014 cloud', 'mobile device \u2014 mobile device \u2014 cloud', 'cloudlet \u2014 cloudlet \u2014 mobile device'], answer: 0 },
  { question: 'In the "When to Offload" energy formula, D represents:', options: ['The data that needs to be transmitted', 'The device\u2019s screen size', 'The number of apps installed', 'The mobile\u2019s battery capacity'], answer: 0 },
  { question: 'In the offload energy formula, S represents:', options: ['The speed of the cloud to compute C instructions', 'The screen resolution', 'The storage capacity', 'The number of sensors'], answer: 0 },
  { question: 'Offloading is most beneficial when:', options: ['D/B is small relative to C/M and F is large', 'D/B is very large', 'C/M is zero', 'F is very small'], answer: 0 },
  { question: 'According to the notes, is offloading always energy efficient?', options: ['Yes, always', 'No, not all applications are energy efficient when migrated to the cloud', 'Only for gaming apps', 'Only on weekends'], answer: 1 },
  { question: 'One computation offloading approach uses a cost graph and which algorithm to minimize total energy/communication cost?', options: ['Branch-and-bound algorithm', 'Bubble sort', 'Linear search', 'Random selection'], answer: 0 },
  { question: 'Which of the following is a metric for evaluating MCC performance?', options: ['Energy consumption', 'Screen color', 'App icon size', 'Font style'], answer: 0 },
  { question: 'Why is the MCC partitioning optimization problem considered difficult?', options: ['It is NP-hard, and heuristics offer no performance guarantee', 'It has only one possible solution', 'It requires no computation', 'It is always solved instantly'], answer: 0 },
  { question: 'Which of the following is an MCC application area mentioned in the notes?', options: ['Mobile healthcare', 'Mobile gaming', 'Mobile commerce', 'All of the above'], answer: 3 },
  { question: 'Mobile learning (m-learning) combines:', options: ['E-learning and mobility', 'Only textbooks', 'Only classroom lectures', 'Only paper-based tests'], answer: 0 },
  { question: 'MuSIC uses which framework to model mobile applications and capture user mobility?', options: ['Location-Time Workflow (LTW)', 'Static Route Table', 'Fixed Grid Map', 'Random Walk Model'], answer: 0 },
  { question: 'In MuSIC\u2019s 2-tier architecture, Tier 1 typically represents:', options: ['Public cloud services (e.g. Amazon EC2, Azure)', 'Only local WiFi routers', 'Only the mobile device itself', 'A single physical server'], answer: 0 },
  { question: 'In MuSIC, Tier 2 (local cloud) provides:', options: ['Finer location granularity (campus/street level)', 'No location information at all', 'Only global-scale services', 'Unlimited free compute'], answer: 0 },
  { question: 'In MuSIC modeling, "Center of Mobility" refers to:', options: ['The location where a mobile user spends most of their time', 'The exact center of a city', 'A fixed cloud data center', 'The user\u2019s home network IP'], answer: 0 },
  { question: 'In the context-aware dynamic parking case study, WSN stands for:', options: ['Wireless Sensor Network', 'Wide Service Node', 'Web Service Notification', 'Wireless Signal Node'], answer: 0 },
  { question: 'In dynamic parking services, what might cause traffic authorities to immediately terminate services?', options: ['A fatal factor like an approaching typhoon', 'A holiday', 'Low battery on a sensor', 'A software update'], answer: 0 },
  { question: 'What is context-aware optimization used for in the parking case study?', options: ['Optimizing best parking locations using expected duration of parking', 'Charging electric vehicles', 'Painting road markings', 'Repairing potholes'], answer: 0 },
  { question: 'What are the two main limitations of "cloud-only" computing mentioned before introducing fog computing?', options: ['Communication delay and centralized datacenter congestion', 'Too much local storage and too many CPUs', 'Excess battery life and too much bandwidth', 'No limitations exist'], answer: 0 },
  { question: 'Fog computing is also known as:', options: ['Fogging/edge computing', 'Grid computing', 'Quantum computing', 'Serverless computing'], answer: 0 },
  { question: 'Which company introduced the term "Fog Computing"?', options: ['Cisco Systems', 'Google', 'Amazon', 'Microsoft'], answer: 0 },
  { question: 'Fog computing brings intelligence down from the cloud to:', options: ['Devices close to the ground/end-user (base stations, routers, gateways)', 'Only central data centers', 'Only satellites', 'Nowhere new'], answer: 0 },
  { question: 'Fog computing reduces bandwidth needs by:', options: ['Aggregating data at access points instead of sending everything to the cloud', 'Sending every bit of raw data to the cloud', 'Disabling all sensors', 'Removing all network connections'], answer: 0 },
  { question: 'Which of the following is a Fog Computing enabler?', options: ['Virtualization', 'Containers (e.g. Docker)', 'Software Defined Networking (SDN)', 'All of the above'], answer: 3 },
  { question: 'Fog computing is best described in relation to cloud computing as:', options: ['A complete replacement for cloud computing', 'Not a replacement — handshaking between fog and cloud is needed', 'Entirely unrelated to cloud computing', 'A competitor that eliminates the cloud'], answer: 1 },
  { question: 'Which of the following is a benefit of fog computing?', options: ['Low latency and location awareness', 'High latency only', 'No mobility support', 'Only centralized processing'], answer: 0 },
  { question: 'Which of the following is a limitation of cloud computing that fog aims to address?', options: ['High bandwidth requirement and high latency', 'Too much local processing', 'Excess battery life', 'Too many local servers'], answer: 0 },
  { question: 'Which of the following is a fog computing use-case mentioned in the notes?', options: ['Emergency evacuation systems', 'Natural disaster management', 'IoT big-data applications', 'All of the above'], answer: 3 },
  { question: 'Which of the following is NOT listed under fog computing applicability?', options: ['Smart Grids', 'Smart Traffic Lights', 'Wireless Sensors', 'Manual paper filing systems'], answer: 3 },
  { question: 'In Connected Vehicle (CV) scenarios, fog computing helps deliver services such as:', options: ['Infotainment, safety, traffic support, and analytics', 'Only music streaming', 'Only navigation maps', 'Only vehicle manufacturing'], answer: 0 },
  { question: 'Which security issue is mentioned specifically for smart grids in the fog computing notes?', options: ['Tampering with smart meters or spoofing IP addresses', 'Overheating of solar panels', 'Excessive rainfall', 'Slow internet speed only'], answer: 0 },
  { question: 'Which of the following is a major security issue in fog computing?', options: ['Man-in-the-Middle-Attack', 'Faster processing speed', 'Lower latency', 'Reduced bandwidth usage'], answer: 0 },
  { question: 'Fog challenges include:', options: ['Proper resource allocation while ensuring end-to-end latency', 'Increasing manufacturing cost of routers', 'Reducing the number of IoT devices', 'Removing all sensors'], answer: 0 },
  { question: 'Resource management goals in fog computing include:', options: ['Utilizing idle fog nodes for better throughput', 'Wasting idle resources intentionally', 'Preventing all parallel operations', 'Disabling load balancing'], answer: 0 },
  { question: 'A resource management challenge in fog computing is:', options: ['Data may not be available at the executing fog node, requiring data fetching', 'Fog nodes never fail', 'All data is always locally available', 'Latency requirements do not matter'], answer: 0 },
  { question: 'What does "state migration" refer to in fog resource management?', options: ['Migrating partially processed persistent data to a new node', 'Changing a device\u2019s operating system', 'Moving a data center to another country', 'Updating firmware only'], answer: 0 },
  { question: 'Which platform is mentioned as useful for fast deployment and elasticity in edge computing?', options: ['Docker', 'A physical mainframe', 'A punch card system', 'A fax machine'], answer: 0 },
  { question: 'Geographic information linked explicitly to locations on earth\u2019s surface is called:', options: ['Geographic/geospatial information', 'Random data', 'Encrypted data', 'Metadata only'], answer: 0 },
  { question: 'Static geographic information is defined as information that:', options: ['Does not change position (e.g. a city, lake, park)', 'Changes every second', 'Only exists in the cloud', 'Cannot be mapped'], answer: 0 },
  { question: 'Dynamic geographic information is exemplified by:', options: ['Population of a city (changes over time)', 'The location of a mountain', 'The location of a lake', 'A fixed park boundary'], answer: 0 },
  { question: 'Which of the following is a type of geospatial information mentioned in the notes?', options: ['Legal (cadastral, zoning laws)', 'Political (county lines, districts)', 'Climatic (temperature, precipitation)', 'All of the above'], answer: 3 },
  { question: 'Which of the following is a geospatial data source?', options: ['Remotely sensed data (satellite imagery)', 'Random number generator', 'Word processor documents', 'Spreadsheet formulas'], answer: 0 },
  { question: 'A Geographic Information System (GIS) is defined as:', options: ['A computer system for capturing, storing, querying, analyzing, and displaying geospatial data', 'A word processing tool', 'A video editing tool', 'A spreadsheet calculator'], answer: 0 },
  { question: 'Which of the following is a component of a GIS?', options: ['Computer hardware', 'Software', 'Spatial data', 'All of the above'], answer: 3 },
  { question: 'GIS challenges include:', options: ['Being data-intensive and computation-intensive', 'Requiring no computation at all', 'Being immune to load variability', 'Requiring no network services'], answer: 0 },
  { question: 'The heterogeneity issue in GIS arises because:', options: ['GIS layers are developed by diverse departments using a mix of software/systems', 'All departments always use identical systems', 'GIS never involves multiple departments', 'Data sharing is always trivial'], answer: 0 },
  { question: 'GIS user trends move from projects/groups toward:', options: ['Multi-user (enterprise) and eventually societal-scale use', 'Single isolated users only', 'No users at all', 'Only government use'], answer: 0 },
  { question: 'What does SDI stand for in the geospatial context?', options: ['Spatial Data Infrastructure', 'Software Development Interface', 'System Data Index', 'Secure Data Identifier'], answer: 0 },
  { question: 'SDI provides a basis for:', options: ['Spatial data discovery, evaluation, and application for users and providers', 'Only military applications', 'Only weather forecasting', 'Only academic research'], answer: 0 },
  { question: 'One driver for the need of a Geospatial Cloud is:', options: ['Huge volume of data and metadata requiring services and orchestration', 'Decreasing amounts of spatial data', 'No need for standards', 'Elimination of all GIS data'], answer: 0 },
  { question: 'A benefit of Geospatial Cloud mentioned in the notes is:', options: ['Easy porting of spatial service images to multiple virtual machines', 'Mandatory purchase of physical servers by every organization', 'Complete elimination of data sharing', 'No security provisions at all'], answer: 0 },
  { question: 'According to NIST\u2019s definition quoted in the notes, cloud computing enables:', options: ['On-demand network access to a shared pool of configurable computing resources', 'Only offline computing', 'Manual provisioning with heavy management effort', 'A single dedicated server per user'], answer: 0 },
  { question: 'Which of the following is a core cloud computing characteristic listed in the notes?', options: ['On-demand self-service', 'Ubiquitous network access', 'Rapid elasticity', 'All of the above'], answer: 3 },
  { question: 'Measured Services in cloud computing refers to:', options: ['Pay-as-you-use billing based on measured usage', 'Free unlimited usage for everyone', 'A one-time flat fee regardless of usage', 'No billing at all'], answer: 0 },
  { question: 'Which of the following is a cloud advantage mentioned in the notes?', options: ['Minimizing start-up costs (reducing CAPEX)', 'Increasing manual IT management', 'Eliminating economy of scale', 'Increasing carbon footprint'], answer: 0 },
  { question: 'In the cloud actors list, who provides infrastructure, platform, or service?', options: ['Cloud Service Provider (CSP) or Broker', 'The end customer only', 'A random third party', 'No one — it is automatic'], answer: 0 },
  { question: 'In the cloud actors list, who negotiates agreements between a broker and a customer?', options: ['The Negotiator (optional role)', 'The end customer always', 'The government', 'The Security Auditor'], answer: 0 },
  { question: 'The Cloud as Service Provider architecture includes which of the following services?', options: ['Resource Service, Data Service, and Interface Service', 'Only a single monolithic service', 'Only a billing service', 'Only a marketing service'], answer: 0 },
  { question: 'Data services inside a geospatial cloud are typically run through which service model?', options: ['PaaS (Platform-as-a-Service)', 'On-premise-only model', 'No service model at all', 'Manual deployment only'], answer: 0 },
  { question: 'Using PaaS in a geospatial cloud makes which of the following transparent?', options: ['Load balancing, distributed replication, and dynamic scaling', 'User interface color themes', 'Marketing campaigns', 'Employee scheduling'], answer: 0 },
  { question: 'Data sources for a geospatial cloud include:', options: ['Central data repository and external repositories via WFS/WMS services', 'Only paper maps', 'Only offline spreadsheets', 'Only manual surveys with no digitization'], answer: 0 },
  { question: 'Key performance metrics for a geospatial cloud include:', options: ['Computation power and network bandwidth', 'Screen brightness', 'Number of employees', 'Font size'], answer: 0 },
  { question: 'In the IIT Kharagpur experimental geospatial cloud Case Study 1, what two layers are merged?', options: ['Highway and local roads into a merged road network', 'Canal and river layers', 'Weather and population data', 'Satellite images and audio files'], answer: 0 },
  { question: 'After merging the road network in Case Study 1, what operation is performed?', options: ['Shortest path calculation', 'Random path generation', 'Weather forecasting', 'Population estimation'], answer: 0 },
  { question: 'In Case Study 2, what two layers are merged into a water network?', options: ['Canal and river', 'Road and railway', 'Building and park', 'Airport and highway'], answer: 0 },
  { question: 'After merging the water network in Case Study 2, what operation is demonstrated?', options: ['Buffer calculation on the merged water network', 'Traffic signal placement', 'Population density mapping', 'Currency exchange calculation'], answer: 0 },
  { question: 'Which of the following is a challenge in Geospatial Cloud mentioned in the notes?', options: ['Scaling of spatial databases and needing multi-tenancy', 'Excess availability of spatial data', 'No security concerns at all', 'Unlimited free bandwidth for all users'], answer: 0 },
  { question: 'Data Level Interoperability in geospatial systems ensures:', options: ['The ability to "consume" the information', 'The ability to physically transport hardware', 'The elimination of all data formats', 'Random data corruption'], answer: 0 },
  { question: 'Service Level Interoperability ensures:', options: ['The ability to exchange/obtain information to be "consumed"', 'The physical construction of data centers', 'The elimination of web services', 'Manual-only data transfer'], answer: 0 },
  { question: 'Security Level Interoperability ensures:', options: ['The ability to exchange/obtain information in a reliable and trustworthy fashion', 'The removal of all security measures', 'Free access for anyone without authentication', 'No encryption is needed'], answer: 0 },
  { question: 'Interoperability standards for geospatial systems are implemented using standards from:', options: ['OGC and other standards bodies', 'No standards at all', 'Only proprietary vendor formats', 'Random ad-hoc formats'], answer: 0 },
  { question: 'The major security concern for Geo-Cloud mentioned in the notes is:', options: ['Multi-tenancy and lack of complete control over data/applications/services', 'Excessive computing power', 'Too much bandwidth availability', 'Too many satellites'], answer: 0 },
  { question: 'When assessing cloud asset deployment, one key concern is:', options: ['What is the value of the assets being deployed', 'What color the interface should be', 'How many employees work at the company', 'What font is used in reports'], answer: 0 },
  { question: 'Which of the following is listed as a way cloud assets could be compromised?', options: ['An employee of the cloud provider accessing the assets improperly', 'The asset becoming more secure automatically', 'The asset never being accessed by anyone', 'The asset gaining extra encryption automatically'], answer: 0 },
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

/* ---------------- Module 7 page ---------------- */

export default function Module7Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 07 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Mobile Cloud Computing, Fog Computing &amp; Geospatial Cloud
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