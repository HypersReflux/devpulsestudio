"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GameShell from "@/components/GameShell";

export default function Asteroids() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const W = 400;
    const H = 400;

    let state = "start";
    let shake = 0;

    let ship = { x: 200, y: 200, angle: 0 };
    let bullets: any[] = [];
    let asteroids: any[] = [];

    let score = 0;
    let lives = 3;
    let cooldown = 0;

    const reset = () => {
      ship = { x: 200, y: 200, angle: 0 };
      bullets = [];
      asteroids = Array.from({ length: 5 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
      }));
      score = 0;
      lives = 3;
      state = "start";
    };

    reset();

    const keys: any = {};
    window.addEventListener("keydown", (e) => {
      keys[e.key] = true;

      if (e.key.toLowerCase() === "w" && state === "start") {
        state = "playing";
      }

      if (e.key.toLowerCase() === "r" && state === "gameover") {
        reset();
      }
    });

    window.addEventListener("keyup", (e) => (keys[e.key] = false));

    const loop = () => {
      ctx.save();

      // screen shake
      if (shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * shake,
          (Math.random() - 0.5) * shake
        );
        shake *= 0.9;
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);

      if (state === "start") {
        ctx.fillStyle = "white";
        ctx.fillText("Press W to Start", 130, 200);
        ctx.restore();
        requestAnimationFrame(loop);
        return;
      }

      if (state === "gameover") {
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER", 140, 180);
        ctx.fillText("Press R to Restart", 110, 210);
        ctx.restore();
        requestAnimationFrame(loop);
        return;
      }

      // movement
      if (keys["a"]) ship.angle -= 0.1;
      if (keys["d"]) ship.angle += 0.1;
      if (keys["w"]) {
        ship.x += Math.cos(ship.angle) * 2;
        ship.y += Math.sin(ship.angle) * 2;
      }

      // wrap
      if (ship.x < 0) ship.x = W;
      if (ship.x > W) ship.x = 0;
      if (ship.y < 0) ship.y = H;
      if (ship.y > H) ship.y = 0;

      // shooting
      if (keys[" "] && cooldown === 0) {
        bullets.push({
          x: ship.x,
          y: ship.y,
          dx: Math.cos(ship.angle) * 6,
          dy: Math.sin(ship.angle) * 6,
        });
        cooldown = 10;
      }
      if (cooldown > 0) cooldown--;

      // bullets
      bullets = bullets.filter((b) => {
        b.x += b.dx;
        b.y += b.dy;
        ctx.fillStyle = "white";
        ctx.fillRect(b.x, b.y, 3, 3);
        return b.x > 0 && b.x < W && b.y > 0 && b.y < H;
      });

      // asteroids
      asteroids.forEach((a, i) => {
        a.x += a.dx;
        a.y += a.dy;

        if (a.x < 0) a.x = W;
        if (a.x > W) a.x = 0;
        if (a.y < 0) a.y = H;
        if (a.y > H) a.y = 0;

        ctx.beginPath();
        ctx.arc(a.x, a.y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = "gray";
        ctx.stroke();

        // hit ship
        if (Math.abs(a.x - ship.x) < 20 && Math.abs(a.y - ship.y) < 20) {
          lives--;
          shake = 10;
          ship.x = 200;
          ship.y = 200;
          if (lives <= 0) state = "gameover";
        }

        // hit by bullet
        bullets.forEach((b, bi) => {
          if (Math.abs(a.x - b.x) < 20 && Math.abs(a.y - b.y) < 20) {
            asteroids.splice(i, 1);
            bullets.splice(bi, 1);
            score += 10;
            shake = 6;

            asteroids.push({
              x: Math.random() * W,
              y: Math.random() * H,
              dx: Math.random() * 2 - 1,
              dy: Math.random() * 2 - 1,
            });
          }
        });
      });

      // ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, 7);
      ctx.lineTo(-10, -7);
      ctx.closePath();
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();

      // UI
      ctx.fillStyle = "white";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText(score.toString(), 200, 40);

      ctx.restore();
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
  <>
    <Navbar />
    <GameShell title="Asteroids">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border border-gray-600 rounded w-full max-w-[400px] aspect-square"
        />
      </div>
    </GameShell>
  </>
);
}