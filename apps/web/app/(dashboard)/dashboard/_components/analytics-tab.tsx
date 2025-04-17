import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Eye, Download, Heart } from "lucide-react";

interface AnalyticsTabProps {
  stats: {
    views: number;
    downloads: number;
    likes: number;
  };
}

export function AnalyticsTab({ stats }: AnalyticsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{stats?.views ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-green-500/10">
              <Download className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Downloads</p>
              <p className="text-2xl font-bold">{stats?.downloads ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-red-500/10">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-2xl font-bold">{stats?.likes ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
      </CardContent>
    </Card>
  );
} 