FROM node:20-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice \
    qpdf \
    python3 \
    python3-pip \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN python3 -m pip install --break-system-packages pdf2docx || true
RUN npm run build

ENV NODE_ENV=production
ENV PDF_TOOLS_TMP_DIR=/tmp/pdf-tools
ENV GS_BINARY=gs
ENV LIBREOFFICE_BINARY=soffice
ENV PYTHON_BINARY=python3

EXPOSE 3000
CMD ["npm", "start"]
