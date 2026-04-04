import { Outlet } from 'react-router-dom';

import styles from './AdminRootLayout.module.scss';

const AdminRootLayout = () => {
  return (
    <div className={styles['shell']}>
      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRootLayout;
