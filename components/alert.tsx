import Link from 'next/link'
import Container from "./container";
import cn from 'classnames'

const Alert: React.FC<{ preview: boolean }> = ({ preview }) => (
  <div className={cn('border-b', {
    'bg-accent-7 border-accent-7 text-white': preview,
    'bg-accent-1 border-accent-2': !preview
  })}>
    <Container>
      <div className="py-2 text-sm text-center">
        {preview ? (
          <>
            This page is a preview. {' '}
            <Link href="/api/exit-preview" className="underline transition-colors duration-200 hover:text-cyan">
              Click here
            </Link>{' '}
            to exit preview
          </>
        ) : (
          <>
            The source code for this blog is here
          </>
        )}
      </div>
    </Container>
  </div>
)

export default Alert
