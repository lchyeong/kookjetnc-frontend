import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { clearAdminAccessToken, hasAdminAccessToken } from '@/features/board/auth';
import { routePaths } from '@/routes/routeRegistry';

import styles from '@/pages/AdminBoardPage.module.scss';

const AdminRouteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!hasAdminAccessToken()) {
    return <Navigate replace state={{ from: location.pathname }} to={routePaths.adminLogin} />;
  }

  const handleLogout = () => {
    clearAdminAccessToken();
    navigate(routePaths.adminLogin, { replace: true });
  };

  return (
    <div className={styles['shell']}>
      <header className={styles['topbar']}>
        <div>
          <p className={styles['eyebrow']}>Admin Board</p>
          <h1 className={styles['title']}>게시판 관리자</h1>
        </div>
        <div className={styles['topbarActions']}>
          <nav className={styles['nav']}>
            <Link className={styles['navLink']} to={routePaths.adminNotices}>
              공지사항
            </Link>
            <Link className={styles['navLink']} to={routePaths.adminResources}>
              자료실
            </Link>
          </nav>
          <Button onClick={handleLogout} type='button' variant='secondary'>
            로그아웃
          </Button>
        </div>
      </header>

      <div className={styles['page']}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRouteLayout;
