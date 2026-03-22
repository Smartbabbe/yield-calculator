import { useState, useMemo } from 'react'

const PROTOCOLS = [
  { name: 'Aave',         token: 'USDC',  apy: 5.2,  risk: 'Low',    color: '#B6509E' },
  { name: 'Compound',     token: 'USDC',  apy: 4.8,  risk: 'Low',    color: '#00D395' },
  { name: 'Yearn Finance',token: 'USDC',  apy: 8.4,  risk: 'Medium', color: '#006AE3' },
  { name: 'Curve Finance',token: '3pool', apy: 6.1,  risk: 'Low',    color: '#AA1C1C' },
  { name: 'Convex',       token: 'cvxCRV',apy: 14.7, risk: 'Medium', color: '#FF6B6B' },
  { name: 'Lido',         token: 'stETH', apy: 3.8,  risk: 'Low',    color: '#00A3FF' },
  { name: 'Pendle',       token: 'PT-USDC',apy: 11.2,risk: 'Medium', color: '#5B21B6' },
  { name: 'Custom',       token: '—',     apy: 10,   risk: 'Custom', color: '#F59E0B' },
]

const FREQ = [
  { label: 'Daily',    value: 365  },
  { label: 'Weekly',   value: 52   },
  { label: 'Monthly',  value: 12   },
  { label: 'Yearly',   value: 1    },
]

const RISK_COLOR: Record<string, string> = {
  Low:    'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High:   'bg-rose-100 text-rose-700',
  Custom: 'bg-violet-100 text-violet-700',
}

const fmt = (n: number) => n >= 1e6
  ? `$${(n/1e6).toFixed(2)}M`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function calcCompound(principal: number, apy: number, years: number, freq: number) {
  const r = apy / 100 / freq
  return principal * Math.pow(1 + r, freq * years)
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const w = 280, h = 80
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(' ')
  const fill = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(' ') + ` ${w},${h} 0,${h}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#chartFill)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function App() {
  const [principal, setPrincipal] = useState(10000)
  const [years,     setYears]     = useState(3)
  const [freq,      setFreq]      = useState(365)
  const [selProto,  setSelProto]  = useState(0)
  const [customApy, setCustomApy] = useState(10)
  const [compare,   setCompare]   = useState(false)

  const proto = PROTOCOLS[selProto]
  const apy = selProto === PROTOCOLS.length - 1 ? customApy : proto.apy

  const result = calcCompound(principal, apy, years, freq)
  const profit = result - principal
  const roi    = (profit / principal) * 100

  // Year-by-year data for chart
  const chartData = useMemo(() => {
    return Array.from({ length: years * 12 + 1 }, (_, i) => calcCompound(principal, apy, i/12, freq))
  }, [principal, apy, years, freq])

  // Simple (no compound) comparison
  const simpleResult = principal + (principal * apy/100 * years)

  // Compare all protocols
  const comparison = PROTOCOLS.slice(0, -1).map(p => ({
    ...p,
    result: calcCompound(principal, p.apy, years, freq),
    profit: calcCompound(principal, p.apy, years, freq) - principal,
  })).sort((a, b) => b.result - a.result)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'); * { font-family: 'Plus Jakarta Sans', sans-serif; } .font-mono { font-family: 'JetBrains Mono', monospace; }`}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-base">⚡</span>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-lg leading-none">YieldForge</p>
            <p className="text-gray-400 text-[10px] tracking-widest uppercase">DeFi Yield Calculator</p>
          </div>
        </div>
        <button
          onClick={() => setCompare(!compare)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${compare ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Compare Protocols
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT — Inputs */}
          <div className="space-y-5">
            {/* Protocol selector */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="font-semibold text-gray-700 text-sm mb-4">Select Protocol</p>
              <div className="space-y-2">
                {PROTOCOLS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setSelProto(i)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all text-left ${selProto === i ? 'border-violet-200 bg-violet-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <div>
                        <p className={`font-semibold text-sm ${selProto === i ? 'text-violet-700' : 'text-gray-800'}`}>{p.name}</p>
                        <p className="text-gray-400 text-[10px]">{p.token}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold font-mono text-sm ${selProto === i ? 'text-violet-700' : 'text-gray-700'}`}>{p.apy}%</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${RISK_COLOR[p.risk]}`}>{p.risk}</span>
                    </div>
                  </button>
                ))}
              </div>
              {selProto === PROTOCOLS.length - 1 && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom APY %</label>
                  <input type="number" value={customApy} onChange={e => setCustomApy(Number(e.target.value))} min="0" max="10000" step="0.1"
                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-violet-400" />
                </div>
              )}
            </div>

            {/* Principal */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Principal ($)</label>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} min="0" step="100"
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-lg font-mono font-semibold focus:outline-none focus:border-violet-400" />
              <div className="flex gap-2 mt-2 flex-wrap">
                {[1000,5000,10000,50000,100000].map(v => (
                  <button key={v} onClick={() => setPrincipal(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${principal === v ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    ${v >= 1000 ? `${v/1000}K` : v}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Duration: {years} {years === 1 ? 'year' : 'years'}</label>
              <input type="range" min="1" max="10" value={years} onChange={e => setYears(Number(e.target.value))}
                className="w-full accent-violet-600" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1y</span><span>5y</span><span>10y</span>
              </div>
            </div>

            {/* Compound frequency */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Compound Frequency</p>
              <div className="grid grid-cols-2 gap-2">
                {FREQ.map(f => (
                  <button key={f.label} onClick={() => setFreq(f.value)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${freq === f.value ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-2 space-y-5">
            {/* Main result */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total value after {years} {years===1?'year':'years'}</p>
                  <p className="font-extrabold text-gray-900 font-mono" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{fmt(result)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-2xl font-mono ${roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>+{roi.toFixed(1)}%</p>
                  <p className="text-gray-400 text-xs">Total ROI</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Principal</p>
                  <p className="font-bold font-mono text-gray-800">{fmt(principal)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs text-emerald-600 mb-1">Yield Earned</p>
                  <p className="font-bold font-mono text-emerald-700">{fmt(profit)}</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-3">
                  <p className="text-xs text-violet-600 mb-1">vs Simple APY</p>
                  <p className="font-bold font-mono text-violet-700">+{fmt(result - simpleResult)}</p>
                </div>
              </div>
              {/* Chart */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Growth Projection</p>
                <MiniChart data={chartData} color={proto.color} />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Now</span>
                  <span>{Math.floor(years/2)}y</span>
                  <span>{years}y</span>
                </div>
              </div>
            </div>

            {/* Yearly breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="font-semibold text-gray-700 text-sm mb-4">Year-by-Year Breakdown</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Year</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Balance</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Yield</th>
                      <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.min(years, 10) }, (_, i) => {
                      const y = i + 1
                      const bal = calcCompound(principal, apy, y, freq)
                      const yld = bal - principal
                      const r   = (yld / principal) * 100
                      return (
                        <tr key={y} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2.5 text-gray-700 font-medium">Year {y}</td>
                          <td className="py-2.5 text-right font-mono font-semibold text-gray-800">{fmt(bal)}</td>
                          <td className="py-2.5 text-right font-mono text-emerald-600">+{fmt(yld)}</td>
                          <td className="py-2.5 text-right font-mono text-violet-600">+{r.toFixed(1)}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Protocol comparison */}
            {compare && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="font-semibold text-gray-700 text-sm mb-4">Protocol Comparison ({years}y at ${principal.toLocaleString()})</p>
                <div className="space-y-3">
                  {comparison.map((p, i) => {
                    const maxProfit = comparison[0].profit
                    const width = (p.profit / maxProfit) * 100
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                            <span className="text-sm font-medium text-gray-700">{p.name}</span>
                            <span className="font-mono text-xs text-gray-400">{p.apy}% APY</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-semibold text-gray-800 text-sm">{fmt(p.result)}</span>
                            <span className="font-mono text-xs text-emerald-600 ml-2">+{fmt(p.profit)}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${width}%`, background: p.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
