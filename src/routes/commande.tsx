import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Info } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/shop";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { Summary } from "./panier";

export const Route = createFileRoute("/commande")({
  head: () => seo("Commande", "Formulaire de commande de démonstration AHMED SHOES."),
  component: Commande,
});

const field = "w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-sm outline-none focus:border-ring";

function Commande() {
  const { cart, clearCart } = useStore();
  const [done, setDone] = useState<string | null>(null);

  if (done)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-4xl bg-card px-6 py-14 text-center shadow-soft">
        <CheckCircle2 className="h-14 w-14 text-blush-deep" />
        <h1 className="mt-4 text-4xl font-semibold">Merci, {done} !</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ceci est une démonstration : aucune commande n'a été envoyée et aucun paiement n'a été effectué.</p>
        <Link to="/boutique" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Continuer mes achats</Link>
      </div>
    );

  if (cart.length === 0)
    return (<div className="py-16 text-center"><PageTitle title="Commande" subtitle="Votre panier est vide." /><Link to="/boutique" className="underline">Aller à la boutique</Link></div>);

  return (
    <div>
      <PageTitle title="Finaliser la commande" />
      <div className="mb-6 flex gap-3 rounded-2xl bg-blush p-4 text-sm text-accent-foreground">
        <Info className="h-5 w-5 shrink-0" />
        <p>Formulaire de démonstration : aucune donnée n'est transmise et aucun paiement n'est demandé.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = String(new FormData(e.currentTarget).get("name") || "").split(" ")[0];
            clearCart();
            setDone(name);
          }}
          className="space-y-4"
        >
          <input required name="name" placeholder="Nom complet" className={field} />
          <input required name="phone" type="tel" placeholder="Téléphone" className={field} />
          <input required name="city" placeholder="Ville" className={field} />
          <textarea required name="address" placeholder="Adresse de livraison" rows={3} className={field} />
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">Mode de paiement (démo)</legend>
            {["Paiement à la livraison", "Mobile Money"].map((m, i) => (
              <label key={m} className="flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3.5 text-sm">
                <input type="radio" name="pay" defaultChecked={i === 0} className="accent-primary" /> {m}
              </label>
            ))}
          </fieldset>
          <button className="w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground">Confirmer la commande (démo)</button>
        </form>
        <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-2xl font-semibold">Récapitulatif</h2>
          <Summary />
        </aside>
      </div>
    </div>
  );
}
