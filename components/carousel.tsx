import React from 'react'
import Link from 'next/link'
import CoverImage from './cover-image'
import { useEmblaCarousel } from 'embla-carousel/react'
import styles from './Carousel.module.css'
import Logo from '../public/images/logo.svg'
import { useCallback } from 'react'
import classNames from 'classnames'
import { useState } from 'react'
import { useEffect } from 'react'
import { ImageData, Post } from 'pages/models'

type Slide = Pick<Post, 'titolo' | 'slug' | 'excerpt' | 'cover' | 'categorie'>;

interface Props {
  slides: Slide[]
}

const getImage = (slide: Slide) => {
  let img = slide.cover
  if (img) {
    return (
      <CoverImage title={slide.titolo} url={img.url} slug={slide.slug} />
    )
  }

  if (slide.categorie.length) {
    const mainCat = slide.categorie[0];
    img = mainCat.image;
    if (img) {
      return (
        <CoverImage title={slide.titolo} url={img.url} slug={slide.slug} />
      )
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-800">
      <Logo className="absolute top-0 left-0 w-4/12 h-auto" />
    </div>
  )
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
            <Link href={`/posts/${slide.slug}`} key={slide.slug} passHref={true}>
              <a className={`${styles.embla__slide} w-full h-80`} title="Vai al post">
                {getImage(slide)}
                <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gray-800 bg-opacity-75">
                  <h3 className="text-3xl font-bold">{slide.titolo}</h3>
                  <span className="text-sm font-medium">{slide.excerpt}</span>
                </div>
              </a>
            </Link>
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
