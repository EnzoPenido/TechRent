"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="border border-white/10 bg-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4 bg-slate-700" />
            <Skeleton className="h-4 w-1/2 bg-slate-800" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-slate-800" />
          <Skeleton className="h-4 w-4/5 bg-slate-800" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
            <Skeleton className="h-6 w-24 rounded-full bg-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-700" />
          <Skeleton className="h-4 w-32 bg-slate-800" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 bg-slate-700" />
          <Skeleton className="h-10 w-20 bg-slate-700" />
        </div>
      </div>
      <div className="grid gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
