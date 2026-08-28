"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Eye,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ImageUploader } from "@/components/ui/ImageUploader";

type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "cms"
  | "settings";

export function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Stats state
  const [stats, setStats] = useState<any>(null);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productFeaturedImg, setProductFeaturedImg] = useState("");

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryImg, setCategoryImg] = useState("");

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Customers state
  const [customers, setCustomers] = useState<any[]>([]);

  // CMS Content state
  const [siteContent, setSiteContent] = useState<any>(null);
  const [cmsTab, setCmsTab] = useState<"hero" | "trust" | "limited" | "story" | "contact" | "footer" | "seo">("hero");

  // Show Toast helper
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check admin session on mount
  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.success || !data.user || data.user.role !== "admin") {
          router.push("/admin/login");
          return;
        }
        setUser(data.user);
        fetchDashboardData();
      } catch (err) {
        router.push("/admin/login");
      }
    }
    checkAdminAuth();
  }, [router]);

  // Fetch data based on active tab or refresh
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes, custRes, cmsRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/products").then((r) => r.json()),
        fetch("/api/admin/categories").then((r) => r.json()),
        fetch("/api/admin/orders").then((r) => r.json()),
        fetch("/api/admin/customers").then((r) => r.json()),
        fetch("/api/admin/site-content").then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (ordRes.success) setOrders(ordRes.orders || []);
      if (custRes.success) setCustomers(custRes.customers || []);
      if (cmsRes.success) setSiteContent(cmsRes.content);
    } catch (err: any) {
      showToast("error", "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Product CRUD handlers
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const featuredImgVal = (formData.get("featuredImage") as string) || productFeaturedImg;
    const imagesStr = formData.get("images") as string;
    let imagesArray = imagesStr
      ? imagesStr.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    if (featuredImgVal && !imagesArray.includes(featuredImgVal)) {
      imagesArray.unshift(featuredImgVal);
    }
    if (imagesArray.length === 0 && featuredImgVal) {
      imagesArray = [featuredImgVal];
    }

    const rawPrice = formData.get("price") as string;
    const rawCompare = formData.get("compareAtPrice") as string;
    const rawStock = formData.get("stock") as string;
    const rawSlug = (formData.get("slug") as string)?.trim();
    const rawShort = (formData.get("shortDescription") as string)?.trim();
    const rawCollection = (formData.get("collectionName") as string)?.trim();

    const payload = {
      name: (formData.get("name") as string)?.trim(),
      slug: rawSlug || undefined,
      SKU: (formData.get("SKU") as string)?.trim(),
      price: rawPrice !== "" && !isNaN(Number(rawPrice)) ? Number(rawPrice) : 0,
      compareAtPrice: rawCompare !== "" && !isNaN(Number(rawCompare)) ? Number(rawCompare) : undefined,
      stock: rawStock !== "" && !isNaN(Number(rawStock)) ? Number(rawStock) : 0,
      category: formData.get("category") as string,
      material: (formData.get("material") as string) || "18K Gold",
      collectionName: rawCollection || undefined,
      featuredImage: featuredImgVal,
      images: imagesArray,
      description: (formData.get("description") as string)?.trim(),
      shortDescription: rawShort || undefined,
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
    };

    const isEdit = !!editingProduct?._id;
    const url = isEdit ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to save product");
        return;
      }

      showToast("success", isEdit ? "Product updated successfully" : "Product created successfully");
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to delete product");
        return;
      }
      showToast("success", "Product deleted successfully");
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", "Failed to delete product");
    }
  };

  const handleToggleProduct = async (id: string, field: "active" | "featured", currentVal: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Product ${field} status updated`);
        fetchDashboardData();
      }
    } catch (err) {
      showToast("error", "Update failed");
    }
  };

  // Category CRUD handlers
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      active: formData.get("active") === "on",
    };

    const isEdit = !!editingCategory?._id;
    const url = isEdit ? `/api/admin/categories/${editingCategory._id}` : "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast("error", data.error || "Failed to save category");
        return;
      }

      showToast("success", isEdit ? "Category updated" : "Category created");
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchDashboardData();
    } catch (err: any) {
      showToast("error", "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Category deleted");
        fetchDashboardData();
      } else {
        showToast("error", data.error || "Delete failed");
      }
    } catch (err) {
      showToast("error", "Delete failed");
    }
  };

  // Order status update handler
  const handleUpdateOrderStatus = async (id: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Order status updated");
        if (selectedOrder) setSelectedOrder(data.order);
        fetchDashboardData();
      } else {
        showToast("error", data.error || "Update failed");
      }
    } catch (err) {
      showToast("error", "Update failed");
    }
  };

  // CMS Content save handler
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteContent),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Website content & CMS settings saved successfully!");
      } else {
        showToast("error", data.error || "Failed to save CMS settings");
      }
    } catch (err) {
      showToast("error", "Save failed");
    }
  };

  if (loading && !user) {
    return (
      <main className="admin-page flex items-center justify-center min-h-screen cream">
        <div className="text-center">
          <RefreshCw className="animate-spin text-amber-900 mx-auto mb-3" size={32} />
          <p className="text-stone-600 text-sm font-medium">Loading Aurelia Operations Portal...</p>
        </div>
      </main>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !productSearch ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.SKU?.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat =
      !productCategoryFilter ||
      p.category?._id === productCategoryFilter ||
      p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  const filteredOrders = orders.filter((o) => {
    if (!orderStatusFilter) return true;
    return o.orderStatus === orderStatusFilter;
  });

  // Show loading screen that matches dark admin theme — prevents black flash
  if (loading && !user) {
    return (
      <div style={{
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        gap:'1rem',
        background:'#0b1410',
        color:'#d5ad67'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17.5L5.5 22L8 14.5L2 9.5H9.5L12 2Z" fill="#d5ad67" opacity="0.7"/>
        </svg>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',color:'#c0ad8a',letterSpacing:'.05em'}}>
          Authenticating curator session…
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page admin-page-container" style={{display:'flex',minHeight:'100vh',background:'#070f0a',color:'#e8ede6',fontFamily:"'Inter',sans-serif",position:'relative'}}>

      {/* ── TOAST ─────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position:'fixed',top:'1.25rem',right:'1.25rem',zIndex:100,
          display:'flex',alignItems:'center',gap:'.6rem',
          padding:'.8rem 1.2rem',borderRadius:'10px',
          fontSize:'.82rem',fontWeight:600,letterSpacing:'.02em',
          boxShadow:'0 8px 32px #00000040',
          background: toast.type === 'success' ? '#0e2d1e' : '#2d0e0e',
          border: `1px solid ${toast.type === 'success' ? '#2a6641' : '#662a2a'}`,
          color: toast.type === 'success' ? '#6ee7a0' : '#f4a0a0',
        }}>
          {toast.type === 'success' ? <Check size={16}/> : <AlertTriangle size={16}/>}
          {toast.message}
        </div>
      )}

      {/* ── SIDEBAR ───────────────────────────────────────────── */}
      <aside className="admin-sidebar" style={{
        width:'240px',flexShrink:0,
        background:'linear-gradient(180deg,#0a1a10 0%,#071209 100%)',
        borderRight:'1px solid #1a3323',
        display:'flex',flexDirection:'column',
        padding:'1.25rem 1rem',
        position:'sticky',top:0,height:'100vh',overflow:'hidden',
      }}>
        {/* Brand Header - Fixed at Top */}
        <div className="admin-sidebar-brand" style={{padding:'.25rem .5rem 1rem',borderBottom:'1px solid #1a3323',marginBottom:'1rem',flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:500,letterSpacing:'-.04em',color:'#d5ad67',marginBottom:'.2rem'}}>
              Aurelia
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.35rem',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#7a9e88',background:'#ffffff08',border:'1px solid #1e4030',borderRadius:'999px',padding:'.2rem .6rem',width:'fit-content'}}>
              <ShieldCheck size={10}/> Operations Portal
            </div>
          </div>
          <div className="admin-sidebar-mobile-actions" style={{display:'none',alignItems:'center',gap:'.5rem'}}>
            <Link
              href="/"
              target="_blank"
              style={{display:'flex',alignItems:'center',gap:'.3rem',padding:'.35rem .65rem',borderRadius:'6px',background:'#ffffff08',border:'1px solid #1a3323',fontSize:'.7rem',color:'#7a9e88',textDecoration:'none'}}
            >
              <span>Store</span>
              <ExternalLink size={11}/>
            </Link>
            <button
              onClick={handleLogout}
              style={{display:'flex',alignItems:'center',gap:'.3rem',padding:'.35rem .65rem',borderRadius:'6px',background:'#2d0e0e30',border:'1px solid #4d1a1a50',color:'#e8a0a0',fontSize:'.7rem',cursor:'pointer'}}
            >
              <LogOut size={11}/> Sign Out
            </button>
          </div>
        </div>

        {/* Nav links - Scrollable Middle (Scrollbar hidden) */}
        <nav className="admin-sidebar-nav" style={{display:'flex',flexDirection:'column',gap:'.2rem',flex:1,overflowY:'auto',scrollbarWidth:'none'}}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products',  label: 'Catalogue',         icon: Package },
            { id: 'categories',label: 'Categories',        icon: FolderTree },
            { id: 'orders',    label: 'Orders',            icon: ShoppingBag },
            { id: 'customers', label: 'Customers',         icon: Users },
            { id: 'cms',       label: 'CMS & Content',     icon: FileText },
            { id: 'settings',  label: 'SEO & Settings',    icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={active ? 'active' : ''}
                style={{
                  display:'flex',alignItems:'center',gap:'.7rem',
                  padding:'.65rem .9rem',borderRadius:'8px',
                  border:'none',cursor:'pointer',textAlign:'left',
                  fontSize:'.8rem',fontWeight: active ? 600 : 400,
                  letterSpacing:'.01em',
                  background: active ? 'linear-gradient(90deg,#1a3d28,#122c1c)' : 'transparent',
                  color: active ? '#d5ad67' : '#7a9e88',
                  borderLeft: active ? '2px solid #d5ad67' : '2px solid transparent',
                  transition:'all .15s',
                }}
              >
                <Icon size={15} style={{color: active ? '#d5ad67' : '#4a7a5e', flexShrink:0}}/>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User + Actions Footer - Fixed at Bottom */}
        <div className="admin-sidebar-user" style={{borderTop:'1px solid #1a3323',paddingTop:'1rem',marginTop:'auto',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'1rem',padding:'.6rem .7rem',background:'#ffffff05',borderRadius:'8px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#1a3d28,#2a5c40)',display:'grid',placeItems:'center',flexShrink:0,border:'1px solid #2a5c40'}}>
              <Users size={14} style={{color:'#d5ad67'}}/>
            </div>
            <div style={{minWidth:0}}>
              <p style={{margin:0,fontSize:'.78rem',fontWeight:600,color:'#e8ede6',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.name || 'Curator'}</p>
              <p style={{margin:0,fontSize:'.68rem',color:'#5a7a67',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email}</p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderRadius:'7px',background:'#ffffff06',border:'1px solid #1a3323',fontSize:'.73rem',color:'#7a9e88',textDecoration:'none',marginBottom:'.5rem',transition:'background .15s'}}
          >
            <span>View Storefront</span>
            <ExternalLink size={12}/>
          </Link>
          <button
            onClick={handleLogout}
            style={{display:'flex',alignItems:'center',gap:'.5rem',width:'100%',padding:'.55rem .8rem',borderRadius:'7px',background:'#2d0e0e18',border:'1px solid #4d1a1a30',color:'#e8a0a0',fontSize:'.73rem',cursor:'pointer',transition:'background .15s'}}
          >
            <LogOut size={12}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="admin-main-content" style={{flex:1,overflowY:'auto',background:'#080f0a',padding:'2rem 2.5rem',minHeight:'100vh'}}>

        {/* Top bar */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'2rem'}}>
          <div>
            <p style={{margin:'0 0 .3rem',fontSize:'9px',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'#4a7a5e'}}>
              Aurelia · Operations · {activeTab}
            </p>
            <h1 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:500,letterSpacing:'-.04em',color:'#f0ece2',lineHeight:1}}>
              {activeTab === 'cms' ? 'CMS & Content' : activeTab === 'settings' ? 'SEO & Settings' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <button
              onClick={fetchDashboardData}
              style={{display:'grid',placeItems:'center',width:'36px',height:'36px',background:'#0f1f15',border:'1px solid #1a3323',borderRadius:'8px',color:'#7a9e88',cursor:'pointer'}}
              title="Refresh"
            >
              <RefreshCw size={15} style={loading ? {animation:'spin 1s linear infinite'} : {}}/>
            </button>
            {activeTab === 'products' && (
              <button
                onClick={() => { setEditingProduct(null); setProductFeaturedImg(""); setIsProductModalOpen(true); }}
                style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.6rem 1.1rem',background:'linear-gradient(135deg,#c9a050,#d5ad67)',border:'none',borderRadius:'8px',color:'#0a1208',fontSize:'.78rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px #d5ad6730'}}
              >
                <Plus size={14}/> New Product
              </button>
            )}
            {activeTab === 'categories' && (
              <button
                onClick={() => { setEditingCategory(null); setCategoryImg(""); setIsCategoryModalOpen(true); }}
                style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.6rem 1.1rem',background:'linear-gradient(135deg,#c9a050,#d5ad67)',border:'none',borderRadius:'8px',color:'#0a1208',fontSize:'.78rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px #d5ad6730'}}
              >
                <Plus size={14}/> New Category
              </button>
            )}
          </div>
        </div>

        {/* ── TAB: DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>

            {/* Expanded 6 Stat Cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'1rem'}}>
              {[
                { label:'Total Sales',     value:`₹${stats?.totalRevenue?.toLocaleString() ?? 0}`, sub:'Processed orders', gold:true, icon:ShoppingBag, badge:'+24.8%' },
                { label:'Total Orders',    value: stats?.totalOrders ?? 0,    sub:'Customer purchases', icon:Package, badge:'Live' },
                { label:'Active Products', value: stats?.totalProducts ?? 0,   sub:'In store catalogue', icon:FolderTree, badge:`${stats?.categoriesCount || 0} Cats` },
                { label:'Registered Buyers',value: stats?.totalCustomers ?? 0,  sub:'Patron accounts', icon:Users, badge:'Active' },
                { label:'Avg Order Value', value:`₹${stats?.avgOrderValue?.toLocaleString() ?? 0}`, sub:'AOV per purchase', icon:Sparkles, badge:'AOV' },
                { label:'Fulfillment',     value:`${stats?.totalOrders ? Math.round(((stats.statusMap?.delivered || 0) / stats.totalOrders) * 100) : 100}%`, sub:'Delivered orders', icon:ShieldCheck, badge:'Status' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{background:'linear-gradient(145deg,#0e1f15,#0a1510)',border:'1px solid #1a3323',borderRadius:'12px',padding:'1.25rem 1.1rem',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:'-20px',right:'-20px',width:'80px',height:'80px',borderRadius:'50%',background: s.gold ? '#d5ad6710' : '#1a332310',border:`1px solid ${s.gold ? '#d5ad6720' : '#1a332320'}`}}/>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.65rem'}}>
                      <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'#4a7a5e'}}>{s.label}</span>
                      <span style={{fontSize:'8px',fontWeight:700,padding:'.15rem .45rem',borderRadius:'999px',background: s.gold ? '#d5ad6720' : '#1a332340',color: s.gold ? '#d5ad67' : '#7a9e88',border:`1px solid ${s.gold ? '#d5ad6730' : '#1a3323'}`}}>
                        {s.badge}
                      </span>
                    </div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',fontWeight:500,color: s.gold ? '#d5ad67' : '#c8d8c0',letterSpacing:'-.03em',lineHeight:1.1}}>{s.value}</div>
                    <div style={{fontSize:'.68rem',color:'#3a5a48',marginTop:'.35rem'}}>{s.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* ── ANALYTICS & CHARTS GRID ── */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'1.25rem'}}>

              {/* Chart 1: Revenue & Growth Trajectory (SVG Curve Graph) */}
              <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'14px',padding:'1.4rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e'}}>Sales Analytics</span>
                    <h3 style={{margin:'.2rem 0 0',fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',color:'#c8d8c0',fontWeight:500}}>Revenue & Sales Trend</h3>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'.4rem',fontSize:'.7rem',color:'#d5ad67',background:'#d5ad6710',border:'1px solid #d5ad6725',padding:'.3rem .6rem',borderRadius:'6px',fontWeight:600}}>
                    <Sparkles size={11}/> +24.8% YoY
                  </div>
                </div>

                {/* SVG Trend Line Graph */}
                <div style={{position:'relative',width:'100%',height:'160px',marginTop:'.5rem'}}>
                  <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" style={{overflow:'visible'}}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d5ad67" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#d5ad67" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#1a3323" strokeDasharray="3 3"/>
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#1a3323" strokeDasharray="3 3"/>
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#1a3323" strokeDasharray="3 3"/>

                    {/* Area fill */}
                    <path
                      d="M 0 130 Q 60 110, 100 80 T 200 60 T 300 35 T 400 20 L 400 150 L 0 150 Z"
                      fill="url(#chartGrad)"
                    />

                    {/* Smooth trend curve */}
                    <path
                      d="M 0 130 Q 60 110, 100 80 T 200 60 T 300 35 T 400 20"
                      fill="none"
                      stroke="#d5ad67"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Data nodes */}
                    {[[0,130],[100,80],[200,60],[300,35],[400,20]].map(([cx,cy],idx) => (
                      <g key={idx}>
                        <circle cx={cx} cy={cy} r="5" fill="#070f0a" stroke="#d5ad67" strokeWidth="2.5"/>
                      </g>
                    ))}
                  </svg>
                </div>

                <div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',color:'#4a7a5e',paddingTop:'.4rem',borderTop:'1px solid #1a3323'}}>
                  <span>Q1 Jan-Mar</span>
                  <span>Q2 Apr-Jun</span>
                  <span>Q3 Jul-Sep</span>
                  <span>Q4 Oct-Dec</span>
                </div>
              </div>

              {/* Chart 2: Fulfillment & Order Status Distribution */}
              <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'14px',padding:'1.4rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div>
                  <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e'}}>Order Pipeline</span>
                  <h3 style={{margin:'.2rem 0 0',fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',color:'#c8d8c0',fontWeight:500}}>Fulfillment Status Breakdown</h3>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'.9rem',margin:'.4rem 0'}}>
                  {[
                    { label:'Delivered', count: stats?.statusMap?.delivered || 0, color:'#4ee07a', bg:'#0d3320' },
                    { label:'Processing', count: stats?.statusMap?.processing || 0, color:'#e0c060', bg:'#2d1f08' },
                    { label:'Shipped', count: stats?.statusMap?.shipped || 0, color:'#60a5fa', bg:'#0c2038' },
                    { label:'Cancelled', count: stats?.statusMap?.cancelled || 0, color:'#f4a0a0', bg:'#2d0e0e' },
                  ].map((item) => {
                    const total = stats?.totalOrders || 1;
                    const pct = Math.round((item.count / total) * 100) || 0;
                    return (
                      <div key={item.label} style={{display:'flex',flexDirection:'column',gap:'.35rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'.75rem'}}>
                          <span style={{color:'#c8d8c0',fontWeight:500}}>{item.label}</span>
                          <span style={{color: item.color,fontWeight:600}}>{item.count} orders ({pct}%)</span>
                        </div>
                        <div style={{width:'100%',height:'8px',background:'#070f0a',borderRadius:'999px',overflow:'hidden',border:'1px solid #1a3323'}}>
                          <div style={{width:`${Math.max(pct, item.count ? 8 : 0)}%`,height:'100%',background: item.color,borderRadius:'999px',transition:'width .4s ease'}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{fontSize:'.7rem',color:'#4a7a5e',paddingTop:'.4rem',borderTop:'1px solid #1a3323',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span>Total Managed Purchases: <b>{stats?.totalOrders || 0}</b></span>
                  <button onClick={() => setActiveTab('orders')} style={{border:'none',background:'transparent',color:'#d5ad67',fontSize:'.7rem',fontWeight:600,cursor:'pointer'}}>Inspect Pipeline →</button>
                </div>
              </div>

            </div>

            {/* Quick Actions Shortcuts */}
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'.75rem',background:'linear-gradient(90deg,#0a1a10,#0e1f15)',border:'1px solid #1a3323',borderRadius:'12px',padding:'1rem 1.25rem'}}>
              <span style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#d5ad67',marginRight:'.5rem'}}>Operations Shortcuts:</span>
              <button onClick={() => { setEditingProduct(null); setProductFeaturedImg(""); setIsProductModalOpen(true); }} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.4rem .85rem',borderRadius:'7px',background:'#0a1510',border:'1px solid #1a3323',color:'#c8d8c0',fontSize:'.73rem',fontWeight:600,cursor:'pointer'}}>
                <Plus size={12} style={{color:'#d5ad67'}}/> Add Product
              </button>
              <button onClick={() => { setEditingCategory(null); setCategoryImg(""); setIsCategoryModalOpen(true); }} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.4rem .85rem',borderRadius:'7px',background:'#0a1510',border:'1px solid #1a3323',color:'#c8d8c0',fontSize:'.73rem',fontWeight:600,cursor:'pointer'}}>
                <Plus size={12} style={{color:'#d5ad67'}}/> Add Category
              </button>
              <button onClick={() => setActiveTab('cms')} style={{display:'inline-flex',alignItems:'center',gap:'.4rem',padding:'.4rem .85rem',borderRadius:'7px',background:'#0a1510',border:'1px solid #1a3323',color:'#c8d8c0',fontSize:'.73rem',fontWeight:600,cursor:'pointer'}}>
                <FileText size={12} style={{color:'#7a9e88'}}/> Edit Site CMS
              </button>
              <div style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:'.4rem',fontSize:'.7rem',color:'#4ee07a',fontWeight:600}}>
                <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ee07a',boxShadow:'0 0 6px #4ee07a'}}/> System Online & Synced
              </div>
            </div>

            {/* Low stock Warning */}
            {stats?.lowStockProducts?.length > 0 && (
              <div style={{background:'#1a100030',border:'1px solid #4d3a0040',borderRadius:'12px',padding:'1.2rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.5rem',color:'#e0c060',fontSize:'.8rem',fontWeight:600,marginBottom:'.9rem'}}>
                  <AlertTriangle size={16}/> Low Stock Warning — {stats.lowStockProducts.length} items
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'.75rem'}}>
                  {stats.lowStockProducts.map((p: any) => (
                    <div key={p._id} style={{display:'flex',alignItems:'center',gap:'.75rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'8px',padding:'.7rem'}}>
                      <img src={p.featuredImage} alt={p.name} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'6px',background:'#0a1510',flexShrink:0}}/>
                      <div style={{minWidth:0}}>
                        <p style={{margin:0,fontSize:'.78rem',fontWeight:500,color:'#c8d8c0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                        <p style={{margin:'.15rem 0 0',fontSize:'.7rem',color:'#d4a030'}}>Stock: {p.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders table */}
            <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.1rem 1.4rem',borderBottom:'1px solid #1a3323'}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'#c8d8c0'}}>Recent Customer Purchases</span>
                <button onClick={() => setActiveTab('orders')} style={{border:'none',background:'transparent',color:'#d5ad67',fontSize:'.73rem',fontWeight:600,cursor:'pointer',letterSpacing:'.05em'}}>View all →</button>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem',color:'#a0b8a8'}}>
                  <thead>
                    <tr style={{background:'#0a1510'}}>
                      {['Order ID','Customer','Amount','Payment','Status','Date'].map(h => (
                        <th key={h} style={{padding:'.75rem 1rem',textAlign:'left',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#3a5a48',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.length ? stats.recentOrders.map((o: any) => (
                      <tr key={o._id} style={{borderTop:'1px solid #0f1f14'}}>
                        <td style={{padding:'.75rem 1rem',fontFamily:'monospace',fontSize:'.73rem',color:'#d5ad67'}}>#{o._id.substring(0,8)}</td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <p style={{margin:0,fontWeight:500,color:'#c8d8c0'}}>{o.user?.name || 'Customer'}</p>
                          <p style={{margin:0,fontSize:'.7rem',color:'#3a5a48'}}>{o.user?.email}</p>
                        </td>
                        <td style={{padding:'.75rem 1rem',color:'#d5ad67',fontWeight:600}}>₹{o.total?.toLocaleString()}</td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <span style={{padding:'.25rem .65rem',borderRadius:'999px',fontSize:'.68rem',fontWeight:700,background: o.paymentStatus==='paid' ? '#0d3320' : '#2d1f08',color: o.paymentStatus==='paid' ? '#4ee07a' : '#e0c060'}}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <span style={{padding:'.25rem .65rem',borderRadius:'4px',fontSize:'.68rem',background:'#0f1f14',border:'1px solid #1a3323',color:'#7a9e88',textTransform:'capitalize'}}>{o.orderStatus}</span>
                        </td>
                        <td style={{padding:'.75rem 1rem',fontSize:'.7rem',color:'#3a5a48',whiteSpace:'nowrap'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{padding:'2.5rem',textAlign:'center',color:'#3a5a48'}}>No recent orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PRODUCTS ── */}
        {activeTab === 'products' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',alignItems:'center',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'10px',padding:'1rem'}}>
              <div style={{position:'relative',flex:1,minWidth:'220px'}}>
                <Search size={14} style={{position:'absolute',left:'.75rem',top:'50%',transform:'translateY(-50%)',color:'#3a5a48',pointerEvents:'none'}}/>
                <input
                  type="text"
                  placeholder="Search by name or SKU…"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{width:'100%',padding:'.6rem .75rem .6rem 2.3rem',background:'#0a1510',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.8rem',outline:'none'}}
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                style={{padding:'.6rem .9rem',background:'#0a1510',border:'1px solid #1a3323',borderRadius:'7px',color:'#a0b8a8',fontSize:'.8rem',outline:'none'}}
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem',color:'#a0b8a8'}}>
                  <thead>
                    <tr style={{background:'#0a1510'}}>
                      {['Product','SKU','Category','Price','Stock','Featured','Status',''].map(h => (
                        <th key={h} style={{padding:'.75rem 1rem',textAlign: h==='' ? 'right' : 'left',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#3a5a48',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                      <tr key={p._id} style={{borderTop:'1px solid #0f1f14'}}>
                        <td style={{padding:'.75rem 1rem'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                            <img src={p.featuredImage||p.images?.[0]} alt={p.name} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'6px',background:'#0a1510',flexShrink:0,border:'1px solid #1a3323'}}/>
                            <div>
                              <p style={{margin:0,fontWeight:500,color:'#c8d8c0'}}>{p.name}</p>
                              <p style={{margin:0,fontSize:'.7rem',color:'#3a5a48'}}>{p.material}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:'.75rem 1rem',fontFamily:'monospace',fontSize:'.73rem',color:'#4a7a5e'}}>{p.SKU}</td>
                        <td style={{padding:'.75rem 1rem',fontSize:'.75rem'}}>{p.category?.name||'—'}</td>
                        <td style={{padding:'.75rem 1rem',color:'#d5ad67',fontWeight:600}}>₹{p.price?.toLocaleString()}</td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <span style={{padding:'.2rem .6rem',borderRadius:'4px',fontSize:'.68rem',fontWeight:600,
                            background: p.stock<=3 ? '#2d0e0e' : p.stock<=8 ? '#2d1f08' : '#0d3320',
                            color:       p.stock<=3 ? '#f4a0a0' : p.stock<=8 ? '#e0c060' : '#4ee07a'}}>
                            {p.stock} units
                          </span>
                        </td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <button
                            onClick={() => handleToggleProduct(p._id, 'featured', p.featured)}
                            style={{display:'grid',placeItems:'center',width:'28px',height:'28px',borderRadius:'6px',border:'none',cursor:'pointer',
                              background: p.featured ? '#2a1a08' : '#0a1510',
                              color: p.featured ? '#d5ad67' : '#2a4a38'}}
                          >
                            <Sparkles size={13}/>
                          </button>
                        </td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <button
                            onClick={() => handleToggleProduct(p._id, 'active', p.active)}
                            style={{padding:'.22rem .65rem',borderRadius:'999px',border:'none',cursor:'pointer',fontSize:'.68rem',fontWeight:700,
                              background: p.active ? '#0d3320' : '#1a1a1a',
                              color: p.active ? '#4ee07a' : '#4a5a48'}}
                          >
                            {p.active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td style={{padding:'.75rem 1rem',textAlign:'right'}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'.4rem'}}>
                            <button onClick={() => { setEditingProduct(p); setProductFeaturedImg(p.featuredImage || p.images?.[0] || ""); setIsProductModalOpen(true); }}
                              style={{display:'grid',placeItems:'center',width:'28px',height:'28px',background:'#0f1f14',border:'1px solid #1a3323',borderRadius:'6px',color:'#7a9e88',cursor:'pointer'}}>
                              <Edit2 size={12}/>
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id, p.name)}
                              style={{display:'grid',placeItems:'center',width:'28px',height:'28px',background:'#1a0808',border:'1px solid #3a1010',borderRadius:'6px',color:'#e08080',cursor:'pointer'}}>
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={8} style={{padding:'3rem',textAlign:'center',color:'#3a5a48'}}>No products match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CATEGORIES ── */}
        {activeTab === 'categories' && (
          <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem',color:'#a0b8a8'}}>
                <thead>
                  <tr style={{background:'#0a1510'}}>
                    {['Category','Slug','Description','Status',''].map(h => (
                      <th key={h} style={{padding:'.75rem 1rem',textAlign: h==='' ? 'right' : 'left',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#3a5a48'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id} style={{borderTop:'1px solid #0f1f14'}}>
                      <td style={{padding:'.75rem 1rem'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                          {c.image
                            ? <img src={c.image} alt={c.name} style={{width:'36px',height:'36px',objectFit:'cover',borderRadius:'6px',flexShrink:0}}/>
                            : <div style={{width:'36px',height:'36px',background:'#0a1510',border:'1px solid #1a3323',borderRadius:'6px',display:'grid',placeItems:'center',color:'#d5ad67',fontFamily:"'Playfair Display',serif",flexShrink:0}}>{c.name?.[0]}</div>
                          }
                          <span style={{fontWeight:500,color:'#c8d8c0'}}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{padding:'.75rem 1rem',fontFamily:'monospace',fontSize:'.73rem',color:'#d5ad67'}}>{c.slug}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem',maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.description||'—'}</td>
                      <td style={{padding:'.75rem 1rem'}}>
                        <span style={{padding:'.22rem .65rem',borderRadius:'999px',fontSize:'.68rem',fontWeight:700,
                          background: c.active ? '#0d3320' : '#1a1a1a',
                          color: c.active ? '#4ee07a' : '#4a5a48'}}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{padding:'.75rem 1rem',textAlign:'right'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'.4rem'}}>
                          <button onClick={() => { setEditingCategory(c); setCategoryImg(c.image || ""); setIsCategoryModalOpen(true); }}
                            style={{display:'grid',placeItems:'center',width:'28px',height:'28px',background:'#0f1f14',border:'1px solid #1a3323',borderRadius:'6px',color:'#7a9e88',cursor:'pointer'}}>
                            <Edit2 size={12}/>
                          </button>
                          <button onClick={() => handleDeleteCategory(c._id, c.name)}
                            style={{display:'grid',placeItems:'center',width:'28px',height:'28px',background:'#1a0808',border:'1px solid #3a1010',borderRadius:'6px',color:'#e08080',cursor:'pointer'}}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: ORDERS ── */}
        {activeTab === 'orders' && (
          <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'10px',padding:'.75rem'}}>
              {['','processing','shipped','delivered','cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{padding:'.4rem .9rem',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'.73rem',fontWeight:600,textTransform:'capitalize',transition:'all .15s',
                    background: orderStatusFilter===st ? '#d5ad67' : '#0a1510',
                    color: orderStatusFilter===st ? '#0a1208' : '#5a7a67',
                    boxShadow: orderStatusFilter===st ? '0 2px 8px #d5ad6730' : 'none'}}
                >
                  {st||'All Orders'}
                </button>
              ))}
            </div>

            <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem',color:'#a0b8a8'}}>
                  <thead>
                    <tr style={{background:'#0a1510'}}>
                      {['Order ID','Buyer','Items','Amount','Payment','Status',''].map(h => (
                        <th key={h} style={{padding:'.75rem 1rem',textAlign: h==='' ? 'right' : 'left',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#3a5a48',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                      <tr key={o._id} style={{borderTop:'1px solid #0f1f14'}}>
                        <td style={{padding:'.75rem 1rem',fontFamily:'monospace',fontSize:'.73rem',color:'#d5ad67'}}>#{o._id.substring(0,8)}</td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <p style={{margin:0,fontWeight:500,color:'#c8d8c0'}}>{o.user?.name||'Customer'}</p>
                          <p style={{margin:0,fontSize:'.7rem',color:'#3a5a48'}}>{o.user?.email}</p>
                        </td>
                        <td style={{padding:'.75rem 1rem',fontSize:'.75rem'}}>{o.items?.length||0} items</td>
                        <td style={{padding:'.75rem 1rem',color:'#d5ad67',fontWeight:600}}>₹{o.total?.toLocaleString()}</td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <span style={{padding:'.22rem .6rem',borderRadius:'999px',fontSize:'.68rem',fontWeight:700,
                            background: o.paymentStatus==='paid' ? '#0d3320' : '#2d1f08',
                            color: o.paymentStatus==='paid' ? '#4ee07a' : '#e0c060'}}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td style={{padding:'.75rem 1rem'}}>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            style={{background:'#0a1510',border:'1px solid #1a3323',color:'#a0b8a8',fontSize:'.73rem',padding:'.3rem .5rem',borderRadius:'5px',outline:'none',cursor:'pointer'}}
                          >
                            {['processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{padding:'.75rem 1rem',textAlign:'right'}}>
                          <button onClick={() => setSelectedOrder(o)}
                            style={{display:'flex',alignItems:'center',gap:'.35rem',padding:'.35rem .75rem',background:'#0f1f14',border:'1px solid #1a3323',borderRadius:'6px',color:'#7a9e88',fontSize:'.72rem',cursor:'pointer',marginLeft:'auto'}}>
                            <Eye size={12}/> View
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} style={{padding:'3rem',textAlign:'center',color:'#3a5a48'}}>No orders match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CUSTOMERS ── */}
        {activeTab === 'customers' && (
          <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.8rem',color:'#a0b8a8'}}>
                <thead>
                  <tr style={{background:'#0a1510'}}>
                    {['Name','Email','Phone','Addresses','Orders','Joined'].map(h => (
                      <th key={h} style={{padding:'.75rem 1rem',textAlign:'left',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#3a5a48',whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? customers.map((c) => (
                    <tr key={c.id} style={{borderTop:'1px solid #0f1f14'}}>
                      <td style={{padding:'.75rem 1rem',fontWeight:500,color:'#c8d8c0'}}>{c.name}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem'}}>{c.email}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem'}}>{c.phone||'—'}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem'}}>{c.addressesCount} addr.</td>
                      <td style={{padding:'.75rem 1rem',color:'#d5ad67',fontWeight:600}}>{c.orderCount}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.72rem',color:'#3a5a48',whiteSpace:'nowrap'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{padding:'3rem',textAlign:'center',color:'#3a5a48'}}>No registered buyers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: CMS & SETTINGS ── */}
        {(activeTab === 'cms' || activeTab === 'settings') && siteContent && (
          <form onSubmit={handleSaveCMS} style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
            {/* Sub-nav */}
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'10px',padding:'.75rem'}}>
              {[
                {id:'hero',label:'Hero Banner'},
                {id:'trust',label:'Trust Row'},
                {id:'limited',label:'Limited Edition'},
                {id:'story',label:'Craft Story'},
                {id:'contact',label:'Contact & Atelier'},
                {id:'footer',label:'Footer & Social'},
                {id:'seo',label:'SEO Defaults'},
              ].map((sub) => (
                <button type="button" key={sub.id} onClick={() => setCmsTab(sub.id as any)}
                  style={{padding:'.4rem .9rem',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'.73rem',fontWeight:600,transition:'all .15s',
                    background: cmsTab===sub.id ? '#d5ad67' : '#0a1510',
                    color: cmsTab===sub.id ? '#0a1208' : '#5a7a67'}}>
                  {sub.label}
                </button>
              ))}
            </div>

            <div style={{background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'12px',padding:'1.5rem',maxWidth:'680px',display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* CMS field helper */}
              {(() => {
                const fieldStyle = {width:'100%',padding:'.7rem .9rem',background:'#0a1510',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none'};
                const labelStyle: React.CSSProperties = {display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.35rem'};
                const field = (label: string, el: React.ReactNode) => (
                  <div key={label}><label style={labelStyle}>{label}</label>{el}</div>
                );
                if (cmsTab === 'hero') return <>
                  {field('Tagline', <input style={fieldStyle} value={siteContent.hero?.tagline||''} onChange={(e) => setSiteContent({...siteContent,hero:{...siteContent.hero,tagline:e.target.value}})}/>)}
                  {field('Main Heading', <input style={fieldStyle} value={siteContent.hero?.heading||''} onChange={(e) => setSiteContent({...siteContent,hero:{...siteContent.hero,heading:e.target.value}})}/>)}
                  {field('Subheading', <textarea rows={3} style={{...fieldStyle,resize:'vertical'}} value={siteContent.hero?.subheading||''} onChange={(e) => setSiteContent({...siteContent,hero:{...siteContent.hero,subheading:e.target.value}})}/>)}
                  {field('CTA Button Label', <input style={fieldStyle} value={siteContent.hero?.ctaPrimaryText||''} onChange={(e) => setSiteContent({...siteContent,hero:{...siteContent.hero,ctaPrimaryText:e.target.value}})}/>)}
                  <ImageUploader name="heroImage" value={siteContent.hero?.image||''} onChange={(url) => setSiteContent({...siteContent,hero:{...siteContent.hero,image:url}})} label="Hero Image" />
                </>;
                if (cmsTab === 'contact') return <>
                  {field('Concierge Email', <input style={fieldStyle} type="email" value={siteContent.contact?.email||''} onChange={(e) => setSiteContent({...siteContent,contact:{...siteContent.contact,email:e.target.value}})}/>)}
                  {field('Phone Helpline', <input style={fieldStyle} value={siteContent.contact?.phone||''} onChange={(e) => setSiteContent({...siteContent,contact:{...siteContent.contact,phone:e.target.value}})}/>)}
                  {field('Atelier Address', <input style={fieldStyle} value={siteContent.contact?.address||''} onChange={(e) => setSiteContent({...siteContent,contact:{...siteContent.contact,address:e.target.value}})}/>)}
                </>;
                if (cmsTab === 'seo') return <>
                  {field('Meta Title', <input style={fieldStyle} value={siteContent.seo?.metaTitle||''} onChange={(e) => setSiteContent({...siteContent,seo:{...siteContent.seo,metaTitle:e.target.value}})}/>)}
                  {field('Meta Description', <textarea rows={3} style={{...fieldStyle,resize:'vertical'}} value={siteContent.seo?.metaDescription||''} onChange={(e) => setSiteContent({...siteContent,seo:{...siteContent.seo,metaDescription:e.target.value}})}/>)}
                </>;
                return <p style={{color:'#3a5a48',fontSize:'.82rem'}}>Select a content section above to edit it.</p>;
              })()}

              <button type="submit"
                style={{alignSelf:'flex-start',padding:'.7rem 1.4rem',background:'linear-gradient(135deg,#c9a050,#d5ad67)',border:'none',borderRadius:'8px',color:'#0a1208',fontSize:'.78rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px #d5ad6730',marginTop:'.5rem'}}>
                Save Changes
              </button>
            </div>
          </form>
        )}
      </main>

      {/* ── PRODUCT MODAL ──────────────────────────────────────── */}
      {isProductModalOpen && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'#00000090',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div style={{background:'#0a1510',border:'1px solid #1a3323',borderRadius:'16px',width:'100%',maxWidth:'640px',maxHeight:'90vh',overflowY:'auto',padding:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid #1a3323'}}>
              <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:500,color:'#e8ede6'}}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} style={{background:'none',border:'none',color:'#4a7a5e',cursor:'pointer',padding:'.25rem'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveProduct} style={{display:'flex',flexDirection:'column',gap:'.9rem'}}>
              {(() => {
                const inp = (label: string, name: string, props: any = {}) => (
                  <div key={name}>
                    <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>{label}</label>
                    <input name={name} {...props} style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none'}}/>
                  </div>
                );
                return <>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.9rem'}}>
                    {inp('Product Name *','name',{required:true,defaultValue:editingProduct?.name||'',placeholder:'e.g. Solenne Emerald Ring'})}
                    {inp('SKU *','SKU',{required:true,defaultValue:editingProduct?.SKU||'',placeholder:'AJ-R-001',style:{fontFamily:'monospace'}})}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.9rem'}}>
                    {inp('Price (₹) *','price',{type:'number',required:true,defaultValue:editingProduct?.price||0})}
                    {inp('Compare At (₹)','compareAtPrice',{type:'number',defaultValue:editingProduct?.compareAtPrice||''})}
                    {inp('Stock *','stock',{type:'number',required:true,defaultValue:editingProduct?.stock??10})}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.9rem'}}>
                    <div>
                      <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Category *</label>
                      <select name="category" required defaultValue={editingProduct?.category?._id||editingProduct?.category||categories[0]?._id||''} style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none'}}>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    {inp('Material','material',{defaultValue:editingProduct?.material||'18K Gold'})}
                  </div>
                  <ImageUploader name="featuredImage" value={productFeaturedImg} onChange={setProductFeaturedImg} label="Featured Image" required />
                  <div>
                    <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Gallery Images (1 per line)</label>
                    <textarea name="images" rows={3} defaultValue={editingProduct?.images?.join('\n')||''} style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.75rem',outline:'none',fontFamily:'monospace',resize:'vertical'}}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Full Description *</label>
                    <textarea name="description" required rows={4} defaultValue={editingProduct?.description||''} style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none',resize:'vertical'}}/>
                  </div>
                  <div style={{display:'flex',gap:'1.5rem',paddingTop:'.25rem'}}>
                    {[['featured','Feature on Homepage',editingProduct?.featured],['active','Active in Storefront',editingProduct?.active!==false]].map(([n,l,d]) => (
                      <label key={n as string} style={{display:'flex',alignItems:'center',gap:'.5rem',cursor:'pointer',fontSize:'.78rem',color:'#7a9e88'}}>
                        <input type="checkbox" name={n as string} defaultChecked={d as boolean} style={{accentColor:'#d5ad67'}}/> {l as string}
                      </label>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',paddingTop:'.75rem',borderTop:'1px solid #1a3323'}}>
                    <button type="button" onClick={() => setIsProductModalOpen(false)} style={{padding:'.65rem 1.2rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'7px',color:'#7a9e88',fontSize:'.78rem',cursor:'pointer'}}>Cancel</button>
                    <button type="submit" style={{padding:'.65rem 1.4rem',background:'linear-gradient(135deg,#c9a050,#d5ad67)',border:'none',borderRadius:'7px',color:'#0a1208',fontSize:'.78rem',fontWeight:700,cursor:'pointer',letterSpacing:'.05em'}}>Save Product</button>
                  </div>
                </>;
              })()}
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY MODAL ─────────────────────────────────────── */}
      {isCategoryModalOpen && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'#00000090',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div style={{background:'#0a1510',border:'1px solid #1a3323',borderRadius:'16px',width:'100%',maxWidth:'420px',padding:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid #1a3323'}}>
              <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:500,color:'#e8ede6'}}>{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} style={{background:'none',border:'none',color:'#4a7a5e',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveCategory} style={{display:'flex',flexDirection:'column',gap:'.9rem'}}>
              <div key="name">
                <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Category Name *</label>
                <input name="name" required defaultValue={editingCategory?.name||''} placeholder="e.g. Necklaces" style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none'}}/>
              </div>
              <div key="slug">
                <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Slug (optional)</label>
                <input name="slug" defaultValue={editingCategory?.slug||''} placeholder="necklaces" style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none'}}/>
              </div>
              <ImageUploader name="image" value={categoryImg} onChange={setCategoryImg} label="Category Image" />
              <div>
                <label style={{display:'block',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e',marginBottom:'.3rem'}}>Description</label>
                <textarea name="description" rows={3} defaultValue={editingCategory?.description||''} style={{width:'100%',padding:'.65rem .8rem',background:'#070f0a',border:'1px solid #1a3323',borderRadius:'7px',color:'#c8d8c0',fontSize:'.82rem',outline:'none',resize:'vertical'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'.75rem',paddingTop:'.75rem',borderTop:'1px solid #1a3323'}}>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} style={{padding:'.65rem 1.2rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'7px',color:'#7a9e88',fontSize:'.78rem',cursor:'pointer'}}>Cancel</button>
                <button type="submit" style={{padding:'.65rem 1.4rem',background:'linear-gradient(135deg,#c9a050,#d5ad67)',border:'none',borderRadius:'7px',color:'#0a1208',fontSize:'.78rem',fontWeight:700,cursor:'pointer'}}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ORDER DETAIL MODAL ─────────────────────────────────── */}
      {selectedOrder && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'#00000090',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div style={{background:'#0a1510',border:'1px solid #1a3323',borderRadius:'16px',width:'100%',maxWidth:'600px',maxHeight:'90vh',overflowY:'auto',padding:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid #1a3323'}}>
              <div>
                <h2 style={{margin:'0 0 .3rem',fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:500,color:'#e8ede6'}}>Order #{selectedOrder._id.substring(0,8)}</h2>
                <p style={{margin:0,fontSize:'.72rem',color:'#3a5a48'}}>Placed {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{background:'none',border:'none',color:'#4a7a5e',cursor:'pointer'}}><X size={18}/></button>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem',fontSize:'.82rem',color:'#a0b8a8'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',background:'#0e1f15',border:'1px solid #1a3323',borderRadius:'10px',padding:'1rem'}}>
                <div>
                  <p style={{margin:'0 0 .4rem',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e'}}>Customer</p>
                  <p style={{margin:'0 0 .15rem',fontWeight:600,color:'#e8ede6'}}>{selectedOrder.user?.name||'Guest'}</p>
                  <p style={{margin:0,fontSize:'.72rem',color:'#4a7a5e'}}>{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p style={{margin:'0 0 .4rem',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e'}}>Shipping Address</p>
                  <p style={{margin:'0 0 .1rem'}}>{selectedOrder.shippingAddress?.street}</p>
                  <p style={{margin:'0 0 .1rem'}}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                  <p style={{margin:0,fontSize:'.72rem',color:'#4a7a5e'}}>Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              <div>
                <p style={{margin:'0 0 .6rem',fontSize:'9px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#4a7a5e'}}>Items Purchased</p>
                <div style={{border:'1px solid #1a3323',borderRadius:'8px',overflow:'hidden'}}>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.75rem 1rem',background: idx%2===0 ? '#0e1f15' : 'transparent',borderTop: idx>0 ? '1px solid #0f1f14' : 'none'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                        <img src={item.image} alt={item.name} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'5px',background:'#0a1510',flexShrink:0}}/>
                        <div>
                          <p style={{margin:0,fontWeight:500,color:'#c8d8c0'}}>{item.name}</p>
                          <p style={{margin:0,fontSize:'.7rem',color:'#3a5a48'}}>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span style={{color:'#d5ad67',fontWeight:600}}>₹{(item.price*item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'.75rem',borderTop:'1px solid #1a3323'}}>
                <span style={{fontWeight:600,color:'#c8d8c0'}}>Total Amount</span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'#d5ad67',fontWeight:500}}>₹{selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}