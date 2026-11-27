import { useState, useEffect, useRef } from 'react'

export default function HooksLaw() {
    const [k, setK] = useState(50)
    const [displacement, setDisplacement] = useState(100)
    const canvasRef = useRef(null)

    const force = ((k * displacement) / 100).toFixed(2)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width
        const H = canvas.height
        ctx.clearRect(0, 0, W, H)

        // Ceiling
        ctx.fillStyle = '#888'
        ctx.fillRect(0, 0, W, 18)

        // Spring zigzag
        const cx = W / 2
        const springTop = 18
        const springBottom = 140 + displacement
        const coils = 12
        const coilWidth = 18
        ctx.beginPath()
        ctx.moveTo(cx, springTop)
        for (let i = 0; i <= coils; i++) {
            const y = springTop + ((springBottom - springTop) / coils) * i
            const x = i % 2 === 0 ? cx - coilWidth : cx + coilWidth
            ctx.lineTo(x, y)
        }
        ctx.lineTo(cx, springBottom)
        ctx.strokeStyle = '#4a90d9'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Block
        const bSize = 56
        ctx.fillStyle = '#2563eb'
        ctx.beginPath()
        ctx.roundRect(cx - bSize / 2, springBottom, bSize, bSize, 6)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = '13px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('mass', cx, springBottom + 33)

        // Restoring force arrow (red, pointing up)
        if (displacement > 10) {
            const arrowX = cx + bSize / 2 + 14
            const arrowBaseY = springBottom + bSize / 2
            const arrowTipY = arrowBaseY - displacement * 0.45
            ctx.beginPath()
            ctx.moveTo(arrowX, arrowBaseY)
            ctx.lineTo(arrowX, arrowTipY)
            ctx.strokeStyle = '#ef4444'
            ctx.lineWidth = 2
            ctx.stroke()
            // arrowhead
            ctx.beginPath()
            ctx.moveTo(arrowX, arrowTipY)
            ctx.lineTo(arrowX - 5, arrowTipY + 10)
            ctx.lineTo(arrowX + 5, arrowTipY + 10)
            ctx.fillStyle = '#ef4444'
            ctx.fill()
            // F label
            ctx.fillStyle = '#ef4444'
            ctx.font = 'bold 12px sans-serif'
            ctx.fillText('F', arrowX + 12, (arrowBaseY + arrowTipY) / 2)
        }

        // Equilibrium dashed line
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(20, 140 + 100 + bSize / 2)
        ctx.lineTo(W - 20, 140 + 100 + bSize / 2)
        ctx.strokeStyle = '#aaa'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#aaa'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('equilibrium', 24, 140 + 100 + bSize / 2 - 5)

    }, [k, displacement])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={240}
                height={460}
                style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }}
            />

            {/* Controls + readout */}
            <div style={{ flex: 1, minWidth: 220 }}>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>F = kx</p>
                    <p style={{ margin: '0.4rem 0 0', fontSize: 28, fontWeight: 700, color: '#1e3a8a' }}>{force} N</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: 13, color: '#6b7280' }}>
                        k = {k} N/m &nbsp;·&nbsp; x = {(displacement / 100).toFixed(2)} m
                    </p>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Spring constant k</span>
                        <span style={{ color: '#6b7280' }}>{k} N/m</span>
                    </label>
                    <input
                        type="range" min="5" max="200" value={k}
                        onChange={e => setK(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                        <span>soft</span><span>stiff</span>
                    </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Displacement x</span>
                        <span style={{ color: '#6b7280' }}>{(displacement / 100).toFixed(2)} m</span>
                    </label>
                    <input
                        type="range" min="0" max="200" value={displacement}
                        onChange={e => setDisplacement(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                        <span>0 m</span><span>2.00 m</span>
                    </div>
                </div>

                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    Move the displacement slider to stretch the spring.
                    A stiffer spring (higher k) needs more force for the same stretch.
                    The red arrow shows the restoring force pulling the mass back.
                </div>

            </div>
        </div>
    )
}