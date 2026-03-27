import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const wasPlayingRef = useRef(false);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/amazon_audio.wav');
        audioRef.current.loop = true;

        // Visibility change listener for pausing when tab is hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Save current state and pause if needed
                wasPlayingRef.current = !audioRef.current.paused;
                if (wasPlayingRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
            } else {
                // Resume if it was playing before
                if (wasPlayingRef.current) {
                    audioRef.current.play().catch(e => console.log('Audio play failed', e));
                    setIsPlaying(true);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
            setIsPlaying(true);
        }
    };

    const playAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.play().catch(e => console.log('Audio play failed', e));
        setIsPlaying(true);
    };

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay, playAudio }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
