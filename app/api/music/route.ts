// API route para devolver la lista de archivos mp3 en /public/music
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  let files: { name: string, src: string }[] = [];
  try {
    files = fs.readdirSync(musicDir)
      .filter(f => f.endsWith('.mp3'))
      .map(f => ({ name: f, src: `/music/${f}` }));
  } catch (err) {
    console.error('Error leyendo la carpeta de música:', err)
    return NextResponse.json({ error: 'No se pudo leer la carpeta de música.' }, { status: 500 });
  }
  return NextResponse.json(files);
}
