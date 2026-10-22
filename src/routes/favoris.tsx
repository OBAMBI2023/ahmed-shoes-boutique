import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { EmptyState, PageTitle, ProductCard } from "@/components/shop";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/favoris")({
  head: () => seo("Mes favoris", "Retrouvez vos chaussures préférées AHMED SHOES."),
  component: Favoris,
});

function Favoris() {
  const { favorites } = useStore();
  const list = PRODUCTS.filter((p) => favorites.includes(p.id));
  return (
    <div>
      <PageTitle title="Mes favoris" subtitle={list.length ? `${list.length} paire${list.length > 1 ? "s" : ""} sauvegardée${list.length > 1 ? "s" : ""}` : undefined} />
      {list.length === 0 ? (
        <EmptyState icon={Heart} title="Aucun favori" text="Touchez le cœur sur un modèle pour le retrouver ici." />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
