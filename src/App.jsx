import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ProjectSection from './components/ProjectSection';
import EngageTiles from './components/EngageTiles';
import Footer from './components/Footer';
import TheProjectSidebar from './components/TheProjectSidebar';
import InitiativeOrigin from './components/InitiativeOrigin';
import MobileMenu from './components/MobileMenu';
import AudioIntro from './components/AudioIntro';
import AudioPlayer from './components/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

// Helper function to draw perfect SVG arcs
function getArcPath(cx, cy, r, startAngle, endAngle) {
    const startX = cx + r * Math.cos(startAngle * Math.PI / 180);
    const startY = cy + r * Math.sin(startAngle * Math.PI / 180);
    const endX = cx + r * Math.cos(endAngle * Math.PI / 180);
    const endY = cy + r * Math.sin(endAngle * Math.PI / 180);
    return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
}

const arcPaths = [
    getArcPath(550, 550, 380, -80, -10),  // Top-Right Arc
    getArcPath(550, 550, 380, 10, 80),    // Bottom-Right Arc
    getArcPath(550, 550, 380, 100, 170),  // Bottom-Left Arc
    getArcPath(550, 550, 380, 190, 260)   // Top-Left Arc
];

const App = () => {
    const mainRef = useRef(null);
    const videoRef = useRef(null);
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const cursiveRef = useRef(null);
    const joystickIndicatorRef = useRef(null);
    const joystickAnchorRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showMobileDiscover, setShowMobileDiscover] = useState(false);

    useLayoutEffect(() => {
        const lenis = new Lenis();
        window.lenis = lenis;
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        let ctx;
        if (isLoaded && isIntroComplete) {
            ctx = gsap.context(() => {
            // --- Entrance Sequence ---
            const tl = gsap.timeline({ delay: 0.5 });
            tl.to(videoRef.current, { opacity: 1, duration: 1 })
                .to('.video-container', {
                    width: '100vw',
                    height: '100vh',
                    duration: 2,
                    ease: 'expo.inOut'
                })
                .to('.char', {
                    y: 0,
                    duration: 1.2,
                    stagger: 0.08,
                    ease: 'expo.out'
                }, '-=0.8')
                .to('.hero-sub', {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: 'expo.out'
                }, '-=0.6')
                .to(cursiveRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'expo.out',
                    onStart: () => {
                        const chars = cursiveRef.current.querySelectorAll('.cursive-char');
                        gsap.to(chars, {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            duration: 0.1,
                            stagger: 0.035,
                            ease: 'power2.out'
                        });
                        gsap.to('.draw-path', {
                            strokeDashoffset: 0,
                            duration: 2.5,
                            stagger: 1,
                            ease: 'power2.inOut',
                            delay: 1
                        });
                    }
                }, '-=1.4')
                .to(['header nav > div', '.nav-item', '.mobile-menu-pill'], {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: 'expo.out'
                }, '-=0.8');

            // --- Hero Transition & Pin Unified Timeline ---
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '+=100%',
                    scrub: true,
                    pin: true,
                    pinSpacing: true,
                    refreshPriority: 10,
                    onLeave: () => gsap.set(['.video-container', '.hero-content-wrapper'], { autoAlpha: 0 }),
                    onEnterBack: () => gsap.set(['.video-container', '.hero-content-wrapper'], { autoAlpha: 1 })
                }
            });
            heroTl.to('.curtain-bar', { width: '101%', duration: 1, ease: 'none' });

            gsap.to('.marquee-track', {
                xPercent: -100,
                repeat: -1,
                duration: 25,
                ease: 'none'
            });

            gsap.to('.crime-tape-track', {
                xPercent: -50,
                repeat: -1,
                duration: 25,
                ease: 'none'
            });
            gsap.to('.crime-tape-track-reverse', {
                xPercent: 50,
                repeat: -1,
                duration: 30,
                ease: 'none'
            });
            gsap.set('.crime-tape-track-reverse', { xPercent: -50 });

            // --- About Section ---
            const layers = gsap.utils.toArray('.about-layer');
            const scrollBlocks = gsap.utils.toArray('.about-scroll-block');
            scrollBlocks.forEach((block, i) => {
                ScrollTrigger.create({
                    trigger: block,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    onToggle: (self) => {
                        if (self.isActive) {
                            gsap.to(layers, {
                                opacity: (idx) => idx === i ? 1 : 0,
                                duration: 1.2,
                                ease: 'power2.inOut',
                                overwrite: true
                            });
                        }
                    }
                });
            });

            // --- Mobile Discover Pill Transition ---
            ScrollTrigger.create({
                trigger: '.about-section',
                start: 'top 80%',
                end: 'bottom 50%',
                onToggle: (self) => {
                    setShowMobileDiscover(self.isActive);
                }
            });

            // --- Core Functions Interactive Section ---
            const functionsSection = document.querySelector('.functions-section');
            if (functionsSection) {
                const phraseParts = gsap.utils.toArray('.functions-section .phrase-part');
                const ringArcs = gsap.utils.toArray('.functions-section .ring-arc');
                const functionLabels = gsap.utils.toArray('.functions-section .function-label');
                const interactiveDots = gsap.utils.toArray('.functions-section .interactive-dot');
                const hitZones = gsap.utils.toArray('.functions-section .hit-zone');
                const ringContainer = document.querySelector('.ring-container');

                let activeIndex = -1;
                let interactionEnabled = false;

                // Stabilize Joystick Centering
                if (joystickIndicatorRef.current) {
                    gsap.set(joystickIndicatorRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
                }

                const triggerActiveState = (index) => {
                    if (index === activeIndex) return;
                    activeIndex = index;

                    const dots = gsap.utils.toArray('.functions-section .interactive-dot');
                    const labels = gsap.utils.toArray('.functions-section .function-label');
                    const parts = gsap.utils.toArray('.functions-section .phrase-part');
                    const arcs = gsap.utils.toArray('.functions-section .ring-arc');
                    const bgTints = gsap.utils.toArray('.functions-section .bg-tint');

                    if (index === -1) {
                        if (arcs.length) gsap.to(arcs, { opacity: 0.35, strokeWidth: 1.5, duration: 0.4 });
                        dots.length && dots.forEach(dot => {
                            gsap.killTweensOf(dot);
                            gsap.to(dot, { width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.4)', duration: 0.4, ease: 'power2.out' });
                        });
                        gsap.to(labels, { opacity: 0.5, color: '#fff', scale: 1, duration: 0.4 });
                        gsap.to(parts, {
                            opacity: 0.7,
                            color: '#fff',
                            textShadow: 'none',
                            filter: 'blur(0px)',
                            scale: 1,
                            duration: 0.4
                        });
                        gsap.to(bgTints, { opacity: 0, duration: 0.6 });
                        return;
                    }

                    arcs.forEach((arc, i) => {
                        gsap.to(arc, { opacity: i === index ? 1 : 0.15, strokeWidth: i === index ? 2 : 1.5, duration: 0.4 });
                    });

                    dots.forEach((dot, i) => {
                        gsap.killTweensOf(dot);
                        const isActive = i === index;
                        gsap.to(dot, {
                            width: isActive ? 18 : 8,
                            height: isActive ? 18 : 8,
                            backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                            duration: 0.4,
                            ease: 'back.out(1.5)'
                        });
                    });

                    labels.forEach((label, i) => {
                        gsap.to(label, { opacity: i === index ? 1 : 0.25, scale: i === index ? 1.05 : 1, duration: 0.4 });
                    });

                    parts.forEach((part) => {
                        const isTarget = part.getAttribute('data-index') === String(index);
                        const hasNoIndex = !part.hasAttribute('data-index');

                        gsap.to(part, {
                            opacity: isTarget ? 1 : (hasNoIndex ? 0.25 : 0.1),
                            filter: isTarget ? 'blur(0px)' : 'blur(2px)',
                            color: isTarget ? '#fff' : '#ffffff', // Keep both white but use opacity for focus
                            scale: isTarget ? 1.03 : 1,
                            textShadow: isTarget ? '0 0 30px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.4)' : 'none',
                            duration: 0.45,
                            ease: 'power2.out'
                        });
                    });

                    bgTints.forEach((tint, i) => {
                        gsap.to(tint, { opacity: i === index ? 0.7 : 0, duration: 0.6, ease: 'power2.out' });
                    });
                };

                // Desktop Listeners
                hitZones.forEach((zone, i) => {
                    zone.addEventListener('mouseenter', () => triggerActiveState(i));
                });
                if (ringContainer) {
                    ringContainer.addEventListener('mouseleave', () => triggerActiveState(-1));
                }

                // Cinematic Entrance
                const entranceTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: functionsSection,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    onComplete: () => { interactionEnabled = true; }
                });

                // Pin the section to allow time for interaction without scrolling past
                ScrollTrigger.create({
                    trigger: functionsSection,
                    start: 'top top',
                    end: '+=100%',
                    pin: true,
                    refreshPriority: 5
                });

                entranceTl
                    .to('.functions-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
                    .fromTo(phraseParts,
                        { opacity: 0, filter: 'blur(20px)', y: 20, scale: 0.98 },
                        { opacity: 0.7, filter: 'blur(0px)', y: 0, scale: 1, stagger: 0.05, duration: 1.8, ease: 'power3.out' },
                        '-=0.8'
                    )
                    .fromTo(ringArcs, { opacity: 0, drawSVG: "0%" }, { opacity: 0.35, drawSVG: "100%", duration: 2, ease: 'power3.inOut', stagger: 0.1 }, '-=1')
                    .fromTo(functionLabels, { opacity: 0, y: 15 }, { opacity: 0.5, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.7)' }, '-=1.2')
                    .fromTo(interactiveDots, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.7)' }, '-=1.2');

                // --- Mobile Joystick Interaction (Attach to joystickAnchorRef) ---
                if (joystickAnchorRef.current) {
                    const anchor = joystickAnchorRef.current;
                    const handleMove = (moveEvent) => {
                        const rect = anchor.getBoundingClientRect();
                        const cX = rect.left + rect.width / 2;
                        const cY = rect.top + rect.height / 2;
                        const dx = moveEvent.clientX - cX;
                        const dy = moveEvent.clientY - cY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist > 8) {
                            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                            let idx = -1;
                            if (angle >= -135 && angle < -45) idx = 0;
                            else if (angle >= -45 && angle < 45) idx = 1;
                            else if (angle >= 45 && angle < 135) idx = 2;
                            else idx = 3;

                            triggerActiveState(idx);

                            const moveDist = Math.min(dist, 60);
                            const targetX = Math.cos(angle * Math.PI / 180) * moveDist;
                            const targetY = Math.sin(angle * Math.PI / 180) * moveDist;
                            gsap.to(joystickIndicatorRef.current, { x: targetX, y: targetY, duration: 0.05, overwrite: 'auto' });
                        } else {
                            triggerActiveState(-1);
                            gsap.to(joystickIndicatorRef.current, { x: 0, y: 0, duration: 0.15, overwrite: 'auto' });
                        }
                    };

                    const handleEnd = (upEvent) => {
                        triggerActiveState(-1);
                        if (anchor.hasPointerCapture(upEvent.pointerId)) {
                            anchor.releasePointerCapture(upEvent.pointerId);
                        }
                        anchor.removeEventListener('pointermove', handleMove);
                        anchor.removeEventListener('pointerup', handleEnd);
                        anchor.removeEventListener('pointercancel', handleEnd);

                        gsap.to(anchor, { backgroundColor: 'rgba(255,255,255,0.05)', duration: 0.4 });
                        gsap.to('.joystick-ring', { opacity: 0, scale: 0.9, duration: 0.4 });
                        gsap.to('.joystick-ui', { opacity: 0, duration: 0.4 });
                        gsap.to(joystickIndicatorRef.current, { opacity: 0, scale: 0, x: 0, y: 0, duration: 0.4 });
                    };

                    anchor.addEventListener('pointerdown', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        anchor.setPointerCapture(e.pointerId);

                        gsap.to(anchor, { backgroundColor: 'rgba(255,255,255,0.12)', duration: 0.3 });
                        gsap.to('.joystick-ring', { opacity: 0.3, scale: 1.2, duration: 0.6, ease: 'power2.out' });
                        gsap.to('.joystick-ui', { opacity: 1, duration: 0.6 });
                        gsap.to(joystickIndicatorRef.current, { opacity: 1, scale: 1, duration: 0.4 });

                        anchor.addEventListener('pointermove', handleMove);
                        anchor.addEventListener('pointerup', handleEnd);
                        anchor.addEventListener('pointercancel', handleEnd);
                    });
                }
            }

            // Force GSAP to recalculate pinned offsets after everything mounts
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

            // Sidebar Entrance Animation
            gsap.fromTo('.project-sidebar-container', 
                { xPercent: 101 },
                {
                    xPercent: 0,
                    duration: 1.2,
                    delay: 0.5,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.about-section',
                        start: 'top 50%', 
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, mainRef);
        }

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            if (ctx) ctx.revert();
        };
    }, [isLoaded, isIntroComplete]); // Re-run when loaded and intro finished

    // Update window transition functions with latest state
    useLayoutEffect(() => {
        window.triggerProjectTransition = () => {
            if (isTransitioning || isOriginOpen) return;
            setIsTransitioning(true);

            const tl = gsap.timeline({
                onComplete: () => {
                    setIsTransitioning(false);
                    // Hide container to avoid sub-pixel artifacts
                    gsap.set('.project-transition-overlay', { autoAlpha: 0 });
                }
            });

            gsap.set('.project-transition-overlay', { autoAlpha: 1 });
            gsap.set('.project-curtain-bar', { width: 0, right: 0, left: 'auto', opacity: 1 });

            tl.to('.project-curtain-bar', {
                width: '101%',
                duration: 0.8,
                stagger: -0.1, 
                ease: 'expo.inOut',
                onComplete: () => {
                    setIsOriginOpen(true);
                    document.body.style.overflow = 'hidden';
                }
            })
            .to('.project-curtain-bar', {
                width: 0,
                duration: 0.8,
                stagger: -0.1,
                ease: 'expo.inOut',
                delay: 0.1,
                onStart: () => {
                    gsap.set('.project-curtain-bar', { left: 0, right: 'auto' });
                }
            });
        };

        window.closeProjectTransition = () => {
            if (isTransitioning || !isOriginOpen) return;
            setIsTransitioning(true);

            const tl = gsap.timeline({
                onComplete: () => {
                    setIsTransitioning(false);
                    // Hide container to avoid sub-pixel artifacts
                    gsap.set('.project-transition-overlay', { autoAlpha: 0 });
                }
            });

            gsap.set('.project-transition-overlay', { autoAlpha: 1 });
            gsap.set('.project-curtain-bar', { left: 0, right: 'auto', width: 0, opacity: 1 });

            tl.to('.project-curtain-bar', {
                width: '101%',
                duration: 0.8,
                stagger: 0.1, 
                ease: 'expo.inOut',
                onComplete: () => {
                    setIsOriginOpen(false);
                    document.body.style.overflow = 'auto';
                    setTimeout(() => ScrollTrigger.refresh(), 100);
                }
            })
            .to('.project-curtain-bar', {
                width: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'expo.inOut',
                delay: 0.1,
                onStart: () => {
                    gsap.set('.project-curtain-bar', { right: 0, left: 'auto' });
                }
            });
        };

        window.scrollToSection = (section) => {
            let target = null;
            if (section === 'impact') target = '.impact-archive-section';
            if (section === 'journey' || section === 'footer') target = '.podcast-section';
            
            if (target) {
                const element = document.querySelector(target);
                if (element) {
                    window.lenis?.scrollTo(element, { 
                        offset: 0, 
                        duration: 2, 
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
                    });
                }
            }
        };
    }, [isTransitioning, isOriginOpen]);

    return (
        <main ref={mainRef} className="bg-mana-bg min-h-[200vh]">
            {/* 
                Absolute Isolation Wrapper for Safari Mobile
                When the Project page is open, we hide the entire underlying site to prevent any 
                background text/animation leaks through the dynamic Safari viewport.
            */}
            <div className={`site-isolation-wrapper transition-all duration-300 ${isOriginOpen ? 'invisible opacity-0' : 'visible opacity-100'}`}>
                {/* 4-column Global Grid Lines */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="vertical-divider" style={{ left: `${i * 25}%` }} />
                ))}
            <header className="hidden md:block fixed top-0 left-0 w-full py-4 md:py-8 pl-8 pr-20 lg:pr-28 z-[200] bg-gradient-to-b from-black/20 to-transparent">
                <nav className="flex justify-between items-center text-[0.55rem] md:text-[0.62rem] uppercase tracking-[0.35em] md:tracking-[0.45em] font-medium text-white/40 drop-shadow-sm">
                    <div 
                        className="font-black cursor-pointer opacity-0 -translate-y-4 transition-all duration-1000 hover:text-white/90 py-1"
                        onClick={() => {
                            if (isOriginOpen) window.closeProjectTransition();
                            window.lenis?.scrollTo(0, { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                        }}
                    >
                        MANAUS / RYUCENT™
                    </div>
                    <div className="flex gap-4 md:gap-14">
                        <div 
                            className="nav-item hover:text-white/90 cursor-pointer transition-all duration-1000 opacity-0 -translate-y-4 group relative py-1"
                            onClick={() => {
                                if (!isTransitioning && !isOriginOpen) {
                                    window.triggerProjectTransition();
                                }
                            }}
                        >
                            <span className="relative z-10 hidden sm:inline">THE</span> PROJECT
                            <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-white/30 transition-all duration-1000 group-hover:w-full" />
                        </div>
                        <div 
                            className="nav-item hover:text-white/90 cursor-pointer transition-all duration-1000 opacity-0 -translate-y-4 group relative py-1"
                            onClick={() => {
                                if (isOriginOpen) window.closeProjectTransition();
                                window.scrollToSection('impact');
                            }}
                        >
                            <span className="relative z-10">IMPACT <span className="hidden sm:inline">IN ACTION</span></span>
                            <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-white/30 transition-all duration-1000 group-hover:w-full" />
                        </div>
                        <div 
                            className="nav-item hover:text-white/90 cursor-pointer transition-all duration-1000 opacity-0 -translate-y-4 group relative py-1"
                            onClick={() => {
                                if (isOriginOpen) window.closeProjectTransition();
                                window.scrollToSection('footer');
                            }}
                        >
                            <span className="relative z-10"><span className="hidden sm:inline">JOIN THE </span>JOURNEY</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[0.5px] bg-white/30 transition-all duration-1000 group-hover:w-full" />
                        </div>
                    </div>
                </nav>
            </header>

            <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

                {/* Scaling Video Loader */}
                <div className="video-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15vw] h-[20vh] z-0 overflow-hidden">
                    <video
                        ref={videoRef}
                        onLoadedData={() => setIsLoaded(true)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen object-cover opacity-0"
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                    >
                        <source src="/intro.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Hero Content Wrapper for Unified Visibility Toggling */}
                <div className="hero-content-wrapper relative z-10 text-center flex flex-col items-center">
                    <span className="hero-sub opacity-0 -translate-y-4 text-[0.6rem] md:text-[0.95rem] tracking-[1.8em] font-bold text-white mb-[-1.2vw] md:mb-[-1.8vw] z-20 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.9)] mr-[-1.8em]">THE</span>
                    <h1 id="hero-title" className="relative">
                        {"MANAUS".split('').map((char, i) => (
                            <span key={i} className="char translate-y-full">{char}</span>
                        ))}
                    </h1>
                    <div className="hero-sub opacity-0 translate-y-4 w-full max-w-[12rem] md:max-w-[18rem] lg:max-w-[24rem] flex justify-between text-[0.55rem] md:text-[0.9rem] font-bold text-white mt-[-1vw] md:mt-[-1.8vw] z-20 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.9)] uppercase">
                        {"INITIATIVE".split('').map((c, i) => (
                            <span key={i} className="inline-block">{c}</span>
                        ))}
                    </div>
                    {/* By Ryucent */}
                    <div className="hero-sub opacity-0 translate-y-6 mt-4 md:mt-6 text-[0.45rem] md:text-[0.55rem] tracking-[0.8em] font-mono text-white/50 z-20 flex items-center gap-3">
                        <span className="w-3 md:w-5 h-[1px] bg-white/20" />
                        BY RYUCENT™
                        <span className="w-3 md:w-5 h-[1px] bg-white/20" />
                    </div>
                </div>

                <div className="absolute bottom-32 md:bottom-20 z-10 text-center w-full px-6">
                    <div ref={cursiveRef} className="font-cursive text-lg md:text-[1.35rem] lg:text-[1.65rem] text-white/40 opacity-0 translate-y-4 max-w-4xl mx-auto flex flex-wrap justify-center items-center select-none leading-relaxed">
                        {/* Recursive word wrapper to handle chars + SVGs */}
                        <div className="flex flex-wrap justify-center items-center">
                            <span className="flex group/word text-white/40 relative">
                                {"where the ".split('').map((c, i) => (
                                    <span key={i} className="cursive-char opacity-0 inline-block translate-y-1 blur-[4px]">{c === ' ' ? '\u00A0' : c}</span>
                                ))}
                                {/* Added small accent leaf line */}
                                <svg className="absolute -top-6 md:-top-8 -left-2 md:-left-4 w-10 md:w-12 h-10 md:h-12 pointer-events-none stroke-white/20 fill-transparent" viewBox="0 0 50 50">
                                    <path
                                        className="draw-path"
                                        d="M10,40 Q25,10 40,40 Q25,25 10,40"
                                        strokeWidth="1.2"
                                        strokeDasharray="200"
                                        strokeDashoffset="200"
                                    />
                                </svg>
                            </span>

                            <span className="relative inline-block px-1 py-1 md:py-2 group/special mx-1 md:mx-2">
                                <span className="relative z-10 text-white/80 flex">
                                    {"Amazon's pulse".split('').map((c, i) => (
                                        <span key={i} className="cursive-char opacity-0 inline-block translate-y-1 blur-[4px]">{c === ' ' ? '\u00A0' : c}</span>
                                    ))}
                                </span>
                                <svg className="absolute -top-8 -left-4 w-[calc(100%+32px)] h-[calc(100%+48px)] pointer-events-none stroke-white/80 fill-transparent filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] overflow-visible" viewBox="0 0 240 100" preserveAspectRatio="none">
                                    <path
                                        className="draw-path hero-accent-line"
                                        d="M10,50 Q60,0 120,50 T230,50 Q180,95 120,50 T10,50"
                                        style={{ strokeWidth: 'var(--hero-stroke-pulse)' }}
                                        strokeLinecap="round"
                                        strokeDasharray="1500"
                                        strokeDashoffset="1500"
                                    />
                                </svg>
                            </span>

                            <span className="flex group/word text-white/40">
                                {"becomes our collective ".split('').map((c, i) => (
                                    <span key={i} className="cursive-char opacity-0 inline-block translate-y-1 blur-[4px]">{c === ' ' ? '\u00A0' : c}</span>
                                ))}
                            </span>

                            <span className="relative inline-block px-1 group/special mx-0.5 md:mx-2">
                                <span className="relative z-10 text-white/90 font-medium italic flex">
                                    {"mission".split('').map((c, i) => (
                                        <span key={i} className="cursive-char opacity-0 inline-block translate-y-1 blur-[4px]">{c === ' ' ? '\u00A0' : c}</span>
                                    ))}
                                </span>
                                <svg className="absolute bottom-[-6px] left-[-10px] w-[calc(100%+20px)] h-[30px] pointer-events-none stroke-white/80 fill-transparent filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] overflow-visible" viewBox="0 0 220 40" preserveAspectRatio="none">
                                    <path
                                        className="draw-path hero-accent-line"
                                        d="M10,20 C55,42 125,5 210,20"
                                        style={{ strokeWidth: 'var(--hero-stroke-mission)' }}
                                        strokeLinecap="round"
                                        strokeDasharray="800"
                                        strokeDashoffset="800"
                                    />
                                </svg>
                                {/* Added double underline for "mission" */}
                                <svg className="absolute bottom-[-16px] left-[-8px] w-[calc(100%+16px)] h-[24px] pointer-events-none stroke-white/40 fill-transparent overflow-visible" viewBox="0 0 220 30" preserveAspectRatio="none">
                                    <path
                                        className="draw-path hero-accent-line"
                                        d="M15,15 Q100,32 205,5"
                                        style={{ strokeWidth: 'var(--hero-stroke-sub)' }}
                                        strokeLinecap="round"
                                        strokeDasharray="600"
                                        strokeDashoffset="600"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-[5]" />
            </section>

            {/* Black Curtain Overlay for Scroll */}
            <div className="curtain-overlay fixed inset-0 flex pointer-events-none z-20">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="relative h-full w-1/4">
                        <div
                            className="curtain-bar absolute top-[-5vh] left-0 h-[110vh] bg-black w-0 z-20"
                        />
                    </div>
                ))}
            </div>

            {/* Right-to-Left Project Transition Curtain - Hero Style Columns */}
            <div className="project-transition-overlay fixed inset-0 flex pointer-events-none z-[180] invisible">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="relative h-full w-1/4">
                        <div
                            className="project-curtain-bar absolute top-[-5vh] right-0 h-[110vh] bg-[#fbc02d] w-0 z-[180] opacity-0"
                        />
                    </div>
                ))}
            </div>

            </div>

            <InitiativeOrigin 
                isOpen={isOriginOpen} 
                onClose={() => window.closeProjectTransition && window.closeProjectTransition()} 
            />

            <section className="relative h-screen bg-black flex flex-col justify-center overflow-hidden border-t border-white/5 z-30">
                <div className="marquee-container w-full py-10 md:py-20 flex whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                    <div className="marquee-track flex gap-10 md:gap-20">
                        <span className="text-[15vw] md:text-[12vw] font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">THE AMAZON IS NOT JUST A FOREST.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white/20 outline-text uppercase tracking-tighter leading-none">IT IS OUR COLLECTIVE FUTURE.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">THE AMAZON IS NOT JUST A FOREST.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white/20 outline-text uppercase tracking-tighter leading-none">IT IS OUR COLLECTIVE FUTURE.</span>
                    </div>
                    <div className="marquee-track flex gap-10 md:gap-20 ml-10 md:ml-20">
                        <span className="text-[15vw] md:text-[12vw] font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">THE AMAZON IS NOT JUST A FOREST.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white/20 outline-text uppercase tracking-tighter leading-none">IT IS OUR COLLECTIVE FUTURE.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">THE AMAZON IS NOT JUST A FOREST.</span>
                        <span className="text-[15vw] md:text-[12vw] font-black text-white/20 outline-text uppercase tracking-tighter leading-none">IT IS OUR COLLECTIVE FUTURE.</span>
                    </div>
                </div>
            </section>

            {/* NGO Description Section (About) */}
            <section className="about-section relative w-full bg-black z-30">
                <div className="project-sidebar-container hidden md:flex absolute top-0 right-0 h-full z-40 pointer-events-none justify-end">
                    <TheProjectSidebar onClick={() => window.triggerProjectTransition()} />
                </div>
                {/* Background Image Layers - Stay sticky for all scroll blocks */}
                <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
                    <div className="about-layer absolute inset-0 opacity-100">
                        <img src="/assets/1.jpg" className="w-full h-full object-cover grayscale-[20%]" alt="Forest Guardians" />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                    <div className="about-layer absolute inset-0 opacity-0">
                        <img src="/assets/2.jpg" className="w-full h-full object-cover" alt="Communities" />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                    <div className="about-layer absolute inset-0 opacity-0">
                        <img src="/assets/3.jpg" className="w-full h-full object-cover" alt="Solutions" />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                    <div className="about-layer absolute inset-0 opacity-0">
                        <img src="/assets/4.jpg" className="w-full h-full object-cover" alt="Global Impact" />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                </div>

                {/* Normal Scrolling Content */}
                <div className="relative z-10 w-full mt-[-100vh]">
                    {/* Sentence 01: Top Left */}
                    <div className="about-scroll-block h-screen flex items-center justify-start px-10 md:px-24">
                        <div className="max-w-4xl flex gap-3 md:gap-5">
                            <span className="text-white/20 font-mono text-xs md:text-sm mt-1.5 md:mt-2 shrink-0">01.</span>
                            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15]">
                                We are the guardians of over 2 million hectares of untouched rainforest, ensuring the survival of thousands of unique species.
                            </p>
                        </div>
                    </div>

                    {/* Sentence 02: Bottom Right */}
                    <div className="about-scroll-block h-screen flex items-center justify-end px-10 md:px-24 text-right">
                        <div className="max-w-4xl flex gap-3 md:gap-5 flex-row-reverse">
                            <span className="text-white/20 font-mono text-xs md:text-sm mt-1.5 md:mt-2 shrink-0">02.</span>
                            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15]">
                                Our mission empowers indigenous tribes with modern technology while honoring ancestral wisdom and preserving sovereign land rights.
                            </p>
                        </div>
                    </div>

                    {/* Sentence 03: Center Left */}
                    <div className="about-scroll-block h-screen flex items-center justify-start px-10 md:px-24">
                        <div className="max-w-4xl flex gap-3 md:gap-5">
                            <span className="text-white/20 font-mono text-xs md:text-sm mt-1.5 md:mt-2 shrink-0">03.</span>
                            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15]">
                                We implement clean energy and water filtration systems in remote villages, proving that forest life can be both traditional and thriving.
                            </p>
                        </div>
                    </div>

                    {/* Sentence 04: Bottom Right */}
                    <div className="about-scroll-block h-screen flex items-center justify-end px-10 md:px-24 text-right">
                        <div className="max-w-4xl flex gap-3 md:gap-5 flex-row-reverse">
                            <span className="text-white/20 font-mono text-xs md:text-sm mt-1.5 md:mt-2 shrink-0">04.</span>
                            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15]">
                                Our ecological data bridges the gap between local action and international policy, shaping the global response to the climate crisis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Functions (The System) Section */}
            <section className="functions-section relative h-screen w-full bg-gradient-to-b from-[#3E4A3D] to-[#5C6B50] flex flex-col items-center justify-center overflow-hidden z-40 pt-24 pb-8 md:py-8">

                {/* Background Tint Overlays for active states - Optimized for Olive/Forest palette */}
                <div className="bg-tint absolute inset-0 bg-[#1E2B1A] opacity-0 pointer-events-none z-0 mix-blend-multiply transition-colors"></div>
                <div className="bg-tint absolute inset-0 bg-[#424B2C] opacity-0 pointer-events-none z-0 mix-blend-multiply transition-colors"></div>
                <div className="bg-tint absolute inset-0 bg-[#2C3621] opacity-0 pointer-events-none z-0 mix-blend-multiply transition-colors"></div>
                <div className="bg-tint absolute inset-0 bg-[#3B4232] opacity-0 pointer-events-none z-0 mix-blend-multiply transition-colors"></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center h-full">

                    <div className="functions-title mb-4 opacity-0 -translate-y-4 flex flex-col items-center drop-shadow-sm">
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-white/40 mb-3">Strategic Alignment</span>
                        <h2 className="text-white text-3xl md:text-5xl font-light tracking-tight text-center">How we drive impact.</h2>
                    </div>

                    {/* Interactive Arch Ring - Aspect Square constrained (Desktop Only) */}
                    <div className="ring-container hidden md:flex relative aspect-square w-full max-w-[850px] items-center justify-center drop-shadow-lg">

                        {/* 4 SVG Arcs rendered dynamically */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1100 1100">
                            {arcPaths.map((path, i) => (
                                <path key={i} className={`ring-arc arc-${i}`} d={path} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                            ))}
                        </svg>

                        {/* Central Editorial Sentence (Softened Inactive State) */}
                        <div className="central-phrase-container text-center w-full max-w-2xl px-4 md:px-12 z-20 pointer-events-none">
                            <p className="text-white text-lg md:text-3xl lg:text-[2.2rem] font-light tracking-tight leading-[1.35]">
                                <span className="phrase-part inline-block mx-1">The</span>
                                <span className="phrase-part inline-block mx-1">Manaus</span>
                                <span className="phrase-part inline-block mx-1">Initiative</span>
                                <span className="phrase-part inline-block mx-1">is</span>
                                <span className="phrase-part inline-block mx-1">the</span>
                                <span className="phrase-part inline-block mx-1 font-medium">Living System</span>
                                <span className="phrase-part inline-block mx-1">that</span>
                                <br className="hidden md:block" />
                                <span className="phrase-part inline-block mx-1" data-index="0">guards the forest,</span>
                                <span className="phrase-part inline-block mx-1" data-index="1">empowers land rights,</span>
                                <br className="hidden md:block" />
                                <span className="phrase-part inline-block mx-1" data-index="2">fuels innovation</span>
                                <span className="phrase-part inline-block mx-1 px-1">and</span>
                                <span className="phrase-part inline-block mx-1" data-index="3">influences global policy.</span>
                            </p>
                        </div>

                        {/* Interactive Overlay Zones (Hit Zones) mapped to exact R=380 radius (15.45% / 84.54%) */}

                        {/* Top: Protective */}
                        <div className="hit-zone absolute w-[160px] md:w-[220px] h-[160px] md:h-[220px] cursor-pointer z-30 flex items-center justify-center translate-x-[-50%] translate-y-[-50%]" style={{ top: '15.45%', left: '50%' }}>
                            <div className="relative flex flex-col items-center justify-center">
                                <span className="function-label text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/50 font-medium uppercase mb-5 absolute bottom-0 -translate-y-[20px]">Protective</span>
                                <div className="interactive-dot w-2 h-2 bg-white/40 rounded-full" />
                            </div>
                        </div>

                        {/* Right: Catalytic */}
                        <div className="hit-zone absolute w-[160px] md:w-[220px] h-[160px] md:h-[220px] cursor-pointer z-30 flex items-center justify-center translate-x-[-50%] translate-y-[-50%]" style={{ top: '50%', left: '84.54%' }}>
                            <div className="relative flex items-center justify-center">
                                <div className="interactive-dot w-2 h-2 bg-white/40 rounded-full" />
                                <span className="function-label text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/50 font-medium uppercase rotate-90 whitespace-nowrap absolute left-0 translate-x-[20px] origin-center">Catalytic</span>
                            </div>
                        </div>

                        {/* Bottom: Rooted */}
                        <div className="hit-zone absolute w-[160px] md:w-[220px] h-[160px] md:h-[220px] cursor-pointer z-30 flex items-center justify-center translate-x-[-50%] translate-y-[-50%]" style={{ top: '84.54%', left: '50%' }}>
                            <div className="relative flex flex-col items-center justify-center">
                                <div className="interactive-dot w-2 h-2 bg-white/40 rounded-full" />
                                <span className="function-label text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/50 font-medium uppercase mt-5 absolute top-0 translate-y-[20px]">Rooted</span>
                            </div>
                        </div>

                        {/* Left: Strategic */}
                        <div className="hit-zone absolute w-[160px] md:w-[220px] h-[160px] md:h-[220px] cursor-pointer z-30 flex items-center justify-center translate-x-[-50%] translate-y-[-50%]" style={{ top: '50%', left: '15.45%' }}>
                            <div className="relative flex items-center justify-center">
                                <span className="function-label text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/50 font-medium uppercase -rotate-90 whitespace-nowrap absolute right-0 -translate-x-[20px] origin-center">Strategic</span>
                                <div className="interactive-dot w-2 h-2 bg-white/40 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Joystick Navigation (Shown on mobile only) */}
                    <div className="mobile-joystick-wrap md:hidden flex flex-col items-center justify-center w-full px-6">
                        {/* Replicated Sentence for Mobile */}
                        <div className="mb-10 text-center">
                            <p className="text-white text-xl font-light tracking-tight leading-[1.4]">
                                <span className="phrase-part inline-block mx-1">The</span>
                                <span className="phrase-part inline-block mx-1">Manaus</span>
                                <span className="phrase-part inline-block mx-1">Initiative</span>
                                <span className="phrase-part inline-block mx-1">is</span>
                                <span className="phrase-part inline-block mx-1">the</span>
                                <span className="phrase-part inline-block mx-1 font-medium">Living System</span>
                                <span className="phrase-part inline-block mx-1">that</span>
                                <br />
                                <span className="phrase-part inline-block mx-1" data-index="0">guards the forest,</span>
                                <span className="phrase-part inline-block mx-1" data-index="1">empowers land rights,</span>
                                <br />
                                <span className="phrase-part inline-block mx-1" data-index="2">fuels innovation</span>
                                <span className="phrase-part inline-block mx-1 px-1">and</span>
                                <span className="phrase-part inline-block mx-1" data-index="3">influences global policy.</span>
                            </p>
                        </div>

                        {/* Joystick Controller */}
                        <div className="relative w-72 h-72 flex items-center justify-center touch-none">
                            {/* Static Background Rings */}
                            <div className="joystick-ring absolute inset-0 rounded-full border border-white/10 opacity-0 scale-90 transition-all duration-500 scale-ring" />

                            {/* Function Labels positioned radially */}
                            <div className="joystick-ui absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none">
                                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-white/40 uppercase">Protective</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-widest text-white/40 uppercase rotate-90 translate-x-4">Catalytic</span>
                                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-white/40 uppercase">Rooted</span>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-widest text-white/40 uppercase -rotate-90 -translate-x-4">Strategic</span>
                            </div>

                            {/* Active Dot / Indicator */}
                            <div
                                ref={joystickIndicatorRef}
                                className="joystick-indicator absolute w-8 h-8 rounded-full border border-white/40 bg-white/10 opacity-0 scale-0 pointer-events-none z-30 left-1/2 top-1/2"
                            />

                            {/* Touch Button (The Anchor) */}
                            <div
                                ref={joystickAnchorRef}
                                className="joystick-anchor w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/5 transition-colors cursor-crosshair select-none z-20 touch-none"
                            >
                                <div className="text-center pointer-events-none">
                                    <p className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-40 leading-relaxed">Hold &<br />Move</p>
                                </div>
                            </div>
                        </div>

                        {/* Removed Drag to explore text */}
                    </div>

                    <div className="mt-12 text-center opacity-20">
                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em]">Explore dimensions of impact</p>
                    </div>
                </div>
            </section>

            <div className="impact-archive-section">
                <ProjectSection />
            </div>

            {/* Crime Tape Quote Section */}
            <section className="crime-tape-section h-[80vh] bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden z-30 border-t border-white/5">
                
                {/* Background Tape (Slower, reversed, darker) */}
                <div className="absolute top-1/2 left-0 w-[120%] -translate-y-[100%] rotate-[2deg] bg-[#8B7300] py-4 shadow-inner z-10 flex whitespace-nowrap overflow-hidden opacity-30">
                    {[1, 2].map((track) => (
                        <div key={track} className="crime-tape-track-reverse flex items-center pr-10 shrink-0 min-w-full justify-around">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-10 pr-10">
                                    <span className="text-sm font-black text-black/80 tracking-[0.2em] uppercase">No action is too small</span>
                                    <span className="text-sm font-black text-black/80 tracking-[0.2em] uppercase">The cycle continues</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Foreground Tape (Faster, bright yellow, angled) */}
                <div className="absolute top-1/2 left-0 w-[120%] -translate-y-[20%] -rotate-[3deg] bg-[#fbc02d] py-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 flex whitespace-nowrap overflow-hidden -ml-[5vw]">
                    {[1, 2].map((track) => (
                        <div key={track} className="crime-tape-track flex items-center pr-10 shrink-0 min-w-full justify-around">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-14 pr-14">
                                    <span className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase whitespace-nowrap leading-none">
                                        We are not defending nature.
                                    </span>
                                    <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase px-4 py-2 bg-black text-[#fbc02d] whitespace-nowrap leading-none">
                                        We are nature defending itself.
                                    </span>
                                    {/* Caution Stripes Motif */}
                                    <div className="flex w-32 h-12 [background:repeating-linear-gradient(45deg,black,black_10px,transparent_10px,transparent_20px)] opacity-30" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                
                {/* Subtle vignette for the section */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,1)_100%)] pointer-events-none z-30" />
            </section>

            <EngageTiles />

            <Footer />
            <MobileMenu showDiscover={showMobileDiscover} isProjectOpen={isOriginOpen} />

            {/* Persistent Audio Player */}
            <AudioPlayer />

            {/* Initial Intro Screen */}
            {!isIntroComplete && (
                <AudioIntro onComplete={() => setIsIntroComplete(true)} />
            )}
        </main>
    );
};

export default App;
