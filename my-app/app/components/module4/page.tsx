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
    heading: '1. Meghamala — IIT Kharagpur\u2019s OpenStack Cloud',
    items: [
      'Meghamala is an initiative by IIT Kharagpur to provide on-demand computational and storage resources to its research community, built on the OpenStack cloud computing platform.',
      'Located at the Computer and Informatics Centre, IIT Kharagpur.',
      'Hardware: Blade servers, SAN (Storage Area Network), NAS (Network Attached Storage).',
    ],
  },
  {
    heading: '2. Services Offered',
    items: [
      'VMs4U (Compute Nodes): provision on-demand VMs for desktop use or running workloads.',
      'VM Configurations — IITKGP_regular: 2 VCPUs, 4 GB RAM, 45 GB ephemeral storage. IITKGP_large: 4 VCPUs, 8 GB RAM, 45 GB ephemeral storage. IITKGP_xLarge: 8 VCPUs, 16 GB RAM, 60 GB ephemeral storage.',
      'Supported Guest OS: Ubuntu 14.04, CentOS 7, Fedora 20.',
      'Storage on the House: persistent storage provided on request.',
      'Meghadoop: a Hadoop cluster available for use.',
    ],
  },
  {
    heading: '3. VM Request Process',
    items: [
      'VMs are for academic purposes only; presence of inappropriate material may lead to immediate VM termination.',
      'Steps: (1) Fill out the VMs4U request form, which generates a PDF. (2) Get a hard copy of the PDF signed. (3) Submit the signed hard copy to the Professor-in-charge of Meghamala.',
    ],
  },
  {
    heading: '4. VM Creation, Access, and Termination',
    items: [
      'Creation is done through the OpenStack dashboard (Horizon) under Project \u2192 Compute \u2192 Instances \u2192 Launch Instance.',
      'Access: Users connect using an X2Go client. Example connection — Host: 10.4.2.38, Login: centos, Port: 22, Session Type: XFCE.',
      'Floating IPs (e.g. 192.164.0.x range) are associated with internal IPs (10.4.0.x range) to reach VMs from outside the private network.',
      'Termination: VMs can be terminated from the OpenStack dashboard via Instances \u2192 Terminate, which permanently deletes the VM.',
    ],
  },
  {
    heading: '5. Microsoft Azure — Overview',
    items: [
      'Azure is a growing collection of integrated cloud services for building, deploying, and managing applications.',
      'Key features: freedom to use any tools/frameworks, hybrid cloud capabilities, and a focus on security, privacy, compliance, and transparency.',
    ],
  },
  {
    heading: '6. Azure Demo — Deploying a Python Web App',
    items: [
      'Prerequisites: install Git and install Python.',
      'Login at https://portal.azure.com, then launch Azure Cloud Shell — a free Bash shell within the portal.',
      'Clone the sample app with git clone, navigate to the sample directory, and run it locally with python main.py; visiting http://localhost:5000 shows "Hello World".',
      'Create a Resource Group (logical container for web apps, databases, storage) and an App Service Plan, which defines location, instance size, scale count (1\u201320), and SKU (Free, Shared, Basic, Standard, Premium).',
      'Create a Web App for hosting space and a URL, e.g. azappshu001.azurewebsites.net, then configure the Python version.',
    ],
  },
  {
    heading: '7. Azure Demo — Deployment via Git',
    items: [
      'Configure Local Git Deployment: App Service supports FTP, local Git, GitHub, and more; a deployment user/password is set up.',
      'Add an Azure remote to the local Git repo and push to it, entering the deployment password when prompted.',
      'To update the app: edit main.py, commit with git commit -am "message", then push with git push azure master.',
      'After redeployment, refreshing the browser shows the new message, e.g. "Welcome to the NPTEL course on Cloud Computing!!"',
    ],
  },
  {
    heading: '8. Google Cloud Platform (GCP) — Overview',
    items: [
      'GCP is a set of modular, cloud-based services to build, test, and deploy applications on Google\u2019s infrastructure.',
      'Runs on the same infrastructure used for Search, YouTube, and Gmail, offering a global network and redundancy.',
      'Lets developers focus on their product via managed services (App Engine, Cloud Datastore), avoiding system administration.',
      'Offers mix-and-match services: VMs (Compute Engine), a managed platform (App Engine), blob/block storage, NoSQL (Datastore), MySQL (Cloud SQL), and Big Data analytics.',
      'Scales to millions of users with auto-scaling, pay-only-for-what-you-use pricing, consistent performance, and a global support ecosystem.',
    ],
  },
  {
    heading: '9. GCP Services Summary',
    items: [
      'Compute: App Engine (PaaS \u2013 focus on code), Compute Engine (IaaS \u2013 raw VMs).',
      'Storage: Cloud Storage (object storage with edge caching), Cloud SQL (MySQL), Datastore (NoSQL).',
      'Others: Google Cloud Endpoints (to scale your app), Google APIs (to integrate Google services).',
    ],
  },
  {
    heading: '10. GCP Example — Hosting a Static Webpage via Cloud Storage',
    items: [
      'Open the Cloud Storage browser in the GCP Console and create a bucket.',
      'Select the bucket, click "more actions" \u2192 Edit configuration.',
      'In the Configure website dialog, specify the Main Page (e.g. index.html) and the 404 (Not Found) Page, or upload the website folder.',
      'The website then goes live.',
    ],
  },
  {
    heading: '11. GCP Example — Building and Deploying a Web App on App Engine',
    items: [
      'Create a new project in the GCP Console (a Cloud Platform project plus an App Engine application), select a region, and choose a preferred programming language such as Python.',
      'Develop locally (e.g. a main.py using webapp2) and create an app.yaml configuration file.',
      'Run the local development server with dev_appserver.py $PWD, and view it in a browser.',
      'Deploy with gcloud app deploy app.yaml --project <project-id>, then view the live app with gcloud app browse.',
      'To update, edit main.py — the development server auto-reloads on change — then redeploy with the same gcloud app deploy command.',
    ],
  },
  {
    heading: '12. Useful GCP Links',
    items: [
      'GCP Developers Portal: cloud.google.com/developers.',
      'Google Developers Global Portal: developers.google.com.',
      'GCP Products (Compute Engine): cloud.google.com/products/compute-engine.',
    ],
  },
];

const questions: Question[] = [
  { question: 'What is the name of IIT Kharagpur\u2019s cloud initiative?', options: ['Azure for Education', 'Meghamala', 'GCP@IITKGP', 'OpenStack Research Cloud'], answer: 1 },
  { question: 'Meghamala is built using which cloud computing platform?', options: ['Microsoft Azure', 'Google Cloud Platform', 'OpenStack', 'VMware vCloud'], answer: 2 },
  { question: 'Where is Meghamala physically located?', options: ['Department of Computer Science', 'Central Library', 'Computer and Informatics Centre, IIT Kharagpur', 'Tata Centre for Technology'], answer: 2 },
  { question: 'Which of the following hardware components are part of Meghamala\u2019s system?', options: ['Only blade servers', 'Only SAN storage', 'Blade servers, SAN storage, and NAS', 'Only NAS'], answer: 2 },
  { question: 'The compute service offered by Meghamala is called _____.', options: ['Storage on the House', 'Meghadoop', 'VMs4U', 'IITKGP_cloud'], answer: 2 },
  { question: 'Which VM configuration has 2 VCPUs and 4 GB RAM?', options: ['IITKGP_large', 'IITKGP_xLarge', 'IITKGP_regular', 'IITKGP_small'], answer: 2 },
  { question: 'What is the ephemeral storage size for the IITKGP_large VM?', options: ['30 GB', '45 GB', '60 GB', '80 GB'], answer: 1 },
  { question: 'How much RAM does the IITKGP_xLarge VM provide?', options: ['4 GB', '8 GB', '16 GB', '32 GB'], answer: 2 },
  { question: 'Which of the following guest operating systems is NOT listed as supported on Meghamala VMs?', options: ['Ubuntu 14.04', 'CentOS 7', 'Fedora 20', 'Windows Server 2016'], answer: 3 },
  { question: 'Persistent storage on Meghamala is provided _____.', options: ['by default to every VM', 'only for the IITKGP_xLarge flavor', 'on request', 'only for Meghadoop users'], answer: 2 },
  { question: 'What is the name of the Hadoop cluster service on Meghamala?', options: ['MeghaHadoop', 'Meghadoop', 'IITKGP_Hadoop', 'OpenStack Hadoop'], answer: 1 },
  { question: 'According to the PDF, when was Meghamala inaugurated?', options: ['April 25, 2015', 'April 30, 2015', 'March 13, 2015', 'May 1, 2015'], answer: 1 },
  { question: 'What type of VM images with GUI were created on Meghamala (as per latest news)?', options: ['Windows images', 'GUI on Meghamala VM images', 'Android images', 'macOS images'], answer: 1 },
  { question: 'The VMs on Meghamala should be used only for _____.', options: ['commercial purposes', 'academic purposes', 'entertainment', 'cryptocurrency mining'], answer: 1 },
  { question: 'What may lead to immediate termination of a VM on Meghamala?', options: ['Using all the allocated RAM', 'Presence of inappropriate material', 'Running a web server', 'Using SSH'], answer: 1 },
  { question: 'What is the first step to request a VM on Meghamala?', options: ['Submit signed hard copy', 'Pay a fee', 'Get hard copy signed after printing the generated PDF', 'Email the professor-in-charge'], answer: 2 },
  { question: 'To whom should the signed hard copy be submitted?', options: ['Head of the Department', 'Director of IIT KGP', 'Professor-in-charge, Meghamala', 'System administrator'], answer: 2 },
  { question: 'Which of the following IP address ranges appears in the PDF as floating IPs?', options: ['10.0.0.0/8', '192.164.0.x', '172.16.0.x', '8.8.8.x'], answer: 1 },
  { question: 'The internal IP addresses of Meghamala instances shown are in which range?', options: ['192.164.0.x', '10.4.0.x', '172.31.0.x', '169.254.0.x'], answer: 1 },
  { question: 'Which client software is shown in the PDF for accessing a Meghamala VM?', options: ['PuTTY', 'VNC Viewer', 'X2Go', 'RDP'], answer: 2 },
  { question: 'In the X2Go session configuration, what is the example session name?', options: ['cloud-meghamala', 'cloud-nptel', 'meghamala-session', 'openstack-vm'], answer: 1 },
  { question: 'What is the example host IP address used to access a VM via X2Go?', options: ['192.164.0.1', '10.4.2.38', '10.4.0.1', '192.168.1.1'], answer: 1 },
  { question: 'What is the example login username for the X2Go session?', options: ['ubuntu', 'root', 'centos', 'meghamala'], answer: 2 },
  { question: 'What SSH port is used in the X2Go example?', options: ['22', '2222', '80', '443'], answer: 0 },
  { question: 'What session type is selected in the X2Go example?', options: ['GNOME', 'KDE', 'XFCE', 'LXDE'], answer: 2 },
  { question: 'Where can a user terminate a VM on Meghamala?', options: ['Only by contacting support', 'From the OpenStack dashboard (Instances \u2192 Terminate)', 'By deleting the local SSH key', 'VM cannot be terminated'], answer: 1 },
  { question: 'Which of the following is NOT a VM flavor offered by Meghamala?', options: ['IITKGP_regular', 'IITKGP_large', 'IITKGP_xLarge', 'IITKGP_ultra'], answer: 3 },
  { question: 'How many VCPUs does the IITKGP_large flavor have?', options: ['2', '4', '8', '16'], answer: 1 },
  { question: 'The ephemeral storage for IITKGP_xLarge is _____.', options: ['45 GB', '60 GB', '80 GB', '100 GB'], answer: 1 },
  { question: 'Which organization set up Meghamala?', options: ['Microsoft Research', 'Google India', 'Indian Institute of Technology, Kharagpur', 'NPTEL'], answer: 2 },
  { question: 'According to the PDF, VMs4U provides compute nodes that can be used as _____.', options: ['only a desktop', 'only for running workloads', 'a desktop or to run workloads', 'a database server only'], answer: 2 },
  { question: 'Which Linux distribution version is explicitly mentioned as a guest OS?', options: ['Ubuntu 16.04', 'Ubuntu 14.04', 'Ubuntu 18.04', 'Ubuntu 20.04'], answer: 1 },
  { question: 'The PDF shows a "Launch Instance" button in which OpenStack dashboard section?', options: ['Project \u2192 Compute \u2192 Instances', 'Admin \u2192 System \u2192 Instances', 'Project \u2192 Network \u2192 Topology', 'Identity \u2192 Projects'], answer: 0 },
  { question: 'What does the PDF say about responsibility for VM contents?', options: ['Meghamala team is fully responsible', 'IIT Kharagpur is fully responsible', 'Neither Meghamala team nor IIT Kharagpur is responsible', 'The user is not responsible'], answer: 2 },
  { question: 'Which of the following is a service offered by Meghamala?', options: ['Managed Kubernetes', 'Storage on the House', 'Serverless functions', 'AI notebooks'], answer: 1 },
  { question: 'The PDF mentions "Blade servers" as part of the hardware. What is another storage component?', options: ['Tape library', 'SAN storage', 'DAS only', 'SSD cache'], answer: 1 },
  { question: 'What is the purpose of "Meghadoop"?', options: ['A database service', 'A Hadoop cluster on Meghamala', 'A VM backup tool', 'A load balancer'], answer: 1 },
  { question: 'According to the news section, when was GUI on Meghamala VM images created?', options: ['April 25, 2015', 'March 13, 2015', 'April 30, 2015', 'May 13, 2015'], answer: 1 },
  { question: 'What is the browser title shown in one of the screenshots?', options: ['OpenStack Dashboard', 'Instances - Mirantis OpenStack Dashboard - Mozilla Firefox', 'Meghamala Control Panel', 'IIT KGP Cloud Portal'], answer: 1 },
  { question: 'The PDF shows a "Terminate" action on instances. What does this do?', options: ['Stops the VM temporarily', 'Suspends the VM', 'Permanently deletes the VM', 'Reboots the VM'], answer: 2 },
  { question: 'Microsoft Azure is described as a growing collection of _____.', options: ['virtual machines only', 'integrated cloud services', 'on-premises servers', 'developer laptops'], answer: 1 },
  { question: 'With Azure, developers get the freedom to build and deploy using _____.', options: ['only Microsoft tools', 'only Visual Studio', 'the tools, applications, and frameworks of their choice', 'only open source tools'], answer: 2 },
  { question: 'According to the PDF, Azure helps protect assets through a focus on security, privacy, compliance, and _____.', options: ['cost', 'transparency', 'speed', 'open source'], answer: 1 },
  { question: 'What is the first prerequisite to complete the Python web app demo on Azure?', options: ['Install Node.js', 'Install Git', 'Install Docker', 'Install .NET'], answer: 1 },
  { question: 'What is the second prerequisite?', options: ['Install Java', 'Install Python', 'Install Ruby', 'Install PHP'], answer: 1 },
  { question: 'Which URL is used to log into the Azure portal?', options: ['https://manage.windowsazure.com', 'https://portal.azure.com', 'https://azure.microsoft.com', 'https://dev.azure.com'], answer: 1 },
  { question: 'What is the Azure Cloud Shell described as?', options: ['A Windows PowerShell only', 'A free Bash shell that can be used directly within the Azure portal', 'A desktop application', 'A mobile app'], answer: 1 },
  { question: 'What command is used to clone the sample app repository?', options: ['git clone (with repo URL)', 'git pull', 'git fork', 'git init'], answer: 0 },
  { question: 'After cloning, you should change to the directory that contains _____.', options: ['the .git folder', 'the sample code', 'the Azure CLI', 'the virtual environment'], answer: 1 },
  { question: 'To run the app locally, which command is used?', options: ['npm start', 'python main.py', 'dotnet run', 'java -jar app.jar'], answer: 1 },
  { question: 'When running locally, the sample app is available at _____.', options: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5000', 'http://localhost:8000'], answer: 2 },
  { question: 'What message does the sample app display locally?', options: ['Welcome to Azure', 'Hello World', 'Cloud Computing Rocks', 'Python on Azure'], answer: 1 },
  { question: 'A resource group in Azure is a logical container for _____.', options: ['only virtual machines', 'only storage accounts', 'resources like web apps, databases, and storage accounts', 'billing only'], answer: 2 },
  { question: 'An App Service plan specifies location, size, scale count, and _____.', options: ['operating system', 'SKU (Free, Shared, Basic, Standard, Premium)', 'programming language', 'database type'], answer: 1 },
  { question: 'Which of the following is NOT a SKU listed for App Service plans?', options: ['Free', 'Shared', 'Enterprise', 'Premium'], answer: 2 },
  { question: 'What does a web app provide in Azure?', options: ['A virtual network', 'Hosting space for code and a URL to view the deployed app', 'A database server', 'A load balancer'], answer: 1 },
  { question: 'In the example, what is the sample web app URL?', options: ['azurewebapp.azurewebsites.net', 'azappshu001.azurewebsites.net', 'mypythonapp.azurewebsites.net', 'testapp.azurewebsites.net'], answer: 1 },
  { question: 'Setting the Python version on Azure Web Apps uses a _____.', options: ['custom Docker container', 'default container provided by the platform', 'virtual machine image', 'Kubernetes pod'], answer: 1 },
  { question: 'Which deployment method is used in the quickstart?', options: ['FTP', 'GitHub', 'Local Git', 'Bitbucket'], answer: 2 },
  { question: 'What do you add to your local Git repository to deploy to Azure?', options: ['A new branch', 'An Azure remote', 'A tag', 'A submodule'], answer: 1 },
  { question: 'When pushing to Azure, you are prompted for the _____.', options: ['Azure portal login password', 'Deployment user password (created earlier)', 'SSH key passphrase', 'App Service plan name'], answer: 1 },
  { question: 'After the first deployment, you edit which file to change the app?', options: ['app.yaml', 'requirements.txt', 'main.py', 'web.config'], answer: 2 },
  { question: 'What command commits your changes in Git?', options: ['git push', 'git add . and git commit -m "message"', 'git merge', 'git rebase'], answer: 1 },
  { question: 'After committing, you push the code changes to Azure using _____.', options: ['git push azure master', 'git push heroku main', 'git deploy azure', 'az webapp push'], answer: 0 },
  { question: 'After redeployment, refreshing the page shows _____.', options: ['Hello World again', 'Welcome to the NPTEL course on Cloud Computing!!', '404 Not Found', 'Azure setup page'], answer: 1 },
  { question: 'Azure Web Apps is described as highly scalable and _____.', options: ['manual-patching', 'self-patching', 'no-patching', 'community-patching'], answer: 1 },
  { question: 'Which of the following is NOT mentioned as a deployment method for Azure Web Apps?', options: ['FTP', 'Local Git', 'GitHub', 'AWS CodeDeploy'], answer: 3 },
  { question: 'The Azure Cloud Shell can be launched from where?', options: ['Only from the command line', 'Within the Azure portal', 'From a separate desktop application', 'From the Windows Store'], answer: 1 },
  { question: 'What is the purpose of creating an App Service plan before creating the web app?', options: ['To define the database schema', 'To specify the location, size, and features of the web server farm', 'To install Python', 'To generate an SSL certificate'], answer: 1 },
  { question: 'In the PDF, after deployment completes and you refresh the page, the new message appears. What is that message?', options: ['Hello Azure!', 'Deployment Successful', 'Welcome to the NPTEL course on Cloud Computing!!', 'Python App is Running'], answer: 2 },
  { question: 'Google Cloud Platform is a set of services that enables developers to _____.', options: ['only store data', 'build, test and deploy applications on Google\u2019s infrastructure', 'run Windows applications', 'manage on-premises servers'], answer: 1 },
  { question: 'Which of the following is a reason to use GCP?', options: ['Run on Google\u2019s infrastructure', 'Focus on your product without system administration', 'Mix and match services', 'All of the above'], answer: 3 },
  { question: 'According to the PDF, GCP runs on the same infrastructure that serves _____.', options: ['Amazon.com', 'Google Search, YouTube, and Gmail', 'Facebook', 'Netflix'], answer: 1 },
  { question: 'What is the managed platform service on GCP that lets you focus only on code?', options: ['Compute Engine', 'App Engine', 'Cloud Functions', 'Kubernetes Engine'], answer: 1 },
  { question: 'Which GCP service provides raw virtual machines?', options: ['App Engine', 'Compute Engine', 'Cloud Run', 'Cloud Storage'], answer: 1 },
  { question: 'Which GCP service offers flexible object storage with global edge caching?', options: ['Cloud SQL', 'Cloud Datastore', 'Cloud Storage', 'Bigtable'], answer: 2 },
  { question: 'Which GCP service provides a NoSQL datastore?', options: ['Cloud SQL', 'Cloud Datastore', 'Cloud Storage', 'BigQuery'], answer: 1 },
  { question: 'Which GCP service provides a MySQL database?', options: ['Cloud SQL', 'Cloud Datastore', 'Bigtable', 'Spanner'], answer: 0 },
  { question: 'GCP managed services such as App Engine or Cloud Datastore give you _____.', options: ['manual scaling', 'auto-scaling', 'no scaling', 'only scale-up'], answer: 1 },
  { question: 'With GCP, you pay only for _____.', options: ['the maximum possible resources', 'what you use', 'a fixed monthly fee', 'the number of users'], answer: 1 },
  { question: 'What is the first step to host a static webpage on GCP Cloud Storage?', options: ['Enable billing', 'Create a bucket', 'Install gcloud CLI', 'Create a Compute Engine VM'], answer: 1 },
  { question: 'After creating a bucket, you click "more actions" and select _____.', options: ['Delete bucket', 'Edit configuration', 'Make public', 'Versioning'], answer: 1 },
  { question: 'In the Configure website dialog, you specify the Main Page and _____.', options: ['the 404 (Not Found) Page', 'the stylesheet', 'the JavaScript file', 'the robots.txt'], answer: 0 },
  { question: 'What does the example hosted webpage display?', options: ['Hello GCP', 'Welcome to Cloud Computing NPTEL Course!', 'Google Cloud Storage', 'Index of /'], answer: 1 },
  { question: 'To build a web app using App Engine, you first create a _____.', options: ['bucket', 'new project (Cloud Platform project and App Engine application)', 'Compute Engine instance', 'Cloud SQL database'], answer: 1 },
  { question: 'When prompted, you select the ____ where you want your App Engine application located.', options: ['zone', 'region', 'availability zone', 'subnet'], answer: 1 },
  { question: 'After selecting the region, you choose your _____.', options: ['machine type', 'preferred programming language', 'instance count', 'storage class'], answer: 1 },
  { question: 'What is the name of the configuration file for App Engine?', options: ['app.yaml', 'app.json', 'config.yaml', 'main.yaml'], answer: 0 },
  { question: 'What command starts the local development server for App Engine?', options: ['gcloud app start', 'dev_appserver.py $PWD', 'python app.py', 'appengine dev'], answer: 1 },
  { question: 'The development server watches for changes in your source files and _____.', options: ['restarts the VM', 'reloads them if necessary', 'automatically deploys to production', 'sends an email alert'], answer: 1 },
  { question: 'What command deploys your app to App Engine?', options: ['gcloud app deploy app.yaml --project <project-id>', 'gcloud compute deploy', 'appcfg.py update', 'git push appengine master'], answer: 0 },
  { question: 'What command is used to view your deployed application?', options: ['gcloud app browse', 'gcloud app open', 'gcloud compute browse', 'gcloud app view'], answer: 0 },
  { question: 'Which of the following is a useful link provided in the PDF for GCP developers?', options: ['https://cloud.google.com/developers', 'https://azure.microsoft.com', 'https://aws.amazon.com', 'https://developers.facebook.com'], answer: 0 },
  { question: 'According to the PDF, GCP\u2019s compute infrastructure gives you consistent CPU, memory, and _____.', options: ['network latency', 'disk performance', 'power consumption', 'cooling efficiency'], answer: 1 },
  { question: 'Which of the following is NOT a service mentioned under GCP storage?', options: ['Cloud Storage', 'Cloud SQL', 'Datastore', 'Cloud Run'], answer: 3 },
  { question: 'The PDF states that GCP provides a global network and edge cache to serve responses _____.', options: ['only in the US', 'rapidly to users across the world', 'with a delay of 1 second', 'only to Google employees'], answer: 1 },
  { question: 'What does "Scale-down" in GCP mean?', options: ['You pay for unused resources', 'Managed services scale down and you don\u2019t pay for computing resources you don\u2019t need', 'You must manually reduce the number of instances', 'Your application stops working'], answer: 1 },
  { question: 'The PDF mentions that GCP has a worldwide community of users, partner ecosystem, and _____.', options: ['free hardware', 'premium support packages', 'guaranteed 100% uptime', 'free training only'], answer: 1 },
  { question: 'Which example in the PDF uses "Cloud Storage browser" and "Create Bucket"?', options: ['Host your web-app using Google App Engine', 'Host your web-page inside Google Cloud Platform', 'Create a Python web app on Azure', 'Create a VM on Meghamala'], answer: 1 },
  { question: 'What is the final message after successfully deploying a web app on App Engine?', options: ['Deployment Failed', 'You have successfully deployed a web-app!', 'Please try again', 'VM is running'], answer: 1 },
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

/* ---------------- Module 4 page ---------------- */

export default function Module4Page({ view }: { view: ViewType }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
          Module 04 — {view.charAt(0).toUpperCase() + view.slice(1)}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">
          Meghamala (OpenStack), Microsoft Azure &amp; Google Cloud Platform
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