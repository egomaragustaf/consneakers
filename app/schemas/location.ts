import { z } from "zod";
import { zfd } from "zod-form-data";

export const schemaAddNewUserLocation = zfd.formData({
    label: zfd.text(),
    address: zfd.text(),
    countryCode: zfd.text(),
    province: zfd.text(),
    city: zfd.text(),
    district: zfd.text(),
    subDistrict: zfd.text(),
    street: zfd.text(),
    streetDetails: zfd.text(),
    postalCode: zfd.text(),
    mapsURL: zfd.text(),
    latitude: zfd.numeric(z.number()),
    longitude: zfd.numeric(z.number()),
  });