import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => {
  const { API_PORT } = loadEnv(mode, process.cwd(), "API_PORT");
  const apiTarget = `http://127.0.0.1:${API_PORT || 3001}`;

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      host: true,
      proxy: { "/api": apiTarget },
    },
  };
});
