import { parse } from "@conform-to/zod";
import type { ActionArgs, V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import {
  AddNewUserLocationForm,
  Button,
  Dialog,
  DialogTrigger,
  Layout,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { schemaAddNewUserLocation } from "~/schemas";
import { formatValueToCurrency } from "~/utils";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Checkout" }, { name: "description", content: "Checkout" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!userSession.id) return redirect("/login");

  const user = await prisma.user.findFirst({
    where: { id: userSession.id },
    include: { locations: { take: 1 } },
  });

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  return json({ user, cart, cartItems: cart?.cartItems });
};

export default function Route() {
  const { user, cart, cartItems } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex lg:flex-row flex-col gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-10 lg:w-2/3 max-w-3xl">
            <header className="flex gap-4 font-bold">
              <Link to={"/cart"}>
                <AiOutlineArrowLeft className="text-4xl text-primary" />
              </Link>
              <h1 className="text-2xl">Checkout</h1>
            </header>

            <main className="flex flex-col gap-4">
              <h2>Your Cart</h2>
              {cartItems?.map((cartItem) => {
                return (
                  <div className="flex flex-col" key={cartItem?.id}>
                    <div className="flex">
                      <Link to={`/products/${cartItem?.product?.slug}`}>
                        <img
                          className="w-20 rounded border-slate-200 shadow-md"
                          src={cartItem?.product?.imageURL || ""}
                          alt={cartItem?.product?.name}
                        />
                      </Link>

                      <Separator orientation="vertical" className="mx-2" />

                      <div className="flex flex-col items-start justify-center">
                        <Link to={`/products/${cartItem?.product?.slug}`}>
                          <h3 className="font-medium">
                            {cartItem?.product.name}
                          </h3>
                        </Link>
                        <p>
                          <span>{cartItem?.quantity}</span> x{" "}
                          {formatValueToCurrency(cartItem.product.price)}
                        </p>
                        <h2 className="text-base font-medium">
                          {formatValueToCurrency(cartItem.totalPrice)}
                        </h2>
                      </div>
                    </div>

                    <Separator className="my-2" />
                  </div>
                );
              })}

              <h2>Your Adress</h2>

              {user?.locations.map((location) => {
                return (
                  <div key={location.id}>
                    <Table className="bg-zinc-100 rounded">
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-left w-36">
                            Label
                          </TableCell>
                          <TableCell className="text-left w-4">:</TableCell>
                          <TableCell className="text-left w-96 font-semibold text-base">
                            {location.label}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-left w-36">
                            Adrress
                          </TableCell>
                          <TableCell className="text-left w-4">:</TableCell>
                          <TableCell className="text-left w-96">
                            {location.subDistrict}, {location.district},{" "}
                            {location.city}, {location.province},{" "}
                            {location.countryCode}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-left w-36">
                            Street Detail
                          </TableCell>
                          <TableCell className="text-left w-4">:</TableCell>
                          <TableCell className="text-left w-96">
                            {location.streetDetails}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-left w-36">
                            Coordinate
                          </TableCell>
                          <TableCell className="text-left w-4">:</TableCell>
                          <TableCell className="text-left w-96">
                            {location.latitude}, {location.longitude}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                );
              })}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="w-fit bg-zinc-800 hover:bg-zinc-700">
                    + Add Address
                  </Button>
                </DialogTrigger>

                <AddNewUserLocationForm open={open} setOpen={setOpen} />
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
                  <TableCell>{cart?.totalQuantity}</TableCell>
                </TableRow>
                <TableRow className="text-lg font-bold text-zinc-800">
                  <TableCell>Total Price:</TableCell>
                  <TableCell>
                    {formatValueToCurrency(cart?.grandTotalPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </article>
      </main>
    </Layout>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaAddNewUserLocation });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const userSession = await authenticator.isAuthenticated(request);
  if (!userSession?.id) {
    return json(submission, { status: 401 });
  }

  try {
    const newUserLocation = await prisma.userLocation.create({
      data: { ...submission.value, userId: userSession.id },
    });

    if (!newUserLocation) {
      return json(submission, { status: 500 });
    }
    return json(submission, { status: 200 });
  } catch (error) {
    return json(submission, { status: 500 });
  }
};
