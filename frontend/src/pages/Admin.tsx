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
} from "../services/api";
import { useAuth } from "../context/AuthContext";

type Seccion = "estadisticas" | "usuarios";

const Admin = () => {
  const { usuario: yo } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState<Seccion>("estadisticas");
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);

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

  // Configuración de cada tarjeta de estadísticas
  // Al hacer clic navega a la sección correspondiente (o muestra un aviso)
  const tarjetas = stats
    ? [
        {
          label: "Animes",
          valor: stats.totalAnimes,
          icono: "🎌",
          seccionDestino: null,
          navegarA: "/catalogo",
          descripcion: "en el catálogo",
        },
        {
          label: "Usuarios",
          valor: stats.totalUsuarios,
          icono: "👤",
          seccionDestino: "usuarios" as Seccion,
          navegarA: null,
          descripcion: "registrados",
        },
        {
          label: "Reseñas",
          valor: stats.totalResenas,
          icono: "✍️",
          seccionDestino: null,
          navegarA: null,
          descripcion: "publicadas",
        },
        {
          label: "Favoritos",
          valor: stats.totalFavoritos,
          icono: "❤️",
          seccionDestino: null,
          navegarA: null,
          descripcion: "guardados",
        },
      ]
    : [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        paddingTop: "64px",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          background: "#0a0002",
          padding: "2rem 0",
          borderRight: "1px solid rgba(143,10,28,0.2)",
        }}
      >
        {/* Título del panel */}
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.65rem",        // más grande que antes
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--primary)",    // rojo, no gris
            padding: "0 1.5rem",
            marginBottom: "2rem",
            opacity: 1,                 // sin opacidad reducida
          }}
        >
          Panel Admin
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {(
            [
              ["estadisticas", "⊞", "Estadísticas"],
              ["usuarios", "◉", "Usuarios"],
            ] as [Seccion, string, string][]
          ).map(([key, icono, label]) => (
            <li key={key}>
              <button
                onClick={() => setSeccion(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.9rem 1.5rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",      // más grande → más legible
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  // Activo → blanco brillante / Inactivo → gris claro visible
                  color: seccion === key ? "white" : "rgba(255,255,255,0.65)",
                  background:
                    seccion === key
                      ? "rgba(143,10,28,0.25)"
                      : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${
                    seccion === key ? "var(--primary)" : "transparent"
                  }`,
                  textAlign: "left",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                // Hover — cambia color al pasar el ratón
                onMouseEnter={(e) => {
                  if (seccion !== key) {
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (seccion !== key) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.65)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
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
            {/* Cabecera */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                }}
              >
                Estadísticas
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(143,10,28,0.3), transparent)",
                }}
              />
            </div>

            {/* Tarjetas — clicables si tienen seccionDestino */}
            {stats && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {tarjetas.map(({ label, valor, icono, seccionDestino, navegarA, descripcion }) => (
                    <div
                      key={label}
                      onClick={() => {
                        if (navegarA) navigate(navegarA);
                        else if (seccionDestino) setSeccion(seccionDestino);
                      }}
                      style={{
                        padding: "1.8rem 1.5rem",
                        background: "white",
                        border: "1px solid rgba(143,10,28,0.07)",
                        borderTop: "3px solid var(--primary)",
                        cursor: (navegarA || seccionDestino) ? "pointer" : "default",
                        transition: "transform 0.15s, box-shadow 0.15s",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (navegarA || seccionDestino) {
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(143,10,28,0.12)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (navegarA || seccionDestino) {
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                        }
                      }}
                    >
                      {/* Icono */}
                      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                        {icono}
                      </div>

                      {/* Número */}
                      <div
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "2.4rem",
                          fontWeight: 900,
                          color: "var(--primary)",
                          lineHeight: 1,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {valor}
                      </div>

                      {/* Etiqueta */}
                      <div
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.56rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "var(--text)",
                          opacity: 0.42,
                          marginBottom: "0.2rem",
                        }}
                      >
                        {label}
                      </div>

                      {/* Descripción pequeña */}
                      <div
                        style={{
                          fontFamily: "'Crimson Pro', serif",
                          fontSize: "0.8rem",
                          color: "var(--text)",
                          opacity: 0.35,
                          fontStyle: "italic",
                        }}
                      >
                        {descripcion}
                      </div>

                      {/* Flecha si es clicable */}
                      {(seccionDestino || navegarA) && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.55rem",
                            letterSpacing: "0.1em",
                            color: "var(--primary)",
                            opacity: 0.5,
                          }}
                        >
                          Ver →
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Nota debajo de las tarjetas */}
                <p
                  style={{
                    fontFamily: "'Crimson Pro', serif",
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    opacity: 0.4,
                    fontStyle: "italic",
                  }}
                >
                  * Las tarjetas con "Ver →" son clicables y te llevan a esa sección.
                </p>
              </>
            )}
          </>
        )}

        {/* ── USUARIOS ── */}
        {seccion === "usuarios" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                }}
              >
                Usuarios
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(143,10,28,0.3), transparent)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  opacity: 0.5,
                  fontStyle: "italic",
                }}
              >
                {usuarios.length} usuarios
              </span>
            </div>

            {cargando ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  color: "var(--text)",
                  opacity: 0.4,
                  textTransform: "uppercase",
                }}
              >
                Cargando...
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Nombre",
                      "Email",
                      "Rol",
                      "Estado",
                      "Registrado",
                      "Acciones",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.56rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "var(--text)",
                          opacity: 0.42,
                          textAlign: "left",
                          padding: "0.75rem 1rem",
                          borderBottom: "1px solid rgba(143,10,28,0.12)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u._id} style={{ opacity: u.activo ? 1 : 0.5 }}>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          fontFamily: "'Crimson Pro', serif",
                          fontSize: "1rem",
                          color: "var(--text)",
                          fontWeight: 600,
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        {u.nombre}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          fontFamily: "'Crimson Pro', serif",
                          fontSize: "0.9rem",
                          color: "var(--text)",
                          opacity: 0.55,
                          fontStyle: "italic",
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        {u.email}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.5rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0.25rem 0.6rem",
                            background:
                              u.rol === "admin"
                                ? "var(--primary)"
                                : "rgba(143,10,28,0.08)",
                            color:
                              u.rol === "admin" ? "white" : "var(--primary)",
                          }}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.5rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0.25rem 0.6rem",
                            background: u.activo
                              ? "rgba(0,120,0,0.1)"
                              : "rgba(200,0,0,0.1)",
                            color: u.activo ? "#2a7a2a" : "#c00",
                          }}
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          fontFamily: "'Crimson Pro', serif",
                          fontSize: "0.85rem",
                          color: "var(--text)",
                          opacity: 0.45,
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          borderBottom: "1px solid rgba(143,10,28,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.4rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {u._id !== yo?._id && (
                            <>
                              <Accion onClick={() => cambiarRol(u._id, u.rol)}>
                                {u.rol === "admin" ? "→ Usuario" : "→ Admin"}
                              </Accion>
                              <Accion onClick={() => toggleActivar(u._id)}>
                                {u.activo ? "Desactivar" : "Activar"}
                              </Accion>
                              <Accion onClick={() => eliminar(u._id)} danger>
                                Eliminar
                              </Accion>
                            </>
                          )}
                          {u._id === yo?._id && (
                            <span
                              style={{
                                fontFamily: "'Crimson Pro', serif",
                                fontSize: "0.8rem",
                                color: "var(--text)",
                                opacity: 0.35,
                                fontStyle: "italic",
                              }}
                            >
                              Eres tú
                            </span>
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
          div[style*="gridTemplateColumns: 220px 1fr"] {
            grid-template-columns: 1fr;
          }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
};

const Accion = ({
  children,
  onClick,
  danger,
}: {
  children: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: "'Cinzel', serif",
      fontSize: "0.5rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "0.3rem 0.7rem",
      background: "transparent",
      border: `1px solid ${danger ? "rgba(180,0,0,0.3)" : "rgba(143,10,28,0.22)"}`,
      color: danger ? "#c00" : "var(--primary)",
      transition: "all 0.2s",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

export default Admin;
