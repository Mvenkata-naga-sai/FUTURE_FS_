import { useGetDashboardStats, useGetRecentLeads } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp, UserPlus, XCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentLeads, isLoading: leadsLoading } = useGetRecentLeads();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Here is your pipeline overview for today.</p>
      </div>

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{stats.recentCount} this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.byStatus.converted} converted leads
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.byStatus.new}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Needs attention
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lost Deals</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.byStatus.lost}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total lost leads
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                The latest prospects added to your pipeline.
              </CardDescription>
            </div>
            <Link 
              href="/leads" 
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {leadsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <Link 
                    key={lead.id} 
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{lead.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{lead.company || lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                      </div>
                      <LeadStatusBadge status={lead.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p>No recent leads found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>By Source</CardTitle>
            <CardDescription>Where your leads are coming from.</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : stats?.bySource && stats.bySource.length > 0 ? (
              <div className="space-y-4">
                {stats.bySource.map((src, i) => (
                  <div key={src.source} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate pr-4">{src.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{src.count}</span>
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(src.count / stats.totalLeads) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No source data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
