import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="manifest" href="/CoffeeTimer/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/CoffeeTimer/icon-192x192.png" />
        <script src="/CoffeeTimer/register-sw.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 
