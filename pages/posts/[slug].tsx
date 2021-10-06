import React from 'react'
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { getPost, getPostsId } from '@/lib/api'
import Layout from '@/components/layout'
import Header from '@/components/header'
import Container from '@/components/container'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import CoverImage from '@/components/cover-image'
import { Post } from 'pages/models'
import { RichText } from '@graphcms/rich-text-react-renderer'


interface Data {
  preview: boolean | null,
  post: Post,
  content: string,
}

const PostPage: NextPage<Data> = ({ preview, post }) => {

  const dt = format(new Date(post.data), 'dd MMMM yyyy HH:mm', { locale: it })

  return (
    <>
      <Layout preview={!!preview}>
        <Head>
          <title>Collettivamente</title>
        </Head>
        <Header />
        <Container>
          <article className="pb-4">
            <div className="p-4 font-serif">
              <h1 className="text-3xl italic font-extrabold">{post.titolo}</h1>
              <span className="block text-sm italic">di {post.autori.map(a => a.nome).join(', ')}</span>
              <span className="block mt-2 text-sm">del {dt}</span>
            </div>
            {post.cover ? <CoverImage slug={post.slug} title={post.titolo} url={post.cover.url} /> : ''}
            <div className="prose">
              <RichText content={post.body.raw} />
            </div>
          </article>
        </Container>
      </Layout>
    </>
  )
}

const getStaticProps: GetStaticProps<{  preview: boolean | null }> = async ({ preview = null, params }) => {
  const slug = params?.slug ? (typeof params.slug === 'string' ? params.slug : params.slug[0]) : undefined
  if (!slug) {
    throw new Error('Invalid data')
  }

  const post = await getPost<Post>(slug)

  return {
    props: { preview, post }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const data = await getPostsId<Pick<Post, 'slug' >>()
  const paths = data.map(post => ({
    params: { slug: post.slug }
  }))

  return { paths, fallback: true }
}

export { getStaticProps, getStaticPaths }

export default PostPage