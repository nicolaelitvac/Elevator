import Meta from '../components/meta'
import Header from '../components/header'
import Footer from '../components/footer'


export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <div className='site'>
        <Header />
        <main className='site__main'>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
