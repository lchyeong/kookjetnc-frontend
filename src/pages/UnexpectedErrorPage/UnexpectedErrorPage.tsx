import type { MouseEventHandler } from 'react';

import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import Button from '@/components/ui/Button/Button';
import { routePaths } from '@/routes/routeRegistry';

import styles from './UnexpectedErrorPage.module.scss';

interface UnexpectedErrorPageProps {
  error: Error;
  onReset: VoidFunction;
}

const UnexpectedErrorPage = ({ error, onReset }: UnexpectedErrorPageProps) => {
  const handleReload: MouseEventHandler<HTMLButtonElement> = () => {
    window.location.reload();
  };

  return (
    <div className={styles['page']}>
      <PlaceholderPage
        actions={
          <div className={styles['actions']}>
            <Button onClick={onReset} type='button'>
              Try Again
            </Button>
            <Button onClick={handleReload} type='button' variant='secondary'>
              Reload
            </Button>
            <Link className={styles['actionLink']} to={routePaths.home}>
              Return to Starter
            </Link>
          </div>
        }
        description={__DEV__ ? error.message : 'Refresh the page or replace the failing branch.'}
        eyebrow='App Error'
        secondary={
          __DEV__ && error.stack ? (
            <pre className={styles['stackTrace']}>{error.stack}</pre>
          ) : undefined
        }
        title='The starter shell caught an unexpected render error.'
      />
    </div>
  );
};

export default UnexpectedErrorPage;
