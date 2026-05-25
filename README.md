# Smart Home Sales Catalog

Công cụ danh mục sản phẩm Smart Home dành cho **Sales & Marketing** — không hiển thị dữ liệu R&D (PCBA, firmware, bo mạch).

## 4 module chính

1. **Tổng quan hệ thống** — Thống kê vai trò, chủng loại, trạng thái bán hàng  
2. **Danh sách sản phẩm** — Bảng CRUD: ảnh, SKU, chủng loại, giao thức, thị trường, specs bán hàng  
3. **Lộ trình thay thế** — Mẫu cũ → Mẫu mới (tư vấn vòng đời)  
4. **Kiểm tra Serial & Vùng** — Hàng quốc tế (hỗ trợ) vs nội địa (từ chối Global)

## Chạy dự án

```bash
npm run install:all
npm run seed
npm run dev
```

Mở **http://localhost:5173**

## Phân loại Sales

- **Vai trò hệ thống:** Hub trung tâm · Ngoại vi (Zigbee/Thread) · Độc lập Wi-Fi/Cloud  
- **Chủng loại:** Công tắc · Ổ cắm · Chiếu sáng · Cảm biến · Rèm · Khóa & Camera  
- **Trạng thái bán hàng:** Sắp ra mắt · Bán chạy · Mẫu cũ · Đã khai tử  

Dữ liệu lưu tại `backend/data/products.json`.
