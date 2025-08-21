"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="
              transform-gpu 
              animate-in 
              slide-in-from-bottom-full 
              duration-300 
              ease-out
              backdrop-blur-md 
              shadow-2xl 
              border-2 
              ring-1 
              ring-black/5 
              dark:ring-white/5
              hover:shadow-3xl 
              hover:scale-[1.02] 
              transition-all 
              duration-200
              max-w-xs
              sm:max-w-sm
              data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-80 
              data-[state=closed]:slide-out-to-bottom-full 
              data-[state=closed]:duration-200
              data-[swipe=move]:transition-none
              data-[swipe=cancel]:translate-x-0
              data-[swipe=end]:animate-out
              data-[swipe=end]:slide-out-to-bottom-full
              data-[swipe=end]:duration-200
            "
          >
            <div className="flex items-start space-x-3 w-full">
              {/* Icon indicator based on variant */}
              <div className="flex-shrink-0 pt-0.5">
                {props.variant === 'destructive' && (
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
                )}
                {props.variant === 'success' && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                )}
                {props.variant === 'warning' && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50"></div>
                )}
                {(!props.variant || props.variant === 'default') && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="grid gap-1 flex-1 min-w-0">
                {title && (
                  <ToastTitle className="
                    font-semibold 
                    text-sm 
                    leading-tight 
                    truncate
                    pr-2
                  ">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="
                    text-sm 
                    leading-relaxed 
                    opacity-90 
                    pr-2
                    break-words
                  ">
                    {description}
                  </ToastDescription>
                )}
                
                {/* Action button styling */}
                {action && (
                  <div className="mt-2 flex justify-end">
                    <div className="
                      inline-flex 
                      items-center 
                      rounded-md 
                      text-xs 
                      font-medium 
                      transition-all 
                      duration-150
                      hover:scale-105
                      active:scale-95
                    ">
                      {action}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced close button */}
            <ToastClose className="
              !absolute 
              !right-2 
              !top-2 
              !opacity-70
              hover:!opacity-100 
              hover:scale-110 
              active:scale-95
              transition-all 
              duration-150
              rounded-full
              hover:bg-black/5
              dark:hover:bg-white/5
              focus:!ring-2
              focus:!ring-offset-1
            " />
          </Toast>
        )
      })}
      <ToastViewport className="
        fixed 
        bottom-4 
        right-4 
        z-[100] 
        flex 
        max-h-screen 
        w-full 
        max-w-xs
        flex-col 
        gap-2
        p-0
        sm:max-w-md
        md:max-w-[380px]
        pointer-events-none
        [&>*]:pointer-events-auto
      " />
    </ToastProvider>
  )
}