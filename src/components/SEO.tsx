// src/components/SEO.tsx
import { Helmet } from "react-helmet";

const SEO = () => {
  return (
    <Helmet>
      <title>Dua Garments | Premium Pakistani Clothing</title>
      <meta
        name="description"
        content="Shop elegant Pakistani clothing for men, women, and kids. High-quality fabrics, local delivery, and trusted service across Pakistan."
      />
      <meta
        name="keywords"
        content="Dua Garments, Pakistani suits, shalwar kameez, men's fashion, women's clothing, kids wear, online shopping Pakistan"
      />
      <meta name="author" content="Dua Garments" />

      {/* Open Graph (Facebook, LinkedIn preview) */}
      <meta property="og:title" content="Dua Garments | Premium Clothing Store" />
      <meta
        property="og:description"
        content="Discover stylish men's and women's wear. Cash on delivery, Easy return policy."
      />
      <meta property="og:url" content="https://dua-garment.vercel.app/" />
      <meta
        property="og:image"
        content="https://i.postimg.cc/q7ymyLyT/Chat-GPT-Image-Jul-10-2025-05-36-30-PM.png"
      />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Dua Garments" />
      <meta
        name="twitter:description"
        content="Premium clothing for all. Shop now!"
      />
      <meta
        name="twitter:image"
        content="https://i.postimg.cc/q7ymyLyT/Chat-GPT-Image-Jul-10-2025-05-36-30-PM.png"
      />
    </Helmet>
  );
};

export default SEO;
