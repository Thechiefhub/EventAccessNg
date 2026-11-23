import { useState, useEffect } from "react";
import { 
  Settings, Clock, FileText, Plus, Loader2, Trash2, Sparkles, 
  Download, Edit, Calendar, MapPin, User, ArrowRight, Save, ClipboardList 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  is_completed: boolean;
  due_date: string | null;
  event_id: string;
}

interface EventData {
  id: string;
  name: string;
  event_date?: string | null;
  city?: string | null;
  country?: string | null;
  tagline?: string | null;
  theme_statement?: string | null;
  event_type?: string | null;
}

interface AgendaSlot {
  time: string;
  title: string;
  speakerRole: string;
  description: string;
  type: string; // Keynote, Panel, Break, Networking, Workshop, Interactive Session, Closing
}

interface AgendaDay {
  dayNumber: number;
  title: string;
  slots: AgendaSlot[];
}

interface AgendaResult {
  eventName: string;
  theme: string;
  durationDays: number;
  days: AgendaDay[];
  isDemoFallback?: boolean;
}

const defaultTasks = [
  { title: "Book venue and confirm availability", category: "Venue" },
  { title: "Book backup generator for venue", category: "Logistics" },
  { title: "Confirm PA system and microphone availability", category: "Logistics" },
  { title: "Arrange security (>100 attendees)", category: "Logistics" },
  { title: "Set up mobile money payments (M-Pesa/MoMo)", category: "Logistics" },
  { title: "Send speaker invitation emails", category: "Speakers" },
  { title: "Collect speaker headshots and bios", category: "Speakers" },
  { title: "Design and order event badges", category: "Marketing" },
  { title: "Submit early bird ticket post", category: "Marketing" },
  { title: "Recruit and brief volunteers", category: "Volunteers" },
  { title: "Plan for traffic/transport logistics", category: "Logistics" },
  { title: "Arrange catering with local vendors", category: "Logistics" },
  { title: "Upload attendee list to D-Day module", category: "D-Day" },
  { title: "Print attendee badges with QR codes", category: "D-Day" },
  { title: "Set up check-in desk and signage", category: "D-Day" },
  { title: "Test QR scanner on check-in devices", category: "D-Day" },
  { title: "Brief check-in staff on D-Day module", category: "D-Day" },
  { title: "Invite team members to D-Day check-in", category: "D-Day" },
  { title: "Prepare offline check-in backup plan", category: "D-Day" },
  { title: "Do a dry run of the check-in flow", category: "D-Day" },
];

const categories = ["All", "Venue", "Logistics", "Speakers", "Marketing", "Volunteers", "D-Day", "General"];

const sessionTypeColors: Record<string, string> = {
  Keynote: "bg-primary/20 text-primary border border-primary/30",
  Panel: "bg-amber-500/20 text-amber-600 border border-amber-500/30",
  Break: "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30",
  Networking: "bg-sky-500/20 text-sky-600 border border-sky-500/30",
  Workshop: "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30",
  "Interactive Session": "bg-fuchsia-500/20 text-fuchsia-600 border border-fuchsia-500/30",
  Closing: "bg-slate-500/20 text-slate-600 border border-slate-500/30",
};

const funnyLoadingSteps = [
  "AI Co-Pilot reviewing event focus & parameters...",
  "Analyzing target audience demographic benchmarks...",
  "Structuring custom slots, keynotes, and panel forums...",
  "Integrating classy Pan-African icebreakers & local context...",
  "Polishing workshop objectives and checklist dependencies...",
  "Finalizing high-energy closing socials and layout structure...",
];

export default function EngineModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedEventData, setSelectedEventData] = useState<EventData | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [adding, setAdding] = useState(false);

  // AI Agenda states
  const [activeTab, setActiveTab] = useState("checklist");
  const [aiTheme, setAiTheme] = useState("");
  const [aiDurationDays, setAiDurationDays] = useState(1);
  const [aiEventType, setAiEventType] = useState("Conference");
  const [aiCity, setAiCity] = useState("Lagos");
  const [aiCountry, setAiCountry] = useState("Nigeria");
  const [aiHours, setAiHours] = useState("09:00 - 17:00");
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(funnyLoadingSteps[0]);
  const [agendaResult, setAgendaResult] = useState<AgendaResult | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  // Slot editing states
  const [editingSlot, setEditingSlot] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
  const [editSlotTime, setEditSlotTime] = useState("");
  const [editSlotTitle, setEditSlotTitle] = useState("");
  const [editSlotSpeaker, setEditSlotSpeaker] = useState("");
  const [editSlotDescription, setEditSlotDescription] = useState("");
  const [editSlotType, setEditSlotType] = useState("Workshop");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("events")
      .select("id, name, event_date, city, country, tagline, theme_statement, event_type")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const evts = (data || []) as EventData[];
        setEvents(evts);
        if (evts.length > 0 && !selectedEvent) {
          setSelectedEvent(evts[0].id);
        }
      });
  }, [user]);

  useEffect(() => {
    const ev = events.find((e) => e.id === selectedEvent);
    setSelectedEventData(ev || null);
    if (ev) {
      setAiTheme(ev.theme_statement || ev.tagline || "");
      setAiCity(ev.city || "Lagos");
      setAiCountry(ev.country || "Nigeria");
      setAiEventType(ev.event_type || "Conference");
    }
  }, [selectedEvent, events]);

  const fetchItems = async () => {
    if (!selectedEvent) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("event_id", selectedEvent)
      .order("created_at");
    if (error) toast.error(error.message);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [selectedEvent]);

  const seedDefaults = async () => {
    if (!user || !selectedEvent) return;
    setAdding(true);
    const rows = defaultTasks.map((t) => ({ ...t, event_id: selectedEvent, user_id: user.id }));
    const { error } = await supabase.from("checklist_items").insert(rows);
    if (error) toast.error(error.message);
    else toast.success("Default checklist added!");
    await fetchItems();
    setAdding(false);
  };

  const toggleItem = async (item: ChecklistItem) => {
    const newVal = !item.is_completed;
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_completed: newVal } : i));
    const { error } = await supabase.from("checklist_items").update({ is_completed: newVal }).eq("id", item.id);
    if (error) {
      toast.error("Failed to update task");
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_completed: !newVal } : i));
    }
  };

  const addItem = async () => {
    if (!newTitle.trim() || !user || !selectedEvent) return;
    setAdding(true);
    const { error } = await supabase.from("checklist_items").insert({
      title: newTitle.trim(),
      category: newCategory,
      event_id: selectedEvent,
      user_id: user.id,
    });
    if (error) toast.error(error.message);
    else { setNewTitle(""); toast.success("Task added!"); }
    await fetchItems();
    setAdding(false);
  };

  const deleteItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("checklist_items").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); fetchItems(); }
  };

  // AI Agenda Generation Handler
  const handleGenerateAgenda = async () => {
    if (!selectedEventData) {
      toast.error("Please create or select an active event first.");
      return;
    }
    setAiLoading(true);
    setAgendaResult(null);

    // Step cycle loop for funny updates
    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % funnyLoadingSteps.length;
      setLoadingStep(funnyLoadingSteps[stepIdx]);
    }, 2800);

    try {
      const response = await fetch("/api/generate-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: selectedEventData.name,
          theme: aiTheme,
          durationDays: aiDurationDays,
          eventType: aiEventType,
          city: aiCity,
          country: aiCountry,
          hours: aiHours,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP request failed with status: " + response.status);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAgendaResult(data);
      setActiveDayTab(1);
      toast.success(data.isDemoFallback 
        ? "Demo falling-back agenda loaded! (Set your GEMINI_API_KEY for custom AI planning)" 
        : "AI Agenda generated successfully!"
      );
    } catch (err: any) {
      console.error(err);
      toast.error(`Agenda planning failed: ${err.message || err}`);
    } finally {
      clearInterval(interval);
      setAiLoading(false);
    }
  };

  // TIMELINE EDITING UTILS
  const handleOpenEditSlot = (dayIdx: number, slotIdx: number, slot: AgendaSlot) => {
    setEditingSlot({ dayIndex: dayIdx, slotIndex: slotIdx });
    setEditSlotTime(slot.time);
    setEditSlotTitle(slot.title);
    setEditSlotSpeaker(slot.speakerRole);
    setEditSlotDescription(slot.description);
    setEditSlotType(slot.type);
  };

  const handleSaveSlotEdit = () => {
    if (!agendaResult || !editingSlot) return;
    const { dayIndex, slotIndex } = editingSlot;
    
    const updatedDays = [...agendaResult.days];
    updatedDays[dayIndex].slots[slotIndex] = {
      time: editSlotTime,
      title: editSlotTitle,
      speakerRole: editSlotSpeaker,
      description: editSlotDescription,
      type: editSlotType
    };

    setAgendaResult({
      ...agendaResult,
      days: updatedDays
    });
    setEditingSlot(null);
    toast.success("Timeslot updated successfully!");
  };

  const handleAddSlot = (dayIdx: number) => {
    if (!agendaResult) return;
    
    const updatedDays = [...agendaResult.days];
    const newSlot: AgendaSlot = {
      time: "10:00 - 11:00",
      title: "New Custom Session",
      speakerRole: "Guest Speaker",
      description: "Brief summary description of the breakout or workshop focus.",
      type: "Workshop"
    };
    
    updatedDays[dayIdx].slots.push(newSlot);
    setAgendaResult({ ...agendaResult, days: updatedDays });
    
    // Open immediately for editing
    handleOpenEditSlot(dayIdx, updatedDays[dayIdx].slots.length - 1, newSlot);
    toast.info("New slot added! Customize it in the form.");
  };

  const handleDeleteSlot = (dayIdx: number, slotIdx: number) => {
    if (!agendaResult) return;
    
    const updatedDays = [...agendaResult.days];
    updatedDays[dayIdx].slots.splice(slotIdx, 1);
    
    setAgendaResult({ ...agendaResult, days: updatedDays });
    toast.success("Session removed from agenda.");
  };

  // EXPORT UTILS
  const handleExportPDF = () => {
    if (!agendaResult) return;
    try {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(33, 33, 33);
      doc.text("EVENT AGENDA SCHEDULE", 14, y);
      y += 10;

      doc.setFontSize(16);
      doc.setTextColor(215, 38, 56); // Classy hot crimson
      doc.text(agendaResult.eventName, 14, y);
      y += 8;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Theme: ${agendaResult.theme || "N/A"}`, 14, y);
      y += 6;
      doc.text(`Duration: ${agendaResult.durationDays} Day(s) | Generated by Myevent AI Co-Pilot`, 14, y);
      y += 12;

      // Divider line
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, 196, y);
      y += 10;

      agendaResult.days.forEach((day) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(53, 53, 53);
        doc.text(day.title || `Day ${day.dayNumber}`, 14, y);
        y += 8;

        day.slots.forEach((slot) => {
          if (y > 230) {
            doc.addPage();
            y = 20;
          }

          // Slot time & type
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(215, 38, 56);
          doc.text(`[${slot.time}] - ${slot.type.toUpperCase()}`, 14, y);
          y += 5;

          // Slot title
          doc.setFontSize(11);
          doc.setTextColor(30, 30, 30);
          doc.text(slot.title, 14, y);
          y += 5;

          // Speaker
          if (slot.speakerRole && slot.speakerRole !== "None") {
            doc.setFont("Helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text(`Presenter: ${slot.speakerRole}`, 14, y);
            y += 5;
          }

          // Description
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          const splitDescription = doc.splitTextToSize(slot.description, 180);
          doc.text(splitDescription, 14, y);
          y += splitDescription.length * 4 + 7;
        });

        y += 5; // space between days
      });

      doc.save(`${agendaResult.eventName.replace(/\s+/g, "_")}_agenda.pdf`);
      toast.success("Agenda exported to PDF successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportExcel = () => {
    if (!agendaResult) return;
    try {
      const rows: any[] = [];
      agendaResult.days.forEach((day) => {
        day.slots.forEach((slot) => {
          rows.push({
            "Day": `Day ${day.dayNumber}`,
            "Day Title": day.title,
            "Time": slot.time,
            "Session Title": slot.title,
            "Presenter / Speaker Role": slot.speakerRole,
            "Session Type": slot.type,
            "Description": slot.description
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Agenda");
      XLSX.writeFile(workbook, `${agendaResult.eventName.replace(/\s+/g, "_")}_agenda.xlsx`);
      toast.success("Agenda exported to Excel successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel.");
    }
  };

  // Sync sessions directly to Master Checklist
  const handleAddToChecklist = async () => {
    if (!agendaResult || !selectedEvent || !user) return;
    try {
      setAdding(true);
      const activeDay = agendaResult.days.find((d) => d.dayNumber === activeDayTab);
      if (!activeDay) return;

      const newTasks: any[] = [];
      activeDay.slots.forEach((slot) => {
        if (slot.type !== "Break") {
          newTasks.push({
            title: `Prepare logistics & AV setup for Day ${activeDayTab} session: ${slot.title}`,
            category: "Logistics",
            event_id: selectedEvent,
            user_id: user.id,
            is_completed: false
          });
          if (slot.speakerRole && slot.speakerRole !== "None") {
            newTasks.push({
              title: `Brief presenter (${slot.speakerRole}) for Day ${activeDayTab} session: ${slot.title}`,
              category: "Speakers",
              event_id: selectedEvent,
              user_id: user.id,
              is_completed: false
            });
          }
        }
      });

      if (newTasks.length === 0) {
        toast.info("No actionable sessions in this day to add.");
        setAdding(false);
        return;
      }

      const { error } = await supabase.from("checklist_items").insert(newTasks);
      if (error) throw error;

      toast.success(`Synced ${newTasks.length} agenda task(s) directly to your Master Checklist!`);
      fetchItems(); // reload checklist items
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to sync checklist: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const filtered = filter === "All" ? items : items.filter((t) => t.category === filter);
  const doneCount = items.filter((t) => t.is_completed).length;
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary animate-pulse" /> The Engine
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Your master checklists, logistics hubs, and AI scheduling copilot.</p>
        </div>

        {events.length > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Active Event:</span>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedEvent ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            Create an event in the dashboard first to get started with the logistics engine.
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/60 p-1 rounded-lg">
            <TabsTrigger value="checklist" className="flex items-center gap-1.5 py-2">
              <ClipboardList className="h-4 w-4" /> Checklist & Library
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex items-center gap-1.5 py-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Agenda Planner
            </TabsTrigger>
          </TabsList>

          {/* CHECKLIST & RESOURCES TAB */}
          <TabsContent value="checklist" className="space-y-6 mt-6">
            {/* Progress */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold text-foreground text-sm">Logistics Completion</h3>
                  <span className="font-display text-2xl font-bold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2.5" />
                <p className="text-xs text-muted-foreground">{doneCount} of {items.length} tasks completed</p>
              </CardContent>
            </Card>

            {/* Add Task */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Add a custom logistic or operational checklist task..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1"
                  maxLength={200}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <div className="flex gap-2">
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="w-28 sm:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="default" onClick={addItem} disabled={adding || !newTitle.trim()}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seed defaults */}
            {!loading && items.length === 0 && (
              <Card className="border-border bg-card/40 text-center py-8">
                <CardContent className="space-y-4 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground">No custom logistics tasks found for this event yet.</p>
                  <Button variant="outline" className="w-full text-xs" onClick={seedDefaults} disabled={adding}>
                    {adding ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                    Load Default African Summit Checklist
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Category Filter */}
            {items.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={filter === cat ? "default" : "outline"}
                    className={`cursor-pointer text-xs px-2.5 py-0.5 rounded-full transition-all ${
                      filter === cat ? "bg-primary hover:bg-primary/95 text-white border-transparent" : "text-muted-foreground"
                    }`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {/* Task List */}
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-2">
                {filtered.map((task) => (
                  <Card key={task.id} className={`border-border hover:border-muted transition-all shadow-sm ${task.is_completed ? "opacity-60 bg-muted/20" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox checked={task.is_completed} onCheckedChange={() => toggleItem(task)} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">{task.category}</Badge>
                          {task.due_date && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 w-8 p-0" onClick={() => deleteItem(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Resources */}
            <Card className="border-border shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="font-display text-md flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Logistics Templates & Downloads
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  {["African Corporate Budget Sheet", "Safety & Emergency Floor Plan Layout", "Pan-African Volunteer Handbooks", "Post-Event Survey Samples"].map((res) => (
                    <button key={res} className="text-left rounded-lg border border-border p-3 hover:border-primary hover:shadow-warm transition-all text-xs text-foreground flex items-center justify-between">
                      <span className="flex items-center"><FileText className="h-4 w-4 text-muted-foreground inline mr-2" />{res}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI AGENDA PLANNER TAB */}
          <TabsContent value="agenda" className="space-y-6 mt-6">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="font-display text-md">Generate Structured Event Agenda</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Provide schedule parameters and let the AI assistant curate a high-quality, professional timeline with local Pan-African networking references.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Event Theme & Core Focus</label>
                    <Input
                      placeholder="e.g. Scaling Fintech, Blockchain in Africa, Tech Talent Pipeline..."
                      value={aiTheme}
                      onChange={(e) => setAiTheme(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Event Type</label>
                    <Select value={aiEventType} onValueChange={setAiEventType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Conference", "Summit", "Workshop/Bootcamp", "Hackathon", "Corporate Launch", "Festival/Cultural Social"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Daily Schedule Hours</label>
                    <Select value={aiHours} onValueChange={setAiHours}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["09:00 - 17:00", "08:30 - 16:30", "10:00 - 18:00", "09:00 - 13:00 (Half Day)"].map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Location (City)</label>
                      <Input
                        value={aiCity}
                        onChange={(e) => setAiCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Country</label>
                      <Input
                        value={aiCountry}
                        onChange={(e) => setAiCountry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground">Duration (Days)</label>
                      <span className="text-xs font-bold text-primary">{aiDurationDays} Day(s)</span>
                    </div>
                    <Input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={aiDurationDays}
                      onChange={(e) => setAiDurationDays(parseInt(e.target.value))}
                      className="accent-primary cursor-pointer h-2 bg-muted rounded-lg appearance-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    className="w-full md:w-auto"
                    disabled={aiLoading}
                    onClick={handleGenerateAgenda}
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Agenda...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Agenda
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Loading status */}
            {aiLoading && (
              <Card className="border border-primary/20 bg-primary/5 py-12 text-center shadow-inner">
                <CardContent className="space-y-4 max-w-md mx-auto">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm font-medium text-foreground tracking-wide animate-pulse">{loadingStep}</p>
                  <p className="text-xs text-muted-foreground">Gemini is structuring dates, scheduling lunch slots, and adding local African elements. This typically takes 3-6 seconds.</p>
                </CardContent>
              </Card>
            )}

            {/* AGENDA DISPLAY */}
            {agendaResult && (
              <div className="space-y-6">
                {/* Control Panel / Exports */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/40 p-4 rounded-lg border border-border shadow-sm">
                  <div>
                    <h3 className="font-display font-semibold text-sm text-foreground">Customized Interactive Agenda</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Click any session block to edit inline. Append new slots or export as a final schedule.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-initial" onClick={handleExportPDF}>
                      <Download className="h-3.5 w-3.5 mr-1" /> PDF
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-initial" onClick={handleExportExcel}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Excel
                    </Button>
                    <Button variant="default" size="sm" className="text-xs flex-1 sm:flex-initial" onClick={handleAddToChecklist}>
                      <ClipboardList className="h-3.5 w-3.5 mr-1" /> Add to Checklist
                    </Button>
                  </div>
                </div>

                {/* Day Selectors */}
                {agendaResult.durationDays > 1 && (
                  <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
                    {agendaResult.days.map((day) => (
                      <Button
                        key={day.dayNumber}
                        variant={activeDayTab === day.dayNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveDayTab(day.dayNumber)}
                        className={`text-xs ${
                          activeDayTab === day.dayNumber ? "bg-primary text-white hover:bg-primary/95" : ""
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5 mr-1" /> Day {day.dayNumber}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Day Timeline */}
                {agendaResult.days.filter((d) => d.dayNumber === activeDayTab).map((day, dayIdx) => {
                  const actualDayIndex = agendaResult.days.findIndex(d => d.dayNumber === activeDayTab);
                  return (
                    <div key={day.dayNumber} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-md text-foreground">{day.title || `Day ${day.dayNumber}`}</h4>
                        <Button variant="outline" size="xs" className="text-xs" onClick={() => handleAddSlot(actualDayIndex)}>
                          <Plus className="h-3 w-3 mr-1" /> Add Slot
                        </Button>
                      </div>

                      {day.slots.length === 0 ? (
                        <div className="text-center py-10 rounded-lg border border-dashed border-border text-muted-foreground text-xs">
                          No sessions created for Day {day.dayNumber}. Click 'Add Slot' above.
                        </div>
                      ) : (
                        <div className="relative border-l border-muted pl-4 ml-2 space-y-4">
                          {day.slots.map((slot, slotIdx) => (
                            <div key={slotIdx} className="relative group">
                              {/* Timeline indicator circle */}
                              <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-primary" />
                              
                              <Card className="border border-border hover:border-muted shadow-sm transition-all">
                                <CardContent className="p-4 flex flex-col md:flex-row md:items-start gap-3">
                                  {/* Left: Time and Type */}
                                  <div className="md:w-44 flex flex-row md:flex-col items-center md:items-start gap-2 shrink-0">
                                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                                      <Clock className="h-3.5 w-3.5 text-primary" /> {slot.time}
                                    </span>
                                    <Badge className={`text-[10px] uppercase font-semibold px-2 py-0.5 whitespace-nowrap rounded-md ${sessionTypeColors[slot.type] || "bg-muted text-muted-foreground"}`}>
                                      {slot.type}
                                    </Badge>
                                  </div>

                                  {/* Right: Content details */}
                                  <div className="flex-1 space-y-1.5">
                                    <h5 className="font-display font-bold text-sm text-foreground">{slot.title}</h5>
                                    
                                    {slot.speakerRole && slot.speakerRole !== "None" && (
                                      <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-primary" /> Presenter: {slot.speakerRole}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">{slot.description}</p>
                                  </div>

                                  {/* Edit / Actions */}
                                  <div className="flex md:flex-col gap-1 self-end md:self-auto shrink-0 pt-2 md:pt-0">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground"
                                      onClick={() => handleOpenEditSlot(actualDayIndex, slotIdx, slot)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDeleteSlot(actualDayIndex, slotIdx)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* EDIT TIMESLOT DIALOG */}
      <Dialog open={editingSlot !== null} onOpenChange={(open) => !open && setEditingSlot(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Customize Timeslot
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time Range</label>
                <Input value={editSlotTime} onChange={(e) => setEditSlotTime(e.target.value)} placeholder="09:00 - 10:00" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Type</label>
                <Select value={editSlotType} onValueChange={setEditSlotType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(sessionTypeColors).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Title</label>
              <Input value={editSlotTitle} onChange={(e) => setEditSlotTitle(e.target.value)} placeholder="Keynote or session title" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Presenter / Speaker Role</label>
              <Input value={editSlotSpeaker} onChange={(e) => setEditSlotSpeaker(e.target.value)} placeholder="e.g. Managing Director or 'None'" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Brief Description</label>
              <Textarea 
                value={editSlotDescription} 
                onChange={(e) => setEditSlotDescription(e.target.value)} 
                placeholder="Give details about what attendees will learn or discuss..." 
                rows={3} 
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingSlot(null)}>Cancel</Button>
            <Button variant="default" size="sm" onClick={handleSaveSlotEdit}>
              <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
