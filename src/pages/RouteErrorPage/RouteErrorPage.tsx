import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { routePaths } from '@/routes/routeRegistry';

import styles from './RouteErrorPage.module.scss';

const RouteErrorPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown routing error';

  return (
    <div className={styles['page']}>
      <PlaceholderPage
        actions={
          <Link className={styles['actionLink']} to={routePaths.home}>
            Return to Starter
          </Link>
        }
        description={message}
        eyebrow='Route Error'
        title='The router hit an unexpected state.'
      />
    </div>
  );
};

export default RouteErrorPage;
