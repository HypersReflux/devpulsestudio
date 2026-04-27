"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GameShell from "@/components/GameShell";

export default function Flappy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let bird = { y: 200, velocity: 0 };
    let pipes: any[] = [];

    let gravity = 0.25;
    let jumpStrength = -6;

    let started = false;
    let score = 0;
    let frame = 0;

    const jump = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "w") return;

      if (!started) {
        started = true;
      }

      bird.velocity = jumpStrength;
    };

    window.addEventListener("keydown", jump);

    const loop = () => {
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, 400, 400);

      // 🟡 WAIT STATE
      if (!started) {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Press W to Start", 130, 200);

        ctx.fillStyle = "yellow";
        ctx.fillRect(50, bird.y, 20, 20);

        requestAnimationFrame(loop);
        return;
      }

      // physics
      bird.velocity += gravity;
      bird.y += bird.velocity;

      // bounds
      if (bird.y < 0) bird.y = 0;
      if (bird.y > 380) {
        // reset game
        bird.y = 200;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        started = false;
        frame = 0;
      }

      // pipe spawn (clean spacing)
      if (frame % 140 === 0) {
        const gap = 130;
        const top = Math.random() * 180 + 20;

        pipes.push({
          x: 400,
          top,
          bottom: top + gap,
          passed: false,
        });
      }

      frame++;

      pipes.forEach((p) => {
        p.x -= 2;

        ctx.fillStyle = "green";
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillRect(p.x, p.bottom, 40, 400);

        // collision
        if (
          50 < p.x + 40 &&
          50 > p.x &&
          (bird.y < p.top || bird.y > p.bottom)
        ) {
          bird.y = 200;
          bird.velocity = 0;
          pipes = [];
          score = 0;
          started = false;
          frame = 0;
        }

        // score tracking
        if (!p.passed && p.x < 50) {
          score++;
          p.passed = true;
        }
      });

      // bird
      ctx.fillStyle = "yellow";
      ctx.fillRect(50, bird.y, 20, 20);

      // 🔥 BIG CENTER SCORE
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText(score.toString(), 200, 60);

      requestAnimationFrame(loop);
    };

    loop();

    return () => window.removeEventListener("keydown", jump);
  }, []);

  return (
  <>
    <Navbar />
    <GameShell title="Flappy Bird">
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