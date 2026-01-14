"use client";

import { useEffect, useState } from "react";
import { X, Download, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone ===
          true
    );

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissed > 7 || !dismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isIOS && !isStandalone) {
      const dismissed = localStorage.getItem("pwa-ios-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissed > 7 || !dismissed) {
        setTimeout(() => setShowIOSPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    localStorage.setItem("pwa-ios-dismissed", Date.now().toString());
  };

  if (isStandalone) {
    return null;
  }

  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">
                Install Macrotrue
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add to your home screen for the best experience
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors min-h-[44px]"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIOSPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">
                Install Macrotrue
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add to your home screen for the best experience
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">To install:</span>
            </p>
            <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span className="flex items-center gap-1">
                  Tap the share button
                  <Share className="w-4 h-4" />
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <span className="flex items-center gap-1">
                  Tap &quot;Add to Home Screen&quot;
                  <Plus className="w-4 h-4" />
                </span>
              </li>
            </ol>
          </div>
          <button
            onClick={handleDismiss}
            className="mt-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors min-h-[44px]"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return null;
}
