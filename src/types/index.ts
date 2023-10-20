import { JSONItem } from "../utils/getJson";
import { JSX } from "solid-js";

export type FileWorkerEvent = {
  data: JSONItem[];
  totalPages: number;
  fileName: string;
  fileSize: string;
  error?: boolean;
};

export type FC<T = unknown> = (props: T) => JSX.Element;

export const chunkSize = 30000;
