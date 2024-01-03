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
  return () => {
      try {
          if (window.$fx && typeof window.$fx.preview === 'function') {
            console.log("FX preview")
              window.$fx.preview();
          } else {
              console.warn('fxpreview function is not available');
          }
      } catch (error) {
          console.error('Error executing fxpreview:', error);
      }
  };
}
