import type { Product } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle>{product.name}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{product.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription>{product.description}</CardDescription>
        <CardFooter>{formatValueToCurrency(product.price)}</CardFooter>
      </CardContent>
    </Card>
  );
}
