import { Input } from "~/components";

export function AddNewLocationForm() {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-right">
          Name
        </label>
        <Input id="name" placeholder="Name" className="col-span-3 border" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="label" className="text-right">
          Label
        </label>
        <Input id="label" placeholder="Label" className="col-span-3 border" />
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
        <Input id="city" placeholder="City" className="col-span-3 border" />
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
  );
}
