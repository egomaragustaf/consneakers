import type { Product } from "@prisma/client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  product: Product & {
    name: string;
    price: number;
    description: string;
  };
}

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardHeader>
        <img src="https://via.placeholder.com/192x192" alt="dummy" />
      </CardHeader>
      <CardTitle>{product.name}</CardTitle>
      <CardDescription>{product.description}</CardDescription>
      <CardFooter>Rp {product.price.toLocaleString("id-ID")}</CardFooter>
    </Card>
  );
}
