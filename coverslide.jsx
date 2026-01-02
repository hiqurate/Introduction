import React from 'react';
import { Globe, Calendar, UserShield, ShieldCheck } from 'lucide-react';

// 1. DATA OBJECT - Change your content here easily
const SITE_DATA = {
  company: {
    name: "HiQurate",
    suffix: "Ops",
    website: "www.hiqurateops.com",
    year: "2025"
  },
  hero: {
    badge: "Secure. Practical. Resilient.",
    titleLine1: "Practical",
    titleHighlight: "Cybersecurity",
    titleLine2: "for Growing Businesses",
    description: "Helping businesses understand their real cyber risks and build practical, effective security without unnecessary complexity or cost.",
    highlightBox: "Founded and led by industry practitioners, bridging the gap between enterprise-grade security and real-world business needs."
  },
  stats: {
    label: "Threat Level",
    status: "Monitoring Active",
    uptime: "99.9%"
  }
};

const CoverSlide = () => {
  return (
    // Main Container: Changed fixed w/h to min-h-screen and flex-col for mobile
    <div className="min-h-screen w-full bg-slate-900 font-sans text-white relative flex flex-col lg:flex-row overflow-hidden">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 z-50"></div>

      {/* --- LEFT SECTION (Content) --- */}
      <div className="w-full lg:w-[58%] h-full flex flex-col justify-center px-6 py-12 lg:pl-20 lg:pr-12 z-10 relative bg-slate-900/95 lg:bg-slate-900/95">

        {/* Logo Area */}
        <div className="mb-12 lg:absolute lg:top-12 lg:left-20 flex items-center gap-3">
          {/* Replace with your actual Logo Image */}
          <div className="h-10 w-10 bg-cyan-900/50 rounded flex items-center justify-center border border-cyan-500/30">
            <ShieldCheck className="text-cyan-400" size={24} />
          </div>
          <p className="text-xl font-bold tracking-wider uppercase">
            {SITE_DATA.company.name} <span className="text-cyan-500">{SITE_DATA.company.suffix}</span>
          </p>
        </div>

        {/* Main Content Group */}
        <div className="mt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 rounded-full bg-slate-800/50 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
              {SITE_DATA.hero.badge}
            </p>
          </div>

          {/* H1 Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            {SITE_DATA.hero.titleLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200" style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.2)' }}>
              {SITE_DATA.hero.titleHighlight}
            </span> <br />
            {SITE_DATA.hero.titleLine2}
          </h1>
        </div>

        {/* Divider */}
        <div className="w-24 h-1.5 bg-cyan-500 my-8 rounded-full"></div>

        {/* Description */}
        <div className="max-w-2xl">
          <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-6 font-light">
            {SITE_DATA.hero.description}
          </p>

          <div className="flex items-start gap-4 p-4 bg-slate-800/40 border-l-2 border-cyan-500 rounded-r-lg">
            <UserShield className="text-cyan-500 mt-1 shrink-0" size={20} />
            <p className="text-sm text-slate-400">
              Founded and led by industry practitioners, bridging the gap between <strong className="text-white">enterprise-grade security</strong> and <strong className="text-white">real-world business needs</strong>.
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 lg:mt-0 lg:absolute lg:bottom-12 lg:left-20 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-slate-500 font-mono text-xs">
          <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer">
            <Globe size={14} /> {SITE_DATA.company.website}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} /> {SITE_DATA.company.year}
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION (Visuals) --- */}
      <div className="w-full lg:w-[42%] h-64 lg:h-auto relative bg-slate-800">
        <div className="absolute inset-0 z-0">
          {/* Using a placeholder image from Unsplash for demonstration */}
          <img
            alt="Cybersecurity Abstract"
            className="w-full h-full object-cover opacity-90"
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply"></div>

        {/* Floating UI Card */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 w-64 p-4 bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-2xl z-20">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-mono text-slate-400">{SITE_DATA.stats.label}</p>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2">
            <div className="bg-cyan-500 h-1.5 rounded-full w-[75%]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
            <span>{SITE_DATA.stats.status}</span>
            <span>{SITE_DATA.stats.uptime}</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-cyan-500 opacity-50 hidden md:block"></div>
        <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white opacity-20 hidden md:block"></div>
      </div>

    </div>
  );
};

export default CoverSlide;