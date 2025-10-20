export interface Name {
    id: number;
    name: string;
    date: Date;
    checked: boolean;
    meaning: string;
    details: string;
}

export interface GroupedName {
  letter: string;
  list: Name[];
}

export interface PaginatedNames {
  groupedNames: GroupedName[];
  page: number;
  pageSize: number;
  total: number;
}