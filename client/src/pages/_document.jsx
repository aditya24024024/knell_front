import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <meta name='impact-site-verification' value='23365d28-d285-4877-8e2c-c2ff11e5f723'></meta>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
