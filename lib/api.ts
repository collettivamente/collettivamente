import { GraphQLClient, gql } from 'graphql-request'
import { RequestDocument } from 'graphql-request/dist/types'
import { Category, Post, SiteLink } from 'pages/models'

const client = new GraphQLClient(
  'https://api-eu-central-1.graphcms.com/v2/cku6pd4q82e8z01zea81d82ex/master'
)

async function  fetchAPI<T, TVars>(query: RequestDocument, variables?: TVars) {
  const res = await client.request<T, TVars>(
    query,
    variables,
  )
  return res;
}

export async function getDataForHome<T>() {
  type Response = { homepages: { posts: Post[], editoriali: Post[] }[], posts: Post[], categorie: Category[] }
  const resp = await fetchAPI<Response, undefined>(gql`
    fragment categoriaFields on Categoria {
      nome
      colore {
        hex
      }
      image {
        url
      }
      slug
    }
    fragment articoloFields on Articolo {
      slug
      occhiello
      titolo
      catenaccio
      sommario
      data
      immagine {
        url
      }
      categorie(first: 1) {
        ...categoriaFields
      }
      autori {
        nome
      }
    }
    query Home {
      homepages(orderBy: updatedAt_DESC, first: 1) {
        fondo {
          slug
          titolo
          data
          autori {
            nome
          }
          contenuto {
            raw
          }
          categorie {
            ...categoriaFields
          }
        }
        apertura {
          ...articoloFields
          contenuto {
            raw
          }
        }
        spalla {
          ...articoloFields
          contenuto {
            raw
          }
        }
        seconda_apertura {
          ...articoloFields
          sommario
        }
        contornati {
          ...articoloFields
        }
        civette {
          ...articoloFields
        }
      }
    }
  `)
  const hp = resp.homepages[0];
  return hp;
}

export async function getAllPostsForHome<T>() {
  type Response = { homepages: { posts: Post[], editoriali: Post[] }[], posts: Post[], categorie: Category[] }
  const resp = await fetchAPI<Response, undefined>(gql`
    query Home {
      homepages {
        posts(first: 6) {
          titolo
          slug
          cover {
            url
            width
            height
          }
          categorie {
            image {
              url
            }
          }
        }
        editoriali(first: 1) {
          titolo
          slug
        }
      }
      posts(orderBy: data_DESC, first: 6) {
        titolo
        slug
        data
        autori {
          nome
          image {
            height
            width
            url
          }          
        }
        categorie {
          nome
          colore {
            hex
          }
        }
      }
      categorie {
        nome
        slug
        colore {
          hex
        }
        image {
          url
        }
      }
    }
  `)
  const hp = resp.homepages[0];
  return { home: hp, posts: resp.posts, categorie: resp.categorie };
}

export async function getAllPostsByCategory<T>(category: string, start: number = 0) {
  type Params = {
    start: number,
    where: Record<string, any>
  }
  const where: Record<string, any> = {}
  if (category) {
    where.slug = category.toLowerCase()
  }
  type Response = { categorie: { posts: T[] }[] }
  const resp = await fetchAPI<Response, Params>(`
    query Posts($where: CategoriaWhereInput!, $start: Int!) {
      categorie(where: $where) {
        nome
        posts(skip: $start, first: 12) {
          titolo
          slug
          data
          cover {
            id
          }
          autori {
            nome
            image {
              id
            }
          }
          categorie {
            nome,
            colore {
              hex
            }
          }
        }
      }
    }
  `, {
    start,
    where
  })
  
  const posts = resp.categorie[0].posts
  return { posts }
}

export async function getAllPosts<T>(start: number = 0) {
  type Params = {
    start: number
  }
  type Response = { posts: T[] }
  const resp = await fetchAPI<Response, Params>(`
    query AllPosts($start: Int!) {
      posts(skip: $start, first: 12) {
        titolo
        excerpt
        slug
        data
        cover {
          width
          height
          url
        }
        autori {
          nome
          image {
            url
          }
        }
        categorie {
          nome
          colore {
            hex
          }
        }
      }
    }
  `, {
    start
  })
 return resp;
}

export async function getPost<T>(slug: string) {
  type Response = { post: T }
  const resp = await fetchAPI<Response, { slug: string }>(`
    query Post($slug: String!) {
      post(where: { slug: $slug }) {
        titolo
        cover {
          id
        }
        autori {
          nome
          image {
            id
          }
        }
        data
        categorie {
          nome
        }
        body {
          json
        }
      }
    }
  `, {
    slug
  })
  const { post } = resp
  return post
}

export async function getPostsId<T>() {
  type Response = { posts: T[] }
  const resp = await fetchAPI<Response, undefined>(`
    query PostId {
      posts {
        slug
      }
    }
  `)
  const { posts } = resp
  return posts
}

export async function getLinks() {
  type Response = { links: SiteLink[] }
  const resp = await fetchAPI<Response, undefined>(`
    query AllLinks {
      links {
        nome
        url
        image {
          url
        }
      }
    }
  `)
  const { links } = resp
  return links
}

export async function getCategories() {
  type Response = { categorie: Pick<Category, 'nome' | 'slug'>[] };
  const resp = await fetchAPI<Response, undefined>(gql`
    query SiteMenu {
      categorie(where: { padre: null }) {
        nome
        slug
      }
    }
  `)
  const { categorie } = resp
  return categorie
}
