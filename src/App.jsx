
import { useState } from "react";
import CallPanel from "./CallPanel";
import {
  LayoutDashboard,
  Phone,
  CalendarDays,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Bell,
  Clock,
  PhoneCall,
  History,
  Send,
  X,
  ArrowLeft,
  TrendingUp,
  Users,
  Wallet,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import "./index.css";

const leads = [
  {
    name: "Priya Iyer",
    interest: "Billing dispute follow-up",
    score: 92,
    intent: 88,
    phone: "+91 98765 43210",
    signal: "Asked about resolving a billing issue and requested a callback.",
  },
  {
    name: "Suresh Nair",
    interest: "Plan upgrade enquiry",
    score: 85,
    intent: 81,
    phone: "+91 98765 43211",
    signal: "Compared upgrade options and asked about monthly pricing.",
  },
  {
    name: "Kavitha R.",
    interest: "Product enquiry",
    score: 78,
    intent: 74,
    phone: "+91 98765 43212",
    signal: "Requested more information about available products.",
  },
  {
    name: "Faizan A.",
    interest: "Premium plan",
    score: 73,
    intent: 69,
    phone: "+91 98765 43213",
    signal: "Interested in premium features and follow-up.",
  },
  {
    name: "Lakshmi R.",
    interest: "Callback requested",
    score: 68,
    intent: 65,
    phone: "+91 98765 43214",
    signal: "Missed call; a callback is recommended.",
  },
];

const initialMessages = [
  {
    name: "Sunita Rao",
    text: "Our greeting-in-first-10s score is below the weekly target. Please follow the greeting script.",
    time: "2:05 PM",
  },
  {
    name: "Arvind R.",
    text: "Understood! I'll make sure I open every call with the greeting script.",
    time: "2:10 PM",
    mine: true,
  },
  {
    name: "Sunita Rao",
    text: "Great attitude! Let's improve the score together.",
    time: "2:14 PM",
  },
];

const nav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Plan", icon: Phone },
  { label: "Calendar", icon: CalendarDays },
  { label: "Pulse", icon: MessageSquare },
  { label: "Voice Call", icon: PhoneCall },
];
export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [planTab, setPlanTab] = useState("Calls to make");
  const [callPage, setCallPage] = useState(0);
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
    setCallPage(0);
  }

  function openLead(index) {
    setLeadIndex(index);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;

    setMessages((previous) => [
      ...previous,
      {
        name: "You",
        text: draft.trim(),
        time: "Now",
        mine: true,
      },
    ]);
    setDraft("");
  }

  const days = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    month.getFullYear(),
    month.getMonth(),
    1
  ).getDay();

  const pageSize = 2;
  const totalCallPages = Math.ceil(leads.length / pageSize);

  const visibleOutgoingLeads = leads.slice(
    callPage * pageSize,
    callPage * pageSize + pageSize
  );

  const displayedLeads =
    planTab === "Incoming"
      ? [leads[4], leads[0], leads[2]]
      : planTab === "Recent"
      ? [leads[1], leads[3], leads[4]]
      : visibleOutgoingLeads;

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">OG</span>
          On-Ground.ai
        </div>

        <div className="side-caption">WORKSPACE</div>

        {nav.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${page === label ? "active" : ""}`}
            onClick={() => {
              setPage(label);
              setChannel("");
            }}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}

        {page === "Plan" && (
          <div className="sidebar-submenu">
            {["Calls to make", "Incoming", "Recent"].map((tab) => (
              <button
                key={tab}
                className={planTab === tab ? "active" : ""}
                onClick={() => openPlan(tab)}
              >
                {tab}
              </button>
            ))}
            <button onClick={() => notify("Practice call demo selected")}>
              Practise a call
            </button>
          </div>
        )}

        <div className="sidebar-user">
          <span className="mini-avatar">AR</span>
          <span>
            <strong>Arvind Rajan</strong>
            <small>Call Centre Agent</small>
          </span>
        </div>
      </aside>

      {/* Main application area */}
      <div className="app-body">
        <header className="topbar">
          <div className="brand-mark">OG</div>
          <strong>On-Ground.ai</strong>
          <div className="topbar-actions">
            <span className="queue-status">● On Queue</span>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => notify("You are all caught up")}
            >
              <Bell size={19} />
            </button>
            <span className="mini-avatar">AR</span>
          </div>
        </header>

        <main className="main-content">
          {/* Dashboard */}
          {page === "Dashboard" && (
            <>
              <section className="hero">
                <span>GOOD AFTERNOON 👋</span>
                <h1>Arvind Rajan</h1>
                <p>The Sleep Company · Call Centre</p>
                <div className="stats">
                  <Stat title="OG SCORE™" value="76" foot="▲ 13" />
                  <Stat title="AVG HANDLE TIME" value="4m 12s" foot="▼ 8%" />
                  <Stat title="CSAT TODAY" value="94%" foot="▲ 2pt" />
                  <Stat title="IN QUEUE" value="2" foot="• live" />
                </div>
              </section>

              <div className="dashboard-grid">
                <section className="progress-card">
                  <h3>● MY PROGRESS · TODAY</h3>
                  <div className="progress-stats">
                    <div>
                      <strong>3</strong>
                      <span>Leads Created</span>
                    </div>
                    <div>
                      <strong>2</strong>
                      <span>Leads Called</span>
                    </div>
                  </div>
                </section>

                <section className="earnings-card">
                  <h3>💰 My earnings this month</h3>
                  <strong>₹5,200</strong>
                  <p>₹1,700 from coached moves</p>
                  <div className="progress-track">
                    <div />
                  </div>
                </section>

                <section className="waiting-card">
                  <h3>WHO'S WAITING</h3>
                  {leads.slice(0, 2).map((lead, i) => (
                    <button
                      className="waiting-row"
                      key={lead.name}
                      onClick={() => openLead(i)}
                    >
                      <span className="mini-avatar">{lead.name[0]}</span>
                      <span>
                        <strong>{lead.name}</strong>
                        <small>{lead.interest}</small>
                      </span>
                      <ChevronRight size={17} />
                    </button>
                  ))}
                  <button
                    className="text-button"
                    onClick={() => openPlan("Calls to make")}
                  >
                    Open planner →
                  </button>
                </section>

                <section className="tasks-card">
                  <h3>My Tasks · 3</h3>
                  <button onClick={() => openPlan("Incoming")}>
                    <PhoneCall size={17} /> 2 callbacks · next 4:30pm
                    <ChevronRight size={17} />
                  </button>
                  <button onClick={() => openPlan("Calls to make")}>
                    <Users size={17} /> 2 hot leads · untouched 24h
                    <ChevronRight size={17} />
                  </button>
                  <button onClick={() => notify("Outcome logging opened")}>
                    <CheckCircle2 size={17} /> 1 outcome to log
                    <ChevronRight size={17} />
                  </button>
                </section>

                <section className="chart-card">
                  <h3>CALLS HANDLED · LAST 7 DAYS</h3>
                  <div className="bar-chart">
                    {[18, 22, 15, 26, 20, 12, 14].map((value, i) => (
                      <div className="bar-column" key={i}>
                        <span>{value}</span>
                        <div style={{ height: `${value * 4}px` }} />
                        <small>
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"][i]}
                        </small>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Plan */}
          {page === "Plan" && (
            <>
              <section className="page-heading">
                <span className="eyebrow">TODAY'S CALLING PLAN</span>
                <h1>Planner</h1>
                <p>Prioritise follow-ups and keep every customer conversation moving.</p>
              </section>

              <div className="tabs">
                {["Calls to make", "Incoming", "Recent"].map((tab) => (
                  <button
                    key={tab}
                    className={planTab === tab ? "tab-active" : ""}
                    onClick={() => openPlan(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {planTab === "Recent" && (
                <div className="info-banner">
                  <History size={20} />
                  Recent calls · Select a customer to review their details.
                </div>
              )}

              {planTab === "Incoming" && (
                <div className="info-banner">
                  <PhoneIncoming size={20} />
                  Incoming and missed calls · Callback actions are demo-only.
                </div>
              )}

              <div className="lead-list">
                {displayedLeads.map((lead) => {
                  const index = leads.indexOf(lead);

                  return (
                    <section className="lead-row" key={lead.name}>
                      <button
                        className="lead-summary"
                        onClick={() =>
                          setExpanded(expanded === index ? null : index)
                        }
                      >
                        <span className="mini-avatar">{lead.name[0]}</span>
                        <span className="row-copy">
                          <strong>{lead.name}</strong>
                          <small>{lead.interest}</small>
                        </span>
                        <span className="score">
                          {lead.score}
                          <small>SCORE</small>
                        </span>
                        <ChevronDown size={18} />
                      </button>

                      {expanded === index && (
                        <div className="lead-details">
                          <p>{lead.signal}</p>
                          <p><strong>Phone:</strong> {lead.phone}</p>
                          <p><strong>Intent score:</strong> {lead.intent}/100</p>
                          <button
                            className="primary-button"
                            onClick={() => openLead(index)}
                          >
                            View lead profile
                          </button>
                        </div>
                      )}

                      {planTab === "Incoming" && (
                        <div className="callback-row">
                          <span>Follow-up recommended</span>
                          <button
                            className="primary-button"
                            onClick={() =>
                              notify(
                                `Demo callback started for ${lead.name}. No real call placed.`
                              )
                            }
                          >
                            <PhoneCall size={15} /> Call back
                          </button>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {planTab === "Calls to make" && (
                <div className="pagination">
                  <button
                    className="secondary-button"
                    disabled={callPage === 0}
                    onClick={() =>
                      setCallPage((current) => Math.max(0, current - 1))
                    }
                  >
                    ← Previous
                  </button>
                  <span>Page {callPage + 1} of {totalCallPages}</span>
                  <button
                    className="secondary-button"
                    disabled={callPage >= totalCallPages - 1}
                    onClick={() =>
                      setCallPage((current) =>
                        Math.min(totalCallPages - 1, current + 1)
                      )
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Calendar */}
          {page === "Calendar" && (
            <>
              <section className="page-heading">
                <span className="eyebrow">YOUR SCHEDULE</span>
                <h1>Calendar</h1>
                <p>Review upcoming follow-ups and team events.</p>
              </section>

              <section className="calendar-card">
                <div className="calendar-heading">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setMonth(
                        new Date(month.getFullYear(), month.getMonth() - 1, 1)
                      )
                    }
                  >
                    ← Previous
                  </button>
                  <h2>
                    {month.toLocaleString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setMonth(
                        new Date(month.getFullYear(), month.getMonth() + 1, 1)
                      )
                    }
                  >
                    Next →
                  </button>
                </div>

                <div className="calendar-grid">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => <strong key={day}>{day}</strong>
                  )}

                  {Array.from({ length: firstDay }, (_, i) => (
                    <span key={`blank-${i}`} />
                  ))}

                  {Array.from({ length: days }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`calendar-day ${
                        [5, 11, 18, 24].includes(i + 1) ? "has-event" : ""
                      }`}
                      onClick={() =>
                        notify(
                          `Selected ${i + 1} ${month.toLocaleString("en-IN", {
                            month: "long",
                          })}`
                        )
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="primary-button today-button"
                  onClick={() => setMonth(new Date(2026, 9, 1))}
                >
                  Back to October 2026
                </button>
              </section>
            </>
          )}

          {/* Pulse */}
          {page === "Pulse" && (
            <>
              {!channel ? (
                <>
                  <section className="page-heading">
                    <span className="eyebrow">TEAM COMMUNICATION</span>
                    <h1>Pulse</h1>
                    <p>Updates, coaching and conversations with your team.</p>
                  </section>

                  <div className="channel-list">
                    {["Call Centre Team", "All Stores", "Avani AI Coaching"].map(
                      (name, i) => (
                        <button
                          className="channel-row"
                          key={name}
                          onClick={() => setChannel(name)}
                        >
                          <span className="channel-icon">
                            {i === 2 ? "✦" : "#"}
                          </span>
                          <span className="row-copy">
                            <strong>{name}</strong>
                            <small>
                              {[
                                "Team updates and shift discussions",
                                "Campaign announcements and offers",
                                "Suggestions to improve your calls",
                              ][i]}
                            </small>
                          </span>
                          <ChevronRight />
                        </button>
                      )
                    )}
                    {page === "Voice Call" && (
                      <section className="page-heading">
                        <h1>Voice Call</h1>
                        <p>Test live browser-to-browser audio.</p>
                        <CallPanel />
                      </section>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-heading">
                    <button
                      className="secondary-button"
                      onClick={() => setChannel("")}
                    >
                      <ArrowLeft size={16} /> Channels
                    </button>
                    <h2># {channel.toLowerCase().replaceAll(" ", "-")}</h2>
                  </div>

                  <section className="pinned">
                    <strong>📌 Needs your input</strong>
                    <p>Confirm the 4:30pm callback</p>
                    <small>Priya Iyer · likely billing dispute</small>
                    <div className="pinned-actions">
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setTaskDone(true);
                          notify("Callback confirmation recorded");
                        }}
                      >
                        {taskDone ? "Confirmed ✓" : "Confirmed"}
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => notify("Reschedule noted in this demo")}
                      >
                        Reschedule
                      </button>
                    </div>
                  </section>

                  <section className="chat-messages">
                    {messages.map((message, i) => (
                      <div
                        key={i}
                        className={`message ${message.mine ? "mine" : ""}`}
                      >
                        <small>{message.name} · {message.time}</small>
                        <div>{message.text}</div>
                      </div>
                    ))}
                  </section>

                  <form className="message-form" onSubmit={sendMessage}>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Message #${channel.toLowerCase().replaceAll(" ", "-")}...`}
                    />
                    <button className="primary-button" aria-label="Send message">
                      <Send size={17} />
                    </button>
                  </form>
                </>
              )}
            </>
          )}
          {page === "Voice Call" && (
            <section style={{ padding: "24px" }}>
              <h1>Voice Call</h1>
              <p>Test live browser-to-browser audio.</p>
              <CallPanel />
            </section>
          )}
        </main>

        {/* Lead profile modal */}
        {leadIndex !== null && (
          <div
            className="modal-backdrop"
            onClick={() => setLeadIndex(null)}
          >
            <section
              className="lead-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-heading">
                <div>
                  <span className="eyebrow">LEAD PROFILE</span>
                  <h2>{leads[leadIndex].name}</h2>
                  <p>{leads[leadIndex].interest}</p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => setLeadIndex(null)}
                  aria-label="Close lead profile"
                >
                  <X />
                </button>
              </div>

              <div className="score-grid">
                <div>
                  <small>ICP SCORE</small>
                  <strong>{leads[leadIndex].score}</strong>
                </div>
                <div>
                  <small>LEAD INTENT</small>
                  <strong>{leads[leadIndex].intent}</strong>
                </div>
              </div>

              <h3>Buying signals</h3>
              <p className="signal-copy">{leads[leadIndex].signal}</p>
              <p><strong>Phone:</strong> {leads[leadIndex].phone}</p>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    setLeadIndex((leadIndex + leads.length - 1) % leads.length)
                  }
                >
                  ← Previous
                </button>
                <button
                  className="primary-button"
                  onClick={() =>
                    setLeadIndex((leadIndex + 1) % leads.length)
                  }
                >
                  Next →
                </button>
              </div>
            </section>
          </div>
        )}

        {notice && <div className="toast">{notice}</div>}
      </div>
    </div>
  );
}

function Stat({ title, value, foot }) {
  return (
    <div className="stat-card">
      <small>{title}</small>
      <strong>{value}</strong>
      <span>{foot}</span>
    </div>
  );
}
