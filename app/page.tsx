"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Terminal, Code, Cpu, Zap, Globe, Mail, Github, Twitter, ArrowRight } from "lucide-react"

export default function CyberpunkPortfolio() {
  const [currentTime, setCurrentTime] = useState("")
  const [glitchText, setGlitchText] = useState("CUADOT")
  const [isPlaying, setIsPlaying] = useState(false)

  // Simulación de porcentajes dinámicos
  const [cpuUsage, setCpuUsage] = useState(87);
  const [gpuUsage, setGpuUsage] = useState(92);
  const [ramUsage, setRamUsage] = useState(64);

  // Estado para la barra de rendering
  const [renderingProgress, setRenderingProgress] = useState(73);

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

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
      const originalText = "CUADOT"
      let glitched = ""

      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          glitched += originalText[i]
        }
      }

      setGlitchText(glitched)

      setTimeout(() => setGlitchText("CUADOT"), 100)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(70 + Math.random() * 30));
      setGpuUsage(Math.floor(70 + Math.random() * 30));
      setRamUsage(Math.floor(32 + Math.random() * 32));
    }, 1000); // Cambio cada segundo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderingProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 1000); // Sube cada segundo
    return () => clearInterval(interval);
  }, []);

  const projects = [
    {
      title: "QUANTUM_MESH.EXE",
      type: "3D VISUALIZATION",
      status: "ACTIVE",
      description: "Neural network visualization with real-time data processing",
      tech: ["BLENDER", "THREE.JS", "WEBGL"],
    },
    {
      title: "CYBER_CITY.BIN",
      type: "ENVIRONMENT",
      status: "COMPLETE",
      description: "Dystopian cityscape with procedural generation",
      tech: ["UNREAL", "HOUDINI", "SUBSTANCE"],
    },
    {
      title: "ANDROID_DREAMS",
      type: "CHARACTER",
      status: "BETA",
      description: "Photorealistic android character with advanced rigging",
      tech: ["MAYA", "ZBRUSH", "MARVELOUS"],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-vt323 overflow-x-hidden">
      {/* Browser Frame */}
      <div className="border border-secondary m-2">
        {/* Browser Header */}
        <div className="bg-primary border-b border-secondary p-2 pl-4 pr-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <div className="w-3 h-3 bg-yellow-500"></div>
            <div className="w-3 h-3 bg-green-500"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-black border border-gray-600 px-3 py-1 text-sm">
              HTTPS://CUADOT.COM
            </div>
          </div>
          <div className="flex space-x-1 group">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-primary hover:bg-secondary rounded-none group-hover:bg-secondary group-hover:text-primary"
            >
              <Terminal className="w-4 h-4 transition-colors group-hover:text-primary" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-primary border-b border-secondary p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 text-base">
              <a href="#home" className="text-white hover:underline">HOME</a>
              <a href="#projects" className="text-gray-400 hover:underline">PROJECTS</a>
              <a href="#skills" className="text-gray-400 hover:underline">SKILLS</a>
              <a href="#contact" className="text-gray-400 hover:underline">CONTACT</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">CART (0)</span>
              <div className="flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-4 h-4 border border-gray-600"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Hero Section */}
          <div className="relative mb-16">
            <div className="grid grid-cols-12 gap-4 mb-8">
              <div className="col-span-12 lg:col-span-8">
                <div className="relative h-96 bg-primary border border-secondary overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {/*<h1 className="text-6xl font-bold glitch-text font-bauhaus-pixel">{glitchText}</h1>*/}
                      <h1 className="text-8xl font-bauhaus-pixel mb-[-18]">{glitchText}</h1>
                      <p className="text-2xl text-gray-400 mb-6">3D.ARTIST.DEVELOPER</p>
                      <div className="flex justify-center space-x-4">
                        <Badge variant="outline" className="text-sm border-white text-white rounded-none">
                          ONLINE
                        </Badge>
                        <Badge variant="outline" className="text-sm border-gray-600 text-gray-400 rounded-none">
                          GMT-6 {currentTime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 bg-secondary animate-pulse"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 border border-secondary">
                <div className="text-secondary bg-primary border-b border-secondary p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">SYSTEM.STATUS</span>
                    <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>CPU</span>
                      <span className="text-white">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1 mb-2">
                      <div className="bg-green-500 h-1" style={{ width: `${cpuUsage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>GPU</span>
                      <span className="text-white">{gpuUsage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1 mb-2">
                      <div className="bg-blue-500 h-1" style={{ width: `${gpuUsage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RAM</span>
                      <span className="text-white">{ramUsage}GB</span>
                    </div>
                    <div className="w-full bg-secondary h-1">
                      <div className="bg-yellow-500 h-1" style={{ width: `${(ramUsage/64)*100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="bg-primary border-b border-secondary p-4">
                  <div className="text-sm text-gray-400 mb-2">CURRENT.PROJECT</div>
                  <div className="text-base text-white">QUANTUM_MESH.EXE</div>
                  <div className="text-sm text-gray-400 mt-1">RENDERING... {renderingProgress}%</div>
                  <div className="w-full bg-secondary h-1 mt-2">
                    <div className="bg-purple-500 h-1" style={{ width: `${renderingProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div id="about" className="mb-16">
            <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">ABOUT.ME</h2>
            <div className="bg-primary border border-secondary p-6 text-white text-lg font-vt323 max-w-3xl mx-auto">
              <p>
                I'm Cuadot, a 3D artist with a strong background in digital art and technology. I studied and taught at UNiAT, where I discovered my passion for sharing knowledge and pushing creative boundaries. My journey includes freelance work and collaborations with leading companies in the industry, contributing to projects for games, film, and advertising. I specialize in advanced visualization, procedural environments, and interactive experiences, always blending technical mastery with artistic vision. I love exploring new tools and trends, and I'm always open to new challenges, collaborations, and freelance opportunities in the digital and creative world.
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div id="projects" className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-4xl font-bauhaus-pixel leading-none">PROJECTS</h2>
                <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent rounded-none"
                >
                VIEW.ALL <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-primary border border-secondary hover:border-white transition-colors group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant="outline"
                        className={`text-sm rounded-none ${project.status === "ACTIVE"
                          ? "border-green-500 text-green-500"
                          : project.status === "COMPLETE"
                            ? "border-blue-500 text-blue-500"
                            : "border-yellow-500 text-yellow-500"
                          }`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-sm text-gray-400">{project.type}</span>
                    </div>
                    <h3 className="text-secondary text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors font-bauhaus">
                      {project.title}
                    </h3>
                    <p className="text-base text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-sm bg-secondary text-primary rounded-none"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div id="skills" className="mb-16">
            <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">SKILLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Cpu, title: "3D MODELING", desc: "High-poly & low-poly assets" },
                { icon: Zap, title: "ANIMATION", desc: "Character & motion graphics" },
                { icon: Code, title: "DEVELOPMENT", desc: "WebGL & real-time rendering" },
                { icon: Globe, title: "DEPLOYMENT", desc: "Web & mobile platforms" },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-primary border border-secondary p-6 text-center hover:border-white transition-colors group"
                >
                  <skill.icon className="w-8 h-8 mx-auto mb-4 text-white group-hover:animate-pulse" />
                  <h3 className="font-bold text-secondary font-bauhaus text-lg">{skill.title}</h3>
                  <p className="text-base text-gray-400">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mb-16">
            <h2 className="text-4xl font-bauhaus-pixel leading-none mb-4">CONTACT</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-primary border border-secondary p-6">
                  <h3 className="text-xl font-bold mb-4 font-bauhaus">SEND.MESSAGE</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="NAME.INPUT"
                      className="border-gray-600 text-white placeholder:text-gray-500 rounded-none"
                    />
                    <Input
                      placeholder="EMAIL.ADDRESS"
                      className="border-gray-600 text-white placeholder:text-gray-500 rounded-none"
                    />
                    <Textarea
                      placeholder="MESSAGE.CONTENT"
                      className="bg-black border-gray-600 text-white placeholder:text-gray-500 min-h-[120px] rounded-none"
                    />
                    <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-none">TRANSMIT.DATA</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="text-secondary bg-primary border border-secondary p-6">
                  <h3 className="text-xl font-bold mb-4 font-bauhaus">DIRECT.LINKS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-white" />
                      <span className="text-base">cuadot@gmail.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Github className="w-4 h-4 text-white" />
                      <span className="text-base">github.com/neural-link</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Twitter className="w-4 h-4 text-white" />
                      <span className="text-base">@neural_link_3d</span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary border border-secondary p-6">
                  <h3 className="text-lg font-bold mb-4 font-bauhaus">LOCATION.DATA</h3>
                  <div className="text-sm text-gray-400">
                    <p>SECTOR: DIGITAL.REALM</p>
                    <p>TIMEZONE: UTC+00:00</p>
                    <p>STATUS: AVAILABLE.FOR.HIRE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-secondary pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 border border-white flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold font-bauhaus text-base">CUADOT</span>
                </div>
                <p className="text-gray-400">
                  Advanced 3D visualization and interactive development studio specializing in cyberpunk aesthetics and
                  futuristic design.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">SERVICES</h4>
                <div className="space-y-2 text-gray-400">
                  <p>3D Modeling & Animation</p>
                  <p>WebGL Development</p>
                  <p>Interactive Experiences</p>
                  <p>Virtual Environments</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">TECHNOLOGIES</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Blender • Maya • ZBrush</p>
                  <p>Three.js • WebGL • React</p>
                  <p>Unreal Engine • Unity</p>
                  <p>Substance Suite</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 font-bauhaus text-base">SYSTEM.INFO</h4>
                <div className="space-y-2 text-gray-400">
                  <p>VERSION: 2.0.24</p>
                  <p>BUILD: {currentTime}</p>
                  <p>LICENSE: CREATIVE.COMMONS</p>
                  <p>© 2025 Cuadot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Home */}
      <div id="home"></div>

      <style jsx>{`
        .glitch-text {
          animation: glitch 0.3s ease-in-out infinite alternate;
        }
        
        .font-bauhaus-pixel-test {
          font-family: var(--font-bauhaus-pixel), 'Impact', 'Arial Black', sans-serif;
        }
        
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #ffffff, -0.05em -0.025em 0 #000000, 0.025em 0.05em 0 #ffffff;
          }
          15% {
            text-shadow: 0.05em 0 0 #ffffff, -0.05em -0.025em 0 #000000, 0.025em 0.05em 0 #ffffff;
          }
          16% {
            text-shadow: -0.05em -0.025em 0 #ffffff, 0.025em 0.025em 0 #000000, -0.05em -0.05em 0 #ffffff;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #ffffff, 0.025em 0.025em 0 #000000, -0.05em -0.05em 0 #ffffff;
          }
          50% {
            text-shadow: 0.025em 0.05em 0 #ffffff, 0.05em 0 0 #000000, 0 -0.05em 0 #ffffff;
          }
          99% {
            text-shadow: 0.025em 0.05em 0 #ffffff, 0.05em 0 0 #000000, 0 -0.05em 0 #ffffff;
          }
          100% {
            text-shadow: -0.025em 0 0 #ffffff, -0.025em -0.025em 0 #000000, -0.025em -0.05em 0 #ffffff;
          }
        }
      `}</style>
    </div>
  )
}
