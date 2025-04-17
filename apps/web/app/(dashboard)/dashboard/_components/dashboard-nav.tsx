import { LayoutGrid, BarChart, Brush, Store, Trophy, Settings } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export const dashboardNavItems = [
  { icon: LayoutGrid, label: "Gallery", href: "/dashboard", id: "gallery" },
  { icon: BarChart, label: "Analytics", href: "/dashboard?tab=analytics", id: "analytics" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    if (href.includes("?")) {
      const [path, queryString] = href.split("?");
      if (!queryString) return false;
      
      const [key, value] = queryString.split("=");
      if (!key || !value) return false;
      
      return pathname === path && searchParams.get(key) === value;
    }
    return pathname === href;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <CardTitle className="mb-4 pl-1">Navigation</CardTitle>
        <nav className="space-y-2">
          {dashboardNavItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                "hover:bg-muted",
                isActive(item.href) ? "bg-muted" : ""
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
} 