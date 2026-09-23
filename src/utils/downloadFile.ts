const filenameFromContentDisposition = (header: string | null) => {
  if (!header) return '';

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].trim();
    }
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) return quotedMatch[1].trim();

  const plainMatch = header.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() || '';
};

const safeDownloadName = (value?: string) => {
  const cleaned = String(value || 'download')
    .replace(/\.[A-Za-z0-9]{1,10}$/i, '')
    .replace(/[^A-Za-z0-9._ -]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120);
  return cleaned || 'download';
};

export const downloadFileFromUrl = async (url: string, fallbackName?: string) => {
  if (!url) return;

  if (/^(data:|blob:)/i.test(url)) {
    const link = document.createElement('a');
    link.href = url;
    link.download = safeDownloadName(fallbackName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }

  try {
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

    const blob = await response.blob();
    const headerName = filenameFromContentDisposition(response.headers.get('Content-Disposition'));
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = headerName || `${safeDownloadName(fallbackName)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    window.location.assign(url);
  }
};
