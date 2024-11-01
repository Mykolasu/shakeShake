import "./App.css";
import { useEffect, useState } from "react";
import { dollarCoin, mainCharacter } from "./images";

// Определение типа для Accelerometer, если оно отсутствует
declare global {
  interface Window {
    Accelerometer?: any;
  }
}

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const shakesToAdd = 1;

  // Инициализация акселерометра
  const accelerometer = () => {
    if (!("Accelerometer" in window)) {
      console.error("Акселерометр не поддерживается на этом устройстве.");
      return;
    }

    try {
      const accelerometer = new window.Accelerometer({ frequency: 60 });
      // Устанавливаем начальные значения, чтобы избежать `undefined`
      let lastX = 0;
      let lastY = 0;
      let lastZ = 0;

      accelerometer.addEventListener("reading", () => {
        const { x, y, z } = accelerometer;

        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        // Встряхивание происходит при резком изменении на одной из осей
        if (deltaX > 15 || deltaY > 15 || deltaZ > 15) {
          setShakeCount((prevCount) => prevCount + shakesToAdd);
        }

        // Применение трансформации на основе данных акселерометра
        const rotateX = (y / 10).toFixed(2);
        const rotateY = (-x / 10).toFixed(2);
        setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);

        // Обновляем значения для следующего расчета
        lastX = x;
        lastY = y;
        lastZ = z;
      });

      accelerometer.start();
    } catch (error) {
      console.error("Не удалось получить доступ к акселерометру:", error);
    }
  };

  useEffect(() => {
    accelerometer();
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
      </div>
    </div>
  );
}

export default App;
