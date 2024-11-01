import React, { useState } from 'react';

const App: React.FC = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Function to handle permission request and start tracking
  const requestPermission = async () => {
    // Check if permission is required
    if ((window as any).DeviceMotionEvent && (window as any).DeviceMotionEvent.requestPermission) {
      try {
        const response = await (window as any).DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          startTracking();
        } else {
          alert('Permission denied to access motion data');
        }
      } catch (error) {
        console.error('Permission request failed:', error);
      }
    } else {
      // If not iOS or no special permission required, start tracking directly
      setPermissionGranted(true);
      startTracking();
    }
  };

  // Function to start tracking device motion
  const startTracking = () => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;

    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const x = event.accelerationIncludingGravity?.x ?? null;
      const y = event.accelerationIncludingGravity?.y ?? null;
      const z = event.accelerationIncludingGravity?.z ?? null;

      if (x === null || y === null || z === null) return;

      // Calculate shake if acceleration change exceeds threshold
      const shakeThreshold = 15;
      if (
        lastX !== null &&
        lastY !== null &&
        lastZ !== null &&
        (Math.abs(x - lastX) > shakeThreshold ||
          Math.abs(y - lastY) > shakeThreshold ||
          Math.abs(z - lastZ) > shakeThreshold)
      ) {
        setShakeCount((prev) => prev + 1);
      }

      // Update last values
      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotionEvent);
  };

  return (
    <div className="app">
      {!permissionGranted && (
        <button onClick={requestPermission}>Enable Motion Tracking</button>
      )}
      <p>Shake Count: {shakeCount}</p>
    </div>
  );
};

export default App;




// import "./App.css";
// import { useEffect, useState } from "react";
// import { dollarCoin, mainCharacter } from "./images";

// function App() {
//   const [shakeCount, setShakeCount] = useState<number>(0);
//   const [transformStyle, setTransformStyle] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const shakeThreshold = 15; // threshold for shake detection

//   useEffect(() => {
//     // Motion event handler
//     const handleMotionEvent = (event: DeviceMotionEvent) => {
//       // Check if accelerationIncludingGravity is available
//       if (!event.accelerationIncludingGravity) {
//         setErrorMessage("Device accelerometer is not supported or not accessible.");
//         return;
//       }

//       // Use default values of 0 if any of x, y, or z is null
//       const x = event.accelerationIncludingGravity.x ?? 0;
//       const y = event.accelerationIncludingGravity.y ?? 0;
//       const z = event.accelerationIncludingGravity.z ?? 0;

//       // Detect shake if any axis' acceleration exceeds the threshold
//       if (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold || Math.abs(z) > shakeThreshold) {
//         setShakeCount((prevCount) => prevCount + 1);
//       }

//       // Calculate rotation for transform effect
//       const rotateX = (y / 10).toFixed(2);
//       const rotateY = (-x / 10).toFixed(2);
//       setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
//     };

//     // Add the device motion event listener
//     window.addEventListener("devicemotion", handleMotionEvent, true);

//     // Cleanup function to remove the event listener on unmount
//     return () => {
//       window.removeEventListener("devicemotion", handleMotionEvent);
//     };
//   }, []);

//   return (
//     <div className="bg-black flex justify-center">
//       <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
//         <div className="px-4 z-10"></div>

//         <div className="top-glow flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
//           <div className="absolute top-1 left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
//             <div className="px-4 mt-4 flex justify-center">
//               <div className="px-4 py-2 flex items-center space-x-2">
//                 <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
//                 <p className="text-4xl text-white">
//                   {shakeCount.toLocaleString("en-EN")}
//                 </p>
//               </div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div
//                 className="w-80 h-80 p-4 rounded-full circle-outer"
//                 style={{ transform: transformStyle }}
//               >
//                 <div className="w-full h-full rounded-full circle-inner">
//                   <img
//                     src={mainCharacter}
//                     alt="Main Character"
//                     className="w-full h-full"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {errorMessage && (
//           <p className="text-red-500">{errorMessage}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
