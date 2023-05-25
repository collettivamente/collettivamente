import { FacebookIcon, FacebookShareButton, FacebookShareCount, TwitterIcon, TwitterShareButton } from "react-share"


export default function Share({ shareUrl, media }: { shareUrl: string, media: string }) {
  const url = typeof window !== 'undefined' ? new URL(shareUrl, window.location.href).toString() : shareUrl;
  
  return (
    <div className="text-gray-300 share">
      <FacebookShareButton url={url}>
        <FacebookIcon round size="2em" bgStyle={{ fill: 'transparent' }} iconFillColor="currentColor" />
      </FacebookShareButton>
      <FacebookShareCount url={url} />
      <TwitterShareButton url={url}>
        <TwitterIcon round size="2em" bgStyle={{ fill: 'transparent' }} iconFillColor="currentColor" />
      </TwitterShareButton>
    </div>
  )
}