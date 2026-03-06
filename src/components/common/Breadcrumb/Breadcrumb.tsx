import React from "react";
import Link from "next/link";
import styles from "./Breadcrumb.module.css";
import { HomeIcon } from "../../../lib/icons";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  return (
    <ul className={styles.breadcrumb}>
      <li>
        <Link href="/">
          <HomeIcon />
          Home
        </Link>
      </li>

      {items.map((item, i) => (
        <li key={i}>
          {i < items.length ? ">" : null}

          <Link href={item.href}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;
