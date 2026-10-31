import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOMeta } from '../../types';

interface SEOHeadProps {
  meta?: Partial<SEOMeta>;
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'service';
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  meta,
  title,
  description,
  canonicalPath = '',
  type = 'website',
  ogImage,
  jsonLd
}) => {
  const siteUrl = 'https://sunraisesolutions.com';
  const siteName = 'Sunraise Solutions';

  const pageTitle = meta?.meta_title || title || 'Sunraise Solutions | Corporate Digital Agency & Custom Software';
  const pageDescription = meta?.meta_description || description || 'Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, and Enterprise Software.';
  const keywords = meta?.keywords || 'Digital Marketing Agency Hyderabad, SEO Services Hyderabad, Custom Software Development, Hospital Management Software AP';
  const fullCanonicalUrl = meta?.canonical_url || `${siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const shareImage = meta?.og_image || ogImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

  // Base LocalBusiness Schema for Hyderabad and Rajahmundry presence
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sunraise Solutions',
    image: `${siteUrl}/logo.png`,
    '@id': `${siteUrl}/#organization`,
    url: siteUrl,
    telephone: '+919959639539',
    email: 'hello@sunraisesolutions.com',
    priceRange: '₹₹',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Madhapur, Hitec City',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500081',
        addressCountry: 'IN'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Main Road, Danavaipeta',
        addressLocality: 'Rajahmundry',
        addressRegion: 'Andhra Pradesh',
        postalCode: '533103',
        addressCountry: 'IN'
      }
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4483,
      longitude: 78.3915
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00'
    },
    sameAs: [
      'https://www.linkedin.com/company/sunraise-solutions',
      'https://www.facebook.com/sunraisesolutions',
      'https://twitter.com/sunraisesol'
    ]
  };

  const schemasToRender: Record<string, any>[] = [organizationSchema];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemasToRender.push(...jsonLd);
    } else {
      schemasToRender.push(jsonLd);
    }
  }

  // Also include custom schema from SEOMeta if provided
  if (meta?.schema_json) {
    try {
      const parsed = JSON.parse(meta.schema_json);
      schemasToRender.push(parsed);
    } catch (e) {
      // ignore parse error in dev
    }
  }

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Robots Tag */}
      {meta?.robots_index === false ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={shareImage} />

      {/* Schema.org Structured Data */}
      {schemasToRender.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
