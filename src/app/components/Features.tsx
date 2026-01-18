"use client"

import { Apple, Dumbbell, Calculator, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

const features = [
  {
    name: "Calorie Calculator",
    description: "Gain valuable insights into your body and how much you should eat to reach your goal.",
    icon: Calculator,
    placeholderColor: "from-purple-500 to-pink-500",
    videoUrl: "/calculator.mp4",
  },
  {
    name: "Food Recommendations",
    description: "Seamlessly choose from a variety of delicious foods while maintaining a diet.",
    icon: Apple,
    placeholderColor: "from-green-500 to-emerald-500",
    videoUrl: "/meals.mp4?v=2",
  },
  {
    name: "Workout Tracker",
    description: "A user-friendly interface that's easy to navigate, making tracking your workouts more efficient.",
    icon: Dumbbell,
    placeholderColor: "from-orange-500 to-red-500",
    videoUrl: "/workout.mp4",
  },
]

export default function Features() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const openVideo = (url: string) => {
    setSelectedVideo(url)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <>
      <div className="py-24 bg-background relative overflow-hidden" id="features">
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
          <div className="lg:text-center mb-16">
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

          <div className="space-y-20">
            {features.map((feature, index) => (
              <FeatureRow
                key={feature.name}
                feature={feature}
                index={index}
                imageOnLeft={index % 2 === 0}
                onPlay={() => openVideo(feature.videoUrl)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

interface FeatureRowProps {
  feature: {
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    placeholderColor: string
    videoUrl: string
  }
  index: number
  imageOnLeft: boolean
  onPlay: () => void
}

function FeatureRow({ feature, index, imageOnLeft, onPlay }: FeatureRowProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col md:flex-row items-center gap-8 md:gap-12",
        imageOnLeft ? "" : "md:flex-row-reverse"
      )}
    >
      <div className="w-full md:w-1/2">
        <div
          className="relative aspect-video rounded-2xl overflow-hidden bg-black cursor-pointer group"
          onClick={onPlay}
        >
          <video
            ref={videoRef}
            src={feature.videoUrl}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </motion.div>
          </div>

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium px-3 py-1.5 bg-black/60 rounded-full backdrop-blur-sm">
              Click to expand
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <feature.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{feature.name}</h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
