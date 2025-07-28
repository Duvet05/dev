import React, { useEffect, useCallback } from 'react';
import { useTetris } from './hooks/useTetris';
import { Play, Pause, RotateCw, ArrowDown } from 'lucide-react';
import { WindowHeader } from './layout/WindowHeader';

interface TetrisGameProps {
  onClose: () => void;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({ onClose }) => {
  const {
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
  } = useTetris();

  // Renderizar tablero con pieza actual
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Agregar pieza actual al tablero visual
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = getPieceColor(currentPiece.type);
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  const getPieceColor = (pieceType: string) => {
    const colors: { [key: string]: string } = {
      'I': '#00FFFF',
      'O': '#FFFF00',
      'T': '#800080',
      'S': '#00FF00',
      'Z': '#FF0000',
      'J': '#0000FF',
      'L': '#FFA500'
    };
    return colors[pieceType] || '#FFFFFF';
  };

  // Renderizar siguiente pieza
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const pieces: { [key: string]: number[][] } = {
      'I': [[1, 1, 1, 1]],
      'O': [[1, 1], [1, 1]],
      'T': [[0, 1, 0], [1, 1, 1]],
      'S': [[0, 1, 1], [1, 1, 0]],
      'Z': [[1, 1, 0], [0, 1, 1]],
      'J': [[1, 0, 0], [1, 1, 1]],
      'L': [[0, 0, 1], [1, 1, 1]]
    };
    
    const shape = pieces[nextPiece];
    const color = getPieceColor(nextPiece);
    
    return (
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape[0].length}, minmax(0, 1fr))` }}>
        {shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="w-4 h-4 border border-gray-600"
              style={{
                backgroundColor: cell ? color : 'transparent'
              }}
            />
          ))
        )}
      </div>
    );
  };

  // Controles de teclado
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        movePiece(1, 0);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        movePiece(0, 1);
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        rotate();
        break;
      case ' ':
        event.preventDefault();
        hardDrop();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        togglePause();
        break;
    }
  }, [isPlaying, gameOver, movePiece, rotate, hardDrop, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Auto-iniciar el juego
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-primary border border-secondary max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <WindowHeader title="TETRIS.EXE" onClose={onClose} />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-primary">
          {/* Panel de información */}
          <div className="space-y-4 order-2 lg:order-1">
            <div className="bg-black border border-secondary p-4">
              <h3 className="text-secondary text-sm mb-2 font-vt323">STATS</h3>
              <div className="space-y-1 text-white font-vt323 text-sm">
                <div>SCORE: {score.toLocaleString()}</div>
                <div>LEVEL: {level}</div>
                <div>LINES: {lines}</div>
              </div>
            </div>

            <div className="bg-black border border-secondary p-4">
              <h3 className="text-secondary text-sm mb-2 font-vt323">NEXT</h3>
              <div className="flex justify-center">
                {renderNextPiece()}
              </div>
            </div>

            <div className="bg-black border border-secondary p-4">
              <h3 className="text-secondary text-sm mb-2 font-vt323">CONTROLS</h3>
              <div className="space-y-1 text-white font-vt323 text-xs">
                <div>← → ↓ : MOVE</div>
                <div>↑ : ROTATE</div>
                <div>SPACE : DROP</div>
                <div>P : PAUSE</div>
              </div>
            </div>

            {/* Controles móviles */}
            <div className="lg:hidden grid grid-cols-3 gap-2">
              <button
                onTouchStart={() => movePiece(-1, 0)}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                ←
              </button>
              <button
                onTouchStart={rotate}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                <RotateCw className="w-4 h-4 mx-auto" />
              </button>
              <button
                onTouchStart={() => movePiece(1, 0)}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                →
              </button>
              <button
                onTouchStart={hardDrop}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                DROP
              </button>
              <button
                onTouchStart={() => movePiece(0, 1)}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                <ArrowDown className="w-4 h-4 mx-auto" />
              </button>
              <button
                onTouchStart={togglePause}
                className="bg-secondary text-primary p-2 border border-gray-600 font-vt323 text-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 mx-auto" /> : <Play className="w-4 h-4 mx-auto" />}
              </button>
            </div>
          </div>

          {/* Tablero de juego */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col items-center">
            <div className="bg-black border border-secondary p-2 mb-4 w-fit">
              <div 
                className="grid gap-0.5"
                style={{ 
                  gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                  aspectRatio: '10/20'
                }}
              >
                {renderBoard().map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border border-gray-700"
                      style={{
                        backgroundColor: cell || '#000000'
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Estado del juego */}
            {gameOver && (
              <div className="text-center">
                <div className="text-red-500 font-vt323 text-xl mb-2">GAME OVER</div>
                <button
                  onClick={startGame}
                  className="bg-secondary text-primary px-4 py-2 border border-gray-600 font-vt323 hover:bg-white"
                >
                  RESTART
                </button>
              </div>
            )}

            {!isPlaying && !gameOver && (
              <div className="text-center">
                <div className="text-yellow-500 font-vt323 text-xl mb-2">PAUSED</div>
                <button
                  onClick={togglePause}
                  className="bg-secondary text-primary px-4 py-2 border border-gray-600 font-vt323 hover:bg-white"
                >
                  RESUME
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
