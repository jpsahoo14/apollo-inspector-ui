export interface ISection {
  id: string | number;
  title: string;
  content: string;
}

export interface IQueryTab {
  id: string;
  text: string;
}

export interface Page {
  id: number;
  title: string;
  sections: ISection[];
}

export enum VirtualType {
  Query = 'Query',
  Mutation = 'Mutation',
  Subscription = 'Subscription',
  Fragment = 'Fragment'
}