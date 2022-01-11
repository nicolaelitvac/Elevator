import Link from 'next/link'
import Container from './container'

export default function Header() {
  return (
    <header className='site__header'>
      <Container>
        <h2 className="site__logo">
          <Link href="/">
            <a className="site__logo__link">Elevator</a>
          </Link>
        </h2>
      </Container>
    </header>
  )
}
