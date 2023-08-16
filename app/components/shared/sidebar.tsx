import { cn } from "~/utils";
import { Button, Separator } from "~/components";
import { Link } from "@remix-run/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-4 bg-zinc-800 text-white rounded", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dahsboard
          </h2>
          <div className="space-y-1 flex flex-col">
            <Link to={`/admin/dashboard/products`}>
              <Button variant="ghost" className="w-full justify-start">
                All Products
              </Button>
            </Link>

            <Link to={`/admin/dashboard/new`}>
              <Button variant="ghost" className="w-full justify-start">
                Add New Product
              </Button>
            </Link>

            <Link to={`/admin/dashboard/delete`}>
              <Button variant="ghost" className="w-full justify-start">
                Delete Product
              </Button>
            </Link>

            <Link to={`/admin/dashboard/edit`}>
              <Button variant="ghost" className="w-full justify-start">
                Edit Product
              </Button>
            </Link>

            <Separator />

            <Link to={`/logout`}>
              <Button variant="ghost" className="w-full justify-start">
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
