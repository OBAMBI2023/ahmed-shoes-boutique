import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { CATEGORIES, PRODUCTS, SIZES } from "@/lib/products";
import { PageTitle, ProductCard } from "@/components/shop";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

type S = { q?: string; cat?: string; size?: number };

export const Route = createFileRoute("/boutique")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    cat: typeof s.cat === "string" && s.cat ? s.cat : undefined,
    size: s.size ? Number(s.size) || undefined : undefined,
  }),
  head: () => seo("Boutique", "Parcourez toute la collection AHMED SHOES : filtrez par catégorie et par pointure."),
  component: Boutique,
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
      {children}
    </button>
  );
}

function Boutique() {
  const { q, cat, size } = Route.useSearch();
  const nav = useNavigate({ from: "/boutique" });
  const set = (patch: Partial<S>) => nav({ search: (p) => ({ ...p, ...patch }), replace: true });

  const list = useMemo(() => {
    const term = (q ?? "").toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!size || p.sizes.includes(size)) &&
        (!term || `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(term)),
    );
  }, [q, cat, size]);

  return (
    <div>
      <PageTitle title="Boutique" subtitle={`${list.length} modèle${list.length > 1 ? "s" : ""}`} />
      <div className="flex items-center gap-3 rounded-full bg-card px-5 py-3.5 shadow-soft">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input value={q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Rechercher un modèle, une couleur..." className="w-full min-w-0 bg-transparent text-sm outline-none" />
        {q && <button onClick={() => set({ q: undefined })} aria-label="Effacer"><X className="h-4 w-4" /></button>}
      </div>

      <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Catégorie</p>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        <Chip active={!cat} onClick={() => set({ cat: undefined })}>Toutes</Chip>
        {CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => set({ cat: c })}>{c}</Chip>)}
      </div>

      <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">Pointure</p>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        <Chip active={!size} onClick={() => set({ size: undefined })}>Toutes</Chip>
        {SIZES.map((s) => <Chip key={s} active={size === s} onClick={() => set({ size: s })}>{s}</Chip>)}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {list.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Aucun modèle ne correspond.{" "}
          <button className="font-semibold text-foreground underline" onClick={() => nav({ search: {} })}>Réinitialiser les filtres</button>
        </div>
      )}
    </div>
  );
}
