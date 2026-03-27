import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAudio } from '../context/AudioContext';

const AudioIntro = ({ onComplete }) => {
    const [isLeaving, setIsLeaving] = useState(false);
    const containerRef = useRef(null);
    const { playAudio } = useAudio();

    useEffect(() => {
        // Simple entrance animation for the dialog
        gsap.to(containerRef.current.querySelector('.intro-content'), {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "expo.out",
            delay: 0.2
        });
    }, []);

    const handleEnter = () => {
        setIsLeaving(true);
        playAudio();
        
        // Smooth fade out of the entire overlay
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                onComplete();
            }
        });
    };

    return (
        <div ref={containerRef} className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-6 sm:p-12 text-center pointer-events-auto">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.05)_0%,transparent_50%)]" />

            <div className="intro-content opacity-0 translate-y-8 max-w-2xl relative z-10 flex flex-col items-center">
                <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/40 mb-8 font-mono inline-block">Headphones Recommended</span>
                <h1 className="font-serif text-2xl md:text-4xl lg:text-[2.75rem] text-white/90 leading-snug lg:leading-normal mb-12 font-light text-balance tracking-wide max-w-4xl px-4">
                    Immerse yourself in the living sounds of the Amazon. A continuous field recording will accompany your journey.
                </h1>
                <button 
                    onClick={handleEnter}
                    disabled={isLeaving}
                    className="group relative px-10 py-4 bg-white/5 border border-white/20 rounded-full overflow-hidden transition-colors hover:bg-white/10 hover:border-white/40 backdrop-blur-sm cursor-pointer"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-[0.65rem] md:text-xs uppercase tracking-[0.4em] text-white/80 font-mono font-medium">
                        Enter Experience
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AudioIntro;
