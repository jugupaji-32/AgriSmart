import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Agricultural Color Palette
        'jonquil': {
          DEFAULT: 'hsl(49, 100%, 46%)',      // #EAC800
          50: 'hsl(49, 100%, 95%)',
          100: 'hsl(49, 100%, 85%)',
          500: 'hsl(49, 100%, 46%)',
          900: 'hsl(49, 100%, 20%)',
        },
        'arylide-yellow': {
          DEFAULT: 'hsl(49, 74%, 67%)',       // #EAD465
          50: 'hsl(49, 74%, 95%)',
          100: 'hsl(49, 74%, 85%)',
          500: 'hsl(49, 74%, 67%)',
          900: 'hsl(49, 74%, 30%)',
        },
        'vanilla': {
          DEFAULT: 'hsl(46, 77%, 85%)',       // #F5EAB9
          50: 'hsl(46, 77%, 95%)',
          100: 'hsl(46, 77%, 90%)',
          500: 'hsl(46, 77%, 85%)',
          900: 'hsl(46, 77%, 40%)',
        },
        'olive': {
          DEFAULT: 'hsl(71, 94%, 26%)',       // #7E8407
          50: 'hsl(71, 94%, 95%)',
          100: 'hsl(71, 94%, 85%)',
          500: 'hsl(71, 94%, 26%)',
          900: 'hsl(71, 94%, 15%)',
        },
        'dark-moss': {
          DEFAULT: 'hsl(92, 91%, 8%)',        // #254E06
          50: 'hsl(92, 91%, 95%)',
          100: 'hsl(92, 91%, 85%)',
          500: 'hsl(92, 91%, 8%)',
          900: 'hsl(92, 91%, 5%)',
        },

        // System colors using agricultural palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
