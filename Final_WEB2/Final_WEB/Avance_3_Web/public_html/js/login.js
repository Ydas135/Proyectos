document.addEventListener("DOMContentLoaded", function() {
    // Redirigir si ya está logueado
    if(localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "index.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            
            // Validación básica
            if (!email || !password) {
                showMessage("Por favor completa todos los campos", "error");
                return;
            }
            
            // Verificar credenciales
            try {
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    showMessage("¡Inicio de sesión exitoso!", "success");
                    
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    showMessage("Correo o contraseña incorrectos", "error");
                }
            } catch (error) {
                console.error("Error:", error);
                showMessage("Error al iniciar sesión", "error");
            }
        });
    }
    
    function showMessage(text, type) {
        const oldMessage = document.querySelector(".login-message");
        if (oldMessage) oldMessage.remove();
        
        const message = document.createElement("div");
        message.className = `login-message ${type}`;
        message.textContent = text;
        
        document.querySelector(".login-container").prepend(message);
        
        setTimeout(() => {
            message.style.opacity = "0";
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
});