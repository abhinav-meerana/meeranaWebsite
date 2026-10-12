import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BannerImage from "../../sub-components/banner-image";
import {
  Video,
  Search,
  TrendingUp,
  Bell,
  Eye,
  Activity,
  ShieldAlert,
  HardHat,
  Users,
  Lock,
  HelpCircle,
  BarChart3,
  Calendar,
  AlertTriangle,
  FolderLock,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Play
} from "lucide-react";

const yisbirConfig = {
  name: "Yisbir",
  tagline: "AI-Powered Video Analytics & Indexing",
  hero: {
    title: "Turn Every Video into",
    titleHighlight: "Intelligent Data.",
    description: "Yisbir uses advanced AI to analyze, index, and understand videos—so you can find anything, faster, unlock insights, and take action in real time.",
    exploreLink: "#construction",
    demoLink: "#demo",
    badges: [
      { text: "AI-Powered", color: "from-purple-500 to-indigo-500" },
      { text: "Scalable", color: "from-blue-500 to-cyan-500" },
      { text: "Secure", color: "from-emerald-500 to-teal-500" },
      { text: "Accurate", color: "from-purple-600 to-pink-500" },
      { text: "Real-Time", color: "from-amber-500 to-orange-500" }
    ],
    mockupImage: "/assets/smart-office-app.png",
    videoUrl: "/assets/yisbir.mp4"
  },
  industries: [
    { name: "Smart Cities" },
    { name: "Retail" },
    { name: "Transportation" },
    { name: "Banking" },
    { name: "Manufacturing" },
    { name: "Healthcare" },
    { name: "Education" },
    { name: "Energy" },
    { name: "Hospitality" }
  ],
  whyYisbir: {
    title: "See More. Know More. Act Faster.",
    description: "Yisbir converts your videos into searchable, actionable intelligence with AI that works for any industry and every use case.",
    features: [
      {
        icon: Video,
        title: "AI Video Indexing",
        description: "Automatically index videos by objects, people, actions, locations, and more."
      },
      {
        icon: Search,
        title: "Smart Search",
        description: "Find any moment instantly with natural language search."
      },
      {
        icon: TrendingUp,
        title: "Actionable Insights",
        description: "AI-driven analytics and dashboards that help you make smarter decisions."
      },
      {
        icon: Bell,
        title: "Real-Time Alerts",
        description: "Detect events, anomalies, and get notified in real time."
      }
    ]
  },
  capabilities: {
    title: "Everything You Need from Your Videos",
    items: [
      { title: "Object & Motion Detection", description: "Detect and track objects, people, vehicles, and activities." },
      { title: "Facial Recognition", description: "Identify and match faces across cameras in real time." },
      { title: "Video Summarization", description: "AI creates short summaries of long videos automatically." },
      { title: "Metadata Extraction", description: "Extract valuable metadata including text, license plates, logos, and more." },
      { title: "Scene Change Detection", description: "Automatically detect scene changes and key moments." },
      { title: "Cross-Camera Search", description: "Search across multiple cameras and locations in seconds." }
    ]
  },
  constructionModule: {
    title: "Yisbir for Construction & Infrastructure",
    subtitle: "AI-Powered Construction Site Intelligence Platform",
    tagline: "Transforming CCTV Cameras into Safety, Compliance & Operational Intelligence Tools",
    benefits: [
      "Improve Worker Safety",
      "Strengthen HSE Compliance",
      "Reduce Site Risks",
      "Enhance Security",
      "Accelerate Incident Investigations",
      "Improve Project Visibility"
    ],
    detections: [
      { name: "Missing Safety Helmets", desc: "Identify workers without required head protection." },
      { name: "Missing Safety Vests", desc: "Detect PPE violations in active work zones." },
      { name: "Unsafe Work Practices", desc: "Monitor risky behavior and unsafe site activity." },
      { name: "Restricted Zone Entry", desc: "Alert teams when workers enter hazardous areas." },
      { name: "Fall & Incident Detection", desc: "Detect falls, accidents, and emergencies." },
      { name: "Workers in Hazardous Areas", desc: "Track workers near hazards and danger zones." }
    ]
  },
  securityModule: {
    title: "Site Security & Asset Protection",
    subtitle: "Protect people, equipment & project assets with AI intelligence",
    columns: [
      {
        title: "Detect Threats",
        items: ["Unauthorized Site Access", "Intrusions After-Hours", "Perimeter Breaches", "Suspicious Behavior & Vandalism"]
      },
      {
        title: "Monitor Areas",
        items: ["Entry & Exit Gates", "Storage Areas & Equipment Yards", "Material Warehouses", "Temporary Worker Camps"]
      },
      {
        title: "Protect Assets",
        items: ["Equipment & Material Theft", "Vehicle Movement Anomalies", "Enhanced Access Control", "Improved Site Visibility"]
      }
    ]
  },
  investigations: {
    title: "Smart Investigations",
    subtitle: "Find. Verify. Act.",
    description: "AI-powered search across live & recorded video to investigate any incident in seconds.",
    searchTypes: [
      { title: "Search by Person Attributes", desc: "Clothing color, helmet color, vest color, gender, etc." },
      { title: "Search by Vehicle Details", desc: "Vehicle type, color, license plate number, etc." },
      { title: "Search by Location", desc: "Select any zone, gate, area, or camera." },
      { title: "Search by Date & Time", desc: "Find exact moments across timelines." }
    ]
  },
  stats: [
    { value: "99.2%", label: "AI Detection Accuracy" },
    { value: "10M+", label: "Hours of Videos Processed" },
    { value: "500+", label: "Cameras Supported" },
    { value: "24/7", label: "Real-Time Processing" }
  ]
};

export default function Yisbir() {
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
    data.append("Product", "Yisbir Demo Request");
    data.append("Message", "Requested a demo for Yisbir Video Intelligence.");

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
    <div className="bg-[#030712] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
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
            <span className="text-purple-400">{yisbirConfig.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight mb-2">
                {yisbirConfig.name}
              </h1>
              <p className="text-slate-400 text-[14px] lg:text-[18px] font-normal max-w-2xl mt-2">
                {yisbirConfig.tagline}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold uppercase tracking-widest">
                Video Analytics Solution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Purple/Indigo Glow Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {yisbirConfig.hero.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-md`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        <h1 className="text-5xl sm:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl leading-tight">
          {yisbirConfig.hero.title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
            {yisbirConfig.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed">
          {yisbirConfig.hero.description}
        </p>

        {/* Main Cover Banner */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl mb-12">
          <img
            src="/assets/yisbir_cover_banner.png"
            alt="Yisbir Site Intelligence Cover"
            className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 z-10">
          <a
            href={yisbirConfig.hero.exploreLink}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] text-white"
          >
            Explore Solutions
          </a>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-300 text-slate-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400" /> Watch Video
          </button>
        </div>

        {/* CSS-only Yisbir Dashboard Simulation */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-md text-left font-sans mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-500 text-xs font-bold ml-2">Yisbir Video AI Console v2.4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Live System Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Sidebar Mock */}
            <div className="hidden lg:block lg:col-span-3 border-r border-slate-850 pr-4 space-y-2">
              <div className="px-3 py-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-lg">
                🎥 Video Streams
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer">
                🔍 Smart Search
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer">
                📊 Analytics Reports
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer">
                🚨 Real-time Alerts
              </div>
              <div className="px-3 py-2 text-slate-400 text-xs font-semibold hover:bg-slate-900 rounded-lg transition-colors cursor-pointer">
                ⚙️ Admin Panel
              </div>
            </div>

            {/* Main Console Mock */}
            <div className="lg:col-span-9 space-y-4">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-550 uppercase font-bold">Total Videos</p>
                  <p className="text-lg font-black text-white">24,331</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 12.5%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-550 uppercase font-bold">Total Hours</p>
                  <p className="text-lg font-black text-white">8,432</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 18.7%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-550 uppercase font-bold">Events Detected</p>
                  <p className="text-lg font-black text-white">68,642</p>
                  <span className="text-[9px] text-purple-400 font-bold">↑ 23.4%</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <p className="text-[10px] text-slate-550 uppercase font-bold">AI Accuracy</p>
                  <p className="text-lg font-black text-white">98.6%</p>
                  <span className="text-[9px] text-emerald-400 font-bold">↑ 2.4%</span>
                </div>
              </div>

              {/* Feed & Stream Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Simulated Camera Feed */}
                <div className="md:col-span-2 relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex items-center justify-center">
                  {/* Bounding box overlays */}
                  <div className="absolute top-8 left-12 w-24 h-32 border border-emerald-400 rounded shadow-[0_0_8px_rgba(52,211,153,0.35)] flex items-center justify-center overflow-hidden">
                    <span className="absolute -top-5 left-0 px-1 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded">Person 99.2%</span>
                    {/* SVG Worker */}
                    <svg viewBox="0 0 100 150" className="w-20 h-28 opacity-85">
                      <path d="M30 45 C30 35, 70 35, 70 45 Z" fill="#FBBF24" />
                      <rect x="25" y="44" width="50" height="4" rx="2" fill="#FBBF24" />
                      <circle cx="50" cy="58" r="10" fill="#FFD2C4" />
                      <path d="M35 70 L65 70 L75 125 L25 125 Z" fill="#F97316" />
                      <rect x="42" y="70" width="4" height="55" fill="#E2E8F0" />
                      <rect x="54" y="70" width="4" height="55" fill="#E2E8F0" />
                      <rect x="25" y="88" width="50" height="6" fill="#E2E8F0" />
                    </svg>
                  </div>
                  <div className="absolute bottom-8 right-16 w-28 h-20 border border-purple-400 rounded shadow-[0_0_8px_rgba(168,85,247,0.35)] flex items-center justify-center overflow-hidden">
                    <span className="absolute -top-5 left-0 px-1 py-0.5 bg-purple-500 text-white text-[9px] font-black uppercase rounded">Vehicle 95.8%</span>
                    {/* SVG Vehicle */}
                    <svg viewBox="0 0 150 100" className="w-24 h-16 opacity-85">
                      <path d="M10 50 L80 50 L95 25 L130 25 L140 50 L140 75 L10 75 Z" fill="#4B5563" />
                      <path d="M82 48 L93 28 L115 28 L115 48 Z" fill="#93C5FD" />
                      <rect x="118" y="28" width="10" height="20" fill="#93C5FD" rx="1" />
                      <circle cx="35" cy="75" r="12" fill="#111827" />
                      <circle cx="35" cy="75" r="5" fill="#9CA3AF" />
                      <circle cx="115" cy="75" r="12" fill="#111827" />
                      <circle cx="115" cy="75" r="5" fill="#9CA3AF" />
                    </svg>
                  </div>

                  {/* Grid HUD Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="absolute bottom-3 left-3 text-slate-400 text-[10px] bg-slate-950/80 px-2 py-1 rounded font-mono border border-slate-850">
                    Camera_04_HSE_Zone
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600/10 border border-red-500/30 px-2 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-red-400 text-[9px] font-black uppercase tracking-wider">Rec</span>
                  </div>

                  {/* Background Mock Video Scene Illustration */}
                  <div className="w-full h-full bg-slate-900/40 flex flex-col items-center justify-center p-8 text-center text-slate-650">
                    <Video className="w-10 h-10 text-slate-700 mb-2" />
                    <span className="text-[11px] font-mono">Simulating Active Stream Video Indexing...</span>
                  </div>
                </div>

                {/* Activity Feed Widget */}
                <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2 border-b border-slate-900 pb-1.5">
                      Recent Activity
                    </span>
                    <div className="space-y-2.5">
                      <div className="flex gap-2 items-start text-xs border-b border-slate-900 pb-2">
                        <span className="text-amber-400 mt-0.5">⚠️</span>
                        <div>
                          <p className="text-slate-200 font-bold">Unsafe Work Practice</p>
                          <p className="text-[10px] text-slate-500">Camera 03 • 2m ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start text-xs border-b border-slate-900 pb-2">
                        <span className="text-purple-400 mt-0.5">ℹ️</span>
                        <div>
                          <p className="text-slate-200 font-bold">PPE Violation Alert</p>
                          <p className="text-[10px] text-slate-500">Camera 01 • 5m ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start text-xs">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <div>
                          <p className="text-slate-200 font-bold">Perimeter Secure</p>
                          <p className="text-[10px] text-slate-500">Gate Access • 12m ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center font-bold">
                    Updated real-time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Ribbon */}
      <section className="py-10 border-y border-slate-900 bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            One Platform. Infinite Possibilities.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {yisbirConfig.industries.map((ind, idx) => (
              <span key={idx} className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-sm font-semibold text-slate-300 hover:border-purple-500/40 transition-colors">
                {ind.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Yisbir */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">Why Yisbir</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{yisbirConfig.whyYisbir.title}</h2>
          <p className="text-slate-455 max-w-2xl mx-auto text-base sm:text-lg">{yisbirConfig.whyYisbir.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {yisbirConfig.whyYisbir.features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-slate-800">
                  <IconComponent className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Construction Module Details */}
      <section id="construction" className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950 border border-slate-900 rounded-3xl my-10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center lg:text-left mb-16">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">{yisbirConfig.constructionModule.title}</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{yisbirConfig.constructionModule.subtitle}</h2>
          <p className="text-slate-400 text-lg max-w-3xl font-semibold">{yisbirConfig.constructionModule.tagline}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Construction monitoring mockup image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950 w-full">
              <img 
                src="/assets/yisbir_cover_banner.png" 
                alt="Construction AI Monitoring" 
                className="w-full h-auto object-cover max-h-[380px] hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Automatic detections list */}
          <div className="lg:col-span-6 bg-slate-900/20 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider border-l-4 border-purple-500 pl-3">Automatic HSE Detections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yisbirConfig.constructionModule.detections.map((det, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {det.name}
                  </p>
                  <p className="text-xs text-slate-500">{det.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key benefits HSE - Premium Full Width Card Grid */}
        <div className="mt-12 border-t border-slate-900/60 pt-12">
          <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-wider border-l-4 border-blue-500 pl-3 text-left">Key Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {yisbirConfig.constructionModule.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-900/10 border border-slate-850/80 p-4 rounded-xl hover:border-blue-500/20 transition-all duration-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-300 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Asset Protection Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">{yisbirConfig.securityModule.title}</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{yisbirConfig.securityModule.subtitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {yisbirConfig.securityModule.columns.map((col, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-t from-purple-500 to-indigo-500 rounded-full" />
                  {col.title}
                </h3>
                <ul className="space-y-4">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Investigations & Dashboard mockup indicators */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/20 border-y border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Info Side */}
          <div className="lg:col-span-6">
            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">{yisbirConfig.investigations.title}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{yisbirConfig.investigations.subtitle}</h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
              {yisbirConfig.investigations.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {yisbirConfig.investigations.searchTypes.map((search, idx) => (
                <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-1">{search.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{search.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Unified Dashboard indicators mockup */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-850 rounded-3xl p-6 shadow-2xl relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-full">
              Unified Command Center
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">PPE Violations</span>
                  <HardHat className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl font-black text-white">124</p>
                <span className="text-[10px] text-red-500 font-bold">Active warning status</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Safety Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">37</p>
                <span className="text-[10px] text-amber-500 font-bold">↑ 18% vs yesterday</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Site Occupancy</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white">62%</p>
                <span className="text-[10px] text-slate-500 font-bold">842 Workers on-site</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Security Alerts</span>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white">19</p>
                <span className="text-[10px] text-purple-500 font-bold">Active perimeter tracking</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-950 border border-slate-900 rounded-2xl text-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Business Outcomes</span>
              <p className="text-xs text-purple-400 font-bold">Safer Worksites • Stronger Security • Faster Incident Investigation</p>
            </div>
          </div>

        </div>
      </section>

      {/* Powerful Capabilities (Grid) */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block mb-2">Powerful Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{yisbirConfig.capabilities.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yisbirConfig.capabilities.items.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/20 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-455 text-sm leading-relaxed">{feat.description}</p>
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
                src={yisbirConfig.hero.videoUrl}
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
