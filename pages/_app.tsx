import type { AppProps } from 'next/app'
import { AuthUserProvider } from 'auth';
import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
export default MyApp
