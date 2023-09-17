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

export function EditProductForm() {
  const lastSubmission = useActionData<typeof actionEditProduct>();
  const { product } = useLoaderData<typeof loaderEditProduct>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [
    form,
    { slug, name, price, description, imageURL, soldQuantity, stockQuantity },
  ] = useForm({
    shouldValidate: "onSubmit",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUpdateProduct });
    },
    defaultValue: {
      ...product,
    },
  });

  if (!product) return null;

  return (
    <section className="w-full flex justify-start items-center">
      <Form
        method="PUT"
        {...form.props}
        className="text-slate-700 w-full max-w-xl text-lg rounded-lg border bg-white p-4">
        <input
          {...conform.input(slug)}
          hidden
          id="slug"
          name="slug"
          className="w-full px-2 py-1 rounded-md border-gray-300 border"
        />

        <div>
          <label htmlFor="name" className="mb-2">
            Product name:
          </label>
          <input
            {...conform.input(name)}
            id="name"
            name="name"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{name.error}</p>
        </div>

        <div>
          <label htmlFor="price">Product price:</label>
          <input
            {...conform.input(price, { type: "number" })}
            id="price"
            name="price"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{price.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product description:</label>
          <input
            {...conform.input(description || "")}
            id="description"
            name="description"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{description.error}</p>
        </div>

        <div>
          <label htmlFor="imageURL">Product Image:</label>
          <input
            {...conform.input(imageURL || "")}
            id="imageURL"
            name="imageURL"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{imageURL.error}</p>
        </div>

        <div>
          <label htmlFor="soldQuantity">Sold Quantity:</label>
          <input
            {...conform.input(soldQuantity)}
            id="soldQuantity"
            name="soldQuantity"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{soldQuantity.error}</p>
        </div>

        <div>
          <label htmlFor="stockQuantity">Stock Quantity:</label>
          <input
            {...conform.input(stockQuantity)}
            id="stockQuantity"
            name="stockQuantity"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{stockQuantity.error}</p>
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
