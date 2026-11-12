import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/system/SmoothScroll";
import PageLoader from "@/components/ui/PageLoader";
import LeadGenerationModal from "@/components/ui/LeadGenerationModal";
import { site } from "@/lib/site";
import { content } from "@/lib/content";

const body = Lato({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "700"],
});

const title =
  "Interior Designers in Chennai | Modular Kitchen & Custom Woodwork | Creative Interiors";
const description =
  "Bespoke residential interior design, BWP modular kitchens & custom woodwork in Mogappair, Anna Nagar & across Chennai. In-house carpentry, fixed pricing. Call +91 95001 83310.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s | Creative Interiors & Woodcraft",
  },
  description,
  applicationName: site.name,
  category: "Interior Design",
  keywords: [
    "interior designers in Chennai",
    "interior designer in Mogappair",
    "interior designers in Anna Nagar",
    "modular kitchen design Chennai",
    "custom woodwork Chennai",
    "residential interior design Chennai",
    "wardrobe designers Chennai",
    "bwp plywood kitchen Chennai",
    "home interior designers Chennai",
    "interior decorators Chennai",
    "carpentry services Mogappair Chennai",
    "Creative Interiors & Woodcraft",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: site.url,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title,
    description,
    images: [
      {
        url: `${site.url}/images/og.jpg`,
        secureUrl: `${site.url}/images/og.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Creative Interiors & Woodcraft — Interior Architecture, Modular Kitchens & Custom Woodwork Chennai",
      },
      {
        url: `${site.url}/images/og-square.jpg`,
        secureUrl: `${site.url}/images/og-square.jpg`,
        width: 800,
        height: 800,
        type: "image/jpeg",
        alt: "Creative Interiors & Woodcraft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${site.url}/images/og.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F0",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["HomeAndConstructionBusiness", "LocalBusiness", "ProfessionalService"],
      "@id": `${site.url}/#business`,
      name: site.name,
      alternateName: "Creative Interiors",
      description:
        "Bespoke home interiors, modular kitchens, custom wardrobes, and architectural woodcraft in Mogappair East, Anna Nagar, and across Chennai.",
      url: site.url,
      telephone: site.phone.raw,
      email: site.email.address,
      priceRange: "₹₹ - ₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, UPI, Bank Transfer",
      image: `${site.url}/images/og.jpg`,
      logo: `${site.url}/favicon.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${site.address.line1}, ${site.address.line2}`,
        addressLocality: `${site.address.line3}, ${site.address.city}`,
        addressRegion: site.address.state,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 13.0836,
        longitude: 80.1772,
      },
      areaServed: [
        { "@type": "Place", name: "Mogappair East" },
        { "@type": "Place", name: "Mogappair West" },
        { "@type": "Place", name: "Anna Nagar" },
        { "@type": "Place", name: "Nolambur" },
        { "@type": "Place", name: "Ambattur" },
        { "@type": "Place", name: "Porur" },
        { "@type": "Place", name: "Koyambedu" },
        { "@type": "City", name: "Chennai" },
        { "@type": "AdministrativeArea", name: "Tamil Nadu" },
      ],
      hasMap: site.google.profileUrl,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:00",
          closes: "22:00",
        },
      ],
      sameAs: [
        site.google.profileUrl,
        ...(site.social.instagram ? [site.social.instagram] : []),
        ...(site.social.facebook ? [site.social.facebook] : []),
      ].filter(Boolean),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: content.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={body.variable}>
      <body>
        <PageLoader />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-charcoal focus:px-5 focus:py-3 focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-ivory"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <Header />

        {children}

        <Footer />
        <LeadGenerationModal />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
