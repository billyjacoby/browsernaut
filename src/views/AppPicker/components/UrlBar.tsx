import { useAppDataStore } from "@stores/appDataStore";

const UrlBar = () => {
  const _URL = useAppDataStore((state) => state.URL) ?? "";
  const openURL = useAppDataStore((state) => state.openURL);

  let parsedUrl;

  try {
    parsedUrl = new URL(_URL);
  } catch {
    parsedUrl = { hostname: "", port: "" };
  }

  return (
    <button
      className="my-2"
      onClick={() => openURL({ URL: _URL })}
      onKeyDown={() => false}
      tabIndex={-1}
      type="button"
    >
      {parsedUrl.hostname?.replace(/^www\./u, "") || (
        <span className="">Browsernaut</span>
      )}
      {parsedUrl.port ? `:${parsedUrl.port}` : null}
    </button>
  );
};

export default UrlBar;
