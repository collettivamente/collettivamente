import type { ElementNode } from "@graphcms/rich-text-types/dist"

export type Color = {
  hex: string;
}

export type Body = {
  raw: {
    children: ElementNode[]
  }
}