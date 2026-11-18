import { useEffect, useState } from 'react'
import { experimentHref, experiments } from './experiments'
import Login from './Login'
import History from './History'
import { sampleHistory } from './historyData'
import './App.css'

const filters = ['All experiments', 'Mechanics', 'Materials', 'Waves', 'Electricity']
const library = '#/'
const reference = '#/reference'
const login = '#/login'
const history = '#/history'
const emptyHistory = '#/history?empty=1'
const getRoute = () => window.location.hash || library

function Sidebar({ route }) {
  const links = [
    [library, '⊞', 'Experiment library'],
    [reference, '◫', 'Equation reference'],
    [login, '→', 'Log in'],
    [history, '◷', 'History'],
    ...experiments.slice(0, 3).map(({ id, title }, index) => [experimentHref(id), ['↔', '◷', '↕'][index], title]),
  ]
  return (
    <aside className="sidebar">
      <a className="brand" href={library}>
        <span className="brand-icon" aria-hidden="true">ϕ</span>
        <span><strong>Physics lab</strong><small>A notebook for discovery</small></span>
      </a>
      <nav aria-label="Main navigation">
        {links.map(([href, icon, label], index) => (
          <div key={href}>
            {index === 4 && <p className="workbench">Your workbench</p>}
            <a href={href} aria-current={route === href ? 'page' : undefined}><span aria-hidden="true">{icon}</span>{label}</a>
          </div>
        ))}
      </nav>
      <section className="sidebar-note">
        <span aria-hidden="true">♧</span>
        <h2>Start with a question.</h2>
        <p>Change one variable. Watch what happens. Connect the result to an equation.</p>
      </section>
      <p className="sidebar-caption">SI units · Idealized models<br />Made for curious minds.</p>
    </aside>
  )
}

function Diagram({ experiment }) {
  const { path, blue, dot } = experiment
  return (
    <div className={blue ? 'diagram blue' : 'diagram'}>
      <svg aria-hidden="true" viewBox="0 0 186 78" fill="none" stroke="currentColor"
        strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
        {dot && <circle cx={dot[0]} cy={dot[1]} r={dot[2]} fill="currentColor" stroke="none" />}
      </svg>
    </div>
  )
}

function ExperimentCard({ experiment }) {
  return (
    <article className="card">
      <Diagram experiment={experiment} />
      <div className="card-body">
        <div className="card-meta">
          <span className={experiment.blue ? 'tag blue' : 'tag'}>{experiment.tag}</span>
          <span className="formula">{experiment.formula}</span>
        </div>
        <h3>{experiment.title}</h3>
        <p>{experiment.description}</p>
        <a href={experimentHref(experiment.id)} aria-label={`Open experiment: ${experiment.title}`}>
          Open experiment <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

function Library() {
  const [filter, setFilter] = useState(filters[0])
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const visible = experiments.filter((item) =>
    (filter === filters[0] || item.category === filter) &&
    [item.title, item.tag, item.formula, item.description].some((value) => value.toLowerCase().includes(term)),
  )
  return (
    <>
      <section className="intro">
        <div>
          <p className="eyebrow">The open notebook / Experiment library</p>
          <h1>Physics equations<br />and simulations</h1>
          <p className="intro-copy">A quiet space to make sense of the physical world. Choose an experiment, adjust the variables, and see the mathematics take shape.</p>
        </div>
        <aside className="first-experiment">
          <h2><span aria-hidden="true">✎</span> Your first experiment</h2>
          <ol>
            <li>Choose a question to explore</li>
            <li>Change one variable at a time</li>
            <li>Read the graph. Find the pattern.</li>
          </ol>
        </aside>
      </section>
      <section aria-labelledby="lab-title">
        <div className="section-heading">
          <div><h2 id="lab-title">Explore the lab</h2><span aria-live="polite">{visible.length} {visible.length === 1 ? 'experiment' : 'experiments'}</span></div>
          <label className="search">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search experiments or equations" aria-label="Search experiments or equations" />
          </label>
        </div>
        <div className="filters" role="group" aria-label="Filter experiments">
          {filters.map((option) => <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
        </div>
        {visible.length > 0
          ? <div className="card-grid">{visible.map((experiment) => <ExperimentCard key={experiment.id} experiment={experiment} />)}</div>
          : <p className="empty">No matching experiments.</p>}
      </section>
      <section className="reference-banner">
        <span aria-hidden="true">∑</span>
        <div><h2>Keep the equations close.</h2><p>A readable reference for the symbols, SI units and relationships behind every experiment.</p></div>
        <a href={reference}>→ &nbsp; Browse equation reference</a>
      </section>
    </>
  )
}

function Destination({ route, experiment, title }) {
  return (
    <section className="destination">
      <a className="back" href={library}>← Back to experiment library</a>
      <h1>{title}</h1>
      {experiment && (
        <article className="card detail">
          <Diagram experiment={experiment} />
          <div className="card-body">
            <p className="formula">{experiment.formula}</p>
            <p>{experiment.description}</p>
            <p className="detail-status">Interactive simulation coming soon.</p>
          </div>
        </article>
      )}
      {route === reference && (
        <ul className="equations">
          {experiments.map(({ id, title, formula }) => (
            <li key={id}><a href={experimentHref(id)}>{title}</a><span className="formula">{formula}</span></li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const isEmptyHistory = route === emptyHistory
  const isHistory = route === history || isEmptyHistory
  const experiment = experiments.find(({ id }) => experimentHref(id) === route)
  const title = route === library ? 'Experiment library'
    : route === reference ? 'Equation reference'
    : route === login ? 'Log in'
    : isHistory ? 'History'
    : experiment?.title ?? 'Page not found'

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = `${title} · Physics lab`
  }, [title])

  return (
    <div className="workspace">
      <Sidebar route={isHistory ? history : route} />
      <div className="main-column">
        <header className="topbar">
          <nav aria-label="Breadcrumb"><a href={library}>Physics lab</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
          <p className="workspace-mode"><span aria-hidden="true">☼</span> Light workspace</p>
        </header>
        <main className="page">
          {route === library ? <Library />
            : route === login ? <Login libraryHref={library} />
            : isHistory ? <History libraryHref={library} entries={isEmptyHistory ? [] : sampleHistory}
              previewLink={{
                href: isEmptyHistory ? history : emptyHistory,
                label: isEmptyHistory ? 'Show sample entries' : 'Preview empty history',
              }} />
            : <Destination route={route} experiment={experiment} title={title} />}
        </main>
        <footer><span>Physics lab / Learn by changing things.</span><span>Educational models · Results rounded to 3 significant figures</span></footer>
      </div>
    </div>
  )
}
