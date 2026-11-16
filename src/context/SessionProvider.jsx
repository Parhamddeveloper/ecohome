import { useCallback, useEffect, useRef, useState } from "react";
import { SessionContext } from "./SessionContext";

export default function SessionProvider({ children }) {
  const [user, updateUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const revision = useRef(0);
  const setUser = useCallback((nextUser) => {
    revision.current += 1;
    updateUser(nextUser);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let checking = false;

    async function loadSession() {
      if (checking) return;
      checking = true;
      const requestedRevision = revision.current;
      try {
        const response = await fetch("/api/auth", { signal: controller.signal });
        if (!response.ok) throw new Error();
        const { user } = await response.json();
        if (!controller.signal.aborted && revision.current === requestedRevision) {
          updateUser(user);
          setSessionError("");
        }
      } catch {
        if (!controller.signal.aborted && revision.current === requestedRevision) {
          setSessionError("بررسی وضعیت ورود انجام نشد.");
        }
      } finally {
        checking = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadSession();
    window.addEventListener("focus", loadSession);
    return () => {
      window.removeEventListener("focus", loadSession);
      controller.abort();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, loading, sessionError }}>
      {children}
    </SessionContext.Provider>
  );
}
