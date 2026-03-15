/**
 * sse.js
 *
 * Manages active SSE connections from admin clients.
 * Used by notification.controller to push events in real-time.
 *
 * Usage:
 *   const { addClient, removeClient, broadcast } = require("../utils/sse");
 */

const clients = new Set();

/**
 * Register a new SSE response object
 */
const addClient = (res) => clients.add(res);

/**
 * Remove a disconnected SSE client
 */
const removeClient = (res) => clients.delete(res);

/**
 * Push a notification to all connected admin clients
 * @param {Object} notification - saved notification document
 */
const broadcast = (notification) => {
  const payload = JSON.stringify({
    _id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    read: notification.read,
    createdAt: notification.createdAt,
  });

  for (const client of clients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      // Client disconnected mid-write — clean up
      clients.delete(client);
    }
  }
};

module.exports = { addClient, removeClient, broadcast };
