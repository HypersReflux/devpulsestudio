"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GameShell from "@/components/GameShell";

export default function Invaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const W = 400;
    const H = 400;

    let state = "start";
    let shake = 0;

    let player = { x: 180 };
    let bullets: any[] = [];
    let enemyBullets: any[] = [];
    let enemies: any[] = [];

    let direction = 1;
    let canDrop = true;

    let score = 0;
    let lives = 3;
    let cooldown = 0;

    const reset = () => {
      player = { x: 180 };
      bullets = [];
      enemyBullets = [];

      enemies = Array.from({ length: 20 }, (_, i) => ({
        x: (i % 10) * 35,
        y: Math.floor(i / 10) * 30,
      }));

      direction = 1;
      canDrop = true;
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

      // player movement
      if (keys["a"]) player.x -= 4;
      if (keys["d"]) player.x += 4;

      if (player.x < 0) player.x = 0;
      if (player.x > 380) player.x = 380;

      // player shooting
      if (keys[" "] && cooldown === 0) {
        bullets.push({ x: player.x + 10, y: 350 });
        cooldown = 15;
      }
      if (cooldown > 0) cooldown--;

      // bullets
      bullets = bullets.filter((b) => {
        b.y -= 5;
        ctx.fillStyle = "white";
        ctx.fillRect(b.x, b.y, 3, 8);
        return b.y > 0;
      });

      // 🔫 ENEMY SHOOTING
      if (Math.random() < 0.02 && enemies.length > 0) {
        const shooter = enemies[Math.floor(Math.random() * enemies.length)];
        enemyBullets.push({
          x: shooter.x + 10,
          y: shooter.y + 20,
        });
      }

      // enemy bullets
      enemyBullets = enemyBullets.filter((b) => {
        b.y += 4;

        ctx.fillStyle = "red";
        ctx.fillRect(b.x, b.y, 3, 8);

        // hit player
        if (
          b.x > player.x &&
          b.x < player.x + 20 &&
          b.y > 360 &&
          b.y < 380
        ) {
          lives--;
          shake = 10;

          if (lives <= 0) state = "gameover";

          return false;
        }

        return b.y < H;
      });

      // enemy movement
      let hitEdge = false;

      enemies.forEach((e) => {
        e.x += 0.5 * direction;

        if (e.x <= 0 || e.x >= 380) {
          hitEdge = true;
        }
      });

      if (hitEdge && canDrop) {
        direction *= -1;
        enemies.forEach((e) => (e.y += 20));
        canDrop = false;
      }

      if (!hitEdge) {
        canDrop = true;
      }

      // draw + collisions
      enemies = enemies.filter((e) => {
        ctx.fillStyle = "lime";
        ctx.fillRect(e.x, e.y, 20, 20);

        if (e.y > 340) {
          lives--;
          shake = 10;
          if (lives <= 0) state = "gameover";
          return false;
        }

        return !bullets.some((b, bi) => {
          if (
            b.x > e.x &&
            b.x < e.x + 20 &&
            b.y > e.y &&
            b.y < e.y + 20
          ) {
            bullets.splice(bi, 1);
            score += 10;
            shake = 5;
            return true;
          }
        });
      });

      // respawn wave
      if (enemies.length === 0) {
        enemies = Array.from({ length: 20 }, (_, i) => ({
          x: (i % 10) * 35,
          y: Math.floor(i / 10) * 30,
        }));

        direction = 1;
        canDrop = true;
      }

      // player
      ctx.fillStyle = "red";
      ctx.fillRect(player.x, 360, 20, 20);

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
      <GameShell title="Space Invaders">
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