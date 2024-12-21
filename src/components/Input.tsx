import React from "react";

import clsx from "clsx";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  className?: string;
  error?: boolean;
}

export const Input = ({ className, error, ...restProperties }: InputProps) => {
  const defaultClassNames = clsx(
    "rounded",
    "font-medium",
    "min-w-0 text-center",
    "focus:bg-black focus:shadow-xl focus:outline-none focus:ring-1",
    "bg-foreground/60 shadow-sm",
    "placeholder:text-background/50",
    "text-background",
    className,
  );
  if (error) {
    return (
      <input
        className={clsx(
          defaultClassNames,
          "text-destructive outline outline-offset-0 outline-destructive",
        )}
        {...restProperties}
      />
    );
  }
  return (
    <>
      <input className={clsx(defaultClassNames)} {...restProperties} />
    </>
  );
};

interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
  className?: string;
}
export const Label = ({ className, ...resProperties }: LabelProps) => {
  return <label className={clsx(className)} {...resProperties} />;
};
