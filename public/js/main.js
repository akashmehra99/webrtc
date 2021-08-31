import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as recordingUtils from "./recordingUtils.js";

// Initialize socket connection
const socket = io("/");

wss.registerSocketEvents(socket);

webRTCHandler.getLocalPreview();
// Register code for registering event for code copy

const personal_code_copy_button = document.getElementById(
  "personal_code_copy_button"
);

personal_code_copy_button.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator &&
    navigator.clipboard &&
    navigator.clipboard.writeText(personalCode);
});

// Register event listener for connection buttons

const personal_code_chat_button = document.getElementById(
  "personal_code_chat_button"
);

const personal_code_video_button = document.getElementById(
  "personal_code_video_button"
);

const calle_personal_code_input = document.getElementById(
  "personal_code_input"
);

personal_code_chat_button.addEventListener("click", () => {
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calle_personal_code_input.value);
});

personal_code_video_button.addEventListener("click", () => {
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calle_personal_code_input.value);
});

const mic_button = document.getElementById("mic_button");

mic_button.addEventListener("click", () => {
  console.log("Mic button clicked");
  const localStream = store.getState().localStream;
  const micenEabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micenEabled;
  ui.updateMicButton(micenEabled);
});

const camera_button = document.getElementById("camera_button");
camera_button.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const videEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !videEnabled;
  ui.updateCameraButton(videEnabled);
});

const screen_sharing_button = document.getElementById("screen_sharing_button");
screen_sharing_button.addEventListener("click", () => {
  const screenSharingActive = store.getState().screenSharingActive;
  webRTCHandler.switchBetweenScreenSharingAndCamera(screenSharingActive);
});

// messenger

const new_message_input = document.getElementById("new_message_input");
new_message_input.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "Enter") {
    const message = event.target.value.trim();
    if (message) {
      webRTCHandler.sendMessageUsingDataChannel(message);
      new_message_input.value = "";
      ui.appendMsg(message, true);
    }
  }
});

const send_message_button = document.getElementById("send_message_button");
send_message_button.addEventListener("click", () => {
  const message = new_message_input.value.trim();
  if (message) {
    webRTCHandler.sendMessageUsingDataChannel(message);
    new_message_input.value = "";
    ui.appendMsg(message, true);
  }
});

// Recording

const start_recording_button = document.getElementById(
  "start_recording_button"
);
start_recording_button.addEventListener("click", () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
});

const stop_recording_button = document.getElementById("stop_recording_button");
stop_recording_button.addEventListener("click", () => {
  recordingUtils.stopRecording();
  ui.resetRecordingButtons();
});

const pause_recording_button = document.getElementById(
  "pause_recording_button"
);
pause_recording_button.addEventListener("click", () => {
  recordingUtils.pauseRecording();
  ui.switchRecordingButtons(true);
});

const resume_recording_button = document.getElementById(
  "resume_recording_button"
);
resume_recording_button.addEventListener("click", () => {
  recordingUtils.resumeRecording();
  ui.switchRecordingButtons(false);
});

// hangup

const hang_up_button = document.getElementById("hang_up_button");
hang_up_button.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});

const finish_chat_call_button = document.getElementById(
  "finish_chat_call_button"
);
finish_chat_call_button.addEventListener("click", () => {
  webRTCHandler.handleHangUp();
});
