export type JSONViewerProps = {
  fileWorker: Worker;
  reset?: boolean;
  onError?(): void;
  onFinishLoad?(fileName?: string, fileSize?: string): void;
};
