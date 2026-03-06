// Panel de administración. Solo accesible con rol admin.
// RutaAdmin.tsx se encarga de bloquear el acceso a otros usuarios.

import { useEffect, useState } from "react";
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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "210px 1fr",
        minHeight: "100vh",
        paddingTop: "64px",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "#0a0002",
          padding: "2rem 0",
          borderRight: "1px solid rgba(143,10,28,0.15)",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.56rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--primary)",
            padding: "0 1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Panel Admin
        </div>
        <ul style={{ listStyle: "none" }}>
          {(
            [
              ["estadisticas", "⊞ Estadísticas"],
              ["usuarios", "◉ Usuarios"],
            ] as [Seccion, string][]
          ).map(([key, label]) => (
            <li key={key}>
              <button
                onClick={() => setSeccion(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.8rem 1.5rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: seccion === key ? "white" : "rgb(255, 251, 251)",
                  background:
                    seccion === key ? "rgba(143,10,28,0.18)" : "transparent",
                  border: "none", // Quitamos los bordes generales
                  borderLeft: `2px solid ${seccion === key ? "var(--primary)" : "transparent"}`, // Mantenemos solo uno
                  textAlign: "left",
                  transition: "all 0.2s",
                  cursor: "pointer", // Tip extra: añade esto para que se vea que es clicable
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenido */}
      <main style={{ padding: "2.5rem" }}>
        {/* ── ESTADÍSTICAS ── */}
        {seccion === "estadisticas" && (
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
            {stats && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "1.5rem",
                }}
              >
                {(
                  [
                    ["Animes", stats.totalAnimes],
                    ["Usuarios", stats.totalUsuarios],
                    ["Reseñas", stats.totalResenas],
                    ["Favoritos", stats.totalFavoritos],
                  ] as [string, number][]
                ).map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      padding: "1.5rem",
                      background: "white",
                      border: "1px solid rgba(143,10,28,0.07)",
                      borderTop: "3px solid var(--primary)",
                    }}
                  >
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
                      {val}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.56rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--text)",
                        opacity: 0.42,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
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
                          {/* No puedes cambiar tu propio rol */}
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

      {/* Responsive */}
      <style>{`@media (max-width: 768px) { div[style*="gridTemplateColumns: 210px 1fr"] { grid-template-columns: 1fr; } aside { display: none; } }`}</style>
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
    }}
  >
    {children}
  </button>
);

export default Admin;
