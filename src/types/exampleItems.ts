export interface ExampleItem {
  id: string;
  title: string;
  summary: string;
  tag: string;
}

export interface ExampleItemsResponse {
  items: ExampleItem[];
}
