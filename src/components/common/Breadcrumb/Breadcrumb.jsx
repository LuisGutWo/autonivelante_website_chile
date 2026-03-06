import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';
import { HomeIcon } from '../../../lib/icons';

export const Breadcrumb = (props) => {
    const { items = [] } = props;

    return (
        <ul className={styles.breadcrumb}>
            <li>
                <Link href="/">
                    <HomeIcon />
                    Home
                </Link>
            </li>

            { items.map((item, i) => 
                <li key={i}>
                    { i < items.length ? '>' : null }

                    <Link href={item.href}>
                        { item.name }
                    </Link>
                </li>
            )}
        </ul>
    );
}

export default Breadcrumb;
