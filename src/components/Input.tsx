import clsx from 'clsx';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  className?: string;
}

const Input = ({ className, ...restProperties }: InputProps) => {
  return (
    <input
      className={clsx(
        'min-w-0 text-center uppercase',
        'focus:bg-white/70 focus:shadow-xl focus:outline-none focus:ring-1 focus:bg-black',
        'shadow-sm bg-[#56555C]',
        'text-white',
        'border',
        'border-b-[#56555C]',
        'border-l-[#56555C]',
        'border-r-[#56555C]',
        'border-t-[#6E6D73]',
        className
      )}
      {...restProperties}
    />
  );
};

export default Input;
