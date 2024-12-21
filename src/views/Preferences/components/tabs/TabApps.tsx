import { Input } from "@components/Input";
import { Spinner } from "@components/Spinner";
import type { InstalledApp } from "@config/apps";
import { BG_GRADIENT, BG_GRADIENT_ACTIVE } from "@config/CONSTANTS";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useAppDataStore } from "@stores/appDataStore";
import clsx from "clsx";

// https://getfrontrunner.com

interface SortableItemProps {
  icon?: string;
  iconString?: string;
  id: InstalledApp["name"];
  index: number;
  keyCode?: string;
  name: InstalledApp["name"];
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const SortableItem = ({
  iconString,
  id,
  index,
  keyCode = "",
  name,
  provided,
  snapshot,
}: SortableItemProps) => {
  const updateHotCode = useAppDataStore((state) => state.updateHotCode);
  return (
    <div
      ref={provided.innerRef}
      style={{ transition: "all" }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={clsx(
        "mx-auto w-[95%] rounded-md p-0.5",
        BG_GRADIENT,
        "flex",
        "mb-4",
        "focus-visible:bg-black focus-visible:shadow-xl focus-visible:outline-none",
        snapshot.isDragging && BG_GRADIENT_ACTIVE,
        "focus-visible:ring-2 focus-visible:ring-gray-100",
      )}
    >
      <div
        className={clsx(
          "flex",
          "w-full",
          "rounded-md",
          "transition-all",
          !snapshot.isDragging && "bg-background/40 transition-all",
        )}
      >
        <div className="flex w-16 items-center justify-center p-4">
          {index + 1}
        </div>
        <div className="my-auto mr-4 flex size-14 align-middle">
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
                event.key.toLowerCase() === "backspace" ||
                event.key.toLowerCase() === "delete"
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

export function TabApps() {
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
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {apps.map(({ hotCode, icon, name }, index) => (
                  <Draggable draggableId={name} index={index} key={name}>
                    {(p, snapshot) => (
                      <SortableItem
                        iconString={icon ?? ""}
                        id={name}
                        index={index}
                        key={name}
                        keyCode={hotCode || ""}
                        name={name}
                        provided={p}
                        snapshot={snapshot}
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
