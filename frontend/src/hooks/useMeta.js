import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function useMeta() {
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getMeta()
      .then(setMeta)
      .catch((e) => setError(e.message));
  }, []);

  return { meta, error, ready: !!meta };
}
