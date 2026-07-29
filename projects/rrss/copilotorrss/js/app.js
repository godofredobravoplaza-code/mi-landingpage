document.addEventListener('DOMContentLoaded', () => {
    // Elements - Settings
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const inputGroqKey = document.getElementById('groq-key');
    const inputMetaPageId = document.getElementById('meta-page-id');
    const inputMetaToken = document.getElementById('meta-token');

    // Load settings from localStorage
    function loadSettings() {
        inputGroqKey.value = localStorage.getItem('phenix_groq_key') || '';
        inputMetaPageId.value = localStorage.getItem('phenix_meta_page_id') || '61592532034803';
        inputMetaToken.value = localStorage.getItem('phenix_meta_token') || '';
    }
    loadSettings();

    // Settings Modal Listeners
    btnSettings.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    btnCloseSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('phenix_groq_key', inputGroqKey.value.trim());
        localStorage.setItem('phenix_meta_page_id', inputMetaPageId.value.trim());
        localStorage.setItem('phenix_meta_token', inputMetaToken.value.trim());
        
        settingsModal.classList.add('hidden');
        alert("Credenciales guardadas localmente de forma segura.");
    });

    // Elements - Col 1
    const topicInput = document.getElementById('topic-input');
    const btnSuggest = document.getElementById('btn-suggest');
    const btnGenerateText = document.getElementById('btn-generate-text');

    // Elements - Col 2
    const textLoading = document.getElementById('text-loading');
    const textContent = document.getElementById('text-content');
    const textEmpty = document.getElementById('text-empty');
    const copyEditor = document.getElementById('copy-editor');

    // Elements - Col 3
    const designEmpty = document.getElementById('design-empty');
    const designPreview = document.getElementById('design-preview');
    const btnGenerateDesign = document.getElementById('btn-generate-design');
    const mockTitle = document.getElementById('mock-title');

    // Elements - Footer
    const btnPublishFb = document.getElementById('btn-publish-fb');
    const btnPublishIg = document.getElementById('btn-publish-ig');

    // MOCK DATA (Simulando respuesta de OpenAI)
    const mockSuggestions = [
        "La Inteligencia Artificial está revolucionando la atención al cliente en 2026. #IA #Tech",
        "Por qué tu negocio necesita una automatización de RRSS para sobrevivir este año. #Automatizacion #Marketing",
        "El futuro del desarrollo web: Interfaces generativas y personalización en tiempo real. #WebDev #Futuro"
    ];

    const mockCopy = `🚀 ¡Revolución en camino! \n\nEn 2026, si no estás automatizando, te estás quedando atrás. La Inteligencia Artificial ya no es el futuro, es el AHORA.\n\nEn PhenixDev hemos integrado agentes autónomos que redactan, diseñan y publican por nosotros. ¿El resultado? Más tiempo para innovar y cero estrés. 🧠⚡\n\n¿Tu empresa ya dio el salto a la IA?\n\n#InteligenciaArtificial #PhenixDev #Tech #Automatizacion #Futuro`;

    // 1. Sugerir Tema
    btnSuggest.addEventListener('click', () => {
        const randomTopic = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
        topicInput.value = randomTopic;
    });

    // 2. Generar Texto (Real - Groq)
    btnGenerateText.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert("Escribe un tema primero.");
            return;
        }

        const apiKey = localStorage.getItem('phenix_groq_key');
        if (!apiKey) {
            alert("Falta la API Key de Groq. Ve a Configuración (arriba a la derecha) y pégala.");
            return;
        }

        // Show loading state
        textEmpty.classList.add('hidden');
        textContent.classList.add('hidden');
        textLoading.classList.remove('hidden');
        textLoading.classList.add('flex');
        
        // Col 2 border pulse
        const col2Border = document.querySelector('.border-t-fuchsia-500');
        col2Border.classList.add('agent-pulse');

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "Eres el Community Manager estrella de PhenixDev (una agencia de desarrollo web e IA). Tu misión es escribir posteos para Instagram/Facebook que sean atractivos, modernos, y con estilo Silicon Valley. Usa emojis, sé conciso y cierra con 3-5 hashtags relevantes (incluyendo siempre #PhenixDev). No pongas comillas al principio ni al final del post."
                        },
                        {
                            role: "user",
                            content: `Escribe un post interesante sobre el siguiente tema: ${topic}`
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const generatedText = data.choices[0].message.content;

            // Mostrar el texto
            textLoading.classList.remove('flex');
            textLoading.classList.add('hidden');
            
            textContent.classList.remove('hidden');
            copyEditor.value = generatedText;
            
            col2Border.classList.remove('agent-pulse');

            // Enable Design button
            btnGenerateDesign.disabled = false;
            btnGenerateDesign.classList.remove('bg-slate-700', 'text-slate-400', 'cursor-not-allowed');
            btnGenerateDesign.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white', 'shadow-[0_0_15px_rgba(16,185,129,0.4)]');

        } catch (error) {
            console.error("Error al llamar a Groq:", error);
            alert("Error al conectar con Groq (Llama 3): " + error.message);
            
            // Restore UI on error
            textLoading.classList.remove('flex');
            textLoading.classList.add('hidden');
            textEmpty.classList.remove('hidden');
            col2Border.classList.remove('agent-pulse');
        }
    });

    // 3. Generar Diseño (Simulado)
    btnGenerateDesign.addEventListener('click', () => {
        // Hide empty state
        designEmpty.classList.add('hidden');
        
        // Show preview container but make it pulse
        designPreview.classList.remove('hidden');
        designPreview.classList.add('opacity-50');
        
        // Col 3 border pulse
        document.querySelector('.border-t-emerald-500').classList.add('agent-pulse');
        
        // Simulate API delay
        setTimeout(() => {
            designPreview.classList.remove('opacity-50');
            document.querySelector('.border-t-emerald-500').classList.remove('agent-pulse');
            
            // Set dynamic title based on input
            const inputWords = topicInput.value.split(' ').slice(0, 5).join(' ');
            mockTitle.textContent = inputWords.toUpperCase() + "...";

            // Enable Publish buttons
            enablePublishButtons();
        }, 2500);
    });

    function enablePublishButtons() {
        // Facebook
        btnPublishFb.disabled = false;
        btnPublishFb.className = "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]";
        
        // Instagram
        btnPublishIg.disabled = false;
        btnPublishIg.className = "flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]";
    }

    // Publish actions (Mock)
    btnPublishFb.addEventListener('click', () => alert('¡Simulación de publicación en Facebook exitosa!'));
    btnPublishIg.addEventListener('click', () => alert('¡Simulación de publicación en Instagram exitosa!'));
});
