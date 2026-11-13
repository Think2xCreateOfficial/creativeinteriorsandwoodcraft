/**
 * Centralized, editable page content for Creative Interiors & Woodcraft.
 *
 * All business details live in lib/site.ts.
 * All editorial copy, 10 services, approach steps, portfolio projects,
 * testimonials, and FAQs live here.
 */

export const film = {
  /** Locally encoded walkthrough used by the cinematic hero on desktop. */
  src: "/interior-tour.mp4",
  /** Master 1080p walkthrough variant ensuring original high quality on mobile devices as well. */
  mobileSrc: "/interior-tour.mp4",
  /** First-frame poster shown beneath the video while it loads. */
  poster: "/images/interior-poster.webp",
  /** Fallback duration in seconds. */
  duration: 17.2,
} as const;

export type InteriorSpace = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
};

/**
 * SECTION 04: The 10 exact services requested by the business.
 * Used by the sticky crossfade gallery in InteriorsGallery.tsx.
 */
export const interiorSpaces: InteriorSpace[] = [
  {
    id: "bedroom-design",
    number: "01",
    title: "Bedroom Design",
    description:
      "Serene master and guest bedroom spaces planned for restorative comfort, intelligent wardrobe integration, and balanced ambient lighting.",
    image: "/images/interiors/68.webp",
  },
  {
    id: "cabinetry-hardware",
    number: "02",
    title: "Cabinetry and Hardware Design",
    description:
      "Custom timber cabinetry, soft-close hardware, and bespoke architectural storage built specifically for your home's layout.",
    image: "/images/interiors/94.webp",
  },
  {
    id: "dining-room-design",
    number: "03",
    title: "Dining Room Design",
    description:
      "Inviting dining spaces featuring handcrafted timber dining furniture, custom crockery cabinets, and focused pendant illumination.",
    image: "/images/interiors/ceiling-lighting.webp",
  },
  {
    id: "home-decor-selection",
    number: "04",
    title: "Home Decor Selection",
    description:
      "Thoughtfully chosen textures, wall finishes, decorative accessories, and organic wood accents that bring character to every room.",
    image: "/images/interiors/32.webp",
  },
  {
    id: "interior-architectural-design",
    number: "05",
    title: "Interior Architectural Design",
    description:
      "Complete spatial planning, structural partitioning, wall paneling, and interior proportioning for modern residential living.",
    image: "/images/interiors/88.webp",
  },
  {
    id: "interior-decorating",
    number: "06",
    title: "Interior Decorating",
    description:
      "Cohesive interior styling uniting furnishings, drapery, artisanal woodwork, and curated color palettes into one unified aesthetic.",
    image: "/images/interiors/2.webp",
  },
  {
    id: "interior-painting",
    number: "07",
    title: "Interior Painting",
    description:
      "Flawless surface preparation, moisture-resistant base coats, and premium low-VOC matte, eggshell, and textured wall finishes.",
    image: "/images/interiors/1.webp",
  },
  {
    id: "kitchen-design",
    number: "08",
    title: "Kitchen Design",
    description:
      "Ergonomic modular kitchens featuring marine-grade ply, acrylic shutters, quartz countertops, and high-efficiency corner pull-outs.",
    image: "/images/interiors/33.webp",
  },
  {
    id: "lighting-design",
    number: "09",
    title: "Lighting Design",
    description:
      "Layered architectural lighting combining warm cove recesses, concealed task strips, and signature accent fixtures.",
    image: "/images/interiors/50.webp",
  },
  {
    id: "living-room-design",
    number: "10",
    title: "Living Room Design",
    description:
      "A warm, welcoming focal living area with custom television feature walls, timber fluting, and acoustic ceiling treatments.",
    image: "/images/interiors/4.webp",
  },
];

/** Options for the enquiry form's “Interested Service” field. */
export const serviceOptions = interiorSpaces.map((space) => space.title);

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  youtubeUrl?: string;
  featured?: boolean;
}

export interface TestimonialItem {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  designStyle?: string;
  relatedImage: string;
  relatedCategory: string;
  featured?: boolean;
  source: string;
  // Backward compatibility fields
  author?: string;
  quote?: string;
  location?: string;
  projectImage?: string;
  projectTitle?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const content = {
  hero: {
    label: "Creative Interiors & Woodcraft",
    heading: "Interiors made for everyday life.",
    description:
      "We design kitchens, wardrobes, and complete residential interiors for families across Chennai and Tamil Nadu.",
    primaryCta: { label: "Explore Our Work", href: "#services" },
    secondaryCta: { label: "Talk to Us", href: "#contact" },
    scrollLabel: "Scroll to explore",
  },

  about: {
    label: "ABOUT US / CREATIVE INTERIORS",
    headingPrefix: "Everything you need to know",
    headingAccent: "about",
    headingSuffix: "our craft.",
    description:
      "Creative Interiors & Woodcraft is a Chennai-based interior architecture and custom woodwork studio in Mogappair East. We specialize in functional space planning, modular kitchen engineering, and craftsmanship tailored for modern Indian households.",
    highlights: [
      "14+ Verified 5-Star Reviews on Google Maps",
      "In-House Carpentry, Modular Fabrication & Joinery",
      "Transparent Fixed-Price Quotes with Zero Hidden Fees",
      "Turnkey Residential Execution Across Tamil Nadu",
    ],
    cta: { label: "Start Your Project", href: "#contact" },
    images: {
      primary: "/images/interiors/4.webp",
      primaryAlt: "Modern modular kitchen cabinetry with warm timber finishes",
      secondary: "/images/interiors/6.webp",
      secondaryAlt: "Geometric false ceiling with warm recessed LED strip illumination",
      tertiary: "/images/interiors/32.webp",
      tertiaryAlt: "Custom interior wardrobe and woodworking detail",
    },
  },

  approach: {
    label: "OUR APPROACH",
    headingPrefix: "Thoughtfully Designed.",
    headingAccent: "Beautifully Crafted.",
    subtitle:
      "From initial lifestyle consultation to final on-site installation, our 4-stage process guarantees precision, durability, and complete peace of mind.",
    steps: [
      {
        number: "01",
        title: "Understand",
        description:
          "We begin by understanding your family's daily lifestyle, spatial requirements, storage priorities, and aesthetic taste before proposing design directions.",
        image: "/images/interiors/3.webp",
        alt: "Contemporary residential interior consultation and living space planning",
      },
      {
        number: "02",
        title: "Design",
        description:
          "We develop thoughtful 2D layouts and 3D visual directions that balance aesthetics, lighting flow, and ergonomic space optimization.",
        image: "/images/interiors/75.webp",
        alt: "Functional modular kitchen and ergonomic cabinetry spatial design",
      },
      {
        number: "03",
        title: "Craft",
        description:
          "Our dedicated carpenters and fabricators build cabinetry, wardrobes, TV units, and timber joinery using calibrated plywood and premium hardware.",
        image: "/images/interiors/37.webp",
        alt: "Artisan woodwork with custom timber joinery and precision craftsmanship",
      },
      {
        number: "04",
        title: "Complete",
        description:
          "We coordinate the turnkey installation, fit hardware with millimeter accuracy, perform quality inspections, and hand over your finished home.",
        image: "/images/interiors/94.webp",
        alt: "Turnkey completed master residence with built-in wardrobe and ambient lighting",
      },
    ] as ApproachStep[],
  },

  interiors: {
    label: "SERVICES",
    heading: "Home interiors made for everyday life.",
    description:
      "Explore our 10 specialized interior disciplines covering complete home design, woodwork, modular cabinetry, and finishing.",
    note:
      "Select any service to preview completed work and discuss custom solutions for your home.",
  },

  works: {
    label: "OUR WORKS",
    heading: "Spaces We've Brought to Life.",
    description:
      "Explore our interior design, cabinetry and woodcraft work through real project photographs and videos.",
    projects: [
      {
        id: "work-1",
        title: "Evaluation & Contemporary Living",
        category: "Living Room & Feature Wall",
        location: "Mogappair East, Chennai",
        image: "/images/interiors/81.webp",
        youtubeUrl: "", // Centralized: paste YouTube video URL here when uploaded
        featured: false,
      },
      {
        id: "work-2",
        title: "Urban Minimalist Residence",
        category: "Complete Modular Kitchen",
        location: "Anna Nagar, Chennai",
        image: "/images/interiors/46.webp",
        youtubeUrl: "", // Centralized: paste YouTube video URL here when uploaded
        featured: true,
      },
      {
        id: "work-3",
        title: "Warm Timber Bedroom Suite",
        category: "Wardrobes & Bed Frame",
        location: "Perumbakkam, Chennai",
        image: "/images/interiors/94.webp",
        youtubeUrl: "",
        featured: false,
      },
      {
        id: "work-4",
        title: "Geometric False Ceiling & Lighting",
        category: "Ceilings & Ambience",
        location: "Ambattur, Chennai",
        image: "/images/interiors/88.webp",
        youtubeUrl: "",
        featured: false,
      },
      {
        id: "work-5",
        title: "Custom Timber Joinery & Partition",
        category: "Architectural Woodwork",
        location: "Mogappair, Chennai",
        image: "/images/interiors/42.webp",
        youtubeUrl: "",
        featured: false,
      },
    ] as PortfolioProject[],
  },

  testimonials: {
    label: "CLIENT EXPERIENCES",
    headingPrefix: "Trusted by the People",
    headingAccent: "We Create For.",
    description:
      "Real experiences from customers who trusted us with their interior and woodcraft projects.",
    ratingSummary: "5.0 / 5.0 on Google Business Reviews",
    items: [
      {
        id: "rev-arjun-m",
        reviewerName: "Arjun M",
        author: "Arjun M",
        rating: 5,
        reviewText:
          "Excellent Service from Creative Interiors and Woodcraft!\n\nAfter a bad experience with my previous vendor who stopped responding, I handed over my complete home interior work to Creative Interiors and Woodcraft.\n\nFrom day one, they were very professional, transparent with pricing, and on-time with every stage of work. The woodwork finishing, design ideas, and material quality are excellent. They completed the work within the promised time and with zero hassle.\n\nSpecial thanks to Mr. Sathish and team for their patience, clean work, and creative suggestions which made my home look beautiful.\n\nHighly recommend them for anyone looking for interior work in Chennai. Genuinely happy and satisfied!",
        quote:
          "From day one, they were very professional, transparent with pricing, and on-time with every stage of work. The woodwork finishing, design ideas, and material quality are excellent.",
        relatedCategory: "Complete Home Interior & Woodwork",
        projectTitle: "Complete Home Interior & Custom Woodwork",
        relatedImage: "/images/interiors/26.webp",
        projectImage: "/images/interiors/26.webp",
        location: "Chennai, Tamil Nadu",
        featured: true,
        source: "Google Business Profile",
      },
      {
        id: "rev-sanjay",
        reviewerName: "Sanjay",
        author: "Sanjay",
        rating: 5,
        reviewText:
          "Excellent decoration work! The designs were beautiful, creative, and neatly finished. The team did a great job, paid attention to every detail, and delivered quality work. Highly satisfied with the service. Highly recommended for anyone looking for beautiful decor work!",
        quote:
          "Excellent decoration work! The designs were beautiful, creative, and neatly finished. The team did a great job, paid attention to every detail, and delivered quality work.",
        relatedCategory: "Decor & Modular Cabinetry",
        projectTitle: "Decor & Modular Cabinetry",
        relatedImage: "/images/interiors/38.webp",
        projectImage: "/images/interiors/38.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-sri-twin",
        reviewerName: "Sri twin",
        author: "Sri twin",
        rating: 5,
        designStyle: "Classic",
        reviewText:
          "We recently got our home interiors done by Creative Interiors, and we couldn't be happier with the outcome! From the initial 3D design consultation to the final handover, the entire process was smooth and transparent. The team really listened to our requirements and maximized our space with smart, modern designs. The quality of the materials and the finish on the modular kitchen and wardrobes are top-notch. Most importantly, they delivered on time without any hidden costs. Highly recommend them to anyone looking for reliable and creative interior designers!",
        quote:
          "From the initial 3D design consultation to the final handover, the entire process was smooth and transparent. The team maximized our space with smart, modern designs and delivered on time without hidden costs.",
        relatedCategory: "Home Interiors, Modular Kitchen & Wardrobes",
        projectTitle: "Home Interiors, Modular Kitchen & Wardrobes",
        relatedImage: "/images/interiors/26.webp",
        projectImage: "/images/interiors/26.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-arun-srinivasan",
        reviewerName: "Arun Srinivasan",
        author: "Arun Srinivasan",
        rating: 5,
        designStyle: "Classic, Modern, Elegant",
        reviewText:
          "Exceptional design sense, great material quality, and timely execution! Creative Interiors & Woodcraft exceeded our expectations in every way. Their team was very supportive throughout the project and brought our vision to life seamlessly. Truly value for money and highly recommended!",
        quote:
          "Exceptional design sense, great material quality, and timely execution! Their supportive team brought our vision to life seamlessly.",
        relatedCategory: "Complete Home Interior & Woodcraft",
        projectTitle: "Complete Home Interior & Woodcraft",
        relatedImage: "/images/interiors/38.webp",
        projectImage: "/images/interiors/38.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-monica-shan",
        reviewerName: "Monica Shan",
        author: "Monica Shan",
        rating: 5,
        designStyle: "Classic, Modern",
        reviewText:
          "Excellent interior work! The finishing is neat and beautiful, and the quality of the work is really good. The team was professional, friendly, and completed the work as expected. Very happy with the overall experience. Highly recommended!",
        quote:
          "Excellent interior work! The finishing is neat and beautiful, and the quality of the work is really good. The team was professional, friendly, and completed the work as expected.",
        relatedCategory: "Bedroom Suite & Built-in Wardrobes",
        projectTitle: "Bedroom Suite & Built-in Wardrobes",
        relatedImage: "/images/interiors/20.webp",
        projectImage: "/images/interiors/20.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-megala-k",
        reviewerName: "Megala K",
        author: "Megala K",
        rating: 5,
        reviewText:
          "You did an excellent job! The work was done on time, neatly, and perfectly. Everything looks amazing, and the quality is really high. The painting suggestions were also very good and helpful.\n\nThank you so much for your wonderful work and support!",
        quote:
          "You did an excellent job! The work was done on time, neatly, and perfectly. Everything looks amazing, and the quality is really high. The painting suggestions were also very good and helpful.",
        relatedCategory: "False Ceiling, Lighting & Interior Painting",
        projectTitle: "False Ceiling, Lighting & Interior Painting",
        relatedImage: "/images/interiors/21.webp",
        projectImage: "/images/interiors/21.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-balamurugan-m",
        reviewerName: "balamurugan m",
        author: "balamurugan m",
        rating: 5,
        designStyle: "Classic, Modern, Elegant",
        reviewText:
          "Really happy with the work done by Interiors & Woodcraft! The finishing was excellent, the woodwork quality was very good, and the overall design looked beautiful. The team was professional, friendly, and attentive to my needs. They delivered exactly what I expected. Highly recommended for anyone looking for quality interior and woodwork services! 👌🏡",
        quote:
          "The finishing was excellent, the woodwork quality was very good, and the overall design looked beautiful. The team was professional, friendly, and attentive to my needs.",
        relatedCategory: "Custom Architectural Woodwork & Fluting",
        projectTitle: "Custom Architectural Woodwork & Fluting",
        relatedImage: "/images/interiors/23.webp",
        projectImage: "/images/interiors/23.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-nandha-kumar",
        reviewerName: "nandha kumar",
        author: "nandha kumar",
        rating: 5,
        reviewText:
          "So friendly! Adaptive designer for all kind of people! Creative design!smart work and work ll finish in crrct date tats important",
        quote:
          "So friendly! Adaptive designer for all kind of people! Creative design!smart work and work ll finish in crrct date tats important",
        relatedCategory: "Timber Joinery & Storage Design",
        projectTitle: "Timber Joinery & Storage Design",
        relatedImage: "/images/interiors/24.webp",
        projectImage: "/images/interiors/24.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
      {
        id: "rev-masilamani-ar",
        reviewerName: "Masilamani AR",
        author: "Masilamani AR",
        rating: 5,
        reviewText:
          "Interior design work has the power to transform even an ordinary house into something beautiful thanks to skill and hard work your work is truly wonderful I wish you continued growth and success❤️🥰🤗",
        quote:
          "Interior design work has the power to transform even an ordinary house into something beautiful thanks to skill and hard work your work is truly wonderful.",
        relatedCategory: "Artisan Woodcraft & Finishing",
        projectTitle: "Artisan Woodcraft & Finishing",
        relatedImage: "/images/interiors/27.webp",
        projectImage: "/images/interiors/27.webp",
        location: "Chennai, Tamil Nadu",
        featured: false,
        source: "Google Business Profile",
      },
    ] as TestimonialItem[],
  },

  contact: {
    label: "Contact Us",
    heading: "Tell us what you need for your home.",
    description:
      "Call, WhatsApp or send us an enquiry. We are based in Mogappair East, Chennai and design homes for families across Tamil Nadu.",
    submitLabel: "Send Enquiry",
    mapTitle: "Creative Interiors & Woodcraft on Google Maps",
    // Verified Google Maps embed supplied by the business
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.3531284080973!2d80.18169507359103!3d13.07679211256631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52615f98bd3399%3A0xbf7548ff542dd176!2sCreative%20Interiors%20%26%20woodcraft!5e0!3m2!1sen!2sin!4v1794235512389!5m2!1sen!2sin",
  },

  faq: {
    label: "GOOD TO KNOW",
    heading: "Frequently Asked Questions",
    items: [
      {
        id: "faq-1",
        question: "What interior design and woodwork services do you provide?",
        answer:
          "We provide comprehensive residential interior design and custom woodcraft services, including space planning, modular kitchen design, custom bedroom wardrobes, television units, false ceiling and lighting design, pooja unit woodwork, and on-site finishing.",
      },
      {
        id: "faq-2",
        question: "Can I customize the design, materials, and hardware according to my preferences?",
        answer:
          "Yes, completely. Every project is made-to-order. You can select your preferred core materials (e.g., BWP/BWR marine grade plywood), laminates, acrylics, veneer finishes, and branded hardware fittings from top manufacturers (such as Hafele, Hettich, or Ebco).",
      },
      {
        id: "faq-3",
        question: "Do you have your own carpentry and manufacturing workshop?",
        answer:
          "Yes. We have dedicated in-house carpentry and woodwork fabrication teams. This gives us direct quality control over material calibration, edge banding, joinery durability, and on-time delivery without third-party middleman delays.",
      },
      {
        id: "faq-4",
        question: "How does the interior design process begin?",
        answer:
          "The process starts with an initial discussion—either over the phone, WhatsApp, or in person—where we learn about your floor plan, room requirements, and budget. We then conduct an on-site measurement, create detailed 2D/3D layouts, and provide a transparent, itemized quote.",
      },
      {
        id: "faq-5",
        question: "Do you provide transparent quotes without hidden charges?",
        answer:
          "Yes. We provide clear, itemized quotes outlining square footage, material grades, hardware specifications, and labor costs before work begins. There are no surprise hidden fees during or after project execution.",
      },
      {
        id: "faq-6",
        question: "Where are you located and what locations do you serve?",
        answer:
          "Our studio and workshop are based at 17, Eval Street, Golden George Nagar, Mogappair East, Chennai. We serve homeowners across Mogappair, Anna Nagar, Ambattur, Porur, Perumbakkam, and residential developments across Greater Chennai and Tamil Nadu.",
      },
      {
        id: "faq-7",
        question: "Can I visit your workshop or discuss project requirements before confirming?",
        answer:
          "Absolutely. We welcome homeowners to call ahead and visit us in Mogappair East to inspect material samples, view joinery demonstrations, and discuss project timelines directly with our senior interior carpenters.",
      },
      {
        id: "faq-8",
        question: "How long does a typical home interior project take to complete?",
        answer:
          "Typical project timelines range from 30 to 45 business days depending on the scope of work (such as modular kitchen, master wardrobes, and false ceilings). We provide a committed handover schedule before commencement and ensure punctual milestone delivery.",
      },
    ] as FaqItem[],
  },
} as const;
