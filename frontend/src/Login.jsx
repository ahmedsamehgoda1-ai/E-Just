import { useState } from 'react'
import './Login.css'

export default function Login({ libraryHref }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  function handleInput(event) {
    const { name } = event.currentTarget
    setErrors((previous) => ({ ...previous, [name]: undefined }))
    setStatus('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const fields = event.currentTarget.elements
    const email = fields.namedItem('email')
    const password = fields.namedItem('password')
    const nextErrors = {}

    if (!email.value.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (email.validity.typeMismatch) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!password.value.trim()) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      setStatus('')
      fields.namedItem(firstInvalid).focus()
      return
    }

    setStatus('Input checked. Sign-in is not available yet.')
  }

  return (
    <section className="login-page" aria-labelledby="login-title">
      <a className="back" href={libraryHref}>← Back to experiment library</a>
      <h1 id="login-title">Log in</h1>
      <form className="login-form" noValidate onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" autoComplete="username" required
            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'login-email-error' : undefined}
            onChange={handleInput} />
          {errors.email && <p className="login-error" id="login-email-error" role="alert">{errors.email}</p>}
        </div>
        <div className="login-field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required
            aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'login-password-error' : undefined}
            onChange={handleInput} />
          {errors.password && <p className="login-error" id="login-password-error" role="alert">{errors.password}</p>}
        </div>
        <button type="submit">Log in</button>
        <p className="login-status" role="status">{status}</p>
      </form>
    </section>
  )
}
