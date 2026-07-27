"use client";

import { useEffect } from "react";

const CHUNK_RELOAD_KEY = "cca-chunk-reload";

function isChunkLoadError(message: string) {
  return (
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module")
  );
}

export function ChunkLoadRecovery() {
  useEffect(() => {
    function tryRecover(message: string) {
      if (!isChunkLoadError(message)) {
        return;
      }

      if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        return;
      }

      sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
      window.location.reload();
    }

    function onError(event: ErrorEvent) {
      tryRecover(event.message ?? "");
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "";

      tryRecover(message);
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });
    }

    function onLoad() {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    }

    window.addEventListener("load", onLoad);
    if (document.readyState === "complete") {
      onLoad();
    }

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
