import clsx from 'clsx';
import { useAppDataStore } from '@stores/appDataStore';

interface Props {
  children: React.ReactNode;
  pane: PrefsTab;
  className?: string;
}

export function Pane({ children, pane, className }: Props): JSX.Element {
  const prefsTab = useAppDataStore((state) => state.prefsTab);
  const isVisible = pane === prefsTab;

  return (
    <div
      className={clsx(
        isVisible ? 'flex grow flex-col overflow-hidden' : 'hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
