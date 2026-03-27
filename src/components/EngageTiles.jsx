import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Podcast Waveform  –  Canvas 2D (lightweight)
───────────────────────────────────────────── */
const PodcastWave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let rafId;
        let visible = false;
        let t = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const observer = new IntersectionObserver(
            ([e]) => { visible = e.isIntersecting; },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        const LINES = [
            { freq: 0.022, amp: 14, phase: 0.0, alpha: 0.10 },
            { freq: 0.026, amp: 22, phase: 0.7, alpha: 0.18 },
            { freq: 0.020, amp: 30, phase: 1.4, alpha: 0.28 },
            { freq: 0.028, amp: 20, phase: 2.1, alpha: 0.18 },
            { freq: 0.018, amp: 12, phase: 2.8, alpha: 0.10 },
        ];

        const draw = () => {
            rafId = requestAnimationFrame(draw);
            if (!visible) return;
            t += 0.012;

            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            LINES.forEach(({ freq, amp, phase, alpha }) => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                ctx.lineWidth = 1.5;
                for (let i = 0; i <= 200; i++) {
                    const x = (i / 200) * W;
                    const y = H / 2
                        + Math.sin(i * freq * Math.PI * 2 + t + phase) * amp * Math.sin(t * 0.4 + phase)
                        + Math.sin(i * freq * 1.7 * Math.PI * 2 + t * 1.3 + phase) * amp * 0.4;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            });
        };
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: 'block' }}
        />
    );
};

/* ─────────────────────────────────────────────
   Crowdfunding Particle Network  –  Canvas 2D
───────────────────────────────────────────── */
const RootNetwork = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let rafId;
        let visible = false;
        let t = 0;
        let W = 0, H = 0;

        const NODE_COUNT = 30; // small enough to be light
        let nodes = [];

        const init = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            nodes = Array.from({ length: NODE_COUNT }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
            }));
        };
        init();

        const observer = new IntersectionObserver(
            ([e]) => { visible = e.isIntersecting; },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        window.addEventListener('resize', init);

        const CONNECT_DIST = 120;

        const draw = () => {
            rafId = requestAnimationFrame(draw);
            if (!visible) return;
            t += 0.004;

            ctx.clearRect(0, 0, W, H);

            // Move nodes
            nodes.forEach((n, i) => {
                n.x += n.vx + Math.sin(t + i) * 0.05;
                n.y += n.vy + Math.cos(t + i * 0.7) * 0.05;
                if (n.x < 0) n.vx += 0.05; if (n.x > W) n.vx -= 0.05;
                if (n.y < 0) n.vy += 0.05; if (n.y > H) n.vy -= 0.05;
            });

            // Draw connections
            for (let a = 0; a < NODE_COUNT; a++) {
                for (let b = a + 1; b < NODE_COUNT; b++) {
                    const dx = nodes[a].x - nodes[b].x;
                    const dy = nodes[a].y - nodes[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.22;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(184,150,46,${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[a].x, nodes[a].y);
                        ctx.lineTo(nodes[b].x, nodes[b].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212,175,60,0.65)';
                ctx.fill();
            });
        };
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
            window.removeEventListener('resize', init);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: 'block' }}
        />
    );
};

/* ─────────────────────────────────────────────
   Magnetic Button
───────────────────────────────────────────── */
const MagneticBtn = ({ children, className = '', href = '#' }) => {
    const btnRef = useRef(null);

    const onMouseMove = (e) => {
        const rect = btnRef.current.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        gsap.to(btnRef.current, { x: dx * 0.28, y: dy * 0.28, duration: 0.4, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
        gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    };

    return (
        <a
            ref={btnRef}
            href={href}
            className={`inline-block cursor-pointer select-none ${className}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </a>
    );
};

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
const EngageTiles = () => {
    const sectionRef = useRef(null);
    const podcastRef = useRef(null);
    const fundRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    once: true,
                }
            });

            tl.from('.engage-label', { opacity: 0, y: 20, duration: 1, ease: 'power3.out' })
              .from(podcastRef.current,
                { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out' }, '-=0.6')
              .from(fundRef.current,
                { opacity: 0, y: 80, duration: 1.2, ease: 'expo.out' }, '-=1')
              .from('.engage-inner',
                { opacity: 0, y: 24, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, '-=0.8');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    /* Subtle tilt on card mouse move */
    const tilt = (e, el) => {
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        gsap.to(el, { rotateY: mx * 5, rotateX: -my * 4, duration: 0.5, ease: 'power2.out', transformPerspective: 1200 });
    };
    const resetTilt = (el) => {
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-20 md:py-32 px-5 sm:px-10 md:px-16 xl:px-24 overflow-hidden z-30 border-t border-white/5"
            style={{ perspective: '1200px', background: 'linear-gradient(160deg, #080f09 0%, #060c07 50%, #050805 100%)' }}
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-amber-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Label */}
            <div className="engage-label mb-12 md:mb-16 flex items-center gap-4">
                <span className="text-[0.55rem] uppercase tracking-[0.5em] text-white/30 font-mono">Get Involved</span>
                <div className="flex-1 h-px bg-white/10 max-w-[120px]" />
            </div>

            {/* Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-start max-w-7xl mx-auto">

                {/* ── PODCAST TILE ── */}
                <div
                    ref={podcastRef}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group podcast-section"
                    style={{ minHeight: '520px', background: 'linear-gradient(145deg, #0d2b1e 0%, #0a1f15 60%, #071510 100%)' }}
                    onMouseMove={(e) => tilt(e, podcastRef.current)}
                    onMouseLeave={() => resetTilt(podcastRef.current)}
                >
                    <PodcastWave />

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-500/15 group-hover:ring-emerald-500/35 transition-all duration-700 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full p-7 sm:p-9" style={{ minHeight: '520px' }}>
                        <div>
                            <div className="engage-inner flex items-center gap-2 mb-8">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[0.55rem] uppercase tracking-[0.45em] text-emerald-400/70 font-mono">Voices from the Canopy</span>
                            </div>

                            <div className="engage-inner">
                                <p className="text-white/25 text-xs uppercase tracking-[0.4em] font-mono mb-1">The</p>
                                <h2 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-white mb-8">
                                    Podcast
                                </h2>
                            </div>

                            <div className="engage-inner inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[0.6rem] uppercase tracking-[0.35em] text-emerald-300/80 font-mono">Season one — Coming soon</span>
                            </div>
                        </div>

                        <div>
                            <div className="engage-inner space-y-2 mb-8">
                                {[
                                    { ep: 'EP 01', title: 'The River Speaks' },
                                    { ep: 'EP 02', title: 'Roots of Resistance' },
                                    { ep: 'EP 03', title: 'Beyond the Canopy' },
                                ].map((item) => (
                                    <div key={item.ep} className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-white/[0.04] border border-white/[0.06] group/ep hover:bg-white/[0.08] transition-colors duration-300">
                                        <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover/ep:border-emerald-400/50 transition-colors duration-300">
                                            <svg className="w-2.5 h-2.5 fill-white/60 translate-x-[1px]" viewBox="0 0 10 12">
                                                <path d="M0 0l10 6-10 6z" />
                                            </svg>
                                        </div>
                                        <span className="text-[0.55rem] font-mono text-white/30 tracking-widest">{item.ep}</span>
                                        <span className="text-sm text-white/70 font-light tracking-tight">{item.title}</span>
                                        <div className="ml-auto flex gap-0.5 items-end h-4">
                                            {[5, 9, 7, 12, 6, 10, 8, 4].map((h, i) => (
                                                <div key={i} className="w-0.5 bg-emerald-400/30 rounded-full" style={{ height: `${h}px` }} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="engage-inner">
                                <p className="text-white/45 text-sm leading-relaxed tracking-tight mb-6 max-w-[90%]">
                                    Dive into the minds of indigenous leaders, scientists, and visionaries shaping the Amazon's future. Raw conversations. Real change.
                                </p>
                                <MagneticBtn className="group/btn flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full border border-emerald-500/40 flex items-center justify-center group-hover/btn:bg-emerald-500/20 group-hover/btn:border-emerald-400/60 transition-all duration-300">
                                        <svg className="w-3 h-3 fill-emerald-400 translate-x-[1px]" viewBox="0 0 10 12">
                                            <path d="M0 0l10 6-10 6z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs uppercase tracking-[0.3em] text-white/50 group-hover/btn:text-white/80 transition-colors duration-300 font-mono">Notify me</span>
                                </MagneticBtn>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CROWDFUNDING TILE ── */}
                <div
                    ref={fundRef}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group md:mt-16"
                    style={{ minHeight: '520px', background: 'linear-gradient(145deg, #2b2414 0%, #1a150c 60%, #100d07 100%)' }}
                    onMouseMove={(e) => tilt(e, fundRef.current)}
                    onMouseLeave={() => resetTilt(fundRef.current)}
                >
                    <RootNetwork />

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-600/15 group-hover:ring-amber-500/35 transition-all duration-700 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full p-7 sm:p-9" style={{ minHeight: '520px' }}>
                        <div>
                            <div className="engage-inner flex items-center gap-2 mb-8">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-[0.55rem] uppercase tracking-[0.45em] text-amber-400/70 font-mono">Seed the Future</span>
                            </div>

                            <div className="engage-inner">
                                <p className="text-white/25 text-xs uppercase tracking-[0.4em] font-mono mb-1">The</p>
                                <h2 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-white mb-8">
                                    Crowd&shy;funding
                                </h2>
                            </div>

                            <div className="engage-inner mb-10">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30 font-mono">Raised so far</span>
                                    <span className="text-[0.55rem] uppercase tracking-[0.3em] text-amber-400/60 font-mono">Goal: $2.4M</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                                        style={{ boxShadow: '0 0 12px rgba(212,175,55,0.4)' }} />
                                </div>
                                <div className="mt-2 flex justify-between">
                                    <span className="font-cursive italic text-2xl text-amber-400/90">$1.61M</span>
                                    <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30 font-mono self-end mb-1">67% funded</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="engage-inner grid grid-cols-3 gap-2 mb-8">
                                {[
                                    { label: 'Seedling', amount: '$25', perks: '1 tree planted', icon: '🌱' },
                                    { label: 'Guardian', amount: '$100', perks: 'Quarterly reports', icon: '🛡' },
                                    { label: 'Patron', amount: '$500', perks: 'Site visit invite', icon: '🌿' },
                                ].map((tier) => (
                                    <div key={tier.label} className="py-3 px-2 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-amber-500/[0.07] hover:border-amber-500/20 transition-all duration-300 text-center">
                                        <div className="text-xl mb-1.5">{tier.icon}</div>
                                        <div className="text-[0.55rem] uppercase tracking-[0.2em] text-white/35 font-mono mb-1">{tier.label}</div>
                                        <div className="font-cursive italic text-amber-300/90 text-xl mb-1">{tier.amount}</div>
                                        <div className="text-[0.5rem] text-white/25 leading-tight">{tier.perks}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="engage-inner">
                                <p className="text-white/45 text-sm leading-relaxed tracking-tight mb-6 max-w-[90%]">
                                    Every contribution directly funds reforestation, clean water access, and indigenous land protection. The Amazon depends on collective action.
                                </p>
                                <MagneticBtn className="group/btn flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full border border-amber-500/40 flex items-center justify-center group-hover/btn:bg-amber-500/20 group-hover/btn:border-amber-400/60 transition-all duration-300">
                                        <svg className="w-3.5 h-3.5 stroke-amber-400 fill-none" strokeWidth="2" viewBox="0 0 16 16">
                                            <path d="M8 2v12M2 8l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-xs uppercase tracking-[0.3em] text-white/50 group-hover/btn:text-white/80 transition-colors duration-300 font-mono">Fund the Mission</span>
                                    <svg className="w-3 h-3 stroke-white/20 fill-none group-hover/btn:stroke-white/50 group-hover/btn:translate-x-1 transition-all duration-300" strokeWidth="1.5" viewBox="0 0 16 16">
                                        <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </MagneticBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom divider */}
            <div className="max-w-7xl mx-auto mt-16 flex items-center gap-5 opacity-20">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-[0.5rem] uppercase tracking-[0.5em] text-white/40 font-mono shrink-0">Manaus Initiative · 2026</span>
                <div className="flex-1 h-px bg-white/20" />
            </div>
        </section>
    );
};

export default EngageTiles;
