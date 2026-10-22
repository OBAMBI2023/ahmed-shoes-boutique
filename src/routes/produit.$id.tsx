import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { formatFCFA, getProduct, PRODUCTS, SIZES } from "@/lib/products";
import { FavButton, ProductCard } from "@/components/shop";
import { MAX_QTY, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produit/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProduct(loaderData.id) : undefined;
    const t = p ? `${p.name} — AHMED SHOES` : "Produit — AHMED SHOES";
    const d = p ? `${p.name}, ${p.category.toLowerCase()} ${p.color.toLowerCase()} à ${formatFCFA(p.price)}.` : "Fiche produit AHMED SHOES";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center"><h1 className="text-3xl">Modèle introuvable</h1><Link to="/boutique" className="mt-4 inline-block underline">Retour à la boutique</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useLoaderData();
  const p = getProduct(id)!;
  const router = useRouter();
  const { addToCart } = useStore();
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState(false);

  const add = () => {
    if (!size) { setErr(true); return; }
    addToCart(p.id, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative overflow-hidden rounded-4xl bg-blush">
          <img src={p.image} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover" />
          <button onClick={() => router.history.back()} aria-label="Retour" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-soft"><ArrowLeft className="h-4 w-4" /></button>
          <FavButton id={p.id} className="absolute right-4 top-4 h-10 w-10" />
        </div>

        <div className="md:py-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blush-deep">{p.category}</p>
          <h1 className="mt-2 text-5xl font-semibold">{p.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Couleur : {p.color}</p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatFCFA(p.price)}</span>
            {p.oldPrice && <span className="text-muted-foreground line-through">{formatFCFA(p.oldPrice)}</span>}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Choisir la pointure</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const ok = p.sizes.includes(s);
                return (
                  <button key={s} disabled={!ok} onClick={() => { setSize(s); setErr(false); }}
                    className={cn("h-11 w-12 rounded-2xl border text-sm font-semibold transition-colors",
                      size === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                      !ok && "cursor-not-allowed opacity-30 line-through")}>
                    {s}
                  </button>
                );
              })}
            </div>
            {err && <p className="mt-2 text-xs font-medium text-destructive">Veuillez choisir une pointure.</p>}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Moins" className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-5 text-center text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(Math.min(MAX_QTY, qty + 1))} disabled={qty >= MAX_QTY} aria-label="Plus" className="grid h-8 w-8 place-items-center rounded-full bg-secondary disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <button onClick={add} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]">
              {added ? <><Check className="h-4 w-4" /> Ajouté au panier</> : "Ajouter au panier"}
            </button>
          </div>
          {added && <Link to="/panier" className="mt-3 block text-center text-sm font-semibold text-blush-deep underline">Voir mon panier</Link>}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-5 text-3xl font-semibold">Vous aimerez aussi</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
          {PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}
        </div>
      </section>
    </div>
  );
}
