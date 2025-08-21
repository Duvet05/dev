"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserHeader } from "@/components/BrowserHeader"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Shapes, Layers, Gauge, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { SiBlender, SiAdobe, SiSketchfab, SiArtstation } from "react-icons/si"
import { FaPaintBrush } from "react-icons/fa"
import { IconType } from "react-icons"
import { SKETCHFAB_CONFIG } from "@/lib/sketchfab-config"
import ReactMarkdown from "react-markdown"
import { SketchfabModal } from "@/components/modals/SketchfabModal"
import { ArtStationModal } from "@/components/modals/ArtStationModal"

// Interfaz para los proyectos
interface Project {
  title: string;
  source: string; // Nuevo campo para el origen
  description: string;
  date: string;
  fileSize: string;
  renderTime: string;
  complexity: string;
  sketchfabUid?: string; // Para modelos de Sketchfab
  modelPath?: string;    // Para modelos locales
  // Información adicional de Sketchfab
  triangles?: number;
  vertices?: number;
  likes?: number;
  views?: number;
  downloads?: number;
  author?: string;
  license?: string;
  categories?: string[];
  tags?: string[];
  // Software utilizado (para ArtStation)
  softwareUsed?: {
    name: string;
    iconUrl: string;
  }[];
  // Assets del proyecto (para ArtStation)
  assets?: {
    id: number;
    title?: string;
    imageUrl: string;
    width: number;
    height: number;
    type: "image" | "video_clip" | "cover" | "model3d";
    playerEmbedded?: string | null;
  }[];
  // URL del proyecto (para ArtStation/Sketchfab)
  projectUrl?: string;
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  viewerUrl?: string;
  embedUrl?: string;
  publishedAt?: string;
  staffpickedAt?: string | null;
  // Nuevo campo para el hash de ArtStation (p.ej. nJQarE)
  hashId?: string;
}

// Interfaz para las estadísticas globales
interface SketchfabStats {
  totalViews: number;
  totalLikes: number;
  totalTriangles: number;
  totalVertices: number;
  totalModels: number;
}

// Mapeo de tecnologías a iconos
// const techIcons: Record<string, IconType> = {
//   BLENDER: SiBlender,
//   MAYA: SiAutodesk,
//   "3DS MAX": SiAutodesk,
//   ZBRUSH: FaPaintBrush,
//   SUBSTANCE: SiAdobe,
//   PHOTOSHOP: SiAdobephotoshop,
//   UNITY: SiUnity,
//   UNREAL: SiUnrealengine,
//   WEBGL: SiWebgl,
//   MARVELOUS: SiMarvelapp,
//   HOUDINI: SiHoudini,
//   FIGMA: SiFigma,
//   "AFTER.EFFECTS": SiAdobe,
//   CSS: SiCss3,
//   "THREE.JS": TbBrandThreejs,
//   GLSL: SiWebgl,
//   SKETCHFAB: SiSketchfab,
//   PBR: SiWebgl,
//   LOWPOLY: SiWebgl,
// }

// Mapeo de tecnologías a iconos (estandarizado para tags)
const tagTechIcons: Record<string, IconType> = {
  blender: SiBlender,
  substancepainter: SiAdobe,
  substance: SiAdobe,
  zbrush: FaPaintBrush,
}

// Proyectos de ArtStation hardcodeados (basados en el JSON proporcionado por el usuario)
const HARDCODED_ARTSTATION_PROJECTS: Project[] = [
  {
    title: "3DPROP_MODELINGPIPLINE(TOYOTOMI GEAR MISSION KS-GE67); ".toUpperCase(),
    source: 'ARTSTATION',
    description: "Here's a prop model of a stove oil which design's inspire me to model it on 3d,\nFor the task i first gather all the refs i needed, then starter modeling,\ntexturing, exporting and importing, lightning and rendering.\nAfter that i just took care of the showcase design.\nIt was fun making this prop, :)\nHope it showcase my skills <.",
    date: '2024-08-18T15:01:53.580-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/nJQarE',
    embedUrl: 'https://www.artstation.com/embed/nJQarE',
    likes: 4,
    hashId: 'nJQarE',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/079/109/123/small_square/victor-cuadot-victor-cuadot-toyotomi.jpg?1724011301',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/079/109/123/smaller_square/victor-cuadot-victor-cuadot-toyotomi.jpg?1724011301',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/079/109/123/micro_square/victor-cuadot-victor-cuadot-toyotomi.jpg?1724011301',
    },
  },
  {
    title: 'Low poly car animated model'.toUpperCase(),
    source: 'ARTSTATION',
    description: "Based on the great  @gatring3's on twitter concept.\nHeres a demostration of some low poly videogame modeling, rigging, animating, and texturing.\nGiving life to this little guy was a challenge.",
    date: '2024-01-09T12:24:40.640-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/QX6QnZ',
    embedUrl: 'https://www.artstation.com/embed/QX6QnZ',
    likes: 3,
    hashId: 'QX6QnZ',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/633/small_square/victor-cuadot-victor-cuadot-vehiclecarrito.jpg?1701997233',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/633/smaller_square/victor-cuadot-victor-cuadot-vehiclecarrito.jpg?1701997233',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/633/micro_square/victor-cuadot-victor-cuadot-vehiclecarrito.jpg?1701997233',
    },
  },
  {
    title: 'Casco - Caja de enchufes para autos de exploración'.toUpperCase(),
    source: 'ARTSTATION',
    description: "Encargado del modelado, optimización, texturizado animación, renderizado y diseño conceptual del prototipo de producto.\nEl objetivo era explorar diseños para según el brief y feedback del clliente.\nDiseños conceptuales y renders de producto para Ford.",
    date: '2023-12-07T17:33:52.874-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/PXDwdB',
    embedUrl: 'https://www.artstation.com/embed/PXDwdB',
    likes: 3,
    hashId: 'PXDwdB',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/287/small_square/victor-cuadot-victor-cuadot-thumbnail.jpg?1701992354',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/287/smaller_square/victor-cuadot-victor-cuadot-thumbnail.jpg?1701992354',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/287/micro_square/victor-cuadot-victor-cuadot-thumbnail.jpg?1701992354',
    },
  },
  {
    title: 'SquidGame Sneakers'.toUpperCase(),
    source: 'ARTSTATION',
    description: "All this work was made on blender! except the splatter bloods, those ones i did on substance painter!\nIt was such a joy making them and i'm so satysfied with the result!",
    date: '2021-10-01T17:36:14.352-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/WKyDZX',
    embedUrl: 'https://www.artstation.com/embed/WKyDZX',
    likes: 15,
    hashId: 'WKyDZX',
    thumbnails: {
      small: 'https://cdna.artstation.com/p/assets/covers/images/070/213/812/small_square/victor-cuadot-victor-cuadot-squid.jpg?1701994403',
      medium: 'https://cdna.artstation.com/p/assets/covers/images/070/213/812/smaller_square/victor-cuadot-victor-cuadot-squid.jpg?1701994403',
      large: 'https://cdna.artstation.com/p/assets/covers/images/070/213/812/micro_square/victor-cuadot-victor-cuadot-squid.jpg?1701994403',
    },
  },
  {
    title: 'Bunny sneakers!'.toUpperCase(),
    source: 'ARTSTATION',
    description: '3d concept design of a bunny sneaker!\nMade on blender and photoshop',
    date: '2021-10-03T14:47:33.241-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/8eAxxE',
    embedUrl: 'https://www.artstation.com/embed/8eAxxE',
    likes: 9,
    hashId: '8eAxxE',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/767/small_square/victor-cuadot-victor-cuadot-bunny.jpg?1701994207',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/767/smaller_square/victor-cuadot-victor-cuadot-bunny.jpg?1701994207',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/213/767/micro_square/victor-cuadot-victor-cuadot-bunny.jpg?1701994207',
    },
  },
  {
    title: 'Angry EGG'.toUpperCase(),
    source: 'ARTSTATION',
    description: "Hello everyone, here i am bringing you this cute but angry egg.\nToday i wanted to make something cute, and simple, but creative...",
    date: '2020-01-04T18:34:22.700-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/gJm2Ne',
    embedUrl: 'https://www.artstation.com/embed/gJm2Ne',
    likes: 178,
    hashId: 'gJm2Ne',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/379/small_square/victor-cuadot-victor-cuadot-eggselente.jpg?1701996076',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/379/smaller_square/victor-cuadot-victor-cuadot-eggselente.jpg?1701996076',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/379/micro_square/victor-cuadot-victor-cuadot-eggselente.jpg?1701996076',
    },
  },
  {
    title: 'Skull illustrations'.toUpperCase(),
    source: 'ARTSTATION',
    description: 'This set of renders were made on 2021.',
    date: '2022-07-13T15:44:31.749-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/JeVyq0',
    embedUrl: 'https://www.artstation.com/embed/JeVyq0',
    likes: 5,
    hashId: 'JeVyq0',
    thumbnails: {
      small: 'https://cdna.artstation.com/p/assets/covers/images/070/213/412/small_square/victor-cuadot-victor-cuadot-skull.jpg?1701992786',
      medium: 'https://cdna.artstation.com/p/assets/covers/images/070/213/412/smaller_square/victor-cuadot-victor-cuadot-skull.jpg?1701992786',
      large: 'https://cdna.artstation.com/p/assets/covers/images/070/213/412/micro_square/victor-cuadot-victor-cuadot-skull.jpg?1701992786',
    },
  },
  {
    title: 'allien portraits set'.toUpperCase(),
    source: 'ARTSTATION',
    description: "This set of alliens were made trying to implement certain MLW creative's workflow technics",
    date: '2021-05-09T23:33:31.612-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/Ooegxw',
    embedUrl: 'https://www.artstation.com/embed/Ooegxw',
    likes: 21,
    hashId: 'Ooegxw',
    thumbnails: {
      small: 'https://cdna.artstation.com/p/assets/covers/images/070/213/924/small_square/victor-cuadot-victor-cuadot-allien.jpg?1701994737',
      medium: 'https://cdna.artstation.com/p/assets/covers/images/070/213/924/smaller_square/victor-cuadot-victor-cuadot-allien.jpg?1701994737',
      large: 'https://cdna.artstation.com/p/assets/covers/images/070/213/924/micro_square/victor-cuadot-victor-cuadot-allien.jpg?1701994737',
    },
  },
  {
    title: 'Nito the GRAVELORD!'.toUpperCase(),
    source: 'ARTSTATION',
    description: "This is my version of Nito from the first Darksouls!, i always liked the character design of Nito.",
    date: '2021-04-15T14:42:55.958-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/d8DKwx',
    embedUrl: 'https://www.artstation.com/embed/d8DKwx',
    likes: 17,
    hashId: 'd8DKwx',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/137/small_square/victor-cuadot-victor-cuadot-nito.jpg?1701995322',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/137/smaller_square/victor-cuadot-victor-cuadot-nito.jpg?1701995322',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/137/micro_square/victor-cuadot-victor-cuadot-nito.jpg?1701995322',
    },
  },
  {
    title: 'Granuja Boris. Concept character design'.toUpperCase(),
    source: 'ARTSTATION',
    description: "This is Granuja Boris he's a pretty grumpy allien, dont make him angry please.",
    date: '2021-03-19T16:26:24.276-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/XnW610',
    embedUrl: 'https://www.artstation.com/embed/XnW610',
    likes: 13,
    hashId: 'XnW610',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/211/small_square/victor-cuadot-victor-cuadot-granujaboris.jpg?1701995574',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/211/smaller_square/victor-cuadot-victor-cuadot-granujaboris.jpg?1701995574',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/211/micro_square/victor-cuadot-victor-cuadot-granujaboris.jpg?1701995574',
    },
  },
  {
    title: 'Chicken Parkour!'.toUpperCase(),
    source: 'ARTSTATION',
    description: "Character design from scratch!, hope you like it.\nReally excited to work on more characters like this.",
    date: '2021-01-14T16:02:18.202-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/zOBkl6',
    embedUrl: 'https://www.artstation.com/embed/zOBkl6',
    likes: 15,
    hashId: 'zOBkl6',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/315/small_square/victor-cuadot-victor-cuadot-3dpollos.jpg?1701995914',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/315/smaller_square/victor-cuadot-victor-cuadot-3dpollos.jpg?1701995914',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/315/micro_square/victor-cuadot-victor-cuadot-3dpollos.jpg?1701995914',
    },
  },
  {
    title: 'Bibot robot'.toUpperCase(),
    source: 'ARTSTATION',
    description: 'Illustration made for UNIAT publicity, I modeled it in blender, textured it in substance painter, and compositing in photoshop.',
    date: '2020-01-20T02:17:21.632-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/k4bO06',
    embedUrl: 'https://www.artstation.com/embed/k4bO06',
    likes: 86,
    hashId: 'k4bO06',
    thumbnails: {
      small: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/409/small_square/victor-cuadot-victor-cuadot-robotocube.jpg?1701996187',
      medium: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/409/smaller_square/victor-cuadot-victor-cuadot-robotocube.jpg?1701996187',
      large: 'https://cdnb.artstation.com/p/assets/covers/images/070/214/409/micro_square/victor-cuadot-victor-cuadot-robotocube.jpg?1701996187',
    },
  },
  {
    title: '¡Wooden Toy Horse!'.toUpperCase(),
    source: 'ARTSTATION',
    description: "Modeled on blender, and textures made on substance painter.\nReally enjoy making this one!, lots of fun.",
    date: '2020-05-29T20:54:50.721-05:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/8lQLgQ',
    embedUrl: 'https://www.artstation.com/embed/8lQLgQ',
    likes: 23,
    hashId: '8lQLgQ',
    thumbnails: {
      small: 'https://cdna.artstation.com/p/assets/covers/images/070/214/426/small_square/victor-cuadot-victor-cuadot-horse.jpg?1701996254',
      medium: 'https://cdna.artstation.com/p/assets/covers/images/070/214/426/smaller_square/victor-cuadot-victor-cuadot-horse.jpg?1701996254',
      large: 'https://cdna.artstation.com/p/assets/covers/images/070/214/426/micro_square/victor-cuadot-victor-cuadot-horse.jpg?1701996254',
    },
  },
  {
    title: 'Baseball Robot!'.toUpperCase(),
    source: 'ARTSTATION',
    description: "This work was made just by fun!, had a raw idea about a baseball player from other world.\nAll modeling was made on blender...",
    date: '2019-12-31T01:42:28.014-06:00',
    fileSize: '',
    renderTime: '',
    complexity: 'MEDIUM',
    viewerUrl: 'https://www.artstation.com/artwork/qAVyER',
    embedUrl: 'https://www.artstation.com/embed/qAVyER',
    likes: 52,
    hashId: 'qAVyER',
    thumbnails: {
      small: 'https://cdna.artstation.com/p/assets/covers/images/070/214/434/small_square/victor-cuadot-victor-cuadot-robotbaseball.jpg?1701996304',
      medium: 'https://cdna.artstation.com/p/assets/covers/images/070/214/434/smaller_square/victor-cuadot-victor-cuadot-robotbaseball.jpg?1701996304',
      large: 'https://cdna.artstation.com/p/assets/covers/images/070/214/434/micro_square/victor-cuadot-victor-cuadot-robotbaseball.jpg?1701996304',
    },
  },
]

export default function ProjectsPage() {
  const [currentTime, setCurrentTime] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playerState, setPlayerState] = useState("STOPPED")
  const [volume, setVolume] = useState(8)
  const [isMuted, setIsMuted] = useState(false)
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(8)

  // Estado para las estadísticas globales
  const [sketchfabStats, setSketchfabStats] = useState<SketchfabStats>({
    totalViews: 0,
    totalLikes: 0,
    totalTriangles: 0,
    totalVertices: 0,
    totalModels: 0,
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const [tracks, setTracks] = useState<{ name: string, src: string }[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState<string>('')
  const [totalModelsFound] = useState<number>(0)
  const [validModelsFound, setValidModelsFound] = useState<number>(0)
  const [usingFallback, setUsingFallback] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("SKETCHFAB"); // Solo SKETCHFAB o ARTSTATION
  const [selectedComplexity, setSelectedComplexity] = useState<string>("ALL");
  const [orderBy, setOrderBy] = useState<string>("date-desc");
  const [gridCols, setGridCols] = useState<number>(4); // Por defecto 4x

  // Fijar modelos por página en 8 para Sketchfab, 12 para ArtStation
  const MODELS_PER_PAGE = selectedSource === "ARTSTATION" ? 12 : 8;

  // Nueva función para cargar modelos (infinite scroll)
  // const loadSketchfabModels = async (url?: string) => {
  //   try {
  //     setIsLoadingProjects(true);
  //     setProjectsError("");
  //     setIsLoadingMore(!!url);
  //     const endpoint = url || `/api/sketchfab-models?username=${SKETCHFAB_CONFIG.username}&limit=100&orderBy=${orderBy}`;
  //     const res = await fetch(endpoint);
  //     const data = await res.json();
  //     if (data.success) {
  //       setSketchfabModels(prev => url ? [...prev, ...data.projects] : data.projects);
  //       setAllProjects(prev => {
  //         // Filtramos los modelos de ArtStation que pudieran existir
  //         const filtered = prev.filter(p => p.source !== "SKETCHFAB");
          
  //         // Calcular estadísticas globales
  //         const projects = data.projects as Project[];
  //         const statsObj: SketchfabStats = {
  //           totalViews: 0,
  //           totalLikes: 0,
  //           totalTriangles: 0,
  //           totalVertices: 0,
  //           totalModels: 0,
  //         };
          
  //         projects.forEach(model => {
  //           statsObj.totalViews += (model.views || 0);
  //           statsObj.totalLikes += (model.likes || 0);
  //           statsObj.totalTriangles += (model.triangles || 0);
  //           statsObj.totalVertices += (model.vertices || 0);
  //           statsObj.totalModels += 1;
  //         });

  //         // Actualizar las estadísticas globales
  //         setSketchfabStats(statsObj);
          
  //         return [...filtered, ...data.projects];
  //       });
  //       setTotalModelsFound(data.totalModels || 0);
  //       setValidModelsFound(data.validModels || data.projects.length);
  //       setUsingFallback(data.usingFallback || false);
  //       setNextUrl(data.next || null);
  //     } else {
  //       throw new Error(data.error || 'Failed to fetch projects');
  //     }
  //   } catch (error) {
  //     setProjectsError(`Failed to load projects from @${SKETCHFAB_CONFIG.username}`);
  //     setUsingFallback(true);
  //     setNextUrl(null);
  //   } finally {
  //     setIsLoadingProjects(false);
  //     setIsLoadingMore(false);
  //   }
  // };

  // Función para cargar modelos de ArtStation
  const fetchArtStationProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError("");

      // Usar directamente los proyectos hardcodeados para asegurar disponibilidad
      const mappedProjects: Project[] = HARDCODED_ARTSTATION_PROJECTS.map(p => ({ ...p }));

      setAllProjects(prev => {
        const filtered = prev.filter(proj => proj.source !== "ARTSTATION");
        return [...filtered, ...mappedProjects];
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setProjectsError(`Failed to load projects from ArtStation: ${error.message}`);
      } else {
        setProjectsError(`Failed to load projects from ArtStation`);
      }
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Fetch de la API (limit=100 siempre)
  const fetchSketchfabProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError("");
      const response = await fetch(`/api/sketchfab-models?username=${SKETCHFAB_CONFIG.username}&page=1&limit=100&orderBy=${orderBy}`);
      const data = await response.json();
      if (data.success) {
        setAllProjects(prev => {
          // Filtramos los modelos de ArtStation que pudieran existir
          const filtered = prev.filter(p => p.source !== "SKETCHFAB");
          
          // Calcular estadísticas globales
          const projects = data.projects as Project[];
          const statsObj: SketchfabStats = {
            totalViews: 0,
            totalLikes: 0,
            totalTriangles: 0,
            totalVertices: 0,
            totalModels: 0,
          };
          
          projects.forEach(model => {
            statsObj.totalViews += (model.views || 0);
            statsObj.totalLikes += (model.likes || 0);
            statsObj.totalTriangles += (model.triangles || 0);
            statsObj.totalVertices += (model.vertices || 0);
            statsObj.totalModels += 1;
          });

          // Actualizar las estadísticas globales
          setSketchfabStats(statsObj);
          
          return [...filtered, ...data.projects];
        });
        setValidModelsFound(data.validModels || data.projects.length);
        setCurrentPage(1);
        setUsingFallback(false);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (_error) {
      setProjectsError(`Failed to load projects from @${SKETCHFAB_CONFIG.username}`);
      setValidModelsFound(0);
      setCurrentPage(1);
      setUsingFallback(true);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Cargar modelos al montar o cuando cambian los filtros principales
  useEffect(() => {
    setAllProjects([]);

    // Cargar proyectos según la fuente seleccionada
    if (selectedSource === "SKETCHFAB") {
      fetchSketchfabProjects();
      setGridCols(4); // Siempre 4x al cambiar a Sketchfab
      setCurrentPage(1); // Reiniciar paginación
    } else if (selectedSource === "ARTSTATION") {
      fetchArtStationProjects();
      if (gridCols !== 6) {
        setGridCols(6); // Vista horizontal 6x por defecto
      }
      setCurrentPage(1); // Reiniciar paginación
      setSelectedComplexity("ALL"); // Quitar filtro de complexity
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, selectedSource]);

  // Fetch tracks para el reproductor
  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/music")
      if (!res.ok) throw new Error("No se pudo cargar la música")
      const data: { name: string, src: string }[] = await res.json()
      setTracks(data)
    } catch {
      setTracks([])
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/Mexico_City",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Control de reproducción
  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setPlayerState("STOPPED")
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      setPlayerState("PLAYING")
    }
  }

  const handlePrev = () => {
    if (tracks.length === 0) return
    let prev = currentTrack - 1
    if (prev < 0) prev = tracks.length - 1
    setCurrentTrack(prev)
    setIsPlaying(false)
    setPlayerState("STOPPED")
  }

  const handleNext = () => {
    if (tracks.length === 0) return
    let next = currentTrack + 1
    if (next >= tracks.length) next = 0
    setCurrentTrack(next)
    setIsPlaying(false)
    setPlayerState("STOPPED")
  }

  // Actualiza la pista cuando cambia
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.pause()
      audioRef.current.load()

      if (playerState === "PLAYING") {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Error al reproducir automáticamente:", error)
            setIsPlaying(false)
            setPlayerState("STOPPED")
          })
        }
      } else {
        setIsPlaying(false)
        setPlayerState("STOPPED")
      }
    }
  }, [currentTrack, tracks, playerState])

  // Control de volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 8
    }
  }, [volume, isMuted])

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(volumeBeforeMute)
    } else {
      setVolumeBeforeMute(volume)
      setIsMuted(true)
    }
  }

  const handleSetVolume = (newVolume: number) => {
    if (isMuted) {
      setIsMuted(false)
    }
    setVolume(newVolume)
  }

  const handleEnded = () => {
    if (tracks.length === 0) return

    let next = currentTrack + 1
    if (next >= tracks.length) next = 0

    setCurrentTrack(next)
    setIsPlaying(true)
    setPlayerState("PLAYING")
  }

  // Obtener todas las categorías y fuentes únicas de los proyectos
  const allCategories = Array.from(new Set(allProjects.flatMap(p => p.categories || [])));
  // const allSources = Array.from(new Set(allProjects.map(p => p.source || "UNKNOWN")));
  const complexityOrder = ["LOW", "MEDIUM", "HIGH", "VERY_HIGH", "EXTREME"];
  const allComplexities = complexityOrder.filter(c => allProjects.some(p => p.complexity === c));

  // Filtrar, buscar y ordenar proyectos
  const filteredProjects = allProjects
    .filter(project =>
      (selectedCategory === "ALL" || (project.categories && project.categories.includes(selectedCategory))) &&
      (project.source === selectedSource) && // Solo filtra por la fuente exacta (SKETCHFAB o ARTSTATION)
      (selectedComplexity === "ALL" || project.complexity === selectedComplexity) &&
      (searchText === "" ||
        project.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
      )
    )
    .sort((a, b) => {
      switch (orderBy) {
        case "date-desc":
          return (b.date || "").localeCompare(a.date || "");
        case "date-asc":
          return (a.date || "").localeCompare(b.date || "");
        case "likes-desc":
          return (b.likes || 0) - (a.likes || 0);
        case "likes-asc":
          return (a.likes || 0) - (b.likes || 0);
        case "views-desc":
          return (b.views || 0) - (a.views || 0);
        case "views-asc":
          return (a.views || 0) - (b.views || 0);
        default:
          return 0;
      }
    });

  // Mostrar solo los modelos de la página actual (usando los filtrados)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * MODELS_PER_PAGE, currentPage * MODELS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / MODELS_PER_PAGE));

  // Cambiar de página
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };
  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (page !== currentPage) setCurrentPage(page);
      scrollToTop();
    }
  };

  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number>(0);
  const assetsScrollRef = useRef<HTMLDivElement>(null);

  // Funciones para navegar por los assets
  const scrollAssetsLeft = () => {
    if (assetsScrollRef.current) {
      assetsScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollAssetsRight = () => {
    if (assetsScrollRef.current) {
      assetsScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Función para renderizar un asset de ArtStation
  const renderArtStationAsset = (asset: {
    type: string;
    imageUrl: string;
    title?: string;
  }, isLarge: boolean = false) => {
    // Solo mostrar imágenes (no covers) y videos
    if (asset.type === 'image') {
      if (isLarge) {
        // Para el asset principal, crear un contenedor 1:1 con fondo desenfocado
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Fondo desenfocado */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${asset.imageUrl})`,
                filter: 'blur(20px)',
                transform: 'scale(1.1)' // Evitar bordes del desenfoque
              }}
            />
            {/* Overlay oscuro para mejorar contraste */}
            <div className="absolute inset-0 bg-black/30" />
            {/* Imagen principal centrada */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={asset.imageUrl}
                alt={asset.title || "Asset"}
                className="max-w-full max-h-full object-contain"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              />
            </div>
          </div>
        );
      } else {
        // Para thumbnails, mantener el comportamiento actual
        return (
          <img
            src={asset.imageUrl}
            alt={asset.title || "Asset"}
            className="w-full h-full object-cover"
          />
        );
      }
    } 
    
    // No mostrar videos, covers, modelos 3D u otros tipos
    return null;
  };

  // Función para renderizar una tarjeta de ArtStation (estilo galería)
  const renderArtStationCard = (project: Project, index: number) => {
    return (
      <div
        key={index}
        className="bg-black border-r border-b border-secondary hover:border-white transition-colors group cursor-pointer relative"
        onClick={() => {
          // Cargar detalles antes de abrir modal
          loadArtStationDetails(project);
        }}
      >
        {/* Tarjeta estilo galería para ArtStation - solo imagen y overlay en hover */}
        {project.thumbnails && project.thumbnails.medium ? (
          <>
            <div className="relative">
              <img
                src={project.thumbnails.medium}
                alt={project.title}
                className="h-auto w-full object-cover"
                style={{ aspectRatio: "1/1" }}
              />
              {/* Overlay con título solo al hacer hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-lg font-bold text-white truncate mb-2 w-full overflow-hidden whitespace-nowrap">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-200 text-sm">
                  <SiArtstation className="mr-1" />
                  <span>ARTSTATION</span>
                </div>

                <div className="mt-3 px-4 py-1 border border-white text-white text-sm uppercase tracking-widest">
                  VIEW ARTWORK
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-[1/1] bg-gray-900 border border-gray-600 flex items-center justify-center">
            <div className="text-gray-400 text-sm">NO.ARTWORK.AVAILABLE</div>
          </div>
        )}
      </div>
    );
  };

  // Función para renderizar una tarjeta de Sketchfab
  const renderSketchfabCard = (project: Project, index: number) => {
    return (
      <div
        key={index}
        className="bg-primary border-r border-b border-secondary hover:border-white transition-colors group"
      >
        <div className="p-6 flex flex-col h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={project.sketchfabUid ? `https://sketchfab.com/3d-models/${project.sketchfabUid}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:outline-none"
                  >
                    <Badge
                      variant="outline"
                      className="text-sm rounded-none flex items-center gap-1 cursor-pointer hover:underline border-[#13aff0] text-[#13aff0]"
                    >
                      <SiSketchfab className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                      SKETCHFAB
                    </Badge>
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 ml-auto">
                  {project.categories && project.categories.length > 0 ? (
                    <>
                      {/* Mostrar solo la primera categoría */}
                      <div className="relative inline-block">
                        <Badge
                          variant="secondary"
                          className="text-sm bg-primary text-secondary rounded-none uppercase"
                        >
                          {project.categories[0]}
                        </Badge>
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                      </div>
                      {/* Mostrar indicador +N si hay más categorías */}
                      {project.categories.length > 1 && (
                        <div className="relative inline-block">
                          <Badge
                            variant="secondary"
                            className="text-sm bg-primary text-secondary rounded-none uppercase"
                            title={`Additional categories: ${project.categories.slice(1).join(', ')}`}
                          >
                            +{project.categories.length - 1}
                          </Badge>
                          {/* Corner brackets */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t-1 border-l-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t-1 border-r-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-1 border-l-1 border-gray-400 pointer-events-none"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-1 border-r-1 border-gray-400 pointer-events-none"></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">NO.CATEGORY</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
              {/* Título a la izquierda */}
              <a
                href={project.sketchfabUid ? `https://sketchfab.com/3d-models/${project.sketchfabUid}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 focus:outline-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors font-bauhaus text-left hover:underline cursor-pointer text-secondary truncate flex-1 min-w-0">
                    {project.title}
                  </h3>
                  {/* Icono de staffpick si aplica */}
                  {project.staffpickedAt && (
                    <img
                      src="https://static.sketchfab.com/static/builds/web/dist/static/assets/images/icons/1ec49a9ae15f3f8f2d6ce895f503953c-v2.svg"
                      alt="Staff Picked"
                      title="Staff Picked"
                      className="w-5 h-5 drop-shadow-md flex-shrink-0"
                    />
                  )}
                </div>
                {project.date && (
                  <span className="text-xs text-gray-400 font-normal block sm:hidden mt-1">
                    {(() => {
                      // Formatear fecha a YYYY.MM.DD
                      const d = new Date(project.date)
                      if (isNaN(d.getTime())) return project.date
                      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
                    })()}
                  </span>
                )}
              </a>
              {/* Stats y fecha a la derecha */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {project.date && (
                  <span className="text-xs text-gray-400 font-normal hidden sm:inline">
                    {(() => {
                      // Formatear fecha a YYYY.MM.DD
                      const d = new Date(project.date)
                      if (isNaN(d.getTime())) return project.date
                      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
                    })()}
                  </span>
                )}
                {(project.likes || project.views) && (
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    {project.likes ? (
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{project.likes.toLocaleString()}</span>
                      </div>
                    ) : null}
                    {project.views ? (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views.toLocaleString()}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            {/* 3D Model Viewer - Sketchfab */}
            <div className="mb-4 relative cursor-pointer"
              onClick={() => setModalProject(project)}
            >
              {project.thumbnails && project.thumbnails.medium ? (
                <>
                  <img
                    src={project.thumbnails.medium}
                    alt={project.title}
                    className="h-auto w-full object-cover border border-gray-600 bg-gray-900 peer"
                    style={{ aspectRatio: "16/9" }}
                  />
                  <div className="border border-gray-600 absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-white text-lg font-bold font-vt323 tracking-widest">
                      3D.PREVIEW
                    </span>
                  </div>
                </>
              ) : (
                <div className="aspect-[16/9] bg-gray-900 border border-gray-600 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">NO.MODEL.AVAILABLE</div>
                </div>
              )}
            </div>

            {/* Descripción con Markdown en la card */}
            <div className="text-base text-gray-400 mb-2 line-clamp-3">
              <ReactMarkdown
                components={{
                  p: (props) => <p {...props} className="inline" />,
                  strong: (props) => <strong {...props} className="font-bold" />,
                  br: () => <br />,
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag: unknown, tagIndex: number) => {
                  if (typeof tag !== 'string') return null;
                  const tagKey = tag.toLowerCase();
                  const Icon = tagTechIcons[tagKey];
                  if (Icon) {
                    return (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                      >
                        <Icon className="inline-block mr-1" style={{ fontSize: 16, verticalAlign: "middle" }} />
                        {tag}
                      </Badge>
                    );
                  }
                  return (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="uppercase text-xs bg-secondary text-primary rounded-none flex items-center gap-1"
                    >
                      #{tag}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-auto">
            {/* Project metadata mejorada */}
            <div className="space-y-2 mb-4 text-xs text-gray-400">
              {project.triangles && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Shapes className="w-4 h-4 mr-1" />TRIANGLES:</span>
                  <span className="text-white">{project.triangles.toLocaleString()} ▲</span>
                </div>
              )}
              {project.vertices && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Layers className="w-4 h-4 mr-1" />VERTICES:</span>
                  <span className="text-white">{project.vertices.toLocaleString()} ◼</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><Gauge className="w-4 h-4 mr-1" />COMPLEXITY:</span>
                <span className={
                  project.complexity === "EXTREME" ? "text-red-500" :
                    project.complexity === "VERY_HIGH" ? "text-orange-500" :
                      project.complexity === "HIGH" ? "text-yellow-500" :
                        project.complexity === "MEDIUM" ? "text-green-500" :
                          project.complexity === "LOW" ? "text-green-300" :
                            "text-gray-400"
                }>{project.complexity}</span>
              </div>
            </div>

            {/* Botones alineados abajo */}
            <div className="flex gap-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer animate-pulse-preview"
                onClick={() => setModalProject(project)}
              >
                3D.PREVIEW
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-sm text-gray-400 hover:text-white hover:bg-primary h-8 rounded-none border border-gray-700 hover:border-white transition-all cursor-pointer"
                onClick={() => {
                  if (typeof window !== 'undefined' && project.sketchfabUid) {
                    window.open(`https://sketchfab.com/3d-models/${project.sketchfabUid}`, '_blank');
                  }
                }}
              >
                VIEW.ON.SKETCHFAB <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Función para formatear el título igual que Sketchfab
  function formatTitle(name: string): string {
    return name
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '')
      .substring(0, 25) + '.DEMO';
  }

  // Mapear JSON de ArtStation al formato interno del proyecto
  const mapArtStationJsonToProject = (baseProject: Project, json: any): Project => {
    if (!json) return baseProject;
    const mapped: Project = { ...baseProject };

    // Metadatos
    mapped.title = json.title ? formatTitle(json.title as string) : mapped.title;
    mapped.description = (json.description_html as string) || json.description || mapped.description;
    mapped.date = (json.published_at as string) || mapped.date;
    mapped.likes = typeof json.likes_count === 'number' ? json.likes_count : mapped.likes;
    mapped.views = typeof json.views_count === 'number' ? json.views_count : mapped.views;
    mapped.projectUrl = (json.permalink as string) || mapped.projectUrl;
    mapped.publishedAt = (json.published_at as string) || mapped.publishedAt;

    // Autor
    if (json.user) {
      mapped.author = (json.user.full_name as string) || (json.user.username as string) || mapped.author;
    }

    // Categorías
    mapped.categories = (json.categories as { name: string }[] | undefined)?.map(c => c.name) || mapped.categories;

    // Tags
    mapped.tags = (json.tags as string[] | undefined) || mapped.tags;

    // Software
    mapped.softwareUsed = (json.software_items as { name: string; icon_url: string }[] | undefined)?.map(s => ({
      name: s.name,
      iconUrl: s.icon_url
    })) || mapped.softwareUsed;

    // Thumbnails / cover
    if (json.cover_url) {
      mapped.thumbnails = mapped.thumbnails || { small: json.cover_url, medium: json.cover_url, large: json.cover_url };
      mapped.thumbnails.large = json.cover_url;
    }

    // Assets
    mapped.assets = (json.assets as any[] | undefined)?.map(a => ({
      id: a.id,
      title: a.title ?? undefined,
      imageUrl: a.image_url,
      width: a.width ?? 0,
      height: a.height ?? 0,
      type: (a.asset_type as 'image' | 'cover' | 'model3d' | 'video_clip') ?? 'image',
      playerEmbedded: a.player_embedded ?? null
    })) || mapped.assets;

    return mapped;
  };

  // Cargar detalles de ArtStation (intenta copia local en /artstation-json/{hash}.json, luego fallback remoto)
  const loadArtStationDetails = async (project: Project) => {
    const hash = project.hashId;
    if (!hash) {
      setModalProject(project);
      setSelectedAssetIndex(0);
      return;
    }

    const localUrl = `/artstation-json/${hash}.json`;
    try {
      const res = await fetch(localUrl);
      if (res.ok) {
        const json = await res.json();
        const mapped = mapArtStationJsonToProject(project, json);
        setModalProject(mapped);
        setSelectedAssetIndex(0);
        return;
      }
    } catch (e) {
      // ignore
    }

    // fallback remoto
    try {
      const remoteRes = await fetch(`https://www.artstation.com/projects/${hash}.json`);
      if (remoteRes.ok) {
        const json = await remoteRes.json();
        const mapped = mapArtStationJsonToProject(project, json);
        setModalProject(mapped);
        setSelectedAssetIndex(0);
        return;
      }
    } catch (e) {
      // ignore
    }

    // si todo falla, abrir con el proyecto base
    setModalProject(project);
    setSelectedAssetIndex(0);
  };

  return (
    <div className="min-h-screen bg-black text-white font-vt323 overflow-x-hidden">
      {/* Header sticky que ocupa todo el ancho de la pantalla */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="mx-4 mt-4 border-l border-r border-t border-secondary bg-black">
          <BrowserHeader
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            playerState={playerState}
            volume={volume}
            audioRef={audioRef}
            handlePrev={handlePrev}
            handlePlayPause={handlePlayPause}
            handleNext={handleNext}
            setVolume={handleSetVolume}
            handleEnded={handleEnded}
            toggleMute={toggleMute}
            isMuted={isMuted}
          />
        </div>
      </div>

      {/* Contenido principal con padding-top para compensar el header fijo */}
      <div className="pt-[100px] mb-4">
        <div className="border-l border-r border-b border-secondary mx-4">
          <div className="p-8">
            {/* Header de la página */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none flex items-center gap-2 cursor-pointer w-fit"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">BACK.TO.MAIN</span>
                      <span className="sm:hidden">BACK</span>
                    </Button>
                  </Link>
                  <h1 className="mb-[-16] text-4xl sm:text-3xl lg:text-5xl font-bauhaus-pixel leading-none">PROJECTS.ARCHIVE</h1>
                </div>
                <div className="text-left lg:text-right">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs sm:text-sm text-gray-400 break-words">
                      <span className="block sm:inline">PAGE {currentPage} OF {totalPages}</span>
                      <span className="hidden sm:inline"> • </span>
                      <span className="block sm:inline">SHOWING {paginatedProjects.length}</span>
                      <span className="hidden sm:inline"> • </span>
                      <span className="block sm:inline text-green-400">TOTAL: {validModelsFound}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">LAST.UPDATE: {currentTime}</div>
                  </div>
                  {usingFallback && (
                    <div className="text-xs text-yellow-400 mt-1">
                      USING.FALLBACK.DATA
                    </div>
                  )}
                </div>
              </div>

              {/* Línea separadora estilo terminal */}
              <div className="border-t border-secondary"></div>
            </div>


              <div className="mb-4 bg-black/40 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  <div className="flex flex-col items-center p-3 bg-black/60 border border-secondary">
                    <Eye className="w-6 h-6 text-blue-400 mb-1" />
                    <div className="text-xl font-bold text-white">
                      {sketchfabStats.totalViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">TOTAL VIEWS</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-black/60 border-r border-y border-secondary">
                    <Heart className="w-6 h-6 text-red-400 mb-1" />
                    <div className="text-xl font-bold text-white">
                      {sketchfabStats.totalLikes.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">TOTAL LIKES</div>
                  </div>
<div className="flex flex-col items-center p-3 bg-black/60 border-l border-r border-y border-secondary">                    <Shapes className="w-6 h-6 text-yellow-400 mb-1" />
                    <div className="text-xl font-bold text-white">
                      {sketchfabStats.totalTriangles.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">TOTAL TRIANGLES</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-black/60 border-r border-y border-secondary">
                    <Layers className="w-6 h-6 text-purple-400 mb-1" />
                    <div className="text-xl font-bold text-white">
                      {sketchfabStats.totalVertices.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">TOTAL VERTICES</div>
                  </div>
                </div>
              </div>

            {/* NUEVO: Barra de búsqueda, filtros, orden y vista */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400">SOURCE</label>
                <div className="flex">
                  <button
                    className={`px-3 py-1.5 border rounded-none text-sm flex items-center gap-2 ${selectedSource === "SKETCHFAB"
                      ? "border-white bg-white text-black"
                      : "border-secondary bg-black text-white cursor-pointer hover:border-white"}`}
                    onClick={() => setSelectedSource("SKETCHFAB")}
                  >
                    <SiSketchfab className="inline-block" style={{ fontSize: 14, verticalAlign: "middle" }} />
                    SKETCHFAB
                  </button>
                  <button
                    className={`px-3 py-1.5 border rounded-none text-sm flex items-center gap-2 ${selectedSource === "ARTSTATION"
                      ? "border-white bg-white text-black"
                      : "border-secondary bg-black text-white cursor-pointer hover:border-white"}`}
                    onClick={() => setSelectedSource("ARTSTATION")}
                  >
                    <SiArtstation className="inline-block" style={{ fontSize: 14, verticalAlign: "middle" }} />
                    ARTSTATION
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="searchbar" className="text-xs text-gray-400">SEARCH PROJECTS</label>
                <input
                  id="searchbar"
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search by title, description, tag..."
                  className="bg-black border border-secondary text-white px-3 py-1.5 rounded-none focus:outline-none focus:border-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="category-filter" className="text-xs text-gray-400">CATEGORY</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer uppercase"
                >
                  <option value="ALL">ALL</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {selectedSource !== "ARTSTATION" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="complexity-filter" className="text-xs text-gray-400">COMPLEXITY</label>
                  <select
                    id="complexity-filter"
                    value={selectedComplexity}
                    onChange={e => setSelectedComplexity(e.target.value)}
                    className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer uppercase"
                  >
                    <option value="ALL">ALL</option>
                    {allComplexities.map(complexity => (
                      <option key={complexity} value={complexity}>{complexity}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label htmlFor="order-by" className="text-xs text-gray-400">ORDER BY</label>
                <select
                  id="order-by"
                  value={orderBy}
                  onChange={e => setOrderBy(e.target.value)}
                  className="bg-black border border-secondary text-white px-3 py-2 rounded-none focus:outline-none focus:border-white text-sm cursor-pointer"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="likes-desc">Likes (Most)</option>
                  <option value="likes-asc">Likes (Least)</option>
                  <option value="views-desc">Views (Most)</option>
                  <option value="views-asc">Views (Least)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400">VIEW</label>
                <div className="flex">
                  {selectedSource === "SKETCHFAB" && (
                    <>
                      <button
                        className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 2 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                        onClick={() => setGridCols(2)}
                      >2x</button>
                      <button
                        className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 4 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                        onClick={() => setGridCols(4)}
                      >4x</button>
                    </>
                  )}
                  {selectedSource === "ARTSTATION" && (
                    <>
                      <button
                        className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 3 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                        onClick={() => setGridCols(3)}
                      >3x</button>
                      <button
                        className={`px-2.5 py-1.5 border rounded-none text-sm ${gridCols === 6 ? "border-white bg-white text-black" : "border-secondary bg-black text-white cursor-pointer"}`}
                        onClick={() => setGridCols(6)}
                      >6x</button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Grid de proyectos */}
            {isLoadingProjects ? (
              <div className="border border-secondary p-12 text-center">
                <div className="text-gray-400 text-lg animate-pulse mb-4">LOADING.CUADOT.PROJECTS...</div>
                <div className="text-gray-500 text-sm mb-2">
                  {currentPage > 1 ? `Loading page ${currentPage}...` : `Fetching projects from @${SKETCHFAB_CONFIG.username} profile`}
                </div>
                <div className="text-gray-500 text-xs">Please wait...</div>
              </div>
            ) : projectsError ? (
              <div className="border border-red-500 p-12 text-center">
                <div className="text-red-400 text-lg mb-2">ERROR.LOADING.PROJECTS</div>
                <div className="text-red-300 text-sm mb-4">{projectsError}</div>
                <Button
                  onClick={fetchSketchfabProjects}
                  variant="outline"
                  className="cursor-pointer bg-primary rounded-none border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  RETRY.LOAD
                </Button>
              </div>
            ) : (
              <>
                {/* Mensaje de modo infinite scroll y totales */}
                {!usingFallback && totalModelsFound > 0 && (
                  <div className="text-center text-xs text-gray-400 mt-2">
                    <span className="font-bold">MODO INFINITE SCROLL:</span> Se encontraron {totalModelsFound} modelos en total.
                    {totalModelsFound > validModelsFound && (
                      <span className="ml-2 text-yellow-400">({validModelsFound} válidos para mostrar)</span>
                    )}
                  </div>
                )}

                <div className={`border-l border-t border-secondary grid gap-0 ${selectedSource === "ARTSTATION"
                    ? gridCols === 3
                      ? "grid-cols-1 sm:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-6"
                    : `grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols}`
                  }`}>
                  {paginatedProjects.map((project, index) => (
                    selectedSource === "ARTSTATION"
                      ? renderArtStationCard(project, index)
                      : renderSketchfabCard(project, index)
                  ))}
                </div>
              </>
            )}

            {/* Modales separados por tipo de proyecto */}
            {modalProject && modalProject.source === "SKETCHFAB" && (
              <SketchfabModal
                project={modalProject}
                onClose={() => setModalProject(null)}
                tagTechIcons={tagTechIcons}
              />
            )}
            {modalProject && modalProject.source === "ARTSTATION" && (
              <ArtStationModal
                project={modalProject}
                onClose={() => setModalProject(null)}
                tagTechIcons={tagTechIcons}
                selectedAssetIndex={selectedAssetIndex}
                setSelectedAssetIndex={setSelectedAssetIndex}
                assetsScrollRef={assetsScrollRef}
                scrollAssetsLeft={scrollAssetsLeft}
                scrollAssetsRight={scrollAssetsRight}
                renderArtStationAsset={renderArtStationAsset}
              />
            )}
            {/* Footer info */}
            <div className="pt-2 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-400 w-full">
                <div>
                  <div>PORTFOLIO.VERSION: 3.2.1</div>
                  <div>BUILD.DATE: 2025.07.25</div>
                </div>
                {/* Paginación centrada en el footer */}
                {!usingFallback && totalPages > 1 && (
                  <div className="w-full md:w-auto flex justify-center order-3 md:order-none">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || isLoadingProjects}
                        variant="ghost"
                        size="sm"
                        className="border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← PREV
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Button
                            key={i + 1}
                            onClick={() => handleGoToPage(i + 1)}
                            disabled={isLoadingProjects}
                            variant={i + 1 === currentPage ? "default" : "ghost"}
                            size="sm"
                            className={`w-8 h-8 p-0 text-xs rounded-none cursor-pointer pointer-events-auto ${i + 1 === currentPage
                              ? "bg-white text-black border-white cursor-pointer pointer-events-auto !hover:bg-white !hover:text-black !focus:bg-white !focus:text-black !active:bg-white !active:text-black !hover:bg-white !ocus:bg-white !active:bg-white !hover:text-black !focus:text-black !active:text-black"
                              : "border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer"
                              } disabled:opacity-50`}
                            style={i + 1 === currentPage ? { backgroundColor: '#fff', color: '#000', borderColor: '#fff' } : {}}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || isLoadingProjects}
                        variant="ghost"
                        size="sm"
                        className="border border-gray-700 text-gray-400 hover:text-white hover:bg-primary hover:border-white transition-all cursor-pointer rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        NEXT →
                      </Button>
                    </div>
                  </div>
                )}
                <div className="text-right">
                  <div>MEMORY.USAGE: 1.2GB / 16GB</div>
                  <div>SYSTEM.STATUS: ONLINE</div>
                </div>
              </div>
            </div>
            <Footer currentTime={currentTime} />
          </div>
        </div>

        {/* Audio element para el reproductor */}
        <audio
          ref={audioRef}
          onEnded={handleEnded}
          preload="metadata"
        >
          {tracks.length > 0 && (
            <source src={tracks[currentTrack]?.src} type="audio/mpeg" />
          )}
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
      <style jsx global>{`
        @keyframes pulse-preview {
          0%, 100% {
            color: #fff;
            text-shadow: 0 0 0px #fff;
          }
          50% {
            color: #fff;
            text-shadow: 0 0 8px #fff, 0 0 2px #fff;
          }
        }
        .animate-pulse-preview {
          animation: pulse-preview 1.5s ease-in-out infinite;
        }
        
        /* Ocultar scrollbar en contenedor de assets */
        div[style*="scrollbarWidth"]::-webkit-scrollbar {
          display: none;
        }
        
        /* No se necesitan estilos específicos para ArtStation, se usa el estilo unificado */
      `}</style>
    </div>
  )
}