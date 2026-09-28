import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Evita que Turbopack suba a buscar un lockfile fuera de este repo
  // (este proyecto vive en C:\Users\alcar\dev\Otoch, no dentro de Cerebro Tucan).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
