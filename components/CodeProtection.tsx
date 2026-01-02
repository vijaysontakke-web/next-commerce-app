"use client";

import { useEffect } from "react";
import disableDevtool from "disable-devtool";

export default function CodeProtection() {
  useEffect(() => {
    // Only run protection in production mode
    if (process.env.NODE_ENV === "production") {
      disableDevtool({
        // Add custom configuration here if needed
        // For example:
        // clearLog: true,
        // disableMenu: true,
      });
    }
  }, []);

  return null;
}
