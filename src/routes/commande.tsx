import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Info } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/shop";
import { formatFCFA, getProduct } from "@/lib/products";
import { deliveryFor, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";
import { Summary } from "./panier";

type Receipt = {
  name: string;
  lines: { key: string; label: string; total: number }[];
  total: number;
};

// 8 à 15 chiffres, espaces/points/tirets tolérés, "+" optionnel en tête.
const PHONE_RE = /^\+?(?:[\s.-]?\d){8,15}$/;

export const Route = createFileRoute("/commande")({
  head: () => seo("Commande", "Formulaire de commande de démonstration AHMED SHOES."),
  component: Commande,
});

const field = "w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-sm outline-none focus:border-ring";

function Commande() {
  const { cart, clearCart, subtotal } = useStore();
  const [done, setDone] = useState<Receipt | null>(null);
  const [phoneErr, setPhoneErr] = useState(false);

  if (done)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-4xl bg-card px-6 py-14 text-center shadow-soft">
        <CheckCircle2 className="h-14 w-14 text-blush-deep" />
        <h1 className="mt-4 text-4xl font-semibold">Merci, {done.name} !</h1>
        <ul className="mt-5 w-full space-y-1 text-left text-sm">
          {done.lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-3">
              <span>{l.label}</span>
              <span className="font-semibold">{formatFCFA(l.total)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatFCFA(done.total)}</span>
          </li>
        </ul>
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
            const data = new FormData(e.currentTarget);
            if (!PHONE_RE.test(String(data.get("phone") || "").trim())) {
              setPhoneErr(true);
              return;
            }
            const name = String(data.get("name") || "").trim().split(/\s+/)[0] ?? "";
            const lines = cart.flatMap((i) => {
              const p = getProduct(i.id);
              return p
                ? [{ key: `${i.id}-${i.size}`, label: `${p.name} · P${i.size} × ${i.qty}`, total: p.price * i.qty }]
                : [];
            });
            setDone({ name, lines, total: subtotal + deliveryFor(subtotal) });
            clearCart();
          }}
          className="space-y-4"
        >
          <input required name="name" placeholder="Nom complet" className={field} />
          <div>
            <input
              required
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="Téléphone (ex. +221 77 123 45 67)"
              aria-invalid={phoneErr}
              onChange={() => setPhoneErr(false)}
              className={field}
            />
            {phoneErr && (
              <p className="mt-1.5 px-1 text-xs font-medium text-destructive">
                Numéro invalide : 8 à 15 chiffres, avec « + » possible au début.
              </p>
            )}
          </div>
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
