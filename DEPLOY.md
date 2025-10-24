# Guía de Despliegue - Red Alert en Next.js

Este proyecto ahora incluye Command & Conquer: Red Alert jugable en el navegador usando js-dos (sin chrono-log).

## 📁 Estructura del proyecto

```
/
├── app/
│   ├── games/
│   │   └── page.tsx           # Página del juego
│   └── page.tsx                # Página principal
├── components/
│   └── RedAlertGame.tsx        # Componente del juego
└── public/
    └── games/
        ├── README.md           # Instrucciones
        └── redalert.jsdos      # ⚠️ DEBES AGREGARLO TÚ
```

## 🎮 Paso 1: Obtener el archivo del juego

### Opción A: Crear tu propio bundle (RECOMENDADO)

```bash
# 1. Instala js-dos CLI globalmente
npm install -g js-dos

# 2. Consigue los archivos del juego original
# Compra C&C Ultimate Collection en Steam o EA App
# Localiza la carpeta de instalación (ej: C:\Program Files (x86)\Origin Games\...)

# 3. Navega a la carpeta de Red Alert
cd /ruta/a/RedAlert

# 4. Crea el bundle .jsdos
js-dos bundle . -o redalert.jsdos

# 5. Copia el archivo a tu proyecto
cp redalert.jsdos /ruta/a/este/proyecto/public/games/
```

### Opción B: Usar bundles pre-hechos

Descarga de sitios como:
- [DOS Zone](https://dos.zone/)
- [Archive.org](https://archive.org/)

⚠️ **IMPORTANTE:** Solo usa archivos de juegos que poseas legalmente.

### Opción C: URL remota

Si tienes el bundle en otro servidor, edita `components/RedAlertGame.tsx`:

```typescript
// Línea ~54, cambia:
const instance = await dos.run("/games/redalert.jsdos")

// Por:
const instance = await dos.run("https://tu-servidor.com/redalert.jsdos")
```

## 🚀 Paso 2: Desplegar

### Opción 1: Vercel (RECOMENDADO para Next.js)

```bash
# Instala Vercel CLI
npm install -g vercel

# Despliega
vercel --prod
```

O conecta tu repositorio en [vercel.com](https://vercel.com):
1. Import Git Repository
2. Selecciona tu repo
3. Deploy automáticamente

**⚠️ IMPORTANTE para archivos grandes:**

Si tu `redalert.jsdos` es mayor a 50 MB, Vercel puede tener problemas. Soluciones:

1. **Usar URL externa:** Sube el archivo a otro servicio (ej: Cloudflare R2, AWS S3) y usa la URL
2. **Usar Netlify** (ver abajo, tiene límites más altos)

### Opción 2: Netlify

```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Build del proyecto
npm run build

# Despliega
netlify deploy --prod --dir=.next
```

O arrastra la carpeta `.next` a [netlify.com](https://netlify.com)

### Opción 3: GitHub Pages (con adaptador)

GitHub Pages no soporta Next.js server-side por defecto. Necesitas exportar estático:

```bash
# 1. Modifica next.config.ts
# Agrega: output: 'export'

# 2. Build estático
npm run build

# 3. Despliega la carpeta 'out'
```

### Opción 4: Docker + VPS

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build y run
docker build -t redalert-portfolio .
docker run -p 3000:3000 redalert-portfolio
```

## 🗂️ Git LFS para archivos grandes

Si usas Git y el archivo `.jsdos` es grande (>50 MB):

```bash
# 1. Instala Git LFS
git lfs install

# 2. Rastrea archivos .jsdos
git lfs track "*.jsdos"

# 3. Agrega el archivo
git add .gitattributes
git add public/games/redalert.jsdos
git commit -m "Add Red Alert game bundle"
git push
```

## 🧪 Probar localmente

```bash
# 1. Instala dependencias
npm install

# 2. Inicia servidor de desarrollo
npm run dev

# 3. Visita http://localhost:3000/games
```

## 🌐 URLs del proyecto desplegado

Después del despliegue, el juego estará disponible en:

- Vercel: `https://tu-proyecto.vercel.app/games`
- Netlify: `https://tu-proyecto.netlify.app/games`
- Custom domain: `https://tu-dominio.com/games`

## ⚙️ Configuración avanzada

### Cambiar rendimiento de DOSBox

Edita `components/RedAlertGame.tsx` para ajustar opciones de DOSBox:

```typescript
// Actualmente usa configuración por defecto de js-dos
// Para personalizarlo, necesitarías modificar el bundle .jsdos
// o usar la API de configuración de js-dos
```

### Agregar más juegos

1. Crea más archivos `.jsdos` en `public/games/`
2. Modifica `components/RedAlertGame.tsx` para aceptar props
3. Crea páginas nuevas: `app/games/dune2/page.tsx`, etc.

## 🔧 Solución de problemas

### "Error al cargar el juego"

1. Verifica que `public/games/redalert.jsdos` existe
2. Revisa la consola del navegador (F12)
3. Asegúrate de que el archivo no esté corrupto

### "Error al cargar la librería js-dos"

- Verifica tu conexión a internet
- El CDN de jsdelivr podría estar bloqueado
- Considera usar una copia local de js-dos

### Rendimiento lento

1. Usa Chrome o Edge (mejor soporte WebAssembly)
2. Cierra otras pestañas
3. Verifica que el servidor esté cerca geográficamente (CDN)

### No hay sonido

1. Click en la pantalla (navegadores bloquean auto-play)
2. Verifica permisos de audio del navegador
3. Comprueba que el volumen no esté silenciado

## 📊 Métricas de rendimiento

- **Tiempo de carga inicial:** 2-5 segundos (sin el juego)
- **Descarga del juego:** 10-30 segundos (dependiendo del tamaño del .jsdos)
- **Inicio del juego:** 5-15 segundos
- **FPS en el juego:** 30-60 (dependiendo del dispositivo)

## 🔐 Seguridad

- js-dos se ejecuta en un sandbox de WebAssembly
- No se requieren permisos especiales del navegador
- Los archivos del juego se cargan de forma segura

## 📱 Compatibilidad

| Navegador | Versión mínima | Rendimiento |
|-----------|----------------|-------------|
| Chrome    | 90+            | ⭐⭐⭐⭐⭐ |
| Edge      | 90+            | ⭐⭐⭐⭐⭐ |
| Firefox   | 88+            | ⭐⭐⭐⭐   |
| Safari    | 14+            | ⭐⭐⭐     |
| Opera     | 76+            | ⭐⭐⭐⭐   |

**Móviles:** Funciona pero se recomienda tablet o PC.

## 📝 Licencias

- **Tu código (Next.js/React):** MIT (o la que elijas)
- **js-dos:** GPL-2.0
- **Command & Conquer: Red Alert:** © EA/Westwood Studios
  - Solo usa si posees el juego legalmente

## 🎯 Próximos pasos

1. ✅ Agregar archivo `redalert.jsdos`
2. ✅ Probar localmente
3. ✅ Desplegar
4. ⬜ Agregar más juegos DOS
5. ⬜ Crear galería de juegos
6. ⬜ Agregar sistema de guardado en la nube

## 🆘 Soporte

- [js-dos Documentation](https://js-dos.com/)
- [js-dos GitHub Issues](https://github.com/caiiiycuk/js-dos/issues)
- [Next.js Docs](https://nextjs.org/docs)

---

**¡Disfruta jugando Red Alert en tu portafolio! 🎮🚀**
