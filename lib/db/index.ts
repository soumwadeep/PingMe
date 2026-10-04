"use client";

import { openDB, type DBSchema } from "idb";
import type { Commitment } from "@/types/commitment";

interface PingMeDB extends DBSchema {
  commitments: {
    key: string;
    value: Commitment;
    indexes: { "by-date": string; "by-created": string };
  };
}

const DB_NAME = "pingme-local";
const DB_VERSION = 1;

function database() {
  if (typeof indexedDB === "undefined")
    throw new Error("Local storage is unavailable in this browser.");
  return openDB<PingMeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("commitments", { keyPath: "id" });
      store.createIndex("by-date", "date");
      store.createIndex("by-created", "createdAt");
    },
  });
}

export async function getCommitments() {
  return (await database()).getAll("commitments");
}
export async function getCommitment(id: string) {
  return (await database()).get("commitments", id);
}
export async function saveCommitment(commitment: Commitment) {
  await (await database()).put("commitments", commitment);
  return commitment;
}
export async function saveCommitments(commitments: Commitment[]) {
  const tx = (await database()).transaction("commitments", "readwrite");
  await Promise.all([
    ...commitments.map((item) => tx.store.put(item)),
    tx.done,
  ]);
  return commitments;
}
export async function updateCommitment(id: string, patch: Partial<Commitment>) {
  const existing = await getCommitment(id);
  if (!existing) throw new Error("Commitment not found");
  return saveCommitment({
    ...existing,
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  });
}
export async function deleteCommitment(id: string) {
  await (await database()).delete("commitments", id);
}
export async function clearCommitments() {
  await (await database()).clear("commitments");
}
export async function getCommitmentsForDate(date: string) {
  return (await database()).getAllFromIndex("commitments", "by-date", date);
}
