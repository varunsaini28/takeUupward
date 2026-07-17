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
    heading: '1. Public Cloud',
    items: [
      'Cloud infrastructure provisioned for open use by the general public, owned and managed by business, academic, or government organizations.',
      'Examples: Google App Engine, Microsoft Windows Azure, IBM Smart Cloud, Amazon EC2.',
      'Workload location is hidden from clients and can be migrated anywhere at any time.',
      'Multi-tenancy risk: a single machine may be shared by multiple subscribers, creating co-residency with competitors or adversaries.',
      'Depends on the public Internet — DNS, routers, and inter-router links.',
      'Security concerns: limited visibility and control, proprietary software, and no way to verify complete data deletion.',
      'Elasticity gives the illusion of unlimited resources with flexible workload movement; up-front costs are low, but default SLAs tend to be restrictive.',
    ],
  },
  {
    heading: '2. Private Cloud',
    items: [
      'Cloud infrastructure provisioned for the exclusive use of a single organization, in one of two scenarios.',
      'On-site Private Cloud: located at the customer\u2019s premises. The security perimeter surrounds the subscriber\u2019s own resources, which the subscriber controls, requiring both traditional IT and cloud IT skills.',
      'On-site workloads are hidden from individual clients, and since the same system may host multiple internal clients, access-policy separation risks remain.',
      'On-site performance is limited by network capacity, creating data import/export bottlenecks; security against external threats can be as strong as non-cloud security, but up-front cost is significant to high and capacity is fixed to anticipated workloads.',
      'Outsourced Private Cloud: the server side is hosted by a third party. Two security perimeters exist — subscriber and provider — joined by a protected link, with the option of a dedicated protected connection.',
      'Outsourced up-front cost is modest to significant (covering SLA negotiation, network upgrades, application porting, and training), but resources are extensive since infrastructure is the provider\u2019s core competency.',
    ],
  },
  {
    heading: '3. Community Cloud',
    items: [
      'Provisioned for the exclusive use of a specific community of organizations that share concerns such as mission, security, policy, or compliance.',
      'Examples: Google Apps for Government, Microsoft Government Community Cloud.',
      'Participants may provide and/or consume services; access policy is complex since N members must agree on how to share, typically using role-based or attribute-based access control.',
      'Depends on controlled inter-site links or cryptography over the public Internet, and generally requires more complex skills than a private cloud; cost is highly variable depending on whether an organization only consumes or also provides services.',
      'On-site Community Cloud: each organization implements its own security perimeter. Outsourced Community Cloud: multiple protected links run from members to the provider.',
    ],
  },
  {
    heading: '4. Hybrid Cloud',
    items: [
      'A composition of two or more distinct cloud infrastructures — private, community, or public — bound together by standardized or proprietary technology.',
      'Examples: Windows Azure, VMware vCloud.',
      'Shows significant variation in performance, reliability, and security, and is extremely complex — it may change over time as constituent clouds join or leave.',
    ],
  },
  {
    heading: '5. Infrastructure as a Service (IaaS)',
    items: [
      'Subscribers get access to virtual computers, network storage, firewalls, and configuration services.',
      'Pricing is typically based on CPU hours, data storage, bandwidth, network infrastructure, and value-added services.',
      'IaaS component stack, top to bottom: Applications (subscriber-controlled), Middleware (subscriber-controlled), Guest OS (subscriber-controlled), Hypervisor/VMM (provider-controlled), Hardware (provider-controlled).',
    ],
  },
  {
    heading: '6. Hypervisor / Virtual Machine Monitor (VMM)',
    items: [
      'Popek and Goldberg\u2019s three requirements for a virtual machine: Equivalence (a VM is indistinguishable from the underlying hardware), Resource Control (the VM controls virtualized resources), and Efficiency (most instructions execute directly on the CPU).',
      'Key theorem: a VMM can be constructed when sensitive instructions form a subset of privileged instructions — this is what makes an architecture virtualizable.',
    ],
  },
  {
    heading: '7. Server Virtualization Approaches',
    items: [
      'Full Virtualization (1st generation) uses dynamic binary translation with an emulation layer that talks to the OS. It isolates VMs from the host and each other and offers total VM portability across dissimilar hardware, even running OSes built for a different architecture — but at a performance cost, since VMs run at Ring 1/3 instead of Ring 0.',
      'Para-Virtualization (2nd generation) modifies the guest OS so kernel operations run at Ring 1, either by recompiling the OS kernel or installing para-virtualized drivers, giving better performance than full virtualization.',
      'Hardware-Assisted Virtualization (3rd generation) uses Intel-VT or AMD-V processor extensions, letting the VMM run at Ring -1 and unmodified OSes run as guests — though it can be slower and less flexible unless combined with para-virtualization.',
    ],
  },
  {
    heading: '8. Network Virtualization',
    items: [
      'Definition: making a physical network appear as multiple logical networks.',
      'Business model players: Infrastructure Providers (InPs) manage the physical networks, Service Providers (SPs) create and manage virtual networks and deploy services, End Users buy services from SPs, and Brokers act as mediators/arbiters.',
      'Design principles: concurrence of multiple heterogeneous networks, recursion of virtual networks, inheritance of architectural attributes, and revisitation of virtual nodes.',
      'Design goals: flexibility (custom topology, routing, control planes), manageability (clear policy/mechanism separation), scalability (maximize co-existing networks), security/isolation (complete logical and resource isolation), programmability, heterogeneity, and legacy support for the existing Internet.',
    ],
  },
  {
    heading: '9. XML Basics',
    items: [
      'XML is a text-based, extensible data-encoding syntax — a universal format all XML processors handle identically.',
      'A well-formed document is syntactically correct XML; a valid document is well-formed and also consistent with a DTD or Schema.',
      'DTD (Document Type Definition) is part of the core XML spec and defines allowed elements, attributes, and nesting, but offers limited constraints. XML Schema (2001) is more powerful, can specify data types like integers, dates, and ranges, and is itself written in XML syntax.',
      'XML Namespaces identify different "spaces" for XML names using the xmlns attribute; the URLs used don\u2019t need to point to real resources.',
    ],
  },
  {
    heading: '10. XML Processing APIs',
    items: [
      'SAX (Simple API for XML) is an event-based parser that reports tags, attributes, and text as it encounters them — fast with a low memory footprint, but with less functionality and harder document modification.',
      'DOM (Document Object Model) is object/tree-based, building an in-memory tree that supports dynamic modification and querying with a consistent interface across languages — at the cost of speed and memory.',
      'JDOM is a Java-specific, more OOP-friendly alternative to DOM.',
      'dom4j is a Java XML framework supporting SAX, DOM, and JDOM, using "mixed" parsing (SAX up to a point, then a DOM tree) under an Apache license.',
      'XSLT (eXtensible Stylesheet Language Transformations) is an XML language for transforming XML documents — great for tree transformations, though it can be slow and hard to debug.',
    ],
  },
  {
    heading: '11. XML Messaging',
    items: [
      'Uses XML to exchange messages between systems.',
      'Advantages: common syntax, self-describing data, and multiple transport options.',
      'Disadvantages: asynchronous with no guaranteed delivery, and larger message sizes — often around 10x bigger.',
      'Related standards: XML-RPC (simple remote procedure calls) and SOAP (a more complex messaging wrapper).',
    ],
  },
  {
    heading: '12. Web Services',
    items: [
      'A web service is a software application identified by a URI, with interfaces defined, described, and discovered as XML artifacts, accessible through standard Internet protocols.',
      'Solves three core problems: interoperability across platforms, firewall traversal by using HTTP port 80, and complexity through developer-friendly, text-based standards.',
    ],
  },
  {
    heading: '13. Service Oriented Architecture (SOA)',
    items: [
      'Three entities: the Service Provider (owns and hosts the service), the Service Requestor (needs functionality and invokes the service), and the Service Registry (a searchable directory of service descriptions).',
      'Three operations: Publish (providers register services), Find (requestors locate services), and Bind (requestors invoke services) — in that sequence.',
    ],
  },
  {
    heading: '14. Web Service Components',
    items: [
      'XML provides a uniform, machine-readable data representation that separates content from presentation.',
      'SOAP (Simple Object Access Protocol) is a platform- and language-independent message format built from an Envelope (required), Header (optional), Body (required), and Fault (optional, for errors). It is extensible (e.g. security or routing extensions), neutral (works over HTTP, SMTP, TCP, or other transports), and independent of any particular programming model. It supports RPC-like messages and document exchange, with WS-Security providing encryption.',
      'WSDL (Web Services Description Language) is an XML vocabulary describing a service as a contract between service and client, with major elements including portType (operations performed), message (messages used), types (data types used), and binding (communication protocols).',
      'UDDI (Universal Description, Discovery, Integration) is an XML-based, searchable registry of business descriptions, queried via SOAP messages and providing access to WSDL documents — helping consumers discover the right business, enable commerce, reach new customers, and expand offerings.',
    ],
  },
  {
    heading: '15. Web Service Process Flow',
    items: [
      'The client queries the registry for a service, the registry refers it to a WSDL document, the client accesses that WSDL, the WSDL supplies interaction data, the client sends a SOAP request, and the web service returns a SOAP response.',
      'Web Services Security Architecture provides a comprehensive framework covering authentication, authorization, encryption, and other concerns for these interactions.',
    ],
  },
  {
    heading: '16. Key Comparisons',
    items: [
      'Cloud model comparison — users: Public serves the general public, Private serves a single organization, Community serves a specific community.',
      'Cloud model comparison — cost: Public is low up-front, Private is high up-front, Community cost is highly variable.',
      'Virtualization evolution: Full Virtualization (binary rewriting) \u2192 Para-Virtualization (modified guest OS) \u2192 Hardware-Assisted Virtualization (CPU extensions such as Intel-VT/AMD-V).',
      'Web Services stack, bottom to top: Transport (HTTP, SMTP, TCP) \u2192 Messaging (SOAP) \u2192 Description (WSDL) \u2192 Discovery (UDDI) \u2192 Data (XML).',
    ],
  },
];

const questions: Question[] = [
  { question: 'Which cloud deployment model is provisioned for open use by the general public?', options: ['Private Cloud', 'Public Cloud', 'Hybrid Cloud', 'Community Cloud'], answer: 1 },
  { question: 'Which of the following is an example of a Public Cloud?', options: ['Amazon VPC', 'Eucalyptus', 'Google App Engine', 'VMware Cloud Infrastructure Suite'], answer: 2 },
  { question: 'A Private Cloud is provisioned for exclusive use by:', options: ['General public', 'A single organization', 'A specific community', 'Government agencies only'], answer: 1 },
  { question: 'Which deployment model combines two or more distinct cloud infrastructures?', options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Community Cloud'], answer: 2 },
  { question: 'Community Cloud is designed for organizations that have:', options: ['Different security requirements', 'Shared concerns (mission, security, policy)', 'No common interests', 'Only government affiliation'], answer: 1 },
  { question: 'What is the primary characteristic of Public Cloud elasticity?', options: ['Fixed resources', 'Illusion of unlimited resource availability', 'Limited scalability', 'High up-front costs'], answer: 1 },
  { question: 'Which of the following is NOT a characteristic of Public Cloud?', options: ['Low up-front costs', 'Multi-tenancy risks', 'Complete visibility and control over data', 'Network dependency on public Internet'], answer: 2 },
  { question: 'In a Public Cloud, workload locations are:', options: ['Always disclosed to clients', 'Hidden from clients', 'Fixed to specific data centers', 'Only within national borders'], answer: 1 },
  { question: 'What is a major risk associated with multi-tenancy in Public Cloud?', options: ['Lower costs', 'Better performance', 'Co-residency with competitors or adversaries', 'Improved security'], answer: 2 },
  { question: 'In an On-site Private Cloud, the security perimeter extends around:', options: ["Only the provider's resources", "Only the subscriber's resources", "Both subscriber's on-site resources and private cloud resources", 'Neither subscriber nor provider resources'], answer: 2 },
  { question: 'Which Private Cloud scenario involves outsourcing the server side to a hosting company?', options: ['On-site Private Cloud', 'Outsourced Private Cloud', 'Community Cloud', 'Hybrid Cloud'], answer: 1 },
  { question: 'The default Service Level Agreements (SLAs) of public clouds are typically:', options: ['Very comprehensive', 'Restrictive with limited promises', 'Customizable for all subscribers', 'Guaranteeing 100% uptime'], answer: 1 },
  { question: 'In an Outsourced Private Cloud, how many security perimeters are typically implemented?', options: ['One', 'Two', 'Three', 'None'], answer: 1 },
  { question: 'Which of the following is an example of Community Cloud?', options: ['Amazon EC2', 'Google Apps for Government', 'Microsoft Azure', 'VMware vCloud'], answer: 1 },
  { question: 'In a Hybrid Cloud, constituent clouds are bound together by:', options: ['Physical cables only', 'Standardized or proprietary technology', 'Manual data transfer', 'Same operating system'], answer: 1 },
  { question: 'Which statement about On-site Private Cloud is TRUE?', options: ['It cannot exist off premises', 'Individual clients always know where their workloads physically exist', 'Subscriber organizations need both traditional and cloud IT skills', 'There are no multi-tenancy risks'], answer: 2 },
  { question: 'The network dependency of Outsourced Private Cloud differs from On-site Private Cloud in that:', options: ['It uses only public Internet', 'Subscribers may provision unique protected and reliable communication links', 'Network dependency is eliminated', 'It has no network requirements'], answer: 1 },
  { question: 'In a Community Cloud with N members, access policy decisions:', options: ['Are automatically determined by the provider', 'Must be made on how to share resources with each other member', 'Are not needed', 'Are fixed and cannot be customized'], answer: 1 },
  { question: 'What is a key limitation of On-site Private Cloud regarding data import/export?', options: ['No limitations exist', 'Limited by the network capacity', 'Only limited by storage space', 'Data cannot be imported'], answer: 1 },
  { question: 'Which deployment model has "extensive resources available" as a characteristic?', options: ['On-site Private Cloud', 'On-site Community Cloud', 'Outsourced Private Cloud', 'Both A and B'], answer: 2 },
  { question: 'Which statement about Private Cloud is FALSE?', options: ['It may exist on premises', 'It may exist off premises', 'It must be owned by the organization using it', 'It may be managed by a third party'], answer: 2 },
  { question: 'In Public Cloud, providers may migrate subscriber workloads to data centres where:', options: ['Cost is high', 'Cost is low', 'Security is maximum', 'Only government data is stored'], answer: 1 },
  { question: 'The phrase "a hybrid cloud may change over time" implies that:', options: ['It becomes more expensive', 'Constituent clouds may join and leave', 'It automatically upgrades', 'Security decreases over time'], answer: 1 },
  { question: 'In On-site Community Cloud, the reliability and security of the community cloud depends on:', options: ["Only the provider's infrastructure", "Only the subscriber's infrastructure", 'Reliability and security of communication links', 'Government regulations'], answer: 2 },
  { question: 'A subscriber cannot verify in Public Cloud that:', options: ['The provider exists', "Data has been completely deleted from provider's systems", 'The cloud is public', 'The provider has servers'], answer: 1 },
  { question: 'What does IaaS stand for?', options: ['Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Information as a Service'], answer: 1 },
  { question: 'In IaaS, usage fees are typically calculated based on:', options: ['Number of users', 'Per CPU hour, data storage, bandwidth', 'Per application', 'Per month flat fee'], answer: 1 },
  { question: 'The Virtual Machine Monitor is also known as:', options: ['Guest OS', 'Hypervisor', 'Middleware', 'Application layer'], answer: 1 },
  { question: 'Which of the following is NOT a type of server virtualization approach?', options: ['Full virtualization', 'Para-virtualization', 'Hardware-assisted virtualization', 'Software-only virtualization'], answer: 3 },
  { question: 'In IaaS, the subscriber has control over which layer?', options: ['Hardware', 'Hypervisor', 'Guest Operating System', 'Physical infrastructure'], answer: 2 },
  { question: 'What is the primary purpose of virtualization?', options: ['To increase hardware cost', 'To allow one computer to do the job of multiple computers', 'To eliminate operating systems', 'To reduce software requirements'], answer: 1 },
  { question: 'Which technology allows hardware-assisted virtualization?', options: ['Binary rewriting', 'Intel-VT or AMD-V', 'Emulation', 'Dynamic translation'], answer: 1 },
  { question: 'The Popek and Goldberg theorem states that a VMM can be constructed if:', options: ['All instructions are privileged', 'Sensitive instructions are a subset of privileged instructions', 'Guest OS is modified', 'Hardware is changed'], answer: 1 },
  { question: "Which of the following is NOT one of Popek and Goldberg's three goals for a virtual machine?", options: ['Equivalence', 'Resource control', 'Efficiency', 'Security'], answer: 3 },
  { question: 'In Full Virtualization, the guest OS is executed:', options: ['In Ring 0', 'In Ring 1 or 3', 'At the same level as host OS', 'In a separate processor'], answer: 1 },
  { question: 'Para-virtualization requires:', options: ['Hardware support', 'Modified guest operating system', 'Binary rewriting', 'Emulation of all hardware'], answer: 1 },
  { question: 'In hardware-assisted virtualization, the VMM runs at:', options: ['Ring 0', 'Ring 1', 'Ring -1', 'Ring 3'], answer: 2 },
  { question: 'What is a key advantage of Para-virtualization over Full Virtualization?', options: ['No guest OS modification needed', 'Better performance', 'Supports all legacy OS', 'Simpler implementation'], answer: 1 },
  { question: 'In the IaaS component stack, the provider maintains administrative control over:', options: ['Guest OS layer', 'Middleware layer', 'Hypervisor layer', 'Applications layer'], answer: 2 },
  { question: 'Network Virtualization is defined as:', options: ['Creating multiple physical networks', 'Making a physical network appear as multiple logical ones', 'Eliminating physical networks', 'Combining multiple networks'], answer: 1 },
  { question: 'In the three-level hierarchy of IaaS cloud systems, the top level is responsible for:', options: ['Running host computer systems', 'Managing computer clusters', 'Central control', 'Virtual machine creation'], answer: 2 },
  { question: 'The Cloud Manager in IaaS architecture performs which function?', options: ['Managing local storage', 'Authenticating subscribers and generating credentials', 'Running virtual machines', 'Managing cluster networks'], answer: 1 },
  { question: 'In the IaaS cloud architecture, Cluster Managers are connected to:', options: ['Only the Internet', 'Persistent Local Storage (PLS)', 'Only other Cluster Managers', 'End users directly'], answer: 1 },
  { question: 'What is the role of Computer Manager in IaaS?', options: ['Manage multiple clusters', 'Run on each computer system and provide VMs', 'Handle subscriber billing', 'Manage the cloud interface'], answer: 1 },
  { question: 'In Network Virtualization, Infrastructure Providers (InPs) are responsible for:', options: ['Creating virtual networks', 'Managing underlying physical networks', 'Deploying end-to-end services', 'Buying services from providers'], answer: 1 },
  { question: 'Which statement about virtualization is TRUE?', options: ['Virtualization eliminates the need for hardware', 'Multiple OSes can run simultaneously and be completely isolated', 'Virtualization is only possible on Linux systems', 'Virtualization reduces hardware utilization'], answer: 1 },
  { question: 'The advantage "Total VM portability" in Full Virtualization means:', options: ['VMs cannot be moved', 'VMs can move between hosts with dissimilar hardware', 'VMs only work on Dell servers', 'VMs must stay on same hardware'], answer: 1 },
  { question: 'In IaaS, "subscriber is free to load any supported operating system software desired into the VM" means:', options: ["Subscriber must use provider's default OS", 'Subscriber has complete control over guest OS', 'Subscriber cannot change OS', 'Only Linux is supported'], answer: 1 },
  { question: 'Which statement about Data Object Storage (DOS) in IaaS is correct?', options: ['Each cluster has its own DOS', 'DOS is usually single for a cloud', 'DOS stores only application data', 'DOS is optional for IaaS'], answer: 1 },
  { question: 'The design principle "Revisitation of virtual nodes" in Network Virtualization:', options: ['Makes network complex', 'Simplifies network operation and management', 'Eliminates nodes', 'Creates more hardware'], answer: 1 },
  { question: 'XML stands for:', options: ['eXtensible Markup Language', 'eXtra Markup Language', 'eXtensible Machine Language', 'eXtra Machine Language'], answer: 0 },
  { question: 'Which of the following is TRUE about XML?', options: ['XML tags are predefined', 'XML separates content from presentation', 'XML is not extensible', 'XML uses binary encoding'], answer: 1 },
  { question: 'An XML document that is syntactically correct is called:', options: ['Valid', 'Well-formed', 'Complete', 'Verified'], answer: 1 },
  { question: 'Which parser interface creates an in-memory tree of an XML document?', options: ['SAX', 'DOM', 'XSLT', 'DTD'], answer: 1 },
  { question: 'SAX is an example of:', options: ['Object-based parser', 'Event-based parser', 'Tree-based parser', 'Schema-based parser'], answer: 1 },
  { question: 'What does DTD stand for?', options: ['Document Type Definition', 'Data Transfer Document', 'Document Transfer Definition', 'Data Type Definition'], answer: 0 },
  { question: 'XML Schemas are more powerful than DTDs because they:', options: ['Use special grammar', 'Can specify data types like integers and dates', 'Are easier to write', 'Are older than DTDs'], answer: 1 },
  { question: 'Namespaces in XML are used to:', options: ['Define document structure', 'Identify different spaces for element/attribute names', 'Validate documents', 'Format documents for display'], answer: 1 },
  { question: 'A Valid XML document must be:', options: ['Well-formed only', 'Well-formed and consistent with DTD/Schema', 'Formatted for display', 'Binary encoded'], answer: 1 },
  { question: 'In XML processing, a validating parser:', options: ['Must retrieve all entities and process all DTD content', 'Can ignore entities it cannot find', 'Only checks syntax', 'Does not validate against schema'], answer: 0 },
  { question: 'A non-validating XML parser:', options: ['Must process all DTD content', 'Will try to retrieve entities but can cease processing if not found', 'Cannot process external entities', 'Only works with schemas'], answer: 1 },
  { question: 'Which XML processing API has the LOWEST memory footprint?', options: ['DOM', 'JDOM', 'SAX', 'dom4j'], answer: 2 },
  { question: 'In XML, character references like &#9824; are used to:', options: ['Create new tags', 'Include characters not defined in the encoding charset', 'Define attributes', 'Create comments'], answer: 1 },
  { question: 'XSLT is used for:', options: ['Parsing XML documents', 'Transforming XML documents', 'Validating XML documents', 'Creating XML schemas'], answer: 1 },
  { question: 'The XML declaration specifies:', options: ['The document content', 'Version and encoding information', 'Document Type Definition', 'The schema location'], answer: 1 },
  { question: 'Which of the following is an advantage of XML Messaging?', options: ['Binary format for efficiency', 'Common syntax and self-describing data', 'Guaranteed delivery', 'Small message size'], answer: 1 },
  { question: 'The XML example showing a contact with name, address, etc., demonstrates that XML:', options: ['Is only for displaying data', 'Marks information for content, not just display', 'Cannot be read by machines', 'Is only for web pages'], answer: 1 },
  { question: 'A DOM parser processing model involves:', options: ['Streaming events', 'Creating an in-memory tree', 'Direct manipulation of files', 'No parsing required'], answer: 1 },
  { question: 'In the XML namespace example with xmlns:mt="http://www.w3.org/1998/mathml", the prefix "mt" refers to:', options: ['The default namespace', 'A specific namespace for MathML', 'An attribute', 'A processing instruction'], answer: 1 },
  { question: 'The disadvantage of XML Messaging mentioned is:', options: ['Messages are secure', 'Asynchronous transport with no guarantee of delivery', 'Messages are very small', 'All systems support it'], answer: 1 },
  { question: 'Which statement about HTML vs XML is CORRECT?', options: ['HTML describes data, XML describes display', 'XML describes data, HTML describes display', 'Both describe data only', 'Both describe display only'], answer: 1 },
  { question: 'In XML, binary data must be:', options: ['Stored as binary files', 'Encoded as printable characters', 'Converted to images', 'Excluded from XML'], answer: 1 },
  { question: 'Which statement about XML Schemas is TRUE?', options: ['They replace DTDs completely', 'They use pure XML syntax', 'They cannot specify data types', 'They are less powerful than DTDs'], answer: 1 },
  { question: 'A well-formed XML document:', options: ['Must have a DTD', 'Must be valid according to schema', 'Follows XML syntax rules', 'Must be displayed in a browser'], answer: 2 },
  { question: "The XML parser's primary function is to:", options: ['Display XML documents', 'Check syntax and make data available', 'Create XML documents', 'Store XML documents'], answer: 1 },
  { question: 'SOAP stands for:', options: ['Simple Object Access Protocol', 'Service Oriented Access Protocol', 'Simple Object Application Protocol', 'Service Object Application Protocol'], answer: 0 },
  { question: 'WSDL stands for:', options: ['Web Service Description Language', 'Web Service Definition Language', 'Web System Description Language', 'Web Standard Definition Language'], answer: 0 },
  { question: 'UDDI stands for:', options: ['Universal Description, Discovery and Integration', 'Universal Data Discovery Interface', 'Unified Data Description Integration', 'Universal Description and Data Integration'], answer: 0 },
  { question: 'In SOA, who publishes service descriptions?', options: ['Service Requestor', 'Service Provider', 'Service Registry', 'End User'], answer: 1 },
  { question: 'In SOA, who finds and invokes services?', options: ['Service Provider', 'Service Requestor', 'Service Registry', 'Broker'], answer: 1 },
  { question: 'SOAP messages typically use which transport protocol?', options: ['FTP', 'HTTP', 'Telnet', 'SSH'], answer: 1 },
  { question: 'Which SOAP element is REQUIRED in every SOAP message?', options: ['Header', 'Body', 'Fault', 'Envelope'], answer: 3 },
  { question: 'The "portType" element in WSDL defines:', options: ['The physical port number', 'The operations performed by the web service', 'The data types used', 'The communication protocols'], answer: 1 },
  { question: 'Web Services were intended to solve which three problems?', options: ['Speed, Cost, Security', 'Interoperability, Firewall traversal, Complexity', 'Storage, Processing, Bandwidth', 'Authentication, Authorization, Accounting'], answer: 1 },
  { question: 'Why did CORBA and DCOM fail on the Internet?', options: ['They were too fast', 'They required specific platforms or languages', 'They used only HTTP', 'They were open standards'], answer: 1 },
  { question: 'The conceptual Web Services stack includes which layers?', options: ['Only application layer', 'Discovery, Description, Messaging, Transport', 'Only transport layer', 'Presentation, Session, Transport'], answer: 1 },
  { question: 'In the Web Service model, the correct sequence of operations is:', options: ['Bind \u2192 Find \u2192 Publish', 'Publish \u2192 Find \u2192 Bind', 'Find \u2192 Publish \u2192 Bind', 'Bind \u2192 Publish \u2192 Find'], answer: 1 },
  { question: 'WSDL "binding" element defines:', options: ['The data types used', 'The communication protocols used', 'The messages used', 'The operations performed'], answer: 1 },
  { question: "SOAP's extensibility characteristic means:", options: ['It cannot be extended', 'Security and WS-routing are among extensions', 'It only works with HTTP', 'It cannot add new features'], answer: 1 },
  { question: 'Which statement about SOAP is FALSE?', options: ['It is XML-based', 'It is platform independent', 'It is language dependent', 'It is simple and extensible'], answer: 2 },
  { question: 'The WS-Security specification defines:', options: ['Only authentication methods', 'A complete encryption system', 'Only authorization rules', 'Only logging mechanisms'], answer: 1 },
  { question: 'In a Web Service interaction, the Service Registry provides:', options: ['The actual service implementation', 'Searchable repository of service descriptions', 'The transport protocol', 'The data format'], answer: 1 },
  { question: 'What is the difference between XML-RPC and SOAP?', options: ['XML-RPC is more complex than SOAP', 'SOAP is more complex with schemas, interfaces; XML-RPC is simpler', 'Both are identical', 'XML-RPC uses JSON'], answer: 1 },
  { question: 'The W3C definition of Web Services states they are identified by:', options: ['A TCP port number', 'A URI', 'An IP address', 'A MAC address'], answer: 1 },
  { question: 'EDI (Electronic Data Interchange) advantages include:', options: ['High human error', 'Lower operating costs and increased productivity', 'Slower trading cycles', 'More data entry required'], answer: 1 },
  { question: 'Which statement best describes Web Services?', options: ['They are web pages displayed in browsers', 'They are programmable application logic accessible through standard Internet protocols', 'They only work with Microsoft products', 'They cannot communicate through firewalls'], answer: 1 },
  { question: 'The "neutrality" characteristic of SOAP means:', options: ['It can only use HTTP', 'It can use any transport protocol', 'It works only on neutral networks', 'It has no security'], answer: 1 },
  { question: 'In the Web Services stack, which component is responsible for service discovery?', options: ['WSDL', 'SOAP', 'UDDI', 'XML'], answer: 2 },
  { question: 'The "Fault" element in SOAP is used to:', options: ['Indicate successful message processing', 'Report errors that occurred during processing', 'Define the SOAP version', 'Specify the encoding style'], answer: 1 },
  { question: 'The main advantage of Web Services over EDI is:', options: ['Higher cost', 'Simpler and less expensive to implement', 'More complex integration', 'Slower processing'], answer: 1 },
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

/* ---------------- Module 2 page ---------------- */

export default function Module2Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 02 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud Deployment Models, Virtualization, XML &amp; Web Services
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