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
    heading: '1. Basic Security Components (CIA Triad)',
    items: [
      'Confidentiality: keeping data and resources hidden.',
      'Integrity: data integrity and origin integrity (authentication).',
      'Availability: enabling access to data and resources.',
    ],
  },
  {
    heading: '2. Types of Security Attacks',
    items: [
      'Interruption (attack on availability): disrupts normal service/access.',
      'Interception (attack on confidentiality): unauthorized access to data.',
      'Modification (attack on integrity): altering legitimate messages or data.',
      'Fabrication (attack on authenticity): creating false data or pretending to be someone else.',
    ],
  },
  {
    heading: '3. Classes of Threats',
    items: [
      'Disclosure: snooping.',
      'Deception: modification, spoofing, repudiation of origin, denial of receipt.',
      'Disruption: modification.',
      'Usurpation: modification, spoofing, delay, denial of service.',
    ],
  },
  {
    heading: '4. Security Policy, Mechanisms & Goals',
    items: [
      'Policy defines what is and isn\u2019t allowed; mechanisms enforce policies; if policies conflict (composition), vulnerabilities may arise.',
      'Security goals: prevention (stop attackers from violating policy), detection (identify violations), recovery (stop attack, assess damage, resume correct functioning).',
      'Trust and assumptions: policies must unambiguously partition states, and mechanisms are assumed to enforce policy correctly.',
      'Development lifecycle: specification (requirements analysis, desired functionality), design (how the system meets the specification), implementation (programs/systems carrying out the design).',
      'Cost-benefit and risk analysis asks whether it is cheaper to prevent or to recover, and how much protection something warrants.',
    ],
  },
  {
    heading: '5. Passive vs. Active Attacks',
    items: [
      'Passive attacks are difficult to detect: release of message contents (preventing others from learning transmission contents) and traffic analysis (determining location, identity, frequency, and length of messages).',
      'Active attacks include masquerade (pretending to be a different entity), replay (retransmitting captured data), modification (altering a legitimate message), and denial of service (preventing normal use of facilities).',
    ],
  },
  {
    heading: '6. Security Services',
    items: [
      'Confidentiality (privacy protection), authentication (who created/sent the data), integrity (data has not been altered), non-repudiation (the order/transaction is final), access control (prevents misuse), and availability (permanence, non-erasure).',
    ],
  },
  {
    heading: '7. Network Security Steps',
    items: [
      'Step 1 \u2013 Determine security policy: usage policy for networks/servers, user training (password strength, social engineering), privacy policy, update/audit schedule; network design (firewall placement, DMZs, IDS deployment) should reflect the policy.',
      'Step 2 \u2013 Implement security policy: firewalls (e.g. iptables on Linux, rules for incoming/outgoing packets) and IDS (e.g. Snort, which sends alerts to log files or via paging/email/telephone for serious events).',
      'Firewall types: packet filter (filters by destination IP, port, protocol), stateful (records TCP sessions and discards out-of-session packets), application proxy (acts as a proxy and scans all layers); IDS scans incoming messages and alerts on suspected scans/attacks; a honeypot/honeynet simulates a decoy host/network with services.',
      'Step 3 \u2013 Reconnaissance: learning the network\u2019s IP addresses, key servers, services, and vulnerabilities; passive reconnaissance is undetectable while active reconnaissance is often detectable by IDS.',
      'Step 4 \u2013 Vulnerability scanning: targeting services for attack, e.g. Nessus (detects vulnerabilities, produces risk reports) and Metasploit (exploits vulnerabilities, allows payload selection); scanners should be updateable (e.g. via NASL).',
      'Step 5 \u2013 Penetration testing: exploiting vulnerabilities to gain access, which may require finding new vulnerabilities.',
      'Step 6 \u2013 Post-attack investigation: forensics guided by law, normally performed by a third party, retaining a chain of evidence and examining a low-level copy without modifying the original.',
    ],
  },
  {
    heading: '8. Cloud Computing Overview & Economics',
    items: [
      'Cloud computing is a new paradigm of data/computation outsourcing, characterized by infinite scalability, on-demand provisioning, and pay-as-you-go pricing.',
      'Consumer advantages: no upfront commitment, ability to scale usage, minimized start-up costs, reduced CAPEX. Provider advantage: increased datacenter utilization.',
    ],
  },
  {
    heading: '9. Cloud Security Challenges (IDC Survey) & Why Cloud Brings New Threats',
    items: [
      'Top IDC survey concerns, in order: security, availability, performance, on-demand payment model, lack of standards, too many providers, and difficulty integrating with in-house IT.',
      'Traditional security focuses on keeping attackers out, but cloud co-tenancy means multiple users share the same physical infrastructure, so an attacker can legitimately be on the same machine as the target; customers also lack control over their own data/applications and face reputation fate-sharing.',
      'Security stack layers: IaaS (customer manages system administration up from the hardware), PaaS (provider handles the platform/infrastructure below the application/middleware/database), SaaS (a self-contained environment covering content, presentation, applications, and management).',
    ],
  },
  {
    heading: '10. Gartner\u2019s Seven Cloud Computing Security Risks',
    items: [
      'Privileged User Access: sensitive data is processed outside the enterprise, bypassing physical, logical, and personnel controls, so customers need information about who manages the data.',
      'Regulatory Compliance & Audit: traditional providers submit to external audits/certifications, but a provider refusing scrutiny signals it should only be used for trivial functions; shared infrastructure makes isolation and customer-side auditing difficult, and forensics is harder since data isn\u2019t local.',
      'Data Location: data centers are geographically dispersed across jurisdictions with different regulations and cross-border data flow laws, raising the question of who is responsible for compliance (e.g. SOX, HIPAA).',
      'Data Segregation: data sits in a shared environment alongside other customers\u2019 data; encryption helps but isn\u2019t a cure-all since data must be decrypted during processing, making key-store protection critical.',
      'Recovery: data must be replicated across multiple sites; key concepts are RPO (Recovery Point Objective \u2013 maximum tolerable data loss) and RTO (Recovery Time Objective \u2013 time allowed for recovery), requiring backup frequency, fault tolerance, replication, and redundancy.',
      'Investigative Support: investigation is difficult in the cloud since logs for multiple co-located customers are mixed; the best solution is neutral third-party monitoring.',
      'Long-term Viability: concerns how to get data back and in what format if switching providers becomes necessary (price increase, bankruptcy, service shutdown, quality decline, disputes) \u2014 the core problem is vendor lock-in.',
    ],
  },
  {
    heading: '11. Virtualization Security',
    items: [
      'A VM (Virtual Machine) runs on a hypervisor (VMM \u2013 Virtual Machine Manager), which manages VMs; virtualization types are full virtualization and para-virtualization.',
      'Hypervisor vulnerabilities include shared clipboard (can transfer malicious programs), keystroke logging, virtual machine backdoors (covert channels), and ARP poisoning.',
      'Hypervisor risks: rogue hypervisor rootkits (hide from detection), external modification, VM escape (malicious code bypasses the virtual environment to get root access), denial of service, and unauthorized access to virtual resources.',
      'In Xen, the privileged domain that manages guest images is called Dom0.',
    ],
  },
  {
    heading: '12. Access Control, Application Security & Data Life Cycle',
    items: [
      'Access control and identity management in the cloud resemble traditional in-house IT, with concerns around identity theft prevention and privacy issues from massive data mining.',
      'Cloud applications are web-service based and face attacks such as injection attacks, XML Signature Element Wrapping, Cross-Site Scripting (XSS), flooding (DoS), DNS poisoning and phishing, metadata (WSDL) spoofing, and insecure communication channels.',
      'Data life cycle management raises questions of confidentiality (will data remain confidential, will the provider peek?), integrity (are computations correct, is data tamper-free?), availability (what if the provider is attacked or goes out of business?), data location (do all copies/backups comply with regulations?), and archive access latency.',
    ],
  },
  {
    heading: '13. "Hey, You, Get Off of My Cloud!" — Research Overview',
    items: [
      'Authored by Thomas Ristenpart, Eran Tromer, Hovav Shacham, and Stefan Savage, presented at CCS 2009; the research targeted the real Amazon EC2 cloud and achieved up to 40% co-residence with a target VM.',
      'New cloud risks: trust and dependence (must trust the provider with privacy and integrity) and multi-tenancy security (threats from other customers sharing physical resources).',
      'Multi-tenancy risks: VM multiplexing on the same hardware, no control over co-residency with an adversary, side-channel exploitation, cross-VM information leakage via shared resources (e.g. CPU caches, which can be used to extract RSA and AES secret keys), and VM isolation vulnerabilities including VM escape to the hypervisor.',
    ],
  },
  {
    heading: '14. Attack Model & Threat Assumptions',
    items: [
      'The attack model has two steps: Placement (arranging a malicious VM on the same physical machine as the target) and Extraction (stealing confidential information via side channels).',
      'Threat model assumptions: the provider and infrastructure are trusted, and the attacker does not subvert administrator functions or exploit VMM/software vulnerabilities; adversaries are non-provider malicious parties, victims run confidentiality-requiring services, and an attacker can run up to 20 instances on EC2.',
      'Four key research questions: (1) Can the location of an instance in the cloud infrastructure be determined? (2) Can co-residence between two instances be easily determined? (3) Can an adversary launch instances co-resident with a target user? (4) Can an adversary exploit cross-VM information leakage once co-resident?',
    ],
  },
  {
    heading: '15. Amazon EC2 Architecture',
    items: [
      'Uses the Xen hypervisor, with the privileged Domain0 managing guest images.',
      'Degrees of freedom: instance type, region, and availability zone. Instance types include m1.small and c1.medium (32-bit) and m1.large, m1.xlarge, and c1.xlarge (64-bit). Regions include US, EU, and Asia; availability zones have separate power/network infrastructure. Each instance gets both an internal and an external IP address.',
    ],
  },
  {
    heading: '16. Cloud Cartography (Mapping Instance Locations)',
    items: [
      'Goal: map EC2 to understand where targets are located, hypothesizing that different zones/instance types correspond to different IP ranges.',
      'Network probing tools used: nmap (TCP connect probes), hping (TCP SYN traceroutes), wget (retrieve web pages), and DNS lookup (translate public IPs to internal addresses).',
      'Survey results: 57,344 EC2 public IPs found, 11,315 responsive on port 80, 9,558 responsive via wget, 8,375 responsive on port 443, and 14,054 unique internal IPs obtained.',
      'Findings: the internal address space is cleanly partitioned between availability zones, samples from each zone are assigned disjoint IP ranges, and internal IPs are statically assigned to physical machines.',
    ],
  },
  {
    heading: '17. Determining Co-residence',
    items: [
      'Network-based co-residency checks: matching the Dom0 IP address, observing small packet round-trip times, and numerically close internal IP addresses (within 7).',
      'Verification experiment: a hard-disk-based covert channel was tested with 3 m1.small accounts (control, victim, probe), successfully transmitting 5-bit messages across 62 ordered pairs.',
      'An effective, "quiet" co-residency check compares internal IP addresses and performs a TCP SYN traceroute using only 2 packets.',
    ],
  },
  {
    heading: '18. Causing Co-residence',
    items: [
      'Brute-force placement against 1686 target victims achieved 8.4% coverage.',
      'Leveraging placement locality: sequential placement locality (terminating one instance before launching another often assigns the same machine) and parallel placement locality (launching simultaneously from different accounts often assigns the same machine).',
      'Instance flooding \u2014 launching 20 instances within 5 minutes \u2014 achieved a 40% success rate in causing co-residence.',
    ],
  },
  {
    heading: '19. Exploiting Co-residence',
    items: [
      'Cache-based attacks: measuring cache usage via the Prime+Trigger+Probe technique; a covert channel can be built where the sender transmits a 0 by idling and a 1 by accessing memory, and the receiver observes access latencies.',
      'Load-based co-residence check: actively causing load variation on the target and observing differences in load samples.',
      'Estimating traffic rates: measuring visitors to a co-resident web server, tested at 50, 100, and 200 requests per minute.',
      'Keystroke timing attack: measuring the time between keystrokes in real time to recover passwords from timing patterns.',
    ],
  },
  {
    heading: '20. Preventive Measures & Summary',
    items: [
      'Mapping defenses: randomize IP allocation, block probing tools like nmap and traceroute.',
      'Co-residence check defenses: prevent Dom0 identification. Co-location defense: disallow co-residence outright, though this is inefficient for the provider. Side-channels have no complete solution.',
      'Summary: cloud computing introduces new risks from shared physical infrastructure; the research demonstrated a practical attack, and some countermeasures have been proposed.',
    ],
  },
  {
    heading: '21. Security in Collaborative SaaS Cloud',
    items: [
      'Unique security features: co-tenancy (multiple customers share infrastructure), lack of control over outsourced data/applications, and inadequate policies/insufficient security controls.',
      'SaaS cloud collaboration uses APIs for sharing resources/information; service consumers are users, applications, and organizations; common concerns are integrity and choosing the ideal vendor.',
      'Collaboration types: tightly-coupled/federated (strong integration) and loosely-coupled (dynamic data/information sharing).',
      'Four objectives: (I) a framework (SelCSP) for selecting a SaaS cloud provider; (II) selecting access requests from anonymous users while keeping risk and security uncertainty low; (III) a heuristic for the IDRM problem that minimizes excess privilege; (IV) a distributed secure collaboration framework using local information for conflict detection/removal.',
    ],
  },
  {
    heading: '22. Trust Models, SLA Challenges & Access Control (RAC, IDRM)',
    items: [
      'Most existing trust models lack mathematical validation; web service selection is typically based on QoS and trust, with the objective of modeling a provider\u2019s trust, reputation, and competence.',
      'SLA challenge: most SLAs only guarantee availability, while consumers demand more performance assurances, and SLAs often contain non-standard clauses \u2014 the objective is to establish standard SLA parameters.',
      'Risk-based Access Control (RAC) grants access even without proper permissions, aiming to balance access risk against security uncertainty; a key challenge is that computing security uncertainty is not well addressed and operational need is not quantified.',
      'Inter-Domain Role Mapping (IDRM) finds the minimal set of roles encompassing requested permissions; challenges include multiple minimal sets and no exact mapping, with variants IDRM-safety and IDRM-availability.',
    ],
  },
  {
    heading: '23. Access Conflicts & Their Resolution',
    items: [
      'Cyclic Inheritance Conflict: occurs when the role hierarchy forms a cycle. SoD (Separation of Duty) Constraint Violation: occurs when roles conflict under separation-of-duty rules.',
      'Conflict detection: for inheritance, checking whether the current entry role is senior to the exit role; for SoD, checking whether the current entry and exit roles form a conflicting pair.',
      'Conflict removal rules: for exactly matched roles, replace the IA-relation with an A-relation; for non-exactly matched roles, introduce a virtual role; for SoD conflicts, remove the conflicting permissions.',
      'Summary of secure collaboration: (1) select a trustworthy SaaS provider, (2) recommend access requests for authorization, (3) map authorized permissions to local roles, (4) dynamically detect and remove access policy conflicts.',
    ],
  },
  {
    heading: '24. Broker for Cloud Marketplace — Motivation & Objectives',
    items: [
      'With rapid growth in cloud services, a huge number of providers offer varying QoS to customers with different use cases, motivating the need for an intelligent broker to suggest the best provider and safeguard customer interests.',
      'Motivations: flexible provider selection, trustworthiness of the provider, monitoring of services, and avoiding vendor lock-in.',
      'Objectives: select the most suitable provider satisfying QoS requirements, calculate SLA satisfaction and trustworthiness, and provide a decision system for dynamic service migration.',
    ],
  },
  {
    heading: '25. Broker Approaches, QoS Parameters & Architecture',
    items: [
      'Approaches: CloudCmp (compares providers for QoS), a fuzzy provider-selection mechanism, a satisfaction measure that accounts for the fuzzy nature of requirements, and a trustworthiness/competence-based framework.',
      'Customer QoS parameters \u2014 IaaS: availability, response time, throughput, cost, security, etc. SaaS: response time, throughput, reliability, cost, security, etc.',
      'PROMIDER captures promised QoS values (Prom\u2081...Prom\u2097) and trust values (TRUST\u2081...TRUST\u2097); the marketplace architecture has components for provider selection, monitoring, and migration.',
    ],
  },
  {
    heading: '26. Provider Selection Process & Monitoring/Migration',
    items: [
      'Provider selection uses a fuzzy inference engine that takes QoS offered plus trustworthiness as input and outputs suitability; the customer is dispatched to the provider with maximum suitability, with membership functions built from user requirements.',
      'The monitoring module continuously monitors delivered QoS, taking experienced QoS values as input and producing fuzzy values for migration decisions.',
      'The migration decider is a fuzzy inference engine taking F\u2081...F\u2097 as input and outputting the Degree of SLA Satisfaction; if this falls below a threshold, migration is triggered.',
    ],
  },
  {
    heading: '27. Broker Experimental Setup & Results',
    items: [
      'Experimental setup: 10 providers with varying QoS, 500 VM requests, a year-long simulation, performance degradation following a Gaussian distribution, compared against a conventional (minimum-cost) crisp broker.',
      'Key results: the intelligent broker achieved higher average availability, higher average bandwidth, and competitive cost.',
      'Future scope: specifying flexibility in QoS requirements, comparing against existing approaches on production workloads, and defining service classes for customers.',
    ],
  },
];

const questions: Question[] = [
  { question: 'Which of the following is NOT one of the three basic security components?', options: ['Confidentiality', 'Integrity', 'Authentication', 'Availability'], answer: 2 },
  { question: 'Which attack type compromises availability?', options: ['Interception', 'Interruption', 'Modification', 'Fabrication'], answer: 1 },
  { question: 'Which attack type compromises confidentiality?', options: ['Interruption', 'Interception', 'Modification', 'Fabrication'], answer: 1 },
  { question: 'Which attack type compromises integrity?', options: ['Interruption', 'Interception', 'Modification', 'Fabrication'], answer: 2 },
  { question: 'Which attack type compromises authenticity?', options: ['Interruption', 'Interception', 'Modification', 'Fabrication'], answer: 3 },
  { question: 'Snooping is classified under which class of threat?', options: ['Deception', 'Disclosure', 'Disruption', 'Usurpation'], answer: 1 },
  { question: 'Denial of Service falls under which class of threat?', options: ['Disclosure', 'Deception', 'Disruption', 'Usurpation'], answer: 2 },
  { question: 'What defines what is and is not allowed in a security context?', options: ['Mechanism', 'Policy', 'Protocol', 'Standard'], answer: 1 },
  { question: 'Which security goal involves preventing attackers from violating security policy?', options: ['Detection', 'Recovery', 'Prevention', 'Correction'], answer: 2 },
  { question: 'What is the first step in the network security process according to the lecture?', options: ['Implement security policy', 'Vulnerability scanning', 'Determine security policy', 'Penetration testing'], answer: 2 },
  { question: 'Which type of reconnaissance is undetectable?', options: ['Active reconnaissance', 'Passive reconnaissance', 'Both are detectable', 'Neither is detectable'], answer: 1 },
  { question: 'Which firewall type filters by destination IP, port, or protocol?', options: ['Stateful firewall', 'Application proxy', 'Packet filter', 'Next-generation firewall'], answer: 2 },
  { question: 'Which tool is commonly used as a free IDS for several platforms?', options: ['iptables', 'Snort', 'Nessus', 'Metasploit'], answer: 1 },
  { question: 'What type of attack involves one entity pretending to be a different entity?', options: ['Replay', 'Modification', 'Masquerade', 'Denial of Service'], answer: 2 },
  { question: 'What is the maximum amount of data that will be lost following an interruption or disaster called?', options: ['RTO', 'RPO', 'SLA', 'QoS'], answer: 1 },
  { question: 'Which of the following is a passive attack?', options: ['Masquerade', 'Replay', 'Traffic analysis', 'Modification'], answer: 2 },
  { question: 'Which type of attack is very difficult to detect?', options: ['Active attacks', 'Passive attacks', 'Both are equally detectable', 'Neither is detectable'], answer: 1 },
  { question: 'Which of the following is NOT a category of active attacks?', options: ['Masquerade', 'Traffic analysis', 'Replay', 'Denial of Service'], answer: 1 },
  { question: 'Release of message contents is an example of:', options: ['Active attack', 'Passive attack', 'Both', 'Neither'], answer: 1 },
  { question: 'In a replay attack, what does the attacker do?', options: ['Pretends to be a different entity', 'Captures and retransmits data units', 'Alters legitimate messages', 'Prevents normal use of facilities'], answer: 1 },
  { question: 'Which attack prevents the normal use of communication facilities?', options: ['Masquerade', 'Replay', 'Modification', 'Denial of Service'], answer: 3 },
  { question: 'Traffic analysis helps the opponent determine:', options: ['Message contents', 'Location and identity of communicating hosts', 'Encryption keys', 'Passwords'], answer: 1 },
  { question: 'Which of the following is an example of origin integrity?', options: ['Confidentiality', 'Authentication', 'Availability', 'Non-repudiation'], answer: 1 },
  { question: 'In which attack is some portion of a legitimate message altered?', options: ['Masquerade', 'Replay', 'Modification', 'Fabrication'], answer: 2 },
  { question: 'Which security service ensures the order is final?', options: ['Confidentiality', 'Integrity', 'Authentication', 'Non-repudiation'], answer: 3 },
  { question: 'According to Gartner, how many cloud computing security risks are identified?', options: ['Five', 'Seven', 'Ten', 'Twelve'], answer: 1 },
  { question: 'Which Gartner risk involves bypassing physical, logical, and personnel controls?', options: ['Data Location', 'Data Segregation', 'Privileged User Access', 'Recovery'], answer: 2 },
  { question: 'Which risk is concerned with isolation of user-specific logs?', options: ['Data Location', 'Data Segregation', 'Regulatory Compliance & Audit', 'Recovery'], answer: 2 },
  { question: 'Which risk involves data centers located at geographically dispersed locations?', options: ['Data Location', 'Data Segregation', 'Recovery', 'Investigative Support'], answer: 0 },
  { question: 'Which risk is associated with shared environment alongside other customers\u2019 data?', options: ['Data Location', 'Data Segregation', 'Recovery', 'Long-term Viability'], answer: 1 },
  { question: 'What does RTO stand for?', options: ['Recovery Time Objective', 'Response Time Objective', 'Return Time Objective', 'Resolution Time Objective'], answer: 0 },
  { question: 'Which risk involves logging and data for multiple customers being co-located?', options: ['Recovery', 'Investigative Support', 'Long-term Viability', 'Data Segregation'], answer: 1 },
  { question: 'Vendor lock-in is associated with which Gartner risk?', options: ['Data Location', 'Data Segregation', 'Recovery', 'Long-term Viability'], answer: 3 },
  { question: 'What is the main problem associated with long-term viability?', options: ['Data loss', 'Vendor lock-in', 'Security breaches', 'High costs'], answer: 1 },
  { question: 'Which regulations were mentioned in context of compliance in cloud?', options: ['GDPR and CCPA', 'SOX and HIPAA', 'PCI DSS and FISMA', 'ISO 27001 and NIST'], answer: 1 },
  { question: 'Data segregation risk suggests which solution for data protection?', options: ['Only encryption', 'Encryption with proper key management', 'Physical isolation', 'No protection needed'], answer: 1 },
  { question: 'Which risk asks "What happens if cloud provider goes out of business?"', options: ['Data Location', 'Recovery', 'Long-term Viability', 'Regulatory Compliance'], answer: 2 },
  { question: 'According to Gartner, encryption accidents can make data:', options: ['More secure', 'Faster to access', 'Totally unusable', 'Easier to recover'], answer: 2 },
  { question: 'Replication refers to:', options: ['Duplicating critical components', 'Mirroring/sharing data over disks in separate locations', 'Backing up data daily', 'Creating multiple user accounts'], answer: 1 },
  { question: 'Redundancy refers to:', options: ['Duplicating critical components for reliability', 'Sharing data over multiple disks', 'Backing up data weekly', 'Creating multiple user accounts'], answer: 0 },
  { question: 'What does VMM stand for?', options: ['Virtual Machine Manager', 'Virtual Memory Manager', 'Virtual Mobile Manager', 'Virtual Module Manager'], answer: 0 },
  { question: 'Another name for VMM is:', options: ['Virtual Machine', 'Hypervisor', 'Domain0', 'Guest OS'], answer: 1 },
  { question: 'In full virtualization, VMs run on:', options: ['Host OS', 'Hypervisor that interacts with hardware', 'Guest OS', 'Physical machine directly'], answer: 1 },
  { question: 'In para-virtualization, VMs interact with:', options: ['Hardware directly', 'Host OS', 'Hypervisor', 'Physical machine'], answer: 1 },
  { question: 'Shared clipboard technology in virtualization can:', options: ['Improve performance', 'Transfer malicious programs from VMs to host', 'Enhance security', 'Increase storage capacity'], answer: 1 },
  { question: 'What is VM escape?', options: ['Malicious code bypassing virtual environment to get root access', 'VM shutting down properly', 'VM migrating to another host', 'VM updating its software'], answer: 0 },
  { question: 'Which of the following is a hypervisor vulnerability?', options: ['Keystroke logging', 'SQL injection', 'XSS', 'Buffer overflow in applications'], answer: 0 },
  { question: 'ARP Poisoning in virtualization refers to:', options: ['Poisoning the hypervisor', 'Redirecting packets going to/from other VM', 'Infecting the guest OS', 'Corrupting VM images'], answer: 1 },
  { question: 'Rogue hypervisor rootkits:', options: ['Improve system performance', 'Hide from normal malware detection', 'Are easy to detect', 'Are beneficial for security'], answer: 1 },
  { question: 'Which vulnerability allows a covert communication channel?', options: ['Shared clipboard', 'Virtual machine backdoors', 'ARP Poisoning', 'Keystroke logging'], answer: 1 },
  { question: 'Proper access control addresses which tenets of information security?', options: ['CIA', 'AAA', 'AIC', 'IAC'], answer: 0 },
  { question: 'Denial of Service in virtualization is a threat to:', options: ['Confidentiality', 'Integrity', 'Availability', 'Authenticity'], answer: 2 },
  { question: 'The major functionality of virtualization is:', options: ['Resource sharing', 'Resource isolation', 'Resource allocation', 'Resource monitoring'], answer: 1 },
  { question: 'Virtual machine backdoors create:', options: ['Direct communication channels', 'Covert communication channels', 'Encrypted channels', 'Authenticated channels'], answer: 1 },
  { question: 'What is the privileged virtual machine in Xen called?', options: ['DomU', 'Dom0', 'Dom1', 'Hypervisor'], answer: 1 },
  { question: 'Which cloud delivery model has maximum lack of control?', options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'], answer: 2 },
  { question: 'What is the main feature of SaaS cloud-based collaboration?', options: ['Full control over hardware', 'APIs for sharing resources/information', 'Direct access to hypervisor', 'Physical infrastructure management'], answer: 1 },
  { question: 'Which type of collaboration involves strong integration?', options: ['Loosely-coupled', 'Tightly-coupled or federated', 'Both are equally integrated', 'Neither involves integration'], answer: 1 },
  { question: 'Which type of collaboration involves dynamic data/information sharing?', options: ['Loosely-coupled', 'Tightly-coupled', 'Both', 'Neither'], answer: 0 },
  { question: 'What is SelCSP?', options: ['A security protocol', 'A framework for selecting SaaS cloud provider', 'A type of encryption', 'A virtualization technique'], answer: 1 },
  { question: 'What does IDRM stand for?', options: ['Identity and Role Management', 'Inter-Domain Role Mapping', 'Integrated Data Resource Management', 'Identity and Data Risk Management'], answer: 1 },
  { question: 'What is the goal of IDRM?', options: ['Maximize excess privilege', 'Minimize excess privilege', 'Grant maximum permissions', 'Remove all permissions'], answer: 1 },
  { question: 'RAC stands for:', options: ['Role Access Control', 'Risk-based Access Control', 'Resource Access Control', 'Remote Access Control'], answer: 1 },
  { question: 'RAC gives access to subjects even though they:', options: ['Have proper permissions', 'Lack proper permissions', 'Are administrators', 'Are from trusted domains'], answer: 1 },
  { question: 'What does SoD stand for?', options: ['Separation of Duties', 'Security of Data', 'Service on Demand', 'System on Device'], answer: 0 },
  { question: 'Cyclic inheritance conflict occurs when:', options: ['Roles have no relationship', 'Role hierarchy creates cycles', 'Roles are properly mapped', 'No roles exist'], answer: 1 },
  { question: 'What is introduced when no exactly matched role set exists?', options: ['New user', 'Virtual role', 'New policy', 'New domain'], answer: 1 },
  { question: 'In inheritance conflict removal, what is replaced with A-relation?', options: ['I-relation', 'IA-relation', 'D-relation', 'B-relation'], answer: 1 },
  { question: 'The two variants of IDRM are:', options: ['IDRM-confidentiality and IDRM-integrity', 'IDRM-safety and IDRM-availability', 'IDRM-public and IDRM-private', 'IDRM-local and IDRM-global'], answer: 1 },
  { question: 'What is the main challenge in computing security uncertainty?', options: ['It is too easy to compute', 'It is not addressed in existing RAC systems', 'It has been fully solved', 'It requires no computation'], answer: 1 },
  { question: 'What is the role of a cloud broker?', options: ['To provide cloud services directly', 'To suggest the best cloud provider to customers', 'To replace cloud providers', 'To eliminate cloud providers'], answer: 1 },
  { question: 'CloudCmp is a tool that:', options: ['Compares cloud providers for QoS', 'Provides cloud storage', 'Creates virtual machines', 'Manages cloud security'], answer: 0 },
  { question: 'What is PROMIDER in the context of cloud providers?', options: ['A type of cloud service', 'Promised QoS values and trust values', 'A security protocol', 'A virtualization technique'], answer: 1 },
  { question: 'What type of inference engine is used for provider selection?', options: ['Boolean inference', 'Fuzzy inference', 'Bayesian inference', 'Rule-based inference'], answer: 1 },
  { question: 'What is the input to the fuzzy inference engine for provider selection?', options: ['Only QoS offered', 'Only trustworthiness', 'QoS offered and trustworthiness', 'Customer preference only'], answer: 2 },
  { question: 'What is the output of the provider selection fuzzy inference engine?', options: ['Cost', 'Suitability', 'Security level', 'Performance score'], answer: 1 },
  { question: 'What does the monitoring module continuously monitor?', options: ['Customer satisfaction', 'QoS delivered by providers', 'Provider profits', 'Number of customers'], answer: 1 },
  { question: 'What determines whether migration should occur?', options: ['Customer preference', 'Degree of SLA Satisfaction below threshold', 'Provider request', 'Random selection'], answer: 1 },
  { question: 'What is the main benefit of using an intelligent broker?', options: ['Higher cost', 'Better QoS, trustworthiness, and cost optimization', 'Lower availability', 'Reduced security'], answer: 1 },
  { question: 'Which QoS parameters are considered for IaaS?', options: ['Only cost', 'Only availability', 'Availability, response time, throughput, cost, security', 'Only security'], answer: 2 },
  { question: 'Which QoS parameters are considered for SaaS?', options: ['Only response time', 'Only reliability', 'Response time, throughput, reliability, cost, security', 'Only cost'], answer: 2 },
  { question: 'What comparison was made in the broker experiments?', options: ['Fuzzy broker vs no broker', 'Fuzzy broker vs conventional (minimum cost) crisp broker', 'Fuzzy broker vs maximum cost broker', 'No comparison was made'], answer: 1 },
  { question: 'How many providers were used in the broker experiments?', options: ['5', '10', '15', '20'], answer: 1 },
  { question: 'How many service requests were simulated in the broker experiments?', options: ['100', '250', '500', '1000'], answer: 2 },
  { question: 'What is one future scope for cloud brokering?', options: ['Reducing security', 'Specification of flexibility in QoS requirements', 'Eliminating providers', 'Removing monitoring'], answer: 1 },
  { question: 'What is the name of the research paper on cloud attacks?', options: ['"Cloud Security: Threats and Countermeasures"', '"Hey, You, Get Off of My Cloud!"', '"Cloud Computing: Security Issues"', '"Multi-tenancy in Cloud"'], answer: 1 },
  { question: 'Which cloud provider was targeted in the research paper?', options: ['Google Cloud', 'Microsoft Azure', 'Amazon EC2', 'IBM Cloud'], answer: 2 },
  { question: 'The research was first work on:', options: ['Cloud encryption', 'Cloud cartography', 'Cloud storage', 'Cloud networking'], answer: 1 },
  { question: 'What success rate in co-residence was achieved in the research?', options: ['10%', '20%', '40%', '80%'], answer: 2 },
  { question: 'How many instances can be run in parallel using an Amazon EC2 account?', options: ['5', '10', '20', '50'], answer: 2 },
  { question: 'What are the two steps of the attack model?', options: ['Reconnaissance and Exploitation', 'Placement and Extraction', 'Scanning and Testing', 'Detection and Recovery'], answer: 1 },
  { question: 'Which tool was used for TCP connect probes in the research?', options: ['Wget', 'Nmap', 'Hping', 'Metasploit'], answer: 1 },
  { question: 'Which tool was used for TCP SYN traceroutes?', options: ['Nmap', 'Wget', 'Hping', 'Nessus'], answer: 2 },
  { question: 'What is used to determine an uncontrolled instance\u2019s Dom0 IP?', options: ['DNS query', 'TCP SYN traceroute', 'ICMP ping', 'HTTP request'], answer: 1 },
  { question: 'What was used to verify co-residency in experiments?', options: ['Network ping', 'Hard-disk-based covert channel', 'Shared memory', 'Direct network connection'], answer: 1 },
  { question: 'What is the Prime+Trigger+Probe technique used for?', options: ['Network scanning', 'Measuring cache usage', 'Password cracking', 'Data encryption'], answer: 1 },
  { question: 'What did the load-based co-residence check induce on the target?', options: ['Load variation', 'Network congestion', 'Data loss', 'System crash'], answer: 0 },
  { question: 'The keystroke timing attack aims to measure:', options: ['Typing speed', 'Time between keystrokes', 'Password length', 'User identity'], answer: 1 },
  { question: 'What is the purpose of mapping in preventive measures?', options: ['Increase security', 'Randomize IP allocation', 'Reduce costs', 'Improve performance'], answer: 1 },
  { question: 'Why is cross-VM information leakage a new risk in cloud?', options: ['It was always present in traditional IT', 'Due to sharing of physical resources like CPU caches', 'It cannot be exploited', 'It only affects storage'], answer: 1 },
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

/* ---------------- Module 6 page ---------------- */

export default function Module6Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 06 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud Security — Fundamentals, Gartner Risks, Cross-VM Attacks, SaaS Collaboration &amp; Broker Marketplace
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