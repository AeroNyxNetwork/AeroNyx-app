// types/global.d.ts

interface Window {
  okxwallet?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    isOKXWallet?: boolean;
  };
}
