import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60,
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\.(?:js|css|woff|woff2|ttf|otf|eot)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 128,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 256,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^https?.*\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "page-cache",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
    ],
  },
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
