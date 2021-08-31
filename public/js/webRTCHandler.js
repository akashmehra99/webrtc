import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails, peerConnection, dataChannel;

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(constants.defaultMediaConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setCallState(constants.callStates.CALL_AVAILABLE);
      store.setLocalStream(stream);
      ui.showVideoCallButtons();
    })
    .catch((error) => {
      console.log("Not able to get media stream => ", error);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(constants.RTCConfiguration);
  dataChannel = peerConnection.createDataChannel("chat");
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannel.onopen = () => {
      console.log("Data channel is open to receive msgs");
    };
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message came from data channel => ", message);
      ui.appendMsg(message, false);
    };
  };
  peerConnection.onicecandidate = (event) => {
    console.log("Getting ice candodate from stun server => ", event);
    if (event.candidate) {
      // send ice candidat to other peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };
  peerConnection.onconnectionstatechange = (event) => {
    console.log("On coneection state change => ", peerConnection, event);
    if (peerConnection.connectionState === "connected") {
      console.log("Successfully connected with other peer");
    }
  };
  // receiving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // add our stream to peer connection
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMsg = JSON.stringify(message);
  dataChannel.send(stringifiedMsg);
};

export const sendPreOffer = (callType, callePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: callePersonalCode,
  };
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showCallingDialog(callingDialogRejectHandler);
    const data = {
      callType,
      callePersonalCode,
    };
    store.setCallState(constants.callStates.CALL_AVAILABLE);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };
  if (!checkCallPossibility(callType)) {
    return sendPreOfferAnswer(
      constants.preOfferAnswer.CALL_UNAVAILABLE,
      callerSocketId
    );
  }
  store.setCallState(constants.callStates.CALL_AVAILABLE);
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  console.log("Call Accepted");
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  console.log("Call Rejected");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
  setIncomingCallsAvailable();
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const data = {
    callerSocketId: callerSocketId || connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialog();
  wss.sendPreOfferAnswer(data);
};

const callingDialogRejectHandler = () => {
  console.log("Rejeting dialog from calle side");
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };
  closePeerConnectionAndResetState();
  ui.removeAllDialog();
  wss.sendUserHangUp(data);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;
  console.log("Pre offer answe came -> ", data);
  ui.removeAllDialog();
  let showInfoDialog = true;

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    createPeerConnection();
    showInfoDialog = false;
    ui.showCallElements(connectedUserDetails.callType);
    // send webRTC offer to establish connection
    sendWebRTCOffer();
    store.setCallState(constants.callStates.CALL_UNAVAILABLE);
  } else {
    setIncomingCallsAvailable();
  }
  if (showInfoDialog) {
    ui.showInfoDialog(preOfferAnswer);
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,
  });
};

export const hadleWebRTCOffer = async (data) => {
  console.log("Webrtc offer came => ", data);
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  console.log("handeling webrtc answer -> ", data);
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (error) {
    console.error("Error while adding receieved ice candidate -> ", error);
  }
};

let screenSharingStream;
export const switchBetweenScreenSharingAndCamera = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(
      (sender) => sender.track.kind === localStream.getVideoTracks()[0].kind
    );
    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
    store.setStreamSharingActive(!screenSharingActive);
    ui.updateLocalVideo(localStream);
    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());
  } else {
    console.log("Switching for screen sharing => ");
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);
      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) =>
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
      );
      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      store.setStreamSharingActive(!screenSharingActive);
      ui.updateLocalVideo(screenSharingStream);
    } catch (error) {
      console.error("Error occuring while screen sharing => ", error);
    }
  }
};

// hangup related

export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };
  wss.sendUserHangUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  // active camera and mic
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }
  ui.updateUIAfterHangUp(connectedUserDetails.callType);
  setIncomingCallsAvailable();
  connectedUserDetails = null;
};

const checkCallPossibility = (callType) => {
  const callState = store.getState().callState;
  if (callState === constants.callStates.CALL_AVAILABLE) {
    return true;
  }
  if (
    (callType === constants.callType.VIDEO_PERSONAL_CODE ||
      callType === constants.callType.VIDEO_STRANGER) &&
    callState === constants.callStates.CALL_AVAILABLE_ONLY_CHAT
  ) {
    return false;
  }
  return false;
};

const setIncomingCallsAvailable = () => {
  const localStream = store.getState().localStream;
  if (localStream) {
    store.setCallState(constants.callStates.CALL_AVAILABLE);
  } else {
    store.setCallState(constants.callStates.CALL_AVAILABLE_ONLY_CHAT);
  }
};
