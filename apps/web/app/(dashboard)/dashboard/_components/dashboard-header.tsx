import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <Card className="p-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button asChild>
        <Link href="/upload">Upload Artwork</Link>
      </Button>
    </Card>
  );
} 