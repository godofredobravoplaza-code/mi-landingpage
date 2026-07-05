/**
 * TAURO IA - EL CEREBRO (Estructura NLP)
 */

const TauroBrain = {
    config: {
        name: "TauroIA 1.0 Beta",
        version: "1.2.0 (NLP Edition)",
        creator: "Phenix-Tech y Antigravity",
        typingSpeed: 30
    },

    // ENTIDADES: Agrupaciones de palabras clave sinónimas
    // El motor NLP buscará estas palabras exactas (ya normalizadas sin tildes ni mayúsculas)
    entities: {
        saludos: ["hola", "buenas", "hey", "saludos", "que", "tal", "buenos", "dias", "tardes", "noches"],
        
        servicios_generales: ["servicios", "ofrecen", "hacen", "trabajan", "ayuda", "cotizar"],
        
        servicio_tecnico: ["reparacion", "tecnico", "hardware", "mantenimiento", "computador", "computadores", "pc", "pcs", "notebook", "laptop", "formatear", "formatean", "formateo", "arreglan", "soporte", "asesoria"],
        
        // Separamos lentitud general de peticiones explícitas de hardware
        sintoma_lentitud: ["optimizacion", "optimizan", "optimizar", "lento", "lentitud", "acelerar", "mejorar"],
        hardware_especifico_ssd: ["ssd", "solido", "disco", "almacenamiento"],
        accion_reemplazo: ["cambiar", "reemplazar", "instalar", "upgrade", "ampliar", "poner", "quiero"],
        
        // Entidades Negativas (Para contexto)
        respuesta_negativa: ["no", "se", "tengo", "idea", "desconozco", "seguro", "tampoco"],
        
        // Entidades Positivas / Modelos (Para cuando sí saben su equipo)
        marcas_computadores: ["lenovo", "hp", "asus", "dell", "acer", "mac", "macbook", "apple", "msi", "toshiba", "samsung", "huawei", "lg", "ideapad", "pavilion", "rog", "tuf", "vivobook", "thinkpad"],

        servicio_web: ["web", "pagina", "paginas", "aplicacion", "app", "aplicaciones", "landing", "desarrollo", "diseño", "crear", "sitio", "seo", "responsivo"],
        
        creadores: ["creador", "creadores", "arquitecto", "arquitectos", "phenix", "antigravity", "quien", "invento", "programo"]
    },

    // INTENCIONES: Reglas lógicas que combinan entidades
    intents: {
        // Saludos simples
        intent_saludo: {
            requiresAny: ["saludos"],
            responses: [
                "¡Hola! Soy Tauro. ¿Te puedo ayudar con información sobre nuestros servicios web o técnicos?",
                "¡Saludos! Estoy a tu disposición. ¿Qué te gustaría saber de Phenix-Tech?",
                "Sistema en línea. Bienvenido, ¿en qué te puedo asistir hoy?"
            ]
        },

        // Contexto: Usuario SÍ sabe el modelo del PC
        intent_conoce_modelo: {
            requiredContext: "ESPERANDO_MODELO",
            requiresAny: ["marcas_computadores"],
            responses: [
                "¡Genial! Conocer que es de esa marca/modelo nos adelanta mucho el trabajo. Ahora sí, dale clic al botón de abajo para enviarle esta información directamente a un asesor por WhatsApp y cotizar tu SSD de inmediato.<br><br><a href='https://wa.me/56987763010?text=Hola%20Phenix-Tech,%20estoy%20cotizando%20un%20Upgrade%20a%20SSD.%20Ya%20le%20di%20el%20modelo%20a%20Tauro.' target='_blank' class='inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2 text-sm'></i> Enviar modelo por WhatsApp</a>",
                "¡Excelente equipo! El upgrade le vendrá de maravilla. Escríbele a nuestros técnicos por WhatsApp haciendo clic aquí abajo para ver disponibilidad de componentes y darte el presupuesto exacto.<br><br><a href='https://wa.me/56987763010?text=Hola,%20Tauro%20me%20envió%20para%20cotizar%20un%20SSD.' target='_blank' class='inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2 text-sm'></i> Contactar Asesor</a>"
            ],
            setContext: null // Reiniciamos el contexto
        },

        // Contexto: Usuario no sabe el modelo del PC
        intent_desconoce_modelo: {
            requiredContext: "ESPERANDO_MODELO",
            requiresAny: ["respuesta_negativa"],
            responses: [
                "¡No te preocupes! Muchos clientes no lo saben de memoria. Escríbenos por WhatsApp y envíanos una fotografía de tu equipo o de la etiqueta que está por debajo. Nosotros nos encargaremos de identificarlo y darte las opciones de Upgrade.<br><br><a href='https://wa.me/56987763010?text=Hola%20Phenix-Tech,%20Tauro%20me%20sugirió%20enviarles%20una%20foto%20de%20mi%20equipo' target='_blank' class='inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2 text-sm'></i> Enviar foto por WhatsApp</a>",
                
                "Ningún problema. Tómale una foto a tu equipo o a la pegatina inferior y envíanosla por WhatsApp. Con eso, un técnico te dirá de inmediato si podemos ponerle un SSD y cuánto costaría.<br><br><a href='https://wa.me/56987763010?text=Hola,%20les%20escribo%20desde%20el%20chat%20de%20Tauro%20para%20cotizar%20un%20SSD' target='_blank' class='inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2 text-sm'></i> Contactar Asesor</a>"
            ],
            setContext: null // Reinicia el contexto al resolver la duda
        },

        // Consulta ultra-específica: El cliente YA sabe que quiere un SSD (Alta prioridad)
        intent_upgrade_ssd_directo: {
            requiresAll: ["hardware_especifico_ssd", "accion_reemplazo"],
            requiresAny: ["hardware_especifico_ssd"],
            responses: [
                "¡Excelente decisión! El cambio a un disco SSD es la mejor inversión para darle nueva vida a tu equipo. ¿Me podrías indicar la marca o el modelo de tu computador aquí mismo para ir adelantando?",
                "¡Perfecto! Instalar un SSD aumentará la velocidad de tu equipo hasta 10 veces. Hacemos el reemplazo completo y mantenemos tus datos a salvo. ¿De casualidad sabes de qué marca es tu equipo (HP, Lenovo, Asus, etc)?"
            ],
            setContext: "ESPERANDO_MODELO" // El bot ahora está esperando una respuesta al modelo
        },

        // Consulta específica: Computador Lento / Optimización General
        intent_optimizacion_general: {
            requiresAny: ["sintoma_lentitud"],
            responses: [
                "¡Por supuesto! Gran parte de la lentitud en los computadores se debe al almacenamiento. ¿Tu equipo actualmente tiene un disco duro mecánico (HDD) antiguo o ya cuenta con tecnología de estado sólido (SSD)? Si no lo sabes, podemos revisarlo y cotizar un Upgrade a SSD que lo dejará volando. ¿Conoces el modelo de tu PC?",
                "Sí, optimizamos computadores al máximo. Una de las mejores formas de acelerar un equipo lento es instalar un disco SSD. Si aún tienes un disco tradicional, te recomiendo fuertemente el cambio. ¿Sabes el modelo de tu máquina?"
            ],
            setContext: "ESPERANDO_MODELO"
        },

        // Consulta específica: Servicio Técnico / Reparación
        intent_reparacion: {
            requiresAny: ["servicio_tecnico"],
            responses: [
                "¡Claro! En Phenix-Tech ofrecemos **Servicio, Reparación y Asesoría Técnica**. Hacemos diagnóstico preventivo, reparación de hardware, optimización de sistemas y formateos. ¿Tienes algún equipo que necesite atención?",
                "Nuestro servicio técnico tiene más de 20 años de experiencia. Reparamos hardware, optimizamos sistemas y realizamos mantenimiento. Puedes contactarnos por el botón de WhatsApp más arriba para una cotización.",
                "Realizamos formateos, reparación de componentes, mantenciones y asesoría tecnológica integral para tus equipos. ¿Te gustaría que un agente humano te contacte?"
            ]
        },

        // Consulta específica: Desarrollo Web
        intent_web: {
            requiresAny: ["servicio_web"],
            responses: [
                "¡Me especializo en eso! Ofrecemos **Desarrollo de Páginas y Aplicaciones Web**. Hacemos diseño a medida, aplicaciones interactivas, Landing Pages y optimización SEO. Todo 100% responsivo.",
                "Si buscas tener presencia digital, creamos aplicaciones y páginas web a medida. Desde Landing Pages hermosas (como esta) hasta plataformas complejas. ¿Tienes alguna idea de proyecto en mente?",
                "Transformamos ideas en experiencias web de alto impacto. Creamos páginas web modernas, responsivas y optimizadas para Google (SEO). Si quieres cotizar, usa el formulario de contacto más abajo."
            ]
        },

        // Consulta genérica de servicios
        intent_servicios_generales: {
            requiresAny: ["servicios_generales"],
            responses: [
                "En Phenix-Tech nos dividimos en dos grandes áreas: **Desarrollo Web** (páginas y apps) y **Servicio Técnico** (reparación y optimización de hardware). ¿Cuál de los dos te interesa más?",
                "Ofrecemos soluciones digitales e informáticas. Podemos crear tu página web desde cero, o reparar y optimizar tus computadores. ¿Sobre qué área te gustaría saber más?"
            ]
        },

        // Pregunta sobre los creadores
        intent_creadores: {
            requiresAny: ["creadores"],
            responses: [
                "Fui ensamblado por los arquitectos de Phenix-Tech. Phenix puso la visión humana, y Antigravity (mi colega IA) tejió mi núcleo lógico. ¡Somos un equipo imparable!"
            ]
        }
    },

    // FALLBACKS: Cuando el motor NLP no detecta ninguna entidad válida
    fallbacks: [
        "Mi base de datos aún se está expandiendo. ¿Podrías replantear la pregunta usando otras palabras?",
        "Ese sector de mi memoria está en desarrollo. Intenta preguntarme sobre 'desarrollo web' o 'servicio técnico'.",
        "Interesante consulta, pero mi núcleo lógico requiere más contexto. ¿Te refieres a nuestros servicios informáticos?"
    ]
};
