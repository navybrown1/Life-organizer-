import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: Date;
  endTime: Date;
  allDay: boolean | null;
  color: string | null;
  categoryId: number | null;
  userId: number;
  createdAt: Date;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);

  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.event.list.useQuery();
  const createEvent = trpc.event.create.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
      setDialogOpen(false);
      resetForm();
    },
  });
  const updateEvent = trpc.event.update.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
      setDialogOpen(false);
      setEditingEvent(null);
      resetForm();
    },
  });
  const deleteEvent = trpc.event.delete.useMutation({
    onSuccess: () => utils.event.list.invalidate(),
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setAllDay(false);
  };

  const openCreate = (date?: Date) => {
    setEditingEvent(null);
    resetForm();
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      setStartTime(`${dateStr}T09:00`);
      setEndTime(`${dateStr}T10:00`);
    }
    setDialogOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description ?? "");
    setLocation(event.location ?? "");
    setStartTime(format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"));
    setAllDay(event.allDay ?? false);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !startTime || !endTime) return;
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (editingEvent) {
      updateEvent.mutate({
        id: editingEvent.id,
        title,
        description: description || undefined,
        location: location || undefined,
        startTime: start,
        endTime: end,
        allDay,
      });
    } else {
      createEvent.mutate({
        title,
        description: description || undefined,
        location: location || undefined,
        startTime: start,
        endTime: end,
        allDay,
      });
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const eventsForDay = (date: Date) =>
    events?.filter((e) => isSameDay(new Date(e.startTime), date)) ?? [];

  const selectedEvents = selectedDate ? eventsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Plan your schedule</p>
        </div>
        <Button onClick={() => openCreate(new Date())}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d, i) => {
                    const dayEvents = eventsForDay(d);
                    const isSelected = selectedDate && isSameDay(d, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={`min-h-[80px] rounded-lg border p-1 text-left transition-colors hover:bg-muted/50 ${
                          !isSameMonth(d, currentMonth) ? "opacity-40" : ""
                        } ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <div className="text-sm font-medium px-1">{format(d, "d")}</div>
                        <div className="space-y-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((e) => (
                            <div
                              key={e.id}
                              className="text-[10px] truncate rounded px-1 py-0.5 text-white"
                              style={{ backgroundColor: e.color ?? "#3b82f6" }}
                            >
                              {e.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
            </CardTitle>
            {selectedDate && (
              <Button variant="ghost" size="sm" onClick={() => openCreate(selectedDate)}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: event.color ?? "#3b82f6" }}
                          />
                          <p className="font-medium">{event.title}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(event)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => deleteEvent.mutate({ id: event.id })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.allDay
                            ? "All day"
                            : `${format(new Date(event.startTime), "h:mm a")} - ${format(new Date(event.endTime), "h:mm a")}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No events on this day.
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click a date on the calendar to see events.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={2} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start</label>
                <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End</label>
                <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="allDay" className="text-sm font-medium">All day event</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || !startTime || !endTime}>
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
