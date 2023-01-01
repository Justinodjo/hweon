import { ElNotification } from "element-plus";

export function showSuccess(message, title = "Succès") {
  ElNotification({
    title,
    message,
    type: "success",
    position: "top-right",
    duration: 4000,
  });
}

export function showError(message, title = "Erreur") {
  ElNotification({
    title,
    message,
    type: "error",
    position: "top-right",
    duration: 5000,
  });
}

export function showInfo(message, title = "Information") {
  ElNotification({
    title,
    message,
    type: "info",
    position: "top-right",
    duration: 4000,
  });
}
