"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LAUNCH_DATE = new Date("2026-08-01T00:00:00");

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-16 z-40 bg-[#8B1E1E] text-white py-3 shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-red-200">
              Launching in
            </p>
          </div>

          <div className="flex gap-3 md:gap-6">
            <div className="text-center">
              <div className="font-serif text-xl md:text-2xl leading-none">{timeLeft.days}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-200 mt-0.5">Days</div>
            </div>
            <span className="text-red-300 self-start mt-0.5">:</span>
            <div className="text-center">
              <div className="font-serif text-xl md:text-2xl leading-none">{timeLeft.hours}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-200 mt-0.5">Hrs</div>
            </div>
            <span className="text-red-300 self-start mt-0.5">:</span>
            <div className="text-center">
              <div className="font-serif text-xl md:text-2xl leading-none">{timeLeft.minutes}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-200 mt-0.5">Min</div>
            </div>
            <span className="text-red-300 self-start mt-0.5">:</span>
            <div className="text-center">
              <div className="font-serif text-xl md:text-2xl leading-none">{timeLeft.seconds}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-200 mt-0.5">Sec</div>
            </div>
          </div>

          <p className="text-xs text-red-200 ml-2">
            Aug 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}