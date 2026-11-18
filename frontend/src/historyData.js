export const sampleHistory = [
  {
    id: 15,
    simulationCode: 'HOOKE',
    parameters: { k: 20, m: 2, x0: 0.5 },
    viewedAt: '2026-11-14T10:30:00',
  },
  {
    id: 14,
    simulationCode: 'PENDULUM',
    parameters: { length: 1.2, angle: 15, g: 9.81 },
    viewedAt: '2026-11-13T14:20:00',
  },
]

export const historySimulationNames = {
  HOOKE: 'Hooke’s law',
  PENDULUM: 'Simple pendulum',
  PROJECTILE: 'Projectile motion',
  OHM: 'Ohm’s law',
}
