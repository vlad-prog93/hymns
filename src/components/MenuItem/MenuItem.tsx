import React from "react";
import { Link } from "react-router-dom";

import style from './MenuItem.module.css'

interface IMenuItemProps {
  link: string,
  text: string
}

const MenuItem = ({ link, text }: IMenuItemProps) => {
  return (
    <li className={style.item}>
      <Link className={style.link} to={link}>{text}</Link>
    </li>
  )
}

export default MenuItem