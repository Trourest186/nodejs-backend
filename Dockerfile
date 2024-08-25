# Chọn hình ảnh Node.js chính thức từ Docker Hub
FROM node:18

# Tạo và đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Expose port mà ứng dụng sẽ chạy
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD [ "node", "server.js" ]
