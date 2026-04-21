# 🧮 Tablas de Multiplicar - Aplicación Interactiva

Una aplicación web educativa construida con **React** y **Vite** para practicar tablas de multiplicar de forma interactiva y divertida, con retroalimentación motivadora para el estudiante.

## 📋 Descripción del Proyecto

Esta aplicación permite a los usuarios practicar tablas de multiplicar del 1 al 10 mediante una interfaz interactiva. El sistema genera preguntas aleatorias, proporciona retroalimentación instantánea y calcula estadísticas de desempeño al finalizar.

---

## 🏗️ Arquitectura y Flujo de la Aplicación

### Estados del Juego (Game States)

La aplicación maneja tres estados principales:

1. **`selection`** - Pantalla de selección de tablas
2. **`playing`** - Pantalla de preguntas
3. **`results`** - Pantalla de resultados finales

```
selection → playing → results → selection (restart)
```

### Estructura de Componentes

```
src/
├── App.jsx                    # Componente principal (maneja la lógica del juego)
├── components/
│   ├── TableSelector.jsx      # Selector de tablas (1-10)
│   ├── Question.jsx           # Formulario de pregunta
│   ├── Feedback.jsx           # Retroalimentación después de cada respuesta
│   └── Results.jsx            # Pantalla de resultados finales
├── utils/
│   ├── shuffle.js             # Algoritmos de barajado (Fisher-Yates)
│   └── messages.js            # Base de mensajes motivadores
└── App.css                    # Estilos principales
```

---

## 🔄 Flujo Lógico Detallado

### 1️⃣ Fase: Selección de Tablas (`TableSelector.jsx`)

**Objetivo:** El usuario selecciona qué tablas de multiplicar desea practicar.

**Características:**
- Grid de 10 botones (tablas del 1 al 10)
- Cada botón incluye un icono de animal (🐭, 🐱, 🐶, etc.) como indicador visual
- Validación: al menos una tabla debe estar seleccionada para iniciar
- Los números se ordenan automáticamente antes de pasar al juego

**Flujo:**
```javascript
selectedTables: [] → toggleTable(n) → [n] → handleStart() → App (onStart)
```

---

### 2️⃣ Fase: Generación de Preguntas (en `App.jsx`)

**Objetivo:** Crear todas las preguntas que el usuario responderá.

**Algoritmo:**
```javascript
1. Para cada tabla seleccionada:
   - Generar números del 1 al 10 en ORDEN ALEATORIO (Fisher-Yates)
   - Por cada número, crear una pregunta:
     {
       table: número,
       multiplier: número barajado,
       id: "tabla-multiplicador"
     }

2. Resultado: Array de objetos Question
   Ejemplo si selecciona tablas 3 y 5:
   - 3×7, 3×2, 3×9, ... (10 preguntas)
   - 5×1, 5×8, 5×4, ... (10 preguntas)
   Total: 20 preguntas
```

**Implementación:**
```javascript
const handleStartGame = (tables) => {
  const allQuestions = [];
  tables.forEach(table => {
    const shuffledNumbers = generateRandomNumbers(); // [7,2,9,...]
    shuffledNumbers.forEach(multiplier => {
      allQuestions.push({ table, multiplier, id: `${table}-${multiplier}` });
    });
  });
  setQuestions(allQuestions);
  setGameState('playing');
};
```

---

### 3️⃣ Fase: Presentación de Preguntas (`Question.jsx`)

**Objetivo:** Mostrar la pregunta y capturar la respuesta del usuario.

**Componentes de la pantalla:**
- **Barra de progreso:** Indica qué pregunta es de cuántas
- **Ecuación visual:** Muestra `[tabla] × [multiplicador] = ?`
- **Campo de entrada:** Input numérico con validación
- **Botón de envío:** Valida y envía la respuesta

**Validación:**
- Verifica que sea un número válido
- Si falla, muestra error y permite reintentar
- Si es válido, calcula si la respuesta es correcta

**Fórmula de verificación:**
```javascript
const correctAnswer = table * multiplier;
const isCorrect = userAnswer === correctAnswer;
onAnswer(isCorrect); // Envía booleano al App
```

---

### 4️⃣ Fase: Retroalimentación (`Feedback.jsx`)

**Objetivo:** Proporcionar feedback motivador inmediato.

**Características:**
- **Mensajes dinámicos:** Se selecciona aleatoriamente de un pool de mensajes
- **Diferenciación:** Mensajes diferentes para respuestas correctas e incorrectas
- **Auto-desaparición:** Desaparece después de 3 segundos con efecto fade-out
- **Interactividad:** Botón "Siguiente" para continuar manualmente

**Selección de mensaje:**
```javascript
if (isCorrect) {
  message = getRandomElement(correctMessages);
  // Ej: "🎉 ¡Brillante! Tu inteligencia me sorprende"
} else {
  message = getRandomElement(incorrectMessages);
  // Ej: "🤔 ¡Ups! Por poco, inténtalo de nuevo"
}
```

**Pool de mensajes:**
- **Correctas:** 12 mensajes positivos y motivadores
- **Incorrectas:** 12 mensajes de ánimo que fomentan el reintento
- Ver `src/utils/messages.js` para la lista completa

---

### 5️⃣ Fase: Cálculo de Resultados (en `App.jsx`)

**Objetivo:** Calcular estadísticas y generar mensaje final.

**Algoritmo:**
```javascript
1. Contar respuestas correctas: answers.filter(a => a === true).length
2. Calcular porcentaje: (correctas / total) × 100
3. Clasificar desempeño:
   - Si porcentaje ≥ 75% → Excelente (mensajes positivos)
   - Si porcentaje < 75%  → Necesita práctica (mensajes de ánimo)
4. Seleccionar mensaje final aleatorio
```

**Implementación:**
```javascript
const correctCount = answers.filter(a => a === true).length;
const percentage = Math.round((correctCount / questions.length) * 100);

if (percentage >= 75) {
  setFinalMessage(getRandomElement(goodResultMessages));
} else {
  setFinalMessage(getRandomElement(keepPracticingMessages));
}
```

---

### 6️⃣ Fase: Pantalla de Resultados (`Results.jsx`)

**Objetivo:** Mostrar un resumen visual y estadístico del desempeño.

**Elementos mostrados:**
1. **Animación de celebración/estudio:**
   - Si ≥75%: 😄 (cara feliz)
   - Si <75%: 📚 con animación de 📖 (estudiando)

2. **Título condicional:**
   - "¡Excelente Trabajo!" si ≥75%
   - "¡Buen Intento!" si <75%

3. **Estadísticas en grid:**
   - Porcentaje de acierto
   - Porcentaje de error
   - Total de respuestas correctas
   - Total de respuestas incorrectas

4. **Círculo de progreso SVG:**
   - Visualización circular del porcentaje
   - Color verde si ≥75%, naranja si <75%
   - Animación suave de stroke-dasharray

5. **Botón para reiniciar:** Regresa a la selección de tablas

---

## 🎲 Algoritmo de Barajado (Fisher-Yates)

El barajado garantiza que las preguntas se presenten en orden aleatorio y sin repeticiones.

**Implementación en `src/utils/shuffle.js`:**
```javascript
export const fisherYatesShuffle = (array) => {
  const arr = [...array];
  // Iterar desde el final al inicio
  for (let i = arr.length - 1; i > 0; i--) {
    // Generar índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Intercambiar elementos (destructuring)
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
```

**Ventajas:**
- ✅ Complejidad O(n) - muy eficiente
- ✅ Garantiza distribución uniforme
- ✅ No modifica array original (copia con `[...array]`)

**Ejemplo:**
```
Entrada: [1, 2, 3, 4, 5]
Salida:  [3, 5, 1, 4, 2]  (cada ejecución diferente)
```

---

## 📊 Flujo de Datos

```
App (Estado Principal)
│
├── selectedTables: array de números seleccionados
├── questions: array de objetos { table, multiplier, id }
├── currentQuestionIndex: índice de pregunta actual
├── answers: array de booleanos [true, false, true, ...]
├── gameState: 'selection' | 'playing' | 'results'
├── showFeedback: boolean
├── feedbackMessage: string (mensaje motivador)
├── isCorrect: boolean (para renderizar Feedback)
└── finalMessage: string (mensaje de resultados finales)
```

---

## 🎨 Características de UX

1. **Responsividad:** Grid de tablas se adapta a diferentes tamaños
2. **Accesibilidad:** Inputs con autoFocus, validación clara
3. **Retroalimentación visual:**
   - Barra de progreso
   - Indicadores emoji en botones
   - Animaciones suaves
   - Colores diferenciados (verde para éxito, naranja para mejora)
4. **Motivación constante:** Mensajes contextuales y aleatorios en cada paso

---

## 🚀 Cómo Usar

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
La aplicación se abre en `http://localhost:5173`

### Build para producción
```bash
npm run build
```

### Preview de build
```bash
npm run preview
```

---

## 📦 Dependencias

- **React 19.2.5** - Librería UI
- **React-DOM 19.2.5** - Renderizado en navegador
- **Vite 8.0.8** - Empaquetador y servidor de desarrollo
- **@vitejs/plugin-react 6.0.1** - Plugin React para Vite

---

## 🎯 Resumen de la Lógica

| Componente | Responsabilidad |
|-----------|-----------------|
| `App.jsx` | Orquesta todo el flujo, maneja estados |
| `TableSelector` | Permite seleccionar tablas |
| `Question` | Muestra pregunta y captura respuesta |
| `Feedback` | Proporciona feedback motivador |
| `Results` | Muestra estadísticas y resumen |
| `shuffle.js` | Genera orden aleatorio de preguntas |
| `messages.js` | Banco de mensajes motivadores |

---

## 📝 Notas Técnicas

- El estado es centralizado en `App.jsx` usando `useState`
- Los componentes son funcionales (React Hooks)
- Los mensajes se seleccionan aleatoriamente para mayor variabilidad
- El feedback auto-desaparece pero es clickeable
- Los porcentajes se redondean para claridad
- Las preguntas se generan al iniciar, no dinámicamente

---

¡Desarrollado para aprender y practicar tablas de multiplicar de forma divertida! 🎓✨
