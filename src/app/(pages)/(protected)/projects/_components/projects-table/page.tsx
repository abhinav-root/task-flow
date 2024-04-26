import prisma from "@/helpers/db";
import { Project, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: [
      {
        starred: "desc",
      },{
        createdAt: "desc"
      }
    ]})
  return projects;
}

export default async function ProjectsTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
