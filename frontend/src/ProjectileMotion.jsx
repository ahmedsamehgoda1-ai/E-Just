import { useState, useEffect, useRef } from 'react'

export default function ProjectileMotion() {
    const [v0, setV0] = useState(20)
    const [angle, setAngle] = useState(45)
    const canvasRef = useRef(null)

    const rad = angle * Math.PI / 180
    const g = 9.81
    const tFlight = (2 * v0 * Math.sin(rad) / g).toFixed(2)
    const range = (v0 ** 2 * Math.sin(2 * rad) / g).toFixed(2)
    const maxH = (v0 ** 2 * Math.sin(rad) ** 2 / (2 * g)).toFixed(2)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        ctx.clearRect(0, 0, W, H)

        const ox = 30, oy = H - 35
        const r = v0 ** 2 * Math.sin(2 * rad) / g
        const h = v0 ** 2 * Math.sin(rad) ** 2 / (2 * g)
        const scaleX = (W - 60) / Math.max(r, 1)
        const scaleY = (H - 60) / Math.max(h * 1.2, 1)

        // Axes
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ox, oy - (H - 60))
        ctx.lineTo(ox, oy)
        ctx.lineTo(ox + (W - 60), oy)
        ctx.stroke()

        // Labels
        ctx.fillStyle = '#6b7280'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Horizontal distance (m)', ox + (W - 60) / 2, H - 8)
        ctx.save()
        ctx.translate(13, oy - (H - 60) / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText('Height (m)', 0, 0)
        ctx.restore()

        // Trajectory
        ctx.beginPath()
        const steps = 100
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * (2 * v0 * Math.sin(rad) / g)
            const x = ox + v0 * Math.cos(rad) * t * scaleX
            const y = oy - (v0 * Math.sin(rad) * t - 0.5 * g * t ** 2) * scaleY
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Peak dot
        const tPeak = v0 * Math.sin(rad) / g
        const peakX = ox + v0 * Math.cos(rad) * tPeak * scaleX
        const peakY = oy - h * scaleY
        ctx.beginPath()
        ctx.arc(peakX, peakY, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
        ctx.fillStyle = '#92400e'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`H=${maxH}m`, peakX + 7, peakY - 4)

        // Launch arrow
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        const arrowLen = 32
        ctx.lineTo(ox + Math.cos(rad) * arrowLen, oy - Math.sin(rad) * arrowLen)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()

        // Landing dot
        ctx.beginPath()
        ctx.arc(ox + r * scaleX, oy, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#10b981'
        ctx.fill()
        ctx.fillStyle = '#065f46'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`R=${range}m`, ox + r * scaleX, oy + 18)

    }, [v0, angle, rad, range, maxH])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>
            <canvas ref={canvasRef} width={300} height={240}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>y = v₀t sinθ − ½gt²</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {[['Range', `${range} m`], ['Max height', `${maxH} m`], ['Flight time', `${tFlight} s`]].map(([label, val]) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{label}</p>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e3a8a' }}>{val}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Initial speed v₀</span><span style={{ color: '#6b7280' }}>{v0} m/s</span>
                    </label>
                    <input type="range" min="5" max="50" value={v0} onChange={e => setV0(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>5 m/s</span><span>50 m/s</span></div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Launch angle θ</span><span style={{ color: '#6b7280' }}>{angle}°</span>
                    </label>
                    <input type="range" min="5" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>5°</span><span>85°</span></div>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    45° gives maximum range. The yellow dot marks peak height. Green dot is the landing point.
                </div>
            </div>
        </div>
    )
}