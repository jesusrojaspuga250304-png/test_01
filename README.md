# Codalvia — experiencia de software multipágina

Sitio estático para particulares y empresas. Conserva la paleta y la tipografía de la versión anterior y sustituye la landing extensa por páginas independientes.

**Nombre provisional:** Codalvia no tiene validación registral ni de dominio. Los productos son ejemplos genéricos; no hay pagos, venta de licencias ni envío de consultas activos.

## Páginas
- `index.html`: portada breve y accesos por necesidad.
- `catalogo.html`: búsqueda, filtros y comparación.
- `producto.html?id=creative`: detalle de cada solución. IDs: creative, office, security, business, dev, personal.
- `empresas.html`: casos por área y criterios para una consulta empresarial.
- `guias.html`: centro de guías y preguntas frecuentes.
- `guia-licencias.html`, `guia-compatibilidad.html`, `guia-implementacion.html`: artículos completos con índice.
- `nosotros.html`: enfoque y estado del proyecto.
- `contacto.html`: preparación y descarga local de consultas.

## Organización
- `assets/styles.css`: sistema visual original, conservado.
- `assets/pages.css`: composiciones multipágina y animaciones.
- `assets/app.js`: catálogo compartido, selección, comparación, detalle, formulario y animación progresiva.
- `assets/favicon.svg`: icono provisional.
- `tests/smoke.cjs`: verificación de rutas, interacciones, movimiento reducido y diseño adaptable.

No hay dependencias de producción ni compilación. La navegación y los artículos están en HTML; JavaScript activa el catálogo y los flujos interactivos. Cabecera y pie están presentes en cada archivo, por lo que un cambio global debe replicarse en todos los HTML.

## Ejecutar
Desde la raíz del proyecto:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8080. Para GitHub Pages, se puede utilizar la raíz de main; este cambio no activa por sí solo la publicación.

## Interacciones y enlaces
- Filtros de entrada: `catalogo.html?publico=business&categoria=Gestión` y `?publico=personal`. También admite `?q=texto`.
- Fichas con URL compartible y navegación nativa Atrás/Adelante.
- Comparación de 2–3 soluciones.
- Selección persistente entre páginas y pestañas mediante localStorage. Se migra la selección de Aplivanta cuando todavía no existe una selección de Codalvia.
- `contacto.html?tipo=empresa` preselecciona empresa. Se genera un archivo de texto local; no se envían datos.
- Animaciones de entrada, elevación al pasar el cursor y apariciones por sección. Las animaciones decorativas son finitas; se respeta `prefers-reduced-motion`.
- Menú móvil, foco visible, enlace para saltar contenido y diálogos cerrables con Escape.

## Pruebas
Con Playwright y Chromium disponibles, ejecutar (la prueba inicia su propio servidor local temporal):

```sh
node tests/smoke.cjs
```

Opciones de entorno: `TEST_URL` para la URL, `BROWSER_EXECUTABLE` para un Chromium externo y `NODE_PATH` si Playwright está instalado fuera del proyecto. Las capturas de QA se generan en el directorio temporal del sistema.

## Antes de vender
Validar la identidad comercial, cargar productos reales y condiciones verificadas, definir precios e impuestos e integrar backend, pago alojado, entrega de licencias y canales de atención. No añadir claves privadas al frontend. Ajustar privacidad y condiciones a los flujos reales.

## Referencias de organización comercial
- [Microsoft 365](https://www.microsoft.com/es-PE/microsoft-365/buy/compare-all-microsoft-365-products): públicos y comparación.
- [Adobe Business](https://business.adobe.com/products.html): familias de soluciones.
- [Newegg Software](https://www.newegg.com/Software-Services/Store/ID-6): categorías y exploración.

La identidad, las ilustraciones CSS y los textos de Codalvia son propios de este prototipo.
