/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Safelist all color variants for dynamic theme support
    {
      pattern: /bg-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /ring-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /shadow-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /from-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /to-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /hover:bg-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /hover:text-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /focus:ring-(orange|blue|green|purple|red|pink|indigo|teal|amber|emerald|cyan|violet|fuchsia|rose|lime|sky)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
