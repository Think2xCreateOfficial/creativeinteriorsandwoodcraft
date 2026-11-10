import { MessageCircle, Phone } from "lucide-react";

import { site } from "@/lib/site";

/** Always-reachable Call / WhatsApp actions on small screens. */
export default function MobileActionBar() {
  return (
    <div
      className="hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 gap-2.5 px-4 py-2.5">
        <a
          href={site.phone.href}
          className="flex min-h-11 items-center justify-center gap-2 bg-charcoal px-4 text-[13px] font-bold text-ivory"
        >
          <Phone size={14} strokeWidth={1.6} aria-hidden />
          Call Now
        </a>
        <a
          href={site.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 border border-charcoal/25 px-4 text-[13px] font-bold text-charcoal"
        >
          <MessageCircle size={14} strokeWidth={1.6} aria-hidden />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
