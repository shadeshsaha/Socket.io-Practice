<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- (dot) [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh -->

# Environment Setup

1. Create project

   - npm create vite@latest

     - Project Name: realtime_chat_app
     - framework: react
     - variant: javascript

   - npm install

2. Using 'shadcn' Component [docs > installation]

   - 'vite' method
   - Add Tailwind and its configuration
     - npm install -D tailwindcss postcss autoprefixer
     - npx tailwindcss init -p
   - Add 'jsconfig.app.json' file in root directory
   - Update 'vite.config.ts' file

3. Run the CLI

   - npx shadcn-ui@latest init
   - ![](src/assests/Env-Setup.png)

4. You can now start adding components to your project.

   - npx shadcn-ui@latest add button

5. Routing Library
   - npm i react-router-dom
