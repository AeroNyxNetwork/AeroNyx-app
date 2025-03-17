/*
 * @Description:
 * @Date: 2025-03-17 17:11:19
 * @LastEditTime: 2025-03-17 17:11:28
 */
import { create } from "zustand";

type ToastType = "success" | "error" | "warning";

interface ToastState {
  type: ToastType;
  message: string;
  show: boolean;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  type: "success",
  message: "",
  show: false,
  showToast: (type, message) => set({ type, message, show: true }),
  hideToast: () => set({ show: false }),
}));
