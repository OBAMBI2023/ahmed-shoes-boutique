import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export type Category = "Escarpins" | "Bottines" | "Baskets" | "Sandales" | "Mules" | "Ballerines";
export const CATEGORIES: Category[] = ["Escarpins", "Sandales", "Bottines", "Baskets", "Mules", "Ballerines"];
export const SIZES = [36, 37, 38, 39, 40, 41, 42];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  color: string;
  sizes: number[];
  description: string;
  isNew?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: "escarpin-nude-celeste", name: "Escarpin Céleste", category: "Escarpins", price: 32000, oldPrice: 39000, image: p1, color: "Nude verni", sizes: [36, 37, 38, 39, 40], description: "Un escarpin pointu en cuir verni nude, talon aiguille de 11 cm. L'allié des soirées comme des journées au bureau.", isNew: true },
  { id: "bottine-noire-ines", name: "Bottine Inès", category: "Bottines", price: 45000, image: p2, color: "Noir", sizes: [37, 38, 39, 40, 41], description: "Bottine en cuir lisse noir, talon bloc de 8 cm et fermeture éclair latérale. Confort et allure toute la journée." },
  { id: "basket-rose-lina", name: "Basket Lina", category: "Baskets", price: 27500, image: p3, color: "Blanc & rose", sizes: [36, 37, 38, 39, 40, 41, 42], description: "Basket à semelle plateforme, empiècements rose poudré. Légère, moderne et facile à porter.", isNew: true },
  { id: "sandale-doree-amina", name: "Sandale Amina", category: "Sandales", price: 18500, oldPrice: 22000, image: p4, color: "Doré", sizes: [36, 37, 38, 39, 40, 41], description: "Sandale plate à brides fines dorées et bride de cheville ajustable. Idéale pour les journées ensoleillées." },
  { id: "mule-satin-rouge", name: "Mule Scarlett", category: "Mules", price: 29000, image: p5, color: "Rouge satin", sizes: [37, 38, 39, 40], description: "Mule en satin rouge avec nœud sculptural et petit talon de 5 cm. Une touche glamour irrésistible." },
  { id: "ballerine-sable-awa", name: "Ballerine Awa", category: "Ballerines", price: 16000, image: p6, color: "Sable", sizes: [36, 37, 38, 39, 40, 41, 42], description: "Ballerine en daim couleur sable ornée d'un petit nœud. Douceur et élégance au quotidien." },
  { id: "sandale-noire-nadia", name: "Sandale Nadia", category: "Sandales", price: 34000, image: p7, color: "Noir verni", sizes: [36, 37, 38, 39, 40], description: "Sandale à talon bloc de 10 cm en cuir verni noir, bride cheville à boucle dorée.", isNew: true },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/\u202f|\u00a0/g, " ") + " FCFA";
