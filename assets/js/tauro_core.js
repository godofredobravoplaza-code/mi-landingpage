/**
 * TAURO IA - EL NÚCLEO (Lógica y Procesamiento)
 */

const TauroCore = {
    isOnline: false,
    userName: null,
    isBooting: false,
    currentContext: null, // Memoria a corto plazo
    
    // Elementos del DOM
    els: {},

    init: function() {
        // Mapear elementos del DOM
        this.els = {
            powerBtn: document.getElementById('tauro-power-btn'),
            powerText: document.getElementById('tauro-power-text'),
            powerLight: document.getElementById('tauro-power-light'),
            overlay: document.getElementById('tauro-overlay'),
            overlayIcon: document.getElementById('tauro-overlay-icon'),
            overlayText: document.getElementById('tauro-overlay-text'),
            display: document.getElementById('tauro-display'),
            input: document.getElementById('tauro-input'),
            sendBtn: document.getElementById('tauro-send-btn')
        };

        if(!this.els.powerBtn) return; // Si no existe la interfaz, no hacer nada

        // Conectar eventos
        this.els.powerBtn.addEventListener('click', () => this.togglePower());
        
        // Conectar botón Enviar y Enter
        this.els.sendBtn.addEventListener('click', () => this.handleUserInput());
        this.els.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita cualquier salto de página accidental
                this.handleUserInput();
            }
        });

        // Botón de conexión desde la tarjeta de presentación
        const connectBtn = document.querySelector('#card-tauro .fa-plug').parentElement;
        if (connectBtn) {
            connectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Hacer scroll suave hasta la terminal
                document.getElementById('tauro-chat').scrollIntoView({ behavior: 'smooth' });
                // Si está apagado, iniciarlo automáticamente
                if (!this.isOnline && !this.isBooting) {
                    setTimeout(() => this.togglePower(), 800);
                }
            });
        }
    },

    togglePower: function() {
        if (this.isBooting) return; // Evitar spam de clics

        if (this.isOnline) {
            this.powerOff();
        } else {
            this.bootSequence();
        }
    },

    bootSequence: function() {
        this.isBooting = true;
        this.els.powerText.innerText = "Booting...";
        this.els.powerLight.className = "w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse transition-colors duration-500";
        
        // Cambiar overlay a estado Booting
        this.els.overlayIcon.className = "fa-solid fa-microchip text-5xl text-yellow-500 mb-6 animate-pulse";
        this.els.overlayText.innerHTML = "[ INICIANDO SECUENCIA DE ARRANQUE ]<br/><span class='text-xs text-zinc-500 mt-2 block'>Cargando núcleos lógicos...</span>";
        
        setTimeout(() => {
            this.els.overlayText.innerHTML = "[ INICIANDO SECUENCIA DE ARRANQUE ]<br/><span class='text-xs text-zinc-500 mt-2 block'>Conectando a Tauro_Brain.js... OK</span>";
        }, 1500);

        setTimeout(() => {
            this.powerOn();
        }, 3000);
    },

    powerOn: function() {
        this.isOnline = true;
        this.isBooting = false;
        
        // Actualizar UI Header
        this.els.powerText.innerText = "Online";
        this.els.powerLight.className = "w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-colors duration-500";
        
        // Actualizar UI Display
        this.els.overlay.classList.add('opacity-0', 'pointer-events-none');
        
        // Habilitar Input
        this.els.input.disabled = false;
        this.els.sendBtn.disabled = false;
        this.els.input.placeholder = "Escribe tu mensaje...";
        this.els.input.focus();

        // Limpiar chat anterior e iniciar
        this.els.display.querySelectorAll('.chat-bubble').forEach(e => e.remove());

        // Mensaje inicial
        if (!this.userName) {
            this.appendTauroMessage("¡Hola! Soy Tauro, la IA residente de Phenix-Tech.");
            setTimeout(() => {
                this.appendTauroMessage("Para personalizar nuestra interacción, ¿podrías indicarme tu nombre?");
            }, 800);
        } else {
            this.appendTauroMessage(`Sistema en línea. Bienvenido de nuevo, ${this.userName}. ¿En qué te ayudo?`);
        }
    },

    powerOff: function() {
        this.isOnline = false;
        
        // Actualizar UI Header
        this.els.powerText.innerText = "Offline";
        this.els.powerLight.className = "w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-colors duration-500";
        
        // Restaurar Overlay
        this.els.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.els.overlayIcon.className = "fa-solid fa-plug-circle-xmark text-5xl text-zinc-800 mb-6 transition-all duration-500";
        this.els.overlayText.innerHTML = "[ SISTEMA FUERA DE LÍNEA ]<br/><span class='text-xs text-zinc-700 mt-2 block'>Esperando energía...</span>";

        // Deshabilitar Input
        this.els.input.disabled = true;
        this.els.sendBtn.disabled = true;
        this.els.input.value = "";
        this.els.input.placeholder = "El sistema está apagado...";
    },

    handleUserInput: function() {
        const text = this.els.input.value.trim();
        if (!text) return;

        // Mostrar mensaje del usuario
        this.appendUserMessage(text);
        this.els.input.value = "";

        // Procesar lógica (simulando retraso de tipeo)
        setTimeout(() => {
            this.processMessage(text);
        }, 500);
    },

    processMessage: function(message) {
        // Fase 1: Pedir nombre
        if (!this.userName) {
            let lowerMsg = message.toLowerCase();
            let saludo = "";
            if (lowerMsg.includes("hola") || lowerMsg.includes("buenas") || lowerMsg.includes("saludos")) {
                saludo = "¡Hola! ";
            }

            let match = lowerMsg.match(/(?:soy|llamo|nombre es|mi nombre es)\s+([a-záéíóúñ]+)/i);
            if (match && match[1]) {
                this.userName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
            } else {
                let words = message.split(' ').filter(w => w.length > 0);
                let lastWord = words[words.length - 1].replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '');
                this.userName = lastWord.charAt(0).toUpperCase() + lastWord.slice(1) || "Invitado";
            }

            this.appendTauroMessage(`${saludo}Entendido. Perfil de invitado configurado para: ${this.userName}.`);
            setTimeout(() => {
                this.appendTauroMessage("He sido actualizado. Ahora puedes consultarme sobre cualquier servicio técnico o de desarrollo web que ofrece Phenix-Tech.");
            }, 1000);
            return;
        }

        // Fase 2: Enviar mensaje a n8n Webhook
        const webhookUrl = 'http://localhost:5678/webhook/tauro-chat';
        
        // Crear indicador de escribiendo
        const typingId = 'typing-net-' + Date.now();
        const typingHtml = `
        <div id="${typingId}" class="chat-bubble flex flex-col gap-1 items-start max-w-[85%] mt-2">
            <span class="text-[10px] text-[#AF8282] tracking-widest ml-1 font-bold">TAURO_IA <i class="fa-solid fa-microchip ml-1"></i></span>
            <div class="bg-white/5 border border-white/10 text-zinc-300 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-[46px]">
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
        </div>`;
        this.els.display.insertAdjacentHTML('beforeend', typingHtml);
        this.scrollToBottom();

        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, user: this.userName })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en red');
            return response.json();
        })
        .then(data => {
            document.getElementById(typingId)?.remove();
            let replyText = data.output || data.text || data.message || "Recibido.";
            this.appendTauroMessage(replyText);
        })
        .catch(error => {
            console.error('Error conectando a n8n:', error);
            document.getElementById(typingId)?.remove();
            this.appendTauroMessage("Lo siento, he perdido la conexión con mi núcleo central (n8n no responde). Asegúrate de que el servidor esté activo.");
        });
    },

    appendUserMessage: function(text) {
        const html = `
        <div class="chat-bubble flex flex-col gap-1 items-end self-end max-w-[85%] mt-2">
            <span class="text-[10px] text-zinc-500 tracking-widest mr-1 uppercase">${this.userName || 'GUEST'}</span>
            <div class="bg-[#AF8282]/20 border border-[#AF8282]/50 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-[0_0_15px_rgba(175,130,130,0.1)]">
                ${text}
            </div>
        </div>`;
        this.els.display.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    appendTauroMessage: function(text) {
        // Añadir indicador de "escribiendo"
        const typingId = 'typing-' + Date.now();
        const typingHtml = `
        <div id="${typingId}" class="chat-bubble flex flex-col gap-1 items-start max-w-[85%] mt-2">
            <span class="text-[10px] text-[#AF8282] tracking-widest ml-1 font-bold">TAURO_IA <i class="fa-solid fa-microchip ml-1"></i></span>
            <div class="bg-white/5 border border-white/10 text-zinc-300 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-[46px]">
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-[#AF8282] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
        </div>`;
        
        this.els.display.insertAdjacentHTML('beforeend', typingHtml);
        this.scrollToBottom();

        // Calcular tiempo de simulación de escritura basado en longitud
        const delay = Math.min(Math.max(text.length * TauroBrain.config.typingSpeed, 800), 3000);

        setTimeout(() => {
            const typingIndicator = document.getElementById(typingId);
            if (typingIndicator) {
                typingIndicator.outerHTML = `
                <div class="chat-bubble flex flex-col gap-1 items-start max-w-[85%] mt-2 animate-[fadeIn_0.3s_ease-out]">
                    <span class="text-[10px] text-[#AF8282] tracking-widest ml-1 font-bold">TAURO_IA <i class="fa-solid fa-microchip ml-1"></i></span>
                    <div class="bg-white/5 border border-white/10 text-zinc-300 px-4 py-3 rounded-2xl rounded-tl-sm">
                        ${text}
                    </div>
                </div>`;
                this.scrollToBottom();
            }
        }, delay);
    },

    scrollToBottom: function() {
        this.els.display.scrollTop = this.els.display.scrollHeight;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TauroCore.init();
});
