export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log("Getting incoming call dialog");
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} Call`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");

  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const buttonConatiner = document.createElement("div");
  buttonConatiner.classList.add("dialog_button_container");

  const acceptCallButton = document.createElement("button");
  acceptCallButton.classList.add("dialog_accept_call_button");
  const acceptCallImg = document.createElement("img");
  acceptCallImg.src = "./utils/images/acceptCall.png";
  acceptCallImg.classList.add("dialog_button_image");
  acceptCallButton.appendChild(acceptCallImg);

  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.src = "./utils/images/rejectCall.png";
  rejectCallImg.classList.add("dialog_button_image");
  rejectCallButton.appendChild(rejectCallImg);

  buttonConatiner.appendChild(acceptCallButton);
  buttonConatiner.appendChild(rejectCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonConatiner);

  acceptCallButton.addEventListener("click", acceptCallHandler);
  rejectCallButton.addEventListener("click", rejectCallHandler);
  return dialog;
};

export const getCallingDialog = (rejectCallHandler) => {
  console.log("Getting incoming call dialog");
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Calling`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");

  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const buttonConatiner = document.createElement("div");
  buttonConatiner.classList.add("dialog_button_container");

  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");
  const rejectCallImg = document.createElement("img");
  rejectCallImg.src = "./utils/images/rejectCall.png";
  rejectCallImg.classList.add("dialog_button_image");
  rejectCallButton.appendChild(rejectCallImg);
  buttonConatiner.appendChild(rejectCallButton);

  dialogContent.appendChild(title);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(buttonConatiner);
  rejectCallButton.addEventListener("click", rejectCallHandler);
  return dialog;
};

export const getInfoDialog = ({ title, description }) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");
  dialog.appendChild(dialogContent);
  const dialogTitle = document.createElement("p");
  dialogTitle.classList.add("dialog_title");
  dialogTitle.innerHTML = title;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");

  const image = document.createElement("img");
  const avatarImagePath = "./utils/images/dialogAvatar.png";
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const dialogDescription = document.createElement("p");
  dialogDescription.classList.add("dialog_description");
  dialogDescription.innerHTML = description;

  dialogContent.appendChild(dialogTitle);
  dialogContent.appendChild(imageContainer);
  dialogContent.appendChild(dialogDescription);

  return dialog;
};

export const getLeftMsg = (message) => {
  const messages_container = document.createElement("div");
  messages_container.classList.add("message_left_container");
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_left_paragraph");
  messageParagraph.innerHTML = message;
  messages_container.appendChild(messageParagraph);
  return messages_container;
};

export const getRightMsg = (message) => {
  const messages_container = document.createElement("div");
  messages_container.classList.add("message_right_container");
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_right_paragraph");
  messageParagraph.innerHTML = message;
  messages_container.appendChild(messageParagraph);
  return messages_container;
};
