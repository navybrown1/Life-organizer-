import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Pin, PinOff, Loader2, Search } from "lucide-react";

export default function NotesPage() {
  const utils = trpc.useUtils();
  const { data: notes, isLoading } = trpc.note.list.useQuery();
  const createNote = trpc.note.create.useMutation({
    onSuccess: () => {
      utils.note.list.invalidate();
      setDialogOpen(false);
      resetForm();
    },
  });
  const updateNote = trpc.note.update.useMutation({
    onSuccess: () => {
      utils.note.list.invalidate();
      setDialogOpen(false);
      setEditingNote(null);
      resetForm();
    },
  });
  const deleteNote = trpc.note.delete.useMutation({
    onSuccess: () => utils.note.list.invalidate(),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: number;
    title: string;
    content: string | null;
    tags: string | null;
    pinned: boolean | null;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [pinned, setPinned] = useState(false);
  const [search, setSearch] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setPinned(false);
  };

  const openCreate = () => {
    setEditingNote(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (note: typeof editingNote) => {
    if (!note) return;
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content ?? "");
    setTags(note.tags ?? "");
    setPinned(note.pinned ?? false);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingNote) {
      updateNote.mutate({
        id: editingNote.id,
        title,
        content: content || undefined,
        tags: tags || undefined,
        pinned,
      });
    } else {
      createNote.mutate({
        title,
        content: content || undefined,
        tags: tags || undefined,
        pinned,
      });
    }
  };

  const togglePin = (note: NonNullable<typeof notes>[number]) => {
    updateNote.mutate({
      id: note.id,
      pinned: !note.pinned,
    });
  };

  const filteredNotes =
    notes?.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        (n.content?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (n.tags?.toLowerCase() ?? "").includes(search.toLowerCase()),
    ) ?? [];

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);

  const renderNoteCard = (note: NonNullable<typeof notes>[number]) => (
    <Card key={note.id} className={`hover:shadow-md transition-shadow ${note.pinned ? "border-primary/30" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold line-clamp-1">{note.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePin(note)}>
              {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(note)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => deleteNote.mutate({ id: note.id })}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {note.content && (
          <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{note.content}</p>
        )}
        {note.tags && (
          <div className="flex flex-wrap gap-1">
            {note.tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-1">Capture ideas and thoughts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="space-y-6">
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Other Notes</h2>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unpinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            {search ? "No notes match your search." : "No notes yet. Start capturing your thoughts!"}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ideas, work, personal" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="pinned" className="text-sm font-medium">Pin this note</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {editingNote ? "Save Changes" : "Create Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
