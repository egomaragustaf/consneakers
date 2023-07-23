import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export default function Index() {
  return (
    <main>
      <h1>Consneakers</h1>
    </main>
  );
}
