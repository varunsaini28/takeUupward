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
    heading: '1. Evolution of Mobile Networks',
    items: [
      '1G (1980s) — analog voice, roughly 2 kbit/s, no defined latency.',
      '2G (early 1990s) — digital voice using CDMA, roughly 384 kbit/s, ~629 ms latency.',
      '3G (early 2000s) — mobile data using CDMA2000, roughly 56 Mbit/s, ~212 ms latency.',
      '4G LTE (2010s) — mobile broadband, roughly 1 Gbit/s, 60-98 ms latency.',
      '5G (2020s) — unified air interface, roughly 10 Gbit/s, less than 1 ms latency.',
    ],
  },
  {
    heading: '2. What is 5G?',
    items: [
      'The 5th generation mobile network, designed to connect everyone and everything — machines, objects, and devices.',
      'Delivers higher multi-Gbps peak data speeds, ultra-low latency, more reliability, and massive network capacity.',
      'Designed for forward compatibility — the ability to flexibly support future services as they emerge.',
    ],
  },
  {
    heading: '3. 5G Service Categories',
    items: [
      'Enhanced Mobile Broadband (eMBB) — VR/AR, enterprise collaboration, and enhanced indoor/outdoor broadband.',
      'Massive Machine-Type Communications (mMTC) — IoT, asset tracking, smart agriculture, smart cities, smart home, remote monitoring.',
      'Ultra-Reliable Low-Latency Communications (URLLC) — autonomous vehicles, smart grids, remote patient monitoring, industrial automation.',
    ],
  },
  {
    heading: '4. 5G and Cloud Computing Relationship',
    items: [
      'Two key aspects: cloud computing must meet 5G needs (growing roles of edge, mobile edge, and fog computing), and 5G is undergoing "cloudification" (network softwarization, NFV, SDN).',
      '5G is considered the perfect companion to cloud computing in terms of distribution and diverse compute/storage capabilities.',
      'On-premises and edge data centers close the gap between resource-constrained devices and distant cloud data centers.',
      'Service providers need full end-to-end orchestration with defined service layer agreements.',
      'Network as a Platform enables enterprise services, and service orchestration lets industrial applications interact with network resources — selecting location, QoS, and influencing traffic routing.',
    ],
  },
  {
    heading: '5. Edge Computing in 5G',
    items: [
      'Brings cloud capabilities near to end users to overcome traditional cloud limitations such as high latency.',
      'Essential for next-generation applications like AR/VR that are interactive, computationally intensive, and have high QoS requirements.',
    ],
  },
  {
    heading: '6. 5G Needs for Today\u2019s Network Traffic',
    items: [
      'Handle a massive amount of data generated from mobile devices and IoT.',
      'Meet stringent QoS requirements for highly interactive applications — ultra-low latency, high throughput.',
      'Support a heterogeneous environment: diverse end-user equipment, QoS requirements, and network types.',
    ],
  },
  {
    heading: '7. Edge Computing Applications in 5G',
    items: [
      'Healthcare, entertainment and multimedia, VR/AR/Mixed Reality, Tactile Internet, IoT.',
      'Factories of the future, emergency response, and Intelligent Transportation Systems.',
    ],
  },
  {
    heading: '8. Mobile Cloud Computing (MCC) for 5G',
    items: [
      'A cloud computing system that includes mobile devices, delivering applications to mobile devices.',
      'Key features: shared resources for mobile applications, improved reliability since data is backed up in the cloud, and offloaded data processing from devices to the cloud so fewer device resources are consumed.',
      'Compute-intensive processing is offloaded from mobile networks to the cloud.',
    ],
  },
  {
    heading: '9. Cyber-Physical Systems (CPS)',
    items: [
      'A Cyber-Physical System is the orchestration of computers and physical systems, where embedded computers monitor and control physical processes through feedback loops.',
      'Physical processes affect computations and vice versa.',
      'The term was coined by Helen Gill at NSF, USA, around 2006.',
      'CPS represents the intersection — not the union — of physical and cyber.',
      'CPS are complex, multi-disciplinary, physically-aware engineered systems where physical and software components are deeply intertwined, operate on different spatial and temporal scales, and exhibit multiple, distinct behavioral modalities.',
    ],
  },
  {
    heading: '10. CPS Elements and Applications',
    items: [
      'Core elements: Cyber (computing/communication systems), Physical (physical world processes), Computation, Dynamics (behavior over time), Communication (data exchange), Security, and Safety.',
      'Applications: automotive systems, manufacturing, medical devices, military systems, assisted living, traffic control and safety, process control, power generation and distribution, energy conservation, smart grid, autonomous vehicles, medical monitoring, industrial control systems, robotics, and automatic pilot avionics.',
      'CPS can be seen as Smart Networked Systems and Societies (SNSS) — interlinked networks of sensors, actuators, and processing devices forming a vast network of connected computing resources, things, and humans.',
      'Sensors and actuators are used to link computational systems to the physical world; cloud computing services provide a flexible platform for realizing CPS goals.',
    ],
  },
  {
    heading: '11. Cyber-Physical Cloud Computing (CPCC)',
    items: [
      'Definition: a system environment that can rapidly build, modify, and provision cyber-physical systems composed of cloud computing based sensor, processing, control, and data services.',
      'Benefits: efficient use of resources, modular composition, rapid development and scalability, smart adaptation to the environment at every scale, and a reliable and resilient architecture.',
      'The Cloud-Edge Computing Framework for CPS integrates cloud and edge computing for cyber-physical-social services, enabling efficient processing at different layers of the computing continuum.',
    ],
  },
  {
    heading: '12. Spatial Cloud Computing',
    items: [
      'Spatial (geospatial) data describes objects, events, or features with a location on or near the Earth\u2019s surface, made up of location, attribute, and temporal information.',
      'Spatial analysis solves location-oriented problems and helps understand "where and what" is occurring — e.g. crime studies, drought analysis, finding optimal paths, predictions, and decision-making support.',
      'Spatial Cloud Computing is a cloud paradigm driven by geospatial sciences, optimized by spatiotemporal principles for enabling geospatial science discoveries.',
      'Advantages: easy to use (click/API/network deployment), scalability based on application needs, cost-optimized usage-based pricing, reliability from enterprise-grade hardware and multi-cloud subscriptions, and reduced risk from instant changes.',
      'Supports shared resource pooling for organizations with common goals, and managed services help prevent data loss from outages.',
    ],
  },
  {
    heading: '13. Trajectory Data and Traj-Cloud',
    items: [
      'A spatial trajectory is the trace generated by a moving object in geographical space — a series of chronologically ordered <lat, lon, t> points.',
      'A semantic trajectory captures the implicit intent behind human movement, including stay-point information and the activities performed.',
      'Traj-Cloud supports urban dynamics analysis: mobility trace analysis for mapping urban dynamics, location-based service provisioning, transportation resource planning, and Intelligent Transportation System (ITS) support.',
      'Example services: TS1 handles trajectory data indexing (Google BigQuery, Cloud SQL), TS2 handles trajectory map-matching (Google Compute Engine), and TS3 handles trajectory query service (Google Compute Engine, Cloud SQL).',
    ],
  },
  {
    heading: '14. Cloud-Fog-Edge-IoT Framework',
    items: [
      'Cloud Computing: centralized, high capacity, high latency.',
      'Fog Computing: an intermediate layer between cloud and edge, using devices like routers, servers, and switches as fog nodes for real-time applications, aiming to reduce latency, network usage, and cloud costs.',
      'Edge Computing: located near data-producing devices.',
      'IoT: sensors and devices collecting data.',
      'Cloud limitations: latency issues, large volumes of generated data, and bandwidth requirements.',
      'IoT device limitations: limited processing power, limited storage, and high power consumption.',
      'Fog-Edge computing benefits: reduced latency for real-time applications, less network congestion, reduced cloud execution cost, better handling of large data volumes, and more data location awareness.',
    ],
  },
  {
    heading: '15. Case Study: Internet of Health Things (IoHT)',
    items: [
      'Objectives: design a Fog-Edge computing health model to reduce latency, network usage, and cloud costs; test it using the iFogSim simulator; develop a customized wearable device for health parameter collection; implement the model over hardware; and study dew computing efficacy in a health scenario.',
      'Hierarchical topology: body sensors, mobile devices (Edge), Area Gateway (Fog), ISP Gateway (Fog), and Cloud Datacenter.',
      'Module placement: the Client Module always sits on Mobile (Edge). Data Filtering, Data Processing, and the Event Handler sit at the Area Gateway (Fog) in the fog-based model, or at the Cloud in the cloud-based model. The Confirmatory module always sits at the Cloud.',
      'Performance results: the fog-based model has fixed, lower latency since its modules run at the Area Gateway; the cloud-based model has higher latency. Fog also achieves very low network usage since only positive cases reach the cloud, and lower cost since only limited resources incur cloud charges.',
      'Hardware components: a customized BP and pulse meter (9600 baud rate, ASCII output), an ADXL345 accelerometer capturing X, Y, Z axes, a NodeMCU ESP8266 CP2102 board, and a Raspberry Pi 3 acting as the fog device (64-bit, 1GB RAM, WiFi, Bluetooth).',
      'Data pipeline: extract accelerometer magnitude via A = sqrt(x\u00b2 + y\u00b2 + z\u00b2), apply 5-point smoothing to reduce noise, extract features (max/min/mean amplitude, standard deviation, time-domain and frequency-domain energy), then classify with a K-Nearest Neighbor classifier using normalized features and K = 3, chosen via 5-fold cross validation.',
      'A demonstration-only cardiac alarm logic fires when p \u2265 170 (BPM), s \u2265 180 (systolic), and d \u2265 120 (diastolic) are all met — noted as having no real medical or clinical significance.',
    ],
  },
  {
    heading: '16. Dew Computing',
    items: [
      'Definition: an on-premises computer software-hardware organization paradigm within the cloud computing environment, where the on-premises computer provides functionality independent of cloud services while still collaborating with them.',
      'Goal: fully realize the potential of both on-premises computers and cloud services.',
      'Compared to pure Cloud or Cloud-Fog-Edge deployments, Dew-based models optimize on-premise resource utilization, rely mainly on local connectivity, achieve high uptime, and need low bandwidth with low latency.',
    ],
  },
];

const questions: Question[] = [
  { question: 'What is the approximate deployment date for 5G networks?', options: ['1990s', '2000s', '2010s', '2020s'], answer: 3 },
  { question: 'What is the theoretical download speed of 5G networks?', options: ['1 Gbit/s', '2 kbit/s', '10 Gbit/s', '56 Mbit/s'], answer: 2 },
  { question: 'What is the latency of 5G networks?', options: ['629 ms', '212 ms', '60-98 ms', '< 1 ms'], answer: 3 },
  { question: '1G networks delivered which type of communication?', options: ['Digital voice', 'Analog voice', 'Mobile data', 'Mobile broadband'], answer: 1 },
  { question: 'Which generation introduced digital voice (CDMA)?', options: ['1G', '2G', '3G', '4G'], answer: 1 },
  { question: '3G networks brought which capability?', options: ['Analog voice', 'Digital voice', 'Mobile data', 'Mobile broadband'], answer: 2 },
  { question: '4G LTE ushered in the era of:', options: ['Analog voice', 'Digital voice', 'Mobile data', 'Mobile broadband'], answer: 3 },
  { question: 'What is the theoretical download speed of 4G LTE?', options: ['2 kbit/s', '384 kbit/s', '56 Mbit/s', '1 Gbit/s'], answer: 3 },
  { question: 'What is the latency of 4G networks?', options: ['< 1 ms', '60-98 ms', '212 ms', '629 ms'], answer: 1 },
  { question: '5G is designed for which key characteristic?', options: ['Backward compatibility only', 'Forward compatibility', 'Analog communication', 'Limited connectivity'], answer: 1 },
  { question: 'Enhanced Mobile Broadband (eMBB) includes which applications?', options: ['Smart grids and autonomous vehicles', 'VR, AR, and enterprise collaboration', 'Smart agriculture and smart cities', 'Remote patient monitoring'], answer: 1 },
  { question: 'Massive Machine-Type Communications (mMTC) includes:', options: ['Autonomous vehicles', 'Augmented reality', 'IoT and smart cities', 'Industrial automation'], answer: 2 },
  { question: 'Ultra-Reliable Low-Latency Communications (URLLC) includes:', options: ['Enhanced broadband', 'Smart home', 'Autonomous vehicles and smart grids', 'Enterprise collaboration'], answer: 2 },
  { question: 'Which 5G service category enables remote patient monitoring?', options: ['eMBB', 'mMTC', 'URLLC', 'All of the above'], answer: 2 },
  { question: 'What is the latency of 3G networks?', options: ['< 1 ms', '60 ms', '212 ms', '629 ms'], answer: 2 },
  { question: 'What is the theoretical download speed of 3G?', options: ['2 kbit/s', '384 kbit/s', '56 Mbit/s', '1 Gbit/s'], answer: 2 },
  { question: 'Edge computing in 5G brings cloud capabilities:', options: ['To centralized data centers', 'Near to end users', 'Away from users', 'To satellites only'], answer: 1 },
  { question: 'Which applications are computationally-intensive and require high QoS?', options: ['SMS and voice calls', 'Augmented and Virtual Reality', 'Email services', 'Basic web browsing'], answer: 1 },
  { question: '5G will impact Cloud Computing paradigm in which way?', options: ['No impact', 'Minor impact', 'Big way', 'Negative impact'], answer: 2 },
  { question: 'What is the theoretical download speed of 2G?', options: ['2 kbit/s', '384 kbit/s', '56 Mbit/s', '1 Gbit/s'], answer: 1 },
  { question: 'Which technology is preferred to cater for wireless communication requirements of next-generation applications?', options: ['Mainframe computing', 'Edge computing', 'Quantum computing', 'Grid computing'], answer: 1 },
  { question: '5G enables connectivity for:', options: ['Only smartphones', 'Only machines', 'Everyone and everything including machines, objects, and devices', 'Only IoT devices'], answer: 2 },
  { question: 'Network as a Platform in 5G refers to:', options: ['Only voice services', 'Only data services', 'Enterprise services on network', 'SMS services'], answer: 2 },
  { question: 'Service orchestration in 5G enables:', options: ['Manual configuration', 'Selection of location, QoS, and traffic routing', 'Only network monitoring', 'Only billing services'], answer: 1 },
  { question: 'The "cloudification" of 5G refers to:', options: ['Moving data to cloud only', 'Network "softwarization", NFV, SDN', 'Using only private clouds', 'Eliminating physical networks'], answer: 1 },
  { question: 'Which is NOT a feature of 5G?', options: ['Ultra low latency', 'Massive network capacity', 'Analog voice', 'More reliability'], answer: 2 },
  { question: 'Tactile Internet is associated with which 5G service category?', options: ['eMBB', 'mMTC', 'URLLC', 'None of the above'], answer: 2 },
  { question: 'MCC (Mobile Cloud Computing) offloads data processing from devices to:', options: ['Edge devices only', 'The cloud', 'Fog nodes only', 'Mobile networks'], answer: 1 },
  { question: 'MCC improves reliability because:', options: ['Data is stored locally', 'Data is backed up and stored in the cloud', 'Data is deleted regularly', 'Data is not stored'], answer: 1 },
  { question: 'What is the latency of 1G networks?', options: ['< 1 ms', '60-98 ms', '212 ms', 'None'], answer: 3 },
  { question: 'Which industries will 5G transform through mission-critical communications?', options: ['Entertainment only', 'Infrastructure, vehicles, and medical procedures', 'Education only', 'Retail only'], answer: 1 },
  { question: '5G\u2019s Massive IoT provides connectivity solutions that are:', options: ['Expensive and complex', 'Extremely lean and low-cost', 'High-power and high-bandwidth', 'Centralized only'], answer: 1 },
  { question: '2G introduced which technology for digital voice?', options: ['GSM', 'CDMA', 'LTE', '5G NR'], answer: 1 },
  { question: '3G introduced which technology?', options: ['CDMA2000', 'LTE', '5G NR', 'AMPS'], answer: 0 },
  { question: 'Heterogeneous environment in 5G means supporting:', options: ['Only one type of device', 'Only one network type', 'Diverse end-user equipment, QoS requirements, network types', 'Only smartphones'], answer: 2 },
  { question: 'Who coined the term "cyber-physical systems"?', options: ['Alan Turing', 'Helen Gill', 'John McCarthy', 'Tim Berners-Lee'], answer: 1 },
  { question: 'In which year did the term "cyber-physical systems" emerge?', options: ['1990', '2000', '2006', '2010'], answer: 2 },
  { question: 'CPS is about:', options: ['The union of physical and cyber', 'The intersection of physical and cyber', 'Only physical systems', 'Only cyber systems'], answer: 1 },
  { question: 'CPS combines engineering models from various fields with models of:', options: ['Biology', 'Computer science', 'Mathematics only', 'Physics only'], answer: 1 },
  { question: 'Which is NOT an application of CPS?', options: ['Automotive systems', 'Manufacturing', 'Social media', 'Medical devices'], answer: 2 },
  { question: 'In CPS, physical and software components are:', options: ['Completely separate', 'Deeply intertwined', 'Independent', 'Never connected'], answer: 1 },
  { question: 'CPS involves which approaches?', options: ['Single discipline', 'Transdisciplinary approaches', 'Only mechanical engineering', 'Only computer science'], answer: 1 },
  { question: 'SNSS in CPS context stands for:', options: ['Simple Network Systems', 'Smart Networked Systems and Societies', 'Standard Network Services', 'Secure Network Systems'], answer: 1 },
  { question: 'CPCC stands for:', options: ['Cyber-Physical Cloud Control', 'Cyber-Physical Cloud Computing', 'Cyber-Processing Cloud Computing', 'Centralized Physical Cloud Computing'], answer: 1 },
  { question: 'CPCC can rapidly build, modify and provision CPS composed of:', options: ['Only sensors', 'Only actuators', 'Cloud computing based sensor, processing, control, and data services', 'Only data services'], answer: 2 },
  { question: 'Which is NOT a benefit of CPCC?', options: ['Efficient use of resources', 'Modular composition', 'Increased hardware cost', 'Rapid development and scalability'], answer: 2 },
  { question: 'CPCC provides:', options: ['Fixed architecture', 'Smart adaptation to environment at every scale', 'Non-scalable solutions', 'Only centralized control'], answer: 1 },
  { question: 'CPS can be viewed as:', options: ['Computing as a virtual act', 'Computing as a physical act', 'Computing as a theoretical act', 'Computing as a mathematical act'], answer: 1 },
  { question: 'Sensors in CPS transfer sensing data into:', options: ['Physical world', 'Cyberspace', 'Vacuum', 'Outer space'], answer: 1 },
  { question: 'Which is a typical example of CPS?', options: ['Social media platform', 'Smart grid', 'Email service', 'Video streaming'], answer: 1 },
  { question: 'CPS applications include all EXCEPT:', options: ['Robotic surgery', 'Air traffic control', 'Online shopping', 'Collision avoidance'], answer: 2 },
  { question: 'The NIST report on CPCC was published in:', options: ['2006', '2010', '2013', '2015'], answer: 2 },
  { question: 'CPS uses which components to link computational systems to physical world?', options: ['Sensors and actuators', 'Only sensors', 'Only actuators', 'Only processors'], answer: 0 },
  { question: 'Cloud Computing Services provide a flexible platform for:', options: ['Data storage only', 'Realizing goals of CPS', 'Social networking', 'Gaming'], answer: 1 },
  { question: 'Which is NOT a characteristic of CPS?', options: ['Multi-disciplinary', 'Physically-aware', 'Single behavioral modality', 'Deeply intertwined components'], answer: 2 },
  { question: 'CPS includes elements of:', options: ['Only cybernetics', 'Cyber + Physical + Computation + Dynamics + Communication + Security + Safety', 'Only computation', 'Only communication'], answer: 1 },
  { question: 'Which area does CPS NOT typically apply to?', options: ['Energy conservation', 'Traffic control', 'E-commerce websites', 'Process control'], answer: 2 },
  { question: 'The Cloud-Edge Computing Framework for CPS is designed for:', options: ['Only cloud services', 'Cyber-Physical-Social Services', 'Only edge services', 'Standalone systems'], answer: 1 },
  { question: 'CPS architecture based on cloud enables:', options: ['Isolation of components', 'Integration and coordination', 'Reduction in functionality', 'Centralization only'], answer: 1 },
  { question: 'The goal of CPS includes:', options: ['Increasing complexity only', 'Increasing adaptability, autonomy, efficiency, functionality, reliability, safety, and usability', 'Reducing all capabilities', 'Eliminating physical components'], answer: 1 },
  { question: 'Spatial data describes objects with location on or near:', options: ['The moon', 'The surface of the earth', 'Mars', 'Outer space'], answer: 1 },
  { question: 'Geospatial data combines location, attribute, and:', options: ['Color information', 'Temporal information', 'Sound information', 'Smell information'], answer: 1 },
  { question: 'Spatial analysis lends new perspectives to:', options: ['Entertainment only', 'Any decision-making', 'Only scientific research', 'Only government work'], answer: 1 },
  { question: 'Which is NOT a use of spatial analysis?', options: ['Crime studies', 'Drought analysis', 'Software development', 'Finding optimal paths'], answer: 2 },
  { question: 'Spatial Cloud Computing refers to:', options: ['Any cloud computing service', 'Cloud computing driven by geospatial sciences', 'Only weather data processing', 'Basic storage services'], answer: 1 },
  { question: 'Spatial cloud supports shared resource pooling for:', options: ['Individual users only', 'Organizations with common or shared goals', 'Only government agencies', 'Only private companies'], answer: 1 },
  { question: 'Which is NOT an advantage of Spatial Cloud?', options: ['Scalability', 'Cost optimized', 'Requires physical infrastructure purchase', 'Reliability'], answer: 2 },
  { question: 'Trajectory data is generated by:', options: ['Stationary objects', 'Moving objects in geographical spaces', 'Static sensors', 'Only vehicles'], answer: 1 },
  { question: 'A spatial trajectory is represented by:', options: ['Only latitude', 'Only longitude', 'Series of chronologically ordered points', 'Only time stamps'], answer: 2 },
  { question: 'Semantic trajectory includes:', options: ['Only GPS coordinates', 'Stay-point information and activities performed', 'Only time information', 'Only speed data'], answer: 1 },
  { question: 'Traj-Cloud is used for analyzing:', options: ['Weather patterns', 'Urban dynamics', 'Ocean currents', 'Space exploration'], answer: 1 },
  { question: 'TS1 in Traj-Cloud provides:', options: ['Map-matching service', 'Query service', 'Trajectory data indexing service', 'Data visualization'], answer: 2 },
  { question: 'TS2 in Traj-Cloud provides:', options: ['Data indexing service', 'Trajectory map-matching service', 'Query service', 'Data visualization'], answer: 1 },
  { question: 'TS3 in Traj-Cloud provides:', options: ['Data indexing service', 'Map-matching service', 'Trajectory query service', 'Data cleaning service'], answer: 2 },
  { question: 'Which GCP component is used for Trajectory data indexing?', options: ['Google Compute Engine', 'Google BigQuery and Cloud SQL', 'Google Cloud Storage', 'Google Cloud Functions'], answer: 1 },
  { question: 'TS2 in Traj-Cloud uses which GCP component?', options: ['Google BigQuery', 'Google Compute Engine', 'Cloud SQL', 'Cloud Functions'], answer: 1 },
  { question: 'Mobility trace analysis has significant role in:', options: ['Social networking', 'Mapping urban dynamics', 'Video streaming', 'Online shopping'], answer: 1 },
  { question: 'Intelligent Transportation System requires:', options: ['Ignoring mobility analytics', 'Efficient mobility analytics', 'Only static data', 'No data analysis'], answer: 1 },
  { question: 'Spatial cloud helps minimize:', options: ['Data accuracy', 'Service-waiting time and service-provisioning time', 'User satisfaction', 'Service quality'], answer: 1 },
  { question: 'Location-based services include:', options: ['Email services', 'Food delivery and medical emergency', 'Video conferencing', 'File sharing'], answer: 1 },
  { question: 'Fog computing takes cloud closer to:', options: ['End users only', 'Data producing sensor devices', 'Central data centers', 'Satellites'], answer: 1 },
  { question: 'Which devices act as fog nodes?', options: ['Only smartphones', 'Routers, servers, switches', 'Only sensors', 'Only cloud servers'], answer: 1 },
  { question: 'Which simulator is used for testing fog models?', options: ['CloudSim', 'iFogSim', 'NS2', 'OMNeT++'], answer: 1 },
  { question: 'Which is NOT a limitation of cloud computing?', options: ['Latency issues', 'Large volume of data', 'Unlimited bandwidth', 'Bandwidth requirements'], answer: 2 },
  { question: 'IoT device limitations include:', options: ['Unlimited processing', 'Unlimited storage', 'Limited processing and storage', 'Unlimited power'], answer: 2 },
  { question: 'Fog-Edge computing provides:', options: ['Higher latency', 'Reduced latency', 'More network congestion', 'Higher cloud costs'], answer: 1 },
  { question: 'The first objective of IoHT case study is:', options: ['Increase cloud costs', 'Design Fog-Edge computing health model to reduce latency, network usage, and cloud costs', 'Increase latency', 'Remove cloud computing'], answer: 1 },
  { question: 'In the hierarchical topology, Area Gateway is at which level?', options: ['Cloud level', 'Fog level', 'Edge level', 'Sensor level'], answer: 1 },
  { question: 'In fog-based model, Data Filtering Module is placed at:', options: ['Cloud', 'Area Gateway (Fog)', 'Mobile (Edge)', 'ISP Gateway'], answer: 1 },
  { question: 'In fog-based model, Client Module is placed at:', options: ['Cloud', 'Area Gateway', 'Mobile (Edge)', 'ISP Gateway'], answer: 2 },
  { question: 'In cloud-based model, all modules except which are at cloud?', options: ['Client Module', 'Data Filtering', 'Data Processing', 'Event Handler'], answer: 0 },
  { question: 'Latency in fog-based model is fixed because:', options: ['Modules are at cloud', 'Modules are at Area Gateway', 'No modules exist', 'Only cloud is used'], answer: 1 },
  { question: 'Fog-based model has lower network usage because:', options: ['All modules are at cloud', 'Only positive cases access cloud', 'No data is transmitted', 'Network is disconnected'], answer: 1 },
  { question: 'Which device is used as Fog Device in hardware implementation?', options: ['Arduino Uno', 'Raspberry Pi 3', 'NodeMCU', 'Intel i7'], answer: 1 },
  { question: 'What is the baud rate of the customized BP and Pulsemeter?', options: ['4800', '9600', '19200', '38400'], answer: 1 },
  { question: 'The accelerometer used in hardware implementation is:', options: ['MPU6050', 'ADXL345', 'BMA280', 'LIS3DH'], answer: 1 },
  { question: 'KNN classifier uses K = _____ based on 5-fold cross validation.', options: ['1', '3', '5', '7'], answer: 1 },
  { question: 'HeartAttackAlarm becomes true when:', options: ['p \u2265 170, s \u2265 180, d \u2265 120', 'p \u2265 100, s \u2265 120, d \u2265 80', 'p \u2265 200, s \u2265 200, d \u2265 140', 'p \u2265 150, s \u2265 160, d \u2265 100'], answer: 0 },
  { question: 'Dew computing is:', options: ['Cloud service only', 'Edge service only', 'On-premises software-hardware organization paradigm', 'Only hardware solution'], answer: 2 },
  { question: 'Which feature is optimized in Dew-based deployment model?', options: ['On-premise resource utilization', 'Connectivity requirements', 'Latency', 'All of the above'], answer: 3 },
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

/* ---------------- Module 12 page ---------------- */

export default function Module12Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 12 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Cloud Computing in the 5G Era, CPS, Spatial Cloud &amp; IoHT
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