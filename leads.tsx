import { useState } from "react";
import { useListLeads, useUpdateLeadStatus, getListLeadsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { Link } from "wouter";
import { Search, Filter, Mail, Phone, Building2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function LeadsList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryParams = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(status !== "all" ? { status: status as any } : {})
  };

  const { data: leads, isLoading } = useListLeads(queryParams);
  const updateStatus = useUpdateLeadStatus();

  // Simple debounce for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateStatus.mutate(
      { id: leadId, data: { status: newStatus as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey(queryParams) });
          toast({
            title: "Status updated",
            description: `Lead status changed to ${newStatus}.`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update lead status.",
          });
        }
      }
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your incoming prospects.</p>
        </div>
        <Button asChild className="shadow-sm">
          <Link href="/leads/new">Add New Lead</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads by name, email, or company..." 
            className="pl-9 bg-background"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Lead</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Added</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : leads && leads.length > 0 ? (
              leads.map((lead, index) => (
                <TableRow 
                  key={lead.id}
                  className="group hover:bg-muted/30 transition-colors animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <Link href={`/leads/${lead.id}`} className="font-medium hover:underline hover:text-primary transition-colors">
                        {lead.name}
                      </Link>
                      {lead.company && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Building2 className="w-3 h-3 mr-1" />
                          {lead.company}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        <a href={`mailto:${lead.email}`} className="hover:text-foreground transition-colors">{lead.email}</a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          <a href={`tel:${lead.phone}`} className="hover:text-foreground transition-colors">{lead.phone}</a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="capitalize">{lead.source}</span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/leads/${lead.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "new")} disabled={lead.status === "new"}>
                          Mark as New
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "contacted")} disabled={lead.status === "contacted"}>
                          Mark as Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "converted")} disabled={lead.status === "converted"}>
                          Mark as Converted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "lost")} disabled={lead.status === "lost"}>
                          Mark as Lost
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Filter className="h-8 w-8 mb-4 opacity-20" />
                    <p>No leads found matching your criteria.</p>
                    <Button variant="link" onClick={() => { setSearch(""); setDebouncedSearch(""); setStatus("all"); }} className="mt-2">
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
