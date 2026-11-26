import { useEffect } from 'react';
import { BRAND_CONFIG } from '../../config/brand';

export function SEOHead({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | ${BRAND_CONFIG.name}` 
      : `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`;
    document.title = fullTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', description || BRAND_CONFIG.subTagline);
    }

    // OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description || BRAND_CONFIG.subTagline);

    if (image) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute('content', image);
    }
  }, [title, description, image]);

  return null;
}
