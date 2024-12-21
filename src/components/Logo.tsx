import { BG_GRADIENT_ACTIVE } from "@config/CONSTANTS";
import clsx from "clsx";

export const Browsernaut = () => {
  return (
    <div className="mx-auto">
      <h1
        className={clsx(
          BG_GRADIENT_ACTIVE,
          "mb-2 bg-clip-text text-6xl font-semibold tracking-wider text-transparent",
        )}
      >
        Browsernaut
      </h1>
    </div>
  );
};
