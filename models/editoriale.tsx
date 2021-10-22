import { ImageData } from "./image"
import { Body } from "./generic"
import { Autore } from "./autore"
import { Category } from "./category"

export interface Editoriale {
  titolo: string;
  slug: string;
  data: string;
  contenuto: Body;
  immagine?: ImageData;
  autori: Autore[];
  categorie: Category[];
}