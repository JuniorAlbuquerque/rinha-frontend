import clsx from "clsx";
import { FC } from "../../types";
import { isClosedBlock, isNumeric } from "../../utils/validators";
import { JsonItemProps } from "./types";
import { Show } from "solid-js";

export const JsonItem: FC<JsonItemProps> = ({ item }) => {
  const separators = Array.from(
    { length: item?.currentMargin },
    (_, index) => index
  );

  const keys = item.label.split(":");
  const keyisClosedBlock = isClosedBlock(keys[0]);

  return (
    <div class="flex text-base">
      <div class="flex whitespace-nowrap">
        {separators?.map((it) => {
          return (
            <div
              class="bg-line/50 w-[0.1rem] h-6 ml-1"
              style={{
                "margin-right": `${16 + it}px`,
              }}
            ></div>
          );
        })}
        <span tabIndex={!keyisClosedBlock ? 0 : -1}>
          <span
            class={clsx({
              "text-key": !isNumeric(keys[0]) && !keyisClosedBlock,
              "text-line": isNumeric(keys[0]) && !keyisClosedBlock,
              "text-indicator": keyisClosedBlock,
            })}
          >
            {keys[0]}
            <Show when={(!keys[1] && !keyisClosedBlock) || !!keys[1]}>:</Show>
            <span class="font-semibold text-indicator"> {keys[1]}</span>
          </span>

          <span>{item.value}</span>
        </span>
      </div>
    </div>
  );
};
