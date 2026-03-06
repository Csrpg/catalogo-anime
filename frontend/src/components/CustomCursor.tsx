// Cursor personalizado: punto rojo que sigue al ratón.
// Se monta una sola vez en App.tsx y funciona en toda la app.

import { useEffect, useRef } from 'react'

const CustomCursor = () => {
  // useRef → referencia directa al elemento DOM
  // (más eficiente que useState para animaciones)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mover = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Mover el cursor directamente (sin estado = sin re-render)
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }

    // Efecto hover: cuando el ratón está sobre un elemento clicable
    const addHover = () => cursorRef.current?.classList.add('hover')
    const removeHover = () => cursorRef.current?.classList.remove('hover')

    document.addEventListener('mousemove', mover)

    // Selecciona todos los elementos clicables para el efecto hover
    const clickables = document.querySelectorAll('a, button, [role="button"]')
    clickables.forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    // Cleanup: elimina los listeners cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousemove', mover)
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return <div className="cursor" ref={cursorRef} />
}

export default CustomCursor
