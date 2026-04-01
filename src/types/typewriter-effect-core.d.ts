declare module 'typewriter-effect/dist/core' {
  import type { Options, TypewriterClass } from 'typewriter-effect';

  const TypewriterCore: new (
    container: string | HTMLElement | null,
    options?: Partial<Options>,
  ) => TypewriterClass;

  export default TypewriterCore;
}
