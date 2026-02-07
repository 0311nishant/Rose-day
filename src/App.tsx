import { useState, useEffect, useRef } from "react";

// Stage messages based on progress
const STAGE_MESSAGES = [
  { text: "A seed of love...", sub: "waiting to grow" },
  { text: "Something beautiful begins...", sub: "tender and new" },
  { text: "Patience brings promise...", sub: "ready to bloom" },
  { text: "Love unfolds...", sub: "petal by petal" },
  { text: "In full bloom...", sub: "just for you" },
];

// Messages for each petal
const PETAL_MESSAGES = [
  "You are my sunshine ☀️",
  "Every moment with you is puchhiable ✨",
  "Your smileyyy make me feel hotttttt 💫",
  "Together forever, always 💕",
  "You make my day, night, afternoon, evening everything specialllll 🌟",
  "You own me I own you we own eachother 💝",
  "Thank you for being beingggg  🦋",
  "I Love you to the in every reality🌙",
  "I love your smelllllll  🎈",
  "Forever grateful to meet my soulmate 💖",
];

// Butterfly component that roams randomly
function Butterfly({ color, id }: { color: string; id: number }) {
  const [position, setPosition] = useState(() => ({
    x: 20 + Math.random() * 60,
    y: 10 + Math.random() * 35,
  }));
  const [targetPosition, setTargetPosition] = useState(() => ({
    x: 20 + Math.random() * 60,
    y: 10 + Math.random() * 35,
  }));
  const [facingRight, setFacingRight] = useState(true);
  const [wobbleOffset, setWobbleOffset] = useState(0);
  
  // Pick new random target every few seconds
  useEffect(() => {
    const pickNewTarget = () => {
      setTargetPosition(prev => {
        const newX = 10 + Math.random() * 80;
        const newY = 5 + Math.random() * 40;
        setFacingRight(newX > prev.x);
        return { x: newX, y: newY };
      });
    };
    
    // Initial delay based on id
    const initialTimeout = setTimeout(pickNewTarget, id * 500);
    const interval = setInterval(pickNewTarget, 2000 + Math.random() * 2000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [id]);
  
  // Smooth movement towards target + wobble
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      setWobbleOffset(prev => prev + deltaTime * 5);
      
      setPosition(prev => {
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        const speed = 1.5; // Movement speed
        
        return {
          x: prev.x + dx * speed * deltaTime,
          y: prev.y + dy * speed * deltaTime,
        };
      });
      
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetPosition]);
  
  // Calculate wobble for natural flight
  const wobbleY = Math.sin(wobbleOffset * 2) * 3;
  const wobbleRotation = Math.sin(wobbleOffset * 1.5) * 12;

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${position.x}%`,
        top: `${position.y + wobbleY}%`,
        transform: `scaleX(${facingRight ? 1 : -1}) rotate(${wobbleRotation}deg)`,
      }}
    >
      <svg width="40" height="32" viewBox="0 0 40 32">
        {/* Left wing - top */}
        <ellipse cx="10" cy="12" rx="9" ry="10" fill={color} opacity="0.9">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-45 10 16;45 10 16;-45 10 16"
            dur="0.15s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Left wing - bottom */}
        <ellipse cx="10" cy="22" rx="6" ry="6" fill={color} opacity="0.75">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-35 10 16;35 10 16;-35 10 16"
            dur="0.15s"
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Right wing - top */}
        <ellipse cx="30" cy="12" rx="9" ry="10" fill={color} opacity="0.9">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="45 30 16;-45 30 16;45 30 16"
            dur="0.15s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Right wing - bottom */}
        <ellipse cx="30" cy="22" rx="6" ry="6" fill={color} opacity="0.75">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="35 30 16;-35 30 16;35 30 16"
            dur="0.15s"
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Wing spots */}
        <circle cx="10" cy="10" r="3" fill="white" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" values="-45 10 16;45 10 16;-45 10 16" dur="0.15s" repeatCount="indefinite"/>
        </circle>
        <circle cx="30" cy="10" r="3" fill="white" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" values="45 30 16;-45 30 16;45 30 16" dur="0.15s" repeatCount="indefinite"/>
        </circle>
        
        {/* Body */}
        <ellipse cx="20" cy="16" rx="3" ry="12" fill="#2d1f14" />
        <circle cx="20" cy="4" r="3.5" fill="#2d1f14" />
        
        {/* Antennae */}
        <path d="M18 2 Q15 -2 12 0" stroke="#2d1f14" strokeWidth="1.2" fill="none" />
        <path d="M22 2 Q25 -2 28 0" stroke="#2d1f14" strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="0" r="1.5" fill="#2d1f14" />
        <circle cx="28" cy="0" r="1.5" fill="#2d1f14" />
      </svg>
    </div>
  );
}

// Main Rose SVG with visible stem, roots, and growth animation
function Rose({ progress, onPetalClick }: { progress: number; onPetalClick: (petalIndex: number) => void }) {
  // Growth calculations
  const rootsGrowth = Math.min(progress / 15, 1); // Roots grow from 0-15%
  const stemGrowth = Math.max(0, Math.min((progress - 5) / 30, 1)); // Stem grows from 5-35%
  const stemHeight = stemGrowth * 200; // Max stem height
  const leafGrowth = Math.max(0, Math.min((progress - 20) / 20, 1)); // Leaves grow from 20-40%
  
  // Calculate rose stage
  const getRoseStage = () => {
    if (progress < 15) return "seed";
    if (progress < 35) return "sprout";
    if (progress < 50) return "bud";
    if (progress < 70) return "opening";
    if (progress < 90) return "fullBloom";
    return "wilting";
  };

  const stage = getRoseStage();

  // SVG viewBox to show full plant including roots
  return (
    <svg viewBox="0 0 240 450" className="w-56 h-80 md:w-72 md:h-[420px]">
      <defs>
        <radialGradient id="roseCenter" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#ff6b8a" />
          <stop offset="100%" stopColor="#c41e4a" />
        </radialGradient>
        <radialGradient id="rosePetal1" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#ff7b9a" />
          <stop offset="100%" stopColor="#d43a5a" />
        </radialGradient>
        <radialGradient id="rosePetal2" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#ff8baa" />
          <stop offset="100%" stopColor="#e44a6a" />
        </radialGradient>
        <radialGradient id="rosePetal3" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#ff9bba" />
          <stop offset="100%" stopColor="#ee5a7a" />
        </radialGradient>
        <radialGradient id="wiltPetal" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#c87090" />
          <stop offset="100%" stopColor="#8a4050" />
        </radialGradient>
        <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a4a1a" />
          <stop offset="50%" stopColor="#2d6a2d" />
          <stop offset="100%" stopColor="#1a4a1a" />
        </linearGradient>
        <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#3a2515" />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a9a4a" />
          <stop offset="100%" stopColor="#2a6a2a" />
        </linearGradient>
        <linearGradient id="dirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#3a2515" />
        </linearGradient>
        <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5a3c" />
          <stop offset="50%" stopColor="#c17854" />
          <stop offset="100%" stopColor="#7a4a2e" />
        </linearGradient>
        <linearGradient id="potRimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9b6a4c" />
          <stop offset="50%" stopColor="#d18864" />
          <stop offset="100%" stopColor="#8a5a3e" />
        </linearGradient>
        <radialGradient id="potTopSoil" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#4a3525" />
          <stop offset="100%" stopColor="#2a1a10" />
        </radialGradient>
      </defs>

      {/* Ground surface - where pot sits */}
      <line x1="30" y1="312" x2="210" y2="312" stroke="#4a3020" strokeWidth="2" opacity="0.4" />

      {/* Flower Pot - always visible */}
      <g>
          {/* Pot shadow */}
          <ellipse cx="120" cy="312" rx="52" ry="8" fill="#000000" opacity="0.25" />
          
          {/* Main pot body - trapezoid shape */}
          <path
            d="M75 310 L70 240 L170 240 L165 310 Z"
            fill="url(#potGradient)"
            stroke="#6a4530"
            strokeWidth="1.5"
          />
          
          {/* Pot left side highlight */}
          <path
            d="M75 310 L70 240 L75 240 L80 310 Z"
            fill="rgba(255,255,255,0.08)"
          />
          
          {/* Pot right side shadow */}
          <path
            d="M165 310 L170 240 L165 240 L160 310 Z"
            fill="rgba(0,0,0,0.25)"
          />
          
          {/* Decorative bands */}
          <path
            d="M72.5 270 L167.5 270"
            stroke="#9b6a4c"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M71.5 285 L168.5 285"
            stroke="#9b6a4c"
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Pot rim - ellipse at top */}
          <ellipse cx="120" cy="240" rx="50" ry="10" fill="url(#potRimGradient)" />
          <ellipse cx="120" cy="238" rx="50" ry="10" fill="url(#potRimGradient)" opacity="0.5" />
          
          {/* Rim top edge highlight */}
          <ellipse cx="120" cy="236" rx="48" ry="9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          
          {/* Soil in pot */}
          <ellipse cx="120" cy="242" rx="47" ry="9" fill="url(#potTopSoil)" />
          
          {/* Soil texture details */}
          {[...Array(15)].map((_, i) => (
            <circle
              key={i}
              cx={90 + (i * 4)}
              cy={240 + Math.sin(i * 0.8) * 3}
              r="1.5"
              fill="#3a2515"
              opacity="0.4"
            />
          ))}
          
          {/* Pot drainage hole indicator */}
          <ellipse cx="120" cy="308" rx="4" ry="2" fill="#2a1510" opacity="0.6" />
      </g>

      {/* Roots - grow within pot */}
      <g style={{ opacity: rootsGrowth * 0.6 }}>
          {/* Main root - shorter, contained in pot */}
          <path
            d={`M120 245 Q120 ${245 + 30 * rootsGrowth} 120 ${245 + 50 * rootsGrowth}`}
            stroke="url(#rootGradient)"
            strokeWidth={3 * rootsGrowth + 1.5}
            fill="none"
            strokeLinecap="round"
          />
          {/* Left roots - contained in pot */}
          <path
            d={`M120 ${245 + 15 * rootsGrowth} Q${105 - 8 * rootsGrowth} ${255 + 20 * rootsGrowth} ${95 - 10 * rootsGrowth} ${270 + 25 * rootsGrowth}`}
            stroke="url(#rootGradient)"
            strokeWidth={2 * rootsGrowth + 1}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M120 ${245 + 25 * rootsGrowth} Q${100 - 5 * rootsGrowth} ${260 + 20 * rootsGrowth} ${85 - 8 * rootsGrowth} ${280 + 22 * rootsGrowth}`}
            stroke="url(#rootGradient)"
            strokeWidth={1.5 * rootsGrowth + 0.5}
            fill="none"
            strokeLinecap="round"
          />
          {/* Right roots - contained in pot */}
          <path
            d={`M120 ${245 + 18 * rootsGrowth} Q${135 + 8 * rootsGrowth} ${258 + 20 * rootsGrowth} ${145 + 10 * rootsGrowth} ${275 + 23 * rootsGrowth}`}
            stroke="url(#rootGradient)"
            strokeWidth={2 * rootsGrowth + 1}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M120 ${245 + 28 * rootsGrowth} Q${140 + 5 * rootsGrowth} ${263 + 18 * rootsGrowth} ${155 + 8 * rootsGrowth} ${285 + 20 * rootsGrowth}`}
            stroke="url(#rootGradient)"
            strokeWidth={1.5 * rootsGrowth + 0.5}
            fill="none"
            strokeLinecap="round"
          />
      </g>

      {/* Seed - visible at the start, in the pot */}
      {progress < 25 && (
        <g style={{ opacity: progress < 15 ? 1 : Math.max(0, 1 - (progress - 15) / 10) }}>
          <ellipse 
            cx="120" 
            cy={245 - Math.min(progress, 15) * 0.3} 
            rx={8 + Math.min(progress, 10) * 0.3} 
            ry={10 + Math.min(progress, 10) * 0.4} 
            fill="#6a4a30" 
          />
          <ellipse cx="120" cy={243 - Math.min(progress, 15) * 0.3} rx="4" ry="5" fill="#8a6a50" opacity="0.5" />
        </g>
      )}

      {/* Stem - grows upward from pot */}
      {progress > 5 && (
        <g style={{ opacity: Math.min((progress - 5) / 10, 1) }}>
          {/* Main stem */}
          <path
            d={`M120 245 L120 ${245 - stemHeight}`}
            stroke="url(#stemGradient)"
            strokeWidth={5 + stemGrowth * 3}
            fill="none"
            strokeLinecap="round"
          />
          {/* Stem highlight */}
          <path
            d={`M122 245 L122 ${245 - stemHeight}`}
            stroke="#4a8a4a"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
          
          {/* Thorns - appear as stem grows */}
          {stemGrowth > 0.3 && (
            <>
              <path 
                d={`M120 ${245 - stemHeight * 0.25} L${108} ${245 - stemHeight * 0.25 - 8} L${112} ${245 - stemHeight * 0.25 - 2}`} 
                fill="#2a5a2a" 
                opacity={Math.min((stemGrowth - 0.3) * 3, 1)}
              />
              <path 
                d={`M120 ${245 - stemHeight * 0.45} L${132} ${245 - stemHeight * 0.45 - 8} L${128} ${245 - stemHeight * 0.45 - 2}`} 
                fill="#2a5a2a" 
                opacity={Math.min((stemGrowth - 0.3) * 3, 1)}
              />
              {stemGrowth > 0.6 && (
                <path 
                  d={`M120 ${245 - stemHeight * 0.65} L${108} ${245 - stemHeight * 0.65 - 8} L${112} ${245 - stemHeight * 0.65 - 2}`} 
                  fill="#2a5a2a" 
                  opacity={Math.min((stemGrowth - 0.6) * 3, 1)}
                />
              )}
            </>
          )}
        </g>
      )}

      {/* Leaves - grow from stem */}
      {progress > 20 && (
        <g style={{ opacity: leafGrowth }}>
          {/* Left leaf */}
          <g transform={`translate(${120 - 35 * leafGrowth}, ${245 - stemHeight * 0.35}) rotate(-35)`}>
            <ellipse cx="0" cy="0" rx={30 * leafGrowth} ry={14 * leafGrowth} fill="url(#leafGradient)" />
            <path 
              d={`M0 0 L${-25 * leafGrowth} 0`} 
              stroke="#2a5a2a" 
              strokeWidth="1.5" 
              opacity="0.6"
            />
            {/* Leaf veins */}
            {leafGrowth > 0.5 && (
              <>
                <path d={`M${-8 * leafGrowth} 0 L${-15 * leafGrowth} ${-5 * leafGrowth}`} stroke="#2a5a2a" strokeWidth="0.8" opacity="0.4" />
                <path d={`M${-8 * leafGrowth} 0 L${-15 * leafGrowth} ${5 * leafGrowth}`} stroke="#2a5a2a" strokeWidth="0.8" opacity="0.4" />
              </>
            )}
          </g>
          
          {/* Right leaf */}
          <g transform={`translate(${120 + 35 * leafGrowth}, ${245 - stemHeight * 0.55}) rotate(35)`}>
            <ellipse cx="0" cy="0" rx={28 * leafGrowth} ry={12 * leafGrowth} fill="url(#leafGradient)" />
            <path 
              d={`M0 0 L${25 * leafGrowth} 0`} 
              stroke="#2a5a2a" 
              strokeWidth="1.5" 
              opacity="0.6"
            />
            {leafGrowth > 0.5 && (
              <>
                <path d={`M${8 * leafGrowth} 0 L${15 * leafGrowth} ${-5 * leafGrowth}`} stroke="#2a5a2a" strokeWidth="0.8" opacity="0.4" />
                <path d={`M${8 * leafGrowth} 0 L${15 * leafGrowth} ${5 * leafGrowth}`} stroke="#2a5a2a" strokeWidth="0.8" opacity="0.4" />
              </>
            )}
          </g>

          {/* Third smaller leaf */}
          {leafGrowth > 0.7 && (
            <g transform={`translate(${120 - 28 * leafGrowth}, ${245 - stemHeight * 0.72}) rotate(-40)`}>
              <ellipse cx="0" cy="0" rx={20 * (leafGrowth - 0.3)} ry={9 * (leafGrowth - 0.3)} fill="url(#leafGradient)" />
            </g>
          )}
        </g>
      )}

      {/* Rose head position - at top of stem */}
      {progress > 30 && (
        <g transform={`translate(120, ${Math.max(45, 245 - stemHeight - 10)})`}>
          {/* Sepals */}
          {progress > 35 && (
            <g style={{ opacity: Math.min((progress - 35) / 10, 1) }}>
              <ellipse cx="-15" cy="18" rx="8" ry="18" fill="#2a5a2a" transform="rotate(-30)" />
              <ellipse cx="15" cy="18" rx="8" ry="18" fill="#2a5a2a" transform="rotate(30)" />
              <ellipse cx="0" cy="22" rx="6" ry="15" fill="#1a4a1a" />
            </g>
          )}

          {/* Bud stage */}
          {stage === "bud" && (
            <g style={{ opacity: Math.min((progress - 35) / 10, 1) }}>
              <ellipse 
                cx="0" 
                cy="0" 
                rx={12 + (progress - 35) * 0.3} 
                ry={22 + (progress - 35) * 0.5} 
                fill="url(#roseCenter)" 
              />
              {/* Bud tip */}
              <ellipse cx="0" cy={-15 - (progress - 35) * 0.3} rx="6" ry="10" fill="#d43a5a" />
            </g>
          )}

          {/* Opening stage */}
          {stage === "opening" && (
            <g>
              {/* Outer petals starting to open */}
              <ellipse 
                cx="-18" 
                cy="0" 
                rx="16" 
                ry="28" 
                fill="url(#rosePetal2)" 
                transform={`rotate(${-15 - (progress - 50) * 0.8})`} 
              />
              <ellipse 
                cx="18" 
                cy="0" 
                rx="16" 
                ry="28" 
                fill="url(#rosePetal2)" 
                transform={`rotate(${15 + (progress - 50) * 0.8})`} 
              />
              {/* Inner petals */}
              <ellipse cx="-8" cy="-5" rx="12" ry="22" fill="url(#rosePetal1)" transform="rotate(-8)" />
              <ellipse cx="8" cy="-5" rx="12" ry="22" fill="url(#rosePetal1)" transform="rotate(8)" />
              {/* Center */}
              <ellipse cx="0" cy="-8" rx="10" ry="16" fill="url(#roseCenter)" />
            </g>
          )}

          {/* Full bloom */}
          {stage === "fullBloom" && (
            <g>
              {/* Outermost petals */}
              <ellipse 
                cx="-32" cy="8" rx="22" ry="34" 
                fill="url(#rosePetal3)" 
                transform="rotate(-45)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(0);
                }}
              />
              <ellipse 
                cx="32" cy="8" rx="22" ry="34" 
                fill="url(#rosePetal3)" 
                transform="rotate(45)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(1);
                }}
              />
              {/* Bottom petal removed - was getting cut off by pot */}
              
              {/* Middle petals */}
              <ellipse 
                cx="-22" cy="-2" rx="18" ry="30" 
                fill="url(#rosePetal2)" 
                transform="rotate(-30)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(2);
                }}
              />
              <ellipse 
                cx="22" cy="-2" rx="18" ry="30" 
                fill="url(#rosePetal2)" 
                transform="rotate(30)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(3);
                }}
              />
              {/* Inner petals */}
              <ellipse 
                cx="-12" cy="-8" rx="14" ry="24" 
                fill="url(#rosePetal1)" 
                transform="rotate(-15)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(4);
                }}
              />
              <ellipse 
                cx="12" cy="-8" rx="14" ry="24" 
                fill="url(#rosePetal1)" 
                transform="rotate(15)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(5);
                }}
              />
              {/* Center bud */}
              <ellipse 
                cx="-4" cy="-12" rx="10" ry="18" 
                fill="url(#rosePetal1)" 
                transform="rotate(-5)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(6);
                }}
              />
              <ellipse 
                cx="4" cy="-12" rx="10" ry="18" 
                fill="url(#rosePetal1)" 
                transform="rotate(5)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(7);
                }}
              />
              <ellipse 
                cx="0" cy="-15" rx="8" ry="14" 
                fill="url(#roseCenter)" 
                style={{ cursor: 'pointer' }}
                className="petal-interactive"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetalClick(8);
                }}
              />
              
              {/* Dew drops */}
              <circle cx="-20" cy="-5" r="3" fill="rgba(255,255,255,0.8)">
                <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="18" cy="5" r="2.5" fill="rgba(255,255,255,0.7)">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Wilting stage */}
          {stage === "wilting" && (
            <g>
              {/* Drooping outer petals */}
              <ellipse 
                cx="-35" 
                cy={15 + (progress - 90) * 2} 
                rx="20" 
                ry="30" 
                fill="url(#wiltPetal)" 
                transform={`rotate(${-55 - (progress - 90) * 3})`}
                opacity={1 - (progress - 90) * 0.05}
              />
              <ellipse 
                cx="35" 
                cy={15 + (progress - 90) * 2} 
                rx="20" 
                ry="30" 
                fill="url(#wiltPetal)" 
                transform={`rotate(${55 + (progress - 90) * 3})`}
                opacity={1 - (progress - 90) * 0.05}
              />
              {/* Middle drooping petals */}
              <ellipse cx="-18" cy="5" rx="16" ry="26" fill="url(#wiltPetal)" transform={`rotate(${-40 - (progress - 90) * 2})`} opacity="0.9" />
              <ellipse cx="18" cy="5" rx="16" ry="26" fill="url(#wiltPetal)" transform={`rotate(${40 + (progress - 90) * 2})`} opacity="0.9" />
              {/* Center - still holding */}
              <ellipse cx="0" cy="0" rx="12" ry="18" fill="url(#wiltPetal)" opacity="0.95" />
              
              {/* Falling petals */}
              {[0, 1, 2].map((i) => (
                <ellipse
                  key={i}
                  cx={-25 + i * 25 + (progress - 90) * (i - 1) * 3}
                  cy={50 + (progress - 90) * 8 + i * 15}
                  rx="10"
                  ry="16"
                  fill="url(#wiltPetal)"
                  transform={`rotate(${45 + i * 50 + (progress - 90) * 15})`}
                  opacity={Math.max(0.2, 0.8 - (progress - 90) * 0.06)}
                />
              ))}
            </g>
          )}
        </g>
      )}

      {/* Sprout stage - small green shoot from pot */}
      {stage === "sprout" && progress < 35 && (
        <g style={{ opacity: Math.min((progress - 15) / 5, 1) }}>
          <path
            d={`M120 245 Q120 ${245 - (progress - 15) * 4} 120 ${245 - (progress - 15) * 6}`}
            stroke="#3a7a3a"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Tiny leaves on sprout */}
          {progress > 25 && (
            <>
              <ellipse 
                cx={120 - 8} 
                cy={245 - (progress - 15) * 5} 
                rx="6" 
                ry="10" 
                fill="#4a9a4a" 
                transform={`rotate(-30 ${120 - 8} ${245 - (progress - 15) * 5})`}
                opacity={(progress - 25) / 10}
              />
              <ellipse 
                cx={120 + 8} 
                cy={245 - (progress - 15) * 4.5} 
                rx="5" 
                ry="8" 
                fill="#4a9a4a" 
                transform={`rotate(30 ${120 + 8} ${245 - (progress - 15) * 4.5})`}
                opacity={(progress - 25) / 10}
              />
            </>
          )}
        </g>
      )}
    </svg>
  );
}

export function App() {
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedPetal, setSelectedPetal] = useState<number | null>(null);
  const lastWheelTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePetalClick = (petalIndex: number) => {
    setSelectedPetal(petalIndex);
  };

  const closePetalMessage = () => {
    setSelectedPetal(null);
  };

  // Handle wheel event
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime.current < 16) return; // Throttle
      lastWheelTime.current = now;

      // Scroll UP (negative deltaY) = age (increase progress)
      // Scroll DOWN (positive deltaY) = de-age (decrease progress)
      const delta = e.deltaY > 0 ? -1.5 : 1.5;
      
      setProgress((prev) => {
        const next = Math.max(0, Math.min(100, prev + delta));
        return next;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  // Handle touch for mobile
  useEffect(() => {
    let lastY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const delta = (lastY - currentY) * 0.3; // Swipe up = positive = age
      lastY = currentY;

      setProgress((prev) => Math.max(0, Math.min(100, prev + delta)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: false });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, []);

  // Show final message
  useEffect(() => {
    if (progress >= 98) {
      setShowFinal(true);
      localStorage.setItem("rose-day-2024", "complete");
    } else {
      setShowFinal(false);
    }
  }, [progress]);

  // Calculate time of day (0 = morning, 0.5 = noon, 1 = evening)
  const timeOfDay = progress / 100;
  
  // Stage for messages
  const stage = Math.min(Math.floor(progress / 20), 4);

  // Sky gradient
  const getSkyGradient = () => {
    if (timeOfDay < 0.3) {
      // Morning - soft pink to blue
      return `linear-gradient(180deg, 
        hsl(${210 - timeOfDay * 50}, ${60 + timeOfDay * 20}%, ${75 - timeOfDay * 10}%) 0%, 
        hsl(${40}, 80%, ${85 - timeOfDay * 20}%) 40%,
        hsl(${110}, 45%, ${55}%) 100%)`;
    } else if (timeOfDay < 0.6) {
      // Midday - bright blue
      return `linear-gradient(180deg, 
        hsl(${200}, 65%, 70%) 0%, 
        hsl(${195}, 55%, 80%) 40%,
        hsl(${115}, 50%, ${50 - (timeOfDay - 0.3) * 10}%) 100%)`;
    } else if (timeOfDay < 0.85) {
      // Sunset - orange/pink
      const t = (timeOfDay - 0.6) / 0.25;
      return `linear-gradient(180deg, 
        hsl(${35 - t * 20}, ${70 + t * 15}%, ${65 - t * 15}%) 0%, 
        hsl(${20}, ${80}%, ${55 - t * 10}%) 40%,
        hsl(${110}, ${40 - t * 15}%, ${40 - t * 10}%) 100%)`;
    } else {
      // Dusk/Night
      const t = (timeOfDay - 0.85) / 0.15;
      return `linear-gradient(180deg, 
        hsl(${270 + t * 20}, ${40 + t * 10}%, ${30 - t * 10}%) 0%, 
        hsl(${300}, 50%, ${40 - t * 15}%) 40%,
        hsl(${140}, ${25 - t * 10}%, ${25 - t * 8}%) 100%)`;
    }
  };

  // Sun position
  const sunY = 15 + Math.sin(timeOfDay * Math.PI) * 30;
  const sunX = 15 + timeOfDay * 70;
  const isNight = timeOfDay > 0.85;

  const handleReset = () => {
    setProgress(0);
    setShowFinal(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden cursor-ns-resize select-none"
      style={{ background: getSkyGradient(), transition: "background 0.5s ease" }}
    >
      {/* Stars */}
      {timeOfDay > 0.75 && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: Math.min((timeOfDay - 0.75) * 4, 1) }}
        >
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                left: `${(i * 17 + 5) % 100}%`,
                top: `${(i * 7 + 3) % 45}%`,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i % 5) * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun / Moon */}
      <div
        className="absolute transition-all duration-500"
        style={{ left: `${sunX}%`, top: `${sunY}%`, transform: "translate(-50%, -50%)" }}
      >
        <div
          className="rounded-full transition-all duration-500"
          style={{
            width: isNight ? 45 : 65,
            height: isNight ? 45 : 65,
            background: isNight
              ? "radial-gradient(circle, #fffde8 0%, #e8e8d0 60%, #c8c8b0 100%)"
              : `radial-gradient(circle, #fff8e0 0%, #ffd700 50%, #ff9500 100%)`,
            boxShadow: isNight
              ? "0 0 25px rgba(255,255,220,0.4)"
              : `0 0 ${50 - timeOfDay * 20}px rgba(255,180,50,0.5)`,
          }}
        />
      </div>

      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.8 - timeOfDay * 0.4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${8 + i * 7}%`,
              animation: `cloudMove ${50 + i * 15}s linear infinite`,
              animationDelay: `${-i * 12}s`,
            }}
          >
            <svg width="140" height="50" viewBox="0 0 140 50">
              <ellipse cx="45" cy="30" rx="35" ry="18" fill="white" opacity="0.85" />
              <ellipse cx="75" cy="25" rx="32" ry="20" fill="white" opacity="0.9" />
              <ellipse cx="100" cy="30" rx="28" ry="16" fill="white" opacity="0.8" />
            </svg>
          </div>
        ))}
      </div>

      {/* Hogwarts Castle in distant background */}
      <div className="absolute bottom-[32%] right-[5%] pointer-events-none z-[5]" style={{ opacity: 0.6 - timeOfDay * 0.2 }}>
        <svg width="350" height="320" viewBox="0 0 280 320" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="castleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`hsl(240, 15%, ${28 - timeOfDay * 10}%)`} />
              <stop offset="50%" stopColor={`hsl(245, 18%, ${32 - timeOfDay * 12}%)`} />
              <stop offset="100%" stopColor={`hsl(240, 15%, ${28 - timeOfDay * 10}%)`} />
            </linearGradient>
          </defs>
          
          {/* Mountain/Hill base */}
          <ellipse cx="140" cy="315" rx="130" ry="25" fill={`hsl(120, 15%, ${25 - timeOfDay * 10}%)`} opacity="0.8" />
          
          {/* Main castle body - central structure */}
          <rect x="85" y="200" width="110" height="120" fill={`hsl(240, 12%, ${26 - timeOfDay * 9}%)`} />
          <rect x="100" y="180" width="80" height="140" fill="url(#castleGradient)" />
          
          {/* Left tower - tall */}
          <rect x="50" y="120" width="45" height="200" fill="url(#castleGradient)" />
          <polygon points="50,120 72.5,70 95,120" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <circle cx="72.5" cy="65" r="10" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <rect x="69" y="55" width="7" height="20" fill={`hsl(15, 65%, ${50 - timeOfDay * 15}%)`} />
          
          {/* Right tower - tall */}
          <rect x="185" y="140" width="45" height="180" fill="url(#castleGradient)" />
          <polygon points="185,140 207.5,85 230,140" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <circle cx="207.5" cy="80" r="10" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <rect x="204" y="70" width="7" height="20" fill={`hsl(15, 65%, ${50 - timeOfDay * 15}%)`} />
          
          {/* Central highest tower */}
          <rect x="120" y="100" width="40" height="100" fill="url(#castleGradient)" />
          <polygon points="120,100 140,45 160,100" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <circle cx="140" cy="40" r="8" fill={`hsl(240, 20%, ${35 - timeOfDay * 14}%)`} />
          <rect x="136" y="30" width="8" height="20" fill={`hsl(45, 70%, ${60 - timeOfDay * 20}%)`} />
          
          {/* Side turrets */}
          <rect x="70" y="170" width="20" height="60" fill={`hsl(240, 18%, ${30 - timeOfDay * 11}%)`} />
          <polygon points="70,170 80,150 90,170" fill={`hsl(240, 22%, ${37 - timeOfDay * 14}%)`} />
          
          <rect x="190" y="180" width="20" height="50" fill={`hsl(240, 18%, ${30 - timeOfDay * 11}%)`} />
          <polygon points="190,180 200,163 210,180" fill={`hsl(240, 22%, ${37 - timeOfDay * 14}%)`} />
          
          {/* Additional smaller towers */}
          <rect x="105" y="155" width="18" height="45" fill={`hsl(240, 18%, ${30 - timeOfDay * 11}%)`} />
          <polygon points="105,155 114,140 123,155" fill={`hsl(240, 22%, ${37 - timeOfDay * 14}%)`} />
          
          <rect x="157" y="160" width="18" height="40" fill={`hsl(240, 18%, ${30 - timeOfDay * 11}%)`} />
          <polygon points="157,160 166,147 175,160" fill={`hsl(240, 22%, ${37 - timeOfDay * 14}%)`} />
          
          {/* Windows - with magical glow */}
          {[
            { x: 110, y: 200 }, { x: 130, y: 205 }, { x: 150, y: 200 }, { x: 170, y: 205 },
            { x: 110, y: 230 }, { x: 150, y: 235 }, { x: 170, y: 230 },
            { x: 110, y: 260 }, { x: 150, y: 265 },
            { x: 60, y: 170 }, { x: 60, y: 200 }, { x: 60, y: 240 },
            { x: 195, y: 200 }, { x: 195, y: 230 }, { x: 195, y: 260 },
            { x: 130, y: 130 }
          ].map((pos, i) => (
            <rect 
              key={i} 
              x={pos.x} 
              y={pos.y} 
              width="10" 
              height="15" 
              fill={timeOfDay > 0.7 ? `hsl(45, 85%, 65%)` : `hsl(45, ${70 - timeOfDay * 20}%, ${60 - timeOfDay * 25}%)`}
              opacity={timeOfDay > 0.6 ? 0.9 : 0.5}
            />
          ))}
          
          {/* Battlements */}
          {[...Array(12)].map((_, i) => (
            <rect 
              key={`batt${i}`}
              x={82 + i * 11} 
              y="195" 
              width="7" 
              height="10" 
              fill={`hsl(240, 15%, ${34 - timeOfDay * 12}%)`} 
            />
          ))}
          
          {/* Connecting walls */}
          <polygon points="90,230 100,225 100,320 85,320" fill={`hsl(240, 10%, ${22 - timeOfDay * 8}%)`} opacity="0.9" />
          <polygon points="180,240 190,235 195,320 175,320" fill={`hsl(240, 10%, ${22 - timeOfDay * 8}%)`} opacity="0.9" />
        </svg>
      </div>

      {/* Harry Potter flying on broomstick */}
      <div 
        className="absolute pointer-events-none z-[6]"
        style={{
          animation: 'harryFly 25s linear infinite',
          opacity: 0.7 - timeOfDay * 0.2,
        }}
      >
        <svg width="60" height="45" viewBox="0 0 60 45">
          {/* Broomstick */}
          <line x1="5" y1="28" x2="55" y2="28" stroke={`hsl(35, 40%, ${30 - timeOfDay * 10}%)`} strokeWidth="2.5" />
          <path d="M52 28 L58 26 L58 30 Z" fill={`hsl(35, 35%, ${25 - timeOfDay * 8}%)`} />
          {/* Bristles */}
          {[...Array(8)].map((_, i) => (
            <line 
              key={i}
              x1={50 - i * 2} 
              y1="28" 
              x2={52 - i * 2.5} 
              y2={33 + i * 0.5} 
              stroke={`hsl(40, 30%, ${28 - timeOfDay * 10}%)`} 
              strokeWidth="1.5"
              opacity="0.8"
            />
          ))}
          
          {/* Harry Potter figure */}
          {/* Body leaning forward */}
          <ellipse cx="22" cy="22" rx="5" ry="8" fill={`hsl(0, 0%, ${15 - timeOfDay * 5}%)`} transform="rotate(-15 22 22)" />
          
          {/* Cloak flowing behind */}
          <path 
            d="M20 18 Q15 20 12 15 Q10 22 8 18" 
            fill={`hsl(0, 0%, ${10 - timeOfDay * 4}%)`}
            opacity="0.85"
          >
            <animate attributeName="d" values="M20 18 Q15 20 12 15 Q10 22 8 18;M20 18 Q15 22 12 17 Q10 24 8 20;M20 18 Q15 20 12 15 Q10 22 8 18" dur="2s" repeatCount="indefinite"/>
          </path>
          
          {/* Head */}
          <circle cx="24" cy="18" r="4" fill={`hsl(25, 50%, ${60 - timeOfDay * 15}%)`} />
          
          {/* Hair - messy black */}
          <ellipse cx="24" cy="16" rx="4.5" ry="3" fill={`hsl(0, 0%, ${8 - timeOfDay * 3}%)`} />
          
          {/* Glasses - iconic round glasses */}
          <circle cx="23" cy="18" r="1.5" fill="none" stroke={`hsl(0, 0%, ${20 - timeOfDay * 8}%)`} strokeWidth="0.5" />
          <circle cx="26" cy="18" r="1.5" fill="none" stroke={`hsl(0, 0%, ${20 - timeOfDay * 8}%)`} strokeWidth="0.5" />
          <line x1="24.5" y1="18" x2="25.5" y2="18" stroke={`hsl(0, 0%, ${20 - timeOfDay * 8}%)`} strokeWidth="0.5" />
          
          {/* Arms reaching forward holding broom */}
          <line x1="23" y1="24" x2="18" y2="28" stroke={`hsl(25, 50%, ${55 - timeOfDay * 15}%)`} strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="24" x2="28" y2="28" stroke={`hsl(25, 50%, ${55 - timeOfDay * 15}%)`} strokeWidth="2" strokeLinecap="round" />
          
          {/* Legs bent back */}
          <line x1="20" y1="28" x2="16" y2="35" stroke={`hsl(220, 30%, ${25 - timeOfDay * 10}%)`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="23" y1="28" x2="20" y2="35" stroke={`hsl(220, 30%, ${25 - timeOfDay * 10}%)`} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Wand in hand */}
          <line x1="28" y1="28" x2="32" y2="24" stroke={`hsl(35, 35%, ${40 - timeOfDay * 12}%)`} strokeWidth="1" />
          <circle cx="32" cy="24" r="1" fill={`hsl(45, 70%, ${65 - timeOfDay * 20}%)`} opacity={timeOfDay > 0.6 ? "0.9" : "0.5"} />
        </svg>
      </div>

      {/* Background Trees (far) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "45%" }}>
        <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMax slice">
          {[...Array(14)].map((_, i) => {
            const x = i * 75 + 20;
            const h = 90 + Math.sin(i * 1.3) * 35;
            const hue = 115 + (i % 3) * 8;
            const light = 28 - timeOfDay * 12;
            return (
              <g key={i} opacity={0.7 - timeOfDay * 0.3}>
                <ellipse cx={x} cy={380 - h * 0.4} rx={28 + (i % 3) * 8} ry={h * 0.5} fill={`hsl(${hue}, 35%, ${light}%)`} />
                <rect x={x - 4} y={380 - h * 0.2} width="8" height={h * 0.25} fill={`hsl(30, 30%, ${20 - timeOfDay * 8}%)`} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mid Trees (sides only) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "55%" }}>
        <svg className="w-full h-full" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice">
          {[0, 1, 2, 7, 8, 9].map((i) => {
            const x = i < 3 ? 50 + i * 100 : 700 + (i - 7) * 100;
            const h = 140 + Math.cos(i * 2) * 40;
            const hue = 110 + (i % 4) * 6;
            const light = 32 - timeOfDay * 12;
            return (
              <g key={i}>
                <rect x={x - 10} y={420 - h * 0.4} width="20" height={h * 0.5} fill={`hsl(28, 35%, ${25 - timeOfDay * 8}%)`} />
                <ellipse cx={x} cy={420 - h * 0.55} rx={55 + (i % 2) * 15} ry={h * 0.38} fill={`hsl(${hue}, 45%, ${light}%)`} />
                <ellipse cx={x + 12} cy={420 - h * 0.68} rx={38} ry={h * 0.26} fill={`hsl(${hue + 5}, 48%, ${light + 5}%)`} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Ground / Grass */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-colors duration-500"
        style={{
          height: "32%",
          background: `linear-gradient(180deg, 
            hsl(105, ${48 - timeOfDay * 18}%, ${38 - timeOfDay * 12}%) 0%, 
            hsl(95, ${42 - timeOfDay * 15}%, ${30 - timeOfDay * 10}%) 60%,
            hsl(85, ${35 - timeOfDay * 12}%, ${24 - timeOfDay * 8}%) 100%)`,
        }}
      >
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 280" preserveAspectRatio="xMidYMax slice">
          {/* Grass blades */}
          {[...Array(70)].map((_, i) => {
            const x = i * 15 + 5;
            const h = 25 + (i % 5) * 8;
            const sway = Math.sin(i * 0.6) * 4;
            return (
              <path
                key={i}
                d={`M${x},280 Q${x + sway},${280 - h * 0.5} ${x + sway * 1.5},${280 - h}`}
                stroke={`hsl(${105 + (i % 4) * 5}, ${48 - timeOfDay * 15}%, ${40 + (i % 3) * 5 - timeOfDay * 10}%)`}
                strokeWidth="2.5"
                fill="none"
                style={{ animation: `sway ${2.5 + (i % 3) * 0.5}s ease-in-out infinite`, animationDelay: `${(i % 7) * 0.2}s` }}
              />
            );
          })}
          {/* Wildflowers */}
          {[...Array(18)].map((_, i) => {
            const x = 40 + i * 55;
            const y = 265 - (i % 3) * 12;
            const colors = ["#f5a0c0", "#fff", "#ffd54f", "#c9a0f5", "#a0d8f5"];
            return <circle key={i} cx={x} cy={y} r={3.5 + (i % 2)} fill={colors[i % 5]} opacity={0.75 - timeOfDay * 0.3} />;
          })}
        </svg>
      </div>

      {/* Two Butterflies */}
      <Butterfly color="#FF7EB3" id={1} />
      <Butterfly color="#FFB347" id={2} />

      {/* The Rose */}
      <div
        className="absolute left-1/2 bottom-[32%] -translate-x-1/2 z-10 transition-all duration-300"
        style={{
          filter: `drop-shadow(0 0 ${12 + progress * 0.15}px rgba(220,80,120,${0.25 + progress * 0.004}))`,
          transform: 'translateX(-50%) translateY(40%)',
        }}
      >
        <Rose progress={progress} onPetalClick={handlePetalClick} />
      </div>

      {/* Petal Message Popup */}
      {selectedPetal !== null && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={closePetalMessage}
        >
          <div
            className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100"
            style={{
              border: "3px solid rgba(236,72,153,0.3)",
              animation: "fadeInScale 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🌹</div>
              <p className="text-2xl md:text-3xl font-light text-rose-900 mb-6">
                {PETAL_MESSAGES[selectedPetal]}
              </p>
              <button
                onClick={closePetalMessage}
                className="px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center z-20 px-4 w-full max-w-lg">
        <p
          className="text-2xl md:text-4xl font-light tracking-wide transition-all duration-500"
          style={{
            color: timeOfDay > 0.75 ? "rgba(255,220,235,0.95)" : "rgba(70,35,45,0.9)",
            textShadow: timeOfDay > 0.75 ? "0 0 20px rgba(255,150,180,0.5)" : "0 2px 15px rgba(255,255,255,0.6)",
          }}
        >
          {STAGE_MESSAGES[stage].text}
        </p>
        <p
          className="text-base md:text-xl mt-3 transition-all duration-500"
          style={{ color: timeOfDay > 0.75 ? "rgba(255,180,210,0.7)" : "rgba(100,55,70,0.7)" }}
        >
          {STAGE_MESSAGES[stage].sub}
        </p>
      </div>

      {/* Final overlay */}
      {showFinal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-40 transition-opacity duration-700"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        >
          <div className="text-center px-8 max-w-md">
            <h1
              className="text-4xl md:text-6xl font-light tracking-widest mb-6"
              style={{
                background: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            >
              Happy Rose Day Bubu 🌹
            </h1>
            <p className="text-lg md:text-xl text-rose-100/90 leading-relaxed mb-5">
              Not a real flower, just something I grew from scratch for you, my bubu, until the real one blooms.
            </p>
            <p className="text-base text-rose-200/70 italic">With all my love ❤️</p>
          </div>
        </div>
      )}

      {/* Progress bar & instructions */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <p
          className="text-xs tracking-widest uppercase transition-all duration-300"
          style={{ color: timeOfDay > 0.75 ? "rgba(255,200,220,0.65)" : "rgba(70,45,55,0.55)" }}
        >
          {progress < 3 ? "Scroll up to age · down to de-age" : progress > 95 ? "A cycle complete" : "Keep scrolling..."}
        </p>
        <div
          className="w-28 h-1.5 rounded-full overflow-hidden"
          style={{ background: timeOfDay > 0.75 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Reset button */}
      {progress > 40 && (
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-50 text-xs px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: timeOfDay > 0.75 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
            color: timeOfDay > 0.75 ? "rgba(255,200,220,0.85)" : "rgba(70,45,55,0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          Start Over
        </button>
      )}

      {/* Styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes cloudMove {
          0% { transform: translateX(-180px); }
          100% { transform: translateX(calc(100vw + 180px)); }
        }
        @keyframes wingFlap {
          0% { transform: scaleX(1) rotateY(0deg); }
          100% { transform: scaleX(0.25) rotateY(60deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes harryFly {
          0% { 
            left: -5%; 
            top: 15%; 
            transform: rotate(-5deg) scale(0.8);
          }
          25% { 
            left: 30%; 
            top: 25%; 
            transform: rotate(2deg) scale(1);
          }
          50% { 
            left: 55%; 
            top: 18%; 
            transform: rotate(-3deg) scale(0.9);
          }
          75% { 
            left: 80%; 
            top: 22%; 
            transform: rotate(1deg) scale(1.1);
          }
          100% { 
            left: 105%; 
            top: 12%; 
            transform: rotate(-5deg) scale(0.8);
          }
        }
        @keyframes fadeInScale {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
