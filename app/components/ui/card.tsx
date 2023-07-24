import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} className="flex flex-col flex-wrap border w-48" {...props} />
));
Card.displayName = "Card";

export { Card };
