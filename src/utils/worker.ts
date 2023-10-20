import { chunk } from "./chunk";
import { formatBytes } from "./formatBytes";
import { type JSONItem, getJson } from "./getJson";
import { isJSONFile } from "./validators";

type WorkerProps = {
  file?: File;
  chunkSize?: number;
  page?: number;
};

let chunks: Array<JSONItem[]> = [];

self.onmessage = (event: MessageEvent<WorkerProps>) => {
  const { file, chunkSize, page } = event.data;

  if (!file) {
    postMessage({
      data: chunks[page!],
    });
    return;
  }

  if (!isJSONFile(file?.name!)) {
    postMessage({
      error: true,
    });
    return;
  }

  chunks = [];

  const reader = new FileReader();

  reader.onload = function () {
    try {
      const fileContent = reader.result;

      const parsedJson = JSON.parse(fileContent as string);
      const jsonData = getJson(parsedJson);

      const chunkedJson = chunk(jsonData, chunkSize);

      chunks = chunkedJson;

      postMessage({
        data: chunks[page!],
        totalPages: chunks?.length,
        fileName: file?.name,
        fileSize: formatBytes(file?.size),
      });
    } catch (error) {
      postMessage({
        error: true,
      });
    }
  };

  reader.readAsText(file);
};
