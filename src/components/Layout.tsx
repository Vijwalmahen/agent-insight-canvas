
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLoaded(true);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Demo", path: "/demo" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-transition">
            <div className="relative h-8 w-8 rounded-full bg-primary flex items-center justify-center btn-transition">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <span className="text-xl font-semibold">AgentInsight</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-6 text-transition ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-1 py-2 transition-all duration-300 ease-in-out hover:text-primary ${
                  location.pathname === item.path ? "text-primary border-b-2 border-primary" : ""
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="ml-4 hover-lift">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-card/95 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 transition-all duration-300 ease-in-out hover:text-primary animate-fade-in ${
                    location.pathname === item.path ? "text-primary font-medium" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              <Button className="mt-2 hover-lift animate-fade-in" style={{ animationDelay: '300ms' }}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-transition">AgentInsight</h3>
              <p className="text-sm text-muted-foreground text-transition">
                Advanced multi-agent AI data analysis platform for secure, efficient insights.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-transition">Navigation</h3>
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="text-sm hover:text-primary transition-all duration-300 ease-in-out text-transition"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-transition">Connect</h3>
              <p className="text-sm text-muted-foreground mb-2 text-transition">
                info@agentinsight.com
              </p>
              <p className="text-sm text-muted-foreground text-transition">
                © {new Date().getFullYear()} AgentInsight. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
