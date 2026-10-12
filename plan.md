# Plan y Bitácora — Manual y Guía de Servidores MCP (Model Context Protocol) en HTML5

## 📌 Resumen

SPA interactiva (HTML5 semántico + CSS3 Vanilla + JS ES6+, 100% sin dependencias, sin 
ode_modules, sin build step) que documenta el **Model Context Protocol (MCP)**: arquitectura cliente/servidor, ciclo de vida, recursos, prompts, tools, transporte (stdio / SSE / HTTP) y cómo construir y consumir servidores MCP.

Todo el proyecto vive dentro de la carpeta SERVIDORES-MCP/ cumpliendo AGENTS.md.

---

## 🎯 Objetivos

- [x] Proveer una SPA responsiva, accesible y de alto nivel visual sobre **MCP**.
- [x] Explicar la **arquitectura MCP** (hosts, clients, servers), el **ciclo de vida** y los **tipos de transporte** (stdio, SSE, Streamable HTTP).
- [x] Documentar los **primitivos del servidor**: 	ools, esources, prompts.
- [x] Mostrar **esquemas JSON** de mensajes (JSON-RPC 2.0) y ejemplos de 	ools/list, 	ools/call, esources/list, prompts/get.
- [x] Incluir una **demo interactiva** que simula una conversación JSON-RPC con un servidor MCP en el navegador.
- [x] Tema claro/oscuro persistente, hash routing SPA, buscador y progreso de lectura.

---

## 🏗️ Arquitectura de Archivos

- **Patrón**: SPA monolítica modular sin dependencias con simulador JSON-RPC en memoria.

`	ext
SERVIDORES-MCP/
├── index.html        # SPA completa con documentación técnica y simulador MCP
├── css/
│   └── styles.css    # Sistema de diseño dark/light y glassmorphism
├── js/
│   └── app.js        # Lógica SPA, simulador de mensajes JSON-RPC y buscador
├── README.md         # Documentación de uso
└── plan.md           # Plan de desarrollo y bitácora
`

---

## 🧠 Paradigma de Programación

- **Híbrido: Declarativo + Event-Driven**
- Vistas declarativas y captura reactiva de eventos para la interacción con el cliente mock de MCP.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: Público (Open Source / Portafolio).
- **Plataforma Remota Asignada**: GitHub.
- **Plataforma de Despliegue CI/CD**: GitHub Pages / Cloudflare Pages.
- **Justificación**: Manual y simulador interactivo del protocolo abierto Model Context Protocol (MCP) promovido por Anthropic; idóneo para GitHub Pages.

---

## 📊 Estado Actual

🟢 **Completado** — Entregable funcional y verificado.
