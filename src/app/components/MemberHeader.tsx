"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Calculator, LogOut, Utensils, Dumbbell } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

export default function MemberHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { href: "/Home", label: "Home", icon: <Home size={16} /> },
    {
      href: "/Calculator",
      label: "Calculator",
      icon: <Calculator size={16} />,
    },
    { href: "/Food", label: "Food", icon: <Utensils size={16} /> },
    { href: "/Workout", label: "Workout", icon: <Dumbbell size={16} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/Home" className="text-xl font-bold text-primary">
            <span className="text-primary">Macro</span>
            <span className="text-foreground">true</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4 md:hidden"
          >
            <Button
              className="p-2 rounded-full bg-primary hover:bg-accent/80 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-base font-medium transition-colors duration-200 ease-in-out px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full flex items-center justify-start text-base font-medium text-foreground hover:text-primary transition-colors duration-200 px-4 py-2"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
