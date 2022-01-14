export default function Card({ children, title, className }) {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h5 className="card-title">{ title }</h5>
        {children}
      </div>
    </div>
  )
  return <div className="container"></div>
}
