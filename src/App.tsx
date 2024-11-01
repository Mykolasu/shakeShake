import "./App.css";
import { useEffect, useState } from "react";
import { dollarCoin, mainCharacter } from "./images";

function App() {
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const shakesToAdd = 1;

  useEffect(() => {
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const x = event.accelerationIncludingGravity?.x || 0;
      const y = event.accelerationIncludingGravity?.y || 0;
      const z = event.accelerationIncludingGravity?.z || 0;

      // Calculate absolute values to detect strong movement
      const deltaX = Math.abs(x);
      const deltaY = Math.abs(y);
      const deltaZ = Math.abs(z);

      // Detect shake if acceleration on any axis exceeds threshold
      if (deltaX > 15 || deltaY > 15 || deltaZ > 15) {
        setShakeCount((prevCount) => prevCount + shakesToAdd);
      }

      // Apply rotation transformation based on accelerometer data
      const rotateX = (y / 10).toFixed(2);
      const rotateY = (-x / 10).toFixed(2);
      setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    // Add device motion event listener
    window.addEventListener("devicemotion", handleMotionEvent, true);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent);
    };
  }, []);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10"></div>

        <div className="top-glow flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-1 left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">
                  {shakeCount.toLocaleString("en-EN")}
                </p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-80 h-80 p-4 rounded-full circle-outer"
                style={{ transform: transformStyle }}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img
                    src={mainCharacter}
                    alt="Main Character"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-red-500">
          {typeof DeviceMotionEvent === "undefined" && "No Accelerometer, sorry."}
        </p>
      </div>
    </div>
  );
}

export default App;
