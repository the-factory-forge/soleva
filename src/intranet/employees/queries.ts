import { queryOptions } from "@tanstack/react-query";

import { $listEmployees } from "./functions";

export const employeesQueryOptions = (offset = 0) =>
  queryOptions({
    queryKey: ["employees", offset],
    queryFn: ({ signal }) => $listEmployees({ data: { offset }, signal }),
  });
