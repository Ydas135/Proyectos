// checkout.js - Versión mejorada y corregida
// Maneja el proceso de checkout con validaciones para Perú

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const secciones = {
        envio: document.getElementById('datos-envio'),
        pago: document.getElementById('metodo-pago'),
        confirmacion: document.getElementById('confirmacion-pedido'),
        completado: document.getElementById('pedido-completado')
    };

    const pasos = document.querySelectorAll('.paso');
    const botonesNav = {
        siguientePago: document.getElementById('siguiente-pago'),
        volverEnvio: document.getElementById('volver-envio'),
        siguienteConfirmacion: document.getElementById('siguiente-confirmacion'),
        volverPago: document.getElementById('volver-pago'),
        confirmarPedido: document.getElementById('confirmar-pedido')
    };

    const opcionesPago = {
        tarjeta: document.getElementById('tarjeta'),
        paypal: document.getElementById('paypal'),
        transferencia: document.getElementById('transferencia')
    };

    const formulariosPago = {
        tarjeta: document.getElementById('form-tarjeta'),
        paypal: document.getElementById('form-paypal'),
        transferencia: document.getElementById('form-transferencia')
    };

    // Inicialización
    initCheckout();

    function initCheckout() {
        // Cargar carrito desde sessionStorage
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        actualizarResumenCarrito(carrito);
        
        // Configurar event listeners
        setupEventListeners();
        
        // Escuchar cambios en el carrito desde otras páginas
        document.addEventListener('carritoActualizado', (e) => {
            actualizarResumenCarrito(e.detail.carrito);
        });
    }

    function setupEventListeners() {
        // Navegación entre pasos
        if (botonesNav.siguientePago) {
            botonesNav.siguientePago.addEventListener('click', () => {
                if (validarFormularioEnvio()) {
                    cambiarSeccion(secciones.envio, secciones.pago, 1);
                }
            });
        }

        if (botonesNav.volverEnvio) {
            botonesNav.volverEnvio.addEventListener('click', () => {
                cambiarSeccion(secciones.pago, secciones.envio, 0);
            });
        }

        if (botonesNav.siguienteConfirmacion) {
            botonesNav.siguienteConfirmacion.addEventListener('click', () => {
                if (validarFormularioPago()) {
                    actualizarConfirmacion();
                    cambiarSeccion(secciones.pago, secciones.confirmacion, 2);
                }
            });
        }

        if (botonesNav.volverPago) {
            botonesNav.volverPago.addEventListener('click', () => {
                cambiarSeccion(secciones.confirmacion, secciones.pago, 1);
            });
        }

        if (botonesNav.confirmarPedido) {
            botonesNav.confirmarPedido.addEventListener('click', finalizarCompra);
        }

        // Métodos de pago
        if (opcionesPago.tarjeta) {
            opcionesPago.tarjeta.addEventListener('change', mostrarFormularioPago);
            opcionesPago.paypal.addEventListener('change', mostrarFormularioPago);
            opcionesPago.transferencia.addEventListener('change', mostrarFormularioPago);
            
            // Mostrar formulario inicial
            mostrarFormularioPago();
        }

        // Formatear número de tarjeta
        const numeroTarjeta = document.getElementById('numero-tarjeta');
        if (numeroTarjeta) {
            numeroTarjeta.addEventListener('input', formatearNumeroTarjeta);
        }

        // Formatear fecha de expiración
        const fechaExpiracion = document.getElementById('fecha-expiracion');
        if (fechaExpiracion) {
            fechaExpiracion.addEventListener('input', formatearFechaExpiracion);
        }

        // Validar CVV
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', validarCVV);
        }

        // Facturación
        const facturaCheckbox = document.getElementById('factura');
        if (facturaCheckbox) {
            facturaCheckbox.addEventListener('change', toggleFactura);
        }

        // Validar RUC
        const rucInput = document.getElementById('ruc');
        if (rucInput) {
            rucInput.addEventListener('input', validarRUC);
        }

        // Descargar factura
        const descargarFacturaBtn = document.getElementById('descargar-factura');
        if (descargarFacturaBtn) {
            descargarFacturaBtn.addEventListener('click', descargarFactura);
        }
    }

    function cambiarSeccion(seccionActual, seccionSiguiente, paso) {
        // Ocultar todas las secciones
        Object.values(secciones).forEach(seccion => {
            seccion.classList.remove('activa');
        });
        
        // Mostrar sección siguiente
        seccionSiguiente.classList.add('activa');
        
        // Actualizar pasos
        actualizarPasos(paso);
        
        // Scroll suave
        window.scrollTo({
            top: seccionSiguiente.offsetTop - 100,
            behavior: 'smooth'
        });
    }

    function actualizarPasos(pasoActual) {
        pasos.forEach((paso, index) => {
            if (index < pasoActual) {
                paso.classList.add('completado');
                paso.classList.remove('activo');
            } else if (index === pasoActual) {
                paso.classList.add('activo');
                paso.classList.remove('completado');
            } else {
                paso.classList.remove('activo', 'completado');
            }
        });
    }

    function validarFormularioEnvio() {
        const formulario = document.getElementById('form-envio');
        const inputsRequeridos = formulario.querySelectorAll('[required]');
        let esValido = true;
        
        // Validar campos requeridos
        inputsRequeridos.forEach(input => {
            if (!input.value.trim()) {
                marcarError(input, 'Este campo es requerido');
                esValido = false;
            } else {
                limpiarError(input);
            }
        });
        
        // Validar email
        const email = document.getElementById('email');
        if (email && email.value) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email.value)) {
                marcarError(email, 'Ingresa un email válido');
                esValido = false;
            }
        }
        
        // Validar teléfono peruano (9 dígitos)
        const telefono = document.getElementById('telefono');
        if (telefono && telefono.value) {
            const telefonoLimpio = telefono.value.replace(/\D/g, '');
            if (telefonoLimpio.length !== 9) {
                marcarError(telefono, 'El teléfono debe tener 9 dígitos');
                esValido = false;
            }
        }
        
        // Validar RUC si factura está marcado
        if (document.getElementById('factura').checked) {
            const ruc = document.getElementById('ruc');
            if (ruc && ruc.value) {
                const rucLimpio = ruc.value.replace(/\D/g, '');
                if (rucLimpio.length !== 11) {
                    marcarError(ruc, 'El RUC debe tener 11 dígitos');
                    esValido = false;
                }
            }
        }
        
        if (!esValido) {
            mostrarMensaje('Por favor, corrige los errores en el formulario', 'error');
        }
        
        return esValido;
    }

    function validarFormularioPago() {
        // Validar solo si el método es tarjeta
        if (opcionesPago.tarjeta.checked) {
            const titular = document.getElementById('titular-tarjeta');
            const numero = document.getElementById('numero-tarjeta');
            const fecha = document.getElementById('fecha-expiracion');
            const cvv = document.getElementById('cvv');
            
            let esValido = true;
            
            // Validar titular
            if (!titular.value.trim()) {
                marcarError(titular, 'Ingresa el nombre del titular');
                esValido = false;
            }
            
            // Validar número de tarjeta (16 dígitos)
            const numeroLimpio = numero.value.replace(/\s/g, '');
            if (numeroLimpio.length !== 16) {
                marcarError(numero, 'El número de tarjeta debe tener 16 dígitos');
                esValido = false;
            }
            
            // Validar fecha de expiración
            const regexFecha = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!regexFecha.test(fecha.value)) {
                marcarError(fecha, 'Formato inválido (MM/AA)');
                esValido = false;
            } else {
                const [mes, ano] = fecha.value.split('/');
                const fechaExp = new Date(2000 + parseInt(ano), parseInt(mes));
                const hoy = new Date();
                
                if (fechaExp < hoy) {
                    marcarError(fecha, 'La tarjeta está expirada');
                    esValido = false;
                }
            }
            
            // Validar CVV
            if (!/^\d{3,4}$/.test(cvv.value)) {
                marcarError(cvv, 'CVV inválido (3 o 4 dígitos)');
                esValido = false;
            }
            
            if (!esValido) {
                mostrarMensaje('Corrige los errores en los datos de pago', 'error');
            }
            
            return esValido;
        }
        
        return true;
    }

    function mostrarFormularioPago() {
        // Ocultar todos los formularios
        Object.values(formulariosPago).forEach(form => {
            form.classList.add('oculto');
        });
        
        // Mostrar el formulario seleccionado
        if (opcionesPago.tarjeta.checked) {
            formulariosPago.tarjeta.classList.remove('oculto');
        } else if (opcionesPago.paypal.checked) {
            formulariosPago.paypal.classList.remove('oculto');
        } else if (opcionesPago.transferencia.checked) {
            formulariosPago.transferencia.classList.remove('oculto');
        }
    }

    function formatearNumeroTarjeta(e) {
        let valor = e.target.value.replace(/\D/g, '');
        let valorFormateado = '';
        
        for (let i = 0; i < valor.length; i++) {
            if (i > 0 && i % 4 === 0) {
                valorFormateado += ' ';
            }
            valorFormateado += valor[i];
        }
        
        if (valor.length > 16) {
            valorFormateado = valorFormateado.substring(0, 19);
        }
        
        e.target.value = valorFormateado;
    }

    function formatearFechaExpiracion(e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length > 0) {
            if (valor.length <= 2) {
                e.target.value = valor;
            } else {
                const mes = valor.substring(0, 2);
                const ano = valor.substring(2, 4);
                e.target.value = `${mes}/${ano}`;
            }
        }
    }

    function validarCVV(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
        }
    }

    function toggleFactura() {
        const grupoRuc = document.getElementById('grupo-ruc');
        const rucInput = document.getElementById('ruc');
        
        if (this.checked) {
            grupoRuc.style.display = 'block';
            rucInput.required = true;
        } else {
            grupoRuc.style.display = 'none';
            rucInput.required = false;
            rucInput.value = '';
        }
    }

    function validarRUC(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length > 11) {
            e.target.value = e.target.value.slice(0, 11);
        }
    }

    function actualizarResumenCarrito(carrito) {
        const itemsResumen = document.getElementById('items-resumen');
        const subtotalCarrito = document.getElementById('subtotal-carrito');
        const envioCarrito = document.getElementById('envio-carrito');
        const totalCarrito = document.getElementById('total-carrito');
        
        if (!itemsResumen) return;
        
        itemsResumen.innerHTML = '';
        
        if (carrito.length === 0) {
            itemsResumen.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            if (subtotalCarrito) subtotalCarrito.textContent = 'S/0.00';
            if (envioCarrito) envioCarrito.textContent = 'S/0.00';
            if (totalCarrito) totalCarrito.textContent = 'S/0.00';
            return;
        }
        
        let subtotal = 0;
        
        carrito.forEach(item => {
            subtotal += item.precio * item.cantidad;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'item-carrito-resumen';
            itemElement.innerHTML = `
                <img src="${obtenerImagenProducto(item.id)}" alt="${item.nombre}">
                <div class="item-info-resumen">
                    <div class="item-nombre-resumen">${item.nombre}</div>
                    <div class="item-precio-resumen">S/ ${item.precio.toFixed(2)}</div>
                    <div class="item-cantidad-resumen">Cantidad: ${item.cantidad}</div>
                </div>
            `;
            
            itemsResumen.appendChild(itemElement);
        });
        
        const envio = 5.99; // Costo fijo de envío en Perú
        const total = subtotal + envio;
        
        if (subtotalCarrito) subtotalCarrito.textContent = `S/${subtotal.toFixed(2)}`;
        if (envioCarrito) envioCarrito.textContent = `S/${envio.toFixed(2)}`;
        if (totalCarrito) totalCarrito.textContent = `S/${total.toFixed(2)}`;
    }

    function obtenerImagenProducto(id) {
        if (id >= 1 && id <= 3) return '../imagenes/articulo_basquet.jpg';
        if (id >= 4 && id <= 6) return '../imagenes/guantes.avif';
        return '../imagenes/aerobics.jpg';
    }

    function actualizarConfirmacion() {
        // Datos de envío
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const departamento = document.getElementById('departamento').options[document.getElementById('departamento').selectedIndex].text;
        const distrito = document.getElementById('distrito').value;
        const referencia = document.getElementById('referencia').value;
        
        const confirmacionDireccion = document.getElementById('confirmacion-direccion');
        confirmacionDireccion.innerHTML = `
            <p><strong>${nombre}</strong></p>
            <p>${direccion}</p>
            <p>${distrito}, ${departamento}</p>
            ${referencia ? `<p>Referencia: ${referencia}</p>` : ''}
            <p>Teléfono: ${telefono}</p>
            <p>Email: ${email}</p>
        `;
        
        // Método de pago
        const confirmacionPago = document.getElementById('confirmacion-pago');
        let metodoPago = '';
        
        if (opcionesPago.tarjeta.checked) {
            const numeroTarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
            metodoPago = `Tarjeta terminada en ${numeroTarjeta.slice(-4)}`;
        } else if (opcionesPago.paypal.checked) {
            metodoPago = 'PayPal';
        } else if (opcionesPago.transferencia.checked) {
            metodoPago = 'Transferencia bancaria';
        }
        
        confirmacionPago.innerHTML = `<p>${metodoPago}</p>`;
        
        // Resumen de productos
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        const resumenProductos = document.getElementById('resumen-productos');
        resumenProductos.innerHTML = '';
        
        let subtotal = 0;
        
        carrito.forEach(item => {
            subtotal += item.precio * item.cantidad;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'item-resumen';
            itemElement.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
            `;
            resumenProductos.appendChild(itemElement);
        });
        
        const envio = 5.99;
        const total = subtotal + envio;
        
        document.getElementById('resumen-subtotal').textContent = `S/${subtotal.toFixed(2)}`;
        document.getElementById('resumen-envio').textContent = `S/${envio.toFixed(2)}`;
        document.getElementById('resumen-total').textContent = `S/${total.toFixed(2)}`;
    }

    function finalizarCompra() {
        const aceptoTerminos = document.getElementById('acepto-terminos');
        
        if (!aceptoTerminos.checked) {
            mostrarMensaje('Debes aceptar los términos y condiciones', 'error');
            aceptoTerminos.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // Generar número de pedido
        const idPedido = 'PED-' + Date.now().toString().slice(-6);
        document.getElementById('id-pedido').textContent = idPedido;
        
        // Mostrar email en confirmación
        const email = document.getElementById('email').value;
        document.getElementById('email-confirmacion').textContent = email;
        
        // Cambiar a sección completada
        cambiarSeccion(secciones.confirmacion, secciones.completado, 3);
        
        // Vaciar carrito
        sessionStorage.removeItem('carrito');
        document.dispatchEvent(new CustomEvent('carritoActualizado', { detail: { carrito: [] } }));
        
        // Mostrar mensaje de éxito
        mostrarMensaje(`¡Compra completada! Número de pedido: ${idPedido}`, 'exito');
    }

    function descargarFactura() {
        mostrarMensaje('La factura será enviada a tu correo electrónico', 'info');
    }

    function marcarError(elemento, mensaje) {
        elemento.classList.add('error');
        
        // Crear o actualizar mensaje de error
        let errorElement = elemento.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('mensaje-error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'mensaje-error';
            elemento.parentNode.insertBefore(errorElement, elemento.nextSibling);
        }
        
        errorElement.textContent = mensaje;
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function limpiarError(elemento) {
        elemento.classList.remove('error');
        
        // Eliminar mensaje de error si existe
        const errorElement = elemento.nextElementSibling;
        if (errorElement && errorElement.classList.contains('mensaje-error')) {
            errorElement.remove();
        }
    }

    function mostrarMensaje(texto, tipo = 'info') {
        const mensaje = document.createElement('div');
        mensaje.className = `mensaje-flotante ${tipo}`;
        mensaje.textContent = texto;
        
        // Estilos del mensaje
        mensaje.style.position = 'fixed';
        mensaje.style.top = '20px';
        mensaje.style.right = '20px';
        mensaje.style.padding = '12px 20px';
        mensaje.style.borderRadius = 'var(--borde-radio-pequeno)';
        mensaje.style.zIndex = '1100';
        mensaje.style.opacity = '0';
        mensaje.style.transform = 'translateY(-20px)';
        mensaje.style.transition = 'opacity 0.3s, transform 0.3s';
        mensaje.style.boxShadow = 'var(--sombra-media)';
        
        // Color según tipo
        switch(tipo) {
            case 'exito':
                mensaje.style.backgroundColor = 'var(--color-exito)';
                mensaje.style.color = 'white';
                break;
            case 'error':
                mensaje.style.backgroundColor = 'var(--color-alerta)';
                mensaje.style.color = 'white';
                break;
            default:
                mensaje.style.backgroundColor = 'var(--color-primario)';
                mensaje.style.color = 'white';
        }
        
        document.body.appendChild(mensaje);
        
        // Mostrar animación
        setTimeout(() => {
            mensaje.style.opacity = '1';
            mensaje.style.transform = 'translateY(0)';
        }, 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            mensaje.style.opacity = '0';
            mensaje.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(mensaje);
            }, 300);
        }, 3000);
    }
});