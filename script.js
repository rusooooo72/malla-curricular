
// --- CONSTANTES Y VARIABLES GLOBALES ---
const mensajeMalla = document.getElementById('mensaje-malla');
const todosLosRamos = document.querySelectorAll('.ramo');
const LOCAL_STORAGE_KEY = 'mallaEjemploIngenieria'; // Clave única para este ejemplo
let timeoutId = null;


// --- LÓGICA PRINCIPAL ---

/**
 * Se activa al hacer clic en un ramo desde el HTML.
 * @param {HTMLElement} element El div del ramo que fue clickeado.
 */
function toggleAprobado(element) {
    if (element.classList.contains('bloqueado')) {
        mostrarMensajeBloqueado(element);
        return; 
    }

    element.classList.toggle("aprobado");

    if (element.classList.contains("aprobado")) {
        mostrarFelicitacion();
    }

    actualizarEstadoGeneral();
}

/**
 * Revisa todos los ramos, los bloquea o desbloquea según sus requisitos,
 * y luego guarda el estado actualizado.
 */
function actualizarEstadoGeneral() {
    todosLosRamos.forEach(ramo => {
        const requisitos = ramo.dataset.requisitos;
        if (!requisitos) return;

        const listaRequisitos = requisitos.split(',');

        const todosCumplidos = listaRequisitos.every(reqId => {
            const reqElemento = document.querySelector(`[data-id='${reqId.trim()}']`);
            return reqElemento && reqElemento.classList.contains('aprobado');
        });

        if (todosCumplidos) {
            ramo.classList.remove('bloqueado');
        } else {
            ramo.classList.add('bloqueado');
            ramo.classList.remove('aprobado');
        }
    });
    
    guardarEstado();
}


// --- FUNCIONES DE INTERFAZ Y FEEDBACK ---

function mostrarMensaje(texto, tipo, duracion) {
    if (timeoutId) clearTimeout(timeoutId);
    
    mensajeMalla.textContent = texto;
    mensajeMalla.className = `mensaje-malla visible ${tipo}`;
    
    timeoutId = setTimeout(() => {
        mensajeMalla.classList.remove('visible');
    }, duracion);
}

function mostrarFelicitacion() {
    mostrarMensaje("¡Excelente! Un paso más cerca de la meta.", "felicitacion", 3000);
}

function mostrarMensajeBloqueado(element) {
    const requisitosFaltantes = element.dataset.requisitos
        .split(',')
        .map(reqId => {
            const reqElemento = document.querySelector(`[data-id='${reqId.trim()}']`);
            if (reqElemento && !reqElemento.classList.contains('aprobado')) {
                return `"${reqElemento.textContent}"`;
            }
            return null;
        })
        .filter(Boolean);

    if (requisitosFaltantes.length > 0) {
        mostrarMensaje(`❌ Requiere aprobar: ${requisitosFaltantes.join(', ')}`, "error", 4000);
    }
}


// --- GESTIÓN DE DATOS (LocalStorage) ---

function guardarEstado() {
    const estados = Array.from(todosLosRamos).map(div => ({
        id: div.dataset.id,
        aprobado: div.classList.contains('aprobado')
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estados));
}

function cargarEstado() {
    const estadosGuardados = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

    if (estadosGuardados.length > 0) {
        estadosGuardados.forEach(estado => {
            const ramo = document.querySelector(`[data-id='${estado.id}']`);
            if (ramo && estado.aprobado) {
                ramo.classList.add('aprobado');
            }
        });
    }
    
    actualizarEstadoGeneral();
}

// --- INICIO DE LA APLICACIÓN ---
cargarEstado();
