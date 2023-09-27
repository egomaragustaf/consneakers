import { cn } from "~/utils";
import { buttonVariants } from "~/components";
import { NavLink } from "@remix-run/react";
import { useRootLoaderData } from "~/hooks";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const adminSideBarItems = [
  {
    to: "/admin/dashboard/products",
    text: "All Products",
  },
  {
    to: "/admin/dashboard/new",
    text: "Add New Product",
  },
  {
    to: "/admin/dashboard/edit",
    text: "Edit Product",
  },
  {
    to: "/logout",
    text: "Logout",
  },
];

const userSideBarItems = [
  {
    to: "/user/dashboard",
    text: "Profile",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const { userData } = useRootLoaderData();

  const isAdmin = userData?.username === "admin";

  console.log(isAdmin);

  return (
    <div className={cn("pb-4 rounded fixed", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>

          {isAdmin && (
            <div className="space-y-1 flex flex-col">
              {adminSideBarItems.map((item) => {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        buttonVariants({ variant: "ghost" }),
                        isActive
                          ? "bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white"
                          : "hover:bg-muted",
                        "justify-start"
                      )
                    }>
                    {item.text}
                  </NavLink>
                );
              })}
            </div>
          )}

          {!isAdmin && (
            <div className="space-y-1 flex flex-col">
              {userSideBarItems.map((item) => {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        buttonVariants({ variant: "ghost" }),
                        isActive
                          ? "bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white"
                          : "hover:bg-muted",
                        "justify-start"
                      )
                    }>
                    {item.text}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
