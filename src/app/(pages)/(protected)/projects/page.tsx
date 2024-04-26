
import { validateRequest } from "@/lucia";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import ProjectsTable from "./_components/projects-table/page";

import CreateProject from "./_components/create-project";

export default async function ProjectsPage() {
  const { session, user } = await validateRequest();

  return (
    <div>
      <main className="px-10 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <CreateProject />
        </div>
        <span className="mt-4 flex focus-within:ring-1 focus-within:ring-blue-500 items-center px-4 border max-w-60 rounded">
          <Input
            type="search"
            placeholder="Search Projects"
            className=" border-none shadow-none focus-visible:ring-0"
          />
          <MagnifyingGlassIcon />
        </span>
        <ProjectsTable />
      </main>
    </div>
  );
}
