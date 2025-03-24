"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MemberHeader from "../components/MemberHeader";
const HomePage = () => {
  return (
    <div className="p-4">
      <MemberHeader />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-screen"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to
          <span className="text-primary ml-2">Macro</span>
          <span className="text-foreground">true</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your personal nutrition companion
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/Calculator">
            <Button size="lg" className="mt-8">
              Get Started <ArrowRight />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
