import { type JSX, createSignal, Show, onMount } from "solid-js";
import { JSONViewer } from "./components/JsonViewer";
import { LoadFile } from "./components/LoadFile";
import { chunkSize } from "./types";
import FileWorker from "./utils/worker?worker";
import { createStore } from "solid-js/store";
import { ArrowLeft } from "./components/ArrowLeft";

function App() {
  const [fileWorker, setFileWorker] = createSignal<Worker>();
  const [error, setError] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [treeInView, setTreeInView] = createSignal(false);
  const [reset, setReset] = createSignal(false);
  const [jsoninfo, setJsonInfo] = createStore({
    name: "0",
    size: "0",
  });

  const handleSelectFile: JSX.EventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    setLoading(true);
    setError(false);
    setReset(false);

    const currentFile = event?.currentTarget?.files![0];

    fileWorker()!.postMessage({
      file: currentFile,
      chunkSize,
      page: 0,
    });
  };

  onMount(() => {
    if (window.Worker) {
      if (!(fileWorker() instanceof Worker)) {
        setFileWorker(new FileWorker());
      }
    }
  });

  return (
    <div class="min-h-screen w-full flex flex-col bg-white text-background-200">
      <Show when={!treeInView()}>
        <div class="flex flex-col gap-8 text-center h-full flex-1 items-center justify-center sticky top-0 z-10 bg-white">
          <h1 class="text-3xl md:text-5xl font-semibold">JSON Tree Viewer</h1>

          <p class="text-lg md:text-xl">
            Simple JSON Viewer that runs completely on-client. No data exchange
          </p>

          <LoadFile
            type="file"
            oninput={handleSelectFile}
            accept="application/json"
            error={error()}
            disabled={loading()}
          >
            <Show when={!loading()}>Load JSON</Show>
            <Show when={loading()}>Loading...</Show>
          </LoadFile>

          {error() && (
            <p class="text-error">
              Invalid file. Please load a valid JSON file.
            </p>
          )}
        </div>
      </Show>

      <Show when={treeInView()}>
        <div class="flex flex-col gap-8 text-center items-center justify-center sticky top-0 z-10 bg-white">
          <div class="py-4 relative w-full max-w-[500px] text-left flex items-baseline gap-4">
            <button
              aria-label="Back"
              onclick={() => {
                setReset(true);
                setTreeInView(false);
              }}
            >
              <ArrowLeft />
            </button>

            <h1 class="text-2xl md:text-3xl font-semibold">{jsoninfo.name}</h1>
            <span class="text-sm text-gray-500">{jsoninfo.size}</span>
          </div>
        </div>
      </Show>

      <Show when={!!fileWorker()}>
        <JSONViewer
          fileWorker={fileWorker()!}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          onFinishLoad={(name, size) => {
            setTreeInView(true);
            setLoading(false);
            setJsonInfo({
              name,
              size,
            });
          }}
          reset={reset()}
        />
      </Show>
    </div>
  );
}

export default App;
