"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) return alert("Vui lòng nhập link!");

    setLoading(true);
    try {
      // Gửi request lấy file nhị phân (blob)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/threads-image?url=${encodeURIComponent(url)}`,
      );

      if (!res.ok) throw new Error("Lỗi khi lấy ảnh");

      const blob = await res.blob();

      // Tạo một link ẩn để kích hoạt trình tải xuống của trình duyệt
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "threads_content.zip"; // Tên file tải về
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Threads Image Downloader</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Dán link Threads vào đây..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "Đang xử lý..." : "Tải toàn bộ ZIP"}
        </button>
      </div>

      {loading && (
        <p>Hệ thống đang cuộn trang và chụp ảnh, vui lòng đợi giây lát...</p>
      )}
    </div>
  );
}
