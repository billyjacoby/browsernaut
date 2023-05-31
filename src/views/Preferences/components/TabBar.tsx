import clsx from 'clsx';
import { useAppDataStore } from '@stores/appDataStore';
import { BG_GRADIENT_ACTIVE } from '@config/CONSTANTS';

interface TabButtonProps {
  tab: PrefsTab;
  children: string;
}

const TabButton = ({ tab, children }: TabButtonProps) => {
  const updatePrefsTab = useAppDataStore((state) => state.updatePrefsTab);
  const prefsTab = useAppDataStore((state) => state.prefsTab);

  return (
    <div
      className={clsx(
        prefsTab === tab && BG_GRADIENT_ACTIVE,
        'p-0.5 rounded-md'
      )}
    >
      <button
        className={clsx(
          prefsTab === tab
            ? 'bg-zinc-800'
            : 'bg-black/0 hover:bg-black/5 dark:bg-white/0 dark:hover:bg-white/5',
          'hover:border-green-500',
          'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:focus-visible:bg-black',
          'rounded px-4 py-2'
        )}
        onClick={() => updatePrefsTab(tab)}
        type="button"
      >
        {children}
      </button>
    </div>
  );
};

interface HeaderBarProps {
  className?: string;
}

export const TabBar = ({ className }: HeaderBarProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'border-b border-gray-400 bg-black/5 pb-4 dark:border-black dark:bg-black/30',
        className
      )}
    >
      <div className="flex items-center justify-center space-x-12">
        <TabButton tab="general">General</TabButton>
        <TabButton tab="apps">Apps</TabButton>
        <TabButton tab="about">About</TabButton>
      </div>
    </div>
  );
};
