import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BannerImage from "../../sub-components/banner-image";
import {
  GitBranch,
  Workflow,
  Cpu,
  LineChart,
  FileText,
  Users,
  Brain,
  RefreshCw,
  Globe,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Settings,
  Play
} from "lucide-react";

const tasreeConfig = {
  name: "Tasree3",
  tagline: "AI-Assisted Process Mining & Process Engineering",
  hero: {
    title: "Design Smarter. Optimize Faster.",
    titleHighlight: "Transform Continuously.",
    description: "Tasree3 is an AI-assisted process mining and process engineering platform that helps organizations design, analyze, optimize, and improve business processes through intelligent workflow discovery, visual modeling, performance insights, and AI-powered recommendations.",
    exploreLink: "#features",
    demoLink: "#demo",
    badges: [
      { text: "AI-Powered BPM Platform", color: "from-cyan-500 to-blue-500" },
      { text: "Data-Driven", color: "from-indigo-500 to-blue-500" },
      { text: "Secure", color: "from-emerald-500 to-teal-500" },
      { text: "Enterprise-Ready", color: "from-purple-500 to-pink-500" }
    ],
    coverImage: "/assets/tasree3_cover_banner.png",
    videoUrl: "/assets/tasree.mp4"
  },
  whatIs: {
    title: "What is Tasree3?",
    description: "Tasree3 is a next-generation process excellence platform that enables organizations to understand how their processes actually work, model improved workflows, analyze performance, and apply AI-driven recommendations for continuous operational improvement."
  },
  features: {
    title: "Everything You Need for Modern Process Management",
    subtitle: "Streamline workflows, discover bottlenecks, and drive continuous improvement.",
    items: [
      {
        icon: GitBranch,
        title: "Automatic Process Discovery",
        description: "Generate workflows from operational data automatically.",
        color: "from-cyan-500/10 to-blue-500/10"
      },
      {
        icon: Workflow,
        title: "Visual Process Modeling",
        description: "Build process diagrams with intuitive drag-and-drop tools.",
        color: "from-blue-500/10 to-indigo-500/10"
      },
      {
        icon: Cpu,
        title: "AI-Powered Optimization",
        description: "Get AI recommendations to improve workflows and reduce cycle times.",
        color: "from-purple-500/10 to-pink-500/10"
      },
      {
        icon: LineChart,
        title: "Performance Insights",
        description: "Identify bottlenecks, delays, and process gaps with real-time analytics.",
        color: "from-cyan-500/10 to-teal-500/10"
      },
      {
        icon: FileText,
        title: "Instant Reports",
        description: "Generate complete, audit-ready process reports in seconds.",
        color: "from-indigo-500/10 to-purple-500/10"
      },
      {
        icon: Users,
        title: "Real-Time Collaboration",
        description: "Enable teams to design and collaborate on processes across departments.",
        color: "from-emerald-500/10 to-green-500/10"
      },
      {
        icon: Brain,
        title: "Smart AI Layer",
        description: "Use predictive insights to make smarter operational decisions.",
        color: "from-violet-500/10 to-fuchsia-500/10"
      },
      {
        icon: RefreshCw,
        title: "Continuous Improvement",
        description: "Discover, analyze, optimize, and deploy improvements in an ongoing lifecycle.",
        color: "from-amber-500/10 to-orange-500/10"
      },
      {
        icon: Globe,
        title: "Regional Readiness",
        description: "Full support for Arabic, RTL layouts, and regional business requirements.",
        color: "from-teal-500/10 to-emerald-500/10"
      }
    ]
  },
  industries: [
    { name: "Manufacturing", desc: "Streamline production and supply chain processes." },
    { name: "Banking & Finance", desc: "Optimize approvals, compliance, and risk management." },
    { name: "Healthcare", desc: "Enhance patient care and operational efficiency." },
    { name: "Government", desc: "Improve transparency and service delivery with process control." },
    { name: "Enterprise", desc: "Drive digital transformation and operational excellence." },
    { name: "And Many More", desc: "Applicable across industries and business functions." }
  ],
  outcomes: [
    { title: "Faster Time to Model", value: "70%", desc: "Reduce process modeling time by up to 70%" },
    { title: "Improved Efficiency", value: "Continuous", desc: "Identify inefficiencies and optimize processes" },
    { title: "End-to-End Visibility", value: "100%", desc: "Get full transparency across all workflows" },
    { title: "Risk & Compliance Assured", value: "Secure", desc: "Ensure compliance with strong automated governance" },
    { title: "Data-Backed Decisions", value: "Smarter", desc: "Make decisions powered by real-time process mining" }
  ],
  benefits: [
    "All-in-one platform for process mining, modeling, and AI insights",
    "Faster process discovery and decision-making",
    "Reduced operational complexity and manual analysis",
    "Improved productivity through workflow optimization",
    "Lower cost compared to using multiple disconnected tools",
    "Better visibility into bottlenecks, delays, and inefficiencies",
    "Supports continuous improvement across departments",
    "Scalable for SMEs, enterprises, and government organizations"
  ],
  stats: [
    { value: "70%", label: "Modeling Speedup" },
    { value: "100%", label: "Process Visibility" },
    { value: "Zero", label: "Manual Mapping Errors" },
    { value: "Continuous", label: "Optimization Cycle" }
  ]
};

export default function Tasree3() {
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
    data.append("Product", "Tasree3 Demo Request");
    data.append("Message", "Requested a demo for Tasree3 EPC BPM.");

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
    <div className="bg-[#020813] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white overflow-hidden">
      <BannerImage />

      {/* Breadcrumb & Premium Header Section */}
      <div className="relative border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12 px-6 sm:px-12 lg:px-16 text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            <Link to="/" className="hover:text-cyan-405 transition-colors">Home</Link>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-slate-500">Solutions</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-cyan-400">{tasreeConfig.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight mb-2">
                {tasreeConfig.name}
              </h1>
              <p className="text-slate-400 text-[14px] lg:text-[18px] font-normal max-w-2xl mt-2">
                {tasreeConfig.tagline}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                AI Process Intelligence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cyan/Blue Neon Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tasreeConfig.hero.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-md`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        <h1 className="text-5xl sm:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl leading-tight">
          {tasreeConfig.hero.title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            {tasreeConfig.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed">
          {tasreeConfig.hero.description}
        </p>

        {/* Dynamic Cover Image Banner */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl mb-12">
          <img
            src={tasreeConfig.hero.coverImage}
            alt="Tasree3 Process Mining Cover"
            className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 z-10">
          <a
            href={tasreeConfig.hero.exploreLink}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] text-white"
          >
            Explore Capabilities
          </a>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-300 text-slate-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400" /> Watch Video
          </button>
        </div>

        {/* CSS-only Process Model Simulator */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-md text-left font-sans mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Visual Process Modeling Simulator</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold">
              AI-Powered BPM
            </div>
          </div>

          {/* Connected Diagram simulation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center py-6">

            {/* Node 1 */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative shadow-md">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">Step 1</span>
              <p className="text-sm font-bold text-white">Order Received</p>
              <div className="text-[10px] text-slate-500 mt-2">Trigger Event</div>
              <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-cyan-500 text-xl font-black">➔</div>
            </div>

            {/* Node 2 */}
            <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-xl relative shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">Step 2 (AI Decision)</span>
              <p className="text-sm font-bold text-white">Validate Order</p>
              <div className="text-[9px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full inline-block mt-2 font-mono">Auto Match: 99.8%</div>
              <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-cyan-500 text-xl font-black">➔</div>
            </div>

            {/* Node 3 */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl relative shadow-md">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">Step 3</span>
              <p className="text-sm font-bold text-white">Check Inventory</p>
              <div className="text-[10px] text-slate-500 mt-2">API Dispatch</div>
              <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-cyan-500 text-xl font-black">➔</div>
            </div>

            {/* Node 4 */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl shadow-md">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">End State</span>
              <p className="text-sm font-bold text-white">Order Completed</p>
              <div className="text-[10px] text-emerald-450 mt-2">Process Resolved</div>
            </div>

          </div>

          <div className="mt-4 p-3 bg-slate-900/40 rounded-xl text-center border border-slate-900">
            <span className="text-xs text-slate-400">
              💡 <strong>Process Mining Insight:</strong> AI detected a <strong>24% delay</strong> in manual approvals on Step 2. Auto-optimization enabled.
            </span>
          </div>
        </div>
      </section>

      {/* What is Tasree3 */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/30 border-y border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-2">{tasreeConfig.whatIs.title}</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">Next-Generation Process Excellence</h2>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-3xl">
              {tasreeConfig.whatIs.description}
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/5">
              <Workflow className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-2">Core Features & Services</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{tasreeConfig.features.title}</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">{tasreeConfig.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasreeConfig.features.items.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 border border-slate-800`}>
                  <IconComponent className="w-6 h-6 text-cyan-450 group-hover:text-cyan-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-450 transition-colors">{feat.title}</h3>
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
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-2">Platform Value</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8">Key Benefits of Tasree3</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tasreeConfig.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Core Graphic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-cyan-500/20 flex items-center justify-center bg-slate-900/20 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-950/20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-2xl font-black text-white">T3</span>
                </div>
              </div>

              {/* Orbiting metrics labels */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" /> AI Insights
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-cyan-400" /> Modeling
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-amber-400" /> Mining
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-400" /> Control
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Built For Every Industry */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-2">Industry Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for Every Industry</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasreeConfig.industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{ind.name}</h3>
                <p className="text-slate-400 text-sm">{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* drive outcomes */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/40 border-y border-slate-900">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block mb-2">Operational Impact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Drive Better Outcomes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tasreeConfig.outcomes.map((out, idx) => (
            <div key={idx} className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl text-center">
              <p className="text-2xl font-black text-cyan-400 mb-1">{out.value}</p>
              <p className="text-sm font-bold text-white mb-2">{out.title}</p>
              <p className="text-xs text-slate-500">{out.desc}</p>
            </div>
          ))}
        </div>
      </section>



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
                src={tasreeConfig.hero.videoUrl}
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
