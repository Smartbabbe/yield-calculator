# YieldForge — DeFi Yield Calculator

An interactive DeFi yield farming calculator that models compound returns across major protocols. Compare strategies across Aave, Compound, Yearn, Curve, and more — with a growth projection chart, year-by-year breakdown, and multi-protocol comparison mode.

**🔗 Live Demo:** https://yield-calculator-tau.vercel.app/

---

## Features

- **Protocol selector** — choose from 7 pre-loaded protocols (Aave, Compound, Yearn, Curve, Convex, Lido, Pendle) or enter a custom APY
- **Compound frequency** — model daily, weekly, monthly, or yearly compounding
- **Growth projection chart** — SVG chart showing your balance growing over the selected period
- **Year-by-year breakdown** — table showing balance, yield earned, and ROI for each year
- **vs Simple APY** — shows exactly how much extra you earn from compounding vs simple interest
- **Protocol comparison mode** — toggle to see all 7 protocols side by side with bar charts
- **Quick amount presets** — $1K, $5K, $10K, $50K, $100K one-click shortcuts
- **Duration slider** — drag to set investment period from 1 to 10 years
- **Risk badges** — each protocol labelled Low / Medium / High risk

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Vite | Build tool |

> All yield data is static/illustrative — not financial advice. APY values are approximate based on historical averages.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/yield-calculator.git
cd yield-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## Project Structure

```
yield-calculator/
├── src/
│   ├── App.tsx       # Full app — protocol data, compound logic, chart, comparison
│   ├── main.tsx      # React entry point
│   └── index.css     # Tailwind base styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## How the Maths Works

Compound interest formula used:

```
A = P × (1 + r/n)^(n×t)
```

Where:
- `A` = final amount
- `P` = principal
- `r` = annual interest rate (APY as decimal)
- `n` = compounding frequency per year
- `t` = time in years

---

## Disclaimer

This tool is for educational and illustrative purposes only. APY rates shown are approximate historical averages and do not guarantee future returns. DeFi carries significant risk including smart contract vulnerabilities, liquidation risk, and impermanent loss. Always do your own research.

---

## Built By

**Esther Okon** — Web3 Developer, DeFi Educator & Community Builder  
🌐 Portfolio: https://personal-portfolio-site-ten-rouge.vercel.app/  
🐦 Twitter: [@thesmarrtEsther](https://twitter.com/thesmarrtEsther)
