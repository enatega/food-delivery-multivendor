import emailjs from "emailjs-com";

export const sendEmail = (templateId, templateParams) => {
  return emailjs.send(
    "service_463sz1v",
    templateId,
    templateParams,
    "kfOnsw1Kn8ZWu4l77"
  );
};