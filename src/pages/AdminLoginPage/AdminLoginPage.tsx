import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { loginAdmin } from '@/features/board/api';
import { hasAdminAccessToken, setAdminAccessToken } from '@/features/board/auth';
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
      void navigate(routePaths.adminNotices, { replace: true });
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (hasAdminAccessToken()) {
      void navigate(routePaths.adminNotices, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className={styles['shell']}>
      <div className={styles['page']}>
        <section className={styles['panel']}>
          <p className={styles['eyebrow']}>Admin Login</p>
          <h1 className={styles['sectionTitle']}>게시판 관리자 로그인</h1>
          <p className={styles['sectionDescription']}>
            공지사항과 자료실 게시물을 등록, 수정, 삭제할 수 있습니다.
          </p>

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

            {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

            <div className={styles['formActions']}>
              <Link className={styles['link']} to={routePaths.home}>
                메인으로 돌아가기
              </Link>
              <Button disabled={loginMutation.isPending} type='submit'>
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
