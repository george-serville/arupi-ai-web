import React, { useState } from "react";
import {
  X,
  User,
  Activity,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Globe,
  Settings,
  CheckCircle,
  Copy,
  Sparkles,
  Users,
  BookOpen,
  Info
} from "lucide-react";
import { CloneProfile, UserSyncData } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  insights: string[];
  cloneProfile: CloneProfile | null;
  onCompileClone: () => Promise<void>;
  compiling: boolean;
  syncData: UserSyncData | null;
  onSync: (username: string, email: string, isPublic: boolean) => Promise<void>;
  syncing: boolean;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCatalog: () => void;
  onOpenJournal: () => void;
}

type TabType = "profile" | "sync" | "system";

export default function Sidebar({
  isOpen,
  onClose,
  isDark,
  insights,
  cloneProfile,
  onCompileClone,
  compiling,
  syncData,
  onSync,
  syncing,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCatalog,
  onOpenJournal,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [username, setUsername] = useState(syncData?.username || "");
  const [email, setEmail] = useState(syncData?.email || "");
  const [isPublic, setIsPublic] = useState(syncData?.isPublic !== false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);

  if (!isOpen) return null;

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 8) {
      setError("Username must be at least 8 characters long.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await onSync(username.trim(), email.trim(), isPublic);
    } catch (err: any) {
      setError(err.message || "Failed to complete server sync.");
    }
  };

  const copyUsername = () => {
    if (!syncData?.username) return;
    navigator.clipboard.writeText(`@${syncData.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
      {/* Overlay backdrop for mobile */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs -z-10 sm:hidden" onClick={onClose} />

      {/* Main Sidebar Panel */}
      <div
        className={`w-full h-full flex flex-col p-6 overflow-y-auto scrollbar-thin ${
          isDark
            ? "bg-[#0d0d0f] text-zinc-100 border-l border-zinc-800"
            : "bg-[#FAF9F5] text-stone-900 border-l border-stone-250"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Identity Center</h2>
              <p className="text-[10px] text-stone-500 dark:text-zinc-400">Configure your digital clone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all ${
              isDark ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" : "hover:bg-stone-200/60 text-stone-500 hover:text-stone-900"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Access Apps */}
        <div className="grid grid-cols-2 gap-2.5 my-5">
          <button
            onClick={() => {
              onOpenCatalog();
              onClose();
            }}
            className={`group p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
              isDark
                ? "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                : "bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-xs"
            }`}
          >
            <div className="p-1.5 w-fit rounded-lg bg-indigo-500/10 text-indigo-500 mb-2 transition-transform group-hover:scale-105">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-zinc-200">
              Explore Selves
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
              Public Directory
            </p>
          </button>

          <button
            onClick={() => {
              onOpenJournal();
              onClose();
            }}
            className={`group p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
              isDark
                ? "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                : "bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-xs"
            }`}
          >
            <div className="p-1.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-2 transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-zinc-200">
              My Journal
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
              Reflections & Logs
            </p>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex p-1 rounded-xl border mb-5 ${
          isDark ? "bg-zinc-950 border-zinc-800/60" : "bg-stone-200/40 border-stone-200/80"
        }`}>
          {[
            { id: "profile", label: "Twin Profile", icon: User },
            { id: "sync", label: "Backup & Sync", icon: Globe },
            { id: "system", label: "System", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? isDark
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "bg-white text-stone-900 shadow-xs border border-stone-200/50"
                    : isDark
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-500" : "text-stone-400 dark:text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold tracking-wider uppercase text-stone-600 dark:text-zinc-400">
                  Virtual Self Profile
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400">
                  {insights.length} insights logged
                </span>
              </div>

              {cloneProfile ? (
                <div
                  className={`p-4 rounded-xl border space-y-4 ${
                    isDark ? "bg-zinc-900/35 border-zinc-800" : "bg-white border-stone-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shadow-xs">
                      {cloneProfile.avatarSeed || "👤"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-850 dark:text-zinc-100">{cloneProfile.name}</h4>
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        SYNTHESIS STATUS: STABLE
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 dark:border-zinc-800/80 pt-3 space-y-3.5">
                    <div className="text-xs text-stone-600 dark:text-zinc-300 font-light leading-relaxed">
                      <span className="font-bold text-stone-700 dark:text-zinc-100 block text-[10px] uppercase tracking-wider mb-1">
                        Arupi Poetic Vibe
                      </span>
                      {cloneProfile.bio}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-zinc-400">
                        Persona Quirks & Traits
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cloneProfile.traits.map((trait, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-2 py-0.5 rounded-md font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-light space-y-1 text-stone-600 dark:text-zinc-300">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-zinc-400">
                        Captured Speaking Cadence
                      </div>
                      <p className="italic bg-stone-100 dark:bg-zinc-950 p-2.5 rounded-lg text-[11px] leading-relaxed text-stone-800 dark:text-zinc-200 border border-stone-200/20 dark:border-zinc-800">
                        "{cloneProfile.speakingStyle}"
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-zinc-400">
                        Guiding Core Beliefs
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cloneProfile.coreValues.map((v, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] font-light text-stone-600 dark:text-zinc-300 bg-indigo-500/5 dark:bg-indigo-500/2 p-2.5 rounded-lg border border-indigo-500/10">
                      <span className="font-bold text-[9px] block uppercase tracking-wider text-indigo-500 mb-0.5">
                        Recommended Opener
                      </span>
                      "{cloneProfile.recommendedGreeting}"
                    </div>
                  </div>

                  <button
                    onClick={onCompileClone}
                    disabled={compiling}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-indigo-500 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${compiling ? "animate-spin" : ""}`} />
                    <span>{compiling ? "Re-Analyzing Digital Consciousness..." : "Re-Synthesize Twin Profile"}</span>
                  </button>
                </div>
              ) : (
                <div
                  className={`p-6 rounded-xl border text-center space-y-4 ${
                    isDark ? "bg-zinc-900/25 border-zinc-800" : "bg-white border-stone-200 shadow-xs"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-zinc-900 flex items-center justify-center text-stone-400 dark:text-zinc-500">
                    <User className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-stone-850 dark:text-zinc-200">Virtual Twin Unformed</h4>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-light max-w-[240px] mx-auto leading-relaxed">
                      We need at least a few interactions with your empathetic AI companion to capture your unique psyche, habits, beliefs, and speaking cadence.
                    </p>
                  </div>

                  <button
                    onClick={onCompileClone}
                    disabled={compiling || insights.length < 2}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer ${
                      insights.length >= 2
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/10"
                        : "bg-stone-200 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {compiling ? (
                      <>
                        <Settings className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Digital Consciousness...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Form My Virtual Twin</span>
                      </>
                    )}
                  </button>
                  {insights.length < 2 && (
                    <p className="text-[10px] text-amber-500 font-medium">
                      Need at least 2 conversational insights. Keep sharing!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLOUD BACKUP */}
          {activeTab === "sync" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] font-bold tracking-wider uppercase text-stone-600 dark:text-zinc-400">
                  Cloud Synchronization
                </h3>
              </div>

              <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                All logs are kept client-side by default. Sync your virtual self with our secure backup cloud to enable cross-device roaming and publish a public avatar for clone interactions.
              </p>

              {syncData ? (
                <div
                  className={`p-4 rounded-xl border space-y-3.5 ${
                    isDark ? "bg-emerald-950/10 border-emerald-900/30" : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                      Cloud Sync Confirmed & Active
                    </h4>
                  </div>

                  <div className="border-t border-emerald-200/50 dark:border-emerald-950/30 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-600 dark:text-zinc-400">Username:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold select-all text-stone-850 dark:text-zinc-100">@{syncData.username}</span>
                        <button onClick={copyUsername} className="p-0.5 rounded text-stone-500 dark:text-zinc-400 hover:text-indigo-500 cursor-pointer">
                          {copied ? (
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">Copied!</span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-600 dark:text-zinc-400">Email Link:</span>
                      <span className="truncate max-w-[180px] text-stone-850 dark:text-zinc-200 font-medium">{syncData.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-stone-600 dark:text-zinc-400">Public Directory:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{syncData.isPublic ? "Active" : "Disabled"}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 dark:text-zinc-500 leading-snug">
                    All dialog histories are pseudonymized under this cryptographic handle to maintain robust privacy.
                  </p>

                  <button
                    onClick={onCompileClone}
                    className="w-full py-2 px-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-xs font-bold text-center transition-all cursor-pointer shadow-sm shadow-indigo-500/10"
                  >
                    Sync & Publish Updates
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSyncSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-stone-600 dark:text-zinc-400 block">
                      Unique Handle / Username
                    </label>
                    <input
                      type="text"
                      placeholder="Minimum 8 characters (letters, numbers, underscores)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                        isDark
                          ? "bg-zinc-950 border-zinc-850 text-zinc-100 placeholder-zinc-700"
                          : "bg-white border-stone-250 text-stone-800 placeholder-stone-400"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-stone-600 dark:text-zinc-400 block">
                      Sync Recovery Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                        isDark
                          ? "bg-zinc-950 border-zinc-850 text-zinc-100 placeholder-zinc-700"
                          : "bg-white border-stone-250 text-stone-800 placeholder-stone-400"
                      }`}
                    />
                  </div>

                  {/* Public Interface Selector */}
                  <div className={`p-3 rounded-lg border flex items-center justify-between ${
                    isDark ? "bg-zinc-950 border-zinc-850" : "bg-white border-stone-200"
                  }`}>
                    <div className="flex flex-col max-w-[240px]">
                      <span className="text-xs font-bold text-stone-850 dark:text-zinc-200">Public Interface Mode</span>
                      <span className="text-[10px] font-light text-stone-500 dark:text-zinc-400 mt-0.5">
                        Allow other users' digital twin models to initiate simulated dialogues with my clone.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-stone-300 dark:border-zinc-850 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>

                  {error && (
                    <div className="p-2.5 text-[10px] text-red-500 bg-red-500/5 rounded-lg border border-red-500/20 font-light">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={syncing || !cloneProfile}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                      cloneProfile
                        ? "bg-stone-900 text-stone-150 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shadow-sm"
                        : "bg-stone-200 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{syncing ? "Initiating Cloud Transfer..." : "Sync Virtual Self to Server"}</span>
                  </button>
                  {!cloneProfile && (
                    <p className="text-[10px] text-amber-500 font-medium text-center leading-snug">
                      Form your Virtual Twin profile first to enable synchronization.
                    </p>
                  )}
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEM & SECURITY */}
          {activeTab === "system" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] font-bold tracking-wider uppercase text-stone-600 dark:text-zinc-400">
                  System Diagnostics & Legal
                </h3>
              </div>

              {/* Requirements Accordion */}
              <div className={`p-1.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-white border-stone-200"}`}>
                <button
                  type="button"
                  onClick={() => setShowRequirements(!showRequirements)}
                  className="w-full flex items-center justify-between p-2 text-xs font-bold text-stone-700 dark:text-zinc-300 hover:opacity-85 transition-opacity cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Platform Core Features</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showRequirements ? "rotate-90" : ""}`} />
                </button>

                {showRequirements && (
                  <div className="p-3 pt-1 border-t border-stone-100 dark:border-zinc-850 mt-1 space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin">
                    {[
                      {
                        title: "Interactive Opener",
                        desc: "Displays customized greetings organically when typing begins.",
                      },
                      {
                        title: "'SAY IT' Dispatcher",
                        desc: "Hands-free rapid input sending configured for seamless interactions.",
                      },
                      {
                        title: "Minimalist Plain Canvas",
                        desc: "No message bubbles, rendering pure conversation log directly on space.",
                      },
                      {
                        title: "Tone Hue Modulator",
                        desc: "Adapts speaking styling with dynamic color modules based on dialogue sentiment.",
                      },
                      {
                        title: "Web Speech Recognition",
                        desc: "Fully integrated speech-to-text capture for ambient reflection dialogues.",
                      },
                      {
                        title: "Resilient Retry Engines",
                        desc: "Server retry wrapper ensuring reliable Gemini API connections.",
                      }
                    ].map((req, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] font-bold text-stone-800 dark:text-zinc-200 leading-tight">
                            {req.title}
                          </h4>
                          <p className="text-[10px] text-stone-500 dark:text-zinc-400 font-light leading-snug">
                            {req.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
                isDark ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-stone-200 shadow-xs"
              }`}>
                <span className="text-stone-500 dark:text-zinc-400">Local Cache Security:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ENCRYPTED VAULT
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Bottom portion */}
        <div className="mt-auto pt-5 border-t border-stone-200/50 dark:border-zinc-800/50 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Privacy & Sync Controls</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={onOpenPrivacy}
              className={`py-2 px-1 text-[10px] font-bold text-center border rounded-lg transition-all cursor-pointer truncate ${
                isDark
                  ? "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
              title="Privacy Policy"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className={`py-2 px-1 text-[10px] font-bold text-center border rounded-lg transition-all cursor-pointer truncate ${
                isDark
                  ? "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
              title="Terms & Conditions"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab("sync")}
              className={`py-2 px-1 text-[10px] font-bold text-center border rounded-lg transition-all cursor-pointer truncate ${
                activeTab === "sync"
                  ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : isDark
                  ? "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
              title="Cross-Device Sync"
            >
              Device Sync
            </button>
          </div>
          <div className="text-[9px] text-center font-medium text-stone-500 dark:text-zinc-400 pt-1 leading-normal">
            ARUPI DIGITAL WORKSPACE © 2026<br />Zero Tracker Integrity Protocol
          </div>
        </div>
      </div>
    </div>
  );
}
