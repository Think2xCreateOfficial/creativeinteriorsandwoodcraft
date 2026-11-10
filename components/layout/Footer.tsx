import { ArrowUpRight, Facebook, Instagram, Star } from "lucide-react";

import { site } from "@/lib/site";
import BackToTop from "@/components/ui/BackToTop";
import NavLink from "@/components/ui/NavLink";

const socialLinks = [
  { label: "Instagram", href: site.social.instagram, icon: Instagram },
  { label: "Facebook", href: site.social.facebook, icon: Facebook },
].filter((link) => link.href);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#141210] text-white">
      <div className="shell pb-[calc(5rem+env(safe-area-inset-bottom))] pt-6 md:pb-6 md:pt-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand Identity & Rating */}
          <div className="md:col-span-5">
            <p className="font-sans text-2xl font-bold leading-tight tracking-[-0.03em] text-white">
              Creative Interiors
              <span className="block text-[0.72em] font-bold text-white/60">
                &amp; Woodcraft
              </span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              We design and craft modular kitchens, custom wardrobes, and turnkey residential
              interiors in Chennai and across Tamil Nadu.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[12px] font-bold tracking-[0.18em] text-white">
                {site.rating.display}
              </span>
              <span aria-hidden className="text-amber-400">
                ★★★★★
              </span>
              <span className="text-[11.5px] tracking-[0.06em] text-white/60">
                {site.rating.count} Google reviews
              </span>
            </div>
          </div>

          {/* Quick Links Navigation */}
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-4 text-white/50 before:bg-white/30">Links</p>
            <ul className="space-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="text-[13.5px] text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-white/50 before:bg-white/30">Contact</p>
            <ul className="space-y-2 text-[13px] leading-relaxed text-white/70">
              <li>
                <a
                  href={site.phone.href}
                  className="font-medium text-white transition-colors hover:text-medium-brown"
                >
                  {site.phone.display}
                </a>
              </li>
              <li className="not-italic text-white/70">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </li>
              <li className="text-white/60 text-[12.5px]">{site.hours.summary}</li>
            </ul>
            <a
              href={site.google.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-white transition-colors hover:text-medium-brown"
            >
              <span>Find Us on Maps</span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                aria-hidden
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* Divider hairline with subtle brown accent */}
        <div className="relative mt-8 h-px w-full bg-white/10">
          <span className="absolute left-0 top-0 h-px w-20 bg-medium-brown" />
        </div>

        {/* Sub-footer Copyright & Socials */}
        <div className="mt-4 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11.5px] tracking-[0.04em] text-white/50">
            © {year} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    <Icon size={16} strokeWidth={1.5} aria-hidden />
                  </a>
                ))}
              </div>
            )}
            <BackToTop theme="dark" />
          </div>
        </div>
      </div>
    </footer>
  );
}
