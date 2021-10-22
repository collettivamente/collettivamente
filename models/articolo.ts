import { ImageData } from "./image"
import { Body } from "./generic"
import { Autore } from "./autore"
import { Category } from "./category"

export interface Articolo {
  titolo: string;
  slug: string;
  occhiello?: string;
  sommario?: string;
  catenaccio?: string;
  contenuto: Body;
  data: string;
  immagine: ImageData;
  autori: Autore[];
  categorie: Category[];
}

type BaseHPArticoloKeys = 'slug' | 'occhiello' | 'titolo' | 'catenaccio' | 'categorie' | 'autori' | 'data' | 'immagine';

export type ShortArticle = Pick<Articolo, BaseHPArticoloKeys | 'sommario'>;

export type LongArticle = Pick<Articolo, BaseHPArticoloKeys | 'contenuto'>;