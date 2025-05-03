import { Card } from "@workspace/ui/components/card";

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Artworks</h3>
        <p className="text-3xl font-bold">0</p>
      </Card>
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Followers</h3>
        <p className="text-3xl font-bold">0</p>
      </Card>
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Likes</h3>
        <p className="text-3xl font-bold">0</p>
      </Card>
    </div>
  );
} 