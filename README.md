# Aplivanta — tienda de software conceptual

Rediseño de `test_01` para particulares y empresas. HTML, CSS y JavaScript sin dependencias de producción ni compilación.

**Aplivanta es un nombre provisional: no se ha validado su disponibilidad registral ni de dominio.** Los seis productos son genéricos e ilustrativos; no se anuncian precios ni afiliaciones con fabricantes.

## Estructura

- `index.html`: página, navegación, catálogo, sección empresarial, guías y preguntas frecuentes.
- `assets/styles.css`: diseño adaptable, ilustraciones hechas con CSS y estilos accesibles.
- `assets/app.js`: datos de catálogo, filtros, búsqueda, fichas, comparación y selección.
- `assets/favicon.svg`: icono propio provisional.
- `tests/smoke.cjs`: pruebas de navegador con Playwright (dependencia de desarrollo opcional).

## Ver localmente

Desde esta carpeta, ejecutar `python3 -m http.server 8080` y abrir `http://localhost:8080`.
También se puede abrir `index.html` directamente; el almacenamiento local depende de las políticas del navegador.

## Funciones

- Búsqueda tolerante a acentos, categorías, público y orden alfabético.
- Fichas y comparación de 2–3 soluciones mediante diálogos con cierre Escape.
- Selección persistente en el navegador con altas y bajas.
- Consulta empresarial o personal con resumen descargable; **no se envía**.
- Navegación móvil, foco visible, enlace para saltar al contenido y movimiento reducido.

## Personalizar y pasar a producción

1. Validar el nombre comercial y reemplazar la identidad provisional.
2. Sustituir `products` en `assets/app.js` por catálogo, licencias y compatibilidades verificadas.
3. Definir precios, impuestos y condiciones. La demo no realiza cálculos ni cobra.
4. Integrar el backend comercial y una pasarela de pago alojada; nunca guardar claves privadas en el frontend.
5. Configurar entrega de licencias, contacto real, políticas de privacidad y condiciones comerciales.

No se usan correos inventados, testimonios ficticios ni logotipos de fabricantes.

## Pruebas

Con Playwright y Chromium instalados, iniciar el servidor local anterior y ejecutar `node tests/smoke.cjs`. Si Playwright está en una ruta externa, definir `NODE_PATH` según el entorno. No forma parte del sitio publicado.

## Publicación

La estructura es compatible con GitHub Pages desde la raíz de `main`. Este cambio por sí mismo no activa ni verifica un despliegue.

## Referencias de experiencia, no de identidad visual

- [Microsoft 365](https://www.microsoft.com/es-PE/microsoft-365/buy/compare-all-microsoft-365-products): separación de particulares y empresas y comparación de opciones.
- [Adobe Business](https://business.adobe.com/products.html): familias de soluciones y orientación por necesidades.
- [Newegg Software](https://www.newegg.com/Software-Services/Store/ID-6): categorías y exploración de catálogo.

Se implementó una composición original sin copiar textos, marcas ni recursos de estas empresas.
