import { type JSX } from "solid-js/jsx-runtime";
import { VirtualizedListProps } from "./types";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const VirtualList: <T>(props: VirtualizedListProps<T>) => JSX.Element = (
  props
) => {
  const containerHeight = window.innerHeight;

  const [startIndex, setStartIndex] = createSignal(0);
  const [endIndex, setEndIndex] = createSignal(
    containerHeight / props?.itemHeight
  );

  let listRef: HTMLUListElement;

  const handleTabKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Tab" && listRef) {
      const activeElement = document.activeElement as HTMLLIElement;
      const listItems = listRef.querySelectorAll(
        '[tabIndex="0"]'
      ) as unknown as HTMLLIElement[];

      const listItemsLi = listRef.querySelectorAll(
        "li"
      ) as unknown as HTMLLIElement[];

      const lastItemInView = listItems[listItems.length - 5];
      const lastItemInViewLi = listItemsLi[listItemsLi.length - 5];

      if (document.body.clientHeight > window.innerHeight) {
        if (activeElement === lastItemInView) {
          window.scrollTo({
            top: lastItemInViewLi.offsetTop,
          });

          e.preventDefault();
        }
      }
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    const newStartIndex = Math.floor(scrollTop / props?.itemHeight);

    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(containerHeight / props?.itemHeight),
      props?.items.length - 1
    );

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);

    const isNearBottom = scrollTop + windowHeight >= document.body.clientHeight;

    if (isNearBottom) {
      props?.onScrollEnd && props?.onScrollEnd();
    }
  };

  const currentItems = createMemo(() => {
    return props?.items.slice(startIndex(), endIndex() + 1);
  });

  onMount(() => {
    document.addEventListener("scroll", handleScroll);
  });

  onCleanup(() => {
    document.removeEventListener("scroll", handleScroll);
  });

  return (
    <ul
      class="relative mx-auto max-w-[500px]"
      style={{
        height: `${props?.items?.length * props?.itemHeight}px`,
      }}
      ref={(element) => (listRef = element)}
    >
      {currentItems()?.map((item, index) => (
        <li
          class="absolute left-0 right-0"
          style={{
            height: `${props?.itemHeight}px`,
            top: `${(startIndex() + index) * props?.itemHeight}px`,
          }}
          onKeyDown={handleTabKeyPress}
        >
          {props?.render(item, index)}
        </li>
      ))}
    </ul>
  );
};
