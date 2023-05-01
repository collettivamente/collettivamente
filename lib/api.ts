import { GraphQLClient, gql, RequestDocument, Variables } from 'graphql-request'
import { Articolo, Category, Editoriale, Post, SiteLink } from 'models'

const client = new GraphQLClient(
  'https://api-eu-central-1.graphcms.com/v2/cku6pd4q82e8z01zea81d82ex/master'
)

async function  fetchAPI<T, TVars extends Variables | undefined>(query: RequestDocument, variables?: TVars) {
  const res = await client.request<T>(
    query,
    variables
  )
  return res;
}

export async function getDataForHome<T>() {
  type Response = { homepages: T[] }
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
        grida {
          ...articoloFields
        }
      }
    }
  `)
  const hp = resp.homepages[0];
  return hp;
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

export async function getMenu() {
  type Response = { menus: { categorie: Pick<Category, 'nome' | 'slug'>[] }[] };
  const resp = await fetchAPI<Response, undefined>(gql`
    query SiteMenu {
      menus(first: 1) {
        categorie(where: {
          nome_not: "Editoriali"
        }) {
          nome
          slug
        }
      }
    }
  `)
  const { menus } = resp
  return menus[0].categorie;
}

export async function getCategories() {
  type Response = { categorie: Pick<Category, 'slug'>[] };
  const resp = await fetchAPI<Response, undefined>(gql`
    query Categorie {
      categorie {
        slug
      }
    }
  `)
  const { categorie } = resp
  return categorie;
}

export async function getArticoliByCategory(category: string, start: number = 0) {
  type Params = {
    start: number,
    where: Record<string, any>
  }
  const where: Record<string, any> = {}
  if (category) {
    where.slug = category.toLowerCase()
  }
  type Response = { editoriali: Array<Pick<Editoriale, 'titolo' | 'data' | 'contenuto' | 'immagine' | 'slug' | 'categorie'>>,  categorie: Array<Pick<Category, 'nome' | 'treename'> & { articoli: Pick<Articolo, 'titolo' | 'slug' | 'data' | 'immagine' | 'autori' | 'sommario'>[] }> }
  const resp = await fetchAPI<Response, Params>(`
    query Articoli($where: CategoriaWhereInput!, $start: Int!) {
      editoriali(orderBy: data_DESC, first: 4) {
        titolo
        slug
        data
        contenuto {
          raw
        }
        immagine {
          url
        }
        categorie {
          image {
            url
          }
        }
      }
      categorie(where: $where, first: 1) {
        nome
        treename
        slug
        image {
          url
        }
        articoli(skip: $start, first: 12, orderBy: data_DESC) {
          titolo
          slug
          data
          sommario
          immagine {
            url
          }
          autori {
            nome
          }
        }
      }
    }
  `, {
    start,
    where
  })
  
  const categoria = resp.categorie?.[0]
  return { editoriali: resp.editoriali, categoria }
}

export async function getArticoliId() {
  type Response = { articoli: Array<Pick<Articolo, 'slug' | 'categorie'>> }
  const resp = await fetchAPI<Response, undefined>(gql`
    query ArticoliList {
      articoli {
        slug
        categorie(first: 1) {
          slug
        }
      }
    }
  `);
  return resp.articoli;
}

export async function getArticolo(slug: string) {
  type Params = { slug: string };
  type Response = {articolo: Articolo};
  const resp = await fetchAPI<Response, Params>(gql`
    query GetArticolo($slug: String!) {
      articolo(where: {
        slug: $slug
      }) {
        titolo
        slug
        occhiello
        catenaccio
        data
        contenuto {
          raw
        }
        immagine {
          url
        }
        autori {
          nome
        }
        categorie {
          nome
          image {
            url
          }
        }
      }
    }
  `, { slug });
  return resp.articolo;
}

export async function getEditorialiId() {
  type Response = { editoriali: Array<Pick<Editoriale, 'slug'>> }
  const resp = await fetchAPI<Response, undefined>(gql`
    query EditorialiList {
      editoriali {
        slug
      }
    }
  `);
  return resp.editoriali;
}

export async function getEditoriale(slug: string) {
  type Params = { slug: string };
  type Response = {editoriale: Editoriale};
  const resp = await fetchAPI<Response, Params>(gql`
    query GetEditoriale($slug: String!) {
      editoriale(where: {
        slug: $slug
      }) {
        titolo
        slug
        data
        contenuto {
          raw
        }
        immagine {
          url
        }
        autori {
          nome
        }
        categorie {
          nome
          image {
            url
          }
        }
      }
    }
  `, { slug });
  return resp.editoriale;
}
