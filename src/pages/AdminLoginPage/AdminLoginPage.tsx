import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { loginAdmin } from '@/features/board/api';
import {
  hasAdminAccessToken,
  isMockAdminEnabled,
  setAdminAccessToken,
  setMockAdminAccessToken,
} from '@/features/board/auth';
import { getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (response) => {
      setAdminAccessToken(response.accessToken);
      void navigate(routePaths.adminWebCatalogs, { replace: true });
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (hasAdminAccessToken()) {
      void navigate(routePaths.adminWebCatalogs, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ username, password });
  };

  const handleMockEnter = () => {
    setErrorMessage(null);
    setMockAdminAccessToken();
    void navigate(routePaths.adminWebCatalogs, { replace: true });
  };

  return (
    <div className={styles['loginShell']}>
      <div className={styles['page']}>
        <section className={styles['loginPanel']}>
          <div className={styles['loginHeader']}>
            <h1 className={styles['loginTitle']}>관리자 로그인</h1>
            <Link className={styles['link']} to={routePaths.home}>
              메인으로 돌아가기
            </Link>
          </div>

          <form className={styles['form']} onSubmit={handleSubmit}>
            <div className={styles['field']}>
              <label className={styles['label']} htmlFor='username'>
                아이디
              </label>
              <input
                className={styles['input']}
                id='username'
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                value={username}
              />
            </div>

            <div className={styles['field']}>
              <label className={styles['label']} htmlFor='password'>
                비밀번호
              </label>
              <input
                className={styles['input']}
                id='password'
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type='password'
                value={password}
              />
            </div>

            {isMockAdminEnabled() ? (
              <p className={styles['helper']}>
                현재는 목 환경이므로 서버 없이도 바로 관리자 화면을 확인할 수 있습니다.
              </p>
            ) : null}

            {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

            <div className={styles['formActions']}>
              {isMockAdminEnabled() ? (
                <Button
                  className={styles['adminSecondaryButton']}
                  onClick={handleMockEnter}
                  type='button'
                  variant='secondary'
                >
                  임시 입장
                </Button>
              ) : null}
              <Button
                className={styles['adminPrimaryButton']}
                disabled={loginMutation.isPending}
                type='submit'
              >
                {loginMutation.isPending ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminLoginPage;
