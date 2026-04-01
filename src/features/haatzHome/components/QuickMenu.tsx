import type { MouseEvent } from 'react';

import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon';
import { quickLinks } from '@/features/haatzHome/data';

import styles from './QuickMenu.module.scss';

const handlePlaceholderLinkClick = (
  event: MouseEvent<HTMLAnchorElement>,
  isPlaceholder?: boolean,
) => {
  if (!isPlaceholder) {
    return;
  }

  event.preventDefault();
};

const QuickMenu = () => {
  return (
    <div className={styles['quickMenu']}>
      <ul className={styles['linkList']}>
        {quickLinks.map((item) => {
          return (
            <li key={item.id}>
              <a
                aria-disabled={item.isPlaceholder || undefined}
                href={item.href}
                onClick={(event) => {
                  handlePlaceholderLinkClick(event, item.isPlaceholder);
                }}
                target={item.target}
              >
                <img alt={item.imageAlt} src={item.imageSrc} />
                <span>
                  {item.lines.map((line) => {
                    return (
                      <span className={styles['line']} key={line}>
                        {line}
                      </span>
                    );
                  })}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <button
        aria-label='페이지 상단으로 이동'
        className={styles['topButton']}
        onClick={() => {
          window.scrollTo({
            behavior: 'smooth',
            top: 0,
          });
        }}
        type='button'
      >
        <ChevronDownIcon aria-hidden='true' className={styles['topIcon']} />
      </button>
    </div>
  );
};

export default QuickMenu;
