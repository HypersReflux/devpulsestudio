"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GameShell from "@/components/GameShell";

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const SIZE = 20;
    const TILE = 20;

    let state = "start";
    let shake = 0;

    let snake: any[] = [];
    let dir = { x: 1, y: 0 };
    let food = { x: 5, y: 5 };

    let score = 0;
    let lives = 3;

    const reset = () => {
      snake = [{ x: 10, y: 10 }];
      dir = { x: 1, y: 0 };
      food = { x: 5, y: 5 };
      score = 0;
      lives = 3;
      state = "start";
    };

    reset();

    window.addEventListener("keydown", (e) => {
      if (e.key === "w" && state === "start") state = "playing";
      if (e.key === "r" && state === "gameover") reset();

      if (e.key === "w") dir = { x: 0, y: -1 };
      if (e.key === "s") dir = { x: 0, y: 1 };
      if (e.key === "a") dir = { x: -1, y: 0 };
      if (e.key === "d") dir = { x: 1, y: 0 };
    });

    const loop = () => {
      ctx.save();

      if (shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * shake,
          (Math.random() - 0.5) * shake
        );
        shake *= 0.9;
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 400, 400);

      if (state === "start") {
        ctx.fillStyle = "white";
        ctx.fillText("Press W to Start", 130, 200);
        ctx.restore();
        requestAnimationFrame(loop);
        return;
      }

      if (state === "gameover") {
        ctx.fillText("GAME OVER", 140, 180);
        ctx.fillText("Press R to Restart", 110, 210);
        ctx.restore();
        requestAnimationFrame(loop);
        return;
      }

      const head = {
        x: snake[0].x + dir.x,
        y: snake[0].y + dir.y,
      };

      // bounds
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= SIZE ||
        head.y >= SIZE
      ) {
        lives--;
        shake = 10;
        snake = [{ x: 10, y: 10 }];
        if (lives <= 0) state = "gameover";
        requestAnimationFrame(loop);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 5;
        food = {
          x: Math.floor(Math.random() * SIZE),
          y: Math.floor(Math.random() * SIZE),
        };
      } else {
        snake.pop();
      }

      // draw snake
      ctx.fillStyle = "lime";
      snake.forEach((s) =>
        ctx.fillRect(s.x * TILE, s.y * TILE, TILE, TILE)
      );

      // food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x * TILE, food.y * TILE, TILE, TILE);

      // UI
      ctx.fillStyle = "white";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText(score.toString(), 200, 40);

      ctx.restore();
      setTimeout(loop, 100);
    };

    loop();
  }, []);

  return (
  <>
    <Navbar />
    <GameShell title="Snake">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border border-gray-600 rounded w-full max-w-[500px] aspect-square"
        />
      </div>
    </GameShell>
  </>
);
}