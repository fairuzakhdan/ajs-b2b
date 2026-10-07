import Link from "next/link";
import { Anchor, MapPin, Phone, Mail, LinkIcon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0F172A] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-[#1E3A8A] text-white">
                <Anchor className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-white">
                PT ALTISAN JAYA SINERGI
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Supplier komoditas perikanan B2B dari hub Muara Baru, Jakarta.
              Menghubungkan sumber komoditas laut daerah dengan kebutuhan pasar
              domestik dan internasional.
            </p>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white">Tautan Cepat</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#commodities" className="text-slate-400 transition-colors hover:text-sky-300">
                  Katalog Komoditas
                </a>
              </li>
              <li>
                <a href="#supply-chain" className="text-slate-400 transition-colors hover:text-sky-300">
                  Rantai Pasok
                </a>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 transition-colors hover:text-sky-300">
                  Portal Buyer B2B
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Address */}
          <div>
            <h4 className="text-sm font-semibold text-white">Head Office</h4>
            <p className="mt-4 flex gap-2 text-sm leading-relaxed text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" />
              <span>
                MTH Square Ground Floor (GF) A4 A, Jl. Letjen M.T. Haryono Kav.
                10, Bidara Cina, Jatinegara, Jakarta Timur, DKI Jakarta 13330
              </span>
            </p>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/6285719123000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-sky-300"
                >
                  <Phone className="h-4 w-4 text-sky-400" />
                  +62 857 1912 3000
                </a>
              </li>
              <li>
                <a
                  href="mailto:altisan.sinergi@gmail.com"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-sky-300"
                >
                  <Mail className="h-4 w-4 text-sky-400" />
                  altisan.sinergi@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://linktr.ee/altisan.sinergi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-sky-300"
                >
                  <LinkIcon className="h-4 w-4 text-sky-400" />
                  altisan.sinergi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © 2026 PT Altisan Jaya Sinergi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
