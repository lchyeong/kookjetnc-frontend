import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { logoutAdminSession } from '@/features/board/api';
import { clearAdminAccessToken, hasAdminAccessToken } from '@/features/board/auth';
import { routePaths } from '@/routes/routeRegistry';

import styles from '@/pages/AdminBoardPage.module.scss';

const AdminRouteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: '웹카탈로그', to: routePaths.adminWebCatalogs },
    { label: '시공사례', to: routePaths.adminConstructionCases },
    { label: '공사실적', to: routePaths.adminProjectRecords },
    { label: '기술자료', to: routePaths.adminTechnicalData },
    { label: '공지사항', to: routePaths.adminNotices },
    { label: '자료실', to: routePaths.adminResources },
  ] as const;

  if (!hasAdminAccessToken()) {
    return <Navigate replace state={{ from: location.pathname }} to={routePaths.adminLogin} />;
  }

  const handleLogout = () => {
    void logoutAdminSession().catch(() => undefined);
    clearAdminAccessToken();
    void navigate(routePaths.adminLogin, { replace: true });
  };

  return (
    <div className={styles['shell']}>
      <aside className={styles['sidebar']}>
        <div className={styles['sidebarHeader']}>
          <p className={styles['eyebrow']}>Admin</p>
          <h1 className={styles['sidebarTitle']}>관리자 페이지</h1>
        </div>

        <nav className={styles['sidebarNav']}>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `${styles['sidebarLink']} ${isActive ? styles['sidebarLinkActive'] : ''}`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles['sidebarFooter']}>
          <Link className={styles['link']} to={routePaths.home}>
            홈페이지로 돌아가기
          </Link>
          <Button
            className={styles['adminSecondaryButton']}
            onClick={handleLogout}
            type='button'
            variant='secondary'
          >
            로그아웃
          </Button>
        </div>
      </aside>

      <section className={styles['contentArea']}>
        <div className={styles['page']}>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AdminRouteLayout;
