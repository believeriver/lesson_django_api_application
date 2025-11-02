import React from 'react'
import { Link } from "react-router-dom";

const Menu: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">ホーム</Link></li>
        <li><Link to="/insta_clone">SNS clone</Link></li>
        <li><Link to="/hosehold">家計簿アプリ</Link></li>
      </ul>
    </nav>
  )
}

export default Menu