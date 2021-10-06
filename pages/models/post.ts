import { Category } from './category'
import { Autore } from './autore'
import { ImageData } from './image'
import { Body } from './generic'

export interface Post {
  titolo: string;
  slug: string;
  excerpt?: string;
  cover: ImageData;
  data: string;
  autori: Autore[];
  categorie: Category[];
  body: Body;
}
