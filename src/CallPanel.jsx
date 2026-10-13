
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import AiCallPanel from "./AiCallPanel";

export default function CallPanel() {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [incomingCall, setIncomingCall] = useState(null);

  const peerRef = useRef(null);
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioRef = useRef(null);
  const localVideoRef = useRef(null);

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

  async function answerCall(call, withVideo = false) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      });

      localStreamRef.current = stream;
      showLocalVideo(stream);
      call.answer(stream);
      connectAudio(call);
      setIncomingCall(null);
      setStatus("Call connected");
    } catch {
      setStatus("Microphone permission is required");
    }
  }

  function showLocalVideo(stream) {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
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

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        callRef.current = null;
        setStatus("Call ended");
        });

        call.on("error", () => {
        setStatus("Call failed");
    });
  }

  async function makeCall(withVideo = false) {
    if (!remoteId.trim()) {
      setStatus("Enter the other browser's Peer ID");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      });

      localStreamRef.current = stream;
      showLocalVideo(stream);

      const call = peerRef.current.call(remoteId.trim(), stream);
      if (!call) {
        setStatus("Could not start call");
        return;
      }

      connectAudio(call);
      setStatus("Calling...");
    } catch {
      setStatus("Microphone or camera permission is required");
    }
  }

  function endCall() {
    callRef.current?.close();
    callRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    setStatus("Call ended");
  }

  return (
    <>
    <section style={{
      padding: 24,
      maxWidth: 480,
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 12,
      color: "#222"
    }}>
      <h2>On-Ground Voice and Video Call</h2>
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
          <button onClick={() => answerCall(incomingCall, false)}>
            Answer (voice)
          </button>{" "}
          <button onClick={() => answerCall(incomingCall, true)}>
            Answer (video)
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

      <button onClick={() => makeCall(false)}>Voice call</button>{" "}
      <button onClick={() => makeCall(true)}>Video call</button>{" "}
      <button onClick={endCall}>End Call</button>

      <p style={{ fontSize: 13, color: "#667085" }}>
        Real browser-to-browser call (PeerJS). Not a phone call.
      </p>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "40%", background: "#111", borderRadius: 8 }}
      />
      <video
        ref={audioRef}
        autoPlay
        playsInline
        controls
        style={{ width: "100%", background: "#111", borderRadius: 8, marginTop: 8 }}
      />
    </section>
    <AiCallPanel />
    </>
  );
}
