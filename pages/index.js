import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Marvia's Elevator</title>
      </Head>

      <Container>
        <h1 className="title">
          Welcome to The Elevator
        </h1>
      </Container>
    </Layout>
  )
}
