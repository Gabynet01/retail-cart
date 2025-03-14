export function search<T extends object | string | number>(
  toSearch: string,
  dataToSearch: T[],
  keysToSearch?: T extends object ? (keyof T)[] : undefined,
): T[] {
  if (Array.isArray(dataToSearch) && typeof dataToSearch[0] === 'object') {
    return (dataToSearch as T[]).filter((row) => {
      const searchKeys = (keysToSearch as (keyof T)[]) || Object.keys(row);
      return searchKeys.some((key) => {
        const value = row[key];
        return typeof value === 'string'
          ? value.toLowerCase().includes(toSearch.toLowerCase())
          : JSON.stringify(value).toLowerCase().includes(toSearch.toLowerCase());
      });
    }) as T[];
  } else if (Array.isArray(dataToSearch) && typeof dataToSearch[0] === 'string') {
    return (dataToSearch as string[]).filter((str) =>
      str.toLowerCase().includes(toSearch.toLowerCase()),
    ) as T[];
  } else {
    return (dataToSearch as number[]).filter((num) => num.toString().includes(toSearch)) as T[];
  }
}
