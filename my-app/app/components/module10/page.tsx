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
    heading: '1. VM Migration — Basics & Motivation',
    items: [
      'VM Migration is the process of moving running applications or VMs from one physical server/host to another host; the processor state, storage, memory, and network connection are all moved from the source host to the destination host.',
      'Reasons to migrate VMs: to distribute VM load efficiently across servers in a cloud, and for system maintenance.',
      'VM Migration needs: load balancing (fair distribution of workload among computing resources); maintenance (VMs migrated transparently during server maintenance); managing operational parameters (consolidating VMs on fewer servers and putting under-utilized servers into low-power mode to reduce power consumption); handling QoS violations (a user can migrate to another service provider if desired QoS isn\u2019t met); and fault tolerance (VMs migrated from a failed data center to another where they can keep executing).',
    ],
  },
  {
    heading: '2. VM Migration — Types & Live Migration Requirements',
    items: [
      'Cold/Non-Live Migration: the VM executing on the source machine is turned off or suspended during the entire migration process.',
      'Hot/Live Migration: the VM executing on the source machine continues to provide service during migration; the target VM is not suspended during the process. Two main approaches: Pre-copy and Post-copy.',
      'In non-live migration the VM remains suspended for the whole migration, so downtime can be very high for large VMs; for real-time applications this degradation in service quality is often intolerable.',
      'VM Live Migration requirements: load balancing (simultaneous migration when load is unbalanced); fault tolerance (failures anticipated and proactively handled); power management (idle servers switched to sleep/off mode for energy saving); resource sharing (relocating VMs from over-loaded to under-loaded servers); and system maintenance (migrating VMs so services stay available while a physical system is upgraded/serviced).',
      'When to migrate: to remove a physical machine from service, or to relieve load on congested hosts.',
    ],
  },
  {
    heading: '3. Migration Concerns & What Gets Migrated',
    items: [
      'Key migration concerns: minimize downtime (total time services remain unavailable to users); minimize total migration time (time to move a VM from source to destination host); and ensure migration doesn\u2019t unnecessarily disrupt active services through resource contention (e.g. CPU, network bandwidth) with the migrating OS.',
      'What is migrated: the CPU context of the VM and contents of main memory; disk (may not be critical if using NAS accessible from both hosts, or a mirrored local disk); network (assuming both hosts are on the same LAN — migrate the IP address and advertise the new MAC-to-IP mapping via ARP reply, migrate the MAC address so switches learn the new location, and redirect network packets with possible transient losses); and I/O devices (virtual I/O devices are easier to migrate than direct-assigned physical devices).',
    ],
  },
  {
    heading: '4. Memory Migration Steps',
    items: [
      'Push: the source VM keeps running while pages are pushed across the network to the destination; pages modified during this process must be re-sent to ensure consistency.',
      'Stop-and-copy: the source VM is stopped, its pages are copied to the destination VM, and then the new VM is started.',
      'Pull: the new VM executes at the destination, and if it accesses a page not yet copied, that page is faulted in ("pulled") across the network from the source VM.',
      'Pure Stop-and-Copy is simple, but both downtime and total migration time are proportional to the VM\u2019s allocated physical memory, which may cause unacceptable outage for a live service.',
    ],
  },
  {
    heading: '5. Live Migration Phases — Pre-copy',
    items: [
      'Pre-Copy Phase: carried out over several rounds; the VM continues executing at the source while its memory is copied to the destination.',
      'Pre-copy Termination Phase: stopping criteria can be (i) the number of rounds exceeds a threshold, (ii) total memory transmitted exceeds a threshold, or (iii) the number of dirtied pages in the previous round drops below a threshold.',
      'Stop-and-Copy Phase: execution of the VM being migrated is suspended at the source, then the remaining dirty pages and CPU state are copied to the destination host, where VM execution resumes.',
      'Restarting Phase (iterative pre-copy live memory migration): the VM is restarted on the destination server after the stop-and-copy phase completes.',
      'KVM, Xen, and VMware hypervisors use the pre-copy technique for live VM migration; a drawback is that frequently-accessed ("hot") pages may be dirtied and resent multiple times, increasing migration time.',
    ],
  },
  {
    heading: '6. Live Migration Phases — Post-copy',
    items: [
      'Stop Phase: the source VM is stopped and its CPU state is copied to the destination VM.',
      'Restart Phase: the destination VM is restarted.',
      'On-demand Copy: VM memory is copied to the destination according to demand, rather than up front.',
      'In post-copy, when the VM restarts its memory is initially empty; if the VM tries to access a page not yet copied, that page must be brought over from the source VM on demand — but since most memory pages are not immediately needed, only in-demand pages need to be copied right away.',
      'Post-copy investigates approaches like demand paging, active push, and pre-paging to prefetch memory pages at the destination server; processor state is transferred before memory content, so the VM can start running at the destination sooner.',
    ],
  },
  {
    heading: '7. VM Migration — Analysis of Non-Live Migration',
    items: [
      'Let Tmig be the total migration time and Tdown be the total downtime.',
      'For non-live migration of a single VM: Tmig = Vm / R, where Vm is the memory size of the VM and R is the transmission rate (assumed fixed for the whole migration).',
      'In non-live migration, downtime equals migration time (Tdown = Tmig) because the VM\u2019s services are suspended for the entire migration process.',
    ],
  },
  {
    heading: '8. VM Migration — Analysis of Iterative Pre-copy',
    items: [
      'Key variables: n = total number of iterations in the pre-copy cycle; Vm = memory of the VM; Vth = threshold for stopping iterations; nmax = maximum number of iterations; r = (P\u00d7D)/R where P is page size, D is the dirtying rate, and R is the transmission rate; Tres = time to restart the VM at the destination.',
      'Since the VM\u2019s memory is migrated iteratively, the total migration time and downtime can be expressed in terms of r, n, Vm, and Tres, with each successive round transmitting roughly r times the data of the previous round (as dirty pages shrink round over round).',
      'Estimating the number of rounds (n): the volume of dirty data to transfer in round j is r^j \u00b7 Vm; iterations continue until r^j \u00b7 Vm falls below the threshold Vth, giving n = min(\u2308log_r(Vth/Vm)\u2309, nmax) — i.e. the process stops either when dirty data becomes small enough or when the maximum round count is reached.',
    ],
  },
  {
    heading: '9. Multiple VMs Migration — Serial Migration',
    items: [
      'When multiple VMs are migrated from a source host to a destination host, two typical strategies are used: serial migration and parallel migration.',
      'Serial migration of \u2018m\u2019 correlated VMs of the same type: the first selected VM executes its pre-copy cycle while the other (m\u22121) VMs continue providing service; once the first VM enters stop-and-copy, the remaining (m\u22121) VMs are suspended and copied right after — this stops those VMs from continuing to dirty memory.',
      'Assumption: each VM is copied at the full transmission rate (R). Downtime for serial migration includes the stop-and-copy phase of the first VM, the migration time for the remaining (m\u22121) VMs, and the time to resume the VMs at the destination.',
    ],
  },
  {
    heading: '10. Multiple VMs Migration — Parallel Migration',
    items: [
      'In parallel migration, all \u2018m\u2019 VMs start their pre-copy cycles simultaneously, with each VM sharing (R/m) of the total transmission capacity.',
      'Since VM sizes and transmission rates are equal, all VMs begin and end their stop-and-copy phase at the same time.',
      'Because the stop-and-copy phases run in parallel and take equal time, the overall downtime equals the time for one VM\u2019s stop-and-copy phase plus the time to resume the VMs at the destination — generally making parallel migration faster overall than serial migration for multiple VMs.',
    ],
  },
  {
    heading: '11. Containers — Introduction',
    items: [
      'Virtualization helps share resources among many customers in cloud computing; a container is a lightweight virtualization technique.',
      'A container packages code and all its dependencies so an application runs quickly and reliably from one computing environment to another.',
      'Docker is an open platform for developing, shipping, and running applications; Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.',
      'Containers virtualize the operating system and run anywhere — from a private data center to the public cloud, or even a developer\u2019s laptop — making it easy to share CPU, memory, storage, and network resources at the OS level while abstracting applications from their runtime environment.',
    ],
  },
  {
    heading: '12. Containers — Needs & Major Benefits',
    items: [
      'Containers offer a logical packaging mechanism that abstracts applications from the environment they run in, letting container-based apps deploy easily and consistently across a private data center, public cloud, or a developer\u2019s laptop.',
      'Benefits: agile development (developers move faster without worrying about dependencies/environments), efficient operations (lightweight, uses only the resources needed), and the ability to run virtually anywhere.',
      'Major benefits: separation of responsibility (developers focus on application logic/dependencies while IT operations focus on deployment/management); workload portability (runs on Linux, Windows, Mac, VMs, physical servers, on-premises, or the public cloud); and application isolation (CPU, memory, storage, and network are virtualized at the OS level, giving each app a logically isolated view of the OS).',
    ],
  },
  {
    heading: '13. Traditional vs. Virtualized vs. Container Deployments',
    items: [
      'Traditional deployment: applications run directly on physical servers with no way to define resource boundaries between applications, causing resource allocation issues.',
      'Virtualized deployment: multiple VMs run on a single physical server\u2019s CPU; virtualization isolates applications between VMs and improves resource utilization and scalability, but each VM is a full machine with its own OS running on virtualized hardware.',
      'Container deployment: containers are similar to VMs but relax isolation to share the OS among applications, making them lightweight; each container has its own filesystem and share of CPU/memory/process space, and because containers are decoupled from the underlying infrastructure, they are portable across clouds and OS distributions.',
    ],
  },
  {
    heading: '14. Containers vs. VMs',
    items: [
      'VMs: a guest OS (e.g. Linux or Windows) runs on top of a host OS with access to the underlying hardware, and each VM packages the application together with libraries and dependencies in an isolated environment.',
      'Containers offer a far more lightweight unit than VMs for developers and IT Ops to work with.',
      'Key distinctions: containers are much more lightweight than VMs; containers virtualize at the OS level while VMs virtualize at the hardware level; and containers share the OS kernel, using only a fraction of the memory that VMs require.',
      'A container is a sandboxed process isolated from all other processes on the host machine, and is a runnable instance of an image; containers can be created, started, stopped, moved, or deleted via an API (e.g. Docker API) or CLI, and can run on local machines, VMs, or be deployed to the cloud.',
    ],
  },
  {
    heading: '15. Kubernetes — Overview & Components',
    items: [
      'Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services, supporting both declarative configuration and automation, with a large and rapidly growing ecosystem.',
      'The name "Kubernetes" originates from Greek, meaning helmsman or pilot.',
      'Kubernetes operates at the container level rather than the hardware level, providing PaaS-like features such as deployment, scaling, and load balancing, while letting users integrate their own logging, monitoring, and alerting solutions; it is not monolithic, so these default solutions are optional and pluggable.',
      'A Kubernetes cluster consists of worker machines called nodes that run containerized applications (every cluster has at least one worker node); worker nodes host the Pods that make up the application workload, while the control plane manages the worker nodes and Pods in the cluster. In production, the control plane typically runs across multiple computers, and clusters usually run multiple nodes for fault tolerance and high availability.',
    ],
  },
  {
    heading: '16. Docker — Overview & Analogy',
    items: [
      'Docker is a platform that allows you to "build, ship, and run any app, anywhere," and is considered a standard way of solving the challenging problem of software deployment.',
      'Before Docker, development pipelines combined various technologies (VMs, configuration management tools, package management systems, complex dependency webs) that needed specialist engineers and had unique configuration approaches; Docker replaces this with a common pipeline to a single portable output.',
      'Docker analogy: traditionally a "docker" was a laborer who moved commercial goods into and out of ships at port, skillfully fitting differently-shaped items into ships; similarly, software teams spend significant time fitting "odd-shaped" software into different environments so it can be delivered to users.',
      'With Docker, configuration effort is separated from resource management and deployment becomes trivial — running an image pulls it down and it\u2019s ready to run, consuming fewer resources and staying contained so it doesn\u2019t interfere with other environments; as long as Docker is installed, the container runs regardless of whether the host is Red Hat, Ubuntu, or CentOS.',
    ],
  },
  {
    heading: '17. Docker — Advantages',
    items: [
      'Replacing VMs: Docker can replace VMs when you only care about the application, not the OS; it\u2019s quicker to spin up, more lightweight to move around, and its layered filesystem makes sharing changes with others easier.',
      'Prototyping software: gives a sandbox environment almost instantly without disrupting an existing setup or provisioning a VM.',
      'Packaging software: since a Docker image has effectively no external dependencies, it\u2019s a reliable way to package software to run on any modern Linux machine.',
      'Enabling microservices: facilitates decomposing a complex system into composable parts, making software easier to reason about, restructure, and manage.',
      'Other advantages: modeling networks (hundreds/thousands of isolated containers can be run efficiently on one machine); enabling full-stack productivity offline (bundling all system parts into containers to work on the move); reducing debugging overhead (clearly stating reproducible debugging steps); documenting software dependencies explicitly; and enabling continuous delivery (CD) through more reproducible and replicable builds.',
    ],
  },
  {
    heading: '18. Docker — Architecture',
    items: [
      'Docker on a host machine splits into two parts: a daemon with a RESTful API, and a client that talks to the daemon.',
      'The private Docker registry is a service that stores Docker images; it can be requested from any Docker daemon with relevant access, and since it sits on an internal network (not publicly accessible), it is considered private.',
      'The Docker client sends information requests/instructions to the daemon; the daemon is a server that receives requests and returns responses over the HTTP protocol, and it also makes requests to other services (using HTTP) to send and receive images.',
      'The daemon accepts requests from the command-line client or any other authorized connection, and is responsible for managing images and containers behind the scenes, while the client acts as the intermediary between the user and the RESTful API.',
    ],
  },
  {
    heading: '19. Docker Engine & Docker Images',
    items: [
      'Docker Engine runs Docker containers with three key properties: standard (Docker created the industry standard for containers so they\u2019re portable anywhere), lightweight (containers share the machine\u2019s OS kernel, avoiding a separate OS per application and improving server efficiency), and secure (Docker provides strong default isolation for applications running in containers).',
      'A Docker container image is a lightweight, standalone, executable package of software including everything needed to run an application: code, runtime, system tools, system libraries, and settings.',
      'Container images become containers at runtime — for Docker specifically, images become containers when run on the Docker Engine; images are available for both Linux and Windows-based applications and run the same regardless of the underlying infrastructure, ensuring consistency between environments like development and staging.',
    ],
  },
  {
    heading: '20. Docker Container Demo — MySQL & PHPMyAdmin',
    items: [
      'Demo objective: run MySQL and PHPMyAdmin on the Docker platform. MySQL is a widely used, open-source relational database package; PHPMyAdmin is a web-based graphical user interface that connects to a MySQL database and is widely used for managing MySQL databases.',
      'Standalone system (no container): requires separate installations of MySQL, a web server (Apache), PHP, and PHPMyAdmin; transferring the setup to another machine requires a fresh separate installation, backing up data from the old MySQL server, and restoring that backup on the new MySQL server.',
      'Using Docker containers avoids this manual, error-prone, multi-step process by packaging MySQL and PHPMyAdmin (with all dependencies) into portable container images that run consistently across machines.',
    ],
  },
];

const questions: Question[] = [
  { question: 'What is VM Migration?', options: ['Deleting a virtual machine permanently', 'The process of moving running applications or VMs from one physical host to another', 'Installing a new operating system on a VM', 'Compressing VM disk files'], answer: 1 },
  { question: 'During VM migration, which of the following are moved from source to destination host?', options: ['Only the VM name', 'Processor state, storage, memory, and network connection', 'Only the IP address', 'Only user credentials'], answer: 1 },
  { question: 'Which of the following is a reason to migrate VMs?', options: ['Distributing VM load efficiently across servers', 'System maintenance', 'Both of the above', 'None of the above'], answer: 2 },
  { question: 'Which VM migration need involves consolidating VMs to reduce power consumption?', options: ['Managing operational parameters', 'Fault tolerance', 'QoS violation', 'Load balancing'], answer: 0 },
  { question: 'What happens during Cold (Non-Live) Migration?', options: ['The VM continues running throughout migration', 'The VM is turned off or suspended during migration', 'Only the network is migrated', 'The VM is duplicated without stopping'], answer: 1 },
  { question: 'What happens during Hot (Live) Migration?', options: ['The VM continues to provide service during migration', 'The VM must always be shut down first', 'Only the CPU is migrated', 'It is only used for backup purposes'], answer: 0 },
  { question: 'What are the two main approaches to live VM migration?', options: ['Pre-copy and Post-copy', 'Fast-copy and Slow-copy', 'Push and Delete', 'Serial and Random'], answer: 0 },
  { question: 'In non-live migration, why can downtime be very high for large VMs?', options: ['Because the VM remains suspended for the entire migration process', 'Because the network is disconnected permanently', 'Because live migration is always used instead', 'Because the destination host is always slower'], answer: 0 },
  { question: 'Which VM live migration requirement addresses switching idle servers to sleep or off mode?', options: ['Power management', 'Fault tolerance', 'Resource sharing', 'System maintenance'], answer: 0 },
  { question: 'Which live migration requirement is about relocating VMs from over-loaded to under-loaded servers?', options: ['Resource sharing', 'Power management', 'Load balancing only', 'None of the above'], answer: 0 },
  { question: 'Which of the following is a valid reason for migrating a VM according to "When to Migrate"?', options: ['To remove a physical machine from service', 'To relieve load on congested hosts', 'Both of the above', 'Neither of the above'], answer: 2 },
  { question: 'What does "downtime" refer to in VM migration?', options: ['The total amount of time services remain unavailable to users', 'The time to install a new OS', 'The time to format a disk', 'The time between two software updates'], answer: 0 },
  { question: 'What does "total migration time" refer to?', options: ['The total time taken to move a VM from source to destination host', 'The lifetime of the VM', 'The time to reboot a physical server', 'The time to patch security vulnerabilities'], answer: 0 },
  { question: 'A key migration concern is that migration should not:', options: ['Unnecessarily disrupt active services through resource contention', 'Use any network bandwidth at all', 'Ever be automated', 'Occur more than once'], answer: 0 },
  { question: 'What is migrated regarding the network, assuming both hosts are on the same LAN?', options: ['The IP address and MAC address mapping via ARP reply', 'Nothing needs to be migrated', 'Only the hostname', 'Only the DNS server'], answer: 0 },
  { question: 'Regarding I/O devices during migration, which is generally easier to migrate?', options: ['Virtual I/O devices', 'Directly assigned physical devices', 'Neither can be migrated', 'Both are equally difficult'], answer: 0 },
  { question: 'In the "Push" memory migration step, what happens to pages modified during the process?', options: ['They are discarded', 'They must be re-sent to ensure consistency', 'They are ignored permanently', 'They cause the migration to fail'], answer: 1 },
  { question: 'In the "Stop-and-copy" memory migration step, what happens?', options: ['The source VM is stopped, pages copied, then the new VM started', 'The VM keeps running indefinitely', 'Only network state is copied', 'The VM is duplicated without any downtime'], answer: 0 },
  { question: 'In the "Pull" memory migration step, what happens when the new VM accesses a page not yet copied?', options: ['The page is faulted in ("pulled") across the network from the source VM', 'The migration immediately fails', 'The VM crashes', 'The page is deleted'], answer: 0 },
  { question: 'What is a drawback of Pure Stop-and-Copy migration?', options: ['Downtime and migration time are proportional to the VM\u2019s allocated physical memory', 'It requires no network at all', 'It only works for very small VMs', 'It cannot be used with any hypervisor'], answer: 0 },
  { question: 'In the Pre-Copy Phase of live migration, what happens?', options: ['The VM continues executing at the source while memory is copied to the destination', 'The VM is immediately shut down', 'Only the destination VM executes', 'No data is transferred yet'], answer: 0 },
  { question: 'Which of the following is a stopping criterion for the Pre-copy Termination Phase?', options: ['The number of rounds exceeds a threshold', 'The total memory transmitted exceeds a threshold', 'The number of dirtied pages in the previous round drops below a threshold', 'All of the above'], answer: 3 },
  { question: 'In the Stop-and-Copy Phase, what is copied to the destination host?', options: ['Remaining dirty pages and CPU state', 'Only the hostname', 'Only application logs', 'Nothing, execution just resumes'], answer: 0 },
  { question: 'Which hypervisors are mentioned as using the pre-copy technique for live VM migration?', options: ['KVM, Xen, and VMware', 'Only VirtualBox', 'Only Hyper-V', 'Only QEMU'], answer: 0 },
  { question: 'In the Post-copy Live Memory Migration approach, what is transferred first?', options: ['Processor state, before memory content', 'All memory content, before processor state', 'Only network configuration', 'Only disk data'], answer: 0 },
  { question: 'In post-copy migration, what happens if the VM tries to access a memory page not yet copied?', options: ['The page needs to be brought over from the source VM on demand', 'The VM automatically shuts down', 'The migration restarts from scratch', 'The page is permanently lost'], answer: 0 },
  { question: 'Which approaches does post-copy VM migration investigate for prefetching memory pages?', options: ['Demand paging, active push, and pre-paging', 'Only stop-and-copy', 'Only serial migration', 'Only cold migration'], answer: 0 },
  { question: 'For non-live migration, how is total migration time Tmig calculated?', options: ['Tmig = Vm / R (VM memory size divided by transmission rate)', 'Tmig = Vm x R', 'Tmig = R / Vm', 'Tmig is always zero'], answer: 0 },
  { question: 'In non-live migration, how does downtime (Tdown) relate to migration time (Tmig)?', options: ['Tdown = Tmig, since services are suspended for the whole process', 'Tdown is always zero', 'Tdown is always greater than Tmig', 'They are unrelated'], answer: 0 },
  { question: 'In the pre-copy analysis, what does "r" represent?', options: ['(P x D) / R — page size times dirtying rate, divided by transmission rate', 'The number of physical hosts', 'The total number of VMs', 'The IP address range'], answer: 0 },
  { question: 'In the pre-copy analysis, what does Vth represent?', options: ['The threshold for stopping the iterations', 'The virtual thread count', 'The total VM size', 'The transmission rate'], answer: 0 },
  { question: 'How is the number of rounds "n" estimated in iterative pre-copy migration?', options: ['n = min(ceil(log_r(Vth/Vm)), nmax)', 'n is always fixed at 10', 'n = Vm x R', 'n is unrelated to the dirtying rate'], answer: 0 },
  { question: 'When multiple VMs need to be migrated, what are the two typical strategies mentioned?', options: ['Serial migration and Parallel migration', 'Cold migration and Hot migration only', 'Push and Pull only', 'Manual and Automatic migration'], answer: 0 },
  { question: 'In Serial Migration of \u2018m\u2019 correlated VMs, what happens to the remaining (m-1) VMs once the first VM enters stop-and-copy?', options: ['They are suspended and copied right after the first VM completes stop-and-copy', 'They are deleted', 'They continue running indefinitely without ever being migrated', 'They are migrated before the first VM'], answer: 0 },
  { question: 'Why are the remaining VMs suspended during serial migration?', options: ['To stop those VMs from further dirtying memory', 'To save disk space', 'To reduce the number of IP addresses used', 'To increase CPU temperature'], answer: 0 },
  { question: 'In Parallel Migration, how do the \u2018m\u2019 VMs begin their pre-copy cycles?', options: ['All VMs start their pre-copy cycles simultaneously', 'One at a time in sequence', 'Only after all other VMs are shut down', 'Randomly at different times with no coordination'], answer: 0 },
  { question: 'In parallel migration, what share of transmission capacity does each VM get?', options: ['R/m (total transmission rate divided by number of VMs)', 'The full rate R for every VM simultaneously without division', 'Zero, since only one VM transmits at a time', 'A random, unspecified share'], answer: 0 },
  { question: 'In parallel migration, since VM sizes and rates are equal, what happens with stop-and-copy phases?', options: ['All VMs begin and end their stop-and-copy phase at the same time', 'Each VM stops at a completely different, unpredictable time', 'Only the first VM ever reaches stop-and-copy', 'Stop-and-copy never occurs in parallel migration'], answer: 0 },
  { question: 'What is a container, as described in the notes?', options: ['A lightweight virtualization technique that packages code and its dependencies', 'A type of physical server rack', 'A backup tape device', 'A type of network cable'], answer: 0 },
  { question: 'What is Docker, as introduced in the container notes?', options: ['An open platform for developing, shipping, and running applications', 'A programming language', 'A type of database', 'A hardware component'], answer: 0 },
  { question: 'What is Kubernetes, as introduced in the container notes?', options: ['An open-source system for automating deployment, scaling, and management of containerized applications', 'A relational database management system', 'A web browser', 'A type of virtual machine hypervisor only'], answer: 0 },
  { question: 'Containers virtualize resources at which level?', options: ['The operating system level', 'The hardware level only', 'The network cable level', 'The power supply level'], answer: 0 },
  { question: 'Which of the following is a benefit of containers described as "agile development"?', options: ['Developers move more quickly by avoiding dependency/environment concerns', 'Containers require manual dependency installation every time', 'Containers cannot run on laptops', 'Containers always require a full OS reinstall'], answer: 0 },
  { question: 'Which benefit refers to containers being lightweight and using only necessary resources?', options: ['Efficient operations', 'Fault tolerance', 'Load balancing', 'Serial migration'], answer: 0 },
  { question: 'What is meant by "separation of responsibility" in container benefits?', options: ['Developers focus on application logic while IT Ops focus on deployment/management', 'Only one team is ever responsible for everything', 'Responsibility is randomly assigned', 'There is no separation of duties in containers'], answer: 0 },
  { question: 'What does "workload portability" mean for containers?', options: ['Containers run virtually anywhere: Linux, Windows, Mac, VMs, physical servers, or the cloud', 'Containers can only run on one specific OS', 'Containers cannot move between environments', 'Portability only applies to VMs, not containers'], answer: 0 },
  { question: 'What does "application isolation" mean for containers?', options: ['CPU, memory, storage, and network are virtualized at the OS level for a logically isolated view', 'Applications share the exact same memory space with no isolation', 'Isolation only happens at the hardware level', 'Containers cannot isolate applications at all'], answer: 0 },
  { question: 'In Traditional deployment (no virtualization), what was a major issue?', options: ['No way to define resource boundaries for applications on a physical server', 'Too much isolation between applications', 'Excessive container use', 'Overuse of Kubernetes'], answer: 0 },
  { question: 'In Virtualized deployment, what does each VM include?', options: ['A full machine with its own operating system running on virtualized hardware', 'Only a lightweight shared kernel', 'No operating system at all', 'Just a single shared process space with other VMs'], answer: 0 },
  { question: 'In Container deployment, what do containers share among applications?', options: ['The Operating System (OS)', 'Only the storage disk', 'Nothing is shared', 'Physical CPU cores exclusively without any host OS'], answer: 0 },
  { question: 'Why are containers considered portable across clouds and OS distributions?', options: ['Because they are decoupled from the underlying infrastructure', 'Because they are tightly coupled to specific hardware', 'Because they require a specific cloud provider', 'Because they include a full guest OS'], answer: 0 },
  { question: 'How do VMs virtualize resources compared to containers?', options: ['VMs virtualize at the hardware level, while containers virtualize at the OS level', 'VMs and containers virtualize at exactly the same level', 'VMs virtualize at the OS level and containers at the hardware level', 'Neither virtualizes any resources'], answer: 0 },
  { question: 'Which uses less memory: containers or VMs, according to the notes?', options: ['Containers, since they share the OS kernel', 'VMs, since they share the OS kernel', 'They use identical amounts of memory always', 'Neither uses any memory'], answer: 0 },
  { question: 'What is a container described as, in terms of processes?', options: ['A sandboxed process isolated from all other processes on the host machine', 'An unsandboxed process with full host access', 'A hardware peripheral', 'A type of network switch'], answer: 0 },
  { question: 'A container is a runnable instance of what?', options: ['An image', 'A hypervisor', 'A physical server', 'A router'], answer: 0 },
  { question: 'How can containers be managed according to the notes?', options: ['Create, start, stop, move, or delete via an API (e.g. Docker API) or CLI', 'Only through physical hardware switches', 'Only via postal mail requests', 'They cannot be managed once created'], answer: 0 },
  { question: 'Where can a container be run, according to the notes?', options: ['Local machines, virtual machines, or deployed to the cloud', 'Only on a single dedicated mainframe', 'Only on smartphones', 'Only on printers'], answer: 0 },
  { question: 'What does the name "Kubernetes" originate from and mean?', options: ['Greek, meaning helmsman or pilot', 'Latin, meaning container', 'Japanese, meaning cloud', 'German, meaning server'], answer: 0 },
  { question: 'At what level does Kubernetes operate?', options: ['The container level, rather than the hardware level', 'Only the hardware level', 'Only the network cable level', 'The power grid level'], answer: 0 },
  { question: 'Which features does Kubernetes provide, similar to PaaS offerings?', options: ['Deployment, scaling, and load balancing', 'Only physical server manufacturing', 'Only email hosting', 'Only DNS resolution'], answer: 0 },
  { question: 'Is Kubernetes described as monolithic?', options: ['No, its default solutions are optional and pluggable', 'Yes, it is entirely monolithic with no flexibility', 'It has no components at all', 'It only works with one vendor'], answer: 0 },
  { question: 'What is a Kubernetes cluster made up of?', options: ['A set of worker machines (nodes) that run containerized applications', 'A single physical machine only', 'Only cloud storage buckets', 'Only a set of routers'], answer: 0 },
  { question: 'What do worker nodes host in a Kubernetes cluster?', options: ['Pods, which are the components of the application workload', 'Only the control plane', 'Only backup files', 'Only DNS records'], answer: 0 },
  { question: 'What does the control plane do in a Kubernetes cluster?', options: ['Manages the worker nodes and Pods in the cluster', 'Only stores static webpages', 'Physically powers the servers', 'Prints reports'], answer: 0 },
  { question: 'Why does the control plane usually run across multiple computers in production?', options: ['To provide fault tolerance and high availability', 'To increase electricity costs', 'To make the system slower on purpose', 'To reduce the number of nodes needed'], answer: 0 },
  { question: 'What does Docker allow you to do, according to its overview?', options: ['Build, ship, and run any app, anywhere', 'Only browse the internet', 'Only edit text documents', 'Only send emails'], answer: 0 },
  { question: 'What challenge is Docker considered a standard solution for?', options: ['Software deployment', 'Physical hardware manufacturing', 'Network cable installation', 'Electricity billing'], answer: 0 },
  { question: 'Before Docker, what did development pipelines typically involve?', options: ['Combinations of VMs, configuration management tools, package systems, and dependency webs', 'A single unified tool with no configuration needed', 'No tools at all', 'Only manual paperwork'], answer: 0 },
  { question: 'In the Docker analogy, who was a traditional "docker"?', options: ['A laborer who moved commercial goods into and out of ships at ports', 'A software engineer', 'A ship captain', 'A customs officer'], answer: 0 },
  { question: 'What does the Docker analogy compare to fitting goods into ships?', options: ['Fitting "odd-shaped" software into different environments for delivery', 'Physically loading hardware onto trucks', 'Writing shipping invoices', 'Painting ship hulls'], answer: 0 },
  { question: 'With Docker, what is separated from resource management?', options: ['Configuration effort', 'Physical hardware installation', 'Electricity supply', 'Employee scheduling'], answer: 0 },
  { question: 'According to the notes, what is required for a Docker container to run regardless of the host OS (Red Hat, Ubuntu, CentOS)?', options: ['Docker must be installed on the host', 'A specific proprietary OS must be used', 'A physical server rebuild is needed', 'Nothing is required, it never works cross-OS'], answer: 0 },
  { question: 'Docker can replace VMs in which scenario?', options: ['When you only care about the application, not the operating system', 'When you need a completely separate guest OS for every app', 'Never, Docker cannot replace VMs', 'Only for gaming applications'], answer: 0 },
  { question: 'How does Docker compare to VMs in terms of startup speed and portability?', options: ['Quicker to spin up and more lightweight to move around', 'Slower to spin up and heavier to move', 'Identical in every way', 'Docker cannot be moved at all'], answer: 0 },
  { question: 'What Docker feature helps quickly and easily share changes with others?', options: ['Its layered filesystem', 'Its physical hard drive', 'Its power supply unit', 'Its keyboard shortcuts'], answer: 0 },
  { question: 'How does Docker help with prototyping software?', options: ['Provides a sandbox environment almost instantly without disrupting the existing setup', 'Requires provisioning a brand-new physical server every time', 'Prevents any experimentation', 'Only works after a full VM install'], answer: 0 },
  { question: 'Why is Docker considered good for packaging software?', options: ['A Docker image has effectively no external dependencies and runs on any modern Linux machine', 'Docker images require a specific JVM installed separately', 'Docker cannot package any software', 'Packaging always requires manual compilation on each machine'], answer: 0 },
  { question: 'How does Docker enable a microservices architecture?', options: ['By facilitating decomposition of a complex system into composable parts', 'By forcing all code into a single monolithic container', 'By removing the need for any services', 'By disabling communication between services'], answer: 0 },
  { question: 'How does Docker help with modeling networks?', options: ['Hundreds or thousands of isolated containers can be run efficiently on one machine', 'Only one container can ever run per machine', 'Docker cannot be used for networking scenarios', 'It requires a dedicated physical network switch per container'], answer: 0 },
  { question: 'How does Docker enable full-stack productivity when offline?', options: ['All parts of the system can be bundled into containers and orchestrated to run on a laptop', 'Docker requires a constant internet connection to function at all', 'Offline work is impossible with Docker', 'Only cloud-hosted containers can run'], answer: 0 },
  { question: 'How does Docker help reduce debugging overhead?', options: ['By allowing debugging steps to be stated clearly (even in script form) for reproducible environments', 'By hiding all error logs from developers', 'By preventing any debugging entirely', 'By requiring manual re-installation for every bug'], answer: 0 },
  { question: 'How does building Docker images help document software dependencies?', options: ['Building images in a structured way forces explicit documentation of dependencies from a base starting point', 'Docker images cannot contain any dependency information', 'Dependencies are always hidden and undocumented', 'Documentation is unrelated to image building'], answer: 0 },
  { question: 'How does Docker support Continuous Delivery (CD)?', options: ['Docker builds are more reproducible and replicable than traditional building methods', 'Docker makes CD impossible', 'CD requires manual deployment with no automation in Docker', 'Docker builds are always inconsistent'], answer: 0 },
  { question: 'What are the two parts Docker splits into on a host machine?', options: ['A daemon with a RESTful API, and a client that talks to the daemon', 'A monitor and a keyboard', 'A router and a switch', 'A compiler and a linker'], answer: 0 },
  { question: 'What does the private Docker registry do?', options: ['Stores Docker images, accessible by daemons with relevant access on an internal network', 'Publicly broadcasts images to any user on the internet', 'Deletes images automatically after use', 'Hosts only video files'], answer: 0 },
  { question: 'Why is the private Docker registry considered "private"?', options: ['It sits on an internal network and isn\u2019t publicly accessible', 'It requires a public IP address for all users', 'It is hosted only on social media platforms', 'It has no access restrictions whatsoever'], answer: 0 },
  { question: 'What protocol does the Docker client use to communicate with the daemon?', options: ['HTTP', 'FTP only', 'SMTP', 'Bluetooth'], answer: 0 },
  { question: 'What is the Docker daemon responsible for?', options: ['Managing images and containers behind the scenes', 'Only displaying the user interface', 'Sending emails', 'Formatting hard drives'], answer: 0 },
  { question: 'What role does the Docker client play?', options: ['Acts as the intermediary between the user and the RESTful API', 'Directly manages hardware without any API', 'Replaces the need for a daemon entirely', 'Only stores images locally with no communication'], answer: 0 },
  { question: 'Which property of Docker Engine means containers are portable anywhere?', options: ['Standard', 'Fragile', 'Proprietary', 'Immutable only on one OS'], answer: 0 },
  { question: 'Which property of Docker Engine means containers share the machine\u2019s OS kernel and avoid needing an OS per application?', options: ['Lightweight', 'Heavyweight', 'Isolated only at hardware level', 'Encrypted'], answer: 0 },
  { question: 'Which property of Docker Engine refers to strong default isolation capabilities?', options: ['Secure', 'Insecure', 'Public', 'Unmanaged'], answer: 0 },
  { question: 'What does a Docker container image include?', options: ['Code, runtime, system tools, system libraries, and settings', 'Only the application\u2019s source code with nothing else', 'Only a blank operating system', 'Only network configuration files'], answer: 0 },
  { question: 'When do container images become containers, in the case of Docker?', options: ['When they run on Docker Engine', 'When they are compiled into a PDF', 'When they are converted to a spreadsheet', 'They never become containers'], answer: 0 },
  { question: 'What is a key benefit of Docker images being available for both Linux and Windows?', options: ['Containerized software runs the same regardless of the underlying infrastructure', 'Software behaves completely differently on each platform', 'Only Linux containers are ever functional', 'Windows containers cannot use Docker Engine at all'], answer: 0 },
  { question: 'In the Docker demo, what two applications are run together?', options: ['MySQL and PHPMyAdmin', 'Apache and Nginx only', 'Kubernetes and Docker Swarm', 'Windows and Linux kernels'], answer: 0 },
  { question: 'What is MySQL, as described in the demo notes?', options: ['A widely used, open-source relational database package', 'A web browser', 'A programming language', 'An operating system'], answer: 0 },
  { question: 'What is PHPMyAdmin, as described in the demo notes?', options: ['A web-based graphical user interface for managing MySQL databases', 'A hardware device for cooling servers', 'A network router', 'A type of virtual machine hypervisor'], answer: 0 },
  { question: 'In a standalone system (no container), what must be separately installed?', options: ['MySQL, Web Server (Apache), PHP, and PHPMyAdmin', 'Only a single unified package', 'Nothing needs installation', 'Only the operating system'], answer: 0 },
  { question: 'When transferring a standalone (non-containerized) setup to another machine, what steps are needed?', options: ['Separate installation, backup of data from the old MySQL server, and restoring the backup to the new server', 'No steps are needed, it transfers automatically', 'Only copying a single config file', 'Formatting the destination machine first'], answer: 0 },
  { question: 'How do Docker containers simplify the MySQL/PHPMyAdmin demo scenario compared to standalone installation?', options: ['By packaging the applications with all dependencies into portable images that run consistently across machines', 'By requiring even more manual installation steps than standalone setups', 'By eliminating the need for MySQL entirely', 'By making the setup incompatible with any other machine'], answer: 0 },
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

/* ---------------- Module 10 page ---------------- */

export default function Module10Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 10 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud Computing Paradigm: VM Migration, Containers &amp; Docker
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