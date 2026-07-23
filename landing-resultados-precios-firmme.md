# Página de Resultado + Precios — FirmMe (post-quiz)

Estructura completa, adaptada del funnel de "Simple", usando solo assets que ya existen. Este spec
reemplaza y expande los pasos 22-25 que ya estaban armados.

---

## 1. Comparación "Ahora vs. Tu objetivo"

Tarjeta con fondo cream, dos columnas:

**Columna izquierda — "Ahora":** `avatar-antes-estres.jpeg`
- Etiqueta debajo: "Nivel de equilibrio" con barra baja (1 de 5)
- Etiqueta debajo: "Confianza al moverte" con barra baja (1 de 5)

**Columna derecha — "Tu objetivo":** `avatar-despues-calma.jpeg`
- "Nivel de equilibrio" con barra alta (4 de 5)
- "Confianza al moverte" con barra alta (4 de 5)

**Nota pequeña debajo (obligatoria, como en la referencia):** "Los resultados varían según cada persona y constancia en la práctica."

---

## 2. Headline + resumen del plan

**Headline:** "¡Tu plan de Tai Chi en Silla está listo!"

**Fila de datos** (usando lo que ya capturó el quiz):
- Meta: [metaIdeal seleccionada]
- Nivel: [Principiante/Intermedio, según respuesta previa del quiz]

---

## 3. Planes de precio (PLACEHOLDER — ajustar valores reales antes de publicar)

| Plan | Precio | Equivalente/día | Etiqueta |
|---|---|---|---|
| Prueba de 7 días | $9.99 (placeholder, confirmar) | ~$1.43/día | — |
| Plan de 4 semanas | **$16.99** (confirmado) | ~$0.61/día | EL MÁS POPULAR (destacado en sage green) |
| Plan de 12 semanas | $37.00 (placeholder, confirmar) | ~$0.44/día | Mejor valor |

Selección única con radio buttons, plan de 4 semanas preseleccionado. Debajo: link a "Garantía de
reembolso" (ver sección 6). CTA: "Quiero mi plan".

---

## 4. Mockup del programa (usar avatar-hero-cloud-hands.jpeg, sin generar nada nuevo)

Frame de teléfono en CSS (no imagen), con `avatar-hero-cloud-hands.jpeg` dentro simulando la pantalla
de "Tu plan está listo". Debajo, tabla simple de la primera semana:

Semana 1 — Día 1 a 7, alternando "8 min · Equilibrio", "Descanso", "6 min · Movilidad", etc.
(contenido ilustrativo del programa, ajustar cuando el programa real esté definido)

**Nota:** omití los badges de "4,8 de 5 · App Store · Google Play" de la referencia — no los usamos
hasta que existan de verdad.

---

## 5. Checklist de ventajas

- Un nuevo plan personalizado cada semana
- Rutinas guiadas con video paso a paso
- Tai Chi en silla, sin impacto en tus articulaciones
- Pensado para mujeres 40+
- Acompañamiento en cada etapa de tu progreso

---

## 6. Testimonios (texto, sin foto — marcar como ilustrativos hasta tener reales)

> "Empecé con miedo de no poder seguirle el ritmo a nada. 15 minutos desde mi silla y ya me siento
> distinta." — Marca como testimonio ilustrativo en el código (comentario), reemplazar por reales en
> cuanto existan.

> "Lo que más me gustó es que no me deja agotada como el gimnasio. Termino con más energía de la que
> empecé."

*(2-3 testimonios cortos más en el mismo tono — evitar cifras específicas de resultado ya que aún no
son reales)*

---

## 7. Sección "Resultados" — OMITIR por ahora

No incluir fotos de "antes/después" de clientas con nombre y resultado numérico hasta tener casos
reales y su consentimiento. En su lugar, usar aquí una repetición breve del dato de Stanford (58%
menos caídas) como cierre de confianza, ya que ese sí es un dato verificable.

---

## 8. Garantía

Usa el mismo término que ya está en el paso 25 del quiz actual (7 días, sin preguntas) para no tener
inconsistencia entre pantallas — si prefieres cambiarlo a 30 días como en la referencia, dímelo y lo
actualizamos en ambos lugares a la vez.

**Badge:** ícono de escudo (ya lo tienes codeado del paso 25)
**Headline:** "Tu satisfacción está garantizada"
**Texto:** "Si por cualquier motivo no estás satisfecha con el programa, te devolvemos el dinero
completo — sin trámites ni excusas."
**Métodos de pago:** iconos de Visa/Mastercard/PayPal (no incluir Apple Pay/Google Pay si no están
habilitados realmente en el checkout)
