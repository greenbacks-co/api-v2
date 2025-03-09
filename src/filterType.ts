export interface Filter {
  categoryToAssign: Category;
  id: string;
  matchers: Matcher[];
  tagToAssign?: string;
}

export enum Category {
  Earning = 'earning',
  Hidden = 'hidden',
  Saving = 'saving',
  Spending = 'spending',
}

interface Matcher {
  comparator: Comparator;
  expectedValue: string;
  property: string;
}

export enum Comparator {
  Equals = 'equals',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
}
