import type { ExampleItem, ExampleItemsResponse } from '@/types/exampleItems';

const exampleItems: readonly ExampleItem[] = [
  {
    id: 'foundation',
    title: 'Foundation Ready',
    summary: 'Routing, SCSS tokens, testing, and API utilities are wired into a clean starter.',
    tag: 'core',
  },
  {
    id: 'playground',
    title: 'Playground Included',
    summary: 'A dedicated demo page shows how shared UI, modal flows, and async data fit together.',
    tag: 'ui',
  },
  {
    id: 'mocks',
    title: 'MSW Example',
    summary:
      'Mock handlers remain in place so new projects can prototype API contracts immediately.',
    tag: 'data',
  },
] as const;

export const getMockExampleItems = (): ExampleItemsResponse => {
  return {
    items: exampleItems.map((item) => ({ ...item })),
  };
};
