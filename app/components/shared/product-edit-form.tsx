import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import type {
  loader as loaderEditProduct,
  action as actionEditProduct,
} from "~/routes/admin.dashboard.edit.$slug";
import { ButtonLoading } from "~/components";
import { schemaUpdateProduct } from "~/schemas";
import { useRootLoaderData } from "~/hooks";

export function EditProductForm() {
  const { userSession } = useRootLoaderData();
  const lastSubmission = useActionData<typeof actionEditProduct>();
  const { product } = useLoaderData<typeof loaderEditProduct>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUpdateProduct });
    },
    defaultValue: {
      ...product,
    },
  });

  return (
    <section className="w-full flex justify-start items-center">
      <Form
        method="POST"
        {...form.props}
        className="text-slate-700 w-full max-w-xl text-lg rounded-lg border bg-white p-4">
        <input
          hidden
          {...conform.input(fields.userId)}
          defaultValue={userSession?.id}
        />
        <input
          {...conform.input(fields.slug)}
          type="hidden"
          name="slug"
          defaultValue={product?.slug}
        />

        <div>
          <label htmlFor="name" className="mb-2">
            Product name:
          </label>
          <input
            {...conform.input(fields.name)}
            id="name"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
            defaultValue={product?.name}
          />
          <p>{fields.name.error}</p>
        </div>

        <div>
          <label htmlFor="price">Product price:</label>
          <input
            {...conform.input(fields.price, { type: "number" })}
            id="price"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
            defaultValue={product?.price}
          />
          <p>{fields.price.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product description:</label>
          <input
            {...conform.input(fields.description)}
            id="description"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
            defaultValue={product?.description || ""}
          />
          <p>{fields.description.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product Image:</label>
          <input
            {...conform.input(fields.imageURL)}
            id="description"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
            defaultValue={product?.imageURL || ""}
          />
          <p>{fields.description.error}</p>
        </div>

        <ButtonLoading
          type="submit"
          isSubmitting={isSubmitting}
          submittingText="Updating..."
          className="w-96 mt-4">
          Update Product
        </ButtonLoading>
      </Form>
    </section>
  );
}
