import { useEffect } from 'react';

export default function useClickOutside(refs = [], callback) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Nếu tất cả ref đều KHÔNG chứa phần tử vừa click → gọi callback
      const clickedOutside = refs.every(ref => ref.current && !ref.current.contains(e.target));
      if (clickedOutside) callback();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, callback]);
}
