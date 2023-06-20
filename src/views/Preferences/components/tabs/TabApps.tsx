import React from 'react';
import clsx from 'clsx';

import type { InstalledApp } from '@config/apps';
import Input from '@components/Input';
import { Spinner } from '@components/Spinner';
import { useAppDataStore } from '@stores/appDataStore';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
} from '@hello-pangea/dnd';
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
  const updateHotCode = useAppDataStore((state) => state.updateHotCode);
  return (
    <div
      style={{ transition: 'all' }}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={clsx(
        'w-[95%] rounded-md p-0.5 mx-auto',
        BG_GRADIENT,
        'flex',
        'mb-4',
        'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:bg-black',
        snapshot.isDragging && BG_GRADIENT_ACTIVE,
        'focus-visible:ring-2 focus-visible:ring-gray-100'
      )}
    >
      <div
        className={clsx(
          'flex',
          'w-full',
          'rounded-md',
          'transition-all',
          !snapshot.isDragging && 'bg-background/40 transition-all'
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
            onKeyDown={(event) => {
              if (
                event.key.toLowerCase() === 'backspace' ||
                event.key.toLowerCase() === 'delete'
              ) {
                updateHotCode(name, null);
              } else {
                updateHotCode(name, event.key);
              }
            }}
            placeholder="hotkey"
            type="text"
            value={keyCode.toUpperCase()}
          />
        </div>
      </div>
    </div>
  );
};

export function TabApps(): JSX.Element {
  const apps = useAppDataStore((state) => state.installedApps);
  const updateApps = useAppDataStore((state) => state.updateInstalledApps);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newApps = Array.from(apps);
    const [removed] = newApps.splice(result.source.index, 1);
    newApps.splice(result.destination.index, 0, removed);
    updateApps(newApps);
  };

  return (
    <div className="flex flex-col">
      {apps.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* //TODO: Add shadcn/ui scroll area here */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 180px)' }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {apps.map(({ name, hotCode, icon }, index) => (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(provided, snapshot) => (
                      <SortableItem
                        key={name}
                        id={name}
                        index={index}
                        keyCode={hotCode || ''}
                        name={name}
                        provided={provided}
                        snapshot={snapshot}
                        iconString={icon ?? ''}
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
        <p className="mt-2 text-center">
          Drag and drop to sort the list of apps.
        </p>
      )}
    </div>
  );
}
