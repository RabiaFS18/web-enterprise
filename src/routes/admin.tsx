import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plus, Trash2, Pencil, X, Check, LogOut,
  Package, Briefcase, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/rk-logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — R.K. Enterprises" }] }),
  component: AdminPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  sort_order: number;
};

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  intro: string;
  includes: string[];
  sort_order: number;
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

type Tab = "products" | "services" | "enquiries";

// ─── Main Page ────────────────────────────────────────────────────────────────
function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate({ to: "/signin" });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="R.K. Enterprises" className="h-9 w-auto" />
            <span className="font-display text-base font-bold text-primary">Admin Panel</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">{user.email}</span>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl gap-1 px-5">
          {(["products", "services", "enquiries"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold capitalize transition-colors ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "products" && <Package className="h-4 w-4" />}
              {t === "services" && <Briefcase className="h-4 w-4" />}
              {t === "enquiries" && <MessageSquare className="h-4 w-4" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-5 py-8">
        {tab === "products" && <ProductsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "enquiries" && <EnquiriesTab />}
      </main>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const emptyForm = { title: "", category: "", description: "", icon: "package", sort_order: 0 };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from("catalog_products")
      .select("*")
      .order("sort_order");
    setProducts(data ?? []);
    setLoading(false);
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({ title: p.title, category: p.category, description: p.description, icon: p.icon, sort_order: p.sort_order });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    if (!form.title || !form.category || !form.description) return;
    setSaving(true);
    if (editing) {
      await supabase.from("catalog_products").update(form).eq("id", editing.id);
    } else {
      await supabase.from("catalog_products").insert(form);
    }
    setSaving(false);
    cancelForm();
    fetchProducts();
  }

  async function remove(id: string) {
    if (!confirm("Yeh product delete karna chahte ho?")) return;
    await supabase.from("catalog_products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Products</h2>
        <button
          onClick={() => { cancelForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-bold">
            {editing ? "Edit Product" : "New Product"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-style">Title *</label>
              <input className="input-style" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product title" />
            </div>
            <div>
              <label className="label-style">Category *</label>
              <input className="input-style" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Safety, Fire, Security..." />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Description *</label>
              <textarea className="input-style" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" />
            </div>
            <div>
              <label className="label-style">Icon name</label>
              <input className="input-style" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="package, shield, flame..." />
            </div>
            <div>
              <label className="label-style">Sort order</label>
              <input className="input-style" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              <Check className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancelForm} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium">
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Koi product nahi — "Add Product" se banao
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.category}</span>
                  <h3 className="mt-1 font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(p)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const emptyForm = { title: "", slug: "", description: "", icon: "briefcase", intro: "", includes: "", sort_order: 0 };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase.from("catalog_services").select("*").order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  }

  function startEdit(s: Service) {
    setEditing(s);
    setForm({
      title: s.title, slug: s.slug, description: s.description,
      icon: s.icon, intro: s.intro, includes: s.includes.join("\n"), sort_order: s.sort_order,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    if (!form.title || !form.slug || !form.description) return;
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      icon: form.icon,
      intro: form.intro,
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      sort_order: form.sort_order,
    };
    if (editing) {
      await supabase.from("catalog_services").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("catalog_services").insert(payload);
    }
    setSaving(false);
    cancelForm();
    fetchServices();
  }

  async function remove(id: string) {
    if (!confirm("Yeh service delete karna chahte ho?")) return;
    await supabase.from("catalog_services").delete().eq("id", id);
    fetchServices();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Services</h2>
        <button
          onClick={() => { cancelForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-bold">
            {editing ? "Edit Service" : "New Service"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-style">Title *</label>
              <input className="input-style" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Service title" />
            </div>
            <div>
              <label className="label-style">Slug * (URL mein use hoga)</label>
              <input className="input-style" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="event-management" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Short Description *</label>
              <textarea className="input-style" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Full Intro</label>
              <textarea className="input-style" rows={3} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} placeholder="Detailed introduction" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Includes (har item alag line mein)</label>
              <textarea className="input-style" rows={5} value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} placeholder={"Civil & structural works\nRenovation and refurbishment\nSite supervision"} />
            </div>
            <div>
              <label className="label-style">Icon name</label>
              <input className="input-style" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="building, shield, users..." />
            </div>
            <div>
              <label className="label-style">Sort order</label>
              <input className="input-style" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              <Check className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancelForm} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium">
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Koi service nahi — "Add Service" se banao
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">/{s.slug}</p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              {s.includes?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {s.includes.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}
                  {s.includes.length > 3 && <li className="text-xs text-muted-foreground">+{s.includes.length - 3} more</li>}
                </ul>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(s)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Enquiries Tab ─────────────────────────────────────────────────────────────
function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchEnquiries(); }, []);

  async function fetchEnquiries() {
    setLoading(true);
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setEnquiries(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("enquiries").update({ status }).eq("id", id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-500",
    read: "bg-yellow-500/10 text-yellow-600",
    resolved: "bg-green-500/10 text-green-600",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Enquiries</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {enquiries.filter((e) => e.status === "new").length} new
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Abhi tak koi enquiry nahi aayi
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColors[e.status] ?? statusColors.new}`}>
                    {e.status}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.email} {e.phone ? `· ${e.phone}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {new Date(e.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {expanded === e.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {expanded === e.id && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-foreground">{e.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">Mark as:</span>
                    {["new", "read", "resolved"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(e.id, s)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                          e.status === s ? statusColors[s] : "border border-border hover:bg-secondary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
