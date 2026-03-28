import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InitiativeOrigin = ({ isOpen, onClose }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);

    useLayoutEffect(() => {
        if (!isOpen || !scrollRef.current) return;

        const ctx = gsap.context(() => {
            // Entrance basic title
            gsap.fromTo('.origin-header > *', 
                { opacity: 0, y: 30, filter: 'blur(10px)' }, 
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'expo.out', delay: 0.8 }
            );

            // Force refresh to calculate scroll positions for the hidden-then-shown container
            setTimeout(() => ScrollTrigger.refresh(), 100);

            // Per-section animations
            const sections = gsap.utils.toArray('.origin-section');
            sections.forEach((section, i) => {
                const subContent = section.querySelectorAll('.section-anim');
                const image = section.querySelector('.section-image');

                gsap.fromTo(subContent, 
                    { opacity: 0, y: 50, filter: 'blur(10px)' },
                    { 
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        stagger: 0.1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            scroller: scrollRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );

                if (image) {
                    gsap.fromTo(image, 
                        { scale: 1.2, opacity: 0 },
                        {
                            scale: 1, opacity: 0.6,
                            duration: 2,
                            ease: 'expo.out',
                            scrollTrigger: {
                                trigger: section,
                                scroller: scrollRef.current,
                                start: 'top 90%',
                            }
                        }
                    );
                }
            });
        }, scrollRef);

        return () => ctx.revert();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div ref={containerRef} className="fixed -top-[5vh] left-0 right-0 h-[110vh] z-[120] bg-[#fbc02d] overflow-hidden flex flex-col">
            {/* Fixed Close Button - Positioned to avoid Navbar at top */}
            {/* Fixed Close Button - Positioned above the persistent audio player */}
            <div className="hidden md:block fixed bottom-28 right-10 z-[250]">
                <button 
                    onClick={onClose}
                    className="group flex flex-col items-center gap-3 text-black/40 hover:text-black transition-all duration-500"
                >
                    <span className="text-[9px] font-mono tracking-[0.5em] uppercase opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        Return
                    </span>
                    <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-[#fbc02d] group-hover:border-black transition-all duration-500 shadow-sm relative overflow-hidden">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Scrollable Container */}
            <div 
                ref={scrollRef} 
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#fbc02d] relative h-full"
            >
                
                {/* Section 1: THE GENESIS */}
                <section className="origin-section min-h-[105vh] flex flex-col items-center snap-start relative overflow-hidden border-b border-black/5 px-6 md:px-24 py-16 md:py-20">
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row items-start gap-4 md:gap-16 z-10 origin-header">
                        <span className="text-[6rem] md:text-[22rem] font-black text-black leading-none select-none opacity-90 tracking-tighter section-anim">
                            1
                        </span>
                        <div className="mt-12 md:mt-24 space-y-8 md:space-y-12">
                            <div className="space-y-2 section-anim">
                                <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-black/40 block">Foundations</span>
                                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                                    THE<br />GENESIS
                                </h2>
                            </div>
                            <div className="max-w-md space-y-6 section-anim">
                                <p className="text-black/80 text-xl font-medium leading-relaxed tracking-tight italic">
                                    "It started with a single camera and a vow to the Tupi community."
                                </p>
                                <p className="text-black/60 text-sm md:text-base leading-relaxed">
                                    In 2024, witnessed at the convergence of the Negro and Solimões rivers, the Manaus Initiative was born from the realization that the Amazon was going silent. We didn't want to just film the decline; we wanted to document the resistance.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-full absolute right-0 top-0 pointer-events-none opacity-40">
                         <img src="/assets/1.jpg" className="w-full h-full object-cover grayscale section-image" />
                         <div className="absolute inset-0 bg-gradient-to-r from-[#fbc02d] to-transparent" />
                    </div>
                </section>

                {/* Section 2: THE REACH */}
                <section className="origin-section min-h-[105vh] flex flex-col items-center snap-start relative overflow-hidden border-b border-black/5 px-6 md:px-24 py-16 md:py-20">
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row-reverse items-start md:items-start gap-4 md:gap-16 z-10 text-right md:text-right justify-end">
                        <span className="text-[6rem] md:text-[22rem] font-black text-black leading-none select-none opacity-90 tracking-tighter section-anim">
                            2
                        </span>
                        <div className="mt-4 md:mt-24 space-y-6 md:space-y-12 flex flex-col items-end">
                            <div className="space-y-1 md:space-y-2 section-anim">
                                <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-black/40 block">Global Impact</span>
                                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                                    OUR<br />REACH
                                </h2>
                            </div>
                            <div className="max-w-md space-y-4 md:space-y-6 section-anim">
                                <p className="text-black/80 text-lg md:text-xl font-medium leading-relaxed tracking-tight italic">
                                    "2 million hectares of protected canopy, 40 tribes reunited."
                                </p>
                                <p className="text-black/60 text-xs md:text-sm leading-relaxed">
                                    What began as a documentary became a network. We bridged the gap between indigenous sovereignty and international policy, creating the world's first 'Living Commons' where nature has a legal voice.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-full absolute left-0 top-0 pointer-events-none opacity-40">
                         <img src="/assets/2.jpg" className="w-full h-full object-cover grayscale section-image" />
                         <div className="absolute inset-0 bg-gradient-to-l from-[#fbc02d] to-transparent" />
                    </div>
                </section>

                {/* Section 3: THE TECHNOLOGY */}
                <section className="origin-section min-h-[105vh] flex flex-col items-center snap-start relative overflow-hidden border-b border-black/5 px-6 md:px-24 py-16 md:py-20">
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row items-start gap-4 md:gap-16 z-10">
                        <span className="text-[6rem] md:text-[22rem] font-black text-black leading-none select-none opacity-90 tracking-tighter section-anim">
                            3
                        </span>
                        <div className="mt-12 md:mt-24 space-y-8 md:space-y-12">
                            <div className="space-y-2 section-anim">
                                <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-black/40 block">Digital Guardian</span>
                                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                                    STREAMS<br />OF DATA
                                </h2>
                            </div>
                            <div className="max-w-md space-y-6 section-anim">
                                <p className="text-black/80 text-xl font-medium leading-relaxed tracking-tight italic">
                                    "Ancestral wisdom meets predictive ecological AI."
                                </p>
                                <p className="text-black/60 text-sm md:text-base leading-relaxed">
                                    We use mesh networks and satellite imagery—not to monitor people, but to listen to the forest. Our AI detects illegal logging vibration patterns before they even start, alerting local rangers instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-full absolute right-0 top-0 pointer-events-none overflow-hidden">
                         <img src="/amazon_digital_map_1774603739812.png" className="w-full h-full object-cover section-image opacity-80 mix-blend-multiply transition-all duration-1000 grayscale-[0.8] hover:grayscale-0" />
                         <div className="absolute inset-0 bg-gradient-to-r from-[#fbc02d] via-transparent to-transparent" />
                    </div>
                </section>

                {/* Section 4: JOIN THE JOURNEY */}
                <section className="origin-section min-h-[105vh] flex flex-col items-center justify-center snap-start relative overflow-hidden px-10 md:px-24 py-20 bg-black">
                    <div className="relative z-10 text-center space-y-12">
                         <h2 className="text-6xl md:text-9xl font-black text-[#fbc02d] uppercase tracking-tighter section-anim">
                            JOIN THE<br />MOVEMENT
                         </h2>
                         <p className="max-w-xl mx-auto text-white/60 text-lg md:text-xl section-anim">
                            The Manaus Initiative is not a closed circle. It is a collective pulse. Help us build the future of the Amazon.
                         </p>
                         <button className="section-anim px-12 py-5 bg-[#fbc02d] text-black font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all">
                            Support the Project
                         </button>
                    </div>
                    
                    {/* Background Graphic for CTA */}
                    <div className="absolute inset-0 opacity-20 section-image">
                         <img src="/assets/3.jpg" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#fbc02d]/20 to-black pointer-events-none" />
                </section>

                {/* Footer of Origin Page */}
                <footer className="py-10 text-center bg-black border-t border-white/5">
                    <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-white/20">© 2024 Manaus Initiative • Guardians of the Canopy</p>
                </footer>
            </div>

            {/* Grain Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('/noise.svg')] bg-repeat" />
            </div>
        </div>
    );
};

export default InitiativeOrigin;
