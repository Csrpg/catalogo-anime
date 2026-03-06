import { Routes, Route } from 'react-router-dom'

import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import CustomCursor  from './components/CustomCursor'
import RutaPrivada   from './components/RutaPrivada'
import RutaAdmin     from './components/RutaAdmin'

import Inicio        from './pages/Inicio'
import Catalogo      from './pages/Catalogo'
import DetalleAnime  from './pages/DetalleAnime'
import Login         from './pages/Login'
import Registro      from './pages/Registro'
import Perfil        from './pages/Perfil'
import Favoritos     from './pages/Favoritos'
import Admin         from './pages/Admin'
import NoEncontrado  from './pages/NoEncontrado'

const App = () => {
  return (
    <>
      {/* Cursor personalizado (se monta una vez, funciona en toda la app) */}
      <CustomCursor />

      {/* Navbar fijo en todas las páginas */}
      <Navbar />

      {/* Rutas */}
      <Routes>
        {/* Públicas */}
        <Route path="/"           element={<Inicio />} />
        <Route path="/catalogo"   element={<Catalogo />} />
        <Route path="/anime/:id"  element={<DetalleAnime />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/registro"   element={<Registro />} />

        {/* Protegidas (necesitan login) */}
        <Route path="/favoritos" element={
          <RutaPrivada><Favoritos /></RutaPrivada>
        } />
        <Route path="/perfil" element={
          <RutaPrivada><Perfil /></RutaPrivada>
        } />

        {/* Protegida (necesita rol admin) */}
        <Route path="/admin" element={
          <RutaAdmin><Admin /></RutaAdmin>
        } />

        {/* 404 */}
        <Route path="*" element={<NoEncontrado />} />
      </Routes>

      {/* Footer en todas las páginas excepto login/registro */}
      <Footer />
    </>
  )
}

export default App