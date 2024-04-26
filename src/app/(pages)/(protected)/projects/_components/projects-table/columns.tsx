"use client";

import { ColumnDef } from "@tanstack/react-table";

import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { toggleFavorite } from "../../_actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
  id: string;
  starred: boolean;
  name: string;
  role: "MEMBER" | "OWNER";
  createdAt: Date;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "starred",
    header: <StarFilledIcon className="text-gray-700 dark:text-gray-200" />,
    cell: ({ row }) => {
      const isStarred = Boolean(row.getValue("starred"));
      return isStarred ? (
        <StarFilledIcon
          className="text-yellow-400 size-5 relative right-0.5 cursor-pointer"
          onClick={async () => {
            await toggleFavorite(row.original.id);
          }}
        />
      ) : (
        <StarIcon
          className="cursor-pointer"
          onClick={async () => {
            await toggleFavorite(row.original.id);
          }}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="font-bold text-gray-700 dark:text-gray-200">Name</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="font-bold text-gray-700 dark:text-gray-200">Role</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="font-bold text-gray-700 dark:text-gray-200">Created</div>
    ),
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      return new Date(createdAt).toLocaleString();
    },
  },
];
