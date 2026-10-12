import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BannerImage from "../../sub-components/banner-image";
import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Brain,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Play
} from "lucide-react";

// Dynamic configuration object that can be easily customized for any future product.
const productConfig = {
  name: "Mandoobee",
  tagline: "AI-Powered Workplace Platform",
  hero: {
    title: "The Future of Work is",
    titleHighlight: "Intelligent.",
    description: "Mandoobee brings HR, projects, documents, communication and AI together in one unified platform to help your organization move faster, smarter and better.",
    exploreLink: "#features",
    videoUrl: "/assets/mandoobee_video.mp4",
    badges: [
      { text: "AI-Powered", color: "from-blue-600 to-indigo-600" },
      { text: "Secure", color: "from-emerald-500 to-teal-500" },
      { text: "Scalable", color: "from-amber-500 to-orange-500" },
      { text: "Enterprise Ready", color: "from-purple-500 to-pink-500" }
    ],
    mockupImage: "/assets/smart-office-app.png"
  },
  trustedBy: [
    { name: "TechSolutions" },
    { name: "InnoWave" },
    { name: "DigitalCorp" },
    { name: "NextGen" },
    { name: "AlphaSoft" },
    { name: "CloudSync" }
  ],
  comparison: {
    reality: {
      title: "The Reality",
      subtitle: "Too Many Tools. Not Enough Productivity.",
      painPoints: [
        "Switching between multiple apps",
        "Delays in approvals and communication",
        "No real-time visibility or insights",
        "Repetitive manual tasks"
      ]
    },
    difference: {
      title: "Mandoobee is Different",
      subtitle: "AI Built In. Intelligence Everywhere.",
      description: "Mandoobee is not just another software. It's an intelligent workplace that thinks, assists, and automates—so your teams can focus on what truly matters.",
      ctaText: "See It In Action",
      ctaLink: "#features"
    }
  },
  features: {
    title: "Powerful Capabilities for Modern Teams",
    subtitle: "Everything you need, all in one place.",
    items: [
      {
        icon: Users,
        title: "People & HR",
        description: "Manage employees, attendance, leaves, requests and more with complete automation.",
        color: "from-blue-500/10 to-indigo-500/10"
      },
      {
        icon: Briefcase,
        title: "Work & Projects",
        description: "Plan, assign and track tasks. Manage projects and deliver results, every time.",
        color: "from-purple-500/10 to-pink-500/10"
      },
      {
        icon: FileText,
        title: "Documents & Knowledge",
        description: "Smart document workflows, shared folders, OCR, PDF tools and more.",
        color: "from-cyan-500/10 to-teal-500/10"
      },
      {
        icon: MessageSquare,
        title: "Communication",
        description: "Chat, groups, announcements and directories to keep your team connected.",
        color: "from-emerald-500/10 to-green-500/10"
      },
      {
        icon: Brain,
        title: "AI Intelligence",
        description: "AI assistant, document Q&A, contract review, smart notes and powerful AI tools.",
        color: "from-violet-500/10 to-fuchsia-500/10"
      }
    ]
  },
  benefits: {
    title: "Key Benefits",
    subtitle: "Why choose Mandoobee for your business?",
    list: [
      "Unified office operations in one platform",
      "Reduced manual work and paper-based processes",
      "Faster approvals, communication, and task execution",
      "AI-powered document handling and office assistance",
      "Improved HQ, payroll, workflow, and support visibility",
      "Flexible deployment: on-premise, cloud, or hybrid",
      "Bilingual support: Arabic and English",
      "White-labeling, customization, and third-party integrations"
    ]
  },
  stats: [
    { value: "512+", label: "Active Organizations" },
    { value: "50K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime & Reliability" },
    { value: "24/7", label: "Dedicated Support" }
  ]
};

export default function Mandoobee() {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    data.append("Product", "Mandoobee Demo Request");
    data.append("Message", "Requested a demo for Mandoobee App.");

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
    <div className="bg-[#020617] text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      <BannerImage />

      {/* Breadcrumb & Premium Header Section */}
      <div className="relative border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12 px-6 sm:px-12 lg:px-16 text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-405 transition-colors">Home</Link>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-slate-500">Solutions</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-blue-400">{productConfig.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
                {productConfig.name}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-medium">
                {productConfig.tagline}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-widest">
                Smart Office Solution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Dynamic Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {productConfig.hero.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-sm`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        {/* Dynamic Title & Subtitle */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-tight">
          {productConfig.hero.title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            {productConfig.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-8 leading-relaxed">
          {productConfig.hero.description}
        </p>        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 z-10">
          <a
            href={productConfig.hero.exploreLink}
            className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5 text-white"
          >
            Explore {productConfig.name}
          </a>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 rounded-xl font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-300 text-slate-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-blue-400" /> Watch Video
          </button>
        </div>

        {/* Dynamic Mockup Image */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/40 p-2 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent rounded-2xl z-10 pointer-events-none" />
          <img
            src={productConfig.hero.mockupImage}
            alt={`${productConfig.name} Dashboard Mockup`}
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      </section>




      {/* Comparison Section (Too Many Tools vs Mandoobee) */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pain points card */}
          <div className="lg:col-span-5 bg-slate-950/40 border border-red-500/20 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm shadow-lg">
            <div>
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider block mb-2">{productConfig.comparison.reality.title}</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">{productConfig.comparison.reality.subtitle}</h3>
              <ul className="space-y-4">
                {productConfig.comparison.reality.painPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-400">
                    <span className="text-red-400 mt-1 flex-shrink-0">✕</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-900">
              <p className="text-xs text-slate-500">Unintegrated systems lower team morale and overall output.</p>
            </div>
          </div>

          {/* Solution card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">{productConfig.comparison.difference.title}</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">{productConfig.comparison.difference.subtitle}</h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                {productConfig.comparison.difference.description}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      const scrollOptions = {
                        behavior: "smooth",
                      };
                      const offset = -100;
                      window.scrollTo({
                        top: contactSection.offsetTop + offset,
                        ...scrollOptions,
                      });
                    }
                  }, 100);
                }}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all font-semibold flex items-center gap-2 group text-white"
              >
                {productConfig.comparison.difference.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{productConfig.features.title}</h2>
          <p className="text-slate-400 max-w-xl mx-auto">{productConfig.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productConfig.features.items.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 border border-slate-800`}>
                  <IconComponent className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits and Visual Circle Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/40 border border-slate-900 rounded-3xl my-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Benefits list */}
          <div className="lg:col-span-7">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">{productConfig.benefits.title}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">{productConfig.benefits.subtitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productConfig.benefits.list.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphical Circle Side */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-blue-500/20 flex items-center justify-center bg-slate-900/20 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
              {/* Inner animated core */}
              <div className="w-48 h-48 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-950/20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-2xl font-black text-white">{productConfig.name[0]}</span>
                </div>
              </div>

              {/* Orbital Nodes */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" /> AI
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> HRMS
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" /> IoT
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Projects
              </div>
            </div>
          </div>
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
                src={productConfig.hero.videoUrl}
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

