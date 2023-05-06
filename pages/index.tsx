import React, { useRef, useEffect, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next'
import Head from "next/head"
import Image from "next/image"
import Link from 'next/link'
import Container from "@/components/container"
import Layout from "@/components/layout"
import Links from '@/components/links'
import { getDataForHome } from "@/lib/api"
import Header from '@/components/header'
import Logo from '../public/images/logo.svg'
import cn from 'classnames'
import { format } from 'date-fns'
import it from 'date-fns/locale/it'
import {LongArticle, ShortArticle, Editoriale, Articolo} from '../models'
import { GraphCMSImageLoader } from '../helpers/utils'
import styled from 'styled-components'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { FaChevronRight } from 'react-icons/fa'
import Share from '@/components/share';
import { NextSeo } from "next-seo"


interface HomeData {
  fondo: Editoriale;
  apertura: LongArticle;
  spalla: ShortArticle;
  seconda_apertura?: ShortArticle;
  contornati: ShortArticle[];
  civette: ShortArticle[];
  grida: ShortArticle[];
}

interface Data {
  preview: boolean;
  data: HomeData;
}

const getImage = (article: Pick<Articolo | Editoriale, 'immagine' | 'categorie'>, alt: string, width: number, height: number) => {
  let img = article.immagine;
  if (img) {
    return (
      <Image
        loader={GraphCMSImageLoader}
        src={img.url}
        alt={alt}
        className="object-cover"
        fill
        sizes="100vw" />
    );
  }
  if (article.categorie.length) {
    const mainCat = article.categorie[0];
    img = mainCat.image;
    if (img) {
      return (
        <Image
          loader={GraphCMSImageLoader}
          src={img.url}
          alt={alt}
          className="object-cover"
          fill
          sizes="100vw" />
      );
    }
  }

  return (
    <div className="inline-block bg-gray-800">
      <Logo className="h-12 w-[5.33rem] lg:h-20" />
    </div>
  )
}

type WelcomeProps = Pick<HomeData, 'apertura'>
function Welcome({ apertura }: WelcomeProps) {
  const image = apertura.immagine?.url ?? apertura.categorie[0].image.url;
  const url = `/${apertura.categorie[0].slug}/${apertura.slug}`
  const data = format(new Date(apertura.data), 'dd MMMM yyyy', { locale: it })

  return (
    <section className="w-full welcome">
      <div className="relative bg-center bg-no-repeat bg-cover z-1 h-[580px] before:bg-black/50 before:absolute before:-z-1 before:top-0 before:left-0 before:w-full before:h-full" style={{backgroundImage: `url(${image})`}}>
        <div className="absolute z-10 post-content top-10 left-14">
          <div className="inline-block px-2 py-1 mb-4 text-xs tracking-widest text-white uppercase bg-red-600 tags">
            {apertura.categorie[0].nome}
          </div>
          <h3>
            <Link href={url} passHref={true} className="mb-4 text-3xl text-white hover:text-red-500" style={{fontFamily: 'PT Serif, serif'}}>
              {apertura.titolo}
            </Link>
          </h3>
          <div className="inline-block text-sm italic text-white date hover:text-red-500">{data}</div>
        </div>
      </div>
    </section>
  )
}

type ContornatiProps = Pick<HomeData, 'contornati'>;
function Contornati({contornati}: ContornatiProps) {
  return (
    <div className="sidebar-area">
      <div className="ultimi-articoli">
        <h5 className="pb-5 mb-8 text-lg text-gray-600 uppercase border-b border-gray-500 border-solid">
          Articoli principali
        </h5>
        <div className='grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-1 lg:grid-cols-1 lg:gap-0'>
        {contornati.map(civ => {
          const url = `/${civ.categorie[0].slug}/${civ.slug}`
          return (
            <Link href={url} key={civ.slug} passHref={true} className="relative block h-64 mb-8 articoli z-1">
              {getImage(civ, `Immagine - ${civ.slug}`, 400, 400)}
              <div className="absolute top-0 left-0 z-10 w-full h-8 bg-black/50">
                <p className="absolute top-0 left-0 w-1/2 h-8 mb-0 text-xs leading-8 text-center text-white uppercase bg-red-600">{civ.categorie[0].nome}</p>
              </div>
              <div className="absolute bottom-0 left-0 flex items-end w-full p-5 bg-center bg-cover min-h-fit heading z-1 before:absolute before:w-full before:h-full before:-z-1 before:top-0 before:left-0 bg-gradient-to-b from-black/50 to-black">
                <h5 className="mb-0 text-lg font-normal text-white">{civ.titolo}</h5>
              </div>
            </Link>
          )
        })}
        </div>
      </div>
      <div className="links">
        <Links />
      </div>
    </div>
  )
}

type CivetteProps = Pick<HomeData, 'civette'>
function Civette({civette}:  CivetteProps) {
  return (
    <div className="altri-articoli-area">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {civette.map((civ, idx) => {
            const url = `/${civ.categorie[0].slug}/${civ.slug}`
            const data = format(new Date(civ.data), 'dd MMMM yyyy', { locale: it });
            return (
              <Link key={civ.slug} href={url} passHref={true} className={cn('block', 'm-4', 'border-t', 'border-gray-500', 'border-solid', { 'border-t-0': idx < 3 })}>
                {idx < 3 && (<div className="relative h-56 mb-4">
                  {getImage(civ, `Immagine - ${civ.titolo}`, 350, 214)}
                </div>)}
                <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold leading-4 tracking-tight text-white uppercase bg-red-600">{civ.categorie[0].nome}</span>
                <h5 className="leading-5 text-gray-800">{civ.titolo}</h5>
                <span className="text-sm italic text-gray-400">{data}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

type GridaProps = Pick<HomeData, 'grida'>
function Grida({ grida }: GridaProps) {
  return (
    <div className="sidebar-area">
      <div className="ultimi-articoli">
        <h5 className="pb-5 mb-8 text-lg text-gray-600 uppercase border-b border-gray-500 border-solid">
          In evidenza
        </h5>
        {grida.map(civ => {
          const url = `/${civ.categorie[0].slug}/${civ.slug}`
          return (
            <Link href={url} key={civ.slug} passHref={true} className="relative block h-64 mb-8 articoli z-1">
              {getImage(civ, `Immagine - ${civ.slug}`, 400, 400)}
              <div className="absolute top-0 left-0 z-10 w-full h-8 bg-black/50">
                <p className="absolute top-0 left-0 w-1/2 h-8 mb-0 text-xs leading-8 text-center text-white uppercase bg-red-600">{civ.categorie[0].nome}</p>
              </div>
              <div className="absolute bottom-0 left-0 flex items-end h-24 p-5 bg-center bg-cover heading z-1 before:absolute before:w-full before:h-full before:-z-1 before:top-0 before:left-0 bg-gradient-to-b from-black/50 to-black">
                <h5 className="mb-0 text-lg font-normal text-white">{civ.titolo}</h5>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

type MainContentData = Pick<HomeData, 'fondo' | 'seconda_apertura' | 'contornati' | 'civette' | 'grida'>
function MainContentWrapper({fondo, seconda_apertura, contornati, civette, grida}: MainContentData) {
  const data = format(new Date(fondo.data), 'dd MMMM yyyy', { locale: it });
  const data_sec = seconda_apertura ? format(new Date(seconda_apertura.data), 'dd MMMM yyyy', { locale: it }) : ''

  return (
    <section className="py-24 main-content-wrapper">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex flex-wrap pb-1 -mx-4 border-b border-gray-500">
          <div className="order-2 w-full px-4 md:w-3/12 md:order-1 md:border-r md:border-gray-500">
            <Grida grida={grida} />
          </div>
          <div className="order-1 w-full px-4 lg:w-6/12 md:w-9/12 md:order-2">
            <div className="pb-2 border-b border-gray-500 fondo">
              <div className="tag">
                <Link href={`/${fondo.categorie[0].slug}`} passHref={true} className="inline-block px-3 py-1 mb-4 text-sm font-bold leading-4 tracking-tighter text-white uppercase bg-red-600">
                  {fondo.categorie[0].nome}
                </Link>
              </div>
              <h2 className="mb-4 font-serif text-6xl font-normal">{fondo.titolo}</h2>
              <p className="block mb-0 text-lg italic font-light leading-5 text-gray-500">{data}</p>
              <div className="relative my-12 thumbnail h-[420px]">
                {getImage(fondo, `Immagine - ${fondo.titolo}`, 300, 200)}
              </div>
              <div className="text-lg font-light leading-6 text-gray-700 line-clamp-5">
                <RichText content={fondo.contenuto.raw} />
              </div>
              <div className="items-center justify-between mt-8 continue-reading sm:flex">
                <div className="continue-btn">
                  <Link href={`/editoriali/${fondo.slug}`} passHref={true} className="flex items-center px-5 leading-10 text-gray-800 uppercase border border-gray-800 border-solid h-14">
                    Continua a leggere
                    <FaChevronRight aria-hidden="true" className="inline-block w-4 h-4 ml-4" />
                  </Link>
                </div>
                <Share shareUrl={`/editoriali/${fondo.slug}`} media={fondo.immagine?.url ?? ''} />
              </div>
            </div>
            {seconda_apertura && (
              <div className="pt-12 pb-12 seconda_apertura">
                <div className="tag">
                  <Link href={`/${seconda_apertura.categorie[0].slug}`} passHref={true} className="inline-block px-3 py-1 mb-4 text-sm font-bold leading-4 tracking-tighter text-white uppercase bg-red-600">
                    {seconda_apertura.categorie[0].nome}
                  </Link>
                </div>
                <h2 className="mb-4 font-serif text-6xl font-normal">{seconda_apertura.titolo}</h2>
                <p className="block mb-0 text-lg italic font-light leading-5 text-gray-500">{data_sec}</p>
                <div className="relative my-12 thumbnail h-[420px]">
                  {getImage(fondo, `Immagine - ${seconda_apertura.titolo}`, 300, 200)}
                </div>
                <div className="text-lg font-light leading-6 text-gray-700 line-clamp-5">
                  <p>{seconda_apertura.sommario}</p>
                </div>
                <div className="items-center justify-between mt-8 continue-reading sm:flex">
                  <div className="continue-btn">
                    <Link href={`/${seconda_apertura.categorie[0].slug}/${seconda_apertura.slug}`} passHref className="flex items-center px-5 leading-10 text-gray-800 uppercase border border-gray-800 border-solid h-14">
                      Continua a leggere
                      <FaChevronRight aria-hidden="true" className="inline-block w-4 h-4 ml-4" />
                    </Link>
                  </div>
                  <Share shareUrl={`/${seconda_apertura.categorie[0].slug}/${seconda_apertura.slug}`}
                    media={seconda_apertura.immagine.url} />
                </div>
              </div>
            )}
          </div>
          <div className="order-3 w-full px-4 lg:w-3/12 lg:border-l lg:border-gray-500">
            <Contornati contornati={contornati} />
          </div>
        </div>
      </div>
      <Civette civette={civette} />
    </section>
  )
}

const Home: NextPage<Data> = ({ preview, data }) => {

  const [date, setDate] = useState('');

  useEffect(() => {
    const date = format(new Date(), 'dd MMMM yyyy HH:mm:ss', { locale: it })
    setDate(date);
  }, [])

  const url = typeof window !== 'undefined' ? new URL('/', window.location.origin).toString() : '/'
  const imageUrl = typeof window !== 'undefined' ? new URL('/images/collettivamente.jpg', window.location.origin).toString() : '/collettivamente.jpg';

  return (
    <>
      <Layout preview={false}>
        <Head>
          <title>SocialMente</title>
        </Head>
        <NextSeo
          title="SocialMente"
          description="Blog SocialMente. Uno scambio di opinioni"
          openGraph={{
            url,
            title: "SocialMente",
            description: "Blog SocialMente. Uno scambio di opinioni",
            images: [
              {
                url: imageUrl,
                width: 400,
                height: 98,
                alt: "Socialmente",
                type: "image/jpeg"
              }
            ]
          }}
        />
        <Header />
        <Container>
          <Welcome apertura={data.apertura} />
          <MainContentWrapper fondo={data.fondo} seconda_apertura={data.seconda_apertura} contornati={data.contornati} civette={data.civette} grida={data.grida} />
        </Container>
      </Layout>
    </>
  )
}

const getStaticProps: GetStaticProps<{  preview: boolean | null }> = async ({ preview = null }) => {
  const data = (await getDataForHome<HomeData>()) || []
  return {
    props: { data, preview }
  }
}

export { getStaticProps }

export default Home

const Anchor = styled.a`
  color: ${props => props.color}
`;
