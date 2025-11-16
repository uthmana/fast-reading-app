"use client";

import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";


export default function RightWordControlPanel() {
    const [speed, setSpeed] = useState(10);
    const [difficulty, setDifficulty] = useState(1);
    const [count, setCount] = useState(0);
    const [timer, setTimer] = useState(1);

    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [error, setError] = useState(false);
   // const [trueAnswer, setTrueAnswer] = useState(0);

    //const handleTrueAnswer = () => {
    //    if (count > 0) {
    //        setCorrect(() => correct + 1);
    //    } else {
    //        setWrong(() => wrong + 1);
    //    }
        const handleTrueAnswer = (e: React.MouseEvent) => {
            if (count > 0) {
                setCorrect((prevCorrect) => prevCorrect + 1);
            } else {
                setWrong((prevWrong) => prevWrong + 1);
            }

    }
    
    useEffect(() => {
        if (wrong > 10) {
            setError(true);
        }
        else {
            setError(false);
        }

    }, [wrong]);
    
    return (
        <div className="w-full p-3 bg-[#556b2f] text-white font-sans flex gap-2 items-center rounded-md">

            {/* SPEED SLIDER */}
            <div className="flex flex-col w-[260px]">
                <div className="text-sm mb-1">
                    Hız : <b>{speed} sn</b>
                </div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-[#5ec6ff]"
                />
                <span className="text-xs mt-1 opacity-90">Gösterim hızı</span>
            </div>

            {/* DIFFICULTY SLIDER */}
            <div className="flex flex-col w-[220px]">
                <div className="text-sm mb-1">
                    Zorluk : <b>{difficulty}</b>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full"
                />
                <span className="text-xs mt-1 opacity-90">Zorluk durumu</span>
            </div>

            {/* COUNT INPUT */}
            <div className="flex flex-col w-[140px] mx-2">
                <div className="text-sm mb-1 text-center">
                    <b>{count || 5}</b> Kaç Tane
                </div>
                <input
                    type="number"
                    className="w-full p-1 bg-white text-black rounded"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                />
            </div>


            {/* CONFIRM BUTTON */}
            <button
                onClick={(e) => handleTrueAnswer(e)}
                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white flex items-center h-[32px]"
            >
               <span> 👍 Doğrula</span>
            </button>

            {/* TIMER BOX */}
            <div className="flex flex-col items-center mx-2">
                <div className="flex items-center justify-center bg-[#f5a623] text-white w-[40px] h-[40px] rounded-sm text-xl">
                    <FaClock />
                </div>
                <div className="w-[40px] h-[28px] bg-[#f5a623] text-white rounded-sm flex items-center justify-center mt-1">
                    <b>{timer}</b>
                </div>
            </div>

            {/* RESULTS */}
            <div className="flex items-center gap-4 ml-auto">

                {/* Correct */}
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Doğru</span>
                    <input
                        type="text"
                        disabled
                        value={correct}
                        className="w-[60px] p-1 text-black bg-white rounded text-center"
                    />
                </div>

                {error && <h1>Error happened</h1>}
                {/* Wrong */}
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Yanlış</span>
                    <input
                        type="text"
                        disabled
                        value={wrong}
                        className="w-[60px] p-1 text-black bg-white rounded text-center"
                    />
                </div>

                {/* Net */}
                <div className="flex flex-col items-center">
                    <span className="text-sm mb-1">Net</span>
                    <input
                        type="text"
                        disabled
                        value={correct - wrong}
                        className="w-[60px] p-1 text-black bg-white rounded text-center"
                    />
                </div>
            </div>
        </div>
    );
}
