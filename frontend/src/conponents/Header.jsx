import React from 'react';
import headImage from '../images/image.png';
import { Link } from 'react-router-dom';
import '../css/App.css';

export default function Header() {
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1100,
  };
  return (
    <header className="page-header">
      <a href="#main" className="skip-link">メインコンテンツへスキップ</a>
      <Link to="/">
        <img className="logo" src={headImage} alt="アイコン" />
      </Link>
      <h1 className="circleTitle">東京理科大学サークル情報サイト</h1>
    </header>
  );
}
