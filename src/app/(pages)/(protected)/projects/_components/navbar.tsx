import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import Logo from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/avatar";
import { validateRequest } from "@/lucia";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { logout } from "@/lucia";

export async function Navbar() {
  const { user } = await validateRequest();

  return (
    <nav className="py-2 px-10 flex justify-between border-t border-b items-center">
      <ul className="flex space-x-10 items-center">
        <li>
          <Logo />
        </li>
        <li className="hover:bg-gray-200 rounded p-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="flex items-center space-x-1 font-medium">
                <span className="border-none outline-none">Projects</span>
                <ChevronDownIcon strokeWidth={50} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li className="hover:bg-gray-200 rounded p-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="flex items-center space-x-1 font-medium">
                <span className="border-none outline-none">Recent</span>
                <ChevronDownIcon strokeWidth={50} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li className="hover:bg-gray-200 rounded p-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="flex items-center space-x-1 font-medium">
                <span className="border-none outline-none">Starred</span>
                <ChevronDownIcon strokeWidth={50} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
      <ul className="flex space-x-10 items-center">
        <li>
          <Link href="#">
            <Badge
              variant="secondary"
              className={cn(
                "ml-1 uppercase bg-green-600 text-white hover:bg-green-700"
              )}
            >
              free
            </Badge>
          </Link>
        </li>
        <li>
          <ThemeSwitcher />
        </li>
        <li className="hover:bg-gray-200 rounded p-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar username={user?.username ?? ""} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><form action={async () => {
                "use server"
                await logout();
              }}><button type="submit">Logout</button></form></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}
