import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    ref={ref}
    className="w-60 bg-white border border-gray-200 rounded-lg shadow"
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
