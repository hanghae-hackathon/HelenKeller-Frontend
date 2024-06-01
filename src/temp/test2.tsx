import { useEffect, useRef } from "react";
// import UPLOAD from "../network/upload";
// import STT from "../utils/stt";

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
  // const stt = new STT();

  // stt.recognition.onresult = (event) => {
  //   console.log("test");
  //   console.log(event);
  // };

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        } else {
          console.error("VideoPipe is not loaded");
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
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
    };
  }, []);

  const takeScreenshot = async () => {
    // stt.startRecognition();

    if (localVideoRef.current && canvasRef.current) {
      const video = localVideoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // 캔버스 크기를 비디오 크기와 동일하게 설정
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 비디오 프레임을 캔버스에 그리기
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캔버스를 데이터 URL로 변환 (JPG 형식)
        const dataUrl = canvas.toDataURL("image/jpeg");

        console.log(dataUrl);

        // 데이터 URL을 Blob으로 변환
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // UPLOAD(blob, "test2");

        //

        // Blob을 클립보드에 복사
        try {
          // await navigator.clipboard.write([
          //   new ClipboardItem({
          //     "image/jpeg": blob,
          //   }),
          // ]);
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
      <button className="action-button" onClick={takeScreenshot}>
        나를 누르세요
      </button>

      <div className="action-button-wrapper">
        <div className="big-circle"></div>
        <div className="small-circle" onClick={takeScreenshot}></div>
      </div>
    </div>
  );
};

export default Home;
