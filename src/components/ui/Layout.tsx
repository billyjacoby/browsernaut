interface RowProps {
  children: React.ReactNode;
  className?: string;
}

export const Row = ({ children, className }: RowProps): JSX.Element => {
  let _className = 'grid grid-cols-12 gap-8';

  if (className) {
    _className = _className + ' ' + className;
  }

  return <div className={_className}>{children}</div>;
};

interface LeftProps {
  children: React.ReactNode;
  colSpan?: number;
}

export const Left = ({ children, colSpan }: LeftProps): JSX.Element => {
  const _colSpan = (colSpan || 3).toString();

  const colClass = `text-right font-semibold col-span-${_colSpan}`;
  return <div className={colClass}>{children}</div>;
};

interface RightProps {
  children: React.ReactNode;
  colSpan?: number;
}

export const Right = ({ children, colSpan }: RightProps): JSX.Element => {
  const _colSpan = (colSpan || 8).toString();

  const colClass = `col-span-${_colSpan}`;
  return <div className={colClass}>{children}</div>;
};
