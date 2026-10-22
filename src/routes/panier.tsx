import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatFCFA, getProduct } from "@/lib/products";
import { EmptyState, PageTitle } from "@/components/shop";
import { deliveryFor, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/panier")({
  head: () => seo("Mon panier", "Votre panier AHMED SHOES."),
  component: Panier,
});

export function Summary() {
  const { subtotal } = useStore();
  const delivery = deliveryFor(subtotal);
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span className="font-semibold">{formatFCFA(subtotal)}</span></div>
      <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span className="font-semibold">{delivery ? formatFCFA(delivery) : "Offerte"}</span></div>
      <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-semibold">Total</span><span className="font-bold">{formatFCFA(subtotal + delivery)}</span></div>
    </div>
  );
}

function Panier() {
  const { cart, setQty, removeFromCart } = useStore();
  if (cart.length === 0)
    return (<div><PageTitle title="Mon panier" /><EmptyState icon={ShoppingBag} title="Votre panier est vide" text="Ajoutez vos modèles préférés pour passer commande." /></div>);

  return (
    <div>
      <PageTitle title="Mon panier" />
      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {cart.map((i) => {
            const p = getProduct(i.id);
            if (!p) return null;
            return (
              <li key={`${i.id}-${i.size}`} className="flex items-center gap-4 rounded-3xl bg-card p-3 shadow-soft">
                <Link to="/produit/$id" params={{ id: p.id }} className="shrink-0"><img src={p.image} alt={p.name} loading="lazy" width={96} height={96} className="h-20 w-20 rounded-2xl bg-blush object-cover" /></Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Pointure {i.size} · {p.color}</p>
                  <p className="mt-1 text-sm font-bold">{formatFCFA(p.price * i.qty)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(i.id, i.size)} aria-label="Supprimer" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-1 py-1">
                    <button onClick={() => setQty(i.id, i.size, i.qty - 1)} aria-label="Moins" className="grid h-6 w-6 place-items-center rounded-full bg-card"><Minus className="h-3 w-3" /></button>
                    <span className="w-4 text-center text-xs font-bold">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.size, i.qty + 1)} aria-label="Plus" className="grid h-6 w-6 place-items-center rounded-full bg-card"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold">Récapitulatif</h2>
          <Summary />
          <Link to="/commande" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground">Passer commande <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Livraison offerte dès 50 000 FCFA</p>
        </aside>
      </div>
    </div>
  );
}
