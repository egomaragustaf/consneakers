import type { Product } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components";
import { formatValueToCurrency } from "~/utils";

interface Props {
  product: Product & {
    slug: string;
    imageURL: string;
    name: string;
    price: number;
    soldQuantity: number | null;
    description: string;
  };
}

export function ProductCard({ product }: Props) {
  return (
    <Card>
      <CardHeader>
        <img
          src={product.imageURL}
          alt={product.slug}
          className="rounded-t-lg h-auto w-auto object-fit"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardFooter>{formatValueToCurrency(product.price)}</CardFooter>
      </CardContent>
    </Card>
  );
}
