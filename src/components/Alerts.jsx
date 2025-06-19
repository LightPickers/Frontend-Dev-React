import { default as Swal } from "sweetalert2";
import { default as withReactContent } from "sweetalert2-react-content";

const LP_Swal = withReactContent(Swal);

// 確認對話框
export const ConfirmAlert = ({ title, text, icon = "warning" }) => {
  return LP_Swal.fire({
    title: <h3 className="alert-title">{title}</h3>,
    text: text,
    icon: icon,
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonText: "確認",
    customClass: {
      popup: "alert-popup",
      cancelButton: "alert-cancel-button",
      confirmButton: "alert-confirm-button",
      icon: "alert-icon",
    },
    buttonsStyling: false,
  });
};

/** @type {(title: string, text: string, icon: string, action: () => void | Promise<void>) => Promise<void>} */
// ConfirmDialogue({title: "", text: "", icon: "", action: () => {}})
export const ConfirmDialogue = async ({ title, text, icon = "warning", action }) => {
  const result = await ConfirmAlert({ title, text, icon });
  if (result.isConfirmed) {
    try {
      await action?.();
    } catch (swal_action_error) {
      console.error({ swal_action_error });
    }
  }
};

// 成功提示框
// SuccessAlert({title: "", text: ""})
export const SuccessAlert = ({ title = "成功！", text }) => {
  return LP_Swal.fire({
    title: <h3>{title}</h3>,
    text: text,
    icon: "success",
    confirmButtonText: "確定",
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-success-button",
      icon: "alert-icon",
    },
    buttonsStyling: false,
  });
};

// 資訊提示框
// InfoAlert({title: "", html: ""})
export const InfoAlert = ({ title = "提示", html }) => {
  return LP_Swal.fire({
    title: <h3>{title}</h3>,
    html,
    icon: "info",
    confirmButtonText: "我知道了",
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-info-button",
      icon: "alert-icon",
    },
    buttonsStyling: false,
  });
};

// 錯誤提示框
// ErrorAlert({title: "", text: ""})
export const ErrorAlert = ({ title = "錯誤！", text }) => {
  return LP_Swal.fire({
    title: <h3>{title}</h3>,
    text: text,
    icon: "error",
    confirmButtonText: "確定",
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-error-button",
      icon: "alert-icon",
    },
    buttonsStyling: false,
  });
};

export default {
  ConfirmAlert,
  ConfirmDialogue,
  SuccessAlert,
  ErrorAlert,
  InfoAlert,
};
