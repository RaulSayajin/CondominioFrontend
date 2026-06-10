# Use uma imagem leve apenas para servir os arquivos
FROM nginx:alpine

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia a pasta dist que VOCÊ JÁ GEROU no terminal do Codespaces
COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]