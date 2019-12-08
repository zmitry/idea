import { useState, useEffect, useCallback, useRef } from "react";
import { AxiosError } from "axios";
type AsyncState<T> =
  | {
      loading: true;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export function useAsync<Result = any>(
  fn?: () => Promise<Result>
): AsyncState<Result> & { setData: (fn: (r: Result) => Result) => void } {
  const [state, set] = useState({ loading: true } as AsyncState<Result>);
  const setData = useCallback(
    (fn: (r: Result) => Result) => {
      set((s: any) => ({ ...s, value: fn(s.value) }));
    },
    [set]
  );
  useEffect(() => {
    if (!fn) {
      return;
    }
    let setState = set;
    let call = (fn: any) => fn();

    setState(state => {
      return { ...state, loading: true } as any;
    });

    call(fn).then(
      (value: Result) => {
        setState({ value, loading: false });
        return value;
      },
      (error: Error) => {
        if ((error as AxiosError).isAxiosError) {
          const e = error as AxiosError;
          setState({
            error: e && e.response && e.response.data,
            loading: false
          });
        } else {
          setState({ error, loading: false });
        }
        return error;
      }
    );
    return () => {
      setState = () => null;
      call = () => Promise.resolve();
    };
  }, [fn]);

  return { ...state, setData };
}

export function useAsyncCall(fn: any) {
  const [req, setReq] = useState(undefined);
  const cb = useCallback(() => {
    if (req === undefined) {
      return Promise.resolve();
    }
    return fn(req);
  }, [fn, req]);
  const data = useAsync(cb);
  return {
    ...data,
    loading: req ? data.loading : false,
    call: (data: any) => setReq(data)
  };
}

export function useAsyncCallback(
  fn: (...args: any[]) => any,
  cb: (args: any) => void
) {
  const fnAsync = useAsyncCall(fn);
  const cbRef = useRef(null as any);
  cbRef.current = cb;
  useEffect(() => {
    if (fnAsync.value) {
      cbRef.current(fnAsync.value);
    }
    fnAsync.setData(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fnAsync.value]);
  return fnAsync;
}
