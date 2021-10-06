import { getLinks } from "@/lib/api"
import { SiteLink } from "pages/models"
import React, { useState, useEffect } from "react"
import Image from 'next/image'
import { GraphCMSImageLoader } from "pages/helpers/utils"

export default function Links() {
  const [links, setLinks] = useState<SiteLink[]>([]);

  useEffect(() => {
    async function loadLInks() {
      const links = await getLinks();
      setLinks(links);
    }

    loadLInks();
  }, [])

  return (
    <div className="flex flex-col overflow-x-hidden">
      <h5 className="pb-5 mb-8 text-gray-600 uppercase border-b border-gray-500 border-solid">Links</h5>
      {links.map(link => (
        <a href={link.url} target="_blank" rel="noreferrer" key={link.nome} className="flex items-center w-full mb-8">
          <div className="mr-8">
            <Image loader={GraphCMSImageLoader} src={link.image.url} width={70} height={70} alt={`Image - ${link.nome}`} />
          </div>
          <span className="block mb-1 font-serif text-gray-700">{link.nome}</span>
        </a>
      ))}
    </div>
  )
}
