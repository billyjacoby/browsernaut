import clsx from 'clsx';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  disabled?: boolean;
  className?: string;
}

const Button = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        disabled && 'opacity-40',
        !disabled && 'active:opacity-75',
        'px-2 py-1',
        'rounded-lg',
        'leading-none',
        'inline-flex items-center',
        'shadow-sm',
        'bg-[#56555C]',
        'border',
        'border-b-[#56555C]',
        'border-l-[#56555C]',
        'border-r-[#56555C]',
        'border-t-[#6E6D73]',
        'hover:border-green-400'
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  );
};

export default Button;
