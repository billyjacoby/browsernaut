import clsx from 'clsx';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  className?: string;
}

export const Input = ({ className, ...restProperties }: InputProps) => {
  return (
    <input
      className={clsx(
        'rounded',
        'font-medium',
        'min-w-0 text-center',
        'focus:bg-white/70 focus:shadow-xl focus:outline-none focus:ring-1 focus:bg-black',
        'shadow-sm bg-foreground/60',
        'placeholder:text-background/50',
        'text-background',
        className
      )}
      {...restProperties}
    />
  );
};

interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {
  className?: string;
}
export const Label = ({ className, ...resProperties }: LabelProps) => {
  return <label className={clsx(className)} {...resProperties} />;
};
