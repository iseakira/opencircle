import React from 'react';
// import React,{ useState } from 'react'

export default function Footer() {
  const fotterStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
  };
  return (
    <footer style={fotterStyle} className="footer">
      <p>created by 東京理科大学情報計算学科3年</p>
      <a href="https://www.tus.ac.jp/" target="_blank">
        東京理科大学ホームページ
      </a>
    </footer>
  );
}
