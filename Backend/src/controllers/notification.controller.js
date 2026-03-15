const notificationModel = require("../models/notification.model");
const { addClient, removeClient, broadcast } = require("../utils/sse");

/**
 * createNotification
 *
 * Call this from any controller to save + push a notification to the admin.
 *
 * Usage:
 *   const { createNotification } = require("./notification.controller");
 *   await createNotification({ type: "NEW_ORDER", title: "...", message: "...", link: "..." });
 */
const createNotification = async ({ type, title, message, link }) => {
  try {
    const notification = await notificationModel.create({
      type,
      title,
      message,
      link,
    });
    broadcast(notification); // push to all connected admin SSE clients
    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

/**
 * GET /admin/notifications/stream
 *
 * SSE endpoint — keeps connection open and pushes notifications in real-time.
 * Admin frontend connects once on mount and listens for "data:" events.
 */
const streamNotifications = (req, res) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering if behind proxy
  res.flushHeaders();

  // Send a heartbeat comment every 30s to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 30_000);

  // Register this client
  addClient(res);

  // Clean up when client disconnects
  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(res);
  });
};

/**
 * GET /admin/notifications
 *
 * Returns recent notifications + unread count.
 */
const getNotifications = async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      notificationModel.find().sort({ createdAt: -1 }).limit(20),
      notificationModel.countDocuments({ read: false }),
    ]);

    res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * PATCH /admin/notifications/read-all
 *
 * Marks all notifications as read.
 */
const markAllRead = async (req, res) => {
  try {
    await notificationModel.updateMany({ read: false }, { read: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

/**
 * PATCH /admin/notifications/:id/read
 *
 * Marks a single notification as read.
 */
const markOneRead = async (req, res) => {
  try {
    await notificationModel.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

module.exports = {
  createNotification,
  streamNotifications,
  getNotifications,
  markAllRead,
  markOneRead,
};
