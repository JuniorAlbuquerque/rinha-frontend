import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { FC, FileWorkerEvent, chunkSize } from "../../types";
import { JSONItem } from "../../utils/getJson";
import { VirtualList } from "../VirtualList";
import { JsonItem } from "../JsonItem";
import { JSONViewerProps } from "./types";

export const JSONViewer: FC<JSONViewerProps> = (props) => {
  const [data, setData] = createSignal<JSONItem[]>([]);
  const [currentPage, setCurrentPage] = createSignal<number>(0);
  const [totalPages, setTotalPages] = createSignal<number>(0);

  const workerListener = (event: MessageEvent<FileWorkerEvent>) => {
    if (event?.data?.error) {
      props?.onError && props.onError();
      return;
    }

    const processedJson = event.data;

    if (processedJson?.totalPages) {
      setTotalPages(processedJson?.totalPages);
    }

    if (processedJson?.data?.length > 0) {
      setData((prevState) => [...prevState, ...processedJson?.data]);
    }

    if (processedJson?.fileName && processedJson?.fileSize) {
      props?.onFinishLoad &&
        props.onFinishLoad(processedJson?.fileName, processedJson?.fileSize);
    }
  };

  const onEndScroll = () => {
    if (data()?.length > 0 && currentPage() + 1 < totalPages()) {
      setCurrentPage((prevState) => (prevState += 1));
    }
  };

  onMount(() => {
    if (props?.fileWorker) {
      props?.fileWorker?.addEventListener("message", workerListener);
    }
  });

  onCleanup(() => {
    if (props?.fileWorker) {
      props?.fileWorker?.removeEventListener("message", workerListener);
    }
  });

  createEffect(() => {
    if (props.reset) {
      setData([]);
    }
  });

  createEffect(() => {
    if (currentPage() > 0) {
      props?.fileWorker.postMessage({
        file: null,
        chunkSize,
        page: currentPage(),
      });
    }
  });

  return (
    <Show when={data().length > 0}>
      <div>
        <VirtualList
          items={data()}
          itemHeight={24}
          render={(item) => <JsonItem item={item} />}
          onScrollEnd={onEndScroll}
        />
      </div>
    </Show>
  );
};
