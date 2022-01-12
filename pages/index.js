import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import Elevator from '../components/elevator/elevator'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Marvia's Elevator</title>
      </Head>

      <Container>
        <Elevator floors="5" />
      </Container>
    </Layout>
  )
}
