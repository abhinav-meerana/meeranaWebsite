import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BannerImage from "../../sub-components/banner-image";
import {
  Inbox,
  FileText,
  Send,
  Workflow,
  Search,
  UserCheck,
  FolderOpen,
  ShieldCheck,
  FileSignature,
  Globe,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  LayoutDashboard,
  Play
} from "lucide-react";

const nazooConfig = {
  name: "Nazoo",
  tagline: "Correspondence & Workflow Management System",
  hero: {
    title: "Smarter Correspondence. Stronger Decisions.",
    titleHighlight: "Zero Chaos.",
    description: "Nazoo empowers organizations to initiate, manage, track, approve, sign, and archive internal and external communications through a secure digital platform.",
    exploreLink: "#features",
    demoLink: "#demo",
    badges: [
      { text: "AI-Powered Correspondence", color: "from-purple-500 to-indigo-500" },
      { text: "10x Faster Processing", color: "from-blue-500 to-indigo-500" },
      { text: "100% Secure & Compliant", color: "from-emerald-500 to-teal-500" },
      { text: "End-to-End Visibility", color: "from-purple-600 to-pink-500" }
    ],
    coverImage: "/assets/nazoo_cover_banner.png",
    videoUrl: "/assets/nazo.mp4"
  },
  whatIs: {
    title: "What is Nazoo?",
    description: "Nazoo is a digital correspondence platform that simplifies how organizations manage official communication, documents, approvals, templates, tracking, and archiving. It supports secure workflows from document initiation to review, approval, e-signature, status tracking, and final storage."
  },
  features: {
    title: "Everything You Need. All in One Intelligent Platform.",
    subtitle: "Automate your official correspondence lifecycle securely.",
    items: [
      {
        icon: Inbox,
        title: "Inbox & Outbox Management",
        description: "Streamline and track incoming and outgoing official correspondence channels.",
        color: "from-blue-500/10 to-indigo-500/10"
      },
      {
        icon: FileText,
        title: "Template Management",
        description: "Standardize letters, circulars, and memos with a built-in pre-approved template library.",
        color: "from-purple-500/10 to-pink-500/10"
      },
      {
        icon: Send,
        title: "Correspondence Initiation",
        description: "Generate and send official documents, memos, and circulars instantly with AI assistance.",
        color: "from-violet-500/10 to-fuchsia-500/10"
      },
      {
        icon: Workflow,
        title: "Workflow Management",
        description: "Automate approval chains, review routing, and task handoffs without manual bottlenecks.",
        color: "from-cyan-500/10 to-teal-500/10"
      },
      {
        icon: Search,
        title: "Search & Filter",
        description: "Find any correspondence in seconds with smart metadata and OCR text search.",
        color: "from-indigo-500/10 to-purple-500/10"
      },
      {
        icon: UserCheck,
        title: "User Management",
        description: "Define custom access permissions, roles, and signature authority levels.",
        color: "from-emerald-500/10 to-green-500/10"
      },
      {
        icon: FolderOpen,
        title: "Document Management",
        description: "Securely store, organize, category index, and archive all communication records.",
        color: "from-pink-500/10 to-rose-500/10"
      },
      {
        icon: ShieldCheck,
        title: "Data Security & Vault",
        description: "Enterprise-grade digital security vaults, encryption keys, and complete audit trail logs.",
        color: "from-red-500/10 to-orange-500/10"
      },
      {
        icon: FileSignature,
        title: "E-Signatures",
        description: "Legally compliant, secure electronic signatures for remote approvals and verification.",
        color: "from-teal-500/10 to-emerald-500/10"
      }
    ]
  },
  useCases: [
    { title: "Corporate Offices", desc: "Standardize executive communications, board resolutions, and external legal letters." },
    { title: "Executive Admin", desc: "Automate review routes and memo distribution across leadership offices." },
    { title: "Document Control", desc: "Keep a centralized index database, audit logs, and version control records." },
    { title: "Legal Compliance", desc: "Track notices, draft contract reviews, and archive regulatory filings." },
    { title: "HR & Finance", desc: "Manage employee notifications, approval circulars, and expense workflows." },
    { title: "Correspondence Desk", desc: "Instantly digitize incoming mail and assign to specific department workflows." }
  ],
  benefits: [
    "Faster and standardized correspondence processing",
    "End-to-end workflow automation for approvals and routing",
    "Centralized document storage, retrieval, and archiving",
    "Improved visibility across communication and document status",
    "Paperless approvals through e-signature workflows",
    "Secure operations with roles, audit trails, and encryption",
    "Scalable platform for growing organizational needs",
    "Flexible deployment: on-premises or cloud"
  ],
  stats: [
    { value: "10x", label: "Faster Processing" },
    { value: "100%", label: "Secure & Compliant" },
    { value: "Zero", label: "Manual Follow-ups" },
    { value: "End-to-End", label: "Process Visibility" }
  ]
};

export default function Nazoo() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("FullName", formData.fullName);
    data.append("Email", formData.email);
    data.append("Phone", formData.phone);
    data.append("Country", "UAE");
    data.append("Product", "Nazoo Demo Request");
    data.append("Message", "Requested a demo for Nazoo Correspondence Management.");

    axios
      .post(`${baseUrl}/allDataInfo/contactformInfo.php`, data)
      .then(() => {
        setIsSubmitted(true);
        setFormData({ fullName: "", email: "", phone: "" });
      })
      .catch((error) => {
        console.error("Error submitting demo request:", error);
        alert("Something went wrong. Please try again or contact us directly at info@meerana.ae.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-[#020512] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
      <BannerImage />

      {/* Breadcrumb & Premium Header Section */}
      <div className="relative border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12 px-6 sm:px-12 lg:px-16 text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            <Link to="/" className="hover:text-purple-405 transition-colors">Home</Link>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-slate-500">Solutions</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-purple-400">{nazooConfig.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight mb-2">
                {nazooConfig.name}
              </h1>
              <p className="text-slate-400 text-[14px] lg:text-[18px] font-normal max-w-2xl mt-2">
                {nazooConfig.tagline}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold uppercase tracking-widest">
                Correspondence Management
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {nazooConfig.hero.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-md`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        <h1 className="text-5xl sm:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl leading-tight">
          {nazooConfig.hero.title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-405 to-blue-450">
            {nazooConfig.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed">
          {nazooConfig.hero.description}
        </p>

        {/* Dynamic Cover Image Banner */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl mb-12">
          <img
            src={nazooConfig.hero.coverImage}
            alt="Nazoo Correspondence Cover"
            className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020512] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 z-10">
          <a
            href={nazooConfig.hero.exploreLink}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] text-white"
          >
            Explore Features
          </a>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-300 text-slate-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400" /> Watch Video
          </button>
        </div>

        {/* CSS-only Correspondence Dashboard Simulator */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-md text-left font-sans mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-500 text-xs font-bold ml-2">Nazoo Workflow Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Live Activity Console</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Sidebar Mock */}
            <div className="hidden lg:block lg:col-span-3 border-r border-slate-850 pr-4 space-y-2">
              <div className="px-3 py-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5" /> Inbox (14)
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Templates
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5" /> Workflows
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" /> Digital Vault
              </div>
            </div>

            {/* Main Mock Console */}
            <div className="lg:col-span-9 space-y-4">

              {/* Metric Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Letters</p>
                  <p className="text-lg font-black text-white">12,842</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 18.5%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">In Progress</p>
                  <p className="text-lg font-black text-white">2,139</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 12.3%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Awaiting Action</p>
                  <p className="text-lg font-black text-white">321</p>
                  <span className="text-[9px] text-red-400 font-bold">↓ 4.5%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Completed</p>
                  <p className="text-lg font-black text-white">10,382</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 22.1%</span>
                </div>
              </div>

              {/* Center Panel (Mock Inbox List) */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block border-b border-slate-900 pb-1.5">
                  Pending Correspondence Approval Queue
                </span>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Official Letter to ADIB Bank</p>
                      <p className="text-[10px] text-slate-500">Initiated by: Executive Admin Office</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">Awaiting E-Sign</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">Inter-Departmental Circular: Q3 Policy</p>
                      <p className="text-[10px] text-slate-500">Initiated by: Legal Compliance</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">Reviewing Route</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* What is Nazoo */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/30 border-y border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">{nazooConfig.whatIs.title}</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Digital Correspondence & Workflow Excellence</h2>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-3xl">
              {nazooConfig.whatIs.description}
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-405 shadow-xl shadow-purple-500/5">
              <LayoutDashboard className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">Core Features & Services</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{nazooConfig.features.title}</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">{nazooConfig.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nazooConfig.features.items.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 border border-slate-800`}>
                  <IconComponent className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-450 transition-colors">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/40 border border-slate-900 rounded-3xl my-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* List panel */}
          <div className="lg:col-span-7">
            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">Platform Value</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8">Key Benefits of Nazoo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nazooConfig.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Core Graphic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-purple-500/20 flex items-center justify-center bg-slate-900/20 shadow-[0_0_50px_rgba(168,85,247,0.05)]">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-950/20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-2xl font-black text-white">N</span>
                </div>
              </div>

              {/* Orbiting metrics labels */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-purple-400" /> Inbox
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-blue-400" /> E-Signs
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-amber-400" /> Routing
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-emerald-400" /> Archives
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">Usage Scenarios</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Target Use Cases</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nazooConfig.useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-slate-400 text-sm">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      {/* <footer className="py-12 border-t border-slate-900/60 bg-slate-950 px-6 sm:px-12 lg:px-16 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Meerana. All rights reserved.</p>
      </footer> */}

      {/* Video Player Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center font-bold"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <video
                src={nazooConfig.hero.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
