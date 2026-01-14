// src/hooks/useClickOutside.js
import { useEffect } from 'react';

export default function useClickOutside(refs = [], callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu KHÔNG có ref nào chứa target → tức là click ra ngoài hoàn toàn
      const isOutside = refs.every((ref) => {
        return !ref.current || !ref.current.contains(event.target);
      });

      if (isOutside) {
        callback(event);
      }
    };

    // Dùng mousedown và touchstart để hỗ trợ tốt mobile
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, callback]);
}