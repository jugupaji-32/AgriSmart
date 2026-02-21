import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top with multiple methods
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also try scrolling the main content area if it exists
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };

    // Execute immediately
    scrollToTop();
    
    // Also execute after a tiny delay to catch any lazy rendering
    setTimeout(scrollToTop, 0);
  }, [pathname]);

  return null;
}
