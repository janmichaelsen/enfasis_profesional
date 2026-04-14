"use client";

import { useState } from "react";
import { createPackage, deliverPackage } from "@/app/lib/actions";
import { signOut } from "next-auth/react";
import es from "../../../locales/es.json";
import en from "../../../locales/en.json";

interface PackageItem {
  id: string;
  trackingId: string;
  description: string | null;
  department: string;
  type: string;
  status: string;
  createdAt: string;
  deliveredAt: string | null;
  weight: number | null;
}

interface DashboardClientProps {
  userName: string;
  userRole: string;
  userId: string;
  initialPackages: PackageItem[];
}

export default function DashboardClient({ userName, userRole, userId, initialPackages }: DashboardClientProps) {
  const [lang, setLang] = useState("es");
  const [activeTab, setActiveTab] = useState("ingresar");
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [residents, setResidents] = useState<any[]>([]);

  const t: any = lang === "es" ? es : en;
  const isConcierge = userRole === "CONCIERGE" || userRole === "ADMIN";

  async function fetchPackages() {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch {
      console.log("No se pudieron recargar los paquetes");
    }
  }

  async function fetchResidents() {
    try {
      const res = await fetch("/api/residents");
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
      }
    } catch {
      console.log("No se pudieron cargar los residentes");
    }
  }

  async function saveDepartment(residentId: string, department: string) {
    try {
      const res = await fetch("/api/residents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: residentId, department }),
      });
      if (res.ok) {
        setSuccessMsg(t.dash_residents_saved);
        await fetchResidents();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      setErrorMsg(lang === "es" ? "❌ Error al guardar" : "❌ Error saving");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createPackage(formData);
      setSuccessMsg(lang === "es" ? "✅ Paquete registrado correctamente" : "✅ Package registered successfully");
      form.reset();
      await fetchPackages();
    } catch {
      setErrorMsg(lang === "es" ? "❌ Error al registrar el paquete" : "❌ Error registering package");
    } finally {
      setLoading(false);
      setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
    }
  }

  async function handleDeliver(packageId: string) {
    try {
      await deliverPackage(packageId);
      await fetchPackages();
    } catch {
      setErrorMsg(lang === "es" ? "❌ Error al entregar" : "❌ Error delivering");
    }
  }

  const pendingPackages = packages.filter((p) => p.status === "RECEIVED");
  const perishableOrUrgent = pendingPackages.filter(
    (p) => p.type === "PERISHABLE" || p.type === "URGENT"
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0d1117",
      color: "#f0f6fc",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ========== HEADER ========== */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #21262d",
        }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#58a6ff", margin: 0 }}>
              Adquete
            </h1>
            <p style={{
              fontSize: "10px",
              color: "#484f58",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginTop: "4px",
            }}>
              {t.dash_system_title}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Selector de idioma */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: "#161b22",
                color: "#8b949e",
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "12px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
            </select>

            {/* Info del usuario logueado */}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>{userName}</p>
              <p style={{ fontSize: "10px", color: "#3fb950", fontFamily: "monospace", margin: 0 }}>
                {userRole === "CONCIERGE" ? t.role_concierge : userRole === "RESIDENT" ? t.role_resident : t.role_admin}
              </p>
            </div>

            {/* Botón cerrar sesión */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                fontSize: "11px",
                background: "rgba(248, 81, 73, 0.06)",
                color: "#f85149",
                border: "1px solid rgba(248, 81, 73, 0.2)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.dash_close_session}
            </button>
          </div>
        </header>

        {/* ========== CONTENIDO SEGÚN ROL ========== */}
        {isConcierge ? (
          <>
            {/* ALERTA DE NOTIFICACIONES */}
            {perishableOrUrgent.length > 0 && (
              <div style={{
                background: "rgba(248, 81, 73, 0.08)",
                border: "1px solid rgba(248, 81, 73, 0.3)",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                animation: "pulse 2s infinite",
              }}>
                <span style={{ fontSize: "1.5rem" }}>🔔</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "13px", color: "#f85149", margin: 0 }}>
                    {perishableOrUrgent.length} {lang === "es" ? "paquete(s) requiere(n) atención urgente" : "package(s) require urgent attention"}
                  </p>
                  <p style={{ fontSize: "11px", color: "#8b949e", margin: "2px 0 0" }}>
                    {lang === "es" ? "Revisa la pestaña de Notificaciones" : "Check the Notifications tab"}
                  </p>
                </div>
              </div>
            )}

            {/* NAVEGACIÓN */}
            <nav style={{
              display: "flex",
              gap: "4px",
              padding: "4px",
              background: "#161b22",
              borderRadius: "14px",
              border: "1px solid #21262d",
              width: "fit-content",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}>
              {[
                { key: "ingresar", label: t.dash_tab_register },
                { key: "ver", label: t.dash_tab_inventory },
                { key: "notificaciones", label: `${t.dash_tab_notifications}${pendingPackages.length > 0 ? ` (${pendingPackages.length})` : ""}` },
                { key: "residentes", label: t.dash_tab_residents },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.key === "residentes") fetchResidents();
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: activeTab === tab.key ? "#1f6feb" : "transparent",
                    color: activeTab === tab.key ? "#fff" : "#484f58",
                    boxShadow: activeTab === tab.key ? "0 4px 12px rgba(31,111,235,0.3)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* MENSAJES */}
            {successMsg && (
              <div style={{
                background: "rgba(63, 185, 80, 0.1)",
                border: "1px solid rgba(63, 185, 80, 0.3)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontSize: "13px",
                color: "#3fb950",
              }}>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{
                background: "rgba(248, 81, 73, 0.1)",
                border: "1px solid rgba(248, 81, 73, 0.3)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                fontSize: "13px",
                color: "#f85149",
              }}>
                {errorMsg}
              </div>
            )}

            {/* TAB: REGISTRO */}
            {activeTab === "ingresar" && (
              <section style={{
                background: "rgba(31, 111, 235, 0.04)",
                border: "1px solid rgba(31, 111, 235, 0.15)",
                borderRadius: "16px",
                padding: "2rem",
              }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#58a6ff", marginBottom: "4px" }}>
                  {t.dash_register_title}
                </h2>
                <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "2rem" }}>
                  {t.dash_register_subtitle}
                </p>

                <form onSubmit={handleSubmit} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>{t.dash_field_tracking}</label>
                    <input name="trackingId" placeholder={t.dash_field_tracking_placeholder} required style={inputStyle} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>{t.dash_field_department}</label>
                    <input name="department" placeholder={t.dash_field_department_placeholder} required style={inputStyle} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>{t.dash_field_weight}</label>
                    <input name="weight" type="number" step="0.1" placeholder={t.dash_field_weight_placeholder} style={inputStyle} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>{t.dash_field_type}</label>
                    <select name="type" style={inputStyle}>
                      <option value="REGULAR">{t.dash_type_regular}</option>
                      <option value="PERISHABLE">{t.dash_type_perishable}</option>
                      <option value="URGENT">{t.dash_type_urgent}</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>{t.dash_field_description}</label>
                    <input name="description" placeholder={t.dash_field_description_placeholder} style={inputStyle} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      gridColumn: "1 / -1",
                      background: loading ? "#21262d" : "#1f6feb",
                      color: "#fff",
                      fontWeight: 700,
                      padding: "1rem",
                      borderRadius: "12px",
                      border: "none",
                      cursor: loading ? "wait" : "pointer",
                      fontSize: "14px",
                      marginTop: "0.5rem",
                      transition: "all 0.2s",
                      boxShadow: loading ? "none" : "0 4px 16px rgba(31,111,235,0.2)",
                    }}
                  >
                    {loading ? "..." : t.dash_btn_confirm}
                  </button>
                </form>
              </section>
            )}

            {/* TAB: INVENTARIO */}
            {activeTab === "ver" && (
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#e6edf3", margin: 0 }}>{t.dash_inventory_title}</h2>
                  <p style={{ fontSize: "12px", color: "#484f58", margin: 0 }}>{packages.length} {t.dash_inventory_total}</p>
                </div>

                {packages.length === 0 ? (
                  <div style={{
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: "16px",
                    padding: "4rem 2rem",
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</p>
                    <p style={{ color: "#484f58", fontSize: "14px" }}>{t.dash_inventory_empty}</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {packages.map((pkg) => (
                      <div key={pkg.id} style={{
                        background: "#161b22",
                        border: `1px solid ${pkg.type === "PERISHABLE" ? "rgba(210, 153, 34, 0.3)" : pkg.type === "URGENT" ? "rgba(248, 81, 73, 0.3)" : "#21262d"}`,
                        borderRadius: "12px",
                        padding: "1.25rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#58a6ff", textTransform: "uppercase" }}>
                              {pkg.trackingId}
                            </span>
                            {pkg.type === "PERISHABLE" && (
                              <span style={{ fontSize: "9px", background: "rgba(210,153,34,0.15)", color: "#d29922", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                                🍎 {t.dash_type_perishable}
                              </span>
                            )}
                            {pkg.type === "URGENT" && (
                              <span style={{ fontSize: "9px", background: "rgba(248,81,73,0.15)", color: "#f85149", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                                🔴 {t.dash_type_urgent}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6edf3", margin: 0 }}>{pkg.description || "-"}</p>
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "11px", color: "#8b949e" }}>{t.dash_inventory_dept} {pkg.department}</span>
                            <span style={{ fontSize: "11px", color: "#484f58", fontStyle: "italic" }}>
                              {t.dash_inventory_received}: {new Date(pkg.createdAt).toLocaleDateString()}
                            </span>
                            {pkg.deliveredAt && (
                              <span style={{ fontSize: "11px", color: "#3fb950", fontStyle: "italic" }}>
                                {t.dash_inventory_delivered}: {new Date(pkg.deliveredAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          {pkg.status === "RECEIVED" ? (
                            <button onClick={() => handleDeliver(pkg.id)} style={deliverBtnStyle}>
                              {t.dash_inventory_deliver}
                            </button>
                          ) : (
                            <span style={deliveredBadgeStyle}>{t.dash_inventory_delivered} ✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB: NOTIFICACIONES */}
            {activeTab === "notificaciones" && (
              <section>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#e6edf3", marginBottom: "4px" }}>{t.dash_notif_title}</h2>
                <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "1.5rem" }}>{t.dash_notif_subtitle}</p>

                {pendingPackages.length === 0 ? (
                  <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "16px", padding: "4rem 2rem", textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</p>
                    <p style={{ color: "#3fb950", fontSize: "14px" }}>{t.dash_notif_no_pending}</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {pendingPackages.map((pkg) => {
                      const hoursAgo = Math.floor((Date.now() - new Date(pkg.createdAt).getTime()) / (1000 * 60 * 60));
                      const isUrgentType = pkg.type === "PERISHABLE" || pkg.type === "URGENT";
                      return (
                        <div key={pkg.id} style={{
                          background: isUrgentType ? "rgba(248, 81, 73, 0.05)" : "#161b22",
                          border: `1px solid ${isUrgentType ? "rgba(248, 81, 73, 0.25)" : "#21262d"}`,
                          borderRadius: "12px",
                          padding: "1.25rem",
                          borderLeft: `4px solid ${pkg.type === "PERISHABLE" ? "#d29922" : pkg.type === "URGENT" ? "#f85149" : "#1f6feb"}`,
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              {pkg.type === "PERISHABLE" && (
                                <p style={{ fontSize: "12px", color: "#d29922", fontWeight: 700, margin: "0 0 6px" }}>{t.dash_notif_perishable_warn}</p>
                              )}
                              {pkg.type === "URGENT" && (
                                <p style={{ fontSize: "12px", color: "#f85149", fontWeight: 700, margin: "0 0 6px" }}>{t.dash_notif_urgent_warn}</p>
                              )}
                              <p style={{ fontWeight: 600, fontSize: "14px", color: "#e6edf3", margin: "0 0 4px" }}>
                                {t.dash_inventory_dept} {pkg.department} — {pkg.description || pkg.trackingId}
                              </p>
                              <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>
                                {t.dash_notif_pending_since} {new Date(pkg.createdAt).toLocaleString()} ({hoursAgo}h)
                              </p>
                            </div>
                            <button onClick={() => handleDeliver(pkg.id)} style={deliverBtnStyle}>
                              {t.dash_inventory_deliver}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* TAB: RESIDENTES */}
            {activeTab === "residentes" && (
              <section>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#e6edf3", marginBottom: "4px" }}>{t.dash_residents_title}</h2>
                <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "1.5rem" }}>{t.dash_residents_subtitle}</p>

                {residents.length === 0 ? (
                  <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: "16px", padding: "4rem 2rem", textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</p>
                    <p style={{ color: "#484f58", fontSize: "14px" }}>{t.dash_residents_empty}</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {residents.map((res: any) => (
                      <div key={res.id} style={{
                        background: "#161b22",
                        border: "1px solid #21262d",
                        borderRadius: "12px",
                        padding: "1.25rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6edf3", margin: 0 }}>{res.name || "Sin nombre"}</p>
                          <p style={{ fontSize: "11px", color: "#8b949e", margin: 0 }}>{res.email}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            id={`dept-${res.id}`}
                            defaultValue={res.department || ""}
                            placeholder={t.dash_residents_no_dept}
                            style={{
                              ...inputStyle,
                              width: "100px",
                              textAlign: "center",
                              fontSize: "12px",
                              padding: "8px 10px",
                            }}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`dept-${res.id}`) as HTMLInputElement;
                              if (input?.value) saveDepartment(res.id, input.value);
                            }}
                            style={{
                              fontSize: "10px",
                              background: "rgba(31, 111, 235, 0.1)",
                              color: "#58a6ff",
                              border: "1px solid rgba(31, 111, 235, 0.2)",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              fontWeight: 700,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.dash_residents_btn_save}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          /* ========== VISTA RESIDENTE ========== */
          <section>
            <div style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: "20px",
              padding: "2.5rem",
              marginBottom: "1.5rem",
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                {t.dash_resident_welcome}, {userName}! 👋
              </h2>
              <p style={{ color: "#8b949e", fontSize: "14px", margin: 0 }}>
                {t.dash_resident_your_packages}
              </p>
            </div>

            {/* ALERTAS AUTOMÁTICAS E INSISTENTES PARA EL RESIDENTE */}
            {pendingPackages.length > 0 && (
              <div style={{ display: "grid", gap: "10px", marginBottom: "2rem" }}>
                {/* Alerta general */}
                <div style={residentAlertStyle("rgba(31, 111, 235, 0.1)", "#58a6ff")}>
                  {t.dash_resident_alert_new.replace("{count}", pendingPackages.length.toString())}
                </div>

                {/* Alerta de comida (Insistente) */}
                {pendingPackages.some(p => p.type === "PERISHABLE") && (
                  <div style={{
                    ...residentAlertStyle("rgba(210, 153, 34, 0.1)", "#d29922"),
                    animation: "pulse 1.5s infinite"
                  }}>
                    {t.dash_resident_alert_perishable}
                  </div>
                )}

                {/* Alerta de urgente */}
                {pendingPackages.some(p => p.type === "URGENT") && (
                  <div style={residentAlertStyle("rgba(248, 81, 73, 0.1)", "#f85149")}>
                    {t.dash_resident_alert_urgent}
                  </div>
                )}
              </div>
            )}

            {packages.length === 0 ? (
              <div style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: "16px",
                padding: "4rem 2rem",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📭</p>
                <p style={{ color: "#484f58", fontSize: "14px" }}>{t.dash_resident_no_packages}</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {packages.map((pkg) => (
                  <div key={pkg.id} style={{
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#58a6ff" }}>{pkg.trackingId}</span>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6edf3", margin: 0 }}>{pkg.description || "-"}</p>
                      <span style={{ fontSize: "11px", color: "#484f58" }}>
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span style={{
                      fontSize: "10px",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      background: pkg.status === "RECEIVED" ? "rgba(31,111,235,0.1)" : "rgba(63,185,80,0.1)",
                      color: pkg.status === "RECEIVED" ? "#58a6ff" : "#3fb950",
                      border: `1px solid ${pkg.status === "RECEIVED" ? "rgba(31,111,235,0.2)" : "rgba(63,185,80,0.2)"}`,
                    }}>
                      {pkg.status === "RECEIVED" ? t.dash_resident_status_pending : t.dash_resident_status_delivered}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </main>
  );
}

// Estilos reutilizables
const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase",
  color: "#484f58",
  marginLeft: "2px",
};

const inputStyle: React.CSSProperties = {
  background: "#0d1117",
  border: "1px solid #30363d",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#e6edf3",
  fontSize: "13px",
  outline: "none",
  transition: "border-color 0.2s",
};

const residentAlertStyle = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  color: color,
  padding: "1rem",
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: 600,
  border: `1px solid ${color}33`,
});

const deliverBtnStyle: React.CSSProperties = {
  fontSize: "10px",
  background: "rgba(63, 185, 80, 0.08)",
  color: "#3fb950",
  border: "1px solid rgba(63, 185, 80, 0.2)",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "uppercase",
  fontWeight: 800,
  cursor: "pointer",
  flexShrink: 0,
};

const deliveredBadgeStyle: React.CSSProperties = {
  fontSize: "10px",
  background: "#21262d",
  color: "#484f58",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "uppercase",
  fontWeight: 700,
  border: "1px solid #30363d",
};
