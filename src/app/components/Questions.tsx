"use client";
import React from "react";
import { FaqSection } from "@/components/ui/faq";
import { motion } from "framer-motion";

const Questions = () => {
  const faqItems = [
    {
      question: "What is Macrotrue?",
      answer: "Macrotrue is a Health and Fitness Application that helps you diet with customized diet plans based on your goals."
    },
    {
      question: "How can it help me?",
      answer: "Macrotrue can recommend you different foods everyday to keep dieting fresh, it also has built in options such as Calorie Calculator to help you know how much calories you need to eat."
    },
    {
      question: "Is it Free?",
      answer: "Yes, Macrotrue is free to use for everyone."
    }
  ];

  return (
    <div className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <FaqSection
          title="Frequently Asked Questions"
          description="Everything you need to know about Macrotrue"
          items={faqItems}
          className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        />
      </motion.div>
    </div>
  );
};

export default Questions;
