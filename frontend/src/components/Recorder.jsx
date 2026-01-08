import React, { useState, useRef } from "react";

function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch(
            "http://localhost:5000/api/audio/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          // audio now comes from backend
          setAudioUrl(`http://localhost:5000/uploads/${data.filename}`);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Voice Recorder</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isRecording ? "#ff4444" : "#44ff44",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <audio controls src={audioUrl}></audio>
          <br />
          <a href={audioUrl} download="recording.wav">
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
}

export default Recorder;
