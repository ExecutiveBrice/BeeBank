declare global {
  interface Window {
    __BEEBANK_CONFIG__?: {
      apiUrl?: string;
    };
  }
}

export function getApiUrl(): string {
  return window.__BEEBANK_CONFIG__?.apiUrl ?? '/api';
}
