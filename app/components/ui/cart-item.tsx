import { Link, useFetcher } from "@remix-run/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { formatValueToCurrency } from "~/utils";
import { Button, Input, Separator } from "~/components";

function calculateCartItem({
  product,
  quantity,
}: {
  product: any;
  quantity: number;
}) {
  return { product, quantity, min: 1, max: product.stockQuantity };
}

export function CartItem({
  cart,
  cartItem,
  product,
  quantity,
}: {
  cart: any;
  cartItem: any;
  product: any;
  quantity: number;
}) {
  const cartItemFetcher = useFetcher();

  if (!product) return null;
  const { min, max } = calculateCartItem({ product, quantity });

  let cartItemQuantity = quantity;
  let cartItemDeleting = false;

  if (cartItemFetcher.submission) {
    const values = Object(cartItemFetcher.submission.formData);
    if (values._action === "increment-item-in-cart") {
      cartItemQuantity = Number(values.quantity) + 1;
    }
    if (values._action === "decrement-item-in-cart") {
      cartItemQuantity = Number(values.quantity) - 1;
    }
    if (values._action === "delete-item-in-cart") {
      cartItemDeleting = true;
    }
  }

  const isMoreThanMax = Boolean(Number(cartItemQuantity) + min >= max + min);
  const isLessThanMin = Boolean(Number(cartItemQuantity) - min <= 0);

  return (
    <div className="flex flex-col" hidden={cartItemDeleting}>
      <div className="flex">
        <Link to={`/products/${product?.slug}`}>
          <img
            className="w-24 rounded border-slate-200 shadow-md"
            src={product.imageURL}
            alt={product.name}
          />
        </Link>

        <Separator orientation="vertical" className="mx-2" />

        <div className="flex flex-col items-start justify-center">
          <Link to={`/products/${product?.slug}`}>
            <h3 className="font-semibold">{cartItem?.product.name}</h3>
          </Link>
          <p>
            <span>{cartItem?.quantity}</span> x{" "}
            {formatValueToCurrency(cartItem.product.price)}
          </p>
          <h2 className="text-xl font-semibold">
            {formatValueToCurrency(cartItem.totalPrice)}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm">
          <span>Available stock: </span>
          <span className="font-bold">{product?.stockQuantity} pcs</span>
        </p>

        {/* CART ITEM COUNTER */}
        <div>
          <div className="mx-6 flex items-center gap-2">
            {/* DECREMENT */}
            <cartItemFetcher.Form method="post" action="/cart">
              <Button
                data-action-id="decrement-cart"
                type="submit"
                disabled={isLessThanMin}
                variant={isLessThanMin ? "disabled" : "outline"}
                className="border-zinc-400">
                <AiOutlineMinus className="text-sm" />
              </Button>
              <input
                type="hidden"
                name="_action"
                value="decrement-item-in-cart"
              />
              <input type="hidden" name="cartItemId" value={cartItem?.id} />
              <input
                type="hidden"
                name="productId"
                value={cartItem?.productId}
              />
              <input
                type="hidden"
                name="quantity"
                disabled={isLessThanMin}
                value={Math.max(min, Number(cartItemQuantity) - min)}
              />
            </cartItemFetcher.Form>
            {/* DECREMENT */}

            {/* QUANTITY */}
            <div>
              <Input
                disabled
                className="text-center w-12 bg-slate-100 disabled:cursor-default"
                value={Number(cartItemQuantity)}
              />
            </div>
            {/* QUANTITY */}

            {/* INCREMENT */}
            <cartItemFetcher.Form method="POST" action="/cart">
              <Button
                data-action-id="decrement-cart"
                type="submit"
                disabled={isMoreThanMax}
                variant={isMoreThanMax ? "disabled" : "outline"}
                className="border-zinc-400">
                <AiOutlinePlus className="text-sm" />
              </Button>
              <input
                type="hidden"
                name="_action"
                value="increment-item-in-cart"
              />
              <input type="hidden" name="cartItemId" value={cartItem?.id} />
              <input
                type="hidden"
                name="productId"
                value={cartItem?.productId}
              />
              <input
                type="hidden"
                name="quantity"
                disabled={isMoreThanMax}
                value={Math.min(Number(cartItemQuantity) + min, max)}
              />
            </cartItemFetcher.Form>
            {/* INCREMENT */}

            {/* DELETE */}
            <cartItemFetcher.Form method="post" action="/cart" className="mr-8">
              <Button
                type="submit"
                data-action-id="remove-from-cart"
                className="block">
                <span className="sr-only">Remove from Cart</span>
                <MdOutlineDelete className="text-lg text-white" />
              </Button>
              <input type="hidden" name="_action" value="delete-item-in-cart" />
              <input type="hidden" name="cartItemId" value={cartItem?.id} />
              <input type="hidden" name="orderItemId" value={cartItem?.id} />
            </cartItemFetcher.Form>
            {/* DELETE */}
          </div>
        </div>
      </div>
      <Separator className="my-2" />
    </div>
  );
}
