import { useEffect, useState } from "react";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { FaShareSquare } from "react-icons/fa";
import { GiSplitCross } from "react-icons/gi";
import "../CSS/Thoughts.css";

const HOURS_IN_WEEK = 168;

export default function ThoughtOfTheWeek() {
    const [thoughts, setThoughts] = useState([]);
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [on, setOn] = useState(true);

    // Calculate hour index of the week (0–167)
    const getWeekHourIndex = () => {
        const now = new Date();
        return now.getDay() * 24 + now.getHours();
    };

    // Fetch thoughts once
    useEffect(() => {
        fetch('/thoughts.json')
            .then(res => res.json())
            .then(data => {
                setThoughts(data);
                const currentIndex = getWeekHourIndex();
                setIndex(currentIndex % data.length);
                setOn(true);
            });
    }, []);

    // Auto fade every hour
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setIndex(prev => (prev + 1) % HOURS_IN_WEEK);
                setFade(true);
            }, 400); // fade duration
        }, 60 * 60 * 1000); // 1 hour

        return () => clearInterval(interval);
    }, []);

    const next = () => {
        setFade(false);
        setTimeout(() => {
            setIndex((index + 1) % HOURS_IN_WEEK);
            setFade(true);
        }, 300);
    };

    const prev = () => {
        setFade(false);
        setTimeout(() => {
            setIndex((index - 1 + HOURS_IN_WEEK) % HOURS_IN_WEEK);
            setFade(true);
        }, 300);
    };

    const shareQuote = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log("Text copied!");
                alert("Quote copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };


    if (!thoughts.length) return null;

    return (
        <>
            <div className="thought-wrapper">
                {on && (
                    <div className="thought-container">
                        <div className={fade ? "fade-in" : "fade-out"}>
                            <blockquote className="thought-text">
                                <q><em>{thoughts[index].quote}</em></q>
                            </blockquote>
                            <cite style={{ display: "flex", justifyContent: "right", paddingRight: "40px" }}>- {thoughts[index].by}</cite>
                        </div>

                        <div className="thought-controls">
                            <button onClick={prev} title={thoughts[index - 1].quote}><TiChevronLeft /></button>
                            <button onClick={() => { setOn(false) }} title="Close"><GiSplitCross /></button>
                            <button onClick={() => shareQuote(thoughts[index].quote)}><FaShareSquare /></button>
                            <button onClick={next} title={thoughts[index + 1].quote}><TiChevronRight /></button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
