import styled from 'styled-components';

export const DraggableTitleBar = ({
  backgroundColor,
  height,
}: {
  backgroundColor?: string;
  height?: number;
}) => {
  return (
    <TitleBar
      data-tauri-drag-region
      backgroundColor={backgroundColor}
      height={height}
    />
  );
};

const TitleBar = styled.div<{ backgroundColor?: string; height?: number }>`
  width: 100%;
  min-height: ${({ height }) => (height ? height + 'px' : '36px')};
`;
