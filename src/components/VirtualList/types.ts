import { type JSX } from "solid-js/jsx-runtime";

export type VirtualizedListProps<T> = {
  items: T[];
  itemHeight: number;
  render: (item: T, index: number) => JSX.Element;
  onScrollEnd?: () => void;
};
