import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Image from "next/image"
import { getArticoliId, getArticolo, getCategories, getEditoriale, getEditorialiId } from '@/lib/api'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Container from '@/components/container'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Articolo, Editoriale, Post } from 'models'
import { RichText } from '@graphcms/rich-text-react-renderer'
import Link from 'next/link'
import styled from 'styled-components'
import { GraphCMSImageLoader } from 'helpers/utils'
import { NextSeo } from 'next-seo'


interface Data {
  preview: boolean | null,
  editoriale: Editoriale
}

const PostPage: NextPage<Data> = ({ preview, editoriale }) => {
  const dt = format(editoriale ? new Date(editoriale.data) : new Date(), 'dd MMMM yyyy', { locale: it })
  const mainCategory = editoriale.categorie[0]

  return <>
    <Layout preview={!!preview}>
      <Head>
        <title>SocialMente</title>
      </Head>
      <Header />
      <Container>
        <section className="block -mx-5 single-article">
          {editoriale && (
            <>
              <div className="relative w-full bg-center bg-no-repeat bg-cover title h-80 z-1 before:bg-black before:bg-opacity-70 before:absolute before:-z-1 before:top-0 before:left-0 before:w-full before:h-full" style={{backgroundImage: `url(${editoriale.categorie[0].image.url})`}}>
                <div className="container flex flex-wrap items-end h-full max-w-6xl mx-auto">
                  <div className="pb-4">
                    <div className="tag">
                      <Link href={`/${editoriale.categorie[0].slug}`} className="inline-block px-3 py-1 mb-4 text-sm font-bold leading-none text-white uppercase bg-red-600">{editoriale.categorie[0].nome}</Link>
                    </div>
                    <h2 className="font-serif text-6xl font-normal leading-tight text-white">{editoriale.titolo}</h2>
                    <p className="mb-4 text-base italic font-normal leading-loose text-white">{dt}</p>
                  </div>
                </div>
              </div>
              <div className="article-content">
                <div className="container max-w-6xl mx-auto">
                  <div className="flex flex-col items-center">
                    <Paragraph className="w-full pt-16 prose md:w-8/12 text-[color:#9f9f9f] text-base leading-[1.9] font-normal">
                      <RichText content={editoriale.contenuto.raw.children.slice(0, 3)} />
                    </Paragraph>
                    {editoriale.immagine && (
                      <div className="relative object-contain w-full my-8">
                        <Image
                          loader={GraphCMSImageLoader}
                          src={editoriale.immagine.url}
                          alt={`Immagine - ${editoriale.titolo}`}
                          width={400}
                          height={225}
                          sizes="50vw"
                          style={{
                            width: "100%",
                            height: "auto"
                          }} />
                      </div>
                    )}
                    {editoriale.contenuto.raw.children.length > 3 && (
                      <div className="w-full mt-5 pb-16 prose md:w-8/12 text-[color:#9f9f9f] text-base leading-[1.9] font-normal">
                        <RichText content={editoriale.contenuto.raw.children.slice(3)} />
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
    <NextSeo
      title={editoriale.titolo}
      description={'Editoriale ' + editoriale.titolo + ' di ' + editoriale.autori.map(au => au.nome).join(', ')}
      openGraph={{
        title: editoriale.titolo,
        description: 'Editoriale ' + editoriale.titolo + ' di ' + editoriale.autori.map(au => au.nome).join(', '),
        url: '/editoriali/' + editoriale.slug,
        images: editoriale.immagine ? [
          {
            url: editoriale.immagine.url,
            width: editoriale.immagine.width,
            height: editoriale.immagine.height,
            alt: 'Immagine - ' + editoriale.titolo,
            type: editoriale.immagine.mimeType
          }
        ] : mainCategory ? [
          {
            url: mainCategory.image.url,
            width: mainCategory.image.width,
            height: mainCategory.image.height,
            alt: 'Immagine - ' + editoriale.titolo,
            type: mainCategory.image.mimeType
          }
        ] : []
      }}
    />
  </>;
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

  const editoriale = await getEditoriale(slug)

  return {
    props: { preview, editoriale }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const data = await getEditorialiId()
  const paths = data.map(art => ({
    params: { slug: art.slug }
  }))

  return { paths, fallback: true }
}

export { getStaticProps, getStaticPaths }

export default PostPage