import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { Footer } from "../../components/SiteChrome";
type Profile = {
  name: string;
  avatarUrl?: string;
  introduction?: string;
  fanpageUrl?: string;
  websiteUrl?: string;
  zaloContact?: string;
  recommendedLimit?: number;
  slug?: string;
};
export default function AdminProfilePage({
  go,
}: {
  go: (path: string) => void;
}) {
  const token = localStorage.getItem("adminToken");
  const [profile, setProfile] = useState<Profile>({
    name: "",
    avatarUrl: "",
    introduction: "",
    fanpageUrl: "",
    websiteUrl: "",
    zaloContact: "",
    recommendedLimit: 10000000,
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!token) {
      go("/admin/login");
      return;
    }
    fetch("http://localhost:3001/api/admin/me/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(setProfile)
      .catch(() => setMessage("Không tải được hồ sơ."));
  }, [token, go]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/api/admin/me/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    setMessage(data.message || "Đã lưu hồ sơ.");
  };
  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((current) => ({
        ...current,
        avatarUrl: String(reader.result),
      }));
    reader.readAsDataURL(file);
  };
  return (
    <>
      <main className="admin-edit-page">
        <div className="admin-edit-shell">
          <div className="admin-edit-heading">
            <div>
              <span className="section-kicker">Hồ sơ cá nhân</span>
              <h1>Thông tin admin</h1>
            </div>
            <button
              className="outline-btn"
              onClick={() => go(`/admin/${profile.slug || "ga-con-juice"}`)}
            >
              Xem trang công khai <Icon name="arrow" size={16} />
            </button>
          </div>
          <form className="admin-edit-card" onSubmit={submit}>
            <div className="avatar-editor">
              <div className="profile-avatar small">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar hiện tại" />
                ) : (
                  "AD"
                )}
              </div>
              <label className="upload-avatar">
                Đổi avatar
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={uploadAvatar}
                />
              </label>
            </div>
            <div className="admin-edit-fields">
              <label>
                Tên hiển thị
                <input
                  value={profile.name}
                  onChange={(event) =>
                    setProfile({ ...profile, name: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Avatar URL
                <input
                  value={profile.avatarUrl || ""}
                  onChange={(event) =>
                    setProfile({ ...profile, avatarUrl: event.target.value })
                  }
                  placeholder="https://... hoặc tải ảnh lên"
                />
              </label>
              <label>
                Giới thiệu
                <textarea
                  rows={5}
                  value={profile.introduction || ""}
                  onChange={(event) =>
                    setProfile({ ...profile, introduction: event.target.value })
                  }
                />
              </label>
              <div className="form-grid">
                <label>
                  Fanpage
                  <input
                    value={profile.fanpageUrl || ""}
                    onChange={(event) =>
                      setProfile({ ...profile, fanpageUrl: event.target.value })
                    }
                  />
                </label>
                <label>
                  Website
                  <input
                    value={profile.websiteUrl || ""}
                    onChange={(event) =>
                      setProfile({ ...profile, websiteUrl: event.target.value })
                    }
                  />
                </label>
                <label>
                  Zalo
                  <input
                    value={profile.zaloContact || ""}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        zaloContact: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Mức khuyến nghị
                  <input
                    type="number"
                    value={profile.recommendedLimit || 0}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        recommendedLimit: Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>
              {message && <div className="save-message">{message}</div>}
              <button className="primary submit-btn">
                Lưu thay đổi <Icon name="check" size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer go={go} />
    </>
  );
}
