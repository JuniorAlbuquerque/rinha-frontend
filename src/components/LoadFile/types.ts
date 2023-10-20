import { type JSX } from "solid-js/jsx-runtime";

export type LoadFileProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  busy?: boolean;
  error?: boolean;
};
