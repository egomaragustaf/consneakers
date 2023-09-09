import { json } from "@remix-run/node";
import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Layout,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components";
import { prisma } from "~/db.server";
import type { getShoppingCart } from "~/models/cart.server";
import { authenticator } from "~/services";
import { formatValueToCurrency } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Checkout" }, { name: "description", content: "Checkout" }];
};

type LoaderData = {
  cart: Awaited<ReturnType<typeof getShoppingCart>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!userSession.id) return null;

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  return json({ cart });
};

export default function Route() {
  const { cart } = useLoaderData<LoaderData>();
  const totalItemCount =
    cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const grandTotal =
    cart?.cartItems.reduce((acc, item) => acc + item.totalPrice, 0) ?? 0;

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex lg:flex-row flex-col gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-4 lg:w-2/3 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>Checkout</h1>
            </header>

            <main className="flex flex-col gap-4">
              <h2>Delivery Address</h2>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-fit">
                    + Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                    <DialogDescription>
                      Add your shipping address
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Name"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="label" className="text-right">
                        Label
                      </label>
                      <Input
                        id="label"
                        placeholder="Label"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="username" className="text-right">
                        Username
                      </label>
                      <Input
                        id="username"
                        placeholder="username"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="address" className="text-right">
                        Address
                      </label>
                      <Input
                        id="address"
                        placeholder="Address"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="country" className="text-right">
                        Country
                      </label>
                      <Input
                        id="country"
                        placeholder="Country"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="city" className="text-right">
                        City
                      </label>
                      <Input
                        id="city"
                        placeholder="City"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="district" className="text-right">
                        District
                      </label>
                      <Input
                        id="district"
                        placeholder="District"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="subdistrict" className="text-right">
                        Sub District
                      </label>
                      <Input
                        id="subdistrict"
                        placeholder="Sub District"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="postalcode" className="text-right">
                        Postal Code
                      </label>
                      <Input
                        id="postalcode"
                        placeholder="Postal Code"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="latitude" className="text-right">
                        Latitude
                      </label>
                      <Input
                        id="latitude"
                        placeholder="Latitude"
                        className="col-span-3 border"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="longitude" className="text-right">
                        Longitude
                      </label>
                      <Input
                        id="longitude"
                        placeholder="Longitude"
                        className="col-span-3 border"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex gap-x-4">
                    <Button
                      type="submit"
                      className="bg-zinc-800 hover:bg-zinc-700">
                      Add Address
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </main>
          </section>

          <section className="flex flex-col gap-4 lg:w-1/3 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>Summary</h1>
            </header>

            <Table className="bg-zinc-100 rounded">
              <TableBody>
                <TableRow>
                  <TableCell>Total Product:</TableCell>
                  <TableCell>{totalItemCount}</TableCell>
                </TableRow>
                <TableRow className="text-lg font-bold text-zinc-800">
                  <TableCell>Total Price:</TableCell>
                  <TableCell>{formatValueToCurrency(grandTotal)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </article>
      </main>
    </Layout>
  );
}
