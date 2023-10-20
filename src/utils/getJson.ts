export type JSONItem = {
  label: string;
  value?: string;
  currentMargin: number;
};

type JSONEntry = Record<string, unknown>;

let jsonData: JSONItem[] = [];

function renderLines(data: JSONEntry, currentMargin = 0) {
  for (const key in data) {
    const line = { label: key, currentMargin, value: "" };

    if (typeof data[key] === "object") {
      if (Array.isArray(data[key])) {
        line.label += ": [";
      } else if (!data[key]) {
        line.value += "null";
      } else {
        line.label += ": {";
      }

      jsonData.push(line);
      renderLines(data[key] as JSONEntry, currentMargin + 1);

      if (Array.isArray(data[key])) {
        jsonData.push({ label: "]", currentMargin });
      } else if (!data[key]) {
        line.label += "";
      } else {
        jsonData.push({ label: "}", currentMargin });
      }
    } else {
      line.value =
        typeof data[key] === "string" ? `"${data[key]}"` : `${data[key]}`;

      jsonData.push(line);
    }
  }
}

export const getJson = (data: JSONEntry) => {
  jsonData = [];

  renderLines(data, 0);

  return jsonData;
};
