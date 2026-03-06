// stores/useMyNotification.ts
import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
}

export const useMyNotification = defineStore('myNotificationStore', () => {
  const toasts = ref<IToast[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const actualDuration = type === 'loading' ? 999999 : duration;
    
    toasts.value.push({ id, message, type });

    if (type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, actualDuration);
    }
    return id;
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return { toasts, addToast, removeToast };
});