"use client"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <div className="bg-secondary">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-extrabold  sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="block">Ready to reach the body of your dreams?</span>
          <span className="block mt-2">Start your free trial today.</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg leading-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join thousands of satisfied customers who have transformed their bodies with Macrotrue.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <ShimmerButton className="mt-8 shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Get started for free
            </span>
          </ShimmerButton>
        </motion.div>
      </div>
    </div>
  )
}

