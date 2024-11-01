// src/react-hook-accelerometer.d.ts

declare module 'react-hook-accelerometer' {
    export interface SensorData {
      x: number | null;
      y: number | null;
      z: number | null;
      error?: string;
    }
  
    export interface SensorOptions {
      frequency?: number;
    }
  
    export default function useAccelerometer(options?: SensorOptions): SensorData;
  }
  