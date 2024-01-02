export function fxhash(): string {
  return window.$fx.hash;
}

export function fxrand(): number {
  return window.$fx.rand();
}

export function registerFeatures(features: {
  [key: string]: string | number | boolean;
}) {
  window.$fx.features(features);
}

export function fxpreview(): () => void {
  return window.$fx.preview;
}
