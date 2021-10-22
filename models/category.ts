import { ImageData } from "./image"
import { Color } from "./generic"

export interface Category {
  slug: string;
  nome: string;
  colore: Color;
  image: ImageData;
  treename: string;
}
