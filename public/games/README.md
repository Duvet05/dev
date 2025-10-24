# Cómo agregar Red Alert

Coloca tu archivo `redalert.jsdos` en esta carpeta.

## Opción 1: Crear tu propio bundle (RECOMENDADO)

```bash
# 1. Instala js-dos CLI
npm install -g js-dos

# 2. Consigue los archivos del juego original (necesitas una copia legal)
# - Compra C&C Ultimate Collection en Steam o EA App
# - Localiza la carpeta de instalación de Red Alert

# 3. Crea el bundle .jsdos
cd /ruta/a/RedAlert
js-dos bundle . -o redalert.jsdos

# 4. Copia el archivo a este directorio
cp redalert.jsdos /ruta/a/tu/proyecto/public/games/
```

## Opción 2: Usar una URL remota

Si tienes el bundle en otro servidor, modifica `components/RedAlertGame.tsx`:

```typescript
// Cambia esta línea:
const instance = await dos.run("/games/redalert.jsdos")

// Por esto:
const instance = await dos.run("https://tu-servidor.com/redalert.jsdos")
```

## Opción 3: Bundles pre-hechos

Descarga bundles ya listos de:
- [DOS Zone](https://dos.zone/) - busca "Red Alert"
- [Archive.org](https://archive.org/) - sección de juegos DOS

⚠️ **IMPORTANTE:** Asegúrate de tener derecho legal para usar estos archivos.

## Tamaño del archivo

El archivo `.jsdos` típicamente pesa entre 20-50 MB. Si usas GitHub, considera usar Git LFS:

```bash
git lfs install
git lfs track "*.jsdos"
git add .gitattributes
git add public/games/redalert.jsdos
git commit -m "Add Red Alert game bundle"
```
