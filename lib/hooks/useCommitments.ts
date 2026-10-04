"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteCommitment, getCommitments, updateCommitment } from "@/lib/db";
import type { Commitment } from "@/types/commitment";

export function useCommitments() {
  const [items, setItems] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try { setItems(await getCommitments()); setError(null); }
    catch { setError("PingMe couldn’t read your local commitments."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    window.addEventListener("pingme:commitments-changed", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("pingme:commitments-changed", refresh); };
  }, [refresh]);
  const update = async (id: string, patch: Partial<Commitment>) => { await updateCommitment(id, patch); await refresh(); };
  const remove = async (id: string) => { await deleteCommitment(id); await refresh(); };
  return { items, loading, error, refresh, update, remove };
}
