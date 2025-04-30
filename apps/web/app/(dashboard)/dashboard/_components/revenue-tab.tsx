import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { DollarSign, Clock, Info } from "lucide-react";
import React from "react";

export function RevenueTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-1">Available now</p>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-sm text-muted-foreground">Total pending</p>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-sm text-muted-foreground">Available soon</p>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button className="bg-muted text-foreground flex-1" disabled>
            <DollarSign className="h-4 w-4 mr-2" /> Withdraw
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <Clock className="h-4 w-4 mr-2" /> View transfer history
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Revenue features will be available when we do a full release. For more information, see our <a href="#" className="underline">rewards info page</a>.
        </p>
      </CardContent>
    </Card>
  );
} 