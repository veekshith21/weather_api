import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, Star } from 'lucide-react';
import { useSearchSuggestions } from '../hooks/useWeather';

interface Props {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  cardBg: string;
  cardBorder: string;
  recentSearches: string[];
  favorites: string[];
  onToggleFavorite: (city: string) => void;
  currentCity: string;
}

export default function SearchBar({
  onSearch,
  onLocationSearch,
  cardBg,
  cardBorder,
  recentSearches,
  favorites,
  onToggleFavorite,
  currentCity,
}: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = useSearchSuggestions(query);
  const showDropdown = focused && (query.length >= 2 ? suggestions.length > 0 : (recentSearches.length > 0 || favorites.length > 0));

  const handleSubmit = (city: string) => {
    onSearch(city);
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) handleSubmit(query.trim());
    if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur(); }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest('.search-container')) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative search-container flex-1 max-w-md">
      {/* Search input */}
      <div
        className="flex items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300"
        style={{
          background: focused ? 'rgba(255,255,255,0.18)' : cardBg,
          border: `1px solid ${focused ? 'rgba(255,255,255,0.4)' : cardBorder}`,
          backdropFilter: 'blur(20px)',
          boxShadow: focused ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
        }}
      >
        <Search size={16} className="text-white/60 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm font-medium min-w-0"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-white/50 hover:text-white/80 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        )}
        <button
          onClick={onLocationSearch}
          title="Use my location"
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <MapPin size={14} className="text-white/70" />
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,15,30,0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Suggestions */}
            {query.length >= 2 && suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(s.name)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition-colors text-left"
              >
                <Search size={14} className="text-white/40 flex-shrink-0" />
                <div>
                  <span className="text-white text-sm font-medium">{s.name}</span>
                  <span className="text-white/40 text-xs ml-2">{s.state ? `${s.state}, ` : ''}{s.country}</span>
                </div>
              </button>
            ))}

            {/* Recent + Favorites when no query */}
            {query.length < 2 && (
              <>
                {favorites.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-white/30 text-xs font-semibold uppercase tracking-wider">Favorites</div>
                    {favorites.map((city, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(city)}
                        className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-white text-sm">{city}</span>
                        </div>
                        {city === currentCity && <span className="text-xs text-white/30 bg-white/10 px-2 py-0.5 rounded-full">Current</span>}
                      </button>
                    ))}
                  </div>
                )}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-white/30 text-xs font-semibold uppercase tracking-wider border-t border-white/5">Recent</div>
                    {recentSearches.slice(0, 5).map((city, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubmit(city)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        <Clock size={13} className="text-white/30" />
                        <span className="text-white/80 text-sm">{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite toggle for current city */}
      {currentCity && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onToggleFavorite(currentCity)}
          className="absolute right-16 top-1/2 -translate-y-1/2 hidden"
          aria-label="Toggle favorite"
        >
          <Star
            size={15}
            className={favorites.includes(currentCity) ? 'text-amber-400 fill-amber-400' : 'text-white/40'}
          />
        </motion.button>
      )}
    </div>
  );
}
