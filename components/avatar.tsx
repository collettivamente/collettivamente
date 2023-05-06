import React from 'react'
import Image from "next/image"

interface Picture {
  url: string
}


const Avatar: React.FC<{ name: string, picture: Picture | Picture[] }> = ({ name, picture }) => {
  const url = Array.isArray(picture) ? picture[0].url : picture.url

  return (
    <div className="flex items-center">
      <div className="w-12 h-12 relative mr-4">
        <Image
          src={`${url.startsWith('/') ? process.env.NEXT_PUBLIC_STRAPI_URL : ''}${url}`}
          className="rounded-full"
          alt={name}
          fill
          sizes="100vw" />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}

export default Avatar