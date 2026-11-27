import { useState, useEffect, useRef } from 'react'

export default function WavesSuperposition() {
    const [f1, setF1] = useState(1)
    const [f2, setF2] = useState(2)
    const [A1, setA1] = useState(1)
    const [A2, setA2] = useState(1)
    const canvasRef = useRef(null)
    const animRef = useRef(null)
    const tRef = useRef(0)

    const v = 10
    const lambda1 = (v / f1).toFixed(2)
    const lambda2 = (v / f2).toFixed(2)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height

        function draw() {
            tRef.current += 0.025
            ctx.clearRect(0, 0, W, H)

            const midY1 = H * 0.22
            const midY2 = H * 0.55
            const midY3 = H * 0.85
            const amp = 28
            const points1 = [], points2 = [], points3 = []

            for (let x = 0; x < W; x++) {
                const xVal = (x / W) * 4 * Math.PI
                const y1 = A1 * Math.sin(f1 * xVal - tRef.current)
                const y2 = A2 * Math.sin(f2 * xVal - tRef.current * 1.3)
                points1.push([x, midY1 - y1 * amp])
                points2.push([x, midY2 - y2 * amp])
                points3.push([x, midY3 - (y1 + y2) * amp * 0.6])
            }

            const draw_wave = (points, color, label, labelY) => {
                ctx.beginPath()
                points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
                ctx.strokeStyle = color
                ctx.lineWidth = 2
                ctx.stroke()
                ctx.fillStyle = color
                ctx.font = '11px sans-serif'
                ctx.textAlign = 'left'
                ctx.fillText(label, 6, labelY)
            }

            draw_wave(points1, '#3b82f6', `Wave 1: f=${f1}Hz λ=${lambda1}m`, midY1 - amp - 8)
            draw_wave(points2, '#10b981', `Wave 2: f=${f2}Hz λ=${lambda2}m`, midY2 - amp - 8)
            draw_wave(points3, '#ef4444', 'Superposition', midY3 - amp * 0.6 - 8)

            // Dividers
            ctx.strokeStyle = '#e5e7eb'
            ctx.lineWidth = 1
            ctx.setLineDash([4, 4])
            ;[H * 0.37, H * 0.69].forEach(y => {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
            })
            ctx.setLineDash([])

            animRef.current = requestAnimationFrame(draw)
        }

        animRef.current = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(animRef.current)
    }, [f1, f2, A1, A2, lambda1, lambda2])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>
            <canvas ref={canvasRef} width={300} height={300}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#fdf2f8', border: '1px solid #f0abfc', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#a21caf', fontWeight: 600 }}>v = fλ</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: 13, color: '#6b7280' }}>Wave 1: λ = {lambda1} m &nbsp;·&nbsp; Wave 2: λ = {lambda2} m</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: 12, color: '#9ca3af' }}>v = {v} m/s (fixed)</p>
                </div>
                {[
                    ['Wave 1 frequency', f1, setF1, '1 Hz', '5 Hz'],
                    ['Wave 1 amplitude', A1, setA1, 'small', 'large'],
                    ['Wave 2 frequency', f2, setF2, '1 Hz', '5 Hz'],
                    ['Wave 2 amplitude', A2, setA2, 'small', 'large'],
                ].map(([label, val, setter, lo, hi], i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                            <span>{label}</span><span style={{ color: '#6b7280' }}>{val}</span>
                        </label>
                        <input type="range" min="1" max="5" step="0.5" value={val} onChange={e => setter(Number(e.target.value))} style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>{lo}</span><span>{hi}</span></div>
                    </div>
                ))}
                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    The red wave is the sum of blue and green. When frequencies match, you see a standing wave pattern.
                </div>
            </div>
        </div>
    )
}