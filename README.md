# 🖥️ SERVIDORES-MCP — Manual y Guía de Servidores MCP (Model Context Protocol)

SPA interactiva (HTML5 semántico + CSS3 Vanilla + JS ES6+) que documenta cómo
**entender, construir y consumir servidores MCP** con tecnologías web nativas.

- **100% sin dependencias**: cero `node_modules`, cero build step, cero
  frameworks. Solo `index.html` + `css/styles.css` + `js/app.js`.
- **100% segura**: ninguna demo abre sockets ni lanza procesos stdio.
  La sección `#demo` simula todo con respuestas mockeadas.
- **Reutiliza el design system** del `manual-frontend-html5` (slate + emerald/cyan)
  con componentes temáticos de MCP: `.mcp-flow` (diagrama Host/Client/Server).

---

## 🚀 Cómo abrir y navegar el manual

Es HTML/CSS/JS 100% estático. Cualquiera de estas opciones vale:

```bash
# Opción A — doble clic en index.html (file://)
#   Algunas funciones del Service Worker requieren http(s), pero el README,
#   el wizard y la navegación SPA funcionan perfectamente con file://.

# Opción B — servidor estático desde la carpeta del proyecto
cd "C:/Users/IGD/Dropbox/Copias de seguridad/Codex/SERVIDORES-MCP"
python -m http.server 8001
# luego abre http://localhost:8001
```

> Alternativa opcional: `npx serve .` (requiere Node; no es la vía canónica del repositorio).

---

## 🧭 Tabla de hashes (navegación SPA)

| Hash                | Título                            | Contenido clave                                                                              |
|---------------------|-----------------------------------|----------------------------------------------------------------------------------------------|
| `#inicio`           | Inicio y Resumen                  | Qué es MCP, por qué existe, cómo usar el manual                         |
| `#arquitectura`     | Arquitectura MCP                  | Hosts, clients, servers; JSON-RPC 2.0; roles y responsabilidades         |
| `#transporte`       | Transporte                        | stdio, SSE (HTTP+POST deprecated), Streamable HTTP; cuándo usar cada uno         |
| `#ciclo-vida`       | Ciclo de Vida                     | initialize → initialized → operation (request/response, notif., sampling) → exit |
| `#primitivos`       | Tools, Resources & Prompts        | Esquemas, ejemplos JSON-RPC de list/call/get                                     |
| `#servidor`         | Construir un Servidor MCP         | Estructura mínima (pseudocódigo Multi-SDK), registro de tools                     |
| `#cliente`          | Consumir un Servidor MCP          | Conexión desde un cliente, descubrimiento de capabilities                        |
| `#demo`             | MCP Playground                    | Demo interactiva: simulación mock de `tools/list` + `tools/call` con respuesta tipada     |

---

## ✨ Features de la UI

- [x] Sidebar con buscador en vivo y barra de progreso de lectura
- [x] Navegación SPA con `#hash` y soporte back/forward (`popstate`)
- [x] Modo claro/oscuro persistente (`localStorage` → clave `mcp_guide_theme`)
- [x] Copia de bloques de código al portapapeles
- [x] "Marcar como leída" por sección → recalcula el % de progreso (clave `mcp_read_sections`)
- [x] Demo «MCP Playground» que simula una conversación JSON-RPC con un servidor MCP mock
- [x] Componente visual `.mcp-flow` (diagrama de flujo Host/Client/Server)
- [x] Responsive: sidebar colapsable en móvil (< 992px) con overlay

---

## 🔒 Precauciones de seguridad

- Ninguna demo de este manual abre sockets ni lanza procesos stdio.
- El wizard «MCP Playground» simula todo con **respuestas mockeadas**.
- Los ejemplos de transporte stdio explican los **riesgos** (no exponer servidores stdio a internet).
- Para producción se recomienda además: rate-limiting, validación de entrada y
  registro de uso en el proxy.

---

## 🗂️ Estructura de archivos

```text
SERVIDORES-MCP/
├── index.html          # SPA por secciones (#hash), sidebar + buscador + demo embebida
├── css/
│   └── styles.css      # Design tokens slate/emerald (reutiliza manual-frontend-html5) + componentes MCP
├── js/
│   └── app.js          # initTheme, initNavigation, initSearch, initCodeCopy,
│                       #   initProgressTracking, initMcpDemo (mock JSON-RPC), initMobileMenu
├── README.md           # Este archivo
└── plan.md             # Bitácora y plan de ruta del subproyecto
```

Sin `assets/`, `scripts/`, `components/`, `examples/` ni backend: sigue el patrón SPA
monolítico vanilla de los manuales hermanos
(`manual-frontend-html5`, `manual-zcode-html5`, `📚 Manual-IA-HTML5`).

---

## 📖 Referencias técnicas

- [Model Context Protocol — Specification](https://modelcontextprotocol.io/specification)
- [MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Server Quickstart](https://modelcontextprotocol.io/quickstart/server)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

---

## 🧱 Convenciones

- **Idioma**: español.
- **Semántica y SEO**: HTML5 semántico, un único `<h1>` por página, IDs únicos.
- **100% vanilla**: cero `node_modules`, cero build. El servidor MCP real se
  documenta con pseudocódigo Multi-SDK; la demo es un mock en JS puro.
- **Cumple `AGENTS.md`**: no instalar paquetes npm en la raíz del repo.
