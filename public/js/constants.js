export const callType = {
  CHAT_PERSONAL_CODE: "CHAT_PERSONAL_CODE",
  VIDEO_PERSONAL_CODE: "VIDEO_PERSONAL_CODE",
  CHAT_STRANGER: "CHAT_STRANGER",
  VIDEO_STRANGER: "VIDEO_STRANGER",
};

export const preOfferAnswer = {
  CALLEE_NOT_FOUND: "CALLEE_NOT_FOUND",
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_UNAVAILABLE: "CALL_UNAVAILABLE",
};

export const infoDialogText = {
  CALLEE_NOT_FOUND: {
    title: "Call not found",
    description: "Please check personal code",
  },
  CALL_REJECTED: {
    title: "Call rejected",
    description: "Calle Rejected your call",
  },
  CALL_UNAVAILABLE: {
    title: "Call is not possible",
    description: "Calle is busy, try again later",
  },
};

export const defaultMediaConstraints = {
  audio: true,
  video: true,
};

export const RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:13902"],
    },
  ],
};

export const webRTCSignaling = {
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  ICE_CANDIDATE: "ICE_CANDIDATE",
};

export const callStates = {
  CALL_AVAILABLE: "CALL_AVAILABLE",
  CALL_UNAVAILABLE: "CALL_UNAVAILABLE",
  CALL_AVAILABLE_ONLY_CHAT: "CALL_AVAILABLE_ONLY_CHAT"
}
