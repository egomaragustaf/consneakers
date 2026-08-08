import { parse } from "@conform-to/zod";
import { useLoaderData } from "react-router";
import { data, redirect } from "react-router";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";

import { prisma } from "~/db.server";
import { EditProductForm, Layout, Sidebar } from "~/components";
import { schemaUpdateProduct } from "~/schemas";
import { useRootLoaderData } from "~/hooks";
import { slugify } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Product" },
    { name: "description", content: "Edit Product" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.slug) {
    return { product: null };
  }

  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return { product };
}

export default function Route() {
  const { userSession, isAdmin } = useRootLoaderData();
  const { product } = useLoaderData<typeof loader>();

  if (!product && !isAdmin) {
    return (
      <Layout>
        <main className="flex gap-8 justify-start items-start min-h-screen">
          <p>Sorry something went wrong</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-full flex justify-start items-start">
        <div className="lg:w-60 flex">
          <Sidebar />
        </div>

        <div className="w-full gap-6 flex flex-col justify-center items-center">
          <header className="space-y-2 w-full flex justify-start items-center">
            <h1 className="text-2xl">Edit Product</h1>
          </header>

          <section className="w-full flex justify-start items-center">
            {userSession?.id && <EditProductForm />}
          </section>
        </div>
      </main>
    </Layout>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaUpdateProduct });

  if (!submission.value || submission.intent !== "submit") {
    return data(submission, { status: 400 });
  }

  const slug = submission.value.slug;

  const updateProduct = await prisma.product.update({
    where: { slug: slug },
    data: { ...submission.value, slug: slugify(submission.value.name) },
  });

  if (!updateProduct) {
    return data(submission, { status: 500 });
  }
  return redirect("/admin/dashboard/edit");
}
