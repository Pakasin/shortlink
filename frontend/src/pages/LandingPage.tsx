import { useState } from "react";
import {
  Link2, CheckCircle, QrCode, BarChart2, Globe, Shield,
  Copy, ExternalLink, TrendingUp, Filter, Download, Bell,
  Share2, ArrowRight, Smartphone, Monitor, LayoutDashboard, LogOut, User,
  Sun, Moon, Languages,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

const QRCodeSVG = () => (
  <svg viewBox="0 0 21 21" style={{ width:"100%", height:"100%", padding:"14px" }} shapeRendering="crispEdges">
    <rect width="21" height="21" fill="transparent"/>
    <rect x="0" y="0" width="7" height="7" fill="#3b82f6" opacity="0.9"/>
    <rect x="1" y="1" width="5" height="5" fill="#0f172a"/>
    <rect x="2" y="2" width="3" height="3" fill="#3b82f6"/>
    <rect x="14" y="0" width="7" height="7" fill="#3b82f6" opacity="0.9"/>
    <rect x="15" y="1" width="5" height="5" fill="#0f172a"/>
    <rect x="16" y="2" width="3" height="3" fill="#3b82f6"/>
    <rect x="0" y="14" width="7" height="7" fill="#3b82f6" opacity="0.9"/>
    <rect x="1" y="15" width="5" height="5" fill="#0f172a"/>
    <rect x="2" y="16" width="3" height="3" fill="#3b82f6"/>
    {[[8,0],[10,0],[12,0],[9,1],[11,1],[8,2],[12,2],[10,3],[11,3],[8,4],[9,5],[11,5],[12,5],[8,6],[10,6],
      [0,8],[2,8],[4,8],[6,8],[8,8],[10,8],[12,8],[14,8],[16,8],[18,8],[20,8],
      [1,9],[3,9],[7,9],[11,9],[15,9],[19,9],[0,10],[4,10],[8,10],[10,10],[12,10],[16,10],[20,10],
      [2,11],[6,11],[9,11],[14,11],[18,11],[0,12],[3,12],[5,12],[8,12],[11,12],[13,12],[17,12],[20,12],
      [8,13],[10,13],[12,13],[14,13],[16,13],[8,14],[9,14],[11,14],[14,14],[16,14],[18,14],[20,14],
      [8,15],[10,15],[15,15],[17,15],[19,15],[8,16],[12,16],[14,16],[16,16],[20,16],
      [9,17],[11,17],[13,17],[15,17],[18,17],[8,18],[10,18],[12,18],[14,18],[16,18],[19,18],[20,18],
    ].map(([x,y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#3b82f6" opacity="0.75"/>)}
  </svg>
);

export default function LandingPage() {
  const { isDarkMode, toggleDarkMode, language, toggleLanguage, t, user, isAuthenticated, logout } = useAuth();
  const dm = isDarkMode;

  const [url, setUrl]           = useState("");
  const [shortened, setShortened] = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = user?.name || user?.email || "";

  /* ── Theme tokens ── */
  const theme = dm ? {
    pageBg:"#0f172a", text:"white", muted:"#94a3b8", subtle:"#475569",
    section:"#1e293b", navBg:"rgba(15,23,42,0.88)", navBorder:"rgba(255,255,255,0.07)",
    cardBg:"rgba(255,255,255,0.06)", cardBorder:"rgba(255,255,255,0.08)",
    softBg:"rgba(255,255,255,0.04)", inputIcon:"#475569",
    menuBg:"#1e293b", menuText:"#cbd5e1", footerText:"#334155", link:"#94a3b8",
  } : {
    pageBg:"#f8fafc", text:"#0f172a", muted:"#475569", subtle:"#64748b",
    section:"#eef2ff", navBg:"rgba(255,255,255,0.92)", navBorder:"rgba(15,23,42,0.08)",
    cardBg:"rgba(255,255,255,0.95)", cardBorder:"rgba(148,163,184,0.25)",
    softBg:"rgba(241,245,249,0.8)", inputIcon:"#64748b",
    menuBg:"#ffffff", menuText:"#334155", footerText:"#64748b", link:"#475569",
  };

  const glassCard = dm ? {
    background:"linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.04) 100%)",
    backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.12)", borderRadius:"24px",
    boxShadow:"0 8px 32px rgba(0,0,0,0.25)",
  } : {
    background:"rgba(255,255,255,0.95)",
    backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
    border:"1px solid rgba(148,163,184,0.25)", borderRadius:"24px",
    boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
  };

  const chartBars = [65,82,45,90,78,55,72];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const handleCopy = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", backgroundColor:theme.pageBg, color:theme.text, overflowX:"hidden" }}>
      <style>{`
        @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes floatUp2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes growBar  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes livePing { 75%,100%{transform:scale(2.2);opacity:0} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .gradient-bg { background:linear-gradient(-45deg,#0f172a,#1e293b,#1e3a8a,#312e81); background-size:400% 400%; animation:gradientShift 15s ease infinite; }
        .float-1 { animation:floatUp 6s ease-in-out infinite; }
        .float-2 { animation:floatUp2 6s ease-in-out 2s infinite; }
        .bar  { transform-origin:bottom; animation:growBar 0.8s ease-out both; }
        .live-dot { animation:livePing 1.5s cubic-bezier(0,0,0.2,1) infinite; }
        .card-lift { transition:transform 0.3s ease; }
        .card-lift:hover { transform:translateY(-5px); }
        .nav-lnk { color:${theme.link}; text-decoration:none; font-size:14px; transition:color .2s; }
        .nav-lnk:hover { color:${theme.text}; }
        .foot-lnk { color:${theme.footerText}; text-decoration:none; font-size:13px; transition:color .2s; }
        .foot-lnk:hover { color:${theme.text}; }
        .user-menu { animation:fadeIn 0.2s ease; }
        .menu-item:hover { background:${dm?"rgba(255,255,255,0.08)":"rgba(59,130,246,0.08)"} !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background:theme.navBg, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderBottom:`1px solid ${theme.navBorder}`,
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Link2 size={18} color="white"/>
            </div>
            {/* ✅ FIX: ใช้ solid color ใน Light Mode — ไม่ต้องพึ่ง gradient clip */}
            <span style={{
              fontWeight:800, fontSize:20,
              color: dm ? undefined : "#1e40af",
              ...(dm && {
                background:"linear-gradient(to right,#fff,#93c5fd)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
              }),
            }}>
              LinkPulse
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            <a href="#features" className="nav-lnk">{t.landing.features}</a>
            <a href="#analytics" className="nav-lnk">{t.nav.analytics}</a>
          </div>

          {/* Right controls */}
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <button onClick={toggleLanguage} style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 12px",
              borderRadius:10, border:`1px solid ${theme.navBorder}`, cursor:"pointer",
              background:theme.softBg, color:theme.link, fontSize:12, fontWeight:700,
            }}>
              <Languages size={14}/> {language === "th" ? "EN" : "TH"}
            </button>

            {/* Dark/Light toggle */}
            <button onClick={toggleDarkMode} style={{
              width:38, height:38, borderRadius:10, border:`1px solid ${theme.navBorder}`,
              cursor:"pointer", background:theme.softBg, color:theme.link,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {dm ? <Sun size={16}/> : <Moon size={16}/>}
            </button>

            {!isAuthenticated ? (
              <>
                <a href="/login" className="nav-lnk">{t.landing.signIn}</a>
                <a href="/register" style={{
                  background:"linear-gradient(135deg,#3b82f6,#2563eb)", color:"white",
                  padding:"10px 20px", borderRadius:12, fontSize:14, fontWeight:600,
                  textDecoration:"none", boxShadow:"0 4px 14px rgba(59,130,246,0.35)",
                }}>
                  {t.nav.getStarted}
                </a>
              </>
            ) : (
              <>
                <a href="/dashboard" style={{
                  display:"flex", alignItems:"center", gap:6, color:theme.link,
                  textDecoration:"none", fontSize:14, fontWeight:500,
                  padding:"8px 14px", borderRadius:10, background:theme.softBg,
                }}>
                  <LayoutDashboard size={15}/> {t.nav.dashboard}
                </a>
                <div style={{ position:"relative" }}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                    width:38, height:38, borderRadius:"50%",
                    background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                    border:"2px solid rgba(59,130,246,0.4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", color:"white",
                  }}>
                    <User size={16}/>
                  </button>
                  {showUserMenu && (
                    <div className="user-menu" style={{
                      position:"absolute", top:"calc(100% + 10px)", right:0,
                      background:theme.menuBg, border:`1px solid ${theme.navBorder}`,
                      borderRadius:14, padding:6, minWidth:180,
                      boxShadow:"0 16px 40px rgba(0,0,0,0.18)",
                    }}>
                      {userName && (
                        <div style={{ padding:"10px 14px", fontSize:12, color:theme.subtle, borderBottom:`1px solid ${theme.navBorder}`, marginBottom:4 }}>
                          {userName}
                        </div>
                      )}
                      <a href="/profile" className="menu-item" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, color:theme.menuText, fontSize:13, fontWeight:500, textDecoration:"none" }}>
                        <User size={14}/> {t.landing.profile}
                      </a>
                      <a href="/dashboard" className="menu-item" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, color:theme.menuText, fontSize:13, fontWeight:500, textDecoration:"none" }}>
                        <LayoutDashboard size={14}/> {t.nav.dashboard}
                      </a>
                      <div style={{ height:1, background:theme.navBorder, margin:"4px 0" }}/>
                      <button onClick={() => { logout(); setShowUserMenu(false); }} className="menu-item" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, color:"#f87171", fontSize:13, fontWeight:500, background:"transparent", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}>
                        <LogOut size={14}/> {t.landing.signOut}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className={dm ? "gradient-bg" : ""}
        style={{
          position:"relative", paddingTop:128, paddingBottom:96, overflow:"hidden",
          background: dm ? undefined : "linear-gradient(135deg,#eff6ff 0%,#eef2ff 45%,#f0f9ff 100%)",
        }}
      >
        <div style={{ position:"absolute", top:-160, right:-160, width:384, height:384, borderRadius:"50%", background:dm?"rgba(59,130,246,0.13)":"rgba(59,130,246,0.10)", filter:"blur(80px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-160, left:-160, width:384, height:384, borderRadius:"50%", background:dm?"rgba(29,78,216,0.12)":"rgba(99,102,241,0.08)", filter:"blur(80px)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div>
              {/* Badge */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px",
                borderRadius:999, marginBottom:24, backdropFilter:"blur(8px)",
                background: dm ? "rgba(255,255,255,0.07)" : "rgba(59,130,246,0.08)",
                border: dm ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(59,130,246,0.2)",
              }}>
                <span style={{ position:"relative", display:"inline-flex", width:8, height:8 }}>
                  <span className="live-dot" style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade80", opacity:0.75 }}/>
                  <span style={{ position:"relative", width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"block" }}/>
                </span>
                <span style={{ fontSize:12, fontWeight:600, color: dm ? "#d1d5db" : "#1e40af" }}>
                  {t.landing.badge}
                </span>
              </div>

              {/* H1 */}
              <h1 style={{ fontWeight:800, fontSize:"clamp(2.5rem,5vw,4.25rem)", lineHeight:1.05, marginBottom:20, color:theme.text }}>
                {t.landing.heroTitle1},<br/>
                {/* ✅ FIX: ใช้ solid color ใน Light Mode แทน gradient clip */}
                <span style={
                  dm
                    ? { background:"linear-gradient(to right,#60a5fa,#93c5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
                    : { color:"#2563eb" }
                }>
                  {t.landing.heroTitle2}
                </span>
              </h1>

              <p style={{ fontSize:17, color:theme.muted, maxWidth:480, lineHeight:1.75, marginBottom:32 }}>
                {t.landing.heroDesc}
              </p>

              {/* Input box */}
              <div style={{ padding:8, borderRadius:18, maxWidth:520, background:theme.cardBg, backdropFilter:"blur(10px)", border:`1px solid ${theme.cardBorder}` }}>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, display:"flex", alignItems:"center", gap:12, padding:"0 16px", borderRadius:12, background:theme.softBg, border:`1px solid ${theme.cardBorder}` }}>
                    <Link2 size={16} color={theme.inputIcon} style={{ flexShrink:0 }}/>
                    <input
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !loading && url.trim()}
                      placeholder={t.landing.inputPlaceholder}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", color:theme.text, fontSize:14, fontWeight:500, padding:"14px 0" }}
                    />
                  </div>
                  <button
                    disabled={loading || !url.trim()}
                    style={{ padding:"0 24px", borderRadius:12, fontWeight:700, fontSize:14, color:"white", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", background:"linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow:"0 6px 16px rgba(59,130,246,0.3)", opacity:(loading||!url.trim())?0.5:1 }}
                  >
                    {loading ? "..." : <><span>{t.landing.shorten}</span><ArrowRight size={14}/></>}
                  </button>
                </div>
              </div>

              {/* Shortened result */}
              {shortened && (
                <div style={{ marginTop:12, padding:"12px 16px", borderRadius:14, maxWidth:520, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.22)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                    <CheckCircle size={14} color="#3b82f6" style={{ flexShrink:0 }}/>
                    <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13, color:"#3b82f6", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{shortened}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={handleCopy} style={{ padding:"6px 10px", borderRadius:8, border:"none", cursor:"pointer", background:copied?"#16a34a":"#3b82f6", display:"flex", alignItems:"center" }}>
                      {copied ? <CheckCircle size={12} color="white"/> : <Copy size={12} color="white"/>}
                    </button>
                    <a href={shortened} target="_blank" rel="noreferrer" style={{ padding:"6px 10px", borderRadius:8, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center" }}>
                      <ExternalLink size={12} color="#60a5fa"/>
                    </a>
                  </div>
                </div>
              )}

              {/* Feature badges */}
              <div style={{ marginTop:20, display:"flex", flexWrap:"wrap", gap:24 }}>
                {[
                  { icon:<CheckCircle size={13} color="#22c55e"/>, text:t.landing.freeForever },
                  { icon:<QrCode size={13} color="#22c55e"/>,      text:t.landing.dynamicQR },
                  { icon:<Globe size={13} color="#22c55e"/>,        text:t.landing.customDomains },
                ].map(b => (
                  <span key={b.text} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:theme.subtle }}>
                    {b.icon}{b.text}
                  </span>
                ))}
              </div>
            </div>

            {/* QR Preview Card */}
            <div className="float-1" style={{ position:"relative", display:"flex", justifyContent:"center" }}>
              <div style={{ ...glassCard, padding:24, width:"100%", maxWidth:360 }}>
                <div style={{ width:200, height:200, margin:"0 auto 16px", borderRadius:18, overflow:"hidden", background:"#0f172a" }}>
                  <QRCodeSVG/>
                </div>
                <div style={{ textAlign:"center", marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", color:"#3b82f6", textTransform:"uppercase", marginBottom:4 }}>Live Preview</div>
                  <div style={{ fontWeight:800, fontSize:16, color:theme.text }}>pulse.link/v7-p3r</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                  {[
                    { val:"24,892", label:"Total Clicks", up:"+12.5%", color:"#22c55e" },
                    { val:"8,234",  label:"QR Scans",    up:"+8.2%",  color:"#3b82f6" },
                  ].map(s => (
                    <div key={s.label} style={{
                      padding:12, borderRadius:14,
                      background: dm ? "rgba(255,255,255,0.04)" : "rgba(59,130,246,0.05)",
                      border:     dm ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(59,130,246,0.12)",
                    }}>
                      <div style={{ fontSize:18, fontWeight:800, color:theme.text }}>{s.val}</div>
                      <div style={{ fontSize:11, color:theme.subtle, marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontSize:11, color:s.color, display:"flex", alignItems:"center", gap:3 }}>
                        <TrendingUp size={9}/>{s.up}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, fontSize:11, color:theme.subtle }}>
                    <span>Traffic Overview</span>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ position:"relative", display:"inline-flex", width:6, height:6 }}>
                        <span className="live-dot" style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade80", opacity:0.75 }}/>
                        <span style={{ position:"relative", width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"block" }}/>
                      </span>
                      Live
                    </span>
                  </div>
                  <div style={{ height:52, display:"flex", alignItems:"flex-end", gap:3 }}>
                    {chartBars.map((h,i) => (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                        <div className="bar" style={{ width:"100%", borderRadius:"4px 4px 0 0", height:`${h*0.45}px`, background:"linear-gradient(to top,#2563eb,#60a5fa)", animationDelay:`${i*0.1}s` }}/>
                        <span style={{ fontSize:9, color:theme.subtle }}>{days[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:theme.section, borderTop:`1px solid ${theme.navBorder}`, borderBottom:`1px solid ${theme.navBorder}`, padding:"40px 0" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, textAlign:"center" }}>
          {[
            { val:"50K+",  label:t.landing.statsArchitects },
            { val:"12M+",  label:t.landing.statsLinks },
            { val:"99.9%", label:t.landing.statsUptime },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontWeight:800, fontSize:"clamp(1.75rem,3vw,2.5rem)", background:"linear-gradient(to right,#60a5fa,#3b82f6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {s.val}
              </div>
              <div style={{ fontSize:14, color:theme.subtle, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:theme.pageBg, padding:"96px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <h2 style={{ fontWeight:800, fontSize:"clamp(2rem,4vw,3rem)", marginBottom:16, color:theme.text }}>
              {t.landing.featuresTitle1},<br/>
              <span style={ dm
                ? { background:"linear-gradient(to right,#60a5fa,#2563eb)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
                : { color:"#2563eb" }
              }>
                {t.landing.featuresTitle2}
              </span>
            </h2>
            <p style={{ color:theme.subtle, fontSize:17, maxWidth:480, margin:"0 auto" }}>{t.landing.featuresDesc}</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {/* Granular Analytics */}
            <div className="card-lift" style={{ ...glassCard, gridColumn:"span 2", padding:40, minHeight:320, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
              <div>
                <div style={{ width:48, height:48, borderRadius:14, background:"rgba(59,130,246,0.14)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <BarChart2 size={22} color="#3b82f6"/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:20, marginBottom:12, color:theme.text }}>Granular Analytics</h3>
                <p style={{ color:theme.subtle, fontSize:14, lineHeight:1.75, maxWidth:400 }}>Deep-dive into your link performance with real-time data and insights.</p>
              </div>
              <div style={{ height:72, display:"flex", alignItems:"flex-end", gap:6, marginTop:24 }}>
                {[38,65,45,90,55,78,42,95,60,82].map((h,i) => (
                  <div key={i} className="bar" style={{ flex:1, borderRadius:"4px 4px 0 0", height:`${h}%`, background: i===9 ? "linear-gradient(to top,#2563eb,#60a5fa)" : `rgba(59,130,246,${Math.min(h/100+0.1,0.55)})`, animationDelay:`${i*0.07}s` }}/>
                ))}
              </div>
            </div>

            {/* Dynamic QR — always dark-purple card */}
            <div className="card-lift" style={{ ...glassCard, padding:40, minHeight:320, display:"flex", flexDirection:"column", justifyContent:"space-between", background:"linear-gradient(135deg,rgba(124,58,237,0.9) 0%,rgba(109,40,217,0.85) 100%)", borderColor:"rgba(167,139,250,0.3)" }}>
              <div>
                <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <QrCode size={22} color="white"/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:20, marginBottom:12, color:"white" }}>Dynamic QR Engine</h3>
                <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.75 }}>Generate and update QR codes dynamically without reprinting.</p>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", opacity:0.2, marginTop:24 }}>
                <QrCode size={72} color="white"/>
              </div>
            </div>

            {/* Custom Domains */}
            <div className="card-lift" style={{ ...glassCard, padding:32 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"rgba(34,197,94,0.14)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <Globe size={22} color="#22c55e"/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:18, marginBottom:10, color:theme.text }}>Custom Domains</h3>
              <p style={{ color:theme.subtle, fontSize:14, lineHeight:1.75 }}>Use your own domain for a branded experience.</p>
            </div>

            {/* Enterprise Security */}
            <div className="card-lift" style={{ ...glassCard, gridColumn:"span 2", padding:40, display:"flex", alignItems:"center", gap:32 }}>
              <div style={{ flex:1 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"rgba(239,68,68,0.14)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <Shield size={22} color="#f87171"/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:20, marginBottom:12, color:theme.text }}>Enterprise Security</h3>
                <p style={{ color:theme.subtle, fontSize:14, lineHeight:1.75, maxWidth:380, marginBottom:20 }}>
                  SSL encryption, link expiration, and password protection built in.
                </p>
                <button style={{
                  padding:"10px 20px", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer",
                  color:      dm ? "white"                           : "#1e40af",
                  border:     dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(59,130,246,0.25)",
                  background: dm ? "rgba(255,255,255,0.06)"          : "rgba(59,130,246,0.06)",
                }}>Learn More</button>
              </div>
              <Shield size={100} color="rgba(59,130,246,0.1)" style={{ flexShrink:0 }}/>
            </div>

            {/* Conversion Tracking */}
            <div className="card-lift" style={{ ...glassCard, padding:32 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"rgba(245,158,11,0.14)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <TrendingUp size={22} color="#f59e0b"/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:18, marginBottom:10, color:theme.text }}>Conversion Tracking</h3>
              <p style={{ color:theme.subtle, fontSize:14, lineHeight:1.75 }}>Track every click and optimize your campaigns in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYTICS ── */}
      <section
        id="analytics"
        className={dm ? "gradient-bg" : ""}
        style={{ background:dm ? undefined : theme.section, padding:"96px 0" }}
      >
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <h2 style={{ fontWeight:800, fontSize:"clamp(2rem,4vw,3rem)", marginBottom:16, color:theme.text }}>
              Analytics That{" "}
              <span style={ dm
                ? { background:"linear-gradient(to right,#60a5fa,#2563eb)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
                : { color:"#2563eb" }
              }>
                Actually Matter
              </span>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              {[
                { icon:<Filter size={22} color="#3b82f6"/>,   title:"Advanced Filtering", desc:"Filter by date, device, region, and referral source." },
                { icon:<Download size={22} color="#3b82f6"/>, title:"Export Reports",      desc:"Download CSV or PDF reports for any date range." },
                { icon:<Bell size={22} color="#3b82f6"/>,     title:"Smart Alerts",        desc:"Get notified when clicks spike or drop unexpectedly." },
                { icon:<Share2 size={22} color="#3b82f6"/>,   title:"Team Sharing",        desc:"Share analytics dashboards with your whole team." },
              ].map(f => (
                <div key={f.title} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:"rgba(59,130,246,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontWeight:700, fontSize:17, marginBottom:6, color:theme.text }}>{f.title}</h3>
                    <p style={{ color:theme.subtle, fontSize:14, lineHeight:1.7 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Traffic Sources */}
              <div className="float-1" style={{ ...glassCard, padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <span style={{ fontWeight:600, fontSize:15, color:theme.text }}>Traffic Sources</span>
                  <span style={{ fontSize:11, color:theme.subtle }}>Last 30 Days</span>
                </div>
                {[
                  { label:"Direct",   pct:42, color:"#3b82f6" },
                  { label:"Social",   pct:28, color:"#22c55e" },
                  { label:"Search",   pct:18, color:"#60a5fa" },
                  { label:"Referral", pct:12, color:"#a78bfa" },
                ].map(s => (
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <span style={{ fontSize:13, color:theme.muted, width:64, flexShrink:0 }}>{s.label}</span>
                    <div style={{ flex:1, height:6, borderRadius:999, background: dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)" }}>
                      <div style={{ height:"100%", borderRadius:999, background:s.color, width:`${s.pct}%` }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:700, width:36, textAlign:"right", color:theme.text }}>{s.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Device Breakdown */}
              <div className="float-2" style={{ ...glassCard, padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <span style={{ fontWeight:600, fontSize:15, color:theme.text }}>Device Breakdown</span>
                  <span style={{ fontSize:11, color:theme.subtle }}>All Time</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  {[
                    { icon:<Monitor size={26} color="#60a5fa"/>,    val:"58%", label:"Desktop" },
                    { icon:<Smartphone size={26} color="#4ade80"/>, val:"35%", label:"Mobile" },
                    { icon:<Globe size={26} color="#a78bfa"/>,      val:"7%",  label:"Tablet" },
                  ].map(d => (
                    <div key={d.label} style={{ textAlign:"center", padding:16, borderRadius:18, background: dm?"rgba(255,255,255,0.04)":"rgba(59,130,246,0.05)" }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>{d.icon}</div>
                      <div style={{ fontWeight:800, fontSize:22, color:theme.text }}>{d.val}</div>
                      <div style={{ fontSize:11, color:theme.subtle, marginTop:2 }}>{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:theme.pageBg, padding:"96px 0" }}>
        <div style={{ maxWidth:780, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(2rem,4vw,3rem)", marginBottom:16, color:theme.text }}>
            {t.landing.ctaTitle1}<br/>
            <span style={ dm
              ? { background:"linear-gradient(to right,#60a5fa,#2563eb)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
              : { color:"#2563eb" }
            }>
              {t.landing.ctaTitle2}
            </span>
          </h2>
          <p style={{ color:theme.subtle, fontSize:17, marginBottom:40, lineHeight:1.7 }}>{t.landing.ctaDesc}</p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            {!isAuthenticated ? (
              <a href="/register" style={{ padding:"16px 36px", borderRadius:14, fontWeight:700, fontSize:16, color:"white", textDecoration:"none", display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow:"0 12px 28px rgba(59,130,246,0.3)" }}>
                {t.landing.getStartedFree} <ArrowRight size={18}/>
              </a>
            ) : (
              <a href="/dashboard" style={{ padding:"16px 36px", borderRadius:14, fontWeight:700, fontSize:16, color:"white", textDecoration:"none", display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow:"0 12px 28px rgba(59,130,246,0.3)" }}>
                {t.landing.goToDashboard} <LayoutDashboard size={18}/>
              </a>
            )}
            <a href="#features" style={{ padding:"16px 36px", borderRadius:14, fontWeight:700, fontSize:16, textDecoration:"none", color:theme.text, background:theme.cardBg, border:`1px solid ${theme.cardBorder}` }}>
              {t.landing.exploreFeatures}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:theme.section, borderTop:`1px solid ${theme.navBorder}`, padding:"48px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Link2 size={15} color="white"/>
            </div>
            <span style={{ fontWeight:800, fontSize:18, color:theme.text }}>LinkPulse</span>
          </div>
          <p style={{ fontSize:13, color:theme.footerText }}>{t.landing.footerCopyright}</p>
          <div style={{ display:"flex", gap:24 }}>
            {[t.landing.privacyPolicy, t.landing.terms, t.landing.contact].map(l => (
              <a key={l} href="#" className="foot-lnk">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
