import { useState, useEffect, useMemo } from 'react';
import { onSnapshot } from 'firebase/firestore';

/**
 * Custom hook to subscribe to a Firestore query.
 * @param {import('firebase/firestore').Query | null} query The Firestore query to subscribe to.
 * @returns {{data: any[], loading: boolean}}
 */
export function useFirestoreQuery(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The query is memoized in the component, so we can use it directly.
    if (!query) return;
    
    const unsubscribe = onSnapshot(query, (snap) => {
      setData(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}