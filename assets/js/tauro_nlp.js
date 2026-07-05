/**
 * TAURO IA - MOTOR NLP (Procesamiento de Lenguaje Natural)
 * Se encarga de limpiar el texto (normalización), tokenizar y cruzar
 * la entrada del usuario con las entidades e intenciones del cerebro.
 */

const TauroNLP = {
    
    // 1. Pipeline de Normalización
    normalize: function(text) {
        if (!text) return "";
        return text
            .toLowerCase() // Convertir a minúsculas
            .normalize("NFD") // Separar acentos de las letras
            .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace(/[^\w\s]|_/g, "") // Eliminar signos de puntuación (¿?¡!.,)
            .replace(/\s+/g, " ") // Quitar espacios extra
            .trim();
    },

    // 2. Tokenización (Dividir frase en palabras)
    tokenize: function(normalizedText) {
        return normalizedText.split(" ");
    },

    // 3. Extracción de Entidades
    // Devuelve un objeto con las entidades detectadas y el número de coincidencias
    extractEntities: function(tokens) {
        let detectedEntities = {};
        
        for (let entityName in TauroBrain.entities) {
            let entityWords = TauroBrain.entities[entityName];
            let matches = 0;
            
            for (let token of tokens) {
                // Validación exacta para evitar que "sol" coincida con "soldado"
                if (entityWords.includes(token)) {
                    matches++;
                }
            }
            
            if (matches > 0) {
                detectedEntities[entityName] = matches;
            }
        }
        return detectedEntities;
    },

    // 4. Clasificador de Intenciones (Match Engine con Memoria de Contexto)
    process: function(rawText, currentContext = null) {
        const normalized = this.normalize(rawText);
        const tokens = this.tokenize(normalized);
        const entities = this.extractEntities(tokens);
        
        console.log("[NLP] Texto normalizado:", normalized);
        console.log("[NLP] Entidades detectadas:", entities);
        console.log("[NLP] Contexto actual:", currentContext);

        let bestIntent = null;
        let maxScore = 0;

        // Evaluar todas las intenciones definidas en el cerebro
        for (let intentName in TauroBrain.intents) {
            let intent = TauroBrain.intents[intentName];
            let score = 0;

            // REGLA ESTRICTA DE CONTEXTO:
            // Si la intención requiere un contexto específico y no estamos en él, la ignoramos.
            if (intent.requiredContext && intent.requiredContext !== currentContext) {
                continue; 
            }

            // Bono masivo si la intención coincide con el contexto actual
            if (intent.requiredContext && intent.requiredContext === currentContext) {
                score += 20; 
            }

            // Verificar si cumple con las entidades requeridas (Any of)
            if (intent.requiresAny) {
                for (let reqEntity of intent.requiresAny) {
                    if (entities[reqEntity]) {
                        score += entities[reqEntity];
                    }
                }
            }

            // Bono por combinación de entidades (All of)
            if (intent.requiresAll) {
                let hasAll = true;
                for (let reqEntity of intent.requiresAll) {
                    if (!entities[reqEntity]) {
                        hasAll = false;
                        break;
                    }
                }
                if (hasAll) score += 5; // Puntaje alto si cumple la regla estricta
            }

            // Asignar intención ganadora si supera el puntaje máximo
            // Si la intención es puramente de contexto (score >= 20) y tiene las entidades, ganará seguro
            if (score > maxScore && score > 0) {
                // Verificar que tenga al menos 1 match de entidades a menos que el bono de contexto baste (requiere las entidades ANY)
                let hasAnyEntityMatch = false;
                if (intent.requiresAny) {
                    for (let reqEntity of intent.requiresAny) {
                         if (entities[reqEntity]) hasAnyEntityMatch = true;
                    }
                } else {
                    hasAnyEntityMatch = true;
                }

                if (hasAnyEntityMatch) {
                    maxScore = score;
                    bestIntent = intent;
                }
            }
        }

        // Devolver objeto con respuesta de la intención ganadora y el nuevo contexto
        if (bestIntent) {
            let randomIndex = Math.floor(Math.random() * bestIntent.responses.length);
            return {
                text: bestIntent.responses[randomIndex],
                setContext: bestIntent.setContext !== undefined ? bestIntent.setContext : currentContext
            };
        } else {
            let randomFallback = Math.floor(Math.random() * TauroBrain.fallbacks.length);
            return {
                text: TauroBrain.fallbacks[randomFallback],
                setContext: currentContext // Mantiene el contexto actual
            };
        }
    }
};
