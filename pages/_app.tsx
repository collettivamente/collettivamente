import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { AuthContextProvider } from '@/context/AuthContext';
import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: 'website',
          url: 'https://www.socialmenteblog.it/',
          siteName: 'SocialMente'
        }}
      />
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </>
  );
}
export default MyApp
