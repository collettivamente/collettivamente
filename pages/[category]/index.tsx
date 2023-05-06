import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from "next/image"
import { getArticoliByCategory, getMenu } from '@/lib/api'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Container from '@/components/container'
import Carousel from '@/components/carousel'
import Logo from '../../public/images/logo.svg'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Articolo, Category, Editoriale, Post } from 'models'
import { GraphCMSImageLoader } from '@/helpers/utils'
import styled from 'styled-components'
import { FaChevronRight } from 'react-icons/fa'

type PageData = {
  editoriali: Array<Pick<Editoriale, 'titolo' | 'slug' | 'data' | 'contenuto' | 'immagine' | 'categorie'>>,
  categoria?: Pick<Category, 'nome' | 'slug' | 'treename' | 'image'> & { articoli: Pick<Articolo, 'titolo' | 'data' | 'sommario' | 'slug' | 'immagine' | 'autori'>[] }
}

interface Data {
  preview: boolean | null,
  data: PageData
}

const getImage = (post: Pick<Articolo, 'immagine'>, alt: string) => {
  if (post.immagine) {
    const img = post.immagine

    return <Image loader={GraphCMSImageLoader} src={img.url} alt={alt} fill sizes="100vw" />;
  }

  return (<div className="w-full h-auto p-2 overflow-hidden bg-gray-800">
    <Logo className="w-2/3" />
  </div>)
}

const HomePost: NextPage<Data> = ({ preview, data }) => {
  if (!data) {
    return <div>Loading....</div>
  }
  const baseUrl = (data.categoria?.treename ?? data.categoria?.slug ?? '').replace(';', '/').toLowerCase()
  const date = format(new Date(), 'dd MMMM yyyy', { locale: it })

  return (
    <>
      <Layout preview={!!preview}>
        <Head>
          <title>SocialMente</title>
        </Head>
        <Header />
        <Container>
          <div className="py-12 -mx-5 bg-gray-300 breadcumb_area z-1">
            <div className="flex flex-wrap max-w-6xl mx-auto">
              <div className="flex items-center justify-between w-full breadcumb-content">
                <Link href={`/${baseUrl}`} passHref={true} className="inline-block px-2 py-3 mb-4 text-sm font-bold leading-none text-white uppercase bg-red-600 hover:transition-all hover:outline-none hover:no-underline">{data.categoria?.nome}</Link>
                <p className="mb-0 italic text-gray-800">{date}</p>
              </div>
            </div>
          </div>
          <section className="py-24 -mx-5 bg-accent-7 area-editoriale">
            <div className="max-w-6xl mx-auto">
              <Carousel slides={data.editoriali} />
            </div>
          </section>
          <section className="py-24 area-articoli">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-flow-row grid-cols-1 gap-2 mt-3 sm:grid-cols-2 md:grid-cols-3">
                {data.categoria?.articoli.map(art => {
                  const dt = format(new Date(art.data), 'dd MMMM yyyy', { locale: it })
                  return (
                    <div key={art.slug} className="pb-10 mb-24 border-b border-gray-400 border-solid">
                      <Link href={`/${baseUrl}/${art.slug}`} className="inline-block px-3 py-1 mb-4 text-sm font-bold leading-none text-white uppercase bg-red-600">{data.categoria?.nome}</Link>
                      <h2 className="mb-4 font-serif text-3xl">{art.titolo}</h2>
                      <p className="block text-lg italic font-light leading-relaxed text-gray-600">{dt}</p>
                      <div className="relative object-contain py-7 h-52">
                        {(art.immagine || data.categoria?.image) ? getImage(art.immagine ? art : { immagine: data.categoria!.image }, `Image - ${art.titolo}`) : undefined}
                      </div>
                      <p className="text-lg font-light leading-relaxed text-gray-700 line-clamp-4">{art.sommario}</p>
                      <div className="flex mt-8 actions">
                        <Link href={`/${baseUrl}/${art.slug}`} className="flex items-center px-5 leading-10 text-gray-900 uppercase border border-gray-900 border-solid h-14">
                          Continua a leggere
                          <FaChevronRight className="w-4 h-4 ml-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </Container>
      </Layout>
    </>
  )
}

const getStaticProps: GetStaticProps = async ({ params, preview = null }) => {
  const category = params!.category as string;
  const data = await getArticoliByCategory(category, 0);
  return {
    props: { preview, data }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const data = await getMenu()
  const paths = data.map(cat => ({
    params: { category: cat.slug }
  }))

  return { paths, fallback: true }
}

export { getStaticProps, getStaticPaths }

export default HomePost

const ColoredSpan = styled.span`
  color: ${props => props.color}
`;
