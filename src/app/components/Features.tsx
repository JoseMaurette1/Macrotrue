"use client"
import { Zap, Apple, Dumbbell, Calculator } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const features = [
  {
    name: "Lightning Fast",
    description: "Our platform is optimized for speed, ensuring quick load times and responsive interactions.",
    icon: Zap,
  },
  {
    name: "Food Recommendations",
    description: "Seamlessly choose from a variety of delicious foods while maintaining a diet.",
    icon: Apple,
  },
  {
    name: "Workout Tracker",
    description: "A user-friendly interface that's easy to navigate, making tracking your workouts more efficient.",
    icon: Dumbbell,
  },
  {
    name: "Calorie Calculator",
    description: "Gain valuable insights into your body and how much you should eat to reach your goal.",
    icon: Calculator,
  },
]

export default function Features() {
  return (
    <div className="py-24 bg-background relative overflow-hidden" id="features">
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Features
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to become the best version of yourself
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Macrotrue offers a comprehensive set of features designed to boost your productivity and simplify your
            diet.
          </motion.p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.name}
                title={feature.name}
                description={feature.description}
                icon={<feature.icon className="h-6 w-6" />}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col p-6 relative group/feature border rounded-lg dark:border-neutral-800 hover:shadow-md transition-all duration-200 overflow-hidden",
        index % 2 === 0 ? "border-r-2 dark:border-neutral-800" : "",
        index < 2 ? "border-b-2 dark:border-neutral-800" : ""
      )}
    >
      {/* Background gradient on hover */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none rounded-lg" />

      <div className="mb-4 relative z-10 text-neutral-600 dark:text-neutral-400">
        <motion.div
          className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon}
        </motion.div>
      </div>

      <div className="text-lg font-bold mb-2 relative z-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 pl-3">
          {title}
        </span>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-300 relative z-10 pl-3">
        {description}
      </p>
    </motion.div>
  );
};
