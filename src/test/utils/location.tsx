import { useLocation } from "react-router-dom";

export function LocationDisplay() {
  const location = useLocation();
  const fullUrl = `http://localhost${location.pathname}${location.search}${location.hash}`;

  return <div data-testid="location">{fullUrl}</div>;
}
