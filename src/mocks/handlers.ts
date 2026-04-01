import { HttpResponse, http } from 'msw';

import { getMockExampleItems } from '@/mocks/data/exampleItems';

export const handlers = [
  http.get('/example-items', () => {
    return HttpResponse.json(getMockExampleItems());
  }),
];
