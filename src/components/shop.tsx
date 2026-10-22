import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, ShoppingBag, Store, User } from "lucide-react";
import { formatFCFA, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("font-display leading-none tracking-[0.18em] text-foreground", className)}>
      <span className="text-2xl font-semibold">AHMED</span>
      <span className="ml-2 text-2xl font-light italic text-blush-deep">SHOES</span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/boutique", label: "Boutique", icon: Store },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/panier", label: "Panier", icon: ShoppingBag },
  { to: "/profil", label: "Profil", icon: User },
] as const;

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush-deep px-1 text-[10px] font-bold text-primary-foreground">
      {n}
    </span>
  );
}

export function Header() {
  const { cartCount, favorites } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV.slice(0, 2).map((n) => (
            <Link key={n.to} to={n.to} className={cn("transition-colors hover:text-blush-deep", path === n.to ? "font-semibold" : "text-muted-foreground")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/favoris" className="relative" aria-label="Favoris"><Heart className="h-5 w-5" /><Badge n={favorites.length} /></Link>
          <Link to="/panier" className="relative" aria-label="Panier"><ShoppingBag className="h-5 w-5" /><Badge n={cartCount} /></Link>
          <Link to="/profil" aria-label="Profil"><User className="h-5 w-5" /></Link>
        </div>
        <Link to="/panier" className="relative md:hidden" aria-label="Panier"><ShoppingBag className="h-5 w-5" /><Badge n={cartCount} /></Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { cartCount, favorites } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <ul className="flex items-center justify-between rounded-full bg-primary px-3 py-2 shadow-float">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          const Icon = n.icon;
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all",
                  active ? "bg-blush text-foreground" : "text-primary-foreground/70",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {n.to === "/panier" && <Badge n={cartCount} />}
                  {n.to === "/favoris" && !active && <Badge n={favorites.length} />}
                </span>
                {active && <span>{n.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FavButton({ id, className }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useStore();
  const fav = isFavorite(id);
  return (
    <button
      type="button"
      aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow-soft transition-transform active:scale-90", className)}
    >
      <Heart className={cn("h-4 w-4", fav ? "fill-blush-deep text-blush-deep" : "text-foreground")} />
    </button>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/produit/$id" params={{ id: p.id }} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-blush">
        <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <FavButton id={p.id} className="absolute right-3 top-3" />
        {p.isNew && <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Nouveau</span>}
      </div>
      <div className="mt-3 px-1">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.category}</p>
        <h3 className="mt-0.5 font-sans text-sm font-semibold">{p.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold">{formatFCFA(p.price)}</span>
          {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatFCFA(p.oldPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-card px-6 py-16 text-center shadow-soft">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-blush"><Icon className="h-7 w-7" /></div>
      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>
      <Link to="/boutique" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Découvrir la boutique</Link>
    </div>
  );
}
