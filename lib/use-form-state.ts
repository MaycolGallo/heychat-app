import { useState, useTransition } from "react";

/**
 * Executes an action with loading, error, and data states.
 * 
 * @param action The action to be executed.
 * @returns A tuple containing the run function and an object with loading, error, and data states.
 */
export function useActionState<T, P extends any[]>(action: (...args: P) => Promise<T>): [(...args: P) => Promise<{ data?: T, error?: any }>, { loading: boolean, error?: any, data?: T }] {
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<any>();
  const [data, setData] = useState<T>();

  const run = (...args: P) => {
    return new Promise<{ data?: T, error?: any }>((resolve) => {
      startTransition(async () => {
        try {
          setError(undefined);
          const result = await action(...args);
          resolve({ data: result });
          setData(result);
        } catch (error) {
          setError(error);
          setData(undefined);
          resolve({ error });
        }
      });
    });
  };

  return [run, { loading, error, data }];
}
