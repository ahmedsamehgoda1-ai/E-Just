export const experiments = [
  ['stress-strain', 'Stress & strain', 'Materials', 'σ = Eε', 'Stretch a specimen and discover how stiffness connects stress to strain.', 'Materials', 'M30 40h28m72 0h28m-123-4-5 4 5 4m118-8 5 4-5 4M58 29h72v22H58zM73 24v32m42-32v32M73 61h42'],
  ['simple-pendulum', 'Simple pendulum', 'Oscillations', 'T = 2π√(L/g)', 'Explore how length and gravity set the rhythm of a swinging pendulum.', 'Mechanics', 'M66 16h57m-28 0v47m0-47 24 40M69 56q25 22 50 0M95 32q6 0 9 6', true, [119, 56, 5]],
  ['hookes-law', 'Hooke’s law', 'Forces', 'F = kx', 'Apply a force to a spring and measure its extension from equilibrium.', 'Mechanics', 'M36 24v32m0-16h16l5-8 7 16 6-16 7 16 6-16 7 16 6-16 7 16 5-8h14m0-11h19v22h-19zM141 40h23m-5-3 5 3-5 3'],
  ['projectile-motion', 'Projectile motion', 'Motion', 'y = v₀t sin θ − ½gt²', 'Launch a ball. Compare its trajectory as you vary speed and launch angle.', 'Mechanics', 'M28 18v42h135M34 59Q94-18 154 59M34 59l26-25m-7 2 7-2-2 7', true, [92, 22, 2.5]],
  ['waves-superposition', 'Waves & superposition', 'Waves', 'v = fλ', 'See frequency, wavelength and interference come together on a string.', 'Waves', 'M23 40h142M23 40q18-52 36 0t35 0t35 0t36 0M41 14h71m-70-2v5m69-5v5', true],
  ['ohms-law', 'Ohm’s law', 'Electricity', 'V = IR', 'Build an intuition for voltage, current and resistance in a simple circuit.', 'Electricity', 'M46 35v-9h35l3-5 6 11 5-11 6 11 5-11 4 5h33v33H46V46m-7-11h14m-11 11h8'],
].map(([id, title, tag, formula, description, category, path, blue, dot]) => ({
  id, title, tag, formula, description, category, path, blue, dot,
}))

export const experimentHref = (id) => `#/experiments/${id}`