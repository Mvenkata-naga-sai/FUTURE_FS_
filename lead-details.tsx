import { useState, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import { 
  useGetLead, 
  useUpdateLeadStatus, 
  useDeleteLead, 
  useListNotes, 
  useCreateNote,
  getGetLeadQueryKey,
  getListNotesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, Clock, 
  MoreVertical, Trash2, Send, Plus, CheckCircle2, User, Share2 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const leadId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [noteContent, setNoteContent] = useState("");

  const { data: lead, isLoading: leadLoading } = useGetLead(leadId, { 
    query: { enabled: !!leadId } 
  });
  
  const { data: notes, isLoading: notesLoading } = useListNotes(leadId, {
    query: { enabled: !!leadId }
  });

  const updateStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();
  const createNote = useCreateNote();

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate(
      { id: leadId, data: { status: newStatus as any } },
      {
        onSuccess: (data) => {
          // Patch cache locally to avoid full refetch
          queryClient.setQueryData(getGetLeadQueryKey(leadId), (old: any) => 
            old ? { ...old, status: data.status } : old
          );
          toast({
            title: "Status updated",
            description: `Lead status changed to ${newStatus}.`,
          });
        }
      }
    );
  };

  const handleDelete = () => {
    deleteLead.mutate(
      { id: leadId },
      {
        onSuccess: () => {
          toast({
            title: "Lead deleted",
            description: "The lead has been removed successfully.",
          });
          setLocation("/leads");
        }
      }
    );
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    
    createNote.mutate(
      { id: leadId, data: { content: noteContent } },
      {
        onSuccess: () => {
          setNoteContent("");
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey(leadId) });
          toast({
            title: "Note added",
            description: "Your note has been saved.",
          });
        }
      }
    );
  };

  if (leadLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Lead Not Found</h2>
        <p className="text-muted-foreground mb-6">The lead you are looking for does not exist or has been deleted.</p>
        <Button asChild>
          <Link href="/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/leads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
              <LeadStatusBadge status={lead.status} className="text-sm px-3 py-1" />
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span>Added {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span className="capitalize">{lead.source} source</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-md p-1 border border-border">
            {['new', 'contacted', 'converted', 'lost'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-sm capitalize transition-all duration-200 ${
                  lead.status === s 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link copied to clipboard" });
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Lead
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the lead
                      "{lead.name}" and all associated notes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-2">
        {/* Main Content (2/3) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Timeline / Notes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Timeline & Notes</h2>
            </div>
            
            {/* Add Note Composer */}
            <Card className="mb-6 border-primary/20 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-border bg-muted/30">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Log an interaction
                </span>
              </div>
              <div className="p-0">
                <Textarea 
                  placeholder="What happened? Log a call, email, or meeting..." 
                  className="min-h-[100px] border-0 focus-visible:ring-0 resize-none rounded-none bg-transparent"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </div>
              <div className="p-3 border-t border-border bg-muted/20 flex justify-end">
                <Button 
                  onClick={handleAddNote} 
                  disabled={!noteContent.trim() || createNote.isPending}
                  size="sm"
                  className="gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save Note
                </Button>
              </div>
            </Card>

            {/* Timeline Feed */}
            <div className="space-y-4">
              {notesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : notes && notes.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                  {notes.map((note, index) => (
                    <div key={note.id} className="relative flex items-start group animate-in slide-in-from-left-4 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="absolute left-[-24px] flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover:border-primary transition-colors">
                        <CheckCircle2 className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <Card className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-border/60">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                          <span className="text-sm font-medium text-foreground">Note added</span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(note.createdAt), "MMM d, h:mm a")}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                          {note.followUpDate && (
                            <div className="mt-3 flex items-center text-xs text-primary font-medium bg-primary/10 w-fit px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3 mr-1" />
                              Follow up: {format(new Date(note.followUpDate), "MMM d, yyyy")}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                  
                  {/* Creation event */}
                  <div className="relative flex items-start text-muted-foreground">
                    <div className="absolute left-[-24px] flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                      <User className="h-3 w-3" />
                    </div>
                    <div className="flex-1 py-1 text-sm">
                      Lead created • {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card/50">
                  <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium">No notes yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Log your first interaction above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{lead.email}</span>
                  <span className="text-xs text-muted-foreground">Email</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{lead.phone || "—"}</span>
                  <span className="text-xs text-muted-foreground">Phone</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{lead.company || "—"}</span>
                  <span className="text-xs text-muted-foreground">Company</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {lead.notes && (
            <Card className="shadow-sm border-border/80 bg-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-muted-foreground uppercase tracking-wider">
                  Initial Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{lead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
