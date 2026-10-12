import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BannerImage from "../../sub-components/banner-image";
import {
  Wifi,
  Smartphone,
  MonitorPlay,
  HardDrive,
  Settings,
  Radio,
  Unlock,
  Eye,
  Layers,
  ShieldAlert,
  History,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  Bluetooth,
  Play
} from "lucide-react";

const waselConfig = {
  name: "Wasel",
  tagline: "Smart Gate & Access Control System",
  hero: {
    title: "Smart Access. Total Control.",
    titleHighlight: "Anywhere.",
    description: "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access. It is designed for residential communities, villas, apartments, commercial facilities, and multi-gate environments.",
    exploreLink: "#features",
    demoLink: "#demo",
    badges: [
      { text: "IoT-Powered Gate Control", color: "from-emerald-500 to-teal-500" },
      { text: "Secure & Encripted", color: "from-blue-500 to-indigo-500" },
      { text: "Online & Offline Modes", color: "from-purple-500 to-pink-500" },
      { text: "Real-time Monitoring", color: "from-cyan-500 to-blue-500" }
    ],
    coverImage: "/assets/wasel_cover_banner.png",
    videoUrl: "/assets/wasel.mp4"
  },
  whatIs: {
    title: "What is Wasel?",
    description: "WASEL is a smart IoT-based gate and door access control system that connects mobile applications, IoT gate controller hardware, cloud services, local network access, and Bluetooth fallback modes to provide flexible, secure, and real-time access management."
  },
  features: {
    title: "Everything You Need in One Smart System",
    subtitle: "Manage and monitor your physical barriers remotely and securely.",
    items: [
      {
        icon: Wifi,
        title: "Multi-Mode Connectivity",
        description: "Connect via Cellular, Local Wi-Fi, Bluetooth, or local offline configurations.",
        color: "from-emerald-500/10 to-teal-500/10"
      },
      {
        icon: Smartphone,
        title: "Mobile App Control",
        description: "Open/close gates, view statuses, and receive instant alert logs from anywhere.",
        color: "from-blue-500/10 to-indigo-500/10"
      },
      {
        icon: MonitorPlay,
        title: "Real-Time Monitoring",
        description: "Track gate position sensors, temperature, humidity, and active status feeds.",
        color: "from-cyan-500/10 to-blue-500/10"
      },
      {
        icon: HardDrive,
        title: "IoT Gate Controller",
        description: "Industrial-grade hardware controller unit with plug-and-play connections.",
        color: "from-purple-500/10 to-pink-500/10"
      },
      {
        icon: History,
        title: "Audit & Activity Logs",
        description: "Detailed historic logs showing time/date, triggering user, and access methods.",
        color: "from-indigo-500/10 to-violet-500/10"
      },
      {
        icon: Layers,
        title: "Multi-Gate Management",
        description: "Centralized panel control for multiple gates and access points across different regions.",
        color: "from-violet-500/10 to-fuchsia-500/10"
      },
      {
        icon: ShieldAlert,
        title: "Access Security",
        description: "Encrypted keys, administrative privileges, user management, and roles.",
        color: "from-red-500/10 to-orange-500/10"
      },
      {
        icon: Settings,
        title: "Device Provisioning",
        description: "Fast OTA provisioning, setup wizards, and automatic device configurations.",
        color: "from-amber-500/10 to-orange-500/10"
      },
      {
        icon: Unlock,
        title: "Fallback & Offline Modes",
        description: "Offline BLE Bluetooth access ensures you never get locked out during internet downtime.",
        color: "from-teal-500/10 to-emerald-500/10"
      }
    ]
  },
  useCases: [
    { title: "Residential Communities", desc: "Automate resident entry gates, visitor passes, and track entry history." },
    { title: "Commercial Buildings", desc: "Restrict office floor doors, staff parking gates, and server room access." },
    { title: "Industries & Warehouses", desc: "Secure loading dock gates, logistics yards, and heavy equipment zones." },
    { title: "Parking Lots", desc: "Integrate automatic ticketing arm control and smart parking sensors." },
    { title: "Toll Gates", desc: "High-speed automatic barrier controls linked to billing systems." },
    { title: "Construction Sites", desc: "Perimeter gate tracking for safety compliance and contractor check-ins." }
  ],
  benefits: [
    "Centralized control for multiple gates and access points",
    "Real-time gate status and sensor visibility",
    "Secure role-based access management",
    "Reliable operation with online and offline fallback modes",
    "Reduced dependency on a single network connection",
    "Improved safety, transparency, and access accountability",
    "Flexible access via mobile, Wi-Fi, Bluetooth, and cloud",
    "Suitable for residential, commercial, and multi-gate environments"
  ],
  stats: [
    { value: "99.9%", label: "System Uptime" },
    { value: "BLE", label: "Offline Fallback" },
    { value: "256-bit", label: "AES Encryption" },
    { value: "<1s", label: "Response Delay" }
  ]
};

export default function Wasel() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gateState, setGateState] = useState("CLOSED"); // CLOSED, OPENING, OPEN, CLOSING
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BASE_URL_DEV
      : process.env.REACT_APP_BASE_URL_PROD;

  const handleSimulateGate = () => {
    if (gateState === "CLOSED") {
      setGateState("OPENING");
      setTimeout(() => setGateState("OPEN"), 1500);
    } else if (gateState === "OPEN") {
      setGateState("CLOSING");
      setTimeout(() => setGateState("CLOSED"), 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("FullName", formData.fullName);
    data.append("Email", formData.email);
    data.append("Phone", formData.phone);
    data.append("Country", "UAE");
    data.append("Product", "Wasel Demo Request");
    data.append("Message", "Requested a demo for Wasel Smart Gate Control.");

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
    <div className="bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      <BannerImage />

      {/* Breadcrumb & Premium Header Section */}
      <div className="relative border-b border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12 px-6 sm:px-12 lg:px-16 text-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            <Link to="/" className="hover:text-emerald-405 transition-colors">Home</Link>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-slate-500">Solutions</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-emerald-400">{waselConfig.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight mb-2">
                {waselConfig.name}
              </h1>
              <p className="text-slate-400 text-[14px] lg:text-[18px] font-normal max-w-2xl mt-2">
                {waselConfig.tagline}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                IoT Access Solution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Emerald Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {waselConfig.hero.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${badge.color} text-white shadow-md`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        <h1 className="text-5xl sm:text-8xl font-black tracking-tight text-white mb-6 max-w-5xl leading-tight">
          {waselConfig.hero.title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-450">
            {waselConfig.hero.titleHighlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed">
          {waselConfig.hero.description}
        </p>

        {/* Dynamic Cover Image Banner */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl mb-12">
          <img
            src={waselConfig.hero.coverImage}
            alt="Wasel Smart Gate Cover"
            className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 z-10">
          <a
            href={waselConfig.hero.exploreLink}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] text-white"
          >
            Explore Features
          </a>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all duration-300 text-slate-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-emerald-400" /> Watch Video
          </button>
        </div>

        {/* CSS-only Mobile App Controller Simulator */}
        <div className="relative w-full max-w-sm mx-auto rounded-[3rem] border-[12px] border-slate-900 bg-slate-950 shadow-2xl p-6 text-left font-sans mt-4">

          {/* Smartphone Ear Speaker / Notch */}
          <div className="w-32 h-6 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-850 rounded-full mb-1" />
          </div>

          <div className="pt-6 pb-2 border-b border-slate-900 mb-6 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wasel Mobile Key</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] text-emerald-400 font-bold font-mono">CONNECTED</span>
            </div>
          </div>

          <div className="text-center space-y-6 py-6">
            <p className="text-xs text-slate-400">Device: Main Entry Gate 01</p>

            {/* Gate Status Display */}
            <div className="py-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${gateState === "OPEN" ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400" :
                gateState === "CLOSED" ? "bg-red-500/10 border border-red-500/25 text-red-400" :
                  "bg-amber-500/10 border border-amber-500/25 text-amber-400 animate-pulse"
                }`}>
                Gate is {gateState}
              </span>
            </div>

            {/* Simulated Action Controller Button */}
            <button
              onClick={handleSimulateGate}
              disabled={gateState === "OPENING" || gateState === "CLOSING"}
              className="w-36 h-36 rounded-full border border-slate-850 bg-slate-900 hover:bg-slate-850 flex flex-col items-center justify-center mx-auto transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] active:scale-95 group disabled:opacity-50"
            >
              <Unlock className={`w-8 h-8 mb-2 transition-transform duration-300 ${gateState === "OPEN" ? "text-emerald-400 scale-110" :
                gateState === "CLOSED" ? "text-slate-400" :
                  "text-amber-400 animate-spin"
                }`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                {gateState === "CLOSED" ? "Tap to Open" : gateState === "OPEN" ? "Tap to Close" : "Moving..."}
              </span>
            </button>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              Auto-Close configured for 60 seconds. Uses BLE Local Key fallback mode automatically if Wi-Fi goes offline.
            </p>
          </div>
        </div>
      </section>

      {/* What is Wasel */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto bg-slate-950/30 border-y border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">{waselConfig.whatIs.title}</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">IoT Door & Gate Management Excellence</h2>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-3xl">
              {waselConfig.whatIs.description}
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-405 shadow-xl shadow-emerald-500/5">
              <Unlock className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">Core Features & Services</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">{waselConfig.features.title}</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">{waselConfig.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {waselConfig.features.items.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 border border-slate-800`}>
                  <IconComponent className="w-6 h-6 text-emerald-400 group-hover:text-emerald-350 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{feat.title}</h3>
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
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">Platform Value</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8">Key Benefits of Wasel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {waselConfig.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Core Graphic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-emerald-500/25 flex items-center justify-center bg-slate-900/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-950/20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-2xl font-black text-white">W</span>
                </div>
              </div>

              {/* Orbiting metrics labels */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-400" /> WiFi / LTE
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Bluetooth className="w-4 h-4 text-blue-400" /> Bluetooth
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5">
                <Unlock className="w-4