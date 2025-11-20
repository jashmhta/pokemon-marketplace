'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShoppingCart, Search, X, Zap, Flame, Droplets, Leaf, Ghost, 
  Star, ArrowRight, Activity, ShieldCheck, Box, Hexagon, 
  Menu, Play, Pause, Volume2, VolumeX, Sparkles
} from 'lucide-react';

// --- ASSETS & CONSTANTS ---

// Animated sprites from Gen 5 (Best pixel art era)
const getAnimatedSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
const getStaticSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const TYPES = ["All", "Fire", "Water", "Grass", "Electric", "Psychic", "Ghost", "Dragon", "Dark", "Metal"];

const POKEMON_DB = [
  { id: 6, name: "Charizard", type: "Fire", price: 4500.00, rarity: "Legendary", set: "Base Set", color: "from-orange-500 to-red-900", accent: "text-orange-400", stats: { hp: 280, atk: 300 }, description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally." },
  { id: 9, name: "Blastoise", type: "Water", price: 3200.50, rarity: "Rare", set: "Base Set", color: "from-blue-400 to-blue-900", accent: "text-blue-400", stats: { hp: 300, atk: 240 }, description: "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles." },
  { id: 3, name: "Venusaur", type: "Grass", price: 2800.00, rarity: "Rare", set: "Base Set", color: "from-green-400 to-emerald-900", accent: "text-green-400", stats: { hp: 320, atk: 220 }, description: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight." },
  { id: 25, name: "Pikachu", type: "Electric", price: 85000.00, rarity: "Illustrator", set: "Promo", color: "from-yellow-300 to-yellow-600", accent: "text-yellow-400", stats: { hp: 180, atk: 210 }, description: "When several of these Pokémon gather, their electricity could build and cause lightning storms." },
  { id: 150, name: "Mewtwo", type: "Psychic", price: 12000.00, rarity: "Secret Rare", set: "Fossil", color: "from-purple-400 to-indigo-900", accent: "text-purple-400", stats: { hp: 350, atk: 380 }, description: "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments." },
  { id: 94, name: "Gengar", type: "Ghost", price: 4100.00, rarity: "Holofoil", set: "Darkness", color: "from-indigo-500 to-purple-950", accent: "text-indigo-400", stats: { hp: 240, atk: 290 }, description: "Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright." },
  { id: 384, name: "Rayquaza", type: "Dragon", price: 9500.00, rarity: "Ultra Rare", set: "Sky Stream", color: "from-emerald-500 to-teal-950", accent: "text-emerald-400", stats: { hp: 380, atk: 400 }, description: "It lives in the ozone layer far above the clouds and cannot be seen from the ground." },
  { id: 197, name: "Umbreon", type: "Dark", price: 6000.00, rarity: "Moon Set", set: "Neo", color: "from-slate-700 to-black", accent: "text-blue-300", stats: { hp: 310, atk: 200 }, description: "When exposed to the moon's aura, the rings on its body glow faintly and it gains a mysterious power." },
  { id: 249, name: "Lugia", type: "Psychic", price: 10500.00, rarity: "Legendary", set: "Silver", color: "from-slate-300 to-blue-500", accent: "text-blue-200", stats: { hp: 400, atk: 310 }, description: "It sleeps in a deep-sea trench. If it flaps its wings, it is said to cause a 40-day storm." },
  { id: 130, name: "Gyarados", type: "Water", price: 1800.00, rarity: "Shiny", set: "Gold Star", color: "from-red-500 to-red-900", accent: "text-red-500", stats: { hp: 330, atk: 340 }, description: "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage." },
  { id: 448, name: "Lucario", type: "Metal", price: 2200.00, rarity: "Rare", set: "Diamond", color: "from-blue-600 to-slate-800", accent: "text-blue-300", stats: { hp: 280, atk: 310 }, description: "It controls waves known as auras, which are powerful enough to pulverize huge rocks." },
  { id: 212, name: "Scizor", type: "Metal", price: 1500.00, rarity: "Uncommon", set: "Neo", color: "from-red-600 to-red-900", accent: "text-red-400", stats: { hp: 290, atk: 300 }, description: "It has a body with the hardness of steel. It is not easily fazed by ordinary attacks." },
];

const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

// --- SUB-COMPONENTS ---

// 1. Canvas "Video" Background
const CyberSpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particles
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1
    }));

    // Hexagons
    const hexs = Array.from({ length: 15 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        speedRot: (Math.random() - 0.5) * 0.002
    }));

    const drawHexagon = (x, y, size, rotation) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = rotation + (i * Math.PI) / 3;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = '#050505'; // Deep space black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const offset = (Date.now() / 50) % gridSize;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
      }
      // Moving horizontal lines for "forward" motion
      for (let y = offset; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
      }

      // Draw Hexagons
      hexs.forEach(h => {
          h.rotation += h.speedRot;
          drawHexagon(h.x, h.y, h.size, h.rotation);
      });

      // Draw Particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// 2. Pokeball SVG Background Pattern
const PokeballPattern = () => (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] overflow-hidden">
        <svg width="100%" height="100%">
            <pattern id="pokeball-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="2" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pokeball-pattern)" />
        </svg>
    </div>
);

// 3. Type Icon Component
const TypeIcon = ({ type, size = 16, className }) => {
    const iconMap = {
        'Fire': <Flame size={size} className={`text-orange-500 ${className}`} />,
        'Water': <Droplets size={size} className={`text-blue-500 ${className}`} />,
        'Grass': <Leaf size={size} className={`text-green-500 ${className}`} />,
        'Electric': <Zap size={size} className={`text-yellow-400 ${className}`} />,
        'Ghost': <Ghost size={size} className={`text-purple-400 ${className}`} />,
        'Psychic': <Star size={size} className={`text-pink-400 ${className}`} />,
        'Dragon': <Activity size={size} className={`text-teal-500 ${className}`} />,
        'Metal': <Hexagon size={size} className={`text-gray-400 ${className}`} />,
        'Dark': <Box size={size} className={`text-gray-600 ${className}`} />,
    };
    return iconMap[type] || <Sparkles size={size} className={`text-white ${className}`} />;
};

// 4. Capture Animation
const CatchAnimation = ({ active }) => {
    if (!active) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="relative w-32 h-32 animate-ping-slow">
                {/* CSS drawn pokeball */}
                <div className="absolute inset-0 rounded-full border-[12px] border-white bg-red-500 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.5)] animate-shake">
                    <div className="absolute top-[50%] w-full h-full bg-white border-t-[12px] border-black"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-[8px] border-black z-10"></div>
                </div>
                <div className="absolute inset-0 rounded-full ring-4 ring-red-500 animate-ping"></div>
            </div>
        </div>
    );
};

// 5. Intro Sequence
const IntroSplash = ({ onComplete }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 1000), // Booting
            setTimeout(() => setStage(2), 2500), // Logo
            setTimeout(() => onComplete(), 4000) // Done
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
            <div className="text-center space-y-8">
                {stage === 0 && (
                    <div className="font-mono text-green-400 text-xl animate-pulse">
                        INITIALIZING SYSTEM...
                    </div>
                )}
                {stage === 1 && (
                    <div className="space-y-4">
                        <div className="font-mono text-green-400 text-sm">
                            [OK] NEURAL NETWORK LOADED<br/>
                            [OK] HOLOGRAPHIC DISPLAY READY<br/>
                            [OK] QUANTUM DATABASE SYNCED
                        </div>
                    </div>
                )}
                {stage === 2 && (
                    <div className="animate-pulse">
                        <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            POKÉMART
                        </h1>
                        <p className="text-gray-500 font-mono text-sm mt-4">V2.0 CYBER EDITION</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// 6. Immersive Card Component
const ImmersiveCard = ({ pokemon, onAdd, onView }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div 
            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${pokemon.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}></div>
            
            {/* Rarity Badge */}
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-bold border border-white/20">
                {pokemon.rarity}
            </div>

            {/* Image Container */}
            <div className="relative h-56 flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                <img 
                    src={hovered ? getAnimatedSprite(pokemon.id) : getStaticSprite(pokemon.id)}
                    alt={pokemon.name}
                    className={`relative z-10 w-full h-full object-contain transition-all duration-500 ${hovered ? 'scale-110 pixelated' : ''}`}
                />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight">{pokemon.name}</h3>
                    <TypeIcon type={pokemon.type} size={20} />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-mono">{pokemon.set}</span>
                    <span className={`font-bold text-lg ${pokemon.accent}`}>{formatPrice(pokemon.price)}</span>
                </div>

                {/* Stats */}
                <div className="flex gap-2 text-xs">
                    <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/10">
                        <div className="text-gray-500 mb-1">HP</div>
                        <div className="font-bold">{pokemon.stats.hp}</div>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/10">
                        <div className="text-gray-500 mb-1">ATK</div>
                        <div className="font-bold">{pokemon.stats.atk}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={() => onView(pokemon)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold text-sm transition-all"
                    >
                        VIEW
                    </button>
                    <button 
                        onClick={() => onAdd(pokemon)}
                        className="flex-1 py-2 bg-white hover:bg-gray-200 text-black rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={16} /> ADD
                    </button>
                </div>
            </div>
        </div>
    );
};

// 7. Detail Modal
const DetailModal = ({ pokemon, onClose, onAdd }) => {
    if (!pokemon) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="relative max-w-2xl w-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-white/20 rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm">
                    <X size={24} />
                </button>

                {/* Header with Gradient */}
                <div className={`relative h-80 bg-gradient-to-br ${pokemon.color} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <img 
                        src={getStaticSprite(pokemon.id)}
                        alt={pokemon.name}
                        className="relative z-10 w-64 h-64 object-contain drop-shadow-2xl"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-2">{pokemon.name}</h2>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-bold border border-white/20 flex items-center gap-2">
                                    <TypeIcon type={pokemon.type} size={14} />
                                    {pokemon.type}
                                </span>
                                <span className="text-gray-500 font-mono text-sm">{pokemon.set}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">MARKET VALUE</div>
                            <div className={`text-3xl font-black ${pokemon.accent}`}>{formatPrice(pokemon.price)}</div>
                        </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed">{pokemon.description}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-gray-500 text-sm mb-2">HIT POINTS</div>
                            <div className="text-3xl font-black">{pokemon.stats.hp}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-gray-500 text-sm mb-2">ATTACK</div>
                            <div className="text-3xl font-black">{pokemon.stats.atk}</div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={() => { onAdd(pokemon); onClose(); }}
                        className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3"
                    >
                        <ShoppingCart size={20} />
                        ADD TO STORAGE
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [catching, setCatching] = useState(false);

  const filtered = useMemo(() => {
    return POKEMON_DB.filter(p => {
        const matchType = filter === "All" || p.type === filter;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });
  }, [filter, search]);

  const handleAdd = (pokemon) => {
    setCatching(true);
    setTimeout(() => setCatching(false), 2000);

    setCart(prev => {
        const existing = prev.find(item => item.id === pokemon.id);
        if (existing) {
            return prev.map(item => item.id === pokemon.id ? { ...item, qty: item.qty + 1 } : item);
        }
        return [...prev, { ...pokemon, qty: 1 }];
    });
  };

  if (showIntro) {
    return <IntroSplash onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CyberSpaceBackground />
      <PokeballPattern />
      <CatchAnimation active={catching} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-black text-xl">
                  P
              </div>
              <h1 className="text-2xl font-black tracking-tighter">
                  POKÉMART <span className="text-indigo-500 text-xs align-top">V2.0</span>
              </h1>
          </div>

          <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                      type="text"
                      placeholder="Search Pokémon..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 w-64"
                  />
              </div>

              {/* Cart Button */}
              <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10"
              >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                          {cart.reduce((a,b) => a + b.qty, 0)}
                      </span>
                  )}
              </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* HERO */}
        <div className="mb-20 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none relative z-10">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">GOTTA</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">COLLECT 'EM</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light tracking-wide">
                Access the global database of rare digital artifacts. <br/>Authenticated by the Pokémon League.
            </p>
            
            {/* Filter Tabs */}
            <div className="flex justify-center flex-wrap gap-2 mb-12">
                {TYPES.map(t => (
                    <button 
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                            filter === t 
                            ? 'bg-white text-black border-white scale-110 shadow-[0_0_20px_white]' 
                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/50 hover:text-white'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((p, idx) => (
                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                    <ImmersiveCard pokemon={p} onAdd={handleAdd} onView={setViewing} />
                </div>
            ))}
        </div>

        {filtered.length === 0 && (
            <div className="text-center py-32 opacity-50">
                <Ghost size={64} className="mx-auto mb-4 animate-bounce" />
                <p className="text-2xl font-mono">NO SIGNAL DETECTED</p>
            </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      <DetailModal pokemon={viewing} onClose={() => setViewing(null)} onAdd={handleAdd} />

      {/* CART DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0a0a0a] border-l border-white/10 transform transition-transform duration-500 z-[60] shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-indigo-900/20 to-transparent">
                  <h2 className="font-black text-2xl tracking-tighter flex items-center gap-2">
                      STORAGE BOX <span className="text-indigo-500 text-sm align-top">V1.0</span>
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="w-16 h-16 bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                              <img src={getAnimatedSprite(item.id)} alt="" className="w-12 h-12 object-contain pixelated" />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between">
                                  <h4 className="font-bold">{item.name}</h4>
                                  <span className="font-mono text-indigo-300">{formatPrice(item.price * item.qty)}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">QTY: {item.qty}</span>
                                  <div className="flex items-center gap-2">
                                      <button className="w-6 h-6 bg-white/10 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-xs">-</button>
                                      <button className="w-6 h-6 bg-white/10 rounded hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center text-xs">+</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
                  {cart.length === 0 && (
                      <div className="text-center text-gray-600 py-20 font-mono text-sm">
                          // STORAGE EMPTY // <br/>
                          // AWAITING CAPTURE //
                      </div>
                  )}
              </div>

              <div className="p-6 border-t border-white/10">
                  <div className="flex justify-between mb-6 font-mono text-xl">
                      <span>TOTAL</span>
                      <span className="font-bold text-indigo-400">{formatPrice(cart.reduce((a,b) => a + (b.price * b.qty), 0))}</span>
                  </div>
                  <button className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      CONFIRM TRADE
                  </button>
              </div>
          </div>
      </div>

    </div>
  );
}
