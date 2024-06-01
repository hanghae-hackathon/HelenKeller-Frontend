import React, { useEffect, useRef, useState } from "react";
import "./home.css";

declare global {
  interface Window {
    VideoPipe: any;
  }
}

// VideoPipe를 위한 외부 스크립트 삽입
const loadVideoPipeScript = () => {
  const script = document.createElement("script");
  script.src = "https://example.com/path/to/videopipe.js"; // 실제 VideoPipe 스크립트 URL로 변경
  script.async = true;
  document.body.appendChild(script);
};

const Home = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState(
    "안녕하세요. 헬렌켈러입니다. 무엇을 도와드릴까요?",
  );
  const [loading, setLoading] = useState(false);
  const holdTimeout = useRef<number | null>(null);
  const loadingTimeout = useRef<number | null>(null);
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadVideoPipeScript();

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 후면 카메라 사용
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const handler = (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        if (window.VideoPipe) {
          const pipe = new window.VideoPipe(stream, handler);
          setStatus("Video stream started");
        } else {
          console.error("VideoPipe is not loaded");
          setStatus("처리 중입니다.");
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
        setStatus("Error accessing camera");
      }
    };

    startVideo();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (
          localVideoRef.current.srcObject as MediaStream
        ).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
      }
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    setStatus("말씀을 해주세요");
    holdTimeout.current = window.setTimeout(() => {
      if (audioRef1.current) {
        audioRef1.current.play();
      }
    }, 1000);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
    if (audioRef2.current) {
      audioRef2.current.play();
    }
    setLoading(true); // 로딩 상태 시작
    loadingTimeout.current = window.setTimeout(() => {
      setLoading(false); // 5초 후 로딩 상태 종료
      setStatus("안녕하세요. 헬렌켈러입니다. 무엇을 도와드릴까요?");
    }, 5000);
  };

  const takeScreenshot = async () => {
    if (localVideoRef.current && canvasRef.current) {
      const video = localVideoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg");

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/jpeg": blob,
            }),
          ]);
          console.log("Image copied to clipboard");
        } catch (error) {
          console.error("Failed to copy image to clipboard: ", error);
        }
      }
    }
  };

  return (
    <div className="container">
      <video ref={localVideoRef} autoPlay playsInline muted className="video" />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="video remote"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="status-box">
        <span className="status-text">{status}</span>
      </div>
      <div className="action-button-wrapper">
        <div className="big-circle"></div>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div
            className="small-circle"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onClick={takeScreenshot}
          ></div>
        )}
      </div>
      <audio ref={audioRef1} src="/sound.mp3" />
      <audio ref={audioRef2} src="/sound3.mp3" />
    </div>
  );
};

export default Home;
