export function GraphCMSImageLoader({ src, width }: { src: string, width: number }) {
  const relativeSrc = (src: string) => src.split('/').pop();

  return `https://media.graphcms.com/resize=width:${width}/${relativeSrc(src)}`;
}
