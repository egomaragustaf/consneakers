import type { Product } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components";

interface Props {
  product: Product & {
    slug: string;
    imageURL: string;
    name: string;
    price: number;
    description: string;
  };
}

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardHeader>
        <img src={product.imageURL} alt={product.slug} />
      </CardHeader>
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardFooter>Rp {product.price.toLocaleString("id-ID")}</CardFooter>
      </CardContent>
    </Card>
  );
}
