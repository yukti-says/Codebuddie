# Server Dockerfile - simple Node production image
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production

# Copy source
COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "index.js"]
