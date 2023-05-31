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
      className="border-gray-400 bg-black/5 pb-4 dark:border-black dark:bg-black/30"
    />
  );
};

const TitleBar = styled.div<{ backgroundColor?: string; height?: number }>`
  width: 100%;
  min-height: ${({ height }) => (height ? height + 'px' : '36px')};
  ${(props) =>
    props.backgroundColor && `background-color: ${props.backgroundColor}`};
`;
