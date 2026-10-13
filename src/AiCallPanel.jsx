import { useEffect, useRef, useState } from "react";

const replies = [
  { keys: ["bill", "charge", "payment", "invoice"], text: "I can help with billing. I have flagged this for a callback from a billing specialist at 4:30 PM." },
  { keys: ["price", "plan", "upgrade", "premium", "cost"], text: "I can share our plan details and arrange a callback to talk through the options." },
  { keys: ["callback", "call back", "call me"], text: "Sure. I have noted a callback request for today at 4:30 PM." },
  { keys: ["bye", "thanks", "thank you"], text: "You're welcome. Have a great day!" },
  { keys: ["hello", "hi", "hey"], text: "Hello! How can I help you today?" },
];

function getReply(text) {
  const t = text.toLowerCase();
  const match = replies.find((r) => r.keys.some((k) => t.includes(k)));
  return match
    ? match.text
    : "Thanks for sharing that. I will pass it to a human agent who will follow up with you.";
}

export default function AiCallPanel() {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Not in a call");
  const recRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recRef.current?.stop();
    };
  }, []);

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function startCall() {
    const greeting = "Hello, this is Avani, the On-Ground assistant. How can I help?";
    historyRef.current = [];
    setActive(true);
    setStatus("In a call with Avani");
    setTranscript([{ who: "Avani", text: greeting }]);
    speak(greeting);
  }

  function endCall() {
    window.speechSynthesis?.cancel();
    recRef.current?.stop();
    setActive(false);
    setStatus("Call ended");
  }

  async function send(text) {
    const clean = text.trim();
    if (!clean) return;
    setTranscript((prev) => [...prev, { who: "You", text: clean }]);
    historyRef.current = [...historyRef.current, { role: "user", text: clean }];
    setStatus("Avani is thinking...");

    let answer;
    let label = "Avani (live AI)";
    try {
      const response = await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });
      if (!response.ok) throw new Error("AI service unavailable");
      const data = await response.json();
      answer = data.reply;
    } catch {
      answer = getReply(clean);
      label = "Avani (scripted fallback, live AI unavailable)";
    }

    historyRef.current = [...historyRef.current, { role: "model", text: answer }];
    setTranscript((prev) => [...prev, { who: label, text: answer }]);
    setStatus("In a call with Avani");
    speak(answer);
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
    setInput("");
  }

  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("Speech recognition is not supported here. Type your message instead.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (event) => send(event.results[0][0].transcript);
    rec.onend = () => setStatus("In a call with Avani");
    rec.onerror = () => setStatus("Could not hear you. Try again or type.");
    recRef.current = rec;
    setStatus("Listening...");
    rec.start();
  }

  return (
    <section
      style={{
        padding: 24,
        maxWidth: 480,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        color: "#222",
        marginTop: 16,
      }}
    >
      <h2>Talk to Avani (AI)</h2>
      <p
        style={{
          background: "#fff4e5",
          border: "1px solid #f5c26b",
          borderRadius: 8,
          padding: 8,
          fontSize: 13,
        }}
      >
        Avani answers with a real AI model (Gemini) through a server function.
        If the AI service is unavailable, she falls back to scripted keyword
        replies and each reply is labelled. Voice uses your browser's speech tools.
      </p>
      <p>Status: {status}</p>

      {!active ? (
        <button onClick={startCall}>Start AI call</button>
      ) : (
        <>
          <div style={{ maxHeight: 200, overflowY: "auto", margin: "8px 0" }}>
            {transcript.map((line, i) => (
              <p key={i} style={{ margin: "6px 0" }}>
                <strong>{line.who}:</strong> {line.text}
              </p>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type, for example: I have a billing question"
              style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }}
            />
            <button type="submit">Send</button>{" "}
            <button type="button" onClick={listen}>Speak</button>{" "}
            <button type="button" onClick={endCall}>End AI call</button>
          </form>
        </>
      )}
    </section>
  );
}
