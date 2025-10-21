export interface Name {
    _id: string;
    name: string;
    date: Date;
    checkedByAdri: boolean;
    checkedByElena: boolean;
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

