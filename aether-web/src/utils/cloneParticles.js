/**
 * cloneParticles.js
 * ------------------
 * Author: Vedesh Panday
 * Description:
 *   Utility function to deep-clone an array of particle objects,
 *   preserving position and velocity vectors for undo/redo operations.
 */

/**
 * Creates a deep copy of the provided particle array.
 * @param {Array} particles - Array of particle objects to clone.
 * @returns {Array} - New array of cloned particle objects.
 */
export default function cloneParticles(particles) {
  return particles.map((p) => ({
    position: p.position.clone(),
    velocity: p.velocity.clone(),
    color: p.color,
    size: p.size,
    gravity: p.gravity,
  }));
}
