import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
    slideCount: 8,
    spacingX: 45,
    pWidth: 14,
    pHeight: 18,
    camZ: 30,
    wallAngleY: -0.25,
    lerpSpeed: 0.06
};

const totalGalleryWidth = CONFIG.slideCount * CONFIG.spacingX;

const images = [
    '/projects/amazon.png',
    '/projects/water.png',
    '/projects/education.png',
    '/projects/biodiversity.png',
    '/projects/amazon.png',
    '/projects/water.png',
    '/projects/education.png',
    '/projects/biodiversity.png'
];

const projectsData = [
    {
        num: "01",
        title: "Amazon Reforestation",
        desc: "Restoring 50,000 hectares of critical rainforest canopy. A massive undertaking to heal the planet through community-led action.",
        year: "2024",
        category: "ENVIRONMENT"
    },
    {
        num: "02",
        title: "Clean Water Initiative",
        desc: "Sustainable filtration systems for remote river communities. Ensuring access to clean water without compromising ecosystem health.",
        year: "2023",
        category: "COMMUNITY"
    },
    {
        num: "03",
        title: "Indigenous Education",
        desc: "Empowering the next generation with digital literacy while preserving native languages and ancestral knowledge.",
        year: "2024",
        category: "EDUCATION"
    },
    {
        num: "04",
        title: "Biodiversity Monitoring",
        desc: "Deploying high-tech sensor networks to track endangered species and deter illegal logging in real-time.",
        year: "2025",
        category: "CONSERVATION"
    },
    {
        num: "05",
        title: "Sustainable Agroforestry",
        desc: "Cultivating shade-grown native cacao and açaí to provide economic independence without deforestation.",
        year: "2022",
        category: "AGRICULTURE"
    },
    {
        num: "06",
        title: "River Conservation",
        desc: "Protecting vital freshwater ecosystems and the endangered pink river dolphins through localized patrolling and policy advocacy.",
        year: "2024",
        category: "WILDLIFE"
    },
    {
        num: "07",
        title: "Solar Modernization",
        desc: "Installing resilient off-grid solar panels to bring sustainable light and communication to the deepest river settlements.",
        year: "2023",
        category: "INFRASTRUCTURE"
    },
    {
        num: "08",
        title: "Cultural Eco-Tourism",
        desc: "Developing community-owned sanctuary lodges to share the beauty of the Amazon with the world on indigenous terms.",
        year: "2025",
        category: "TOURISM"
    }
];

// Detect mobile once
const isMobile = () => window.innerWidth < 768;

const ThreeGallery = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobile, setMobile] = useState(isMobile());

    // Track mobile state for layout changes
    useEffect(() => {
        const onResize = () => setMobile(isMobile());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useLayoutEffect(() => {
        let currentScroll = 0;
        let targetScroll = 0;
        let mouse = { x: 0, y: 0 };
        let sectionActive = false;
        let reqId;

        // Touch swipe state
        let touchStartX = 0;
        let touchStartTime = 0;

        const bgColor = new THREE.Color('#050505');

        const scene = new THREE.Scene();
        // scene.background = bgColor;
        scene.fog = new THREE.Fog(bgColor, 10, 110);

        // Use wider FOV on mobile so gallery is more visible
        const getFov = () => (window.innerWidth < 768 ? 65 : 45);

        const camera = new THREE.PerspectiveCamera(getFov(), window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, CONFIG.camZ);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            camera.fov = getFov();
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        resize();

        if (canvasRef.current.children.length === 0) {
            canvasRef.current.appendChild(renderer.domElement);
        }

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        const galleryGroup = new THREE.Group();
        scene.add(galleryGroup);

        const textureLoader = new THREE.TextureLoader();
        const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);

        const paintingGroups = [];

        for (let i = 0; i < CONFIG.slideCount; i++) {
            const group = new THREE.Group();
            group.position.set(i * CONFIG.spacingX, 0, 0);

            const mat = new THREE.MeshBasicMaterial({ color: 0x111111 });
            textureLoader.load(images[i], (tex) => {
                mat.map = tex;
                mat.color.setHex(0xffffff);
                mat.needsUpdate = true;
            });

            const mesh = new THREE.Mesh(planeGeo, mat);

            const edges = new THREE.EdgesGeometry(planeGeo);
            const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x333333 }));

            const shadowGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
            const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 });
            const shadow = new THREE.Mesh(shadowGeo, shadowMat);
            shadow.position.set(0.8, -0.8, -0.5);

            const lineZ = -1;
            const lineLen = CONFIG.spacingX;
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-lineLen / 2, 14, lineZ), new THREE.Vector3(lineLen / 2, 14, lineZ),
                new THREE.Vector3(-lineLen / 2, -14, lineZ), new THREE.Vector3(lineLen / 2, -14, lineZ)
            ]);
            const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x222222 }));

            group.add(shadow);
            group.add(mesh);
            group.add(outline);
            group.add(lines);

            galleryGroup.add(group);
            paintingGroups.push(group);
        }

        galleryGroup.rotation.y = CONFIG.wallAngleY;
        // On mobile, center the gallery a bit more (less offset)
        galleryGroup.position.x = window.innerWidth < 768 ? 2 : 8;

        // Map main scroll to gallery scroll
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * 8}`,
            pin: true,
            scrub: true,
            refreshPriority: 1,
            onEnter: () => {
                sectionActive = true;
                renderer.render(scene, camera);
            },
            onLeave: () => { sectionActive = false; mouse.x = 0; mouse.y = 0; },
            onEnterBack: () => {
                sectionActive = true;
                renderer.render(scene, camera);
            },
            onLeaveBack: () => { sectionActive = false; mouse.x = 0; mouse.y = 0; },
            onUpdate: (self) => {
                const maxScroll = (CONFIG.slideCount - 1) * CONFIG.spacingX;
                targetScroll = self.progress * maxScroll;
            }
        });

        // Mouse parallax (desktop only)
        const onMouseMove = (e) => {
            if (window.innerWidth < 768) return;
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        // Touch swipe: forward/back one slide
        const onTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
        };

        const onTouchEnd = (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dt = Date.now() - touchStartTime;
            // Quick swipe (< 400ms) or drag > 40px
            if (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && dt < 400)) {
                const dir = dx < 0 ? 1 : -1;
                const next = Math.max(0, Math.min(CONFIG.slideCount - 1, activeIndex + dir));
                // Scroll the page to the right position for this slide
                const stEl = containerRef.current;
                if (stEl) {
                    const stStart = stEl.getBoundingClientRect().top + window.scrollY;
                    const scrollPerSlide = (window.innerHeight * 8) / (CONFIG.slideCount - 1);
                    window.scrollTo({ top: stStart + next * scrollPerSlide, behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', resize);

        const canvasEl = canvasRef.current;
        canvasEl.addEventListener('touchstart', onTouchStart, { passive: true });
        canvasEl.addEventListener('touchend', onTouchEnd, { passive: true });

        const animate = () => {
            reqId = requestAnimationFrame(animate);

            if (!sectionActive) return;

            currentScroll += (targetScroll - currentScroll) * CONFIG.lerpSpeed;

            const xMove = currentScroll * Math.cos(CONFIG.wallAngleY);
            const zMove = currentScroll * Math.sin(CONFIG.wallAngleY);
            camera.position.x = xMove;
            camera.position.z = CONFIG.camZ - zMove;

            // Mouse parallax on desktop only
            if (window.innerWidth >= 768) {
                camera.rotation.x += (mouse.y * 0.05 - camera.rotation.x) * 0.1;
                camera.rotation.y += (-mouse.x * 0.05 - camera.rotation.y) * 0.1;
            } else {
                camera.rotation.x += (0 - camera.rotation.x) * 0.1;
                camera.rotation.y += (0 - camera.rotation.y) * 0.1;
            }

            const rawIndex = Math.round(currentScroll / CONFIG.spacingX);
            const clampIndex = Math.max(0, Math.min(rawIndex, CONFIG.slideCount - 1));
            setActiveIndex(clampIndex);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', resize);
            if (canvasEl) {
                canvasEl.removeEventListener('touchstart', onTouchStart);
                canvasEl.removeEventListener('touchend', onTouchEnd);
            }
            st.kill();
            renderer.dispose();
            if (canvasRef.current && renderer.domElement && canvasRef.current.contains(renderer.domElement)) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    const project = projectsData[activeIndex];

    return (
        <section ref={containerRef} className="relative w-full h-screen animated-gradient-bg overflow-hidden z-30">
            {/* Ambient Glows for Depth */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[500px] bg-emerald-900/20 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[600px] bg-amber-900/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Three.js Canvas — behind everything, touch events captured here */}
            <div ref={canvasRef} className="absolute inset-0 z-10 w-full h-full" style={{ touchAction: 'pan-y' }} />

            {/* Top label */}
            <div className="absolute top-6 sm:top-12 md:top-24 left-4 sm:left-8 md:left-24 z-20 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.4em] font-black text-white/50 pointer-events-none">
                IMPACT ARCHIVE
            </div>

            {/* Slide counter — top right */}
            <div className="absolute top-6 sm:top-12 md:top-24 right-4 sm:right-8 md:right-24 z-20 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.4em] font-black text-white/30 pointer-events-none tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(CONFIG.slideCount).padStart(2, '0')}
            </div>

            {/* ── DESKTOP layout: info panel left-center ── */}
            <div className="hidden md:flex absolute inset-0 z-20 pointer-events-none flex-col justify-center px-10 md:px-24">
                <div className="relative w-full max-w-[420px]">
                    {projectsData.map((p, i) => (
                        <div
                            key={i}
                            className={`absolute top-1/2 left-0 w-full transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-y-1/2 ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className={`w-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeIndex === i ? 'translate-y-0' : 'translate-y-6'}`}>
                                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/50 mb-5 inline-block border-b border-white/20 pb-2">
                                    {p.num} / {p.category}
                                </span>

                                <h1 className="font-cursive text-5xl lg:text-6xl xl:text-7xl mb-5 leading-none text-white font-light italic">
                                    {p.title.split(' ').map((word, idx) => (
                                        <React.Fragment key={idx}>{word}<br /></React.Fragment>
                                    ))}
                                </h1>

                                <p className="text-sm lg:text-base font-medium leading-relaxed text-white/60 mb-8 tracking-tight max-w-[90%]">
                                    {p.desc}
                                </p>

                                <div className="grid grid-cols-[80px_1fr] gap-y-3 border-t border-white/10 pt-5">
                                    <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 self-center">Initiative</span>
                                    <span className="font-cursive italic text-lg text-white/90">The Manaus Project</span>

                                    <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 self-center">Est. Year</span>
                                    <span className="font-cursive italic text-lg text-white/90">{p.year}</span>

                                    <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 self-center">Impact</span>
                                    <span className="font-cursive italic text-lg text-white/90">Global Scale</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MOBILE layout: info panel pinned to bottom ── */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 pointer-events-none px-5 pb-6 pt-8"
                style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.97) 60%, transparent)' }}>

                {/* Swipe hint */}
                <p className="text-[0.5rem] uppercase tracking-[0.35em] text-white/25 mb-3 text-center">
                    ← swipe to navigate →
                </p>

                {/* Slide dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                    {projectsData.map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-500 ${activeIndex === i
                                ? 'w-4 h-1.5 bg-white/80'
                                : 'w-1.5 h-1.5 bg-white/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Active project info */}
                <div className="relative overflow-hidden">
                    {projectsData.map((p, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeIndex === i
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4 absolute inset-0'
                                }`}
                        >
                            <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/40 mb-2 inline-block">
                                {p.num} / {p.category}
                            </span>

                            <h2 className="font-cursive text-3xl sm:text-4xl mb-2 leading-tight text-white font-light italic">
                                {p.title}
                            </h2>

                            <p className="text-[0.72rem] sm:text-sm font-medium leading-snug text-white/55 tracking-tight line-clamp-3">
                                {p.desc}
                            </p>

                            <div className="flex gap-5 mt-3 border-t border-white/10 pt-3">
                                <div>
                                    <span className="text-[0.45rem] uppercase tracking-[0.2em] text-white/30 block">Year</span>
                                    <span className="font-cursive italic text-base text-white/80">{p.year}</span>
                                </div>
                                <div>
                                    <span className="text-[0.45rem] uppercase tracking-[0.2em] text-white/30 block">Impact</span>
                                    <span className="font-cursive italic text-base text-white/80">Global Scale</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThreeGallery;
