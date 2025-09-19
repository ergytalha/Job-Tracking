import React from "react";

const Unauthorized = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold text-red-600">Erişim Reddedildi</h1>
      <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
    </div>
  );
};

export default Unauthorized;
