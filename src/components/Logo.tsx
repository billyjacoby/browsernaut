import { BG_GRADIENT_ACTIVE } from '@config/CONSTANTS';
import clsx from 'clsx';

export const Browsernaut = () => {
  return (
    <div className="mx-auto">
      <h1
        className={clsx(
          BG_GRADIENT_ACTIVE,
          'mb-2 text-6xl tracking-wider font-semibold bg-clip-text text-transparent'
        )}
      >
        Browsernaut
      </h1>
    </div>
  );
};
