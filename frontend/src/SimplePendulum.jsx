import { useState, useEffect, useRef } from 'react'

export default function SimplePendulum() {
    const [L, setL] = useState(1.0)
    const [g, setG] = useState(9.81)
    const canvasRef = useRef(null)
    const animRef = useRef(null)
    const angleRef = useRef(Math.PI / 6)
    const omegaRef = useRef(0)
    const lastTimeRef = useRef(null)

    const period = (2 * Math.PI * Math.sqrt(L / g)).toFixed(3)

    useEffect(() => {
        angleRef.current = Math.PI / 6
        omegaRef.current = 0
        lastTimeRef.current = null
    }, [L, g])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        const pivotX = W / 2, pivotY = 30
        const scale = 120

        function draw(time) {
            if (lastTimeRef.current !== null) {
                const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
                const alpha = -(g / L) * Math.sin(angleRef.current)
                omegaRef.current += alpha * dt
                omegaRef.current *= 0.9995
                angleRef.current += omegaRef.current * dt
            }
            lastTimeRef.current = time

            ctx.clearRect(0, 0, W, H)

            // Ceiling
            ctx.fillStyle = '#888'
            ctx.fillRect(0, 0, W, 18)

            const bobX = pivotX + Math.sin(angleRef.current) * L * scale
            const bobY = pivotY + Math.cos(angleRef.current) * L * scale

            // Arc path
            ctx.beginPath()
            ctx.arc(pivotX, pivotY, L * scale, Math.PI / 2 - Math.PI / 5, Math.PI / 2 + Math.PI / 5)
            ctx.strokeStyle = '#d1d5db'
            ctx.lineWidth = 1
            ctx.setLineDash([4, 4])
            ctx.stroke()
            ctx.setLineDash([])

            // Equilibrium line
            ctx.beginPath()
            ctx.moveTo(pivotX, pivotY)
            ctx.lineTo(pivotX, pivotY + L * scale)
            ctx.strokeStyle = '#e5e7eb'
            ctx.lineWidth = 1
            ctx.stroke()

            // Rod
            ctx.beginPath()
            ctx.moveTo(pivotX, pivotY)
            ctx.lineTo(bobX, bobY)
            ctx.strokeStyle = '#6b7280'
            ctx.lineWidth = 2
            ctx.stroke()

            // Bob
            ctx.beginPath()
            ctx.arc(bobX, bobY, 14, 0, Math.PI * 2)
            ctx.fillStyle = '#2563eb'
            ctx.fill()

            // Angle label
            ctx.fillStyle = '#6b7280'
            ctx.font = '12px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(`θ = ${(angleRef.current * 180 / Math.PI).toFixed(1)}°`, pivotX + 55, pivotY + 30)

            animRef.current = requestAnimationFrame(draw)
        }

        animRef.current = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(animRef.current)
    }, [L, g])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>
            <canvas ref={canvasRef} width={240} height={320}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>T = 2π√(L/g)</p>
                    <p style={{ margin: '0.4rem 0 0', fontSize: 28, fontWeight: 700, color: '#14532d' }}>{period} s</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: 13, color: '#6b7280' }}>L = {L.toFixed(2)} m · g = {g} m/s²</p>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Length L</span><span style={{ color: '#6b7280' }}>{L.toFixed(2)} m</span>
                    </label>
                    <input type="range" min="0.1" max="2.5" step="0.05" value={L} onChange={e => setL(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>0.1 m</span><span>2.5 m</span></div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Gravity g</span><span style={{ color: '#6b7280' }}>{g} m/s²</span>
                    </label>
                    <input type="range" min="1" max="25" step="0.1" value={g} onChange={e => setG(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>Moon 1.6</span><span>Jupiter 25</span></div>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    The pendulum swings in real time. A longer rod or weaker gravity slows the period. Mass does not affect T.
                </div>
            </div>
        </div>
    )
}