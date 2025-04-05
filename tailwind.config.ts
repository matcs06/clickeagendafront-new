import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import scrollbar from 'tailwind-scrollbar'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [scrollbar, animate],
}

export default config
