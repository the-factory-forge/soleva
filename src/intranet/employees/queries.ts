import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { $listEmployees } from "./functions";

export const employeesQueryOptions = (offset = 0, search = "") =>
  queryOptions({
    queryKey: ["employees", offset, search],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => $listEmployees({ data: { offset, search }, signal }),
  });
