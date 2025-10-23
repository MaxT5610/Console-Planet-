// ======================= app.js =======================
// Lógica del formulario de pedidos, adaptada para "Console Planet"
// ======================================================

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
    return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
    // Para <select>, buscamos la opción seleccionada
    if (el.tagName === 'SELECT') {
        const opt = el.options[el.selectedIndex];
        const raw = opt?.dataset?.precio;
        return raw ? Number(raw) : 0;
    }
    // Para <input> (checkbox)
    const raw = el?.dataset?.precio;
    return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias Formulario Pedido ---
    const form = document.getElementById('formPedido');
    const outNombre = document.getElementById('outNombre');
    const outLista = document.getElementById('outLista');
    const outTotal = document.getElementById('outTotal');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const confirmNombre = document.getElementById('confirmNombre');

    // --- Referencias Toast (Aviso) ---
    const toastEl = document.getElementById('toastAviso');
    const toastBody = document.getElementById('toastBody');
    // (Tu JS tenía un 'btnToast' de demo, lo quitamos y usamos el toast para validación)
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    
    // --- Lógica del Formulario ---
    form?.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recargar la página

        // 1) Leemos campos base
        const nombre = document.getElementById('nombreCliente').value.trim();
        const selModelo = document.getElementById('selModelo');
        const selTalla = document.getElementById('selTalla'); // (Talla = Versión)
        const selColor = document.getElementById('selColor');
        const cantidad = Number(document.getElementById('inpCantidad').value || 0);

        // Validación mínima:
        // (El 'required' en HTML ayuda, esto es un doble check)
        if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
            // ¡MODIFICADO! Usamos el Toast en lugar de alert()
            toastBody.textContent = 'Completa nombre, modelo, versión, color y cantidad (mínimo 1).';
            toast.show();
            return;
        }

        // 2) Precios base
        const precioModelo = getPrecioFromDataset(selModelo); // precio unitario del modelo
        let total = precioModelo * cantidad;

        // 3) Extras / personalización
        const chkNombreNumero = document.getElementById('chkNombreNumero'); // (Garantía)
        const chkParcheLiga = document.getElementById('chkParcheLiga');   // (Seguro)

        const extrasSeleccionados = [];
        if (chkNombreNumero.checked) {
            total += getPrecioFromDataset(chkNombreNumero); // Costo fijo, no por cantidad
            extrasSeleccionados.push('Garantía Extendida');
        }
        if (chkParcheLiga.checked) {
            total += getPrecioFromDataset(chkParcheLiga); // Costo fijo, no por cantidad
            extrasSeleccionados.push('Seguro contra daños');
        }

        // Campos condicionales (solo se muestran en resumen si tienen contenido)
        const inpNombre = document.getElementById('inpNombre').value.trim();
        const inpNumero = document.getElementById('inpNumero').value.trim();

        // 4) Envío e instrucciones
        const selEnvio = document.getElementById('selEnvio');
        const costoEnvio = getPrecioFromDataset(selEnvio);
        total += costoEnvio;

        // ¡CORREGIDO! Tu HTML usa 'txtNotas', no 'txtInstrucciones'
        const txtInstr = document.getElementById('txtNotas').value.trim();

        // 5) Pintamos resumen
        outNombre.textContent = nombre;

        // Lista HTML del pedido
        outLista.innerHTML = `
            <li><strong>Producto:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
            <li><strong>Versión:</strong> ${selTalla.value}</li>
            <li><strong>Color:</strong> ${selColor.value}</li>
            <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
            ${inpNombre || inpNumero ? `<li><strong>Datos Garantía:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Folio: ' + inpNumero : ''}</li>` : ''}
            <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
            ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
        `;

        outTotal.textContent = toMXN(total);

        // Habilitamos confirmar y pasamos nombre al modal
        btnConfirmar.disabled = false;
        confirmNombre.textContent = nombre;
    });

    // Reset: limpiar también el resumen
    form?.addEventListener('reset', () => {
        setTimeout(() => {
            outNombre.textContent = '—';
            outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
            outTotal.textContent = '$0.00';
            btnConfirmar.disabled = true;
        }, 0);
    });
});
// ===================== /app.js (Fin Formulario) ======================


// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
    // -------- Actividad 1: Banner con getElementById --------
    const banner = document.getElementById('banner');
    const btnPromo = document.getElementById('btnPromo');

    // Al hacer clic, cambia clases de Bootstrap (bg-dark -> bg-warning).
    // Esto funciona perfecto con la paleta HSL, ya que --bs-warning es tu color GOLD.
    btnPromo?.addEventListener('click', () => {
        banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
        banner.classList.add('bg-warning'); // (Este es tu color --color-gold)
        banner.classList.remove('text-white');
        banner.classList.add('text-dark');
    });

    // -------- Actividad 2: Testimonios --------
    // 2.1 VIP en azul (text-primary) usando getElementsByClassName
    // (text-primary es tu color --color-sega)
    const vipItems = document.getElementsByClassName('testimonio-vip');
    for (const item of vipItems) {
        // (Tu JS original le ponía 'text-primary', lo cual está bien, 
        // pero la card ya tiene 'border-primary', así que lo dejamos así)
        // item.classList.add('text-primary'); 
    }

    // 2.2 Párrafos de testimonios en rojo (text-danger)
    // ¡MODIFICADO! Tu JS afectaba a TODOS los <p> de la página.
    // Lo limitamos solo a la sección de testimonios.
    const allParagraphs = document.querySelectorAll('#testimonios p');
    for (const p of allParagraphs) {
        p.classList.add('text-danger');
    }

    // -------- Actividad 3: Formulario de contacto --------
    // 3.1 Primer input de texto con querySelector (bg-success)
    const firstTextInput = document.querySelector('#formContacto input[type="text"]');
    firstTextInput?.classList.add('bg-success', 'bg-opacity-10');

    // 3.2 Todos los botones del formulario
    // ¡MODIFICADO! Cambiado a 'btn-warning' (GOLD) para que combine con tu paleta.
    const contactoButtons = document.querySelectorAll('#formContacto button');
    contactoButtons.forEach(btn => {
        btn.classList.remove('btn-primary', 'btn-outline-secondary');
        btn.classList.add('btn-warning', 'text-dark'); // (Color GOLD)
    });

    // 3.3 Campo "nombre" via getElementsByName -> color de texto text-warning (GOLD)
    const nombreInputs = document.getElementsByName('nombre');
    if (nombreInputs.length > 0) {
        const nombreInput = nombreInputs[0];
        // (La clase 'text-warning' no se ve bien en un input, 
        // pero 'border-warning' sí)
        nombreInput.classList.add('border-warning', 'border-2');
        
        const label = document.querySelector('label[for="cNombre"]');
        label?.classList.add('text-warning'); // (Color GOLD)
    }

    // -------- NUEVO: Lógica para Botón Flotante WhatsApp --------
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        window.addEventListener('scroll', () => {
            // Muestra el botón si el scroll es mayor a 400px
            if (window.scrollY > 400) {
                whatsappBtn.classList.add('show');
            } else {
                whatsappBtn.classList.remove('show');
            }
        });
    }
});
