import { z } from "zod";
import { zfd } from "zod-form-data";

export const schemaAddNewProduct = zfd.formData({
    name: zfd.text(),
    price: zfd.numeric(z.number().min(0).max(100_000_000)),
    description: zfd.text(),
    imageURL: zfd.text(),
    stockQuantity: zfd.numeric(),
    soldQuantity: zfd.numeric(),
  });

export const schemaUpdateProduct = zfd.formData({
    name: zfd.text(),
    slug: zfd.text(),
    price: zfd.numeric(z.number().min(0).max(100_000_000)),
    description: zfd.text(),
    imageURL: zfd.text(),
    stockQuantity: zfd.numeric(),
    soldQuantity: zfd.numeric(),
  });