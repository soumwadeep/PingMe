export function notificationState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}
export async function enableNotifications() {
  if (!("Notification" in window)) return "unsupported" as const;
  return Notification.requestPermission();
}
export function testNotification() {
  if (!("Notification" in window) || Notification.permission !== "granted") throw new Error("Notifications are not enabled.");
  new Notification("PingMe is ready", { body: "We’ll help keep what matters close.", icon: "/icon.svg", tag: "pingme-test" });
}
