import { Link, useFetcher } from "@remix-run/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { cn, formatValueToCurrency } from "~/utils";
import { Separator } from "~/components";

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
            className="w-28 rounded border-slate-200 shadow-md"
            src={product.imageURL}
            alt={product.name}
          />
        </Link>

        <Separator orientation="vertical" className="mx-2" />

        <div className="flex flex-col items-start justify-center">
          <Link to={`/products/${product?.slug}`}>
            <h3 className="text-brand-900">{cartItem?.product.name}</h3>
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
            {/* DELETE */}
            <cartItemFetcher.Form method="post" action="/cart" className="mr-8">
              <button
                type="submit"
                data-action-id="remove-from-cart"
                className="block">
                <span className="sr-only">Hapus dari keranjang</span>
                <MdOutlineDelete className="h-6 w-6 text-gray-500 hover:text-red-800" />
              </button>
              <input type="hidden" name="_action" value="delete-item-in-cart" />
              <input type="hidden" name="cartItemId" value={cartItem?.id} />
              <input type="hidden" name="orderItemId" value={cartItem?.id} />
            </cartItemFetcher.Form>
            {/* DELETE */}

            {/* DECREMENT */}
            <cartItemFetcher.Form method="post" action="/cart">
              <button
                data-action-id="decrement-cart"
                type="submit"
                disabled={isLessThanMin}
                className={cn(
                  "text-green-500 hover:text-green-800",
                  isLessThanMin && "text-gray-300 hover:text-gray-300"
                )}>
                <AiOutlineMinus className="h-6 w-6" />
              </button>
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
              <input
                className="h-8 w-14 rounded border-gray-200 bg-gray-50 p-0 text-center text-gray-600 [-moz-appearance:_textfield] focus-visible:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                disabled
                value={Number(cartItemQuantity)}
              />
              <span className="sr-only">{Number(cartItemQuantity)} pieces</span>
            </div>
            {/* QUANTITY */}

            {/* INCREMENT */}
            <cartItemFetcher.Form method="POST" action="/cart">
              <button
                data-action-id="increment-cart"
                type="submit"
                disabled={isMoreThanMax}
                className={cn(
                  "text-green-500 hover:text-green-800",
                  isMoreThanMax && "text-gray-300 hover:text-gray-300"
                )}>
                <AiOutlinePlus className="h-6 w-6" />
              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
