import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updatePersonalCode = (socketId) => {
  const personal_code_paragraph = document.getElementById(
    "personal_code_paragraph"
  );
  personal_code_paragraph && (personal_code_paragraph.innerHTML = socketId);
};

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;
  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const showVideoCallButtons = () => {
  const personal_code_video_button = document.getElementById(
    "personal_code_video_button"
  );
  const stranger_code_video_button = document.getElementById(
    "stranger_code_video_button"
  );
  showElement(personal_code_video_button);
  showElement(stranger_code_video_button);
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";
  const incomingDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
  dialog.appendChild(incomingDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
  dialog.appendChild(callingDialog);
};

export const removeAllDialog = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog = null;
  infoDialog = elements.getInfoDialog(constants.infoDialogText[preOfferAnswer]);
  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
    dialog.appendChild(infoDialog);
    setTimeout(() => {
      removeAllDialog();
    }, 4000);
  }
};

export const showCallElements = (callType) => {
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.CHAT_STRANGER
  ) {
    showChatCallElements();
  } else if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    showVideoCallElements();
  }
};

export const updateRemoteVideo = (remoteStream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = remoteStream;
};

// ui call buttons

const micOnImgSrc = "./utils/images/mic.png";
const micOffImgSrc = "./utils/images/micOff.png";

export const updateMicButton = (micEnabled) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micEnabled ? micOffImgSrc : micOnImgSrc;
};

const cameraOnImg = "./utils/images/camera.png";
const cameraOffImg = "./utils/images/cameraOff.png";

export const updateCameraButton = (cameraEnabled) => {
  const cameraButtonImg = document.getElementById("camera_button_image");
  cameraButtonImg.src = cameraEnabled ? cameraOffImg : cameraOnImg;
};

// UI messages

export const appendMsg = (message, right = false) => {
  const messages_container = document.getElementById("messages_container");
  const messages_containerElm = right
    ? elements.getRightMsg(message)
    : elements.getLeftMsg(message);
  messages_container.appendChild(messages_containerElm);
};

export const clearMessenger = () => {
  const messages_container = document.getElementById("messages_container");
  messages_container
    .querySelectorAll("*")
    .forEach((message) => message.remove());
};

// Recording

export const showRecordingPanel = () => {
  const video_recording_buttons = document.getElementById(
    "video_recording_buttons"
  );
  showElement(video_recording_buttons);

  // hide recording button if its active
  const start_recording_button = document.getElementById(
    "start_recording_button"
  );
  hideElement(start_recording_button);
};

export const resetRecordingButtons = () => {
  const start_recording_button = document.getElementById(
    "start_recording_button"
  );
  showElement(start_recording_button);
  const video_recording_buttons = document.getElementById(
    "video_recording_buttons"
  );
  hideElement(video_recording_buttons);
};

export const switchRecordingButtons = (switchForResumeBtn = false) => {
  const resume_recording_button = document.getElementById(
    "resume_recording_button"
  );
  const pause_recording_button = document.getElementById(
    "pause_recording_button"
  );
  if (switchForResumeBtn) {
    hideElement(pause_recording_button);
    showElement(resume_recording_button);
  } else {
    hideElement(resume_recording_button);
    showElement(pause_recording_button);
  }
};

// ui after hang up

export const updateUIAfterHangUp = (callType) => {
  enableDashboard();
  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const call_buttons = document.getElementById("call_buttons");
    hideElement(call_buttons);
  } else {
    const finish_chat_button_container = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(finish_chat_button_container);
  }
  const new_message = document.getElementById("new_message");
  hideElement(new_message);
  clearMessenger();
  updateMicButton(false);
  updateCameraButton(false);
  const videos_placeholder = document.getElementById("videos_placeholder");
  showElement(videos_placeholder);
  const remote_video = document.getElementById("remote_video");
  hideElement(remote_video);
  removeAllDialog();
};

// ui helper functions

const showChatCallElements = () => {
  let elementsToShow = [];
  const finish_chat_call_button = document.getElementById(
    "finish_chat_call_button"
  );
  elementsToShow.push(finish_chat_call_button);
  const newMessageInput = document.getElementById("new_message");
  elementsToShow.push(newMessageInput);
  elementsToShow.forEach((element) => {
    showElement(element);
  });
  // Block dashboard
  disableDashboard();
};

const showVideoCallElements = () => {
  let elementsToShow = [];
  const callButtons = document.getElementById("call_buttons");
  elementsToShow.push(callButtons);
  const placeHolder = document.getElementById("videos_placeholder");
  hideElement(placeHolder);

  const remoteVideo = document.getElementById("remote_video");
  elementsToShow.push(remoteVideo);
  const newMessageInput = document.getElementById("new_message");
  elementsToShow.push(newMessageInput);
  elementsToShow.forEach((element) => {
    showElement(element);
  });
  disableDashboard();
};

const enableDashboard = () => {
  const dashBoardBlocker = document.getElementById("dashboard_blur");
  if (!dashBoardBlocker.classList.contains("display_none")) {
    dashBoardBlocker.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashBoardBlocker = document.getElementById("dashboard_blur");
  if (dashBoardBlocker.classList.contains("display_none")) {
    dashBoardBlocker.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};

const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
