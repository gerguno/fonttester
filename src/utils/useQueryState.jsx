import { useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import qs from "qs"

export const useQueryState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setQueries = useCallback((newQueries) => {
    const existingQueries = qs.parse(location.search, { ignoreQueryPrefix: true });
    const updatedQueries = { ...existingQueries, ...newQueries };
    const queryString = qs.stringify(updatedQueries, { skipNulls: true });
    navigate(`${location.pathname}?${queryString}`);
  }, [navigate, location]);

  return [qs.parse(location.search, { ignoreQueryPrefix: true }), setQueries];
};
