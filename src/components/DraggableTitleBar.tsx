export const DraggableTitleBar = ({ height: _height }: { height?: number }) => {
  const height = _height ?? 36;
  return <div className="w-full" data-tauri-drag-region style={{ height }} />;
};
