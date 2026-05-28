import { useState } from "react";
import {
  ShieldAlert, Eye, CheckCircle, XCircle, AlertTriangle, Zap, Settings,
  Search, RefreshCw, Flag, Brain, Cpu, FileWarning, Shield, Activity,
  ToggleLeft, ToggleRight, Lock, User, ChevronDown, X, Video, Clock
} from "lucide-react";

const MOCK_SCANS = [
  {
    id: "scan-001", recordTitle: "Most Push-Ups in 60 Seconds", type: "record",
    athlete: "Marcus Thorne", submittedAt: "2026-05-28T10:30:00Z", aiScore: 94, verdict: "authentic",
    checks: {
      videoAuthenticity: { passed: true, score: 96, detail: "No deepfake signatures detected" },
      metadataConsistency: { passed: true, score: 92, detail: "EXIF data matches claimed date/time" },
      physicsFeasibility: { passed: true, score: 94, detail: "Movement within human capability range" },
      duplicateDetection: { passed: true, score: 98, detail: "No matching footage in database" },
      editingDetection: { passed: false, score: 71, detail: "Minor compression artifacts at 0:42" },
    },
    adminOverride: null, flagged: false
  },
  {
    id: "scan-002", recordTitle: "Fastest 100m Sprint (Barefoot)", type: "challenge",
    athlete: "Devon Shaw", submittedAt: "2026-05-27T14:15:00Z", aiScore: 31, verdict: "suspicious",
    checks: {
      videoAuthenticity: { passed: false, score: 28, detail: "Speed manipulation detected" },
      metadataConsistency: { passed: false, score: 35, detail: "Timestamp mismatch in video metadata" },
      physicsFeasibility: { passed: false, score: 22, detail: "Speed exceeds human limits by 340%" },
      duplicateDetection: { passed: true, score: 89, detail: "No duplicates found" },
      editingDetection: { passed: false, score: 18, detail: "Frame rate irregularities (24fps→60fps)" },
    },
    adminOverride: null, flagged: true
  },
  {
    id: "scan-003", recordTitle: "Longest Plank Hold", type: "record",
    athlete: "Sarah Chen", submittedAt: "2026-05-27T09:00:00Z", aiScore: 88, verdict: "authentic",
    checks: {
      videoAuthenticity: { passed: true, score: 91, detail: "Continuous recording confirmed" },
      metadataConsistency: { passed: true, score: 89, detail: "All metadata consistent" },
      physicsFeasibility: { passed: true, score: 85, detail: "Duration within documented human records" },
      duplicateDetection: { passed: true, score: 95, detail: "Unique footage confirmed" },
      editingDetection: { passed: true, score: 88, detail: "No edit cuts detected" },
    },
    adminOverride: null, flagged: false
  },
  {
    id: "scan-004", recordTitle: "Most Juggling Objects Simultaneously", type: "record",
    athlete: "James Park", submittedAt: "2026-05-26T16:45:00Z", aiScore: 56, verdict: "review_needed",
    checks: {
      videoAuthenticity: { passed: true, score: 74, detail: "Possible green screen background" },
      metadataConsistency: { passed: false, score: 44, detail: "GPS location data stripped from file" },
      physicsFeasibility: { passed: true, score: 67, detail: "Object count plausible" },
      duplicateDetection: { passed: true, score: 92, detail: "No duplicates found" },
      editingDetection: { passed: false, score: 48, detail: "Multiple camera cuts detected" },
    },
    adminOverride: null, flagged: false
  },
  {
    id: "scan-005", recordTitle: "Highest Vertical Jump (Weighted)", type: "challenge",
    athlete: "Alex Rivera", submittedAt: "2026-05-26T11:20:00Z", aiScore: 79, verdict: "authentic",
    checks: {
      videoAuthenticity: { passed: true, score: 82, detail: "Authentic footage confirmed" },
      metadataConsistency: { passed: true, score: 77, detail: "Metadata consistent with location" },
      physicsFeasibility: { passed: true, score: 75, detail: "Height within known records" },
      duplicateDetection: { passed: true, score: 90, detail: "Unique submission" },
      editingDetection: { passed: true, score: 83, detail: "No editing detected" },
    },
    adminOverride: null, flagged: false
  },
];

const MOCK_FRAUD = [
  { id: "f-001", type: "duplicate_account", severity: "high", user: "john.doe2@gmail.com", details: "IP matches banned user john.doe@gmail.com (ban date: 2025-11-12)", createdAt: "2026-05-28T11:00:00Z", resolved: false },
  { id: "f-002", type: "fake_submission", severity: "critical", user: "speedster99@outlook.com", details: "Video analyzed as CGI-generated content with 97% confidence", createdAt: "2026-05-28T09:30:00Z", resolved: false },
  { id: "f-003", type: "suspicious_activity", severity: "medium", user: "athlete_pro@yahoo.com", details: "5 submissions in 10 minutes from same IP address", createdAt: "2026-05-27T20:15:00Z", resolved: true },
  { id: "f-004", type: "metadata_manipulation", severity: "high", user: "recordbreaker@hotmail.com", details: "Video metadata shows future timestamp (2027-01-15)", createdAt: "2026-05-27T14:45:00Z", resolved: false },
  { id: "f-005", type: "vpn_detected", severity: "low", user: "unknown_athlete@proton.me", details: "Submission from known VPN exit node — 3 different countries in 1 hour", createdAt: "2026-05-26T18:00:00Z", resolved: false },
  { id: "f-006", type: "account_sharing", severity: "medium", user: "champion2026@gmail.com", details: "Login from 6 different device fingerprints in 24 hours across 4 countries", createdAt: "2026-05-25T08:30:00Z", resolved: false },
];

const DEFAULT_AI_CONFIG = {
  videoAuthenticityCheck: true,
  metadataAnalysis: true,
  physicsFeasibility: true,
  duplicateDetection: true,
  editingDetection: true,
  deepfakeDetection: true,
  speedManipulationDetect: true,
  backgroundDetection: true,
  realTimeScanning: true,
  aiScanAllSubmissions: true,
  aiScanChallenges: true,
  notifyOnSuspicious: true,
  autoRejectThreshold: 40,
  autoApproveThreshold: 90,
  flagForReviewThreshold: 60,
  scanSensitivity: "balanced", // "strict" | "balanced" | "lenient"
};

const verdictStyle = (verdict, override) => {
  const v = override?.verdict || verdict;
  if (v === "authentic") return { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "AUTHENTIC" };
  if (v === "suspicious") return { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "SUSPICIOUS" };
  if (v === "review_needed") return { color: "#ffcc00", bg: "rgba(255,204,0,0.12)", label: "REVIEW NEEDED" };
  if (v === "rejected") return { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "REJECTED" };
  if (v === "approved_override") return { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "APPROVED (OVERRIDE)" };
  return { color: "#888", bg: "rgba(255,255,255,0.05)", label: "UNKNOWN" };
};

const severityStyle = (sev) => {
  if (sev === "critical") return { color: "#ef4444", bg: "rgba(239,68,68,0.15)" };
  if (sev === "high") return { color: "#FF6A00", bg: "rgba(255,106,0,0.15)" };
  if (sev === "medium") return { color: "#ffcc00", bg: "rgba(255,204,0,0.15)" };
  return { color: "#888", bg: "rgba(255,255,255,0.05)" };
};

const fraudTypeLabel = (type) => {
  const map = {
    duplicate_account: "Duplicate Account",
    fake_submission: "Fake Submission",
    suspicious_activity: "Suspicious Activity",
    metadata_manipulation: "Metadata Manipulation",
    vpn_detected: "VPN / Proxy Detected",
    account_sharing: "Account Sharing",
  };
  return map[type] || type;
};

export default function AdminAIControls({ user, showToast }) {
  const [subTab, setSubTab] = useState("scans");
  const [scans, setScans] = useState(MOCK_SCANS);
  const [fraudAlerts, setFraudAlerts] = useState(MOCK_FRAUD);
  const [selectedScan, setSelectedScan] = useState(null);
  const [overrideVerdict, setOverrideVerdict] = useState("approved_override");
  const [overrideReason, setOverrideReason] = useState("");
  const [scanSearch, setScanSearch] = useState("");
  const [fraudSearch, setFraudSearch] = useState("");
  const [fraudFilter, setFraudFilter] = useState("all");
  const [scanning, setScanning] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [config, setConfig] = useState(DEFAULT_AI_CONFIG);
  const [configSaving, setConfigSaving] = useState(false);

  const SUB_TABS = [
    { key: "scans", label: "AI Scan Results", icon: <Brain size={14} /> },
    { key: "overrides", label: "Admin Overrides", icon: <ShieldAlert size={14} /> },
    { key: "fraud", label: "Fraud Detection", icon: <FileWarning size={14} /> },
    { key: "flags", label: "Flagged Items", icon: <Flag size={14} /> },
    { key: "config", label: "AI Configuration", icon: <Settings size={14} /> },
  ];

  const handleOverride = () => {
    if (!overrideReason.trim()) { showToast("Please enter an override reason", "error"); return; }
    setScans(prev => prev.map(s => s.id === selectedScan.id
      ? { ...s, adminOverride: { verdict: overrideVerdict, reason: overrideReason, by: user?.name || "Admin", at: new Date().toISOString() } }
      : s
    ));
    showToast(`AI decision overridden → ${overrideVerdict.toUpperCase().replace("_", " ")}`, "success");
    setSelectedScan(null);
    setOverrideReason("");
  };

  const handleFlag = (id) => {
    setScans(prev => prev.map(s => s.id === id ? { ...s, flagged: !s.flagged } : s));
    showToast("Flag status updated", "info");
  };

  const handleResolveFraud = (id) => {
    setFraudAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    showToast("Fraud alert resolved", "success");
  };

  const handleRunScan = async () => {
    setScanning(true);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setScanPct(i);
    }
    setScanning(false);
    setScanPct(0);
    showToast("Full AI scan complete on all pending submissions", "success");
  };

  const toggleBool = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setConfigSaving(false);
    showToast("AI configuration saved", "success");
  };

  const filteredScans = scans.filter(s =>
    !scanSearch || s.recordTitle.toLowerCase().includes(scanSearch.toLowerCase()) || s.athlete.toLowerCase().includes(scanSearch.toLowerCase())
  );

  const filteredFraud = fraudAlerts.filter(a => {
    const matchSearch = !fraudSearch || a.user.toLowerCase().includes(fraudSearch.toLowerCase()) || a.details.toLowerCase().includes(fraudSearch.toLowerCase());
    const matchFilter = fraudFilter === "all" || (fraudFilter === "unresolved" && !a.resolved) || (fraudFilter === "resolved" && a.resolved) || a.severity === fraudFilter;
    return matchSearch && matchFilter;
  });

  const flaggedScans = scans.filter(s => s.flagged);
  const overriddenScans = scans.filter(s => s.adminOverride);
  const suspiciousCount = scans.filter(s => s.verdict === "suspicious").length;
  const unresolvedFraud = fraudAlerts.filter(a => !a.resolved).length;

  const S = { // inline style helpers
    card: { background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px" },
    pill: (color, bg) => ({ background: bg, color, padding: "3px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px" }),
    subTabBtn: (active) => ({
      background: active ? "rgba(255,85,0,0.12)" : "transparent",
      border: `1px solid ${active ? "rgba(255,85,0,0.3)" : "rgba(255,255,255,0.06)"}`,
      color: active ? "#FF5500" : "#888",
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "900",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      transition: "all 0.15s"
    }),
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            Intelligent Oversight Engine
          </div>
          <h2 style={{ fontSize: "52px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
            AI VERIFICATION
            <br /><span style={{ color: "#FF5500" }}>CONTROLS</span>
          </h2>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6", maxWidth: "520px", margin: 0 }}>
            Review AI authenticity scans on records and challenges, override AI decisions, detect fraud, and configure the intelligence engine.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <button
            onClick={handleRunScan}
            disabled={scanning}
            style={{ background: scanning ? "rgba(255,85,0,0.3)" : "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", border: "none", color: "white", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: scanning ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 4px 14px rgba(255,85,0,0.3)" }}
          >
            {scanning ? <><RefreshCw size={14} className="animate-spin" /> SCANNING {scanPct}%</> : <><Cpu size={14} /> RUN FULL SCAN</>}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Scanned", value: scans.length, color: "#FF5500", icon: <Brain size={18} /> },
          { label: "Authentic", value: scans.filter(s => (s.adminOverride?.verdict || s.verdict) === "authentic").length, color: "#22c55e", icon: <CheckCircle size={18} /> },
          { label: "Suspicious", value: suspiciousCount, color: "#ef4444", icon: <XCircle size={18} /> },
          { label: "Needs Review", value: scans.filter(s => s.verdict === "review_needed").length, color: "#ffcc00", icon: <AlertTriangle size={18} /> },
          { label: "Fraud Alerts", value: unresolvedFraud, color: "#a855f7", icon: <FileWarning size={18} /> },
        ].map(stat => (
          <div key={stat.label} style={{ ...S.card, display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.8px" }}>{stat.label}</div>
              <div style={{ color: stat.color, opacity: 0.7 }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: "36px", fontWeight: "950", color: stat.color, lineHeight: "1" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={S.subTabBtn(subTab === t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ===== SCANS TAB ===== */}
      {subTab === "scans" && (
        <div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} color="#666" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                placeholder="Search by title or athlete..."
                value={scanSearch}
                onChange={e => setScanSearch(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px 10px 36px", color: "white", fontSize: "13px", outline: "none" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredScans.map(scan => {
              const vs = verdictStyle(scan.verdict, scan.adminOverride);
              return (
                <div key={scan.id} style={{ ...S.card, border: scan.flagged ? "1px solid rgba(255,204,0,0.3)" : S.card.border }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span style={S.pill(vs.color, vs.bg)}>{vs.label}</span>
                        <span style={S.pill(scan.type === "record" ? "#3b82f6" : "#a855f7", scan.type === "record" ? "rgba(59,130,246,0.12)" : "rgba(168,85,247,0.12)")}>{scan.type.toUpperCase()}</span>
                        {scan.flagged && <span style={S.pill("#ffcc00", "rgba(255,204,0,0.15)")}>🚩 FLAGGED</span>}
                        {scan.adminOverride && <span style={S.pill("#22c55e", "rgba(34,197,94,0.1)")}>ADMIN OVERRIDE</span>}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "white", marginBottom: "4px" }}>{scan.recordTitle}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {scan.athlete} · Submitted {new Date(scan.submittedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </div>
                    </div>
                    {/* AI Score ring */}
                    <div style={{ textAlign: "center", minWidth: "80px" }}>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: scan.aiScore >= 80 ? "#22c55e" : scan.aiScore >= 55 ? "#ffcc00" : "#ef4444", lineHeight: "1" }}>{scan.aiScore}</div>
                      <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase" }}>AI Score</div>
                    </div>
                  </div>

                  {/* Checks breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", margin: "16px 0" }}>
                    {Object.entries(scan.checks).map(([key, check]) => (
                      <div key={key} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          {check.passed
                            ? <CheckCircle size={12} color="#22c55e" />
                            : <XCircle size={12} color="#ef4444" />}
                          <span style={{ fontSize: "9px", color: "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "900", color: check.passed ? "#22c55e" : "#ef4444" }}>{check.score}%</div>
                        <div style={{ fontSize: "9px", color: "#555", marginTop: "2px", lineHeight: "1.3" }}>{check.detail}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => { setSelectedScan(scan); setOverrideReason(scan.adminOverride?.reason || ""); setOverrideVerdict("approved_override"); }}
                      style={{ background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.3)", color: "#FF5500", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ShieldAlert size={13} /> Override Decision
                    </button>
                    <button onClick={() => handleFlag(scan.id)}
                      style={{ background: scan.flagged ? "rgba(255,204,0,0.15)" : "transparent", border: `1px solid ${scan.flagged ? "rgba(255,204,0,0.3)" : "rgba(255,255,255,0.08)"}`, color: scan.flagged ? "#ffcc00" : "#666", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Flag size={13} /> {scan.flagged ? "Unflag" : "Flag"}
                    </button>
                    {scan.adminOverride && (
                      <div style={{ padding: "7px 14px", background: "rgba(34,197,94,0.05)", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.1)", fontSize: "11px", color: "#22c55e", fontWeight: "700" }}>
                        Override by {scan.adminOverride.by}: "{scan.adminOverride.reason}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== OVERRIDES TAB ===== */}
      {subTab === "overrides" && (
        <div>
          <div style={{ ...S.card, marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <ShieldAlert size={18} color="#FF5500" />
              <h3 style={{ fontSize: "16px", fontWeight: "900", margin: 0 }}>Admin Override History</h3>
              <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "2px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "900" }}>{overriddenScans.length} overrides</span>
            </div>
            {overriddenScans.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#555", fontWeight: "700" }}>No AI decisions have been overridden yet.</div>
            ) : overriddenScans.map(scan => {
              const vs = verdictStyle(scan.verdict, scan.adminOverride);
              return (
                <div key={scan.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "800", color: "white", fontSize: "14px", marginBottom: "4px" }}>{scan.recordTitle}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      AI verdict: <span style={{ color: "#ffcc00", fontWeight: "700" }}>{scan.verdict}</span>
                      {" → "}
                      <span style={{ color: vs.color, fontWeight: "700" }}>{scan.adminOverride.verdict}</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>
                      Overridden by {scan.adminOverride.by} · Reason: "{scan.adminOverride.reason}"
                    </div>
                  </div>
                  <span style={S.pill(vs.color, vs.bg)}>{vs.label}</span>
                </div>
              );
            })}
          </div>
          {overriddenScans.length === 0 && (
            <div style={{ ...S.card, textAlign: "center", color: "#555" }}>
              <ShieldAlert size={48} color="#333" style={{ marginBottom: "12px" }} />
              <div style={{ fontWeight: "700" }}>No overrides recorded yet</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>Go to AI Scans tab to override individual AI decisions</div>
            </div>
          )}
        </div>
      )}

      {/* ===== FRAUD DETECTION TAB ===== */}
      {subTab === "fraud" && (
        <div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} color="#666" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                placeholder="Search fraud alerts..."
                value={fraudSearch}
                onChange={e => setFraudSearch(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px 10px 36px", color: "white", fontSize: "13px", outline: "none" }}
              />
            </div>
            <select value={fraudFilter} onChange={e => setFraudFilter(e.target.value)}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "13px", outline: "none", cursor: "pointer" }}>
              <option value="all">All Alerts</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredFraud.map(alert => {
              const sev = severityStyle(alert.severity);
              return (
                <div key={alert.id} style={{ ...S.card, opacity: alert.resolved ? 0.55 : 1, borderLeft: `3px solid ${alert.resolved ? "#333" : sev.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={S.pill(sev.color, sev.bg)}>{alert.severity.toUpperCase()}</span>
                        <span style={S.pill("#aaa", "rgba(255,255,255,0.05)")}>{fraudTypeLabel(alert.type)}</span>
                        {alert.resolved && <span style={S.pill("#22c55e", "rgba(34,197,94,0.1)")}>RESOLVED</span>}
                      </div>
                      <div style={{ fontSize: "13px", color: "#aaa", fontWeight: "700", marginBottom: "4px" }}>
                        <User size={12} style={{ marginRight: "4px" }} />{alert.user}
                      </div>
                      <div style={{ fontSize: "13px", color: "#888", lineHeight: "1.5" }}>{alert.details}</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "6px" }}>
                        <Clock size={10} style={{ marginRight: "4px" }} />
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!alert.resolved && (
                      <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                        <button onClick={() => handleResolveFraud(alert.id)}
                          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle size={12} /> Resolve
                        </button>
                        <button onClick={() => showToast(`User ${alert.user} flagged for investigation`, "info")}
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Lock size={12} /> Take Action
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== FLAGGED ITEMS TAB ===== */}
      {subTab === "flags" && (
        <div>
          {flaggedScans.length === 0 ? (
            <div style={{ ...S.card, textAlign: "center", padding: "60px" }}>
              <Flag size={48} color="#333" style={{ marginBottom: "12px" }} />
              <div style={{ fontWeight: "700", color: "#555" }}>No flagged submissions</div>
              <div style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>Flagged items from AI scans will appear here</div>
            </div>
          ) : flaggedScans.map(scan => {
            const vs = verdictStyle(scan.verdict, scan.adminOverride);
            return (
              <div key={scan.id} style={{ ...S.card, marginBottom: "12px", borderLeft: "3px solid #ffcc00" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <span style={S.pill("#ffcc00", "rgba(255,204,0,0.15)")}>🚩 FLAGGED</span>
                      <span style={S.pill(vs.color, vs.bg)}>{vs.label}</span>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "900", color: "white", marginBottom: "4px" }}>{scan.recordTitle}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{scan.athlete} · AI Score: <span style={{ color: scan.aiScore < 50 ? "#ef4444" : "#ffcc00", fontWeight: "800" }}>{scan.aiScore}/100</span></div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setSelectedScan(scan)}
                      style={{ background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.3)", color: "#FF5500", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>
                      Override
                    </button>
                    <button onClick={() => handleFlag(scan.id)}
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#888", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>
                      Unflag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CONFIG TAB ===== */}
      {subTab === "config" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Toggle Settings */}
          <div style={S.card}>
            <div style={{ fontSize: "14px", fontWeight: "900", color: "white", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Settings size={16} color="#FF5500" /> Check Modules
            </div>
            {[
              { key: "videoAuthenticityCheck", label: "Video Authenticity Check", desc: "Detect deepfakes and CGI" },
              { key: "metadataAnalysis", label: "Metadata Analysis", desc: "Verify EXIF, GPS, timestamps" },
              { key: "physicsFeasibility", label: "Physics Feasibility", desc: "Human capability validation" },
              { key: "duplicateDetection", label: "Duplicate Detection", desc: "Cross-reference existing footage" },
              { key: "editingDetection", label: "Editing Detection", desc: "Detect cuts, splices, speed changes" },
              { key: "deepfakeDetection", label: "Deepfake Detection", desc: "AI-generated face/body detection" },
              { key: "speedManipulationDetect", label: "Speed Manipulation", desc: "Detect slowed/sped up video" },
              { key: "backgroundDetection", label: "Background Detection", desc: "Detect green screen / CG backgrounds" },
            ].map(item => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "white" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "#555" }}>{item.desc}</div>
                </div>
                <button onClick={() => toggleBool(item.key)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: config[item.key] ? "#22c55e" : "#555" }}>
                  {config[item.key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
            ))}
          </div>

          {/* Threshold Settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={S.card}>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "white", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Activity size={16} color="#FF5500" /> Decision Thresholds
              </div>
              {[
                { key: "autoApproveThreshold", label: "Auto-Approve Above", color: "#22c55e", unit: "%" },
                { key: "flagForReviewThreshold", label: "Flag for Review Below", color: "#ffcc00", unit: "%" },
                { key: "autoRejectThreshold", label: "Auto-Reject Below", color: "#ef4444", unit: "%" },
              ].map(item => (
                <div key={item.key} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#888", fontWeight: "800" }}>{item.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: item.color }}>{config[item.key]}{item.unit}</span>
                  </div>
                  <input type="range" min="0" max="100" value={config[item.key]}
                    onChange={e => setConfig(prev => ({ ...prev, [item.key]: parseInt(e.target.value) }))}
                    style={{ width: "100%", accentColor: item.color }} />
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "white", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap size={16} color="#FF5500" /> Scan Mode
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {["strict", "balanced", "lenient"].map(mode => (
                  <button key={mode} onClick={() => setConfig(prev => ({ ...prev, scanSensitivity: mode }))}
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer", border: config.scanSensitivity === mode ? "2px solid #FF5500" : "1px solid rgba(255,255,255,0.08)", background: config.scanSensitivity === mode ? "rgba(255,85,0,0.15)" : "transparent", color: config.scanSensitivity === mode ? "#FF5500" : "#666", textTransform: "uppercase" }}>
                    {mode}
                  </button>
                ))}
              </div>
              {[
                { key: "realTimeScanning", label: "Real-time Scanning", desc: "Scan as submissions arrive" },
                { key: "aiScanAllSubmissions", label: "Scan All Records", desc: "Include all record submissions" },
                { key: "aiScanChallenges", label: "Scan Challenges", desc: "Include challenge submissions" },
                { key: "notifyOnSuspicious", label: "Alert on Suspicious", desc: "Notify admin when flagged" },
              ].map(item => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "#555" }}>{item.desc}</div>
                  </div>
                  <button onClick={() => toggleBool(item.key)} style={{ background: "transparent", border: "none", cursor: "pointer", color: config[item.key] ? "#22c55e" : "#555" }}>
                    {config[item.key] ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleSaveConfig} disabled={configSaving}
              style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", border: "none", color: "white", padding: "14px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: configSaving ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 4px 14px rgba(255,85,0,0.3)" }}>
              {configSaving ? "SAVING..." : "SAVE AI CONFIGURATION"}
            </button>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {selectedScan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,85,0,0.3)", borderRadius: "24px", width: "100%", maxWidth: "560px", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "950", color: "white", margin: 0 }}>OVERRIDE AI DECISION</h3>
              <button onClick={() => setSelectedScan(null)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "white", marginBottom: "4px" }}>{selectedScan.recordTitle}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                AI Verdict: <span style={{ color: "#ffcc00", fontWeight: "700" }}>{selectedScan.verdict}</span>
                {" · "}AI Score: <span style={{ color: selectedScan.aiScore < 50 ? "#ef4444" : "#22c55e", fontWeight: "700" }}>{selectedScan.aiScore}/100</span>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>New Verdict</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { value: "approved_override", label: "Approve", color: "#22c55e" },
                  { value: "rejected", label: "Reject", color: "#ef4444" },
                  { value: "review_needed", label: "Needs Review", color: "#ffcc00" },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setOverrideVerdict(opt.value)}
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer", border: overrideVerdict === opt.value ? `2px solid ${opt.color}` : "1px solid rgba(255,255,255,0.08)", background: overrideVerdict === opt.value ? `${opt.color}22` : "transparent", color: overrideVerdict === opt.value ? opt.color : "#666" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Reason for Override</label>
              <textarea
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="Explain why you are overriding this AI decision..."
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px", color: "white", fontSize: "13px", outline: "none", minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedScan(null)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#aaa", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "800", fontSize: "12px" }}>CANCEL</button>
              <button onClick={handleOverride} style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", border: "none", color: "white", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "900", fontSize: "12px" }}>CONFIRM OVERRIDE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
