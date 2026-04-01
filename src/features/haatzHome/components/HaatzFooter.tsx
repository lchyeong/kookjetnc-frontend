import {
  footerInfoItems,
  footerPolicyLinks,
  headerAssets,
  headerMenuGroups,
} from '@/features/haatzHome/data';
import { classNames } from '@/utils/classNames';

import styles from './HaatzFooter.module.scss';

interface HaatzFooterProps {
  className?: string;
}

const companyInfoItems = footerInfoItems.filter((item) => {
  return item.label === '상호' || item.label === '대표자' || item.label === '주소';
});

const businessInfoItems = footerInfoItems.filter((item) => {
  return (
    item.label === 'TEL' ||
    item.label === 'FAX' ||
    item.label === 'E-MAIL' ||
    item.label === '사업자등록번호'
  );
});

const footerPrimaryMenuLabels = headerMenuGroups.map((group) => {
  return group.label;
});

const HaatzFooter = ({ className }: HaatzFooterProps) => {
  return (
    <footer className={classNames(styles['footer'], className)}>
      <div className={styles['inner']}>
        <div className={styles['topRow']}>
          <ul className={styles['primaryMenuList']}>
            {footerPrimaryMenuLabels.map((label) => {
              return (
                <li key={label}>
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>

          <ul className={styles['policyList']}>
            {footerPolicyLinks.map((item) => {
              return (
                <li key={item.label}>
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles['middleRow']}>
          <div className={styles['logoBox']}>
            <img alt={headerAssets.logoAlt} src={headerAssets.logo} />
          </div>

          <div className={styles['infoGroupList']}>
            <ul className={styles['infoList']}>
              {companyInfoItems.map((item) => {
                return (
                  <li key={item.label}>
                    <span className={styles['infoLabel']}>{item.label} :</span>
                    <span className={styles['infoValue']}>{item.value}</span>
                  </li>
                );
              })}
            </ul>

            <ul className={styles['infoList']}>
              {businessInfoItems.map((item) => {
                return (
                  <li key={item.label}>
                    <span className={styles['infoLabel']}>{item.label} :</span>
                    <span className={styles['infoValue']}>{item.value}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className={styles['bottomRow']}>
          <p>Copyright ⓒ 2024 ㈜국제티엔씨. All Right Reserved.</p>
          <a href='https://www.newzeststudio.com' rel='noreferrer' target='_blank'>
            Built By newzest studio.
          </a>
        </div>
      </div>
    </footer>
  );
};

export default HaatzFooter;
