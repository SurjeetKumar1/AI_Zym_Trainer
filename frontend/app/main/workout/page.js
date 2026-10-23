"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

// Standard MediaPipe Pose Skeleton Connections
const DEFAULT_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],       // Shoulders & Arms
  [11, 23], [12, 24], [23, 24],                           // Torso & Hips
  [23, 25], [24, 26], [25, 27], [26, 28],                 // Legs
  [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32] // Feet
];

/* ─────────────────────────────────────────────
   Inner component — reads search params & live AI stream
───────────────────────────────────────────── */
function WorkoutSession() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const exercise = searchParams.get("exercise") || "Squats";
  const totalSets = parseInt(searchParams.get("sets") || "3", 10);
  const repsPerSet = parseInt(searchParams.get("reps") || "10", 10);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const wsRef = useRef(null);
  const captureIntervalRef = useRef(null);

  const [camState, setCamState] = useState("idle"); // idle | requesting | active | error
  const [camError, setCamError] = useState("");
  const [currentSet, setCurrentSet] = useState(1);
  const [repsCount, setRepsCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [finished, setFinished] = useState(false);

  // AI Monitoring State
  const [aiStatus, setAiStatus] = useState("disconnected"); // disconnected | connecting | connected
  const [isDetected, setIsDetected] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({});

  // ── Timer ──
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  // ── Connect AI WebSocket ──
  function connectAiWebSocket() {
    setAiStatus("connecting");
    try {
      const ws = new WebSocket("ws://localhost:8000/ws/live");
      wsRef.current = ws;

      ws.onopen = () => {
        setAiStatus("connected");
        // Inform server of current exercise
        ws.send(JSON.stringify({ type: "set_exercise", exercise }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.detected && data.landmarks && data.landmarks.length > 0) {
            setIsDetected(true);
            setLiveMetrics(data.metrics || {});

            // Auto-update rep counter from AI detector if available
            if (typeof data.metrics?.reps === "number" && data.metrics.reps > repsCount) {
              setRepsCount(data.metrics.reps);
            }

            // Draw real-time glowing skeleton lines
            drawSkeletonLines(data.landmarks, data.connections || DEFAULT_CONNECTIONS);
          } else {
            setIsDetected(false);
            clearSkeletonCanvas();
          }
        } catch (e) {
          console.error("Error parsing AI message:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn("AI WebSocket connection error:", err);
        setAiStatus("disconnected");
      };

      ws.onclose = () => {
        setAiStatus("disconnected");
      };
    } catch (err) {
      console.warn("Failed to create WebSocket:", err);
      setAiStatus("disconnected");
    }
  }

  // ── Draw Neon Skeleton Lines and Joint Nodes on Canvas ──
  function drawSkeletonLines(landmarks, connections) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !landmarks) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Build map for fast index lookup
    const lmMap = {};
    landmarks.forEach((lm) => {
      lmMap[lm.id] = lm;
    });

    // 1. Draw glowing skeleton connection lines (Neon Green / Cyan)
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#00ff77";
    ctx.shadowColor = "#00ff77";
    ctx.shadowBlur = 10;

    connections.forEach(([startIdx, endIdx]) => {
      const p1 = lmMap[startIdx];
      const p2 = lmMap[endIdx];

      if (p1 && p2 && p1.vis > 0.4 && p2.vis > 0.4) {
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }
    });

    // 2. Draw glowing joint circles at vertices (Blue with bright cyan center)
    landmarks.forEach((lm) => {
      if (lm.vis > 0.4) {
        const x = lm.x * w;
        const y = lm.y * h;

        // Outer blue circle
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#0055ff";
        ctx.shadowColor = "#0055ff";
        ctx.shadowBlur = 8;
        ctx.fill();

        // Inner glowing cyan core
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#7fffea";
        ctx.fill();
      }
    });
  }

  function clearSkeletonCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ── Start camera + AI stream ──
  async function startCamera() {
    setCamState("requesting");
    setCamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamState("active");
      setTimerActive(true);

      // Connect AI backend WebSocket
      connectAiWebSocket();

      // Send video frames to AI server every 100ms (~10 fps)
      const hiddenCanvas = document.createElement("canvas");
      const hCtx = hiddenCanvas.getContext("2d");

      captureIntervalRef.current = setInterval(() => {
        if (!videoRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const v = videoRef.current;
        if (v.videoWidth === 0 || v.videoHeight === 0) return;

        hiddenCanvas.width = 400; // Balanced resolution for low latency
        hiddenCanvas.height = 300;
        hCtx.drawImage(v, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

        const base64Data = hiddenCanvas.toDataURL("image/jpeg", 0.55);
        wsRef.current.send(JSON.stringify({ image: base64Data, exercise }));
      }, 100);

    } catch (err) {
      setCamState("error");
      if (err.name === "NotAllowedError") {
        setCamError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.name === "NotFoundError") {
        setCamError("No camera found on this device.");
      } else {
        setCamError(`Camera error: ${err.message}`);
      }
    }
  }

  // ── Stop camera + cleanup ──
  function stopCamera() {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    clearSkeletonCanvas();
    setCamState("idle");
    setTimerActive(false);
    setAiStatus("disconnected");
    setIsDetected(false);
  }

  // ── Rep / set logic ──
  function addRep() {
    setRepsCount((r) => {
      const next = r + 1;
      if (next >= repsPerSet) {
        if (currentSet >= totalSets) {
          setFinished(true);
          stopCamera();
          setTimerActive(false);
        } else {
          setCurrentSet((s) => s + 1);
        }
        return 0;
      }
      return next;
    });
  }

  function removeRep() {
    setRepsCount((r) => Math.max(0, r - 1));
  }

  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  useEffect(() => () => stopCamera(), []);

  const progress = repsPerSet > 0 ? (repsCount / repsPerSet) * 100 : 0;
  const setProgress = totalSets > 0 ? ((currentSet - 1) / totalSets) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
        <button
          onClick={() => { stopCamera(); router.back(); }}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-white">{exercise}</span>
          {camState === "active" && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#00e5ff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
              LIVE SKELETON
            </span>
          )}

          {/* AI Status Badge */}
          {aiStatus === "connected" ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AI Skeleton Tracking
            </span>
          ) : aiStatus === "connecting" ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              Connecting AI...
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-white/40 text-xs">
              AI Offline
            </span>
          )}
        </div>

        <span className="text-sm font-mono text-white/40">{fmt(elapsed)}</span>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 gap-0 overflow-hidden">

        {/* ── Camera feed & skeleton lines overlay ── */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#080810] relative overflow-hidden">

          {/* Video element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: camState === "active" ? "block" : "none", maxHeight: "calc(100vh - 65px)" }}
          />

          {/* Skeleton lines canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ display: camState === "active" ? "block" : "none" }}
          />

          {/* Live exercise feedback badge on video (like depth status, knee angle) */}
          {camState === "active" && isDetected && (
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#00ff77]/40 shadow-lg shadow-[#00ff77]/10 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff77] animate-pulse" />
                <span className="text-xs font-black tracking-wider text-[#00ff77] uppercase">
                  {liveMetrics.depth_status || liveMetrics.body_alignment || liveMetrics.extension_status || liveMetrics.balance_status || "SKELETON ACTIVE"}
                </span>
              </div>

              {/* Angles telemetry pill */}
              <div className="px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80 flex items-center gap-3">
                {liveMetrics.knee_angle !== undefined && (
                  <span>Knee: <strong className="text-[#00e5ff]">{liveMetrics.knee_angle}°</strong></span>
                )}
                {liveMetrics.back_angle !== undefined && (
                  <span>Back: <strong className="text-amber-400">{liveMetrics.back_angle}°</strong></span>
                )}
                {liveMetrics.elbow_angle !== undefined && (
                  <span>Elbow: <strong className="text-pink-400">{liveMetrics.elbow_angle}°</strong></span>
                )}
              </div>
            </div>
          )}

          {/* Searching warning */}
          {camState === "active" && !isDetected && (
            <div className="absolute top-6 left-6 z-10 px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Please stand in camera view to track skeleton lines
            </div>
          )}

          {/* Idle / error / finished states */}
          {camState !== "active" && (
            <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
              {finished ? (
                <>
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-black text-white">Workout Complete!</h2>
                  <p className="text-white/40 text-sm">
                    You finished <span className="text-[#00e5ff] font-semibold">{totalSets} sets</span> of{" "}
                    <span className="text-[#00e5ff] font-semibold">{exercise}</span> in {fmt(elapsed)}
                  </p>
                  <button
                    onClick={() => router.back()}
                    className="px-8 py-3 rounded-xl bg-[#00e5ff] text-black font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Back to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="w-64 h-48 rounded-2xl flex flex-col items-center justify-center gap-3 border border-white/[0.08]"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-white/20">
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <p className="text-white/25 text-sm">Camera preview</p>
                  </div>

                  {camState === "error" && (
                    <p className="text-red-400 text-sm max-w-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {camError}
                    </p>
                  )}

                  {camState === "requesting" ? (
                    <div className="flex items-center gap-2 text-[#00e5ff] text-sm">
                      <div className="w-4 h-4 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin" />
                      Requesting camera access…
                    </div>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#00e5ff] text-black text-sm font-bold hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#00e5ff]/20"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      {camState === "error" ? "Retry Camera" : "Start Live Monitoring"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Right panel — stats & telemetry ── */}
        <aside
          className="w-80 flex flex-col border-l border-white/[0.06] shrink-0 overflow-y-auto"
          style={{ background: "rgba(8,8,14,0.95)" }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#00ff77] mb-1">Live Skeleton AI</p>
            <p className="text-xl font-black text-white">{exercise}</p>
          </div>

          <div className="flex-1 px-6 py-6 flex flex-col gap-6">

            {/* Set & Rep Stats */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">Set</span>
                <span className="text-xs font-bold text-white">
                  {finished ? totalSets : currentSet} / {totalSets}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: finished ? "100%" : `${setProgress}%`,
                    background: "linear-gradient(90deg,#00ff77,#00e5ff)",
                  }}
                />
              </div>
            </div>

            {/* Rep counter box */}
            <div
              className="flex flex-col items-center gap-3 py-5 rounded-2xl border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-xs text-white/35 font-medium uppercase tracking-widest">Reps</p>
              <p className="text-6xl font-black text-white tabular-nums leading-none">{repsCount}</p>
              <p className="text-xs text-white/25">of {repsPerSet}</p>

              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={removeRep}
                  disabled={camState !== "active"}
                  className="w-10 h-10 rounded-xl border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all text-lg font-bold"
                >
                  −
                </button>
                <button
                  onClick={addRep}
                  disabled={camState !== "active" || finished}
                  className="w-10 h-10 rounded-xl bg-[#00ff77]/10 border border-[#00ff77]/30 text-[#00ff77] hover:bg-[#00ff77]/20 transition-all text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Telemetry Cards */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Pose Telemetry</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-1">
                  <span className="text-[10px] text-white/40 uppercase">Status</span>
                  <span className="font-bold text-[#00ff77]">
                    {liveMetrics.depth_status || liveMetrics.body_alignment || (isDetected ? "Tracking" : "Idle")}
                  </span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-1">
                  <span className="text-[10px] text-white/40 uppercase">Stage</span>
                  <span className="font-bold text-[#00e5ff] uppercase">
                    {liveMetrics.stage || "N/A"}
                  </span>
                </div>
              </div>

              {liveMetrics.knee_angle !== undefined && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-white/60">Knee Angle</span>
                  <span className="font-mono font-bold text-[#00e5ff]">{liveMetrics.knee_angle}°</span>
                </div>
              )}

              {liveMetrics.back_angle !== undefined && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-white/60">Back Angle</span>
                  <span className="font-mono font-bold text-amber-400">{liveMetrics.back_angle}°</span>
                </div>
              )}

              {liveMetrics.elbow_angle !== undefined && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-white/60">Elbow Angle</span>
                  <span className="font-mono font-bold text-pink-400">{liveMetrics.elbow_angle}°</span>
                </div>
              )}
            </div>

          </div>

          {/* Stop button */}
          {camState === "active" && (
            <div className="px-6 pb-6 shrink-0">
              <button
                onClick={stopCamera}
                className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all"
              >
                Stop Camera
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#00e5ff] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WorkoutSession />
    </Suspense>
  );
}
