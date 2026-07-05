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
        
        // Entidades de Cortesía y Cierre
        afirmaciones_cortas: ["ok", "vale", "listo", "entendido", "bueno", "dale", "perfecto", "genial", "super", "claro", "buenisimo"],
        agradecimientos: ["gracias", "agradecido", "excelente", "amable", "pasaste", "agradezco"],
        cierres_conversacion: ["adios", "chao", "hasta", "luego", "despues", "hablamos", "despido", "vemos"],
        
        // Entidades Positivas / Modelos (Para cuando sí saben su equipo)
        marcas_computadores: ["lenovo", "hp", "asus", "dell", "acer", "mac", "macbook", "apple", "msi", "toshiba", "samsung", "huawei", "lg", "ideapad", "pavilion", "rog", "tuf", "vivobook", "thinkpad"],

        // Entidades de Navegación Interna
        nav_inicio: ["inicio", "arriba", "principio", "home", "subir", "encabezado"],
        nav_proceso: ["proceso", "como", "pasos", "trabajan", "metodologia"],
        nav_contacto: ["contacto", "formulario", "correo", "escribirles", "mensaje", "escribir"],

        // Entidades de Identidad de Tauro
        identidad_tauro: ["ti", "tu", "eres", "tauro", "robot", "ia", "inteligencia", "artificial", "bot", "nombre", "haces", "sirves", "funcionas"],

        // Entidades de la Empresa
        identidad_empresa: ["empresa", "compañia", "negocio", "agencia", "marca", "ustedes", "equipo"],

        creadores: ["creador", "creadores", "arquitecto", "arquitectos", "phenix", "antigravity", "quien", "quienes", "invento", "programo", "desarrollo", "creo", "hizo", "dueño", "padre"]
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

        // Identidad de la Empresa (Phenix-Tech) - Prioridad Alta
        intent_empresa: {
            requiresAny: ["identidad_empresa"],
            responses: [
                "El nombre de nuestra empresa es Phenix-Tech. Somos una agencia tecnológica especializada en Desarrollo Web y Servicio Técnico Informático. ¿En cuál de nuestras dos áreas te gustaría que te asesore?",
                "Somos Phenix-Tech. Nos dedicamos a transformar ideas en plataformas digitales y a optimizar o reparar equipos informáticos. ¿Tienes algún proyecto web o equipo que necesite revisión?",
                "Phenix-Tech es nuestro nombre. Somos expertos en soluciones tecnológicas integrales, abarcando tanto software (desarrollo de páginas y apps) como hardware (soporte técnico). ¿De qué te gustaría hablar?"
            ]
        },

        // Identidad propia de Tauro
        intent_identidad: {
            requiresAny: ["identidad_tauro"],
            responses: [
                "Soy TauroIA, un asistente virtual avanzado basado en Inteligencia Artificial. Fui diseñado específicamente para guiarte por esta Landing Page, explicarte nuestros servicios informáticos y facilitar tu contacto con los asesores humanos de Phenix-Tech. ¿Hay algo en particular sobre lo que te gustaría que te oriente?",
                "Mi nombre es TauroIA. Soy el núcleo lógico de esta página web. Mi objetivo es responder tus dudas sobre Desarrollo Web o Servicio Técnico sin que tengas que buscar la información manualmente. ¿De qué te gustaría hablar?",
                "Soy una Inteligencia Artificial integrada en Phenix-Tech. No soy un simple bot de respuestas pregrabadas; analizo tus palabras para entender el contexto y darte la información exacta que necesitas sobre nuestros servicios. ¿Tienes alguna otra pregunta o hay algo más en lo que pueda ayudarte?"
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
                "¡Me especializo en eso! Ofrecemos **Desarrollo de Páginas y Aplicaciones Web**. Hacemos diseño a medida, aplicaciones interactivas, Landing Pages y optimización SEO. Todo 100% responsivo.<br><br><div class='flex gap-2 flex-wrap mt-2'><a href='https://wa.me/56987763010?text=Hola%20Phenix-Tech,%20Tauro%20me%20atendió%20y%20me%20gustaría%20cotizar%20un%20proyecto%20web' target='_blank' class='inline-flex items-center px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2'></i> Cotizar por WhatsApp</a><a href='#contacto' class='inline-flex items-center px-3 py-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-envelope mr-2'></i> Ir al Formulario</a></div>",
                
                "Si buscas tener presencia digital, creamos aplicaciones y páginas web a medida. Desde Landing Pages hermosas (como esta) hasta plataformas complejas. ¿Tienes alguna idea de proyecto en mente?<br><br><div class='flex gap-2 flex-wrap mt-2'><a href='https://wa.me/56987763010?text=Hola%20Phenix-Tech,%20estoy%20interesado%20en%20desarrollar%20una%20página%20o%20app%20web' target='_blank' class='inline-flex items-center px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2'></i> Hablar con un Asesor</a><a href='#contacto' class='inline-flex items-center px-3 py-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-envelope mr-2'></i> Usar Correo</a></div>",
                
                "Transformamos ideas en experiencias web de alto impacto. Creamos páginas web modernas, responsivas y optimizadas para Google (SEO). Si quieres cotizar, escríbenos directamente:<br><br><div class='flex gap-2 flex-wrap mt-2'><a href='https://wa.me/56987763010?text=Hola%20Phenix-Tech,%20quiero%20cotizar%20el%20desarrollo%20de%20un%20sitio%20web' target='_blank' class='inline-flex items-center px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7a4c4c] to-[#AF8282] rounded-lg transition-transform hover:scale-105 shadow-md'><i class='fa-brands fa-whatsapp mr-2'></i> Cotizar por WhatsApp</a><a href='#contacto' class='inline-flex items-center px-3 py-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-envelope mr-2'></i> Formulario de Contacto</a></div>"
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

        // Navegación: Ir al Inicio
        intent_nav_inicio: {
            requiresAny: ["nav_inicio"],
            responses: [
                "¡Por supuesto! Te dejo el atajo para subir al inicio de la página. Recuerda que si necesitas más ayuda o quieres consultarme otra cosa, solo tienes que bajar y aquí estaré esperándote.<br><br><a href='#inicio' class='inline-flex items-center px-4 py-2 mt-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-arrow-up mr-2'></i> Ir al Inicio</a>"
            ]
        },

        // Navegación: Ir a Proceso
        intent_nav_proceso: {
            requiresAny: ["nav_proceso"],
            responses: [
                "Nuestra metodología es transparente y eficiente. Te invito a ver nuestro proceso de trabajo en el enlace de abajo. Si después de leerlo tienes dudas, vuelve a bajar al chat y conversemos.<br><br><a href='#proceso' class='inline-flex items-center px-4 py-2 mt-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-gears mr-2'></i> Ver Proceso de Trabajo</a>"
            ]
        },

        // Navegación: Ir a Contacto
        intent_nav_contacto: {
            requiresAny: ["nav_contacto"],
            responses: [
                "Te llevaré directo a nuestra sección de contacto. Ahí puedes dejarnos un mensaje formal a través del formulario. ¡Cualquier otra duda técnica, baja y pregúntame!<br><br><a href='#contacto' class='inline-flex items-center px-4 py-2 mt-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-envelope mr-2'></i> Ir al Formulario</a>"
            ]
        },

        // Pregunta sobre los creadores (Arquitectos)
        intent_creadores: {
            requiresAny: ["creadores"],
            responses: [
                "Fui ensamblado por los arquitectos de Phenix-Tech. ¡Claro! Te dejaré un enlace directo a su sección. Recuerda que si necesitas seguir charlando después, solo tienes que volver a bajar a este chat y me comentas.<br><br><a href='#creadores' class='inline-flex items-center px-4 py-2 mt-2 text-xs font-bold text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all'><i class='fa-solid fa-users mr-2'></i> Ver Arquitectos de Phenix</a>"
            ]
        },

        // Agradecimientos (Evaluados al final para no anular otras intenciones)
        intent_agradecimiento: {
            requiresAny: ["agradecimientos"],
            responses: [
                "¡De nada! Ha sido un placer ayudarte. Si tienes alguna otra duda técnica o de desarrollo web, aquí estaré. ¡Que tengas un gran día!",
                "¡Para eso estoy! Recuerda que Phenix-Tech siempre está a tu disposición. ¡Vuelve cuando quieras!",
                "¡Con gusto! No dudes en usar los botones de WhatsApp o el Formulario si necesitas que un agente humano tome tu caso."
            ],
            setContext: null
        },

        // Afirmaciones cortas o cierres ("ok", "listo", "chao")
        intent_afirmacion_cierre: {
            requiresAny: ["afirmaciones_cortas", "cierres_conversacion"],
            responses: [
                "¡Perfecto! Quedo a la espera. Recuerda que puedes usar los botones de contacto en cualquier momento.",
                "¡Entendido! Estaré por aquí en modo de espera si necesitas algo más. ¡Saludos!",
                "¡Muy bien! Si decides avanzar, ya sabes dónde contactarnos. ¡Hasta pronto!"
            ],
            setContext: null
        }
    },

    // RESPUESTAS POR DEFECTO (Fallbacks - Manejo de preguntas sin sentido)
    fallbacks: [
        "¡Jaja! Me encantaría ayudarte con eso, pero mis brazos virtuales aún no están programados para esa tarea. Soy mucho mejor desarrollando Páginas Web y reparando Computadores. ¿Te puedo ayudar con algo de tecnología?",
        "Esa es una excelente solicitud... pero escapa a mi programación actual. ¡Aún no domino los secretos del universo! Por ahora soy un experto enfocado exclusivamente en Servicios Web y Soporte Técnico. ¿Te interesa que hablemos de eso?",
        "Mmm... mis circuitos procesaron tu mensaje, pero creo que me faltan los componentes físicos para hacerlo. Mejor pregúntame sobre Creación de Páginas Web o Mantenimiento de Computadores. ¡En esas áreas soy invencible!"
    ]
};
