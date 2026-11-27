import { useState, useEffect, useRef } from 'react'

export default function OhmsLaw() {
    const [V, setV] = useState(12)
    const [R, setR] = useState(100)
    const canvasRef = useRef(null)

    const I = (V / R * 1000).toFixed(2)
    const P = (V * V / R * 1000).toFixed(2)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        ctx.clearRect(0, 0, W, H)

        const cx = W / 2, cy = H / 2
        const r = 70

        // Circuit rectangle
        const left = cx - r, right = cx + r, top = cy - r * 0.7, bottom = cy + r * 0.7

        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(left, top); ctx.lineTo(right, top)
        ctx.lineTo(right, bottom); ctx.lineTo(left, bottom)
        ctx.lineTo(left, top)
        ctx.stroke()

        // Battery (left side, middle)
        const batY = cy
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ;[-6, -2, 2, 6].forEach((offset, i) => {
            ctx.beginPath()
            const len = i % 2 === 0 ? 10 : 16
            ctx.moveTo(left - len / 2, batY + offset * 1.5)
            ctx.lineTo(left + len / 2, batY + offset * 1.5)
            ctx.stroke()
        })
        ctx.fillStyle = '#2563eb'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${V}V`, left, batY + 28)

        // Resistor (top side, middle)
        const resX = cx, resY = top
        const rw = 36, rh = 12
        ctx.fillStyle = '#fef3c7'
        ctx.strokeStyle = '#d97706'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(resX - rw / 2, resY - rh / 2, rw, rh, 3)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#92400e'
        ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${R}Ω`, resX, resY + 4)

        // Current arrow (right side)
        const arrowX = right + 18
        const brightness = Math.min(I / 200, 1)
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + brightness * 0.7})`
        ctx.lineWidth = 2 + brightness * 3
        ctx.beginPath()
        ctx.moveTo(arrowX, bottom - 10)
        ctx.lineTo(arrowX, top + 10)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(arrowX, top + 10)
        ctx.lineTo(arrowX - 5, top + 20)
        ctx.lineTo(arrowX + 5, top + 20)
        ctx.fillStyle = '#ef4444'
        ctx.fill()
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`I=${I}mA`, arrowX + 10, cy)

        // Labels
        ctx.fillStyle = '#6b7280'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('P = ' + P + ' mW', cx, bottom + 22)

    }, [V, R, I, P])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>
            <canvas ref={canvasRef} width={260} height={240}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>V = IR</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {[['Current I', `${I} mA`], ['Power P', `${P} mW`]].map(([label, val]) => (
                            <div key={label}>
                                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{label}</p>
                                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#7f1d1d' }}>{val}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Voltage V</span><span style={{ color: '#6b7280' }}>{V} V</span>
                    </label>
                    <input type="range" min="1" max="24" value={V} onChange={e => setV(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>1 V</span><span>24 V</span></div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Resistance R</span><span style={{ color: '#6b7280' }}>{R} Ω</span>
                    </label>
                    <input type="range" min="10" max="1000" step="10" value={R} onChange={e => setR(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>10 Ω</span><span>1000 Ω</span></div>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    The red arrow thickness shows current flow. Higher voltage or lower resistance increases current.
                </div>
            </div>
        </div>
    )
}