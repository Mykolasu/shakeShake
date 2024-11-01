import "./App.css";
import { useEffect, useState } from "react";
import { dollarCoin, mainCharacter } from "./images";

function App() {
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shakeThreshold = 15;

  const [motion, setMotion] = useState<{ xAcceleration: number; yAcceleration: number }>({
    xAcceleration: 0,
    yAcceleration: 0,
  });

  useEffect(() => {
    let lastUpdate = 0; // Время последнего обновления

    const handleMotionEvent = (event: DeviceMotionEvent) => {
      if (!event.accelerationIncludingGravity) {
        setErrorMessage("Device accelerometer is not supported or not accessible.");
        return;
      }

      const currentTime = Date.now(); // Текущее время
      const deltaTime = currentTime - lastUpdate; // Разница во времени

      // Обновляем состояние только если прошло больше 100ms
      if (deltaTime > 100) {
        lastUpdate = currentTime;

        const x = event.accelerationIncludingGravity.x ?? 0;
        const y = event.accelerationIncludingGravity.y ?? 0;
        const z = event.accelerationIncludingGravity.z ?? 0;

        // Увеличиваем счетчик тряски, если превышен порог
        if (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold || Math.abs(z) > shakeThreshold) {
          setShakeCount((prevCount) => prevCount + 1);
        }

        requestAnimationFrame(() => {
          setMotion({
            xAcceleration: x,
            yAcceleration: y,
          });
        });
      }
    };

    const requestPermission = async () => {
      if ("DeviceMotionEvent" in window && typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const response = await (DeviceMotionEvent as any).requestPermission();
          if (response === "granted") {
            window.addEventListener("devicemotion", handleMotionEvent, true);
          } else {
            setErrorMessage("Access to accelerometer was denied by user.");
          }
        } catch (error) {
          setErrorMessage(`Error while requesting accelerometer access: ${error}`);
        }
      } else {
        // Если requestPermission не поддерживается
        window.addEventListener("devicemotion", handleMotionEvent, true);
      }
    };

    // Запрашиваем доступ к акселерометру при первом рендере
    requestPermission();

    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent);
    };
  }, []);

  useEffect(() => {
    const rotateX = (motion.yAcceleration).toFixed(2);
    const rotateY = (-motion.xAcceleration).toFixed(2);
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }, [motion]);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
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

        {errorMessage && (
          <p className="text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default App;
