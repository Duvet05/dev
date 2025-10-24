# ✅ Red Alert está listo para jugar!

El juego Command & Conquer: Red Alert ya está integrado en tu portafolio Next.js usando WebAssembly (js-dos).

## 🎮 Cómo jugar

### Localmente

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abre tu navegador en:**
   ```
   http://localhost:3000/games
   ```

3. **Espera a que cargue** (puede tomar 30-60 segundos la primera vez debido al tamaño del bundle de 337MB)

4. **¡Disfruta el juego!**

### En producción

Visita: `https://tu-dominio.com/games`

## 📁 Archivos agregados

```
/
├── app/
│   └── games/
│       └── page.tsx                    # Página del juego
├── components/
│   └── RedAlertGame.tsx                # Componente React del juego
├── public/
│   └── games/
│       ├── redalert.jsdos              # Bundle del juego (337MB) ✅
│       └── README.md                    # Instrucciones
├── DEPLOY.md                            # Guía de despliegue completa
└── REDALERT_SETUP.md                   # Este archivo
```

## 🎮 Controles del juego

| Acción | Control |
|--------|---------|
| Seleccionar unidades | Click izquierdo |
| Dar órdenes | Click derecho |
| Menú del juego | ESC |
| Pantalla completa | Botón "FULLSCREEN" o F11 |

## 🚀 Desplegar a producción

### ⚠️ IMPORTANTE: Archivos grandes

El archivo `redalert.jsdos` pesa **337MB**. Para desplegar, tienes estas opciones:

### Opción 1: Vercel con Git LFS (RECOMENDADO)

```bash
# 1. Instala Git LFS
git lfs install

# 2. Rastrea archivos .jsdos
git lfs track "*.jsdos"

# 3. Agrega archivos
git add .gitattributes
git add public/games/redalert.jsdos
git commit -m "Add Red Alert game with Git LFS"
git push

# 4. Despliega a Vercel
vercel --prod
```

**Nota:** Git LFS en GitHub es gratis hasta 1GB de almacenamiento y 1GB de ancho de banda/mes. Para más, considera la Opción 2.

### Opción 2: CDN externa (mejor rendimiento)

Sube `redalert.jsdos` a un CDN (Cloudflare R2, AWS S3, Bunny CDN, etc.) y modifica:

**Edita `components/RedAlertGame.tsx`:**

```typescript
// Línea ~54, cambia:
const instance = await dos.run("/games/redalert.jsdos")

// Por:
const instance = await dos.run("https://tu-cdn.com/redalert.jsdos")
```

**Servicios CDN gratuitos/baratos:**
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - 10GB gratis
- [Bunny CDN](https://bunny.net/) - $0.01/GB
- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) - 10GB gratis

### Opción 3: Netlify

Netlify tiene un límite de 100MB por archivo en el plan gratuito. Necesitarás usar la Opción 2 (CDN externa).

### Opción 4: GitHub Pages (static export)

```bash
# 1. Modifica next.config.ts, agrega:
output: 'export',

# 2. Build
npm run build

# 3. Despliega la carpeta 'out' a GitHub Pages
```

**Nota:** También necesitarás usar CDN externa (Opción 2) debido a límites de GitHub.

## 🛠️ Personalización

### Cambiar el juego o agregar más juegos

1. **Consigue otro juego DOS** (debe ser legal/freeware)

2. **Crea el bundle:**
   ```bash
   # Estructura necesaria:
   mi-juego/
   ├── .jsdos/
   │   └── dosbox.conf    # Configuración (ver ejemplo abajo)
   └── [archivos del juego]

   # Crea el .jsdos (es solo un ZIP):
   zip -r mi-juego.jsdos . -r
   ```

3. **Ejemplo de dosbox.conf:**
   ```
   [autoexec]
   MOUNT C .
   C:
   JUEGO.EXE
   ```

4. **Coloca en** `public/games/mi-juego.jsdos`

5. **Crea nueva página** `app/games/mi-juego/page.tsx`

### Ajustar rendimiento

El componente `RedAlertGame.tsx` usa la configuración por defecto de js-dos, que es óptima para la mayoría de juegos DOS.

Para juegos más exigentes, puedes modificar `dosbox.conf` dentro del bundle:

```
[cpu]
cycles=max
core=auto

[autoexec]
MOUNT C .
C:
RA.EXE
```

## 📊 Tamaños de archivos

- **Bundle del juego:** 337MB
- **Librería js-dos (CDN):** ~2MB
- **Componentes React:** ~5KB
- **Total descarga inicial:** ~339MB

**Tip de optimización:** La mayoría de CDNs comprimen automáticamente con Gzip/Brotli, reduciendo el tamaño de descarga en ~30-50%.

## 🌐 Navegadores compatibles

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome    | 90+     | ✅ Excelente |
| Edge      | 90+     | ✅ Excelente |
| Firefox   | 88+     | ✅ Bueno |
| Safari    | 14+     | ⚠️ Funcional |
| Opera     | 76+     | ✅ Bueno |

**Móviles:** Funciona en tablets y teléfonos modernos, pero la experiencia es mejor en PC/laptop.

## 🐛 Solución de problemas

### El juego no carga

1. **Verifica que el archivo existe:**
   ```bash
   ls -lh public/games/redalert.jsdos
   # Debe mostrar ~337MB
   ```

2. **Revisa la consola del navegador** (F12)

3. **Asegúrate de tener buena conexión** (descarga grande)

### Pantalla negra

1. Espera 30-60 segundos (primera carga es lenta)
2. Click en la pantalla para activar audio
3. Presiona F5 para recargar

### No hay sonido

1. Click en la pantalla (navegadores bloquean auto-play)
2. Verifica permisos de audio
3. Revisa que el volumen no esté silenciado

### Error de CORS (si usas CDN externa)

Configura CORS en tu CDN:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## ⚖️ Legal

- **Red Alert (1996):** Freeware oficial desde 2008 por EA
- **Fuente:** [Archive.org - Official EA Freeware Release](https://archive.org/details/command-and-conquer-red-alert)
- **js-dos:** GPL-2.0 License
- **Tu código React/Next.js:** Tu licencia (MIT recomendado)

## 📚 Recursos adicionales

- [js-dos Documentation](https://js-dos.com/)
- [DOSBox Wiki](https://www.dosbox.com/wiki/)
- [Red Alert en CnCNet](https://cncnet.org/red-alert) - Multijugador online
- [OpenRA](https://www.openra.net/) - Motor open source para C&C/Red Alert

## 🎯 Próximos pasos sugeridos

- [ ] Agregar más juegos DOS clásicos
- [ ] Crear galería de juegos con thumbnails
- [ ] Sistema de guardado en localStorage
- [ ] Controles virtuales para móviles
- [ ] Estadísticas de tiempo jugado
- [ ] Integración con OpenRA para multijugador

## 💡 Ideas de otros juegos para agregar

Todos estos son freeware o shareware:

- **Dune 2** (Westwood, precursor de C&C)
- **Command & Conquer** (también freeware por EA)
- **Duke Nukem 3D Shareware**
- **Doom Shareware**
- **Wolfenstein 3D Shareware**
- **Prince of Persia** (original DOS)

---

**¿Preguntas o problemas?** Abre un issue o consulta la documentación de js-dos.

**¡Disfruta jugando Red Alert en tu portafolio! 🎮🚀**
