import { useEffect, useRef, useState } from "react";
import "./home.css";
import { UPLOAD, UPLOAD2 } from "../network/upload";
import TTS from "../utils/tts";
import store from "../store";

let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
} else if ("SpeechRecognition" in window) {
  recognition = new SpeechRecognition();
} else {
  alert("Your browser does not support Speech Recognition.");
}
if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = true;
}

const Home = () => {
  const timestamp = useRef(Date());
  const sttResult = useRef("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("");
  const [sttText, setSttText] = useState("");
  const holdTimeout = useRef<number | null>(null);
  const audioRef1 = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    recognition.onresult = (event) => {
      console.log("test1");
      sttResult.current = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          sttResult.current += event.results[i][0].transcript;
        } else {
          //   sttResult.current += event.results[i][0].transcript;
        }
      }
    };

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

    return () => {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    try {
      setStatus("말씀을 해주세요..");

      recognition.start();
      console.log("started 1");

      if (audioRef1.current) {
        audioRef1.current.play();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMouseUp = async () => {
    try {
      recognition.stop();
      setStatus("버튼을 눌러주세요");

      if (sttResult.current.length == 0) {
        return;
      }

      let imageBlob = await screenshot();
      let response = await UPLOAD(imageBlob, sttResult.current);

      let jsonString = await response.json();
      const result = JSON.parse(jsonString);
      console.log("result:" + result);
      if (result && result.comment) {
        console.log("comment: " + result.comment);
        let comment = result.comment;
        TTS(comment);
      }

      if (audioRef2.current) {
        audioRef2.current.play();
      }
    } catch (e) {
      console.log(e);
      TTS("잘못 들었어요. 다시 말씀해주세요.");
    }
  };

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
    <div className="h-full flex items-center justify-center">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="video w-full h-full "
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="status-box">
        <span className="status-text">
          {status}
          <div>{sttResult.current}</div>
        </span>
      </div>
      <div className="action-button-wrapper">
        <div className="big-circle"></div>
        <div
          className="small-circle"
          onMouseDown={isTouchDevice ? undefined : handleMouseDown}
          onMouseUp={isTouchDevice ? undefined : handleMouseUp}
          onTouchStart={isTouchDevice ? handleMouseDown : undefined}
          onTouchEnd={isTouchDevice ? handleMouseUp : undefined}
        ></div>
      </div>
      <audio ref={audioRef1} src="/sound.mp3" />{" "}
      <audio ref={audioRef2} src="/sound3.mp3" />{" "}
    </div>
  );
};

export default Home;
