import { useEffect, useRef } from 'react';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

export const useKonamiCode = (onSuccess) => {
  const progress = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      progress.current.push(e.key);
      if (progress.current.length > KONAMI.length) {
        progress.current.shift();
      }
      if (JSON.stringify(progress.current) === JSON.stringify(KONAMI)) {
        progress.current = [];
        onSuccess();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSuccess]);
};
