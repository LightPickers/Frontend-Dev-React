import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { TextLarge, TextMedium } from "@components/TextTypography";

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
          {/* 聯絡資訊 */}
          <div className="col-md-6 mb-5 mb-md-0">
            <div className="contact-info">
              {/* 電子郵件 */}
              <div className="mb-4">
                <Link
                  to="mailto:lightpickers6@gmail.com"
                  className="contact-link d-flex align-items-center justify-content-between"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>lightpickers6@gmail.com</span>
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>

              {/* 電話 */}
              <div className="mb-4">
                <Link
                  className="contact-link d-flex align-items-center justify-content-between"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>+886 987-987-987</span>
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>

              {/* 地址 */}
              <div className="mb-4">
                <Link
                  to="https://maps.google.com/?q=台北市六角區六角路888號"
                  className="contact-link d-flex align-items-center justify-content-between"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    台北市六角區六角路888號
                    <br />
                    (週一至週五 11:00 - 21:00)
                  </span>
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* 聯絡表單 */}
          <div className="col-md-6">
            <div className="contact-form-container bg-light p-4 p-md-5 rounded">
              <h3 className="mb-4">想跟我們說的話</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="您的稱呼"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="您的 Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="今天好嗎？隨意留言給我吧"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn w-100 py-2 contact-submit-btn"
                    disabled={isSubmitting}
                  >
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
