# Brug Node som base
FROM node:20.19.0-slim

# Arbejdsmappe i containeren
WORKDIR /app

# Sørg for at devDependencies også installeres
ENV NODE_ENV=development

# Kopiér både package.json og package-lock.json
COPY package.json package-lock.json ./

RUN npm install --include=dev
RUN npm install @rollup/rollup-linux-x64-gnu --include=dev

# Kopiér resten af frontend-projektet
COPY . .

# Eksponer porten Vite kører på
EXPOSE 3000

# Start Vite dev-server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]