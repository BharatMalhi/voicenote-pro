import React, { useState, useRef } from "react";

function Recorder() {
  // ===== STATE =====
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [seconds, setSeconds] = useState(0);

  // ===== REFS =====
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const recordingRef = useRef(false); // fixes waveform rendering issue

  // ===== START RECORDING =====
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MediaRecorder
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    // AudioContext for waveform
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    source.connect(analyserRef.current);

    recordingRef.current = true;
    drawWaveform(); // waveform animation starts

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const localUrl = URL.createObjectURL(blob);
      setAudioUrl(localUrl);

      // OPTIONAL: upload to backend here
      // const formData = new FormData();
      // formData.append("audio", blob);
      // await fetch("http://localhost:5000/api/audio/upload", { method: "POST", body: formData });
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    // Timer
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // ===== STOP RECORDING =====
  const stopRecording = () => {
    recordingRef.current = false;
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  // ===== DRAW WAVEFORM =====
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!recordingRef.current) return;

      requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw line
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00ff99";
      ctx.beginPath();

      let x = 0;
      const sliceWidth = canvas.width / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
  };

  // ===== RENDER =====
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Voice Recorder</h2>

      <canvas
        ref={canvasRef}
        width="300"
        height="80"
        style={{ background: "#111", marginBottom: 10, borderRadius: 6 }}
      />

      <div style={{ marginBottom: 10 }}>
        ⏱ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: "12px 25px",
          fontSize: 16,
          background: isRecording ? "red" : "green",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl}></audio>
          <br />
          <a href={audioUrl} download="voice.webm">
            Download Voice
          </a>
        </div>
      )}
    </div>
  );
}

export default Recorder;
