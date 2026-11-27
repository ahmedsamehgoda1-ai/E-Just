import { useState, useEffect, useRef } from 'react'

export default function StressStrain() {
    const [E, setE] = useState(200)
    const [strain, setStrain] = useState(0.005)
    const canvasRef = useRef(null)
    const stress = (E * 1e9 * strain / 1e6).toFixed(2)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        ctx.clearRect(0, 0, W, H)

        // Axes
        const ox = 40, oy = H - 40, aw = W - 60, ah = H - 70
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ox, oy - ah)
        ctx.lineTo(ox, oy)
        ctx.lineTo(ox + aw, oy)
        ctx.stroke()

        // Axis labels
        ctx.fillStyle = '#6b7280'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Strain ε', ox + aw / 2, H - 8)
        ctx.save()
        ctx.translate(14, oy - ah / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText('Stress σ (MPa)', 0, 0)
        ctx.restore()

        // Elastic region line
        const maxStrain = 0.015
        const maxStress = E * 1e9 * maxStrain / 1e6
        const scaleX = aw / maxStrain
        const scaleY = ah / (maxStress * 1.3)

        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ox + maxStrain * scaleX, oy - maxStress * scaleY)
        ctx.strokeStyle = '#4a90d9'
        ctx.lineWidth = 2
        ctx.stroke()

        // Yield point
        const yieldStrain = 0.008
        const yieldStress = E * 1e9 * yieldStrain / 1e6
        ctx.beginPath()
        ctx.arc(ox + yieldStrain * scaleX, oy - yieldStress * scaleY, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
        ctx.fillStyle = '#92400e'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('yield point', ox + yieldStrain * scaleX + 8, oy - yieldStress * scaleY + 4)

        // Current point
        const curX = ox + strain * scaleX
        const curY = oy - E * 1e9 * strain / 1e6 * scaleY
        ctx.beginPath()
        ctx.arc(curX, curY, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#ef4444'
        ctx.fill()

        // Dashed lines to axes
        ctx.setLineDash([4, 4])
        ctx.strokeStyle = '#d1d5db'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(curX, curY)
        ctx.lineTo(curX, oy)
        ctx.moveTo(curX, curY)
        ctx.lineTo(ox, curY)
        ctx.stroke()
        ctx.setLineDash([])

        // Tick values
        ctx.fillStyle = '#9ca3af'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(strain.toFixed(3), curX, oy + 14)
        ctx.textAlign = 'right'
        ctx.fillText((E * 1e9 * strain / 1e6).toFixed(0), ox - 4, curY + 4)

    }, [E, strain])

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', padding: '1rem 0' }}>
            <canvas ref={canvasRef} width={300} height={260}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#d97706', fontWeight: 600 }}>σ = Eε</p>
                    <p style={{ margin: '0.4rem 0 0', fontSize: 28, fontWeight: 700, color: '#78350f' }}>{stress} MPa</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: 13, color: '#6b7280' }}>E = {E} GPa · ε = {strain.toFixed(4)}</p>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Young's modulus E</span><span style={{ color: '#6b7280' }}>{E} GPa</span>
                    </label>
                    <input type="range" min="50" max="400" value={E} onChange={e => setE(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>rubber</span><span>steel</span></div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span>Strain ε</span><span style={{ color: '#6b7280' }}>{strain.toFixed(4)}</span>
                    </label>
                    <input type="range" min="0" max="0.014" step="0.0001" value={strain} onChange={e => setStrain(Number(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>0</span><span>0.014</span></div>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                    <strong style={{ color: '#374151' }}>How to read this:</strong><br />
                    The red dot moves along the stress–strain curve. The yellow dot marks the yield point where the material stops behaving elastically.
                </div>
            </div>
        </div>
    )
}