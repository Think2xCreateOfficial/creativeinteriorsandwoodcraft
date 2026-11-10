import React from "react";

/**
 * Bespoke vector architectural illustration inspired by the studio reference design.
 * Features the storefront facade, archway with vintage lantern, "WE HAVE MOVED" studio window,
 * potted architectural plant, visitor, and loyal companion — rendered in the brand's
 * warm editorial palette (Pure White, Warm Ivory, Deep Brown, Medium Brown, and Charcoal).
 */
export default function NotFoundIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[680px] mx-auto ${className}`}>
      <svg
        viewBox="0 0 760 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm select-none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle facade gradients */}
          <linearGradient id="facadeGrad" x1="340" y1="40" x2="740" y2="440" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5F1EB" />
            <stop offset="1" stopColor="#E8E2D8" />
          </linearGradient>

          <linearGradient id="wallCorner" x1="330" y1="50" x2="350" y2="450" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DFD8CE" />
            <stop offset="1" stopColor="#D2C9BD" />
          </linearGradient>

          {/* Window Glass Reflection */}
          <linearGradient id="windowGlass" x1="590" y1="80" x2="710" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F4F7F9" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#EBF0F5" stopOpacity="0.85" />
            <stop offset="1" stopColor="#DCE5ED" stopOpacity="0.9" />
          </linearGradient>

          {/* Door Glass Reflection */}
          <linearGradient id="doorGlass" x1="500" y1="120" x2="570" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EFF3F6" stopOpacity="0.85" />
            <stop offset="1" stopColor="#DCE4EC" stopOpacity="0.75" />
          </linearGradient>

          {/* Signboard Banner */}
          <linearGradient id="bannerGrad" x1="610" y1="210" x2="690" y2="280" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6C2E40" />
            <stop offset="1" stopColor="#4A1E2B" />
          </linearGradient>

          {/* Lantern Light Glow */}
          <radialGradient id="lanternGlow" cx="370" cy="90" r="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFEFB8" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#FFDE8A" stopOpacity="0.2" />
            <stop offset="1" stopColor="#FFDE8A" stopOpacity="0" />
          </radialGradient>

          {/* Ambient Ground Shadow Gradients */}
          <radialGradient id="shadowFigure" cx="475" cy="485" rx="35" ry="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#171513" stopOpacity="0.22" />
            <stop offset="1" stopColor="#171513" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="shadowDog" cx="545" cy="488" rx="28" ry="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#171513" stopOpacity="0.18" />
            <stop offset="1" stopColor="#171513" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="shadowPot" cx="632" cy="460" rx="30" ry="9" gradientUnits="userSpaceOnUse">
            <stop stopColor="#171513" stopOpacity="0.18" />
            <stop offset="1" stopColor="#171513" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. BACKGROUND ARCHWAY & RECESSED COURTYARD PASSAGE              */}
        {/* ============================================================== */}
        {/* Distant courtyard wall */}
        <path d="M290 80 L350 50 L350 440 L290 440 Z" fill="#EAE5DC" />
        
        {/* Archway silhouette */}
        <path
          d="M305 440 L305 130 C305 95 335 75 350 72 L350 440 Z"
          fill="#DFD9CF"
        />

        {/* Subtle architectural brick pattern on the arch pillar */}
        <g stroke="#CFC7BB" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
          <line x1="315" y1="130" x2="335" y2="130" />
          <line x1="325" y1="145" x2="345" y2="145" />
          <line x1="315" y1="160" x2="335" y2="160" />
          <line x1="325" y1="175" x2="345" y2="175" />
          <line x1="315" y1="190" x2="335" y2="190" />
          <line x1="325" y1="205" x2="345" y2="205" />
          <line x1="315" y1="220" x2="335" y2="220" />
          <line x1="325" y1="235" x2="345" y2="235" />
          <line x1="315" y1="250" x2="335" y2="250" />
          <line x1="325" y1="265" x2="345" y2="265" />
          <line x1="315" y1="280" x2="335" y2="280" />
          <line x1="325" y1="295" x2="345" y2="295" />
        </g>

        {/* ============================================================== */}
        {/* 2. VINTAGE WALL LANTERN / SCONCE                                */}
        {/* ============================================================== */}
        {/* Ambient light aura */}
        <circle cx="380" cy="100" r="65" fill="url(#lanternGlow)" />

        {/* Wall bracket */}
        <path
          d="M350 90 Q370 80 380 62 L380 72 M380 62 L388 64"
          stroke="#3A3836"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="350" cy="90" r="4.5" fill="#2C2A29" />

        {/* Lantern roof cap */}
        <path d="M366 74 L380 60 L394 74 Z" fill="#3D3B38" />
        <circle cx="380" cy="58" r="2.5" fill="#3D3B38" />

        {/* Lantern glass cage */}
        <path d="M368 74 L371 106 L389 106 L392 74 Z" fill="#FFFBE8" stroke="#3D3B38" strokeWidth="2.5" />
        <line x1="380" y1="74" x2="380" y2="106" stroke="#4A4744" strokeWidth="1.5" />

        {/* Lantern bottom pendant */}
        <path d="M371 106 L380 118 L389 106 Z" fill="#3D3B38" />
        <circle cx="380" cy="120" r="2" fill="#3D3B38" />

        {/* ============================================================== */}
        {/* 3. STOREFRONT MAIN FACADE (WALL, CORNICE, BASE STEP)           */}
        {/* ============================================================== */}
        {/* Cornice / Top Parapet Moulding */}
        <path d="M350 40 L760 40 L760 56 L350 56 Z" fill="#D6CDC0" />
        <path d="M348 56 L760 56 L760 62 L348 62 Z" fill="#C5BAAA" />

        {/* Main facade wall */}
        <path d="M350 62 L760 62 L760 440 L350 440 Z" fill="url(#facadeGrad)" />

        {/* Corner shadow bevel on building edge */}
        <path d="M350 40 L358 40 L358 440 L350 440 Z" fill="url(#wallCorner)" opacity="0.6" />

        {/* Architectural facade horizontal frieze line */}
        <line x1="358" y1="74" x2="760" y2="74" stroke="#DFD7CC" strokeWidth="2" />

        {/* Ground Plinth / Storefront Footing */}
        <path d="M346 438 L760 438 L760 455 L346 455 Z" fill="#DFD7CB" />
        <line x1="346" y1="455" x2="760" y2="455" stroke="#CFC5B8" strokeWidth="2" />

        {/* Perspective sidewalk lines */}
        <path d="M120 515 L760 515 L760 455 L346 455 Z" fill="#FAF8F5" />
        <line x1="120" y1="515" x2="760" y2="515" stroke="#E6E0D6" strokeWidth="1.5" />
        <line x1="280" y1="515" x2="420" y2="455" stroke="#EAE4DA" strokeWidth="1" strokeDasharray="6 6" />

        {/* ============================================================== */}
        {/* 4. ENTRANCE DOOR                                               */}
        {/* ============================================================== */}
        {/* Outer door frame */}
        <rect x="496" y="118" width="84" height="320" rx="1" fill="#423E3A" />
        {/* Inner frame relief */}
        <rect x="502" y="124" width="72" height="308" fill="#524D48" />

        {/* Upper door glass panel */}
        <rect x="508" y="132" width="60" height="152" fill="url(#doorGlass)" stroke="#383431" strokeWidth="2" />
        {/* Glass reflection diagonals */}
        <line x1="514" y1="140" x2="556" y2="220" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="530" y1="140" x2="562" y2="200" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

        {/* Lower door solid panel */}
        <rect x="508" y="292" width="60" height="132" fill="#3D3935" stroke="#322E2A" strokeWidth="1.5" />
        <rect x="514" y="300" width="48" height="116" fill="#47423D" />

        {/* Door Hardware: Round metal door knob & escutcheon */}
        <circle cx="560" cy="284" r="5.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
        <circle cx="558.5" cy="282.5" r="2" fill="#FFFFFF" />

        {/* Door threshold step */}
        <path d="M492 438 L584 438 L584 444 L492 444 Z" fill="#CBC2B4" />

        {/* ============================================================== */}
        {/* 5. LARGE SHOWROOM STUDIO DISPLAY WINDOW                        */}
        {/* ============================================================== */}
        {/* Main outer window frame */}
        <rect x="600" y="104" width="150" height="274" rx="2" fill="#383431" />
        {/* Inner window rebate */}
        <rect x="606" y="110" width="138" height="262" rx="1" fill="#484440" />

        {/* Window Glass Pane */}
        <rect x="610" y="114" width="130" height="254" fill="url(#windowGlass)" />

        {/* Window Pane Specular Reflections */}
        <path d="M620 120 L730 310 L730 330 L620 140 Z" fill="#FFFFFF" opacity="0.18" />
        <path d="M650 120 L730 260 L730 275 L650 135 Z" fill="#FFFFFF" opacity="0.15" />

        {/* Studio Branding on Glass (Arched / Editorial typography) */}
        <g textAnchor="middle" fontFamily="sans-serif">
          {/* Subtle curved arch label */}
          <text
            x="675"
            y="148"
            fontSize="10.5"
            fontWeight="600"
            letterSpacing="0.08em"
            fill="#5E5953"
          >
            CREATIVE INTERIORS
          </text>
          <text
            x="675"
            y="162"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="0.16em"
            fill="#806653"
          >
            WOODCRAFT STUDIO
          </text>
          <line x1="638" y1="168" x2="712" y2="168" stroke="#A99E91" strokeWidth="0.8" />
        </g>

        {/* -------------------------------------------------------------- */}
        {/* "WE HAVE MOVED" WINDOW POSTER BANNER                            */}
        {/* -------------------------------------------------------------- */}
        {/* Banner Shadow */}
        <rect x="626" y="214" width="98" height="66" rx="4" fill="#171513" opacity="0.15" />

        {/* Banner Card */}
        <rect
          x="624"
          y="210"
          width="98"
          height="66"
          rx="4"
          fill="url(#bannerGrad)"
          stroke="#FAF9F6"
          strokeWidth="1.8"
        />

        {/* Banner Content */}
        <g textAnchor="middle" fontFamily="sans-serif">
          <text
            x="673"
            y="235"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="0.06em"
            fill="#FFFFFF"
          >
            WE HAVE
          </text>
          <text
            x="673"
            y="256"
            fontSize="14"
            fontWeight="900"
            letterSpacing="0.08em"
            fill="#FFFFFF"
          >
            MOVED
          </text>
          <line x1="642" y1="264" x2="704" y2="264" stroke="#FAF9F6" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Window Sill Ledge */}
        <path d="M594 378 L756 378 L756 388 L594 388 Z" fill="#D4CAC0" />
        <line x1="594" y1="388" x2="756" y2="388" stroke="#B8ACA0" strokeWidth="2" />

        {/* Secondary Window (Corner Left) */}
        <rect x="404" y="132" width="74" height="150" fill="#3D3936" />
        <rect x="408" y="136" width="66" height="142" fill="#E8EDF1" />
        <line x1="441" y1="136" x2="441" y2="278" stroke="#3D3936" strokeWidth="2.5" />
        <line x1="408" y1="168" x2="474" y2="168" stroke="#3D3936" strokeWidth="2" />
        {/* Window sill */}
        <path d="M400 282 L482 282 L482 288 L400 288 Z" fill="#D4CAC0" />

        {/* ============================================================== */}
        {/* 6. POTTED ARCHITECTURAL PLANT (NEAR STOREFRONT)                */}
        {/* ============================================================== */}
        {/* Drop shadow */}
        <ellipse cx="632" cy="460" rx="30" ry="8" fill="url(#shadowPot)" />

        {/* Minimalist Ceramic Planter */}
        <path d="M618 418 L646 418 L642 458 L622 458 Z" fill="#EFECE6" stroke="#D1CAC0" strokeWidth="1.2" />
        <path d="M616 414 L648 414 L646 420 L618 420 Z" fill="#DDD6CB" />
        {/* Planter soil */}
        <ellipse cx="632" cy="417" rx="14" ry="3" fill="#4A3C31" />

        {/* Plant Leaves: Architectural Sansevieria / Snake Plant */}
        {/* Leaf 1 (Left background) */}
        <path d="M628 416 Q620 380 622 360 Q626 380 630 416 Z" fill="#2E5A44" />
        {/* Leaf 2 (Center tall) */}
        <path d="M631 416 Q632 360 633 340 Q636 360 635 416 Z" fill="#3D7457" />
        <line x1="633" y1="345" x2="633" y2="415" stroke="#78B991" strokeWidth="0.8" />
        {/* Leaf 3 (Right) */}
        <path d="M634 416 Q642 375 644 355 Q640 380 636 416 Z" fill="#2E5A44" />
        {/* Leaf 4 (Front left small) */}
        <path d="M625 418 Q618 395 621 380 Q626 395 628 418 Z" fill="#488665" />
        {/* Leaf 5 (Front right small) */}
        <path d="M633 418 Q640 395 638 382 Q636 395 635 418 Z" fill="#488665" />

        {/* ============================================================== */}
        {/* 7. LOYAL COMPANION (DOG) SITTING ATTENTIVELY                   */}
        {/* ============================================================== */}
        {/* Dog ground shadow */}
        <ellipse cx="545" cy="488" rx="26" ry="7" fill="url(#shadowDog)" />

        {/* Dog Body Silhouette (Warm Light Grey / Ivory matching reference) */}
        <g fill="#D5D9DC" stroke="#B8BFC5" strokeWidth="0.8">
          {/* Sitting hind leg / rump */}
          <ellipse cx="538" cy="478" rx="12" ry="10" />
          <ellipse cx="533" cy="485" rx="7" ry="4" />

          {/* Front leg */}
          <rect x="546" y="465" width="6" height="22" rx="3" />
          <ellipse cx="549" cy="486" rx="5" ry="3" />

          {/* Torso */}
          <path d="M536 478 Q538 450 546 442 L554 456 Q554 475 548 482 Z" />

          {/* Neck & Head turned toward shopfront */}
          <path d="M544 446 L549 430 L556 432 L554 448 Z" />
          {/* Dog Head */}
          <ellipse cx="554" cy="430" rx="9" ry="8" />
          {/* Snout pointing right */}
          <path d="M558 427 L569 432 L558 436 Z" />
          <circle cx="568" cy="432" r="1.5" fill="#474C52" />

          {/* Pointed Ears */}
          <path d="M547 425 L549 416 L553 423 Z" fill="#C4CBD0" />
          <path d="M553 424 L556 414 L560 423 Z" fill="#C4CBD0" />

          {/* Wagging tail curved behind */}
          <path
            d="M528 478 Q520 472 522 462 Q526 468 532 474 Z"
            fill="#D5D9DC"
          />
        </g>

        {/* ============================================================== */}
        {/* 8. VISITOR FIGURE (EXPLORER / HOMEOWNER)                       */}
        {/* ============================================================== */}
        {/* Figure ground shadow */}
        <ellipse cx="475" cy="486" rx="32" ry="9" fill="url(#shadowFigure)" />

        {/* Sneakers */}
        <g fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1">
          {/* Left shoe */}
          <path d="M460 482 L472 482 Q474 487 468 488 L457 488 Q456 484 460 482 Z" />
          {/* Right shoe */}
          <path d="M480 482 L492 482 Q494 487 488 488 L477 488 Q476 484 480 482 Z" />
        </g>

        {/* Dark Fitted Trousers (Charcoal Slate #2D3748) */}
        <g fill="#2D3748">
          {/* Left leg */}
          <path d="M465 400 L460 482 L470 482 L472 400 Z" />
          {/* Right leg */}
          <path d="M473 400 L478 482 L488 482 L484 400 Z" />
          {/* Pelvis / hips */}
          <path d="M462 388 L488 388 L485 412 L465 412 Z" />
        </g>

        {/* Terracotta Pullover Sweater (#BD5D4C / #C46857) */}
        <g fill="#C46857">
          {/* Torso */}
          <path
            d="M455 330 C455 315 464 308 475 308 C486 308 495 315 495 330 L492 392 L458 392 Z"
            rx="6"
          />
          {/* Bottom sweater hem */}
          <rect x="458" y="388" width="34" height="6" rx="2" fill="#B05544" />

          {/* Left arm relaxed at side */}
          <path
            d="M457 325 L450 375 L456 377 L463 332 Z"
            fill="#B85F4E"
          />
          {/* Right arm slightly extended toward shopfront */}
          <path
            d="M493 325 L504 374 L498 376 L488 332 Z"
            fill="#B85F4E"
          />
        </g>

        {/* Hands in neutral skin tone */}
        <circle cx="452" cy="380" r="4" fill="#E8B49B" />
        <circle cx="503" cy="378" r="4" fill="#E8B49B" />

        {/* Neck */}
        <rect x="472" y="298" width="7" height="12" fill="#DFA48B" />

        {/* Head & Hair */}
        {/* Head profile */}
        <circle cx="475" cy="292" r="13" fill="#E8B49B" />
        {/* Stylish wavy modern hair (#3F312B deep espresso) */}
        <path
          d="M463 292 C462 278 472 272 485 274 C490 275 491 282 488 288 C483 285 476 284 472 288 C468 292 466 295 463 292 Z"
          fill="#3F312B"
        />
        <path
          d="M485 275 C492 278 493 285 487 292 C483 292 481 288 484 282 Z"
          fill="#4F3E37"
        />
      </svg>
    </div>
  );
}

