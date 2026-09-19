import { useEffect, useState } from "react";
import { slugify } from "../data/scams";
import Icon from "./Icon";

type ScamNotice = {
  name: string;
  amount: string;
  bank: string;
  date: string;
};

export default function ScamToast({
  go,
  enabled = true,
}: {
  go: (path: string) => void;
  enabled?: boolean;
}) {
  const [notices, setNotices] = useState<ScamNotice[]>([]);
  const [notice, setNotice] = useState<ScamNotice | null>(null);
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(7);

  useEffect(() => {
    if (!enabled) return;
    fetch("http://localhost:3001/api/scams")
      .then((response) => response.json())
      .then((data) => {
        setNotices(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !notices.length) return;
    let index = Math.floor(Math.random() * notices.length);
    const showNext = () => {
      setNotice(notices[index]);
      setRemaining(7);
      setVisible(true);
      index = (index + 1) % notices.length;
    };
    const initialTimer = window.setTimeout(showNext, 1800);
    const interval = window.setInterval(showNext, 12000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [enabled, notices]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setVisible(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [visible]);

  if (!enabled || !notice || !visible) return null;
  return (
    <aside className="scam-toast" role="status" aria-live="polite">
      <button
        className="scam-toast-close"
        aria-label="Đóng thông báo"
        onClick={() => setVisible(false)}
      >
        <Icon name="x" size={15} />
      </button>
      <div className="scam-toast-icon">
        <Icon name="flag" size={18} />
      </div>
      <div className="scam-toast-copy">
        <span className="scam-toast-label">Cảnh báo scam mới</span>
        <strong>{notice.name}</strong>
        <p>
          {notice.amount} · {notice.bank}
        </p>
        <small>{notice.date} · vừa cập nhật</small>
      </div>
      <button
        className="scam-toast-link"
        onClick={() => go(`/scam/${slugify(notice.name)}`)}
      >
        Xem
      </button>
      <div className="scam-toast-progress" aria-hidden="true">
        <span style={{ width: `${(remaining / 7) * 100}%` }} />
      </div>
    </aside>
  );
}
