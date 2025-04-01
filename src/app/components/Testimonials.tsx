import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Jose Maurette",
      handle: "@josemaurette",
      avatar: "jose.jpeg",
    },
    text: "Using this AI Platform has transformed how I eat. The recommendations are spot on.",
    href: "/signup",
  },
  {
    author: {
      name: "Max",
      handle: "@max",
      avatar: "max.jpeg",
    },
    text: "Even while being busy, I've lost 10 pounds in the last month thanks to the AI recommendations.",
    href: "/signup",
  },
  {
    author: {
      name: "Ashley",
      handle: "@ashley",
      avatar: "ashley.jpeg",
    },
    text: "Macrotrue has helped me lose weight and using the Pro plan, I've been able to get access to the Workout Tracker App.",
    href: "/signup",
  },
];

const Testimonials = () => {
  return (
    <TestimonialsSection
      title="Trusted by Clients Worldwide"
      description="Join thousands of clients who are already building their body with our platform"
      testimonials={testimonials}
    />
  );
};

export default Testimonials;
