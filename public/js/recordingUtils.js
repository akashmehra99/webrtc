import * as store from "../js/store.js";

let mediaRecorder,
  recordedChunks = [];

const vp9Codec = "video/webm; codecs=vp=9";
const vp9Options = { mimeType: vp9Codec };

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;
  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Codec);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

export const pauseRecording = () => {
  mediaRecorder.pause();
};

export const resumeRecording = () => {
  mediaRecorder.resume();
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.style = "display:none";
  link.href = url;
  link.download = "recording.webm";
  link.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailable = (event) => {
  if (event && event.data && event.data.size) {
    recordedChunks.push(event.data);
    downloadRecordedVideo();
  }
};
