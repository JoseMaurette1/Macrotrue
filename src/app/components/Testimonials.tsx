import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee"


const testimonials = [
  {
    author: {
      name: "Jose Maurette",
      handle: "@josemaurette",
      avatar: "jose.jpeg"
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: "https://twitter.com/emmaai"
  },
  {
    author: {
      name: "Max",
      handle: "@max",
      avatar: "max.jpeg"
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: "https://twitter.com/davidtech"
  },
  {
    author: {
      name: "Ashley",
      handle: "@ashley",
      avatar: "ashley.jpeg"
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive."
  }
]

const Testimonials = () => {
  return (
    <TestimonialsSection
      title="Trusted by Clients Worldwide"
      description="Join thousands of clients who are already building their body with our platform"
      testimonials={testimonials}
    />
  )
}

export default Testimonials;