import { Request } from "express";

export const getPaginator = ({
  query,
}: Request): {
  limit: number;
  page: number;
  skip: number;
  query: string | null;
} => {
  let _page = 1;
  let _limit = 20;
  let _skip = 0;
  let _query: string | null = null;
  if (Number(query.page) > 1) {
    _page = Number(query.page);
    _skip = (_page - 1) * _limit;
  }
  if (query.limit) {
    _limit = Number(query.limit);
    _skip = (_page - 1) * _limit;
  }
  if (query.query) {
    _query = query.query.toString();
  }
  return { page: _page, limit: _limit, skip: _skip, query: _query };
};
