import { GetStaticProps, NextPage } from "next"
import Layout from "@/components/layout"
import Head from "next/head"
import Header from "@/components/header"
import Container from "@/components/container"
import { useAuth } from '@/context/AuthContext'

interface Data {
  preview: boolean;
}

const Profile: NextPage<Data> = (({ preview }) => {
  const { user } = useAuth()
  return (
    <Layout preview={!!preview}>
      <Head>
        <title>Profilo utente</title>
      </Head>
      <Header />
      <Container>
        <section className="flex flex-col w-full h-full">
          <div>{user?.uid}</div>
          <div>{user?.email}</div>
          <div>{user?.name}</div>
        </section>
      </Container>
    </Layout>
  )
});

const getStaticProps: GetStaticProps = ({ preview = null}) => {
  return {
    props: {
      preview
    }
  }
}

export { getStaticProps };

export default Profile;
