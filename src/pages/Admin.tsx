import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, Download, Search, Loader2, Recycle, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CONDITION_LABELS, formatINR } from "@/lib/calculator";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

type LeadStatus = "new" | "contacted" | "converted" | "rejected";

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  car_category: string;
  car_model: string | null;
  year: number;
  condition: "excellent" | "good" | "poor";
  estimated_price_min: number | null;
  estimated_price_max: number | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-accent-blue-soft text-accent-blue",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-accent-green-soft text-accent-green",
  rejected: "bg-muted text-muted-foreground",
};

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [changePwOpen, setChangePwOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard | car2scrap";
  }, []);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.city.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = leads.filter((l) => new Date(l.created_at) >= today).length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const rate = total > 0 ? Math.round((converted / total) * 100) : 0;
    return { total, newToday, converted, rate };
  }, [leads]);

  async function updateLead(id: string, patch: Partial<Lead>) {
    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Lead updated");
    qc.invalidateQueries({ queryKey: ["leads"] });
    if (selected?.id === id) setSelected({ ...selected, ...patch } as Lead);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  function exportCSV() {
    const rows = [
      ["Date", "Name", "Phone", "City", "Type", "Model", "Year", "Condition", "Min", "Max", "Source", "Status", "Notes"],
      ...filtered.map((l) => [
        new Date(l.created_at).toISOString(),
        l.name,
        l.phone,
        l.city,
        l.car_category,
        l.car_model ?? "",
        String(l.year),
        l.condition,
        String(l.estimated_price_min ?? ""),
        String(l.estimated_price_max ?? ""),
        l.source ?? "",
        l.status,
        (l.notes ?? "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `car2scrap-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta text-accent-green-foreground">
              <Recycle className="h-5 w-5" />
            </span>
            <span className="font-[Poppins]">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => setChangePwOpen(true)}>
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">Change Password</span>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Total leads" value={stats.total} />
          <KPI label="New today" value={stats.newToday} accent="green" />
          <KPI label="Converted" value={stats.converted} accent="blue" />
          <KPI label="Conversion rate" value={`${stats.rate}%`} />
        </div>

        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading leads…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No leads match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Estimate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow
                      key={l.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(l)}
                    >
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(l.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell className="font-mono text-xs">{l.phone}</TableCell>
                      <TableCell>{l.city}</TableCell>
                      <TableCell className="text-sm">
                        {l.car_model || l.car_category} · {l.year}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {l.estimated_price_min
                          ? `${formatINR(l.estimated_price_min)} – ${formatINR(l.estimated_price_max ?? 0)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[l.status] + " border-0"}>
                          {l.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  Submitted{" "}
                  {new Date(selected.created_at).toLocaleString("en-IN")}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4 text-sm">
                <Field label="Phone">
                  <a href={`tel:+91${selected.phone}`} className="text-accent-blue hover:underline">
                    +91 {selected.phone}
                  </a>
                </Field>
                <Field label="City">{selected.city}</Field>
                <Field label="Car">
                  {selected.car_model || selected.car_category} · {selected.year} ·{" "}
                  {CONDITION_LABELS[selected.condition]}
                </Field>
                <Field label="Estimated price">
                  {selected.estimated_price_min
                    ? `${formatINR(selected.estimated_price_min)} – ${formatINR(selected.estimated_price_max ?? 0)}`
                    : "—"}
                </Field>
                <Field label="Source">{selected.source ?? "—"}</Field>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateLead(selected.id, { status: v as LeadStatus })}
                  >
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    defaultValue={selected.notes ?? ""}
                    rows={4}
                    className="mt-1.5"
                    onBlur={(e) => {
                      if (e.target.value !== (selected.notes ?? "")) {
                        updateLead(selected.id, { notes: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ChangePasswordDialog open={changePwOpen} onOpenChange={setChangePwOpen} />
    </div>
  );
}

function KPI({
  label, value, accent,
}: { label: string; value: string | number; accent?: "green" | "blue" }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={`text-3xl font-bold mt-2 font-[Poppins] ${
          accent === "green" ? "text-accent-green" : accent === "blue" ? "text-accent-blue" : ""
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{children}</p>
    </div>
  );
}