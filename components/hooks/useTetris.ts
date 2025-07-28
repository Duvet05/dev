import { useState, useEffect, useCallback } from 'react';

// Definir las piezas de Tetris
const PIECES = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
};

const PIECE_COLORS = {
  I: '#00FFFF',
  O: '#FFFF00',
  T: '#800080',
  S: '#00FF00',
  Z: '#FF0000',
  J: '#0000FF',
  L: '#FFA500'
};

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  position: Position;
  type: keyof typeof PIECES;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

export const useTetris = () => {
  const [board, setBoard] = useState<(string | null)[][]>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<keyof typeof PIECES | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  // Generar pieza aleatoria
  const generateRandomPiece = useCallback((): keyof typeof PIECES => {
    const pieceTypes = Object.keys(PIECES) as (keyof typeof PIECES)[];
    return pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  }, []);

  // Crear nueva pieza
  const createPiece = useCallback((type: keyof typeof PIECES): Piece => {
    return {
      shape: PIECES[type],
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[type][0].length / 2), y: 0 },
      type
    };
  }, []);

  // Verificar colisión
  const checkCollision = useCallback((piece: Piece, board: (string | null)[][], deltaX = 0, deltaY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x + deltaX;
          const newY = piece.position.y + y + deltaY;
          
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotar pieza
  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Colocar pieza en el tablero
  const placePiece = useCallback((piece: Piece, board: (string | null)[][]) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = PIECE_COLORS[piece.type];
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  // Limpiar líneas completas
  const clearLines = useCallback((board: (string | null)[][]) => {
    const newBoard = board.filter(row => row.some(cell => cell === null));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    // Agregar líneas vacías al principio
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, linesCleared };
  }, []);

  // Mover pieza
  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    if (!currentPiece || gameOver) return;
    
    if (!checkCollision(currentPiece, board, deltaX, deltaY)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        position: { x: prev.position.x + deltaX, y: prev.position.y + deltaY }
      } : null);
    }
  }, [currentPiece, board, gameOver, checkCollision]);

  // Rotar pieza actual
  const rotate = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, board, gameOver, rotatePiece, checkCollision]);

  // Drop rápido
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    let dropDistance = 0;
    while (!checkCollision(currentPiece, board, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    setCurrentPiece(prev => prev ? {
      ...prev,
      position: { ...prev.position, y: prev.position.y + dropDistance }
    } : null);
  }, [currentPiece, board, gameOver, checkCollision]);

  // Inicializar juego
  const startGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
    const firstPieceType = generateRandomPiece();
    const secondPieceType = generateRandomPiece();
    
    setBoard(newBoard);
    setCurrentPiece(createPiece(firstPieceType));
    setNextPiece(secondPieceType);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPlaying(true);
    setDropTime(1000);
  }, [generateRandomPiece, createPiece]);

  // Pausar/reanudar
  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPlaying(prev => !prev);
    }
  }, [gameOver]);

  // Efecto de caída automática
  useEffect(() => {
    if (!isPlaying || gameOver || !currentPiece) return;

    const interval = setInterval(() => {
      if (!checkCollision(currentPiece, board, 0, 1)) {
        setCurrentPiece(prev => prev ? {
          ...prev,
          position: { ...prev.position, y: prev.position.y + 1 }
        } : null);
      } else {
        // Colocar pieza y generar nueva
        const newBoard = placePiece(currentPiece, board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        setBoard(clearedBoard);
        setLines(prev => prev + linesCleared);
        setScore(prev => prev + (linesCleared * 100 * level));
        
        // Aumentar nivel cada 10 líneas
        const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
        }
        
        // Generar nueva pieza
        if (nextPiece) {
          const newPiece = createPiece(nextPiece);
          if (checkCollision(newPiece, clearedBoard)) {
            setGameOver(true);
            setIsPlaying(false);
          } else {
            setCurrentPiece(newPiece);
            setNextPiece(generateRandomPiece());
          }
        }
      }
    }, dropTime);

    return () => clearInterval(interval);
  }, [
    isPlaying, gameOver, currentPiece, board, dropTime, level, lines,
    checkCollision, placePiece, clearLines, createPiece, generateRandomPiece, nextPiece
  ]);

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    lines,
    gameOver,
    isPlaying,
    startGame,
    togglePause,
    movePiece,
    rotate,
    hardDrop
  };
};
