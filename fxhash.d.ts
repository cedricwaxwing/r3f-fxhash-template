interface FxHash {
  hash: string;
  rand: () => number;
  features: (features: { [key: string]: string | number | boolean }) => void;
  preview: () => void;
}

declare global {
  interface Window {
    $fx: FxHash;
  }
}

export {};
