function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsText(content: string, filename = "content.txt"): void {
  triggerDownload(content, filename, "text/plain;charset=utf-8");
}

export function downloadAsMarkdown(content: string, filename = "content.md"): void {
  triggerDownload(content, filename, "text/markdown;charset=utf-8");
}
