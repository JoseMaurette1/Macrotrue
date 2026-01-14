import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
       colors: {
         background: 'var(--background)',
         foreground: 'var(--foreground)',
         card: {
           DEFAULT: 'var(--card)',
           foreground: 'var(--card-foreground)'
         },
         popover: {
           DEFAULT: 'var(--popover)',
           foreground: 'var(--popover-foreground)'
         },
         primary: {
           DEFAULT: 'var(--primary)',
           foreground: 'var(--primary-foreground)'
         },
         secondary: {
           DEFAULT: 'var(--secondary)',
           foreground: 'var(--secondary-foreground)'
         },
         muted: {
           DEFAULT: 'var(--muted)',
           foreground: 'var(--muted-foreground)'
         },
         accent: {
           DEFAULT: 'var(--accent)',
           foreground: 'var(--accent-foreground)'
         },
         destructive: {
           DEFAULT: 'var(--destructive)',
           foreground: 'var(--destructive-foreground)'
         },
         border: 'var(--border)',
         input: 'var(--input)',
         ring: 'var(--ring)',
         chart: {
           '1': 'var(--chart-1)',
           '2': 'var(--chart-2)',
           '3': 'var(--chart-3)',
           '4': 'var(--chart-4)',
           '5': 'var(--chart-5)'
         },
         sidebar: {
           DEFAULT: 'var(--sidebar)',
           foreground: 'var(--sidebar-foreground)',
           primary: 'var(--sidebar-primary)',
           'primary-foreground': 'var(--sidebar-primary-foreground)',
           accent: 'var(--sidebar-accent)',
           'accent-foreground': 'var(--sidebar-accent-foreground)',
           border: 'var(--sidebar-border)',
           ring: 'var(--sidebar-ring)',
         },
         'primary-light': 'var(--primary-light)',
         'secondary-light': 'var(--secondary-light)',
       },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        marquee: {
          from: {
            transform: 'translateX(0)'
          },
          to: {
            transform: 'translateX(calc(-100% - var(--gap)))'
          }
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--duration) linear infinite',
        "shimmer-slide": "shimmer-slide calc(var(--speed) * 0.5) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed)) infinite linear",
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        'grid-pattern-light': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)'
      },
      maxWidth: {
        container: '1280px'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
