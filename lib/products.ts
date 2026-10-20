export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  warranty: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "novabook-air",
    name: "NovaBook Air",
    category: "Laptops",
    price: 185000,
    priceFormatted: "LKR 185,000",
    warranty: "2 years",
    description:
      "A lightweight laptop designed for everyday productivity and work.",
    image: "/images/novabook-air.jpg",
  },
  {
    id: "novabook-pro",
    name: "NovaBook Pro",
    category: "Laptops",
    price: 265000,
    priceFormatted: "LKR 265,000",
    warranty: "2 years",
    description:
      "A high-performance laptop for demanding workloads and creative projects.",
    image: "/images/novabook-pro.jpg",
  },
  {
    id: "novabuds",
    name: "NovaBuds",
    category: "Audio",
    price: 12500,
    priceFormatted: "LKR 12,500",
    warranty: "6 months",
    description:
      "Wireless earbuds designed for everyday listening and convenient portability.",
    image: "/images/novabuds.jpg",
  },
  {
    id: "novacharge-65w",
    name: "NovaCharge 65W",
    category: "Accessories",
    price: 4500,
    priceFormatted: "LKR 4,500",
    warranty: "3 months",
    description:
      "A compact 65W charger for compatible electronic devices.",
    image: "/images/novacharge-65w.jpg",
  },
];
