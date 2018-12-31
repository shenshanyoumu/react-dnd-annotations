declare var require: any;

const memoize = require("lodash/memoize");

declare global {
  // tslint:disable-next-line interface-name
  interface Window {
    safari: any;
  }
}

export type Predicate = () => boolean;

// 是否Firefox
export const isFirefox: Predicate = memoize(() =>
  /firefox/i.test(navigator.userAgent)
);

// 是否Safari
export const isSafari: Predicate = memoize(() => Boolean(window.safari));
