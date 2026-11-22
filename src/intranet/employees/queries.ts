import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import type { employeeDirectorySchema } from "./employees.schema";
import { $listEmployees } from "./functions";

export const employeesQueryOptions = (
  offset = 0,
  search = "",
  sort?: z.output<typeof employeeDirectorySchema>["sort"],
) =>
  queryOptions({
    queryKey: ["employees", offset, search, sort],
    queryFn: ({ signal }) => $listEmployees({ data: { offset, search, sort }, signal }),
  });
