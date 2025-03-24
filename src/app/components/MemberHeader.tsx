"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Calculator } from "lucide-react";

export default function MemberHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { href: "/Home", label: "Home", icon: <Home size={16} /> },
    { href: "/Calculator", label: "Calculator", icon: <Calculator size={16} /> },
    { href: "/Food", label: "Food", icon: <Calculator size={16} /> },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary">Macro</span>
              <span className="text-foreground">true</span>
            </Link>
          </motion.div>
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-4 py-2 group"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Button
              className="md:hidden p-2 rounded-full bg-primary hover:bg-accent/80 transition-colors duration-200"
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
                  className="flex items-center text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-4 py-2"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
