import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    ref={ref}
    className="rounded border-2 bg-card text-card-foreground shadow"
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
