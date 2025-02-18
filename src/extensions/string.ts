function toTitleCase(str: string) {
  if (str === "") return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function insertSpaces(str?: string): string | undefined {
  if (!str) {
    return undefined;
  }
  return str.replace(/([A-Z])/g, " $1").trim();
}

function replaceUnderlines(str?: string): string | undefined {
  if (!str) {
    return undefined;
  }
  return str.replace(/_/g, " ");
}

export default function formatText(value: string): string {
  return toTitleCase(insertSpaces(replaceUnderlines(value)) ?? "-");
}
