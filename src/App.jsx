
import { useState } from "react";
import {
  LayoutDashboard, Phone, CalendarDays, MessageSquare,
  Users, ChevronDown, ChevronRight, Bell, Menu, Search,
  Clock, PhoneCall, PhoneIncoming, History, Send, X,
  ArrowLeft, CheckCircle2, TrendingUp
} from "lucide-react";
import "./index.css";

const leads = [
  { name: "Priya Iyer", interest: "Billing dispute follow-up", score: 92, intent: 88, phone: "+91 98765 43210", signal: "Asked about resolving a billing issue and requested a callback." },
  { name: "Suresh Nair", interest: "Plan upgrade enquiry", score: 85, intent: 81, phone: "+91 98765 43211", signal: "Compared upgrade options and asked about monthly pricing." },
  { name: "Kavitha R.", interest: "Product enquiry", score: 78, intent: 74, phone: "+91 98765 43212", signal: "Requested more information about available products." },
  { name: "Faizan A.", interest: "Premium plan", score: 73, intent: 69, phone: "+91 98765 43213", signal: "Interested in premium features and follow-up." },
  { name: "Lakshmi R.", interest: "Callback requested", score: 68, intent: 65, phone: "+91 98765 43214", signal: "Missed call; a callback is recommended." }
];

const initialMessages = [
  { name: "Sunita Rao", text: "Our greeting-in-first-10s score is below the weekly target. Please follow the greeting script.", time: "2:05 PM" },
  { name: "Arvind R.", text: "Understood! I'll make sure I open every call with the greeting script.", time: "2:10 PM", mine: true },
  { name: "Sunita Rao", text: "Great attitude! Let's improve the score together.", time: "2:14 PM" }
];

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [planTab, setPlanTab] = useState("Calls to make");
  const [leadIndex, setLeadIndex] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [channel, setChannel] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [taskDone, setTaskDone] = useState(false);

  function notify(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function openPlan(tab) {
    setPage("Plan");
    setPlanTab(tab);
    setExpanded(null);
  }

  function openLead(index) {
    setLeadIndex(index);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages([...messages, { name: "You", text: draft.trim(), time: "Now", mine: true }]);
    setDraft("");
  }

  const nav = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Plan", icon: Phone },
    { label: "Calendar", icon: CalendarDays },
    { label: "Pulse", icon: MessageSquare }
  ];

  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">OG</span> On-Ground.ai</div>
        <div className="side-caption">WORKSPACE</div>
        {nav.map(({ label, icon: Icon }) => (
          <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setChannel(""); }}>
            <Icon size={19} /> <span>{label}</span>
          </button>
        ))}
        {page === "Plan" && (
          <div className="subnav">
            {["Calls to make", "Incoming", "Recent", "Practise a call"].map(tab => (
              <button key={tab} className={planTab === tab ? "subactive" : ""} onClick={() => {
                setPlanTab(tab);
                if (tab === "Practise a call") notify("Demo call ready — no real call will be placed.");
              }}>
                {tab}
              </button>
            ))}
          </div>
        )}
        <div className="sidebar-bottom">
          <div className="avatar">AR</div>
          <div><strong>Arvind Rajan</strong><small>Call Centre Agent</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand">OG <strong>On-Ground.ai</strong></div>
          <div className="top-right"><span className="queue"><span className="dot" /> On Queue</span><button className="icon-button" onClick={() => notify("You are all caught up!") }><Bell size={19}/></button><div className="avatar">AR</div></div>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="hero">
              <div><span className="eyebrow">GOOD AFTERNOON 👋</span><h1>Arvind Rajan</h1><p>The Sleep Company · Call Centre</p></div>
              <button className="date-button" onClick={() => notify("Showing this week's sample data")}>▦ This Week⌄</button>
            </section>
            <section className="stats">
              <Stat title="OG SCORE™" value="76" foot="▲ 13" />
              <Stat title="AVG HANDLE TIME" value="4m 12s" foot="▼ 8%" />
              <Stat title="CSAT TODAY" value="94%" foot="▲ 2pt" />
              <Stat title="IN QUEUE" value="2" foot="• live" />
            </section>
            <div className="dashboard-grid">
              <section className="progress-card">
                <h3>● MY PROGRESS · TODAY</h3>
                <div className="progress-grid"><div><strong>3</strong><span>Leads Created</span></div><div><strong>2</strong><span>Leads Called</span></div></div>
              </section>
              <section className="earnings-card">
                <div className="section-title">💰 My earnings this month</div>
                <h2>₹5,200 <small>₹1,700 from coached moves</small></h2>
                <div className="progress-track"><div /></div>
              </section>
              <section className="waiting-card">
                <h3>WHO'S WAITING</h3>
                {leads.slice(0, 2).map((lead, i) => <button className="waiting-row" key={lead.name} onClick={() => openLead(i)}><span className="mini-avatar">{lead.name[0]}</span><span className="row-copy"><strong>{lead.name}</strong><small>{lead.interest}</small></span><ChevronRight size={17}/></button>)}
              </section>
              <section className="tasks-card">
                <h3>▣ My Tasks <span className="count">3</span></h3>
                <button className="task-row" onClick={() => openPlan("Incoming")}><PhoneCall size={18}/><span><strong>2 callbacks</strong> · next 4:30pm</span><ChevronRight size={17}/></button>
                <button className="task-row" onClick={() => openLead(0)}><Users size={18}/><span><strong>2 hot leads</strong> · untouched 24h</span><ChevronRight size={17}/></button>
                <button className="task-row" onClick={() => { setTaskDone(!taskDone); notify(taskDone ? "Task reopened" : "Outcome marked as logged"); }}><CheckCircle2 size={18}/><span><strong>{taskDone ? "Outcome logged" : "1 outcome"}</strong> · to log</span><ChevronRight size={17}/></button>
              </section>
              <section className="chart-card">
                <h3>CALLS HANDLED · LAST 7 DAYS</h3>
                <div className="bars">{[18,22,15,26,20,12,14].map((n,i) => <div className="bar-column" key={i}><span>{n}</span><div className="bar" style={{height: `${n*2.5}px`}}/><small>{["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i]}</small></div>)}</div>
              </section>
            </div>
          </>
        )}

        {page === "Plan" && (
          <>
            <section className="page-heading"><span className="eyebrow">TODAY'S CALLING PLAN</span><h1>Planner</h1><p>Prioritise follow-ups and keep every customer conversation moving.</p></section>
            <div className="tabs">{["Calls to make", "Incoming", "Recent"].map(t => <button className={planTab === t ? "tab-active" : ""} key={t} onClick={() => {setPlanTab(t);setExpanded(null);}}>{t}</button>)}</div>
            {planTab === "Incoming" && <div className="info-banner"><PhoneIncoming size={20}/> Missed calls · Call back the highest-priority leads first.</div>}
            {planTab === "Recent" && <div className="info-banner"><History size={20}/> Recent calls · Select a customer to review their details.</div>}
            <div className="lead-list">
              {(planTab === "Incoming" ? [leads[4], leads[0], leads[2]] : planTab === "Recent" ? [leads[1], leads[3], leads[4]] : leads).map((lead) => {
                const index = leads.indexOf(lead);
                return <section className="lead-row" key={lead.name}>
                  <button className="lead-summary" onClick={() => setExpanded(expanded === index ? null : index)}>
                    <span className="mini-avatar">{lead.name[0]}</span><span className="row-copy"><strong>{lead.name}</strong><small>{lead.interest}</small></span><span className="score">{lead.score}<small>SCORE</small></span><ChevronDown size={18}/>
                  </button>
                  {expanded === index && <div className="lead-details"><p>{lead.signal}</p><p><strong>Phone:</strong> {lead.phone}</p><p><strong>Intent score:</strong> {lead.intent}/100</p><button className="primary-button" onClick={() => openLead(index)}>View lead profile</button></div>}
                  {planTab === "Incoming" && <div className="callback-row"><span>Missed call · Follow-up recommended</span><button className="primary-button" onClick={() => notify(`Demo callback started for ${lead.name}. No real call placed.`)}><PhoneCall size={15}/> Call back</button></div>}
                </section>;
              })}
            </div>
          </>
        )}

        {page === "Calendar" && (
          <>
            <section className="page-heading"><span className="eyebrow">YOUR SCHEDULE</span><h1>Calendar</h1><p>Review upcoming follow-ups and team events.</p></section>
            <section className="calendar-card">
              <div className="calendar-heading"><button className="secondary-button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}>← Previous</button><h2>{month.toLocaleString("en-IN",{month:"long",year:"numeric"})}</h2><button className="secondary-button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}>Next →</button></div>
              <div className="calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><strong key={d}>{d}</strong>)}{Array.from({length:firstDay},(_,i)=><span key={`blank-${i}`}/>)}{Array.from({length:days},(_,i)=><button key={i} className={`calendar-day ${[5,11,18,24].includes(i+1)?"has-event":""}`} onClick={() => notify(`Selected ${i+1} ${month.toLocaleString("en-IN",{month:"long"})}`)}>{i+1}{[5,11,18,24].includes(i+1)&&<i/>}</button>)}</div>
              <button className="primary-button today-button" onClick={() => setMonth(new Date(2026,9,1))}>Back to October 2026</button>
            </section>
          </>
        )}

        {page === "Pulse" && (
          <>
            {!channel ? <><section className="page-heading"><span className="eyebrow">TEAM COMMUNICATION</span><h1>Pulse</h1><p>Updates, coaching and conversations with your team.</p></section><div className="channel-list">{["Call Centre Team","All Stores","Avani AI Coaching"].map((c,i)=><button className="channel-row" key={c} onClick={() => setChannel(c)}><span className="channel-icon">{i===2?"✦":"#"}</span><span className="row-copy"><strong>{c}</strong><small>{["Team updates and shift discussions","Campaign announcements and offers","Suggestions to improve your calls"][i]}</small></span><ChevronRight/></button>)}</div></> :
            <><div className="chat-heading"><button className="secondary-button" onClick={() => setChannel("")}><ArrowLeft size={16}/> Channels</button><h2># {channel.toLowerCase().replaceAll(" ","-")}</h2></div>
            <section className="pinned"><strong>📌 Needs your input</strong><p>Confirm the 4:30pm callback</p><small>Priya Iyer · likely billing dispute</small><div className="pinned-actions"><button className="secondary-button" onClick={() => {setTaskDone(true);notify("Callback confirmation recorded");}}>Confirmed</button><button className="secondary-button" onClick={() => notify("Reschedule noted in this demo")}>Reschedule</button></div></section>
            <section className="chat-messages">{messages.map((m,i)=><div key={i} className={`message ${m.mine?"mine":""}`}><small>{m.name} · {m.time}</small><div>{m.text}</div></div>)}</section>
            <form className="message-form" onSubmit={sendMessage}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder={`Message #${channel.toLowerCase().replaceAll(" ","-")}...`}/><button className="primary-button" aria-label="Send message"><Send size={17}/></button></form></>}
          </>
        )}
      </main>

      {leadIndex !== null && <div className="modal-backdrop" onClick={() => setLeadIndex(null)}><section className="lead-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-heading"><div><span className="eyebrow">LEAD PROFILE</span><h2>{leads[leadIndex].name}</h2><p>{leads[leadIndex].interest}</p></div><button className="icon-button" onClick={() => setLeadIndex(null)}><X/></button></div>
        <div className="score-grid"><div><small>ICP SCORE</small><strong>{leads[leadIndex].score}</strong></div><div><small>LEAD INTENT</small><strong>{leads[leadIndex].intent}</strong></div></div>
        <h3>Buying signals</h3><p className="signal-copy">{leads[leadIndex].signal}</p><p><strong>Phone:</strong> {leads[leadIndex].phone}</p>
        <div className="modal-actions"><button className="secondary-button" onClick={() => setLeadIndex((leadIndex+leads.length-1)%leads.length)}>← Previous</button><button className="primary-button" onClick={() => setLeadIndex((leadIndex+1)%leads.length)}>Next →</button></div>
      </section></div>}
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}

function Stat({title,value,foot}) {
  return <div className="stat-card"><small>{title}</small><strong>{value}</strong><span>{foot}</span></div>;
}
