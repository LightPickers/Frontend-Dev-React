import React, { useState } from "react";
// import { Link } from "react-router-dom"; // 暫時不需要，已註解
import { toast } from "react-toastify";

// import { TextLarge, TextMedium } from "@components/TextTypography"; // 暫時不需要，已註解

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("請填寫所有必填欄位");
      return;
    }

    setIsSubmitting(true);

    try {
      // 模擬API請求
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("訊息已送出，我們會盡快回覆您");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      toast.error("送出訊息時發生錯誤，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page py-6">
      <div className="container py-4">
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3">與拾光堂聯繫</h1>
          <p className="text-muted">如有需求，請填寫表單或至粉專聯繫我們</p>
        </div>

        <div className="row">
          {/* 使用新增的 contact-form-wrapper 類實現置中和響應式寬度 */}
          <div className="contact-form-wrapper">
            <div className="contact-form-container">
              <h3>想跟我們說的話</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="您的稱呼"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="您的 Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="今天好嗎？隨意留言給我吧"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="text-center">
                  <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "送出留言中..." : "送出留言"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
