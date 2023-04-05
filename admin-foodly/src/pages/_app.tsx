import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from '@/utils/create-emotion-cache.util';
import { theme } from '@/styles/theme';
import { DisplayServerError } from '@/components/utility/DisplayServerError';
import { Layout } from '@/layout/Layout';

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { error } = pageProps;

  if (error) {
    return (
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DisplayServerError
            code={error.code}
            message={error.message}
          />
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;