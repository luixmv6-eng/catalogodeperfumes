"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { products } from "@/lib/products";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`´]/g, "");
}

function formatPrice(value: number) {
  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function InstagramIcon() {
  return (
    <svg
      className="h-9 w-9 stroke-[1.5]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-9 w-9 stroke-[1.5]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const brands = useMemo(
    () =>
      [...new Set(products.map((p) => p.brand))].sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const searchValue = normalizeText(search.trim());

    if (searchValue) {
      filtered = filtered.filter(
        (p) =>
          normalizeText(p.name).includes(searchValue) ||
          normalizeText(p.brand).includes(searchValue)
      );
    }

    if (brand !== "all") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [search, brand, sort]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("card-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "40px", threshold: 0.12 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <header className="relative overflow-hidden border-b border-[#d4af37]/30 px-5 pb-12 pt-14 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.30)_0%,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d4af37]/10 blur-3xl" />

        <Image
          src="/logo.png"
          alt="L'Essence Perfumería Original Since 2025"
          width={320}
          height={120}
          className="mx-auto mb-6 h-auto w-[320px] max-w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-fade-in-up"
          priority
        />

        <h1 className="font-[var(--font-playfair)] text-4xl font-semibold uppercase tracking-[0.25em] text-[#d4af37] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-fade-in-up-delay">
          Catálogo Exclusivo
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm tracking-[0.16em] text-[#d8d8d8] animate-fade-in-up-delay-2 md:text-base">
          Fragancias originales seleccionadas para una experiencia de lujo
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          <a
            href="https://www.instagram.com/perfumesoriginalespalm/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-icon"
            aria-label="Síguenos en Instagram"
          >
            <InstagramIcon />
            <span className="hidden text-sm font-medium tracking-wide sm:inline">
              Instagram
            </span>
          </a>
          <a
            href="https://wa.me/573117980861"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-icon"
            aria-label="Contáctanos por WhatsApp"
          >
            <WhatsAppIcon />
            <span className="hidden text-sm font-medium tracking-wide sm:inline">
              WhatsApp
            </span>
          </a>
        </div>
      </header>

      <section className="gold-band">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-4 px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-[#111] md:text-sm">
          <span>Perfumes 100% Originales</span>
          <span className="hidden md:inline">•</span>
          <span>Atención Personalizada</span>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/80 py-5 backdrop-blur-md">
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 md:grid-cols-[2fr_1fr_1fr]">
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded border border-[#333] bg-[#141414] px-5 py-3 text-sm text-white outline-none transition focus:border-[#d4af37] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.22)]"
          />
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded border border-[#333] bg-[#141414] px-5 py-3 text-sm text-white outline-none transition focus:border-[#d4af37] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.22)]"
          >
            <option value="all">Todas las marcas</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded border border-[#333] bg-[#141414] px-5 py-3 text-sm text-white outline-none transition focus:border-[#d4af37] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.22)]"
          >
            <option value="default">Orden por defecto</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-6 text-sm text-[#888]">
        {filteredProducts.length} producto(s) encontrados
      </section>

      {filteredProducts.length === 0 ? (
        <div className="mx-auto my-16 max-w-6xl px-5 text-center text-[#aaa] animate-fade-in-up">
          <p>No se encontraron productos con esos filtros.</p>
          <p className="mt-3">
            ¿No encuentras lo que buscas? Contáctanos en nuestro{" "}
            <a
              href="https://wa.me/573117980861"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-white"
            >
              WhatsApp
            </a>{" "}
            o{" "}
            <a
              href="https://www.instagram.com/perfumesoriginalespalm/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-white"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      ) : (
        <section className="catalog-bg-wrap relative mx-auto w-full max-w-6xl px-5 pb-16">
          <div className="catalog-particles pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl" />
          <div className="catalog-transition grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {filteredProducts.map((product, index) => (
              <article
                key={`${product.brand}-${product.name}-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="luxury-card group flex min-h-[390px] flex-col rounded-lg border border-[#222] bg-[#141414] p-4"
                style={{
                  animationDelay: `${Math.min((index % 12) * 0.08, 0.9)}s`,
                }}
              >
                <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-md bg-white p-2">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="mb-2 text-[11px] font-semibold tracking-[2px] text-[#d4af37]">
                  {product.brand}
                </div>
                <div className="mb-4 flex-grow font-[var(--font-playfair)] text-lg leading-snug text-white">
                  {product.name}
                </div>
                <div className="border-t border-[#222] pt-3 text-base font-medium tracking-wide text-white">
                  {formatPrice(product.price)}
                </div>
                <a
                  href={`https://wa.me/573117980861?text=${encodeURIComponent(
                    `Estoy interesado en ${product.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center rounded bg-[#d4af37] px-4 py-2 text-sm font-medium text-[#0a0a0a] transition duration-300 hover:scale-[1.03] hover:bg-white hover:text-[#b38f22]"
                >
                  Preguntar
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mb-8 mt-2 w-full max-w-6xl px-5">
        <div className="rounded-xl border border-[#d4af37]/40 bg-gradient-to-r from-[#d4af37]/15 via-[#d4af37]/5 to-transparent p-5 text-center shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#e8cc72]">
            Experiencia Premium L&apos;Essence
          </h2>
          <p className="mt-2 text-sm text-[#ddd] md:text-base">
            Catálogo curado con fragancias exclusivas, asesoría personalizada y
            atención directa por WhatsApp.
          </p>
        </div>
      </section>

      <footer className="mt-10 border-t border-[#d4af37]/20 px-5 py-10 text-center text-sm text-[#888]">
        ¿No encuentras algún perfume? Contáctanos en nuestro{" "}
        <a
          href="https://wa.me/573117980861"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d4af37] hover:text-white"
        >
          WhatsApp
        </a>{" "}
        o{" "}
        <a
          href="https://www.instagram.com/perfumesoriginalespalm/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d4af37] hover:text-white"
        >
          Instagram
        </a>
        .
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        className={`pulse-gold fixed bottom-6 right-6 h-11 w-11 rounded-full bg-[#d4af37]/80 text-xl text-[#0a0a0a] backdrop-blur-sm transition ${
          showBackToTop ? "opacity-100" : "pointer-events-none opacity-0"
        } hover:scale-110 hover:bg-[#d4af37]`}
      >
        ↑
      </button>
    </div>
  );
}
