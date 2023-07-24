import { Card } from "../ui/card";

interface Props {
  children: React.ReactNode;
}

export function ProductCard({ children }: Props) {
  return <Card>{children}</Card>;
}
