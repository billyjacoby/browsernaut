import { useAppDataStore } from '@stores/appDataStore';
import clsx from 'clsx';
import styled from 'styled-components';

const UrlBar = ({ className }: { className?: string }) => {
  const _URL = useAppDataStore((state) => state.URL) ?? '';

  let parsedUrl;

  try {
    parsedUrl = new URL(_URL);
  } catch {
    parsedUrl = { hostname: '', port: '' };
  }

  return (
    <Button
      className={clsx(
        className,
        'flex w-full shrink-0 items-center py-2 px-4 text-center text-sm',
        'border-t border-neutral-400 dark:border-gray-900',
        'cursor-default'
      )}
      // onClick={() => dispatch(clickedUrlBar())}
      onKeyDown={() => false}
      tabIndex={-1}
      type="button"
    >
      <div className="grow overflow-hidden text-ellipsis tracking-wider text-black text-opacity-30 dark:text-white dark:text-opacity-30">
        {parsedUrl.hostname?.replace(/^www\./u, '') || (
          <span className="">Browsernaut</span>
        )}
        {parsedUrl.port ? `:${parsedUrl.port}` : null}
      </div>
    </Button>
  );
};

export default UrlBar;

const Button = styled.button`
  bottom: 0;
  margin-bottom: 20px;
`;
