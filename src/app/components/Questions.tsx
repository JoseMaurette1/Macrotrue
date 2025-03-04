"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const Questions = () => {
  return (
    <div className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className=" max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Macrotrue?</AccordionTrigger>
              <AccordionContent>
                <motion.p
                  className="text-xl font-extrabold  sm:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Macrotrue is a Health and Fitness Application that helps you
                  diet with customized diet plans based on your goals.
                </motion.p>{" "}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can it help me?</AccordionTrigger>
              <AccordionContent>
                <motion.p
                  className="text-xl font-extrabold  sm:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Macrotrue can recommend you different foods everyday to keep
                  dieting fresh, it also has built in options such as Calorie
                  Calculator to help you know how much calories you need to eat.
                </motion.p>{" "}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it Free?</AccordionTrigger>
              <AccordionContent>
                <motion.p
                  className="text-xl font-extrabold  sm:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Yes, Macrotrue is free to use for everyone.
                </motion.p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>{" "}
      </motion.div>{" "}
    </div>
  );
};

export default Questions;
