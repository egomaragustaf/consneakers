import type { Product } from "@prisma/client";
import { AiFillStar } from "react-icons/ai";

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
    soldQuantity: number;
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
        <CardFooter>
          <span>{formatValueToCurrency(product.price)}</span>
          <div className="text-yellow-400 flex items-center justify-start gap-1">
            <AiFillStar className="text-xl" />
            {product.soldQuantity > 30 && (
              <p className="text-sm text-black font-normal">5</p>
            )}
            {product.soldQuantity <= 30 && (
              <p className="text-sm text-black font-normal">3</p>
            )}
            <span className="text-sm text-black font-normal">
              ({product.soldQuantity} sold)
            </span>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
