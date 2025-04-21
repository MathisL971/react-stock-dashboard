// useQueryParameters.ts
import { useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';

interface QueryParamUpdater {
  set: (key: string, value: string) => void;
  get: (key: string) => string | null;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  toString: () => string;
}

const useQueryParameters = (): QueryParamUpdater => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const set = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(key, value);
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    },
    [location.pathname, navigate, searchParams]
  );

  const get = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const has = useCallback(
    (key: string) => {
      return searchParams.has(key);
    },
    [searchParams]
  );

  const deleteParam = useCallback(
    (key: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete(key);
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    },
    [location.pathname, navigate, searchParams]
  );

  const toString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  return {
    set,
    get,
    has,
    delete: deleteParam,
    toString,
  };
};

export default useQueryParameters;