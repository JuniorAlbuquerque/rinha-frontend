import { FlowComponent } from "solid-js";
import { LoadFileProps } from "./types";
import clsx from "clsx";

export const LoadFile: FlowComponent<LoadFileProps> = (props) => {
  let inputRef: HTMLInputElement;

  const handleClick = () => {
    inputRef.click();
  };

  return (
    <button
      onClick={handleClick}
      disabled={props?.disabled}
      aria-label="LOAD-FILE"
      class={clsx(
        "bg-slate-100 border-gray-500 border-[0.1rem] w-fit px-4 py-1 text-background-100 rounded-lg",
        "hover:scale-[1.02] transition-all duration-200 hover:bg-slate-200",
        {
          "animate-wiggle": !!props?.error,
        }
      )}
    >
      {props.children}

      <input
        {...props}
        ref={(element) => (inputRef = element)}
        class="hidden"
      ></input>
    </button>
  );
};
