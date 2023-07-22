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
  className?: string;
}

export const Left = ({ children, className }: LeftProps): JSX.Element => {
  let _className = 'text-right font-semibold col-span-3';

  if (className) {
    _className = _className + ' ' + className;
  }
  return <div className={_className}>{children}</div>;
};

interface RightProps {
  children: React.ReactNode;
  className?: string;
}

export const Right = ({ children, className }: RightProps): JSX.Element => {
  let _className = 'col-span-8';

  if (className) {
    _className = _className + ' ' + className;
  }
  return <div className={_className}>{children}</div>;
};
