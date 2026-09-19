import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { Footer } from "../../components/SiteChrome";

type Service = { name: string; slug: string; imageUrl?: string };
type Profile = {
  id: number;
  name: string;
  slug: string;
  avatarUrl?: string;
  introduction?: string;
  fanpageUrl?: string;
  websiteUrl?: string;
  zaloContact?: string;
  recommendedLimit?: number;
  verified?: boolean;
  banks: Array<{
    id: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
  services: Service[];
  reviews: Array<{
    reviewerName: string;
    rating: number;
    content: string;
    createdAt: string;
    messages?: number;
  }>;
};

export default function AdminDetailPage({
  slug,
  go,
}: {
  slug: string;
  go: (path: string) => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setProfile(null);
    setError("");
    fetch(`http://localhost:3001/api/admins/${slug}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.name) {
          throw new Error(data.message || "Không tìm thấy hồ sơ admin.");
        }
        setProfile({
          ...data,
          banks: Array.isArray(data.banks) ? data.banks : [],
          services: Array.isArray(data.services) ? data.services : [],
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        });
      })
      .catch((reason: Error) => setError(reason.message));
  }, [slug]);
  if (error)
    return (
      <main className="admin-profile-loading">
        <h1>Không thể tải hồ sơ admin</h1>
        <p>{error}</p>
        <button className="primary" onClick={() => go("/list/admin")}>
          Quay lại danh sách
        </button>
      </main>
    );
  if (!profile)
    return (
      <main className="admin-profile-loading">Đang tải hồ sơ admin...</main>
    );
  return (
    <>
      <main className="admin-profile-page">
        <div className="container admin-profile-shell">
          <button className="back-link" onClick={() => go("/list/admin")}>
            ← Quay lại danh sách admin
          </button>
          <div className="admin-profile-grid">
            <aside className="admin-profile-sidebar">
              <div className="profile-avatar">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} />
                ) : (
                  <span>
                    {profile.name
                      .split(" ")
                      .filter(Boolean)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                )}
              </div>
              <h1>{profile.name}</h1>
              <p className="profile-rating">Đánh giá (2.5)</p>
              <div className="profile-stars" aria-label="Đánh giá 2.5 trên 5">
                ★★★☆☆
              </div>
              <div className="profile-buttons">
                <a
                  href={profile.fanpageUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
                <a
                  href={
                    profile.zaloContact
                      ? `https://zalo.me/${profile.zaloContact}`
                      : "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Zalo
                </a>
              </div>
              <dl className="profile-contact">
                <div>
                  <dt>Fanpage:</dt>
                  <dd>
                    {profile.fanpageUrl ? "Đã cập nhật" : "Chưa cập nhật"}
                  </dd>
                </div>
                <div>
                  <dt>Website:</dt>
                  <dd>{profile.websiteUrl || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt>Zalo:</dt>
                  <dd>{profile.zaloContact || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt>Giấy tờ:</dt>
                  <dd className="verified-text">
                    {profile.verified ? "Đã xác minh" : "Đang chờ xác minh"}
                  </dd>
                </div>
              </dl>
              <div className="profile-limit">
                Khuyến nghị giao dịch dưới
                <strong>
                  {Number(profile.recommendedLimit || 0).toLocaleString(
                    "vi-VN",
                  )}{" "}
                  VND
                </strong>
              </div>
            </aside>
            <section className="admin-profile-content">
              <section className="profile-section intro-section">
                <h2>Giới thiệu</h2>
                {(profile.introduction || "Chưa có giới thiệu")
                  .split("\n")
                  .map((line) => (
                    <p key={line}>{line}</p>
                  ))}
              </section>
              <section className="profile-section profile-bank-section">
                <h2>Tài khoản ngân hàng</h2>
                <div className="table-wrap profile-table-wrap">
                  <table className="profile-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngân hàng</th>
                        <th>STK</th>
                        <th>Chủ TK</th>
                        <th>Cập nhật</th>
                        <th>Trạng thái</th>
                        <th>Mã QR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.banks.map((bank, index) => (
                        <tr key={bank.id}>
                          <td>{index + 1}</td>
                          <td>{bank.bankName}</td>
                          <td>{bank.accountNumber}</td>
                          <td>{bank.accountHolder}</td>
                          <td>03/09/2026</td>
                          <td>Bật</td>
                          <td>▦</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="profile-section">
                <h2>Các dịch vụ</h2>
                <div className="profile-services">
                  {profile.services.map((service) => (
                    <article className="profile-service" key={service.slug}>
                      <img
                        src={service.imageUrl || "/assets/image_56771365.png"}
                        alt={service.name}
                      />
                      <span>{service.name}</span>
                    </article>
                  ))}
                </div>
              </section>
              <section className="profile-section reviews-section">
                <h2>Đánh giá</h2>
                {profile.reviews.map((review) => (
                  <article
                    className="review-card"
                    key={`${review.reviewerName}-${review.createdAt}`}
                  >
                    <div className="review-author">
                      {review.reviewerName.slice(0, 1)}
                    </div>
                    <div className="review-body">
                      <div className="review-meta">
                        <b>{review.reviewerName}</b>
                        <span>{review.createdAt}</span>
                      </div>
                      <div className="profile-stars review-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <p>{review.content}</p>
                    </div>
                  </article>
                ))}
              </section>
            </section>
          </div>
        </div>
      </main>
      <Footer go={go} />
    </>
  );
}
