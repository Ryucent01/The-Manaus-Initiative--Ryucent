import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.footer-item', {
                y: 30,
                opacity: 0,
                stagger: 0.08,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 95%',
                    once: true,
                }
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const navLinks = ['The Project', 'Impact Archive', 'Join the Journey'];

    return (
        <footer
            ref={footerRef}
            className="relative w-full overflow-hidden border-t border-amber-900/20 z-30"
            style={{ background: 'linear-gradient(160deg, #121812 0%, #0c120c 50%, #080a08 100%)' }}
        >
            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-950/20 blur-[140px] pointer-events-none" />

            <div className="relative z-10 w-full pt-32 pb-4">
                <div className="w-full flex flex-col justify-between min-h-[65vh] px-6 sm:px-10 md:px-16 xl:px-24">
                    
                    {/* Top: Massive CTA & Rooted in Widget */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-16 mt-10">
                        <div className="footer-item max-w-4xl">
                            <p className="text-[0.55rem] uppercase tracking-[0.6em] text-white/20 font-mono mb-6">The Manaus Initiative</p>
                            <h2 className="font-cursive text-5xl sm:text-6xl md:text-8xl italic font-light text-white/90 leading-tight">
                                For the Amazon.<br />
                                <span className="text-white/30">For all of us.</span>
                            </h2>
                        </div>
                        
                        <div className="footer-item w-full lg:w-auto shrink-0">
                            <div className="inline-flex items-start gap-4 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-pulse outline outline-4 outline-emerald-400/20" />
                                <div>
                                    <p className="text-[0.45rem] uppercase tracking-[0.4em] text-white/30 font-mono mb-2">Rooted in</p>
                                    <p className="text-white/80 text-[1.1rem] tracking-tight leading-snug font-medium mb-1">Manaus, Amazonas</p>
                                    <p className="text-white/40 text-xs tracking-tight font-mono">Brazil · S 3°6′ W 60°1′</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Cinematic Divider & Navigation */}
                    <div className="w-full mt-24 mb-6">
                        <div className="footer-item w-full h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-16" />
                        
                        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                            <div className="flex flex-col sm:flex-row gap-16 sm:gap-32 w-full md:w-auto">
                                <div className="footer-item">
                                    <p className="text-[0.5rem] uppercase tracking-[0.5em] text-white/25 font-mono mb-6">Navigate</p>
                                    <ul className="space-y-5">
                                        {navLinks.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="text-base text-white/50 hover:text-white/90 transition-colors duration-300 tracking-tight group flex items-center gap-3">
                                                    <span className="w-0 h-px bg-white/40 group-hover:w-4 transition-all duration-300" />
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="footer-item">
                                    <p className="text-[0.5rem] uppercase tracking-[0.5em] text-white/25 font-mono mb-6">Contact</p>
                                    <ul className="space-y-5">
                                        <li><a href="mailto:hello@manausinitiative.org" className="text-base text-white/50 hover:text-white/90 transition-colors duration-300 tracking-tight flex items-center gap-3"><span className="w-0 h-px bg-white/40 hover:w-4 transition-all duration-300" />hello@manausinitiative.org</a></li>
                                        <li><a href="#" className="text-base text-white/50 hover:text-white/90 transition-colors duration-300 tracking-tight flex items-center gap-3"><span className="w-0 h-px bg-white/40 hover:w-4 transition-all duration-300" />Press & Media</a></li>
                                        <li><a href="#" className="text-base text-white/50 hover:text-white/90 transition-colors duration-300 tracking-tight flex items-center gap-3"><span className="w-0 h-px bg-white/40 hover:w-4 transition-all duration-300" />Partner with Us</a></li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="footer-item flex gap-4 md:self-end opacity-80 md:mr-[6rem] lg:mr-[7rem]">
                                {[
                                    { label: 'X', path: <path d="M1 1l5.5 7.5L1 15h2.5l3.75-4.5L11 15h3l-5.75-7.75L13.5 1H11l-3.25 4-3.25-4H1z" fill="currentColor" /> },
                                    { label: 'Instagram', path: <><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" /></> },
                                ].map(({ label, path }) => (
                                    <a key={label} href="#" aria-label={label}
                                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-black hover:bg-white hover:border-white transition-all duration-300 group">
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 16 16">{path}</svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Massive Brand Marquee & Copyright */}
                    <div className="w-full relative mt-16 overflow-hidden flex flex-col justify-end text-center">
                        <div className="footer-item w-full flex flex-col sm:flex-row items-center justify-between px-2 pb-0 z-10 opacity-60">
                            <p className="text-[0.55rem] font-mono tracking-[0.3em] uppercase">
                                © 2026 Ryucent Collective.
                            </p>
                            <p className="text-[0.55rem] font-mono tracking-[0.2em] italic hidden sm:block">
                                Designed for impact.
                            </p>
                        </div>
                        
                        <h1 className="footer-item text-[17vw] xl:text-[16vw] font-black tracking-tighter text-white/[0.03] leading-[0.75] select-none w-full text-center mt-2 -mb-[2vw]">
                            MANAUS
                        </h1>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
