import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { AuthContextProvider } from 'context/AuthContext';
import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthContextProvider>
      <DefaultSeo
        openGraph={{
          type: 'website',
          url: 'https://www.socialmenteblog.it/',
          siteName: 'SocialMente'
        }}
      />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
export default MyApp
