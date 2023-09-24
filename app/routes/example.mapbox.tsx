import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { MapboxEmbed } from "~/components";
import { prisma } from "~/db.server";

export async function loader() {
  return json({
    address: await prisma.userLocation.findFirst(),
  });
}

export default function ExamplesMapboxRoute() {
  const { address } = useLoaderData<typeof loader>();

  if (!address) {
    return <p>Address is not available</p>;
  }

  return (
    <div className="space-y-8 p-4">
      <h1>Example Mapbox</h1>

      <section className="flex max-w-full gap-4">
        <div>
          <h2>With Address</h2>
          <MapboxEmbed
            address={address as any}
            style={{ width: 500, height: 300 }}
            draggable
          />
        </div>
        <div>
          <pre title="address" className="whitespace-pre-wrap">
            {JSON.stringify(address, null, 2)}
          </pre>
        </div>
      </section>

      <section>
        <h2>Without Address</h2>
        <MapboxEmbed draggable zoom={10} />
      </section>
    </div>
  );
}
