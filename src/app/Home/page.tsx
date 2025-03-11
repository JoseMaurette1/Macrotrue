"use client";
import React from "react";
import { motion } from "framer-motion";
const HomePage = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-screen"
      >
        <h1>HomePage</h1>
      </motion.div>
    </div>
  );
};

export default HomePage;
