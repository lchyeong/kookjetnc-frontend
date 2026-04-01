/// <reference types="vite/client" />

/* ========================================
   Vite 환경변수 타입 정의
   import.meta.env에서 사용 가능
   ======================================== */

declare const __DEV__: boolean;
declare const __PROD__: boolean;

interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;

  readonly VITE_APP_NAME?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* ========================================
   정적 파일 import 타입 정의
   ======================================== */

// 이미지 파일
declare module '*.svg' {
  import type * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

// CSS 파일
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'swiper/css';
declare module 'swiper/css/effect-fade';
declare module 'swiper/css/navigation';
declare module 'swiper/css/pagination';

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 폰트 파일
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

// 미디어 파일
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.flac' {
  const src: string;
  export default src;
}

declare module '*.aac' {
  const src: string;
  export default src;
}

// JSON 파일
declare module '*.json' {
  const value: unknown;
  export default value;
}

// 텍스트 파일
declare module '*.txt' {
  const content: string;
  export default content;
}

// WASM 파일
declare module '*.wasm' {
  const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Exports>;
  export default initWasm;
}

// Web Worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

// Shared Worker
declare module '*?sharedworker' {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}

// Raw import (문자열로 가져오기)
declare module '*?raw' {
  const content: string;
  export default content;
}

// URL import (파일 URL 가져오기)
declare module '*?url' {
  const src: string;
  export default src;
}
