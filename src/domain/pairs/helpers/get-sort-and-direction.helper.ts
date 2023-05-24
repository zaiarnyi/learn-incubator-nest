export class GetSortAndDirectionHelper {
  static info(info: string): { sort: string; direction: 'DESC' | 'ASC' } {
    const defaultSortAndDirection = info.split(' ');
    const defaultSort = defaultSortAndDirection[0];
    const defaultDirection = defaultSortAndDirection[1].toUpperCase() as 'DESC' | 'ASC';

    return { sort: defaultSort, direction: defaultDirection };
  }
}
