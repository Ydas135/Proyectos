document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const telefono = document.getElementById('telefono').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Validaciones básicas
            if (!nombre || !apellido || !email || !password || !confirmPassword) {
                showMessage('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            if (!terms) {
                showMessage('Debes aceptar los términos y condiciones', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (password.length < 6) { // Reduje a 6 para hacerlo más fácil durante pruebas
                showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Verificar si el usuario ya existe
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.email === email);
            
            if (userExists) {
                showMessage('Este correo electrónico ya está registrado', 'error');
                return;
            }
            
            // Crear objeto de usuario
            const newUser = {
                nombre,
                apellido,
                email,
                password, // En un proyecto real debería estar encriptada
                telefono: telefono || 'No proporcionado',
                fechaRegistro: new Date().toISOString()
            };
            
            // Guardar usuario
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Iniciar sesión automáticamente
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            showMessage('¡Registro exitoso! Redireccionando...', 'success');
            
            // Redireccionar después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    function showMessage(text, type) {
        // Eliminar mensajes anteriores
        const oldMessage = document.querySelector('.mensaje-flotante');
        if (oldMessage) oldMessage.remove();
        
        // Crear elemento de mensaje
        const message = document.createElement('div');
        message.className = `mensaje-flotante ${type}`;
        message.textContent = text;
        
        // Añadir al formulario
        registerForm.parentNode.insertBefore(message, registerForm);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
});