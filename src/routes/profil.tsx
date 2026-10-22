import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart, MapPin, Phone, ShoppingBag } from "lucide-react";
import { PageTitle } from "@/components/shop";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/profil")({
  head: () => seo("Mon profil", "Votre espace AHMED SHOES."),
  component: Profil,
});

function Profil() {
  const { favorites, cartCount } = useStore();
  return (
    <div className="mx-auto max-w-xl">
      <PageTitle title="Mon profil" />
      <div className="flex items-center gap-4 rounded-3xl bg-primary p-6 text-primary-foreground">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blush font-display text-2xl font-semibold text-foreground">A</div>
        <div><p className="font-display text-2xl">Bienvenue chez AHMED SHOES</p><p className="text-sm opacity-70">Votre style, votre signature.</p></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/favoris" className="rounded-3xl bg-card p-5 shadow-soft"><Heart className="h-5 w-5 text-blush-deep" /><p className="mt-3 text-2xl font-bold">{favorites.length}</p><p className="text-xs text-muted-foreground">Favoris</p></Link>
        <Link to="/panier" className="rounded-3xl bg-card p-5 shadow-soft"><ShoppingBag className="h-5 w-5 text-blush-deep" /><p className="mt-3 text-2xl font-bold">{cartCount}</p><p className="text-xs text-muted-foreground">Articles au panier</p></Link>
      </div>
      <ul className="mt-4 divide-y divide-border rounded-3xl bg-card shadow-soft">
        {[
          { icon: MapPin, t: "Boutique", d: "Adresse à compléter" },
          { icon: Phone, t: "Service client", d: "Numéro à compléter" },
        ].map(({ icon: I, t, d }) => (
          <li key={t} className="flex items-center gap-4 p-5">
            <I className="h-5 w-5 shrink-0" />
            <div className="flex-1"><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </div>
  );
}
