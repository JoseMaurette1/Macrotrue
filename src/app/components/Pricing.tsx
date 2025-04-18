"use client";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: [
      "Calorie Calculator",
      "3 Daily Recipe Recommendations",
      "Basic Analytics",
    ],
  },
  {
    name: "Premium",
    price: "$3",
    popular: true,
    features: [
      "Calorie Calculator",
      "Unlimited Recipe Recommendations",
      "Priority support",
      "Advanced Analytics",
    ],
  },
  {
    name: "Pro",
    price: "$10",
    features: [
      "Calorie Calculator",
      "Unlimited Recipe Recommendations",
      "24/7 Support",
      "Access to Workout Tracker App",
      "Custom feature development",
    ],
  },
];

export default function Pricing() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div
      className="bg-background py-16 sm:py-24 relative overflow-hidden"
      id="pricing"
    >
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
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
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
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
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that&apos;s right for you.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="border border-border rounded-lg shadow-sm divide-y divide-border relative bg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                y: -8,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                border: "2px solid hsl(var(--primary))",
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </motion.div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-4 text-3xl font-extrabold text-foreground">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.name === "Starter" ? "per month" : "per month"}
                </p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="mt-6 w-full" onClick={handleSignup}>
                    {plan.name === "Premium" ? "GET STARTED 💪" : "Get started"}
                  </Button>
                </motion.div>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-foreground tracking-wide uppercase">
                  What&apos;s included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className="flex-shrink-0">
                        <Check
                          className="h-6 w-6 text-green-500"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="ml-3 text-sm text-muted-foreground">
                        {feature}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
