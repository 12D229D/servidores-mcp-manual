/**
 * Manual y Guía de Servidores MCP - Script Principal
 *
 * Módulos:
 *   initTheme, initNavigation, initSearch, initCodeCopy,
 *   initProgressTracking, initMcpDemo (mock JSON-RPC), initMobileMenu
 *
 * Convenciones de localStorage:
 *   mcp_guide_theme       -> 'dark' | 'light'
 *   mcp_read_sections -> ["arquitectura", ...]
 *
 * Aviso de seguridad: ninguna función abre sockets ni lanza procesos stdio.
 * El wizard simula una conversación JSON-RPC con un servidor MCP mock.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSearch();
    initCodeCopy();
    initProgressTracking();
    initMcpDemo();
    initMobileMenu();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const savedTheme = localStorage.getItem('mcp_guide_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('mcp_guide_theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    function updateThemeUI(theme) {
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Claro';
            }
        }
    }
}

/* ==========================================================================
   2. Navigation & SPA Routing via Hash
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');
    const currentCrumb = document.getElementById('current-crumb');

    function activateSection(targetId, updateHash = true) {
        if (!targetId) targetId = 'inicio';

        sections.forEach(sec => sec.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        const targetNavItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (targetNavItem) {
                targetNavItem.classList.add('active');
                if (currentCrumb) {
                    currentCrumb.textContent = targetNavItem.querySelector('.nav-text')?.textContent || targetId;
                }
            }

            if (updateHash) {
                history.pushState(null, null, `#${targetId}`);
            }

            // Track reading progress
            saveProgress(targetId);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            activateSection(target);
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        });
    });

    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        activateSection(hash || 'inicio', false);
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        activateSection(initialHash, false);
    } else {
        activateSection('inicio', false);
    }
}

/* ==========================================================================
   3. Real-time Search Filter
   ========================================================================== */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const navGroups = document.querySelectorAll('.nav-group');
    const navItems = document.querySelectorAll('.nav-item');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });

        navGroups.forEach(group => {
            const visibleChildren = group.querySelectorAll('.nav-item');
            const hasVisible = Array.from(visibleChildren).some(child => child.style.display !== 'none');
            group.style.display = hasVisible ? 'block' : 'none';
        });
    });
}

/* ==========================================================================
   4. Code Copy to Clipboard
   ========================================================================== */
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-wrapper');
            const codeBlock = wrapper ? wrapper.querySelector('code') : null;

            if (codeBlock) {
                try {
                    await navigator.clipboard.writeText(codeBlock.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ ¡Copiado!';
                    btn.style.backgroundColor = 'var(--accent-primary)';
                    btn.style.color = '#fff';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    btn.textContent = '❌ Error';
                }
            }
        });
    });
}

/* ==========================================================================
   5. Reading Progress Tracking
   ========================================================================== */
const TOTAL_SECTIONS = 7; // sin contar inicio ni el wizard demo

function saveProgress(sectionId) {
    if (sectionId === 'inicio' || sectionId === 'demo') return;

    let readSections = JSON.parse(localStorage.getItem('mcp_read_sections')) || [];
    if (!readSections.includes(sectionId)) {
        readSections.push(sectionId);
        localStorage.setItem('mcp_read_sections', JSON.stringify(readSections));
    }
    updateProgressUI(readSections);
}

function initProgressTracking() {
    const readSections = JSON.parse(localStorage.getItem('mcp_read_sections')) || [];
    updateProgressUI(readSections);

    const completionBtns = document.querySelectorAll('.completion-btn');
    completionBtns.forEach(btn => {
        const sectionId = btn.getAttribute('data-section');
        if (readSections.includes(sectionId)) {
            setBtnCompleted(btn);
        }

        btn.addEventListener('click', () => {
            let currentRead = JSON.parse(localStorage.getItem('mcp_read_sections')) || [];
            if (!currentRead.includes(sectionId)) {
                currentRead.push(sectionId);
                localStorage.setItem('mcp_read_sections', JSON.stringify(currentRead));
                setBtnCompleted(btn);
                updateProgressUI(currentRead);
            }
        });
    });
}

function setBtnCompleted(btn) {
    btn.classList.add('completed');
    btn.innerHTML = '✓ Sección Leída y Completada';
}

function updateProgressUI(readSections) {
    const valElem = document.getElementById('progress-val');
    const fillElem = document.getElementById('progress-fill');

    if (valElem && fillElem) {
        const percent = Math.min(Math.round((readSections.length / TOTAL_SECTIONS) * 100), 100);
        valElem.textContent = `${percent}%`;
        fillElem.style.width = `${percent}%`;
    }
}

/* ==========================================================================
   6. Interactive Wizard «MCP Playground»
      Simula una conversación JSON-RPC con un servidor MCP mock.
      Sin red ni dependencias.
   ========================================================================== */
function initMcpDemo() {
    const wizardState = {
        listTools: null,  // 'listTools' | 'callTool'
        callTool: null,    // 'ejemplo'
        response: null    // 'response'
    };

    let currentStep = 1;
    const totalSteps = 3;

    const stepDots = document.querySelectorAll('.step-dot');
    const wizardSteps = document.querySelectorAll('.wizard-step');

    // Selección de opciones
    document.querySelectorAll('.wizard-step .option-card').forEach(card => {
        card.addEventListener('click', () => {
            const step = card.closest('.wizard-step');
            const key = step.getAttribute('data-wizard-key');
            const val = card.getAttribute('data-value');

            step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            wizardState[key] = val;

            const nextBtn = step.querySelector('.btn-next');
            if (nextBtn) nextBtn.disabled = false;
        });
    });

    // Botones Siguiente / Ejecutar
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            } else if (currentStep === totalSteps) {
                runMcpDemoAndShowTrace();
            }
        });
    });

    // Botones Anterior
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) goToStep(currentStep - 1);
        });
    });

    const resetBtn = document.getElementById('reset-wizard-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(wizardState).forEach(k => wizardState[k] = null);
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.btn-next').forEach(b => b.disabled = true);
            // Paso 1 puede tener un btn-next inicialmente deshabilitado por markup

            const resultBox = document.getElementById('wizard-result');
            if (resultBox) resultBox.style.display = 'none';
            goToStep(1);
        });
    }

    function goToStep(stepNum) {
        currentStep = stepNum;

        wizardSteps.forEach(s => s.classList.remove('active'));
        const activeStep = document.querySelector(`.wizard-step[data-step="${stepNum}"]`);
        if (activeStep) activeStep.classList.add('active');

        stepDots.forEach((dot, idx) => {
            const dStep = idx + 1;
            dot.classList.remove('active', 'completed');
            if (dStep === currentStep) {
                dot.classList.add('active');
                dot.textContent = dStep;
            } else if (dStep < currentStep) {
                dot.classList.add('completed');
                dot.textContent = '✓';
            } else {
                dot.textContent = dStep;
            }
        });
    }

    /* ----------------------------------------------------------------------
       Motor mock del MCP Playground: construye una traza describiendo la
       conversación JSON-RPC con un servidor MCP mock, y la "streamea" token a
       token con efecto typewriter (sin red ni claves).
       ---------------------------------------------------------------------- */
    function runMcpDemoAndShowTrace() {
        const { listTools, callTool, response } = wizardState;

        const etiquetas = {
            listTools: {
                listTools:   '🔧 tools/list → Lista herramientas disponibles en el servidor MCP',
                callTool:    '🔧 tools/call → Invoca una herramienta en el servidor MCP'
            },
            callTool: {
                ejemplo:    '🔧 ejemplo → Herramienta de ejemplo con parámetro de entrada'
            },
            response: {
                response:     '🔧 Respuesta → Respuesta mockeada de la herramienta invocada'
            }
        };

        const stackName = 'MCP Playground';
        const trace = [
            '⟐ INICIO MCP PLAYGROUND (mock, sin red ni claves)',
            etiquetas.listTools[listTools],
            etiquetas.callTool[callTool],
            etiquetas.response[response],
            '✓ FIN del MCP Playground — vuelta de control al usuario'
        ].join('\n');

        // Rellena etiquetas de la card de resultado
        document.getElementById('rec-stack-name').textContent = stackName;
        document.getElementById('rec-framework').textContent = 'Modo: ' + (listTools || '—');
        document.getElementById('rec-styling').textContent = 'Herramienta: ' + (callTool || '—');
        document.getElementById('rec-state').textContent = 'Respuesta: ' + (response || '—');

        // Oculta pasos y muestra card de resultado
        wizardSteps.forEach(s => s.classList.remove('active'));
        const resultCard = document.getElementById('wizard-result');
        if (resultCard) resultCard.style.display = 'block';

        // Efecto typewriter de la traza (simulación de streaming SSE)
        const rationale = document.getElementById('rec-rationale');
        typewriterStream(rationale, trace, 18);
    }

    /**
     * Escribe la traza carácter a carácter para simular el streaming de un
     * servidor MCP. Cancela cualquier animación previa con un token de ejecución.
     */
    function typewriterStream(el, text, cps = 20) {
        if (!el) return;
        if (el._mcpTypewriterToken) el._mcpTypewriterToken.cancelled = true;
        const token = { cancelled: false };
        el._mcpTypewriterToken = token;

        el.textContent = '';
        el.classList.add('typing');

        let i = 0;
        const delay = 1000 / cps;
        (function tick() {
            if (token.cancelled) return;
            if (i >= text.length) {
                el.classList.remove('typing');
                return;
            }
            el.textContent += text[i++];
            setTimeout(tick, delay);
        })();
    }
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}
