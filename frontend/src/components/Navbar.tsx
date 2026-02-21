import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/custom/Button";
import { Sprout, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMobileMenu(); // Close mobile menu after clicking
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on body and document
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Only show navbar for non-authenticated users
  if (isLoggedIn) {
    return null;
  }

  const navItems = [
    { name: "Home", path: "/", type: "link" },
    { name: "About Us", path: "about", type: "scroll" },
    { name: "Our Services", path: "products", type: "scroll" },
  ];

  return (
    <>
      {/* Main Navbar - Hidden when mobile menu is open */}
      <div className={`fixed z-40 bg-transparent pt-4 pr-4 pb-4 pl-4 sm:pt-6 sm:pr-6 sm:pb-6 sm:pl-6 top-0 right-0 left-0 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'
      }`}>
        <div 
          className="max-w-6xl border-black/5 border rounded-full mr-auto ml-auto pt-3 pr-4 pb-3 pl-4 sm:pr-6 sm:pl-6" 
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2)) border-box',
            border: '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(16px) saturate(120%)',
            WebkitBackdropFilter: 'blur(16px) saturate(120%)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="text-green-600 h-6 w-6" />
              <span className="font-bold text-lg tracking-tight text-gray-900">AgriSmart</span>
            </Link>

            <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.type === "scroll" ? (
                    <button
                      onClick={() => scrollToSection(item.path)}
                      className="hover:text-green-700 transition-colors duration-300 px-4 py-2 rounded-full hover:bg-green-50/50"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`hover:text-green-700 transition-colors duration-300 px-4 py-2 rounded-full hover:bg-green-50/50 ${
                        location.pathname === item.path ? "text-green-700 bg-green-50/50" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5 md:gap-2">
              <Link to="/login" className="hidden md:inline-flex">
                <button className="px-5 py-2.5 rounded-full text-xs font-semibold border border-gray-200 hover:border-green-600 hover:text-green-700 transition-all duration-300">
                  Login
                </button>
              </Link>
              <Link to="/register" className="hidden md:inline-flex">
                <button className="px-5 py-2.5 rounded-full text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-all duration-300">
                  Get Started
                </button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="inline-flex md:hidden hover:bg-black/5 p-2 rounded-full transition-all duration-300" 
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[min(320px,90vw)] bg-gradient-to-br from-vanilla/60 via-arylide-yellow/10 to-vanilla/50 backdrop-blur-lg border-l border-jonquil/20 z-[60] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-jonquil/20">
            <div className="flex items-center gap-2">
              <Sprout className="text-green-600 h-6 w-6" />
              <span className="font-bold text-lg tracking-tight text-gray-900">AgriSmart</span>
            </div>
            <button 
              onClick={closeMobileMenu}
              className="p-2 hover:bg-arylide-yellow/30 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 px-6 py-8">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.type === "scroll" ? (
                    <button
                      onClick={() => scrollToSection(item.path)}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 text-gray-700 hover:text-green-700 hover:bg-gradient-to-r hover:from-arylide-yellow/20 hover:to-vanilla/60 w-full text-left"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                        location.pathname === item.path 
                          ? "text-green-700 bg-gradient-to-r from-arylide-yellow/40 to-jonquil/20 border border-jonquil/30" 
                          : "text-gray-700 hover:text-green-700 hover:bg-gradient-to-r hover:from-arylide-yellow/20 hover:to-vanilla/60"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Footer with Auth Buttons */}
          <div className="px-6 py-6 border-t border-jonquil/20 space-y-3">
            <Link to="/login" onClick={closeMobileMenu} className="block">
              <button className="w-full px-5 py-3 rounded-lg text-sm font-semibold border border-jonquil/40 bg-vanilla/60 hover:bg-arylide-yellow/30 hover:border-green-600 hover:text-green-700 transition-all duration-300">
                Login
              </button>
            </Link>
            <Link to="/register" onClick={closeMobileMenu} className="block">
              <button className="w-full px-5 py-3 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/20">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
