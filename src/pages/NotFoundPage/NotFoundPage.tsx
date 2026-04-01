import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { routePaths } from '@/routes/routeRegistry';

import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className={styles['page']}>
      <PlaceholderPage
        actions={
          <Link className={styles['actionLink']} to={routePaths.home}>
            Return to Starter
          </Link>
        }
        description='The route is not part of the boilerplate surface. Replace or expand it for your next client build.'
        eyebrow='404'
        title='This page does not exist in the starter.'
      />
    </div>
  );
};

export default NotFoundPage;
