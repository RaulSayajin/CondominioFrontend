# Estágio de servidor: Nginx para servir o conteúdo estático
FROM nginx:alpine

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no build (Vite gera na pasta 'dist')
# Para servir via Nginx, os arquivos devem estar em /usr/share/nginx/html
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]