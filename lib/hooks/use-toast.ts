"use client"

import { toast as sonnerToast } from "sonner"

type ToastOptions = { title?: string; description?: string; variant?: "default" | "destructive" }

export const useToast = () => ({
  toast: ({ title, description, variant }: ToastOptions) =>
    variant === "destructive"
      ? sonnerToast.error(title, { description })
      : sonnerToast(title, { description }),
})
