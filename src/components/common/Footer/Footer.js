import React from 'react'; 
import styles from './Footer.scss'; 
import classNames from 'classnames/bind'; 
import { Link } from 'react-router-dom'; 

const cx = classNames.bind(styles); 
const Footer = () => ( 
  <footer className={cx('footer')}> 
    <div className={cx('header-content')}> 
      <div className={cx('brand')}> 
        <Link to="/">reactblog</Link>
      </div> 
      <div className={cx('admin-login')}>관리자 로그인
      </div> 
    </div> 
  </footer> 
);

export default Footer;