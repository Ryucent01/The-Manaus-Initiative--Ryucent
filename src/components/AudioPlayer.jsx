import React from 'react';
import { useAudio } from '../context/AudioContext';

const AudioPlayer = () => {
    const { isPlaying, togglePlay } = useAudio();

    return (
        <button 
            onClick={togglePlay}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[200] w-9 md:w-14 h-9 md:h-14 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center p-1 group hover:border-white/40 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer"
            title={isPlaying ? "Pause Ambient Audio" : "Play Ambient Audio"}
        >
            {/* Record Disk */}
            <div className={`relative w-full h-full rounded-full bg-[#111] flex items-center justify-center border border-white/5 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                {/* Grooves */}
                <div className="absolute w-[85%] h-[85%] rounded-full border border-white/5" />
                <div className="absolute w-[70%] h-[70%] rounded-full border border-white/10" />
                <div className="absolute w-[50%] h-[50%] rounded-full border border-white/5" />
                
                {/* Center Label */}
                <div className="absolute w-[35%] h-[35%] rounded-full bg-emerald-900/60 flex items-center justify-center">
                    <div className="w-[30%] h-[30%] rounded-full bg-black border border-white/20" />
                </div>

                {/* Light Reflection highlights */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-full pointer-events-none" />
            </div>

            {/* Play/Pause Icon overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none">
                {isPlaying ? (
                    <div className="flex gap-1 md:gap-1.5 align-center justify-center">
                        <div className="w-0.5 md:w-1 h-3 md:h-4 bg-white/90 rounded" />
                        <div className="w-0.5 md:w-1 h-3 md:h-4 bg-white/90 rounded" />
                    </div>
                ) : (
                    <div className="w-0 h-0 border-t-[5px] md:border-t-[6px] border-t-transparent border-l-[8px] md:border-l-[10px] border-l-white/90 border-b-[5px] md:border-b-[6px] border-b-transparent translate-x-0.5" />
                )}
            </div>
        </button>
    );
};

export default AudioPlayer;
