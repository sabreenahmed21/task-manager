
"use client";

import { useState, useEffect } from "react";

export default function NetworkStatus({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // تحديث الحالة عند تغيّر الاتصال
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // إضافة مستمعين للأحداث
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // تحديث الحالة عند تحميل الصفحة
    updateOnlineStatus();

    // تنظيف المستمعين عند إلغاء المكون
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // إذا كان الاتصال غير متوفر، عرض رسالة "لا يوجد اتصال"
  if (!isOnline) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
          textAlign: "center",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك وإعادة المحاولة.
      </div>
    );
  }

  // إذا كان الاتصال متوفرًا، عرض محتوى الموقع بشكل طبيعي
  return <>{children}</>;
}