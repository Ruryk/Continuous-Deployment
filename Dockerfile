# Вибір базового образу Node.js
FROM node:18

# Створення робочої директорії
WORKDIR /usr/src/app

# Копіювання package.json та package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всіх файлів проекту
COPY . .

# Команда для запуску скрипту
CMD ["node", "import.js"]
