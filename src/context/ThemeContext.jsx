import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const isAnimating = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((e) => {
    // Get click coordinates (center of button)
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    // Prevent double clicks during animation
    if (isAnimating.current) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Try View Transitions API (modern browsers)
    if (document.startViewTransition) {
      isAnimating.current = true;

      // Store coordinates for CSS
      document.documentElement.style.setProperty('--toggle-x', `${x}px`);
      document.documentElement.style.setProperty('--toggle-y', `${y}px`);

      // Calculate max radius needed to cover entire screen
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.style.setProperty('--toggle-radius', `${maxRadius}px`);

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });

      transition.finished.then(() => {
        isAnimating.current = false;
      }).catch(() => {
        isAnimating.current = false;
      });
    } else {
      // Fallback: manual overlay animation
      isAnimating.current = true;

      // Create overlay with current theme appearance
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        pointer-events: none;
        background: ${theme === 'dark' ? '#000000' : '#ffffff'};
        clip-path: circle(100% at ${x}px ${y}px);
        transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      document.body.appendChild(overlay);

      // Switch theme
      setTheme(newTheme);

      // Animate overlay shrinking to reveal new theme
      requestAnimationFrame(() => {
        overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      });

      // Remove overlay after animation
      setTimeout(() => {
        overlay.remove();
        isAnimating.current = false;
      }, 650);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
