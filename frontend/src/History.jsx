import { historySimulationNames } from './historyData'
import './History.css'

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })

function HistoryEntry({ entry }) {
  const { simulationCode, parameters, viewedAt } = entry
  const name = Object.hasOwn(historySimulationNames, simulationCode)
    ? historySimulationNames[simulationCode]
    : simulationCode
  const date = new Date(viewedAt)
  const values = Object.entries(parameters)

  return (
    <li className="history-card">
      <div className="history-entry-heading">
        <h2>{name}</h2>
        <time dateTime={viewedAt}>{Number.isNaN(date.getTime()) ? viewedAt : dateFormat.format(date)}</time>
      </div>
      <h3>Input parameters</h3>
      {values.length > 0 ? (
        <dl className="history-parameters">
          {values.map(([key, value]) => (
            <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      ) : <p>No parameters recorded.</p>}
    </li>
  )
}

export default function History({ libraryHref, entries, previewLink }) {
  return (
    <section className="history-page" aria-labelledby="history-title">
      <a className="back" href={libraryHref}>← Back to experiment library</a>
      <h1 id="history-title">History</h1>
      {previewLink && (
        <div className="history-preview">
          <span>Sample preview</span>
          <a href={previewLink.href}>{previewLink.label}</a>
        </div>
      )}
      {entries.length > 0 ? (
        <ol className="history-list" aria-label="Recent simulations, newest first">
          {entries.map((entry) => <HistoryEntry key={entry.id} entry={entry} />)}
        </ol>
      ) : (
        <div className="history-card">
          <h2>No simulation history yet</h2>
          <p>Visit the experiment library to find a simulation.</p>
          <a className="back" href={libraryHref}>Explore experiments →</a>
        </div>
      )}
    </section>
  )
}
