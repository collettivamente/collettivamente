import React from 'react'
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getAllPostsByCategory } from '@/lib/api'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Container from '@/components/container'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useEffect } from 'react'
import Logo from '../../public/images/logo.svg'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Post } from 'pages/models'
import { GraphCMSImageLoader } from 'pages/helpers/utils'
import styled from 'styled-components'

interface Data {
  preview: boolean | null,
}

const getImage = (post: Post, alt: string) => {
  if (post.cover) {
    const img = post.cover

    return <Image loader={GraphCMSImageLoader} src={img.url} alt={alt} width={800} height={450} />
  }

  return (<div className="w-full h-auto p-2 overflow-hidden bg-gray-800">
    <Logo className="w-2/3" />
  </div>)
}

const HomePost: NextPage<Data> = ({ preview }) => {

  const router = useRouter()
  const { query: { cat, start } } = router

  const [data, setData] = useState<Post[]>([])

  useEffect(() => {
    const getData = async () => {
      const st = start ? (typeof start === 'string' ? start : start[0]) : '0'
      const s = parseInt(st, 10)
      const category = cat ? (typeof cat === 'string' ? cat : cat[0]) : undefined
      
      const {posts} = category 
        ? (await getAllPostsByCategory<Post>(category, s))
        : (await getAllPosts<Post>(s))
      setData(posts)
    }
    if (router.isReady) {
      getData()
    }
  }, [router, cat, preview, start])

  return (
    <>
      <Layout preview={!!preview}>
        <Head>
          <title>Collettivamente</title>
        </Head>
        <Header />
        <Container>
          <div className="grid grid-flow-row grid-cols-1 gap-2 mt-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {data.map(post => {
              const dt = format(new Date(post.data), 'dd MMM yyyy HH:mm', { locale: it })
              return (
                <Link key={post.slug} href={`/posts/${post.slug}`}>
                  <a className="flex flex-col border border-t-4 border-b-4 border-red-500 rounded shadow-md">
                    <h3 className="block p-2 overflow-x-hidden font-semibold uppercase overflow-ellipsis whitespace-nowrap">{post.titolo}</h3>
                    {getImage(post, `Image - ${post.titolo}`)}
                    <p className="ml-4 text-gray-900">{post.excerpt}</p>
                    <div className="flex items-end justify-between flex-grow p-1 text-sm italic">
                      <span>{post.autori.map(a => a.nome).join(', ')}</span>
                      <span className="text-gray-900">{dt}</span>
                    </div>
                    <div className="p-1">
                      {post.categorie.map(cat => (
                          <ColoredSpan key={cat.nome} className='p-1 mr-1 text-sm font-bold text-white uppercase' color={cat.colore.hex}>{cat.nome}</ColoredSpan>
                        )
                      )}
                    </div>
                  </a>
                </Link> 
              )
            })}
          </div>
        </Container>
      </Layout>
    </>
  )
}

const getStaticProps: GetStaticProps<{  preview: boolean | null }> = async ({ preview = null }) => {
  return {
    props: { preview }
  }
}

export { getStaticProps }

export default HomePost

const ColoredSpan = styled.span`
  color: ${props => props.color}
`;
