import React from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './Carousel.module.css'
import Image from 'next/image'
import { useCallback } from 'react'
import classNames from 'classnames'
import { useState } from 'react'
import { useEffect } from 'react'
import { Editoriale, ImageData, Post } from 'models'
import { GraphCMSImageLoader } from 'helpers/utils'
import format from 'date-fns/format'
import { it } from 'date-fns/locale'
import { RichText } from '@graphcms/rich-text-react-renderer'

type Slide = Pick<Editoriale, 'titolo' | 'slug' | 'contenuto' | 'immagine' | 'data' | 'categorie'>;

interface Props {
  slides: Slide[]
}

const Carousel: React.FC<Props> = ({ slides }) => {
  const [viewportRef, embla] = useEmblaCarousel({
    speed: 7
  })

  const [selectedIdx, setSelectedIdx] = useState(0)

  const handleClick = useCallback((idx: number) => {
    embla?.scrollTo(idx, false)
    setSelectedIdx(idx)
  }, [embla])

  useEffect(() => {
    const itrv = setInterval(() => {
      if (embla) {
        const currIdx = embla.selectedScrollSnap()
        const nextIdx = (currIdx + 1) % slides.length
        embla.scrollTo(nextIdx)
        setSelectedIdx(nextIdx)
      }
    }, 7000)

    return () => clearInterval(itrv)
  }, [embla, slides.length])

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={viewportRef}>
        <div className={styles.embla__container}>
          {slides.map((slide, idx) => (
            <div className={`${styles.embla__slide} w-full h-80 flex`} key={slide.slug}>
              <div className="relative w-full h-full md:w-5/12 md:px-4">
                <Image loader={GraphCMSImageLoader} src={slide.immagine?.url ?? slide.categorie[0].image.url} layout="fill" alt={`Immagine - ${slide.titolo}`} />
              </div>
              <div className="w-full md:w-7/12 md:px-4">
                <Link href={`/editoriali`} passHref={true} className='inline-block px-3 py-1 mb-4 text-sm font-bold leading-none text-white uppercase bg-red-600'>
                  editoriali
                </Link>
                <h2 className="block font-serif text-6xl font-normal text-white">
                  <Link href={`/editoriali/${slide.slug}`} passHref={true}>
                    {slide.titolo}
                  </Link>
                </h2>
                <p className="mb-4 italic text-white">{format(new Date(slide.data), 'dd MMMM yyyy', {locale: it})}</p>
                <div className="text-base leading-relaxed text-gray-400 line-clamp-6">
                  <RichText content={slide.contenuto.raw} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-8">
        {Array.from(Array(slides.length)).map((_, idx) => (
          <button key={idx} className={classNames("w-4 h-4 m-1 rounded-full", {'bg-gray-400': selectedIdx !== idx, 'bg-gray-600': selectedIdx === idx})} onClick={() => handleClick(idx)}>
            <span className="sr-only">Click to navigate</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Carousel
