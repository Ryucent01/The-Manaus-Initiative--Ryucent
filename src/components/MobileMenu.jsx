import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const MobileMenu = ({ showDiscover = false, isProjectOpen = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const pillRef = useRef(null);
    const discoverPillRef = useRef(null);

    const toggleMenu = () => {
        if (!isOpen) {
            setIsOpen(true);
        } else {
            closeMenu();
        }
    };

    const closeMenu = () => {
        const tl = gsap.timeline({
            onComplete: () => setIsOpen(false)
        });

        tl.to(contentRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in"
        })
        .to(overlayRef.current, {
            clipPath: 'circle(0% at 50% 90%)',
            duration: 0.6,
            ease: "expo.inOut"
        });
    };

    useEffect(() => {
        if (isOpen) {
            const tl = gsap.timeline();
            
            // Expand from bottom center (pill location)
            tl.fromTo(overlayRef.current, 
                { clipPath: 'circle(0% at 50% 90%)' },
                { 
                    clipPath: 'circle(150% at 50% 90%)', 
                    duration: 0.8, 
                    ease: "expo.out" 
                }
            )
            .fromTo(contentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            )
            .fromTo('.mobile-nav-item',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
                "-=0.3"
            );
        }
    }, [isOpen]);

    // Handle Discover Pill visibility and Close state transformation
    useEffect(() => {
        if (!isOpen) {
            if (showDiscover || isProjectOpen) {
                gsap.to(discoverPillRef.current, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    display: 'flex',
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to(discoverPillRef.current, {
                    y: 20,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    display: 'none',
                    ease: "power3.in"
                });
            }
        } else {
            // Hide discover pill when menu is open
            gsap.to(discoverPillRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                display: 'none'
            });
        }
    }, [showDiscover, isOpen, isProjectOpen]);

    const handleLinkClick = (action) => {
        if (isOpen) closeMenu();
        
        // Use a shorter delay if just clicking the project pill directly
        const delay = isOpen ? 600 : 0;
        
        setTimeout(() => {
            if (action === 'project') {
                if (isProjectOpen) {
                    window.closeProjectTransition && window.closeProjectTransition();
                } else {
                    window.triggerProjectTransition && window.triggerProjectTransition();
                }
            } else if (action === 'impact') {
                window.scrollToSection && window.scrollToSection('impact');
            } else if (action === 'journey') {
                window.scrollToSection && window.scrollToSection('journey');
            }
        }, delay);
    };

    return (
        <div className="md:hidden">
            {/* Project Pill / Close Button (Yellow) */}
            <button
                ref={discoverPillRef}
                onClick={() => handleLinkClick('project')}
                className={`fixed ${isProjectOpen ? 'bottom-8 z-[350]' : 'bottom-24 z-[300]'} left-0 right-0 mx-auto bg-[#fbc02d] text-black rounded-full shadow-2xl border border-black/5 active:scale-95 transition-all duration-500 ease-in-out flex items-center justify-center overflow-hidden ${isProjectOpen ? 'w-12 h-12' : 'px-4 py-2 w-fit'}`}
                style={{ display: 'none', opacity: 0 }}
            >
                {isProjectOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-black">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center -ml-0.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-[#fbc02d]">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">THE PROJECT</span>
                    </div>
                )}
            </button>

            {/* Minimal Pill Button (Menu) */}
            <button
                ref={pillRef}
                onClick={toggleMenu}
                className={`fixed bottom-8 left-0 right-0 mx-auto z-[300] bg-black/40 text-white px-7 py-2.5 rounded-full text-[9px] font-mono tracking-[0.4em] uppercase shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/10 active:scale-95 transition-all duration-500 backdrop-blur-[16px] items-center justify-center group overflow-hidden mobile-menu-pill w-fit ${isProjectOpen ? '!opacity-0 scale-75 pointer-events-none' : 'flex opacity-0'}`}
            >
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                <span className="relative z-10 mr-[-0.4em]">MENU</span>
            </button>

            {/* Menu Overlay */}
            {isOpen && (
                <div 
                    ref={overlayRef}
                    className="fixed inset-0 z-[310] bg-black bg-opacity-95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden"
                    style={{ clipPath: 'circle(0% at 50% 90%)' }}
                >
                    <div ref={contentRef} className="w-full max-w-sm flex flex-col gap-10 text-center items-center scale-90 sm:scale-100">
                        <div className="mb-6 opacity-30">
                            <span className="text-[9px] font-mono tracking-[0.6em] uppercase">Manaus Initiative</span>
                        </div>

                        <div className="flex flex-col gap-6 w-full">
                            <button 
                                onClick={() => handleLinkClick('project')}
                                className="mobile-nav-item group flex flex-col items-center gap-1"
                            >
                                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30 mb-0.5">Discovery</span>
                                <span className="text-xl sm:text-2xl font-light tracking-widest text-white group-active:text-[#fbc02d] transition-colors">THE PROJECT</span>
                            </button>

                            <button 
                                onClick={() => handleLinkClick('impact')}
                                className="mobile-nav-item group flex flex-col items-center gap-1"
                            >
                                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30 mb-0.5">Our Work</span>
                                <span className="text-xl sm:text-2xl font-light tracking-widest text-white group-active:text-[#fbc02d] transition-colors">IMPACT IN ACTION</span>
                            </button>

                            <button 
                                onClick={() => handleLinkClick('journey')}
                                className="mobile-nav-item group flex flex-col items-center gap-1"
                            >
                                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30 mb-0.5">Community</span>
                                <span className="text-xl sm:text-2xl font-light tracking-widest text-white group-active:text-[#fbc02d] transition-colors">JOIN THE JOURNEY</span>
                            </button>
                        </div>

                        {/* Close Indicator */}
                        <button 
                            onClick={closeMenu}
                            className="mt-12 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center active:bg-white/5 active:scale-90 transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Branding Watermark */}
                    <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none opacity-5">
                        <span className="text-[12vw] font-black uppercase tracking-tighter">MANAUS</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileMenu;
