/**
 * api.js
 * -------
 * Author: Vedesh Panday
 * Description:
 *   Provides utility functions to interact with the backend API.
 *   Handles saving and fetching particle configuration JSON objects.
 */

/**
 * Sends a new particle configuration to the backend API for saving.
 * @param {object} config - The particle configuration object to save.
 * @returns {Promise<object>} - Response JSON from the server.
 */
export async function saveConfigToBackend(config) {
  const res = await fetch("http://localhost:5291/api/configs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  return res.json();
}

/**
 * Fetches all saved particle configurations from the backend API.
 * @returns {Promise<object[]>} - Array of saved config objects.
 */
export async function getAllConfigs() {
  const res = await fetch("http://localhost:5291/api/configs");
  return res.json();
}
