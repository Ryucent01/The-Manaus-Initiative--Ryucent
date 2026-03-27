import React from 'react';

const TheProjectSidebar = ({ onClick }) => {
    return (
        <div 
            className="sticky top-0 h-screen w-[45px] md:w-[55px] bg-[#fbc02d] z-40 cursor-pointer flex flex-col items-center justify-center group transition-all duration-500 hover:w-[70px] pointer-events-auto"
            onClick={onClick}
        >
            <div className="flex flex-col items-center gap-6 py-20 h-full justify-between">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-[1px] h-20 bg-black/20" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-black/40 rotate-180 [writing-mode:vertical-rl]">
                        Initiative
                    </span>
                </div>

                <div className="relative">
                    <h3 className="text-black text-xs md:text-sm font-black uppercase tracking-[0.4em] [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap">
                        DISCOVER THE PROJECT
                    </h3>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-8 h-8 rounded-full border border-black/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                         <div className="w-1.5 h-1.5 bg-black rounded-full" />
                         <div className="absolute inset-0 border border-black/10 rounded-full animate-ping opacity-20" />
                    </div>
                    <div className="w-[1px] h-20 bg-black/20" />
                </div>
            </div>
            
            {/* Hover Indicator */}
            <div className="absolute left-0 top-0 w-[2px] h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default TheProjectSidebar;
