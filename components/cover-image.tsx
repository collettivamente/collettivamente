import React from 'react'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { GraphCMSImageLoader } from '@/helpers/utils'

interface Data {
  title: string,
  url: string,
  slug: string
}

const CoverImage: React.FC<Data> = ({ title, url, slug }) => {

  const image = (
    <Image
      loader={GraphCMSImageLoader}
      width={2000}
      height={1000}
      alt={`Cover image for ${title}`}
      src={url}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug
      })}
    />
  )

  return (
    <div className="sm:mx-0">
      <Link href={`/posts/${slug}`}>
        {slug ? <a aria-label={title}>{image}</a> : image}
      </Link>
    </div>
  )
}

export default CoverImage
