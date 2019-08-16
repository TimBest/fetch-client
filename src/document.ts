export function getDocumentCsrfToken(): string {
  return (
    document.querySelectorAll('meta[name="csrf-token"]')[0] as HTMLMetaElement
  ).content;
}
