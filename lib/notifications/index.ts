export function notificationState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !window.isSecureContext || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}
export async function enableNotifications() {
  if (!window.isSecureContext || !("Notification" in window)) return "unsupported" as const;
  return Notification.requestPermission();
}
export async function testNotification() {
  if (!("Notification" in window) || Notification.permission !== "granted") throw new Error("Notifications are not enabled.");

  const options: NotificationOptions = {
    body: "We’ll help keep what matters close.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: "pingme-test",
    data: { url: "/day" },
  };

  // Android browsers intentionally reject the page-level Notification
  // constructor. A service worker notification works on both mobile and
  // desktop and remains visible if the tab is backgrounded.
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/sw.js");
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification("PingMe is ready", options);
    return;
  }

  new Notification("PingMe is ready", options);
}
