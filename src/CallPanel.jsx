
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export default function CallPanel() {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [incomingCall, setIncomingCall] = useState(null);

  const peerRef = useRef(null);
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      setStatus("Ready to connect");
    });

    peer.on("call", (call) => {
      setIncomingCall(call);
      setStatus("Incoming call");
    });

    peer.on("error", (error) => {
      setStatus(`Connection error: ${error.type}`);
    });

    return () => {
      callRef.current?.close();
      peer.destroy();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function answerCall(call) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;
      call.answer(stream);
      connectAudio(call);
      setIncomingCall(null);
      setStatus("Call connected");
    } catch {
      setStatus("Microphone permission is required");
    }
  }

  function connectAudio(call) {
    callRef.current = call;

    call.on("stream", (remoteStream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
        audioRef.current.play().catch(() => {});
      }
      setStatus("Call connected");
    });

    call.on("close", () => {
        if (audioRef.current) {
            audioRef.current.srcObject = null;
        }

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        callRef.current = null;
        setStatus("Call ended");
        });

        call.on("error", () => {
        setStatus("Call failed");
    });
  }

  async function makeCall() {
    if (!remoteId.trim()) {
      setStatus("Enter the other browser's Peer ID");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;

      const call = peerRef.current.call(remoteId.trim(), stream);
      if (!call) {
        setStatus("Could not start call");
        return;
      }

      connectAudio(call);
      setStatus("Calling...");
    } catch {
      setStatus("Microphone permission is required");
    }
  }

  function endCall() {
    callRef.current?.close();
    callRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setStatus("Call ended");
  }

  return (
    <section style={{
      padding: 24,
      maxWidth: 480,
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 12,
      color: "#222"
    }}>
      <h2>On-Ground Voice Call</h2>
      <p>Status: {status}</p>

      <label>Your Peer ID</label>
      <p style={{ overflowWrap: "anywhere" }}>
        {peerId || "Connecting to calling service..."}
      </p>
      <button onClick={() => navigator.clipboard.writeText(peerId)}
        disabled={!peerId}>
        Copy my ID
      </button>

      <hr />

      {incomingCall && (
        <div>
          <p>Incoming call</p>
          <button onClick={() => answerCall(incomingCall)}>
            Answer
          </button>
        </div>
      )}

      <label htmlFor="remotePeer">Other browser's Peer ID</label>
      <input
        id="remotePeer"
        value={remoteId}
        onChange={(e) => setRemoteId(e.target.value)}
        placeholder="Paste the other Peer ID"
        style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }}
      />

      <button onClick={makeCall}>Call</button>{" "}
      <button onClick={endCall}>End Call</button>

      <audio ref={audioRef} autoPlay controls />
    </section>
  );
}
