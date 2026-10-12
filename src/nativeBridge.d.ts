export {};

declare global {
  interface Window {
    __sondsHandleBack?: () => boolean;
  }
}
