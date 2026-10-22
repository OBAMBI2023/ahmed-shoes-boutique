import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/shop";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Chaussures pour femmes", "Escarpins, sandales, bottines et baskets pour femmes. Votre style, votre signature."),
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <div className="space-y-12">
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/boutique", search: { q } }); }} className="flex items-center gap-3 rounded-full bg-card px-5 py-3.5 shadow-soft md:hidden">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une paire..." className="w-full bg-transparent text-sm outline-none" />
      </form>

      <section className="relative overflow-hidden rounded-4xl bg-secondary">
        <img src={hero} alt="Escarpins AHMED SHOES sur socle en marbre" width={1280} height={768} className="h-[420px] w-full object-cover object-right md:h-[520px]" />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-background/90 via-background/50 to-transparent p-7 md:justify-center md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blush-deep">Nouvelle collection</p>
          <h1 className="mt-3 max-w-md text-5xl font-semibold leading-[0.95] md:text-7xl">Votre style, <em className="font-light">votre signature.</em></h1>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Des chaussures pensées pour chaque moment de votre vie.</p>
          <Link to="/boutique" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
            Découvrir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-3xl font-semibold">Catégories</h2>
        <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5">
          {CATEGORIES.map((c) => (
            <Link key={c} to="/boutique" search={{ cat: c }} className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Nos coups de cœur</h2>
          <Link to="/boutique" className="text-sm font-semibold text-blush-deep">Tout voir</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="rounded-4xl bg-primary p-8 text-primary-foreground md:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blush">Offre de saison</p>
        <h2 className="mt-2 text-4xl font-semibold md:text-5xl">Livraison offerte dès 50 000 FCFA</h2>
        <Link to="/boutique" className="mt-6 inline-flex items-center gap-2 rounded-full bg-blush px-6 py-3 text-sm font-semibold text-foreground">J'en profite <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Truck, t: "Livraison rapide", d: "Partout en ville sous 48h" },
          { icon: ShieldCheck, t: "Échange facile", d: "7 jours pour changer d'avis" },
          { icon: Sparkles, t: "Qualité premium", d: "Matières soigneusement choisies" },
        ].map(({ icon: I, t, d }) => (
          <div key={t} className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-soft">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush"><I className="h-5 w-5" /></div>
            <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
          </div>
        ))}
      </section>
    </div>
  );
}
