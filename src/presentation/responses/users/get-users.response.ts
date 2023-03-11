export class GetUser {
  id: string;
  login: string;

  email: string;

  createdAt: Date;
}

export class GetUsersResponse {
  pagesCount: number;

  page: number;

  pageSize: number;

  totalCount: number;

  items: GetUser[];
}
