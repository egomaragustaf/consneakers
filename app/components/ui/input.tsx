import * as React from "react";
import { useState } from "react";
import { cn } from "~/utils";
import { Button } from "~/components";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded bg-background px-3 py-2 text-base ring-offset-rose-700 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

function InputPassword({
  type = "password",
  placeholder = "Enter password",
  className,
  ...props
}: InputProps) {
  const [isShown, setIsShown] = useState<boolean>(false);

  function handleClick() {
    setIsShown(!isShown);
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        data-component="input-password"
        type={isShown ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <Button
        size="sm"
        type="button"
        variant="secondary"
        onClick={handleClick}
        className="absolute inset-y-0 right-0 my-0.5 me-1 flex w-20 gap-2">
        {isShown ? (
          <FaEye className="h-4 w-4" />
        ) : (
          <FaEyeSlash className="h-4 w-4" />
        )}
        <span>{isShown ? "Hide" : "Show"}</span>
      </Button>
    </div>
  );
}

export { Input, InputPassword };
