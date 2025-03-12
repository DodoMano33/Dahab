
/// <reference types="vite/client" />

// Add type definitions for experimental Navigator properties
interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}
