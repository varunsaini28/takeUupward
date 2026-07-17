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
    heading: '1. Docker — Motivation & Key Features',
    items: [
      'Docker is a container management service, first released in March 2013, whose core promise is to develop, ship, and run applications anywhere.',
      'Docker helps developers package applications into containers that can then be deployed on any environment, which has made it a central tool in Agile-based development workflows.',
      'Docker reduces the footprint of development by shrinking the operating system layer needed per app via containers, letting development, QA, and Operations teams collaborate more smoothly across the same artifacts.',
      'Docker containers can be deployed on any physical machine, virtual machine, or cloud platform, and because they are lightweight, they scale very easily.',
    ],
  },
  {
    heading: '2. Docker — Components & Terminology',
    items: [
      'Core Docker components: Docker for Mac/Linux/Windows (platform-specific runners), Docker Engine (builds images and creates containers), Docker Hub (a registry hosting images), and Docker Compose (defines multi-container applications).',
      'Image terminology: an image is a persisted snapshot that can be run. Related commands include listing local images, running a container from an image, tagging an image, pulling an image from a repository, and removing an image (which also cleans up unused intermediate images).',
      'Container terminology: a container is a runnable instance of an image. Related commands include listing running/all containers, viewing a container\u2019s processes, starting/stopping/pausing a container, removing a container, and committing a container back into a new image.',
      'A Dockerfile is a build script used to create images automatically; it can be versioned in Git/SVN alongside dependencies, and Docker Hub can automatically build images straight from Dockerfiles hosted on GitHub.',
      'Docker Hub is a public registry of Docker images at hub.docker.com; "automated" images are those built directly from a Dockerfile whose source is available on GitHub.',
    ],
  },
  {
    heading: '3. Docker Architecture vs. Traditional Virtualization',
    items: [
      'In traditional virtualization, a physical server runs a host OS, on top of which a hypervisor (e.g. VMware or Hyper-V) hosts multiple guest operating systems as virtual machines, with applications installed on top of each guest OS.',
      'In Docker\u2019s architecture, the same physical server and host OS are used, but the Docker Engine replaces the hypervisor/guest-OS layers — all applications now run directly as Docker containers instead of inside separate guest operating systems.',
      'This means Docker removes the need for a full guest OS per application, which is the main source of its lighter weight compared to traditional VM-based virtualization.',
    ],
  },
  {
    heading: '4. Containers vs. Virtual Machines',
    items: [
      'A container is an abstraction at the application layer that packages code and its dependencies together; multiple containers can run on one machine sharing the same OS kernel, each isolated as its own process in user space.',
      'Containers are far smaller than VMs (container images are typically tens of MBs) and start almost instantly, whereas VMs carry a full guest OS and are comparatively heavyweight and slow to boot.',
      'An image is the lightweight, standalone, executable package containing code, runtime, libraries, environment variables, and config files; a container is a runtime instance of that image — what it becomes in memory when executed, isolated from the host by default unless configured otherwise.',
      'Because containers run natively on the host kernel rather than through a hypervisor\u2019s virtual hardware access, they have better performance characteristics than VMs while taking no more memory than any other executable.',
      'VMs entangle OS settings, installed dependencies, and security patches into the disk image and application state, making them resource-intensive and hard to replicate; containers only need the executable and its dependencies, which never need separate installation on the host, so a containerized app "runs anywhere."',
    ],
  },
  {
    heading: '5. Docker Usage',
    items: [
      'Docker is described as the world\u2019s leading software container platform.',
      'Developers use Docker to eliminate "works on my machine" problems when collaborating on code with teammates.',
      'Operators use Docker to run and manage applications side-by-side in isolated containers, improving compute density.',
      'Enterprises use Docker to build agile software delivery pipelines that ship new features faster and more securely, across Linux, Windows Server, and Linux-on-mainframe applications.',
    ],
  },
  {
    heading: '6. Green Cloud — Motivation & Definition',
    items: [
      'Cloud computing is a model enabling convenient, on-demand network access to a shared pool of configurable computing resources such as networks, servers, storage, applications, and services.',
      'Green computing is the environmentally responsible and eco-friendly use of computers and their resources — more broadly, the practice of designing, manufacturing, using, and disposing of computing devices in ways that reduce environmental impact.',
      'Green Cloud computing aims not only for efficient processing and utilization of computing infrastructure, but also for minimizing overall energy consumption.',
    ],
  },
  {
    heading: '7. Green Cloud — Cloud Advantages & the Sustainability Challenge',
    items: [
      'Cloud advantages include reduced spending on infrastructure with pay-as-you-go pricing, a globally accessible workforce, streamlined processes, reduced capital costs, improved accessibility, minimized software-licensing needs, and improved flexibility to change direction without major financial risk.',
      'Despite these advantages, a 2007 Gartner report found the IT industry contributes about 2% of the world\u2019s total CO2 emissions, and a 2007 U.S. EPA report found data centers used 1.5% of total U.S. power consumption — a figure that had more than doubled since 2000 and cost about $4.5 billion — motivating the need for Green Cloud Computing.',
      'Data centers are growing rapidly and consume 10 to 100 times more energy per square foot than a typical office building. Energy already accounts for about 10% of data center operating expenses and could rise to 50% in coming years, with accompanying cooling systems costing $2-5 million per year.',
      'A typical data center\u2019s energy consumption is split roughly as: cooling system ~45%, IT equipment ~40%, and power distribution ~15%.',
    ],
  },
  {
    heading: '8. Data Center Architecture & Energy Models',
    items: [
      'Past data center design used a two-tier architecture with access and core layers, 1GE/10GE links, a full-mesh core network, and ICMP-based load balancing.',
      'Present-day data centers typically use a three-tier architecture (access, aggregation, and core layers), the most widely used design today, scaling to over 10,000 servers; a newer three-tier high-speed variant increases core bandwidth with 2-way ECMP load balancing and 100GE (IEEE 802.3ba) links.',
      'In the data center server energy model, an idle server already consumes about 66% of its peak-load power across all CPU frequencies — power consumption rises from a fixed baseline toward a peak as server load and CPU frequency increase.',
      'In the data center network switch energy model, linecards account for roughly 53% of switch energy consumption, the chassis about 36%, and port transceivers about 11%.',
      'Data centers worldwide now emit more carbon than countries like Argentina and the Netherlands combined, driven by the massive electricity needed to power and cool numerous servers — motivating a shift in focus from optimizing purely for performance toward optimizing for energy efficiency while maintaining service-level performance.',
    ],
  },
  {
    heading: '9. Green Cloud — Provider Initiatives, Broker Architecture & PUE',
    items: [
      'Cloud service providers must adopt measures so high energy costs don\u2019t erode profit margins — Amazon has estimated that energy-related costs (direct power plus amortized cooling infrastructure over 15 years) make up about 42% of its data-center budget, while Google, Microsoft, and Yahoo have built data centers near the Columbia River, USA, to exploit cheap hydroelectric power.',
      'A typical Green Broker mediates between users and cloud providers across three layers: (1) analyzing user requirements, (2) calculating the cost and carbon footprint of candidate services via cost and CO2-emission calculators, and (3) performing carbon-aware scheduling using green policies, leasing, and a scheduler across private and public clouds.',
      'Power Usage Effectiveness (PUE) is a standard metric used to assess how efficiently a data center uses energy for computing versus overhead like cooling.',
      'Clouds are essentially data centers hosting subscription-based application services, but they consume significant energy, incurring both high operational cost and environmental impact; a Carbon Aware Green Cloud Framework aims to improve this footprint, with open research questions remaining around maximizing efficiency and extending benefits to developing regions.',
    ],
  },
  {
    heading: '10. Sensor Cloud — Motivation & WSN Limitations',
    items: [
      'The motivation for Sensor Cloud Computing comes from the growing adoption of sensing technologies (RFID, cameras, mobile phones) and the internet becoming a real-time information source (blogs, social networks, forums); cloud computing offers an attractive way to meet the resulting "Big Data" demand by combining sensor data with internet data.',
      'Wireless Sensor Networks (WSNs) couple the physical environment with the digital world using small, low-power, low-cost nodes offering sensing, processing, memory, and communication capability, useful across environment, healthcare, education, defense, manufacturing, and smart-home applications.',
      'Limitations of sensor networks include difficulty scaling to large sizes, proprietary vendor-specific designs that hinder interconnection, difficulty sharing sensor data across user groups, insufficient computation/storage for large-scale applications, being locked into fixed applications once deployed, and slow adoption of large-scale sensor applications.',
      'The immense power of the cloud can only be fully exploited if it is seamlessly integrated with our physical lives — i.e., feeding real-world information to the cloud in real time and letting the cloud act and respond instantly, which means adding sensing capability to the cloud.',
    ],
  },
  {
    heading: '11. Sensor Cloud — Definition & Framework',
    items: [
      'Sensor Cloud Computing is an infrastructure enabling pervasive computation that uses sensors as the interface between the physical and cyber worlds, data-compute clusters as the cyber backbone, and the internet as the communication medium.',
      'It integrates large-scale sensor networks with sensing applications and cloud infrastructure, collects and processes data from various sensor networks, enables large-scale data sharing/collaboration, delivers cloud services via sensor-rich devices, and supports cross-disciplinary applications spanning organizational boundaries.',
      'A Sensor Cloud lets users collect, access, process, visualize, archive, share, and search large amounts of sensor data across applications, supporting the complete sensor data life cycle and allowing different networks spread over a wide area to be processed and stored using the cloud\u2019s computing/storage resources on demand.',
      'The Sensor-Cloud Proxy acts as the interface between sensor resources and the cloud fabric: it manages sensor network connectivity, exposes sensor resources as cloud services, manages resources via indexing and discovery services, handles sensing jobs, and manages incoming sensor data (format conversion, cleaning/aggregation, transfer to cloud storage); the proxy itself can be virtualized and live on the cloud.',
      'The Sensor Network Proxy provides cloud connectivity for sensors that lack a direct link, continuously or on-demand collecting data for the cloud, which enhances scalability and provides services like power management, security, availability, and QoS for the underlying sensor resources.',
    ],
  },
  {
    heading: '12. Virtual Sensors & Configurations',
    items: [
      'A virtual sensor is a software emulation of a physical sensor that obtains its data from underlying physical sensors, giving users a customized view via distribution and location transparency — useful because sensor hardware is often too limited to run multiple simultaneous tasks or multiple VMs like a traditional cloud host.',
      'One-to-many configuration: one physical sensor feeds many virtual sensors; although each user owns their own virtual image, the underlying physical sensor is shared, with middleware recalculating sampling duration/frequency as users join or leave.',
      'Many-to-one configuration: a geographical area is divided into regions each served by one or more physical sensors; when a user requests aggregated data for a region, the relevant WSNs activate and the user accesses the combined data.',
      'Many-to-many configuration combines the one-to-many and many-to-one patterns — a physical sensor can feed multiple virtual sensors while also contributing to an aggregate virtual sensor.',
      'Derived configuration combines multiple physical sensor types into one virtual sensor (unlike the other three, which combine sensors of the same type); it is used either to sense a complex phenomenon by combining several sensor readings, or to substitute for a sensor type that isn\u2019t physically deployed by interpolating from related sensor data.',
    ],
  },
  {
    heading: '13. Internet of Things (IoT) — Motivation, Definition & Architecture',
    items: [
      'IoT extends the current internet to connect and inter-network devices and physical objects ("Things"); a "thing" can be a person with a heart monitor implant, a farm animal with a biochip transponder, a car with tire-pressure sensors, or any object assigned an IP address and given the ability to transfer data over a network.',
      'IoT is enabled by giving objects/people unique identifiers and the ability to transfer data over a network without requiring human-to-human or human-to-computer interaction.',
      'More things are being connected across home/daily-life devices, business, public infrastructure, and healthcare, enabling any-time/any-place connectivity — both "people connecting to things" and "things connecting to things."',
      'A basic IoT platform has three building blocks: Things, Gateway, and Network & Cloud.',
      'Key aspects of IoT systems: scalability (in sensor/actuator counts, network scale, data volume/velocity, and processing power), heavy reliance on Big Data analytics for pattern extraction, real-time operation with continuous data flow, being highly distributed (spanning buildings to the globe, with processing split between cloud, gateways, and capable sensors), and being highly heterogeneous in devices, networks, and processing components — which is why an IoT gateway is used to give internet-scale access to low-power, locally-networked devices.',
      'Cloud computing plays a central role for IoT: it removes the infrastructure burden from companies/applications, offers pay-as-you-use and on-demand services, and lets clients offload data and applications for storage and processing without needing to understand the underlying infrastructure.',
    ],
  },
  {
    heading: '14. IoT Cloud Systems & Vehicular Data Cloud Case Study',
    items: [
      'Wide adoption of IoT infrastructures for logistics, smart cities, and healthcare has driven high demand for data storage/processing/management in cloud data centers, creating strong integration needs between IoT and cloud services — a cloud service can request an IoT service (bundling several IoT elements to reduce sensing-data volume), and an IoT management technique can in turn request cloud services to provision more resources for incoming data, so cloud services act as both computational/data-processing platforms and management platforms for IoT.',
      'iCOMOT is an example IoT Cloud system with three layers: a top layer of IoT applications running across IoT and clouds, a middle software layer built on cloud services and IoT elements, and a bottom layer of tools/services used to monitor, control, and configure the software layer.',
      'A motivating case study on vehicular data cloud services combines cloud computing and IoT to address growing transportation challenges, proposing a multilayered vehicular data cloud platform with two innovative services: an intelligent parking cloud service, and a vehicular data-mining cloud service for vehicle warranty analysis (using Na\u00efve Bayes and Logistic Regression models).',
      'The intelligent parking cloud service architecture uses sensors to detect parking-space vacancy and delivers this information through a cloud-based parking service to help drivers find spaces.',
      'IoT is described as a dynamic, fast-growing area of IT spanning domestic, commercial, industrial, health, and government contexts, but it faces key challenges around scale, speed, safety, security, and privacy — cloud computing platforms help by offering flexible, scalable storage and processing resources, making the IoT Cloud Platform an enabling paradigm for a variety of services.',
    ],
  },
  {
    heading: '15. Course Summary & Emerging Research Areas',
    items: [
      'The course covered: an introduction to cloud computing (the NIST model, properties/characteristics/disadvantages), cloud computing architecture (the cloud stack, XaaS service models, deployment models), service management (SLAs, cloud economics), and resource management in the cloud.',
      'It also covered data management in the cloud (data/scalability/cloud services, databases and data stores, GFS/HDFS/MapReduce), cloud security (identity and access management, access control, trust/reputation/risk, authentication), case studies on open-source and commercial clouds, and research trends such as fog computing, sensor cloud, container technology, and green cloud.',
      'Broader research areas in cloud computing span: Cloud Infrastructure and Services (architectures, storage/data architectures, distributed/cloud networking, IaaS/PaaS/SaaS, Storage/Network/Information-as-a-Service); Cloud Management, Operations and Monitoring (composition, orchestration, federation/bridging/bursting, migration, hybrid integration, green/energy management, capacity management, workload profiling, metering/monitoring/auditing); and Cloud Security (data privacy, access control, identity management, side-channel attacks, Security-as-a-Service).',
      'Further research areas include Performance, Scalability and Reliability (system/application performance, availability/reliability, microservices-based architecture), Systems Software and Hardware (virtualization, service composition, provisioning orchestration, hardware architecture support), Data Analytics in Cloud (analytics applications, scientific computing, big data management, storage/data/analytics clouds), Cloud Service Management (discovery/recommendation, composition, QoS, security/privacy, semantic services, service-oriented software engineering), and Cloud with Other Technologies (fog computing, IoT cloud, container technology).',
    ],
  },
];

const questions: Question[] = [
  { question: 'When was Docker\u2019s initial release?', options: ['March 2013', 'January 2010', 'June 2015', 'December 2008'], answer: 0 },
  { question: 'What are the three main features Docker aims to facilitate?', options: ['Develop, ship, and run anywhere', 'Compile, test, and archive', 'Design, market, and sell', 'Encrypt, store, and delete'], answer: 0 },
  { question: 'Docker has become especially prominent in which kind of development approach?', options: ['Waterfall-based projects', 'Agile-based projects', 'Purely manual deployment projects', 'Single-developer offline projects'], answer: 1 },
  { question: 'How does Docker reduce the size/footprint of development?', options: ['By providing a smaller OS footprint via containers', 'By deleting all source code', 'By requiring a full guest OS per app', 'By removing version control'], answer: 0 },
  { question: 'Which Docker component is used to build images and create containers?', options: ['Docker Hub', 'Docker Engine', 'Docker Compose', 'Docker for Windows'], answer: 1 },
  { question: 'Which Docker component is the registry used to host Docker images?', options: ['Docker Hub', 'Docker Engine', 'Docker for Mac', 'Docker for Linux'], answer: 0 },
  { question: 'Which Docker component is used to define applications made of multiple containers?', options: ['Docker Compose', 'Docker Engine', 'Docker Hub', 'Docker for Linux'], answer: 0 },
  { question: 'In Docker image terminology, which command downloads an image from a repository?', options: ['pull', 'push', 'commit', 'top'], answer: 0 },
  { question: 'Which Docker image command deletes a local image (and unused intermediate images)?', options: ['rmi', 'ps', 'stop', 'pause'], answer: 0 },
  { question: 'In Docker container terminology, which command lists all containers including stopped ones?', options: ['ps -a', 'images', 'tag', 'pull'], answer: 0 },
  { question: 'Which Docker container command creates a new image from an existing container?', options: ['commit', 'rmi', 'pull', 'tag'], answer: 0 },
  { question: 'What is a Dockerfile used for?', options: ['Automatically creating images using a build script', 'Running a virtual machine hypervisor', 'Storing user passwords', 'Compiling C++ code only'], answer: 0 },
  { question: 'Docker Hub can automatically build images based on:', options: ['Dockerfiles hosted on GitHub', 'Manually uploaded ZIP files only', 'Word documents', 'Spreadsheet macros'], answer: 0 },
  { question: 'In traditional virtualization, what role does the Hypervisor play?', options: ['Hosts virtual machines on top of the host OS (e.g. VMware, Hyper-V)', 'Hosts the physical server itself', 'Replaces the need for any operating system', 'Manages Docker containers only'], answer: 0 },
  { question: 'In Docker\u2019s architecture, what replaces the hypervisor and guest OS layers of traditional virtualization?', options: ['The Docker Engine, running apps as containers', 'A second physical server', 'A third-party antivirus tool', 'Nothing — Docker still needs guest OSes'], answer: 0 },
  { question: 'What is a container, as defined in the notes?', options: ['An abstraction at the app layer packaging code and dependencies together', 'A full virtual machine with its own OS', 'A physical server rack', 'A type of network switch'], answer: 0 },
  { question: 'Roughly how large are typical container images?', options: ['Tens of MBs', 'Hundreds of GBs', 'Several TBs', 'A few bytes'], answer: 0 },
  { question: 'What is the relationship between an image and a container?', options: ['A container is a runtime instance of an image', 'An image is a runtime instance of a container', 'They are unrelated concepts', 'An image can only exist inside a VM'], answer: 0 },
  { question: 'Why do containers have better performance than VMs according to the notes?', options: ['They run natively on the host kernel instead of through a hypervisor\u2019s virtual access', 'They use more memory than any other executable', 'They require a dedicated physical server each', 'They disable all host resources'], answer: 0 },
  { question: 'What makes VMs comparatively resource-intensive and hard to replicate?', options: ['Entanglement of OS settings, dependencies, and security patches in the disk image', 'Their small size', 'Lack of any OS layer', 'Their use of containers internally'], answer: 0 },
  { question: 'Why can a containerized app "run anywhere"?', options: ['Because it only needs its executable and dependencies, with no host-side installation required', 'Because containers always run on a single vendor\u2019s cloud', 'Because containers require no code at all', 'Because containers eliminate the need for dependencies entirely'], answer: 0 },
  { question: 'According to the notes, what problem do developers use Docker to eliminate?', options: ['"Works on my machine" problems when collaborating on code', 'Slow typing speed', 'Lack of internet access', 'Excessive use of spreadsheets'], answer: 0 },
  { question: 'How do Operators typically use Docker?', options: ['To run and manage apps side-by-side in isolated containers for better compute density', 'To manually reinstall the OS every day', 'To disable all container isolation', 'To avoid using the cloud entirely'], answer: 0 },
  { question: 'Enterprises use Docker to build agile software delivery pipelines to:', options: ['Ship new features faster, more securely, across Linux, Windows Server, and mainframe apps', 'Avoid ever updating software', 'Eliminate the need for testing', 'Increase hardware costs'], answer: 0 },
  { question: 'What is Green Computing, as defined in the notes?', options: ['The environmentally responsible and eco-friendly use of computers and their resources', 'A method for speeding up CPUs regardless of power draw', 'A type of cryptocurrency mining technique', 'A way to increase data center emissions intentionally'], answer: 0 },
  { question: 'What is the goal of Green Cloud Computing?', options: ['Efficient processing/utilization of infrastructure while minimizing energy consumption', 'Maximizing electricity usage regardless of efficiency', 'Eliminating cloud computing entirely', 'Increasing hardware manufacturing costs'], answer: 0 },
  { question: 'According to a 2007 Gartner report cited in the notes, what percentage of world CO2 emissions does the IT industry contribute?', options: ['About 2%', 'About 50%', 'About 90%', '0%'], answer: 0 },
  { question: 'According to a 2007 U.S. EPA report, roughly what share of U.S. power consumption was used by data centers?', options: ['1.5%', '25%', '75%', '0.01%'], answer: 0 },
  { question: 'Which of the following is listed as a Cloud advantage in the notes?', options: ['Reduced spending on technology infrastructure with pay-as-you-go pricing', 'Mandatory upfront hardware purchases', 'Reduced accessibility', 'Increased licensing costs for every user'], answer: 0 },
  { question: 'Roughly how much more energy per square foot do data centers consume compared to a typical office building?', options: ['10 to 100 times more', 'Exactly the same amount', 'Half as much', 'They consume no energy'], answer: 0 },
  { question: 'What share of data center operating expenses does energy currently account for, and where could it rise to?', options: ['10% currently, potentially rising to 50%', '100% currently, dropping to 0%', '1% currently, staying at 1%', '99% currently, dropping to 10%'], answer: 0 },
  { question: 'In a typical data center\u2019s energy consumption breakdown, which component uses the largest share?', options: ['Cooling system (~45%)', 'Power distribution (~15%)', 'Lighting (~30%)', 'Networking cables (~5%)'], answer: 0 },
  { question: 'What defines a "two-tier" data center architecture from the past?', options: ['Access and Core layers with 1GE/10GE links and a full mesh core', 'Ten layers of routers', 'No layers at all, just a single switch', 'Only wireless connections'], answer: 0 },
  { question: 'What defines the widely-used present-day "three-tier" data center architecture?', options: ['Access, Aggregation, and Core layers, scaling to over 10,000 servers', 'A single flat network with no hierarchy', 'Only two servers total', 'Exclusively wireless mesh networking'], answer: 0 },
  { question: 'What load-balancing approach and link speed characterize the three-tier high-speed DC architecture?', options: ['2-way ECMP load balancing with 100GE (IEEE 802.3ba) links', 'ICMP load balancing with 1GE links only', 'No load balancing at all', 'Manual load balancing by administrators'], answer: 0 },
  { question: 'According to the DC server energy model, roughly what percentage of peak-load power does an idle server consume?', options: ['About 66%', 'About 0%', 'About 100%', 'About 10%'], answer: 0 },
  { question: 'In the DC network switch energy model, which component consumes the largest share of energy?', options: ['Linecards (~53%)', 'Chassis (~36%)', 'Port transceivers (~11%)', 'Fans (~90%)'], answer: 0 },
  { question: 'How does the carbon emission from data centers worldwide compare to some countries, per the notes?', options: ['It is more than the emissions of both Argentina and the Netherlands', 'It is less than a single household', 'It is roughly zero', 'It is only relevant to one country'], answer: 0 },
  { question: 'What shift in focus do rising energy costs demand for data center resource management?', options: ['From optimizing purely for performance to optimizing for energy efficiency while maintaining service levels', 'From energy efficiency entirely back to raw performance only', 'From cloud computing to on-premise-only computing', 'From data centers to paper records'], answer: 0 },
  { question: 'According to the notes, roughly what share of Amazon\u2019s data-center budget is attributed to energy-related costs?', options: ['About 42%', 'About 2%', 'About 99%', 'About 0.5%'], answer: 0 },
  { question: 'Why have Google, Microsoft, and Yahoo built data centers near the Columbia River, USA?', options: ['To exploit cheap hydroelectric power', 'To be near a major airport', 'To avoid all regulation', 'To use only solar power'], answer: 0 },
  { question: 'In the Green Broker architecture, which layer analyzes user requirements?', options: ['The 1st layer', 'The 2nd layer', 'The 3rd layer', 'No layer does this'], answer: 0 },
  { question: 'In the Green Broker architecture, which layer performs carbon-aware scheduling?', options: ['The 3rd layer', 'The 1st layer', 'The 2nd layer', 'None of the layers'], answer: 0 },
  { question: 'What does PUE stand for in the context of green data centers?', options: ['Power Usage Effectiveness', 'Processor Unit Efficiency', 'Public Utility Expense', 'Peak Usage Estimate'], answer: 0 },
  { question: 'What is the motivation behind Sensor Cloud Computing?', options: ['Growing adoption of sensing technologies combined with the internet as a real-time information source', 'The elimination of all sensors', 'A total lack of internet access', 'The obsolescence of cloud computing'], answer: 0 },
  { question: 'What role do Wireless Sensor Networks (WSNs) play according to the notes?', options: ['They seamlessly couple the physical environment with the digital world', 'They replace the need for any cloud services', 'They are used only for weather forecasting', 'They eliminate the need for data processing'], answer: 0 },
  { question: 'Which of the following is a limitation of traditional sensor networks mentioned in the notes?', options: ['Difficulty scaling to large sizes and proprietary vendor-specific designs', 'Unlimited computational resources', 'Ease of sharing data across all users by default', 'Ability to change applications freely after deployment'], answer: 0 },
  { question: 'What does the "motivating scenario" example in the sensor cloud notes primarily illustrate?', options: ['How a cell phone alone cannot perform all needed real-time tasks without cloud/sensor integration', 'How to bake a cake using cloud computing', 'How satellites communicate with each other', 'How to reduce a phone\u2019s battery life'], answer: 0 },
  { question: 'What is Sensor Cloud Computing defined as in the notes?', options: ['An infrastructure using sensors as the interface between physical and cyber worlds, with the cloud as backbone', 'A social media platform', 'A programming language', 'A single physical sensor device'], answer: 0 },
  { question: 'What does the Sensor-Cloud Proxy manage?', options: ['Sensor network connectivity and exposing sensor resources as cloud services', 'Only billing for cloud services', 'Physical construction of data centers', 'Marketing campaigns for sensor vendors'], answer: 0 },
  { question: 'What is the role of the Sensor Network Proxy?', options: ['Providing cloud connectivity for sensors lacking a direct connection, enhancing scalability', 'Replacing the need for any sensors', 'Managing employee payroll', 'Disabling all sensor security'], answer: 0 },
  { question: 'What is a virtual sensor?', options: ['An emulation of a physical sensor that obtains data from underlying physical sensors', 'A physical device with no software component', 'A type of hard drive', 'A cloud billing mechanism'], answer: 0 },
  { question: 'In the one-to-many virtual sensor configuration, what happens as users join or leave?', options: ['Middleware re-evaluates the physical sensor\u2019s sampling duration and frequency', 'The physical sensor is destroyed', 'Nothing changes automatically', 'All users lose access permanently'], answer: 0 },
  { question: 'In the many-to-one virtual sensor configuration, what triggers WSNs in a region to switch on?', options: ['A user requesting aggregated data of a specific phenomenon from that region', 'A random timer with no user input', 'A hardware failure', 'A single sensor being physically moved'], answer: 0 },
  { question: 'What best describes the many-to-many virtual sensor configuration?', options: ['A combination of one-to-many and many-to-one patterns', 'A configuration with no physical sensors involved', 'A configuration limited to exactly one user', 'A configuration used only for billing purposes'], answer: 0 },
  { question: 'How does the derived virtual sensor configuration differ from the other three?', options: ['It combines multiple different sensor types rather than the same type', 'It uses no sensors at all', 'It can only be used by a single specific vendor', 'It removes the need for a physical sensor entirely'], answer: 0 },
  { question: 'What are the two main uses of derived virtual sensors, per the notes?', options: ['Sensing a complex phenomenon and substituting for undeployed sensor types', 'Charging batteries and cooling servers', 'Storing video files and encrypting them', 'Replacing all cloud storage'], answer: 0 },
  { question: 'What does IoT stand for?', options: ['Internet of Things', 'Internet of Transactions', 'Internal Object Tracking', 'Integration of Telecom'], answer: 0 },
  { question: 'According to the notes, what can be considered a "thing" in the Internet of Things?', options: ['A person with a heart monitor implant, a farm animal with a biochip, or a car with tire sensors', 'Only smartphones', 'Only laptops', 'Only desktop computers'], answer: 0 },
  { question: 'What ability must a "thing" have to participate in IoT, per the notes?', options: ['A unique identifier and the ability to transfer data over a network without human interaction', 'A physical keyboard', 'A dedicated human operator at all times', 'A paper manual'], answer: 0 },
  { question: 'What are the three basic building blocks of an IoT platform?', options: ['Things, Gateway, and Network & Cloud', 'Keyboard, Mouse, and Monitor', 'CPU, RAM, and Disk only', 'Router, Switch, and Modem only'], answer: 0 },
  { question: 'Which aspect of IoT systems refers to the ability to extract patterns from historical data to drive future decisions?', options: ['Big Data', 'Scalability', 'Real-time processing', 'Heterogeneity'], answer: 0 },
  { question: 'What role does cloud computing play for IoT systems, per the notes?', options: ['Offering scalable storage and flexible processing resources adaptable to new requirements', 'Eliminating the need for any data storage', 'Preventing all data analysis', 'Making IoT systems slower'], answer: 0 },
  { question: 'What does "highly distributed" mean for IoT systems?', options: ['They can span buildings to the entire globe, with processing split across cloud, gateway, and sensors', 'They must run on a single machine only', 'They cannot use any network', 'They are limited to one room'], answer: 0 },
  { question: 'Why is an IoT gateway needed, according to the notes?', options: ['To give internet-scale access to low-power devices using specialized local networks', 'To physically transport sensors', 'To replace the internet entirely', 'To eliminate the need for any network protocol'], answer: 0 },
  { question: 'What has driven the strong integration needs between IoT and cloud services?', options: ['High demand for data storage, processing, and management from widespread IoT deployment', 'A total lack of IoT devices', 'The complete absence of cloud data centers', 'Decreasing use of sensors worldwide'], answer: 0 },
  { question: 'In the IoT-cloud relationship described, what can a cloud service do regarding IoT?', options: ['Request an IoT service that bundles several IoT elements to reduce sensing data volume', 'Physically manufacture sensors', 'Delete all IoT data permanently by default', 'Replace the internet gateway'], answer: 0 },
  { question: 'What does the iCOMOT system\u2019s bottom layer provide?', options: ['Tools and services to monitor, control, and configure the software layer', 'The actual IoT applications used by end-users', 'Physical sensor hardware only', 'Marketing materials for IoT vendors'], answer: 0 },
  { question: 'In the vehicular data cloud case study, which two innovative services are presented?', options: ['An intelligent parking cloud service and a vehicular data-mining cloud service', 'A music streaming service and a video game service', 'A weather forecasting service and a stock trading service', 'A social media service and an email service'], answer: 0 },
  { question: 'Which models are used in the vehicular data-mining cloud service for warranty analysis?', options: ['Na\u00efve Bayes and Logistic Regression', 'Random Forest and K-Means only', 'Linear Regression only', 'No models are used'], answer: 0 },
  { question: 'What challenges does IoT face, according to the notes?', options: ['Scale, speed, safety, security, and privacy', 'Only cost', 'Only speed', 'None — IoT has no challenges'], answer: 0 },
  { question: 'Which of the following areas of the course did the summary explicitly cover?', options: ['Cloud Computing Architecture, Service Management, and Resource Management', 'Only cooking recipes', 'Only unrelated mathematics proofs', 'Only ancient history'], answer: 0 },
  { question: 'Which data management technologies were mentioned in the course summary?', options: ['GFS, HDFS, and the MapReduce paradigm', 'Microsoft Excel macros', 'Only paper filing systems', 'Only handwritten ledgers'], answer: 0 },
  { question: 'Which security topics were part of the course summary?', options: ['Identity & Access Management, Access Control, Trust/Reputation/Risk, Authentication', 'Only physical door locks', 'Only marketing security', 'None — security was not covered'], answer: 0 },
  { question: 'Which research trends were highlighted at the end of the course summary?', options: ['Fog Computing, Sensor Cloud, Container Technology, Green Cloud', 'Only word processing software', 'Only spreadsheet formulas', 'Only email clients'], answer: 0 },
  { question: 'Which of the following falls under "Cloud Infrastructure and Services" research areas?', options: ['IaaS, PaaS, SaaS and Storage/Network/Information-as-a-Service', 'Only human resources management', 'Only physical building architecture', 'Only paper-based recordkeeping'], answer: 0 },
  { question: 'Which of the following falls under "Cloud Management, Operations and Monitoring"?', options: ['Cloud Federation, Bridging, Bursting, and Migration', 'Only recipe management', 'Only sports scheduling', 'Only music production'], answer: 0 },
  { question: 'Which of the following is listed under "Cloud Security" research areas?', options: ['Side Channel Attacks and Security-as-a-Service', 'Only door alarms', 'Only fire safety', 'Only traffic management'], answer: 0 },
  { question: 'Which of the following falls under "Performance, Scalability, Reliability" research areas?', options: ['Microservices-based architecture and cloud availability/reliability', 'Only font rendering', 'Only color theory', 'Only keyboard shortcuts'], answer: 0 },
  { question: 'Which of the following falls under "Systems Software and Hardware" research areas?', options: ['Virtualization Technology and Hardware Architecture support for Cloud Computing', 'Only cooking utensils', 'Only gardening tools', 'Only bicycle repair'], answer: 0 },
  { question: 'Which of the following falls under "Data Analytics in Cloud" research areas?', options: ['Big data management and analytics, and scientific computing', 'Only handwriting analysis', 'Only weather folklore', 'Only board games'], answer: 0 },
  { question: 'Which of the following falls under "Cloud Computing – Service Management" research areas?', options: ['Services Discovery/Recommendation, Composition, and QoS Management', 'Only postal mail delivery', 'Only furniture assembly', 'Only textile manufacturing'], answer: 0 },
  { question: 'Which technologies are grouped under "Cloud and Other Technologies" in the course summary?', options: ['Fog Computing, IoT Cloud, and Container Technology', 'Only typewriters', 'Only rotary phones', 'Only vinyl records'], answer: 0 },
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

/* ---------------- Module 8 page ---------------- */

export default function Module8Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 08 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Docker, Green Cloud, Sensor Cloud, IoT Cloud &amp; Course Summary
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