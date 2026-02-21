import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Home, BarChart3, Cloud, Wheat, 
  FlaskConical, FileText, MessageCircle, 
  User, LogOut, TrendingUp, ChevronLeft, ChevronRight, BookOpen
} from "lucide-react";
import { Button } from "@/components/custom/Button";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Crop Recommender", path: "/crop-recommender", icon: Wheat },
    { name: "Weather", path: "/weather", icon: Cloud },
    { name: "Soil Reports", path: "/soil-reports", icon: FileText },
    { name: "Fertilizer Prediction", path: "/fertilizer-prediction", icon: FlaskConical },
    { name: "Market Rates", path: "/market-rates", icon: TrendingUp },
    { name: "Khata Book", path: "/khata-book", icon: BookOpen },
    { name: "Results", path: "/results", icon: BarChart3 },
    // { name: "Feedback", path: "/feedback", icon: MessageCircle },
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside
          className={`
            group fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-vanilla to-vanilla/50 backdrop-blur-sm border-r border-olive/20 shadow-lg
            transition-all duration-300 ease-in-out overflow-hidden
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
            w-[min(80vw,18rem)] h-screen
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-olive/20 p-4 flex-shrink-0 bg-gradient-to-r from-arylide-yellow/30 to-transparent">
              <div className="flex items-center gap-2 flex-1 min-w-0 relative">
                <div className={`w-9 h-9 bg-gradient-to-br from-jonquil to-arylide-yellow rounded-xl flex items-center justify-center shadow-md flex-shrink-0 transition-opacity duration-200 ${isCollapsed ? 'lg:group-hover:opacity-0' : 'opacity-100'}`}>
                  <Wheat className="w-5 h-5 text-dark-moss" />
                </div>
                {isCollapsed && (
                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="hidden lg:flex absolute left-0 w-9 h-9 items-center justify-center hover:bg-olive/10 rounded-xl transition-all duration-200 text-olive opacity-0 group-hover:opacity-100"
                    title="Expand"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
                <span className={`font-bold text-dark-moss text-lg whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>
                  AgriSmart
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="hidden lg:block p-1.5 hover:bg-olive/10 rounded-lg transition-colors text-olive"
                    title="Collapse"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-1.5 hover:bg-olive/10 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            {/* Note: no sidebar-level scrolling; if nav grows too large consider enabling overflow-y-auto here */}
            <nav className="flex-1 p-2 overflow-y-hidden min-h-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center rounded-xl mb-1.5 transition-all duration-300 ease-in-out relative
                      ${isCollapsed ? 'lg:justify-center lg:p-3' : 'gap-3 px-4 py-2.5'}
                      ${isActive 
                        ? 'bg-gradient-to-r from-olive to-olive/90 text-white shadow-md' 
                        : 'text-dark-moss hover:bg-arylide-yellow/40 hover:shadow-sm'
                      }
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon size={19} className={`${isActive ? 'drop-shadow' : ''} transition-all duration-300 flex-shrink-0`} />
                    <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100 w-auto'}`}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* User Section - pinned to bottom */}
            <div className="border-t border-olive/20 p-3 flex-shrink-0 mt-auto bg-gradient-to-t from-arylide-yellow/20 to-transparent">
              <div className={`flex items-center gap-3 px-2 py-2.5 mb-2 bg-vanilla/50 rounded-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-0 lg:h-0 lg:mb-0 lg:py-0 lg:overflow-hidden' : 'opacity-100'}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-olive to-olive/80 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-semibold text-dark-moss truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-olive/80 truncate">{user?.email || ''}</p>
                </div>
              </div>
              
              <div className={`hidden lg:flex justify-center mb-2 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-100' : 'lg:opacity-0 lg:h-0 lg:mb-0 lg:overflow-hidden'}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-olive to-olive/80 rounded-xl flex items-center justify-center shadow-sm">
                  <User size={16} className="text-white" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <button
                  onClick={() => navigate('/profile')}
                  className={`
                    w-full flex items-center text-dark-moss hover:bg-olive/20 rounded-xl transition-all duration-300 ease-in-out hover:shadow-sm
                    ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'gap-2.5 px-3 py-2.5'}
                  `}
                  title={isCollapsed ? "Profile" : undefined}
                >
                  <User size={17} className="flex-shrink-0" />
                  <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100 w-auto'}`}>
                    Profile
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 ease-in-out hover:shadow-sm
                    ${isCollapsed ? 'lg:justify-center lg:p-2.5' : 'gap-2.5 px-3 py-2.5'}
                  `}
                  title={isCollapsed ? "Logout" : undefined}
                >
                  <LogOut size={17} className="flex-shrink-0" />
                  <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100 w-auto'}`}>
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        {/* flex-col layout so header is non-scrolling and main area is the only scrollable region */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} ml-0 flex flex-col h-screen`}>
          {/* Top Bar - fixed in layout (not page-scrollable) */}
          <header className="flex-shrink-0 z-40 bg-gradient-to-r from-vanilla via-vanilla/90 to-arylide-yellow/30 backdrop-blur-md border-b border-olive/15 shadow-sm">
            <div className="flex items-center px-4 lg:px-6 py-3.5">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-olive/15 rounded-xl transition-all duration-200 mr-3 hover:shadow-sm"
              >
                <Menu size={20} className="text-olive" />
              </button>
              <h1 className="text-xl font-bold text-dark-moss capitalize tracking-tight">
                {location.pathname.replace('/', '').replace(/-/g, ' ') || 'Dashboard'}
              </h1>
            </div>
          </header>

          {/* Page Content - THIS is the scrollable area */}
          <main className="flex-1 overflow-auto p-4 lg:p-8 bg-gradient-to-br from-background via-background to-vanilla/20">
            {children}
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    );
  }

  // Public navigation for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-vanilla/30">
      <nav className="bg-gradient-to-r from-vanilla via-vanilla/90 to-arylide-yellow/30 backdrop-blur-md border-b border-olive/20 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-jonquil to-arylide-yellow rounded-xl flex items-center justify-center shadow-md">
                <Wheat className="w-5 h-5 text-dark-moss" />
              </div>
              <span className="font-bold text-dark-moss text-lg">AgriSmart</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-olive/10">
                Home
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')} className="border-olive/40 hover:bg-olive/10 hover:border-olive">
                Sign In
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')} className="shadow-md hover:shadow-lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
