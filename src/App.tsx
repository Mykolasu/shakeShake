import "./App.css";
import { useEffect, useState } from "react";
import { dollarCoin, mainCharacter } from "./images";
import useAccelerometer from "react-hook-accelerometer";

function App() {
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const shakesToAdd = 1;

  const sensor = useAccelerometer({ frequency: 60 });

  useEffect(() => {
    // Check for accelerometer errors
    if (sensor && sensor.error) {
      console.error("Accelerometer is not supported on this device.");
      return;
    }

    if (sensor) {
      const { x, y, z } = sensor;

      if (x !== null && y !== null && z !== null) {
        const deltaX = Math.abs(x);
        const deltaY = Math.abs(y);
        const deltaZ = Math.abs(z);

        // A shake is detected when there's a sharp change on any axis
        if (deltaX > 15 || deltaY > 15 || deltaZ > 15) {
          setShakeCount((prevCount) => prevCount + shakesToAdd);
        }

        const rotateX = (y / 10).toFixed(2);
        const rotateY = (-x / 10).toFixed(2);
        setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      }
    }
  }, [sensor]);

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

        {sensor && sensor.error && <p className="text-red-500">No Accelerometer, sorry.</p>}
      </div>
    </div>
  );
}

export default App;
