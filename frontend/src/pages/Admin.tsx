// Panel de administración. Solo accesible con rol admin.
// RutaAdmin.tsx se encarga de bloquear el acceso a otros usuarios.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Usuario, Estadisticas } from "../types";
import {
  getEstadisticasApi,
  getUsuariosApi,
  cambiarRolApi,
  toggleActivarApi,
  eliminarUsuarioApi,
  crearAnimeApi,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

type Seccion = "estadisticas" | "usuarios" | "animes";

// ── Formulario vacío por defecto ──────────────────────
const FORM_VACIO = {
  titulo: "",
  sinopsis: "",
  imagen: "",
  youtubeId: "",
  youtubeUrl: "",
  generos: "",        // string separado por comas → array al enviar
  estado: "Finalizado",
  tipo: "TV",
  episodios: "",
  puntuacion: "",
  anyo: "",
  destacado: false,
};

const Admin = () => {
  const { usuario: yo } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState<Seccion>("estadisticas");
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);

  // Estado del formulario de crear anime
  const [form, setForm] = useState(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Cargar estadísticas al montar
  useEffect(() => {
    getEstadisticasApi()
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  // Cargar usuarios al cambiar a esa sección
  useEffect(() => {
    if (seccion !== "usuarios") return;
    setCargando(true);
    getUsuariosApi()
      .then((res) => setUsuarios(res.data.usuarios))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [seccion]);

  const cambiarRol = async (id: string, rolActual: string) => {
    const nuevoRol = rolActual === "admin" ? "usuario" : "admin";
    await cambiarRolApi(id, nuevoRol);
    setUsuarios((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, rol: nuevoRol as "admin" | "usuario" } : u,
      ),
    );
  };

  const toggleActivar = async (id: string) => {
    await toggleActivarApi(id);
    setUsuarios((prev) =>
      prev.map((u) => (u._id === id ? { ...u, activo: !u.activo } : u)),
    );
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    await eliminarUsuarioApi(id);
    setUsuarios((prev) => prev.filter((u) => u._id !== id));
  };

  // ── Enviar formulario de nuevo anime ─────────────────
  const handleCrearAnime = async () => {
    setMensajeOk("");
    setMensajeError("");

    if (!form.titulo.trim() || !form.sinopsis.trim() || !form.imagen.trim()) {
      setMensajeError("Título, sinopsis e imagen son obligatorios.");
      return;
    }

    setEnviando(true);
    try {
      const datos = {
        titulo: form.titulo.trim(),
        sinopsis: form.sinopsis.trim(),
        imagen: form.imagen.trim(),
        trailer: {
          youtubeId: form.youtubeId.trim(),
          url: form.youtubeUrl.trim(),
        },
        // "Acción, Aventura" → ["Acción", "Aventura"]
        generos: form.generos
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0),
        estado: form.estado,
        tipo: form.tipo,
        episodios: form.episodios ? Number(form.episodios) : null,
        puntuacion: form.puntuacion ? Number(form.puntuacion) : null,
        anyo: form.anyo ? Number(form.anyo) : null,
        destacado: form.destacado,
        fuente: "manual",
      };

      await crearAnimeApi(datos);
      setMensajeOk(`✅ "${form.titulo}" añadido correctamente al catálogo.`);
      setForm(FORM_VACIO);

      // Actualizar contador de estadísticas
      if (stats) setStats({ ...stats, totalAnimes: stats.totalAnimes + 1 });

    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { mensaje?: string } } })
        ?.response?.data?.mensaje;
      setMensajeError(msg || "Error al crear el anime. Revisa los datos.");
    } finally {
      setEnviando(false);
    }
  };

  // ── Tarjetas de estadísticas ─────────────────────────
  const tarjetas = stats
    ? [
        { label: "Animes", valor: stats.totalAnimes, icono: "🎌", seccionDestino: "animes" as Seccion, navegarA: null, descripcion: "en el catálogo" },
        { label: "Usuarios", valor: stats.totalUsuarios, icono: "👤", seccionDestino: "usuarios" as Seccion, navegarA: null, descripcion: "registrados" },
        { label: "Reseñas", valor: stats.totalResenas, icono: "✍️", seccionDestino: null, navegarA: null, descripcion: "publicadas" },
        { label: "Favoritos", valor: stats.totalFavoritos, icono: "❤️", seccionDestino: null, navegarA: null, descripcion: "guardados" },
      ]
    : [];

  // ── Estilos reutilizables del formulario ─────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.9rem",
    fontFamily: "'Crimson Pro', serif", fontSize: "1rem",
    color: "var(--text)", background: "white",
    border: "1px solid rgba(143,10,28,0.2)", outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
    letterSpacing: "0.15em", textTransform: "uppercase",
    color: "var(--text)", opacity: 0.6,
    marginBottom: "0.3rem", display: "block",
  };
  const campoStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: "0.2rem",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh", paddingTop: "64px" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ background: "#0a0002", padding: "2rem 0", borderRight: "1px solid rgba(143,10,28,0.2)" }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary)", padding: "0 1.5rem", marginBottom: "2rem" }}>
          Panel Admin
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {([ ["estadisticas", "⊞", "Estadísticas"], ["animes", "🎌", "Añadir Anime"], ["usuarios", "◉", "Usuarios"] ] as [Seccion, string, string][]).map(([key, icono, label]) => (
            <li key={key}>
              <button
                onClick={() => setSeccion(key)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.9rem 1.5rem", fontFamily: "'Cinzel', serif", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: seccion === key ? "white" : "rgba(255,255,255,0.65)", background: seccion === key ? "rgba(143,10,28,0.25)" : "transparent", border: "none", borderLeft: `2px solid ${seccion === key ? "var(--primary)" : "transparent"}`, textAlign: "left", transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => { if (seccion !== key) { (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; } }}
                onMouseLeave={(e) => { if (seccion !== key) { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
              >
                <span style={{ fontSize: "0.9rem" }}>{icono}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main style={{ padding: "2.5rem" }}>

        {/* ── ESTADÍSTICAS ── */}
        {seccion === "estadisticas" && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>Estadísticas</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(143,10,28,0.3), transparent)" }} />
            </div>
            {stats && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1rem" }}>
                  {tarjetas.map(({ label, valor, icono, seccionDestino, navegarA, descripcion }) => (
                    <div key={label}
                      onClick={() => { if (navegarA) navigate(navegarA); else if (seccionDestino) setSeccion(seccionDestino); }}
                      style={{ padding: "1.8rem 1.5rem", background: "white", border: "1px solid rgba(143,10,28,0.07)", borderTop: "3px solid var(--primary)", cursor: (navegarA || seccionDestino) ? "pointer" : "default", transition: "transform 0.15s, box-shadow 0.15s", position: "relative" }}
                      onMouseEnter={(e) => { if (navegarA || seccionDestino) { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(143,10,28,0.12)"; } }}
                      onMouseLeave={(e) => { if (navegarA || seccionDestino) { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; } }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icono}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "2.4rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1, marginBottom: "0.3rem" }}>{valor}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text)", opacity: 0.42, marginBottom: "0.2rem" }}>{label}</div>
                      <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: "0.8rem", color: "var(--text)", opacity: 0.35, fontStyle: "italic" }}>{descripcion}</div>
                      {(seccionDestino || navegarA) && (
                        <div style={{ position: "absolute", bottom: "1rem", right: "1rem", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "var(--primary)", opacity: 0.5 }}>Ver →</div>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", color: "var(--text)", opacity: 0.4, fontStyle: "italic" }}>
                  * Las tarjetas con "Ver →" son clicables y te llevan a esa sección.
                </p>
              </>
            )}
          </>
        )}

        {/* ── AÑADIR ANIME ── */}
        {seccion === "animes" && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>Añadir Anime</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(143,10,28,0.3), transparent)" }} />
              <button onClick={() => navigate("/catalogo")} style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.4rem 1rem", background: "transparent", border: "1px solid rgba(143,10,28,0.3)", color: "var(--primary)", cursor: "pointer" }}>
                Ver catálogo →
              </button>
            </div>

            {/* Mensajes */}
            {mensajeOk && (
              <div style={{ padding: "0.9rem 1.2rem", background: "rgba(0,120,0,0.08)", border: "1px solid rgba(0,120,0,0.2)", color: "#1a5e2a", fontFamily: "'Crimson Pro', serif", fontSize: "1rem", marginBottom: "1.5rem" }}>
                {mensajeOk}
              </div>
            )}
            {mensajeError && (
              <div style={{ padding: "0.9rem 1.2rem", background: "rgba(200,0,0,0.07)", border: "1px solid rgba(200,0,0,0.2)", color: "#8f0a1c", fontFamily: "'Crimson Pro', serif", fontSize: "1rem", marginBottom: "1.5rem" }}>
                {mensajeError}
              </div>
            )}

            {/* Grid del formulario */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", maxWidth: "860px" }}>

              <div style={{ ...campoStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Título *</label>
                <input style={inputStyle} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Fullmetal Alchemist: Brotherhood" />
              </div>

              <div style={{ ...campoStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Sinopsis *</label>
                <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={form.sinopsis} onChange={(e) => setForm({ ...form, sinopsis: e.target.value })} placeholder="Descripción del anime..." />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>URL Imagen *</label>
                <input style={inputStyle} value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="https://..." />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Géneros (separados por coma)</label>
                <input style={inputStyle} value={form.generos} onChange={(e) => setForm({ ...form, generos: e.target.value })} placeholder="Ej: Acción, Aventura, Fantasía" />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Tipo</label>
                <select style={inputStyle} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  {["TV", "Película", "OVA", "ONA", "Especial", "Desconocido"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  {["En emisión", "Finalizado", "Próximamente", "Desconocido"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Episodios</label>
                <input style={inputStyle} type="number" min="1" value={form.episodios} onChange={(e) => setForm({ ...form, episodios: e.target.value })} placeholder="Ej: 64" />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Puntuación (1-10)</label>
                <input style={inputStyle} type="number" min="1" max="10" step="0.1" value={form.puntuacion} onChange={(e) => setForm({ ...form, puntuacion: e.target.value })} placeholder="Ej: 9.1" />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>Año</label>
                <input style={inputStyle} type="number" min="1950" max="2030" value={form.anyo} onChange={(e) => setForm({ ...form, anyo: e.target.value })} placeholder="Ej: 2009" />
              </div>

              <div style={campoStyle}>
                <label style={labelStyle}>YouTube ID del trailer</label>
                <input style={inputStyle} value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} placeholder="Ej: qj8yHa4Spqk" />
              </div>

              <div style={{ ...campoStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>YouTube URL del trailer</label>
                <input style={inputStyle} value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div style={{ ...campoStyle, gridColumn: "1 / -1", flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
                <input type="checkbox" id="destacado" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }} />
                <label htmlFor="destacado" style={{ ...labelStyle, margin: 0, opacity: 1, cursor: "pointer" }}>
                  Destacado (aparece en el carrusel de inicio)
                </label>
              </div>

              {form.imagen && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Preview imagen</label>
                  <img src={form.imagen} alt="preview" style={{ width: "120px", height: "170px", objectFit: "cover", border: "1px solid rgba(143,10,28,0.2)" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                </div>
              )}

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button onClick={handleCrearAnime} disabled={enviando}
                  style={{ fontFamily: "'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2.5rem", background: enviando ? "rgba(143,10,28,0.4)" : "var(--primary)", color: "white", border: "none", cursor: enviando ? "not-allowed" : "pointer" }}>
                  {enviando ? "Guardando..." : "Añadir al catálogo"}
                </button>
                <button onClick={() => { setForm(FORM_VACIO); setMensajeOk(""); setMensajeError(""); }}
                  style={{ fontFamily: "'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.85rem 2rem", background: "transparent", color: "var(--text)", border: "1px solid rgba(143,10,28,0.2)", cursor: "pointer" }}>
                  Limpiar
                </button>
              </div>

            </div>
          </>
        )}

        {/* ── USUARIOS ── */}
        {seccion === "usuarios" && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>Usuarios</h2>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(143,10,28,0.3), transparent)" }} />
              <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: "0.9rem", color: "var(--text)", opacity: 0.5, fontStyle: "italic" }}>{usuarios.length} usuarios</span>
            </div>
            {cargando ? (
              <div style={{ padding: "3rem", textAlign: "center", fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--text)", opacity: 0.4, textTransform: "uppercase" }}>Cargando...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Nombre", "Email", "Rol", "Estado", "Registrado", "Acciones"].map((h) => (
                      <th key={h} style={{ fontFamily: "'Cinzel', serif", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text)", opacity: 0.42, textAlign: "left", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(143,10,28,0.12)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u._id} style={{ opacity: u.activo ? 1 : 0.5 }}>
                      <td style={{ padding: "0.85rem 1rem", fontFamily: "'Crimson Pro', serif", fontSize: "1rem", color: "var(--text)", fontWeight: 600, borderBottom: "1px solid rgba(143,10,28,0.06)" }}>{u.nombre}</td>
                      <td style={{ padding: "0.85rem 1rem", fontFamily: "'Crimson Pro', serif", fontSize: "0.9rem", color: "var(--text)", opacity: 0.55, fontStyle: "italic", borderBottom: "1px solid rgba(143,10,28,0.06)" }}>{u.email}</td>
                      <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(143,10,28,0.06)" }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.6rem", background: u.rol === "admin" ? "var(--primary)" : "rgba(143,10,28,0.08)", color: u.rol === "admin" ? "white" : "var(--primary)" }}>{u.rol}</span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(143,10,28,0.06)" }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.6rem", background: u.activo ? "rgba(0,120,0,0.1)" : "rgba(200,0,0,0.1)", color: u.activo ? "#2a7a2a" : "#c00" }}>{u.activo ? "Activo" : "Inactivo"}</span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", fontFamily: "'Crimson Pro', serif", fontSize: "0.85rem", color: "var(--text)", opacity: 0.45, borderBottom: "1px solid rgba(143,10,28,0.06)" }}>{new Date(u.createdAt).toLocaleDateString("es-ES")}</td>
                      <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(143,10,28,0.06)" }}>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {u._id !== yo?._id && (
                            <>
                              <Accion onClick={() => cambiarRol(u._id, u.rol)}>{u.rol === "admin" ? "→ Usuario" : "→ Admin"}</Accion>
                              <Accion onClick={() => toggleActivar(u._id)}>{u.activo ? "Desactivar" : "Activar"}</Accion>
                              <Accion onClick={() => eliminar(u._id)} danger>Eliminar</Accion>
                            </>
                          )}
                          {u._id === yo?._id && (
                            <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: "0.8rem", color: "var(--text)", opacity: 0.35, fontStyle: "italic" }}>Eres tú</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 220px 1fr"] { grid-template-columns: 1fr; }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
};

const Accion = ({ children, onClick, danger }: { children: string; onClick: () => void; danger?: boolean }) => (
  <button onClick={onClick} style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 0.7rem", background: "transparent", border: `1px solid ${danger ? "rgba(180,0,0,0.3)" : "rgba(143,10,28,0.22)"}`, color: danger ? "#c00" : "var(--primary)", transition: "all 0.2s", cursor: "pointer" }}>
    {children}
  </button>
);

export default Admin;