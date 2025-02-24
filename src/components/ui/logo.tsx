import React from 'react';
import { Zap } from 'lucide-react';

const LOGO_URL = "https://i.postimg.cc/28D4j6hk/Submark-Alternative-Colour.png";

export const Logo: React.FC = () => (
  <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    {LOGO_URL ? (
      <img src={LOGO_URL} className="h-7 w-7 flex-shrink-0 rounded-full object-cover" alt="Logo" />
    ) : (
      <Zap className="h-5 w-6 text-black dark:text-white flex-shrink-0" />
    )}
    <span className="font-medium text-black dark:text-white whitespace-pre">BaitoAI Labs</span>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-700" />
    <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs text-neutral-500 dark:text-neutral-400">
      v0.0.1
    </div>
  </a>
);

export const LogoIcon: React.FC = () => (
  <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    {LOGO_URL ? (
      <img src={LOGO_URL} className="h-7 w-7 flex-shrink-0 rounded-full object-cover" alt="Logo" />
    ) : (
      <Zap className="h-5 w-6 text-black dark:text-white flex-shrink-0" />
    )}
  </a>
);
