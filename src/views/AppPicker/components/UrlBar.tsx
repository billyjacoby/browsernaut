import { useAppDataStore } from '@stores/appDataStore';
import styled from 'styled-components';

const UrlBar = () => {
  const _URL = useAppDataStore((state) => state.URL) ?? '';
  const openURL = useAppDataStore((state) => state.openURL);

  let parsedUrl;

  try {
    parsedUrl = new URL(_URL);
  } catch {
    parsedUrl = { hostname: '', port: '' };
  }

  return (
    <Button
      onClick={() => openURL({ URL: _URL })}
      onKeyDown={() => false}
      tabIndex={-1}
      type="button"
    >
      {parsedUrl.hostname?.replace(/^www\./u, '') || (
        <span className="">Browsernaut</span>
      )}
      {parsedUrl.port ? `:${parsedUrl.port}` : null}
    </Button>
  );
};

export default UrlBar;

const Button = styled.button`
  margin: 4px 0;
`;
