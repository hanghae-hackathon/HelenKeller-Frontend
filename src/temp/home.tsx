import { useEffect, useRef, useState } from "react";
import "./home.css";

import { UPLOAD, UPLOAD2 } from "../network/upload";
import STT from "../utils/stt";
import TTS from "../utils/tts";

// import store from "../store";

// TTS("안녕하세요. 헬렌켈러입니다.");

const Home = () => {
  // const stt = new STT();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("Loading...");
  const [sttText, setSttText] = useState("");

  const [voiceState, setVoiceState] = useState("");

  // const holdTimeout = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordAudioRef = useRef<HTMLAudioElement | null>(null);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  // const [recording, setRecording] = useState(false);

  // const downloadBlob = (blob) => {
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "filename.webm"); // Set desired filename
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    // setRecording(false);
    // const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    // onRecordingStop(blob);
    setRecordedChunks([]);

    return blob;
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks([...recordedChunks, event.data]);
    }
  };

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 후면 카메라 사용
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
        setStatus("Error accessing camera");
      }
    };

    startVideo();

    // if (stt.recognition) {
    //   stt.recognition.onresult = (event) => {
    //     for (let i = event.resultIndex; i < event.results.length; ++i) {
    //       if (event.results[i].isFinal) {
    //         stt.result += stt.result + event.results[i][0].transcript;
    //       } else {
    //         // let result = sttText + event.results[i][0].transcript;
    //         // setSttText(result);
    //         // stt.result += stt.result + event.results[i][0].transcript;
    //       }
    //     }
    //     setSttText(stt.result);
    //   };
    // }

    return () => {
      // if (localVideoRef.current && localVideoRef.current.srcObject) {
      //   const tracks = (
      //     localVideoRef.current.srcObject as MediaStream
      //   ).getTracks();
      //   tracks.forEach((track) => track.stop());
      // // }
      // if (holdTimeout.current) {
      //   clearTimeout(holdTimeout.current);
      // }
    };
  }, []);

  let test = 0;
  const handleMouseDown = async (event) => {
    console.log(event);
    console.log(test++);
    // stt.result = "";
    setVoiceState("녹음시작");

    // localVideoRef.current.pause();
    try {
      await startRecording();
      // stt.recognition.start();
      // holdTimeout.current = window.setTimeout(() => {
      // if (audioRef.current) {
      //   audioRef.current.play();
      // }
      // }, 0);
    } catch (e) {
      // stt.recognition.stop();
    }
  };

  const handleMouseUp = async () => {
    // console.log("start test1" + stt.result);
    window.setTimeout(async () => {
      let audioBlob = stopRecording();
      // Check if the Blob size is greater than zero

      if (audioBlob.size > 0) {
        // downloadBlob(audioBlob);
        console.log("get +" + audioBlob);
        console.log("get +" + sttText);

        setVoiceState("녹음종료");
        // stt.recognition.stop();

        // if (holdTimeout.current) {
        //   clearTimeout(holdTimeout.current);
        //   holdTimeout.current = null;
        // }
        let blob = await screenshot();

        // blob file size is not zero

        // UPLOAD2(blob, audioBlob);
      } else {
        console.error("Blob size is zero.");
      }

      // stt.recognition.stop();
      // console.log("start test2" + stt.result);
      // if (validAction(stt.result)) {
      // console.log("query" + stt.result);
      // downloadBlob(audioBlob);
      // }
    }, 1000);
  };

  // let validAction: boolean = (text: string) => {
  //   // check valid
  //   console.log("check validation: " + text);
  //   let result = text.trim();
  //   console.log("check validation2: " + result);
  //   let check = ["찾아", "안내", "설명"];

  //   const checkResult = check.some((text) => result.includes(text));

  //   // const checkResult: boolean = check.includes(result);
  //   console.log("check validation3: " + checkResult);

  //   return checkResult;
  // };

  const screenshot = async () => {
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

        // 데이터 URL을 Blob으로 변환
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        return blob;
      }
    }
  };

  return (
    <div className="container">
      <video ref={localVideoRef} autoPlay playsInline muted className="video" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="status-box">
        <span className="status-text">{status}</span>
        <span className="status-text">{sttText}</span>
        <div className="status-text">{voiceState}</div>
      </div>
      <div className="action-button-wrapper">
        <div className="big-circle"></div>
        <div
          className="small-circle"
          onMouseDown={isTouchDevice ? undefined : handleMouseDown}
          onMouseUp={isTouchDevice ? undefined : handleMouseUp}
          onTouchStart={isTouchDevice ? handleMouseDown : undefined}
          onTouchEnd={isTouchDevice ? handleMouseUp : undefined}
          // onClick={takeScreenshot}
        ></div>
      </div>
      <audio ref={recordAudioRef}></audio>
      <audio ref={audioRef} src="/sound.mp3" />
      {/* 효과음 mp3 파일 경로로 변경 */}
    </div>
  );
};

export default Home;
