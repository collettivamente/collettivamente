import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { getArticoliId, getArticolo } from '@/lib/api'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Container from '@/components/container'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Articolo } from 'models'
import { RichText } from '@graphcms/rich-text-react-renderer'
import Link from 'next/link'
import styled from 'styled-components'
import { GraphCMSImageLoader } from '@/helpers/utils'
import { NextSeo } from 'next-seo'


interface Data {
  preview: boolean | null,
  articolo: Articolo
}

const PostPage: NextPage<Data> = ({ preview, articolo }) => {
  const dt = format(articolo ? new Date(articolo.data) : new Date(), 'dd MMMM yyyy', { locale: it })
  const url = typeof window !== 'undefined' ? window.location.href : articolo ? `/${articolo.categorie[0].slug}/${articolo.slug}` : ''

  return (
    <>
      <Layout preview={!!preview}>
        <Head>
          <title>Collettivamente</title>
        </Head>
        <Header />
        {articolo && <NextSeo
          title={articolo.titolo}
          description={articolo.sommario}
          openGraph={{
            url,
            title: articolo.titolo,
            description: articolo.sommario,
            images: [
              {
                url: articolo.immagine.url,
                width: 1600,
                height: 900,
                alt: articolo.titolo,
                type: "image/jpeg"
              }
            ]
          }}
        />}
        <Container>
          <section className="block -mx-5 single-article">
            {articolo && (
              <>
                <div className="relative w-full bg-center bg-no-repeat bg-cover title h-80 z-1 before:bg-black before:bg-opacity-70 before:absolute before:-z-1 before:top-0 before:left-0 before:w-full before:h-full" style={{backgroundImage: `url(${articolo.categorie[0].image.url})`}}>
                  <div className="container flex flex-wrap items-end h-full max-w-6xl mx-auto">
                    <div className="pb-4">
                      <div className="tag">
                        <Link href={`/${articolo.categorie[0].slug}`}>
                          <a className="inline-block px-3 py-1 mb-4 text-sm font-bold leading-none text-white uppercase bg-red-600">{articolo.categorie[0].nome}</a>
                        </Link>
                      </div>
                      <h2 className="font-serif text-6xl font-normal leading-tight text-white">{articolo.titolo}</h2>
                      <p className="mb-4 text-base italic font-normal leading-loose text-white">{dt}</p>
                    </div>
                  </div>
                </div>
                <div className="container max-w-6xl mx-auto italic">
                  di {articolo.autori.map(aut => aut.nome).join(', ')}
                </div>
                <div className="article-content">
                  <div className="container max-w-6xl mx-auto">
                    <div className="flex flex-col items-center">
                      <Paragraph className="w-full pt-16 prose md:w-8/12 text-[color:#9f9f9f] text-base leading-[1.9] font-normal">
                        <RichText content={articolo.contenuto.raw.children.slice(0, 3)} />
                      </Paragraph>
                      {articolo.immagine && (
                        <div className="relative object-contain w-full my-8">
                          <Image loader={GraphCMSImageLoader} src={articolo.immagine.url} alt={`Immagine - ${articolo.titolo}`} layout="responsive" width={400} height={225} sizes="50vw" />
                        </div>
                      )}
                      {articolo.contenuto.raw.children.length > 3 && (
                        <div className="w-full mt-5 pb-16 prose md:w-8/12 text-[color:#9f9f9f] text-base leading-[1.9] font-normal">
                          <RichText content={articolo.contenuto.raw.children.slice(3)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </Container>
      </Layout>
    </>
  )
}

const Paragraph = styled.div`
  ::first-letter {
    font-size: 4rem;
    font-family: serif;
    line-height: 1;
  }
`;

const getStaticProps: GetStaticProps = async ({ preview = null, params }) => {
  const slug = params?.slug ? (typeof params.slug === 'string' ? params.slug : params.slug[0]) : undefined
  if (!slug) {
    throw new Error('Invalid data')
  }

  const articolo = await getArticolo(slug)

  return {
    props: { preview, articolo }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const data = await getArticoliId()
  const paths = data.map(art => ({
    params: { slug: art.slug, category: art.categorie[0].slug }
  }))

  return { paths, fallback: true }
}

export { getStaticProps, getStaticPaths }

export default PostPage