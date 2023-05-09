import clsx from 'clsx';

import type { InstalledApp } from '@config/apps';
import Input from '@components/Input';
import { Spinner } from '@components/Spinner';
import { Pane } from '@components/Pane';
import { useAppDataStore } from '@stores/appDataStore';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
} from '@hello-pangea/dnd';
import React from 'react';
import { getAppIcons } from '@utils/get-app-icon';
import { BG_GRADIENT, BG_GRADIENT_ACTIVE } from '@config/CONSTANTS';

// https://getfrontrunner.com

interface SortableItemProps {
  id: InstalledApp['name'];
  name: InstalledApp['name'];
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  index: number;
  icon?: string;
  keyCode?: string;
  iconString?: string;
}

const SortableItem = ({
  id,
  name,
  keyCode = '',
  index,
  provided,
  snapshot,
  iconString,
}: SortableItemProps) => {
  return (
    <div
      style={{ transition: 'all' }}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={clsx(
        'w-full rounded-md p-0.5',
        BG_GRADIENT,
        'flex',
        'mb-4',
        'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:focus-visible:bg-black',
        snapshot.isDragging && BG_GRADIENT_ACTIVE,
        'focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100'
      )}
    >
      <div
        className={clsx(
          'flex',
          'w-full',
          'rounded-md',
          'transition-all',
          !snapshot.isDragging && 'bg-zinc-800 transition-all'
        )}
      >
        <div className="flex w-16 items-center justify-center p-4">
          {index + 1}
        </div>
        <div className="flex h-14 w-14 mr-4 my-auto align-middle">
          <img src={iconString} />
        </div>
        <div className="flex grow items-center">
          <span>{name}</span>
        </div>
        <div className="flex items-center justify-center p-4">
          <Input
            aria-label={`${name} hotkey`}
            className="h-8 w-20"
            data-app-id={id}
            maxLength={1}
            minLength={0}
            onChange={(event) => event.preventDefault()}
            onFocus={(event) => {
              event.target.select();
            }}
            // TODO
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onKeyPress={(event) => {
              // dispatch(
              //   `updatedHotCode({
              //     appName: id,
              //     value: event.code,
              //   })`
              // );
            }}
            placeholder="Key"
            type="text"
            value={keyCode}
          />
        </div>
      </div>
    </div>
  );
};

export function AppsPane(): JSX.Element {
  const apps = useAppDataStore((state) => state.installedApps);
  const updateApps = useAppDataStore((state) => state.updateInstalledApps);

  const [appIcons, setAppIcons] = React.useState<null | string[]>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newApps = Array.from(apps);
    const [removed] = newApps.splice(result.source.index, 1);
    newApps.splice(result.destination.index, 0, removed);
    updateApps(newApps);
  };

  React.useEffect(() => {
    if (apps.length) {
      (async () => {
        const _appIcons = await getAppIcons(
          apps.map((app) => app.name),
          128
        );
        setAppIcons(_appIcons);
      })();
    }
  }, [apps]);

  const keyCodeMap = new Map<string, string>();

  return (
    <Pane pane="apps">
      {apps.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="overflow-y-auto p-2 scrollbar-hide">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {apps.map(({ name, hotCode }, index) => (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(provided, snapshot) => (
                      <SortableItem
                        key={name}
                        id={name}
                        index={index}
                        keyCode={keyCodeMap.get(hotCode || '') || ''}
                        name={name}
                        provided={provided}
                        snapshot={snapshot}
                        iconString={appIcons?.[index] ?? ''}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {apps.length > 1 && (
        <p className="mt-2 text-sm opacity-70">
          Drag and drop to sort the list of apps.
        </p>
      )}
    </Pane>
  );
}
