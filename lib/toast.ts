import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const errorOptions = {
  ...defaultOptions,
  autoClose: 5000,
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, defaultOptions);
  },
  error: (message: string) => {
    toast.error(message, errorOptions);
  },
  info: (message: string) => {
    toast.info(message, defaultOptions);
  },
  warning: (message: string) => {
    toast.warning(message, defaultOptions);
  },
}; 