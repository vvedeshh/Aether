/*
 * ParticleConfig.cs
 * ----------------------------------
 * Description:
 * - These are the core model classes used for saving and loading particle simulation data.
 * - Used by both the backend API and the frontend JSON structure.
 *
 * Course Concepts Demonstrated:
 * - OOP: Particle class represents structured data.
 * - Lists: `ParticleConfig` stores multiple `Particle` objects using List<T>.
 */

namespace AetherBackend.Models;


public class Particle
{
    // 3D position of the particle [x, y, z]
    public float[]? Position { get; set; }

    // 3D velocity vector [vx, vy, vz]
    public float[]? Velocity { get; set; }

    // Hex color string (like "#ff0000")
    public string? Color { get; set; }

    // Particle's visual size (radius)
    public float Size { get; set; }

    // Gravity strength applied to the particle
    public float Gravity { get; set; }
}

public class ParticleConfig
{
    // Unique name for the saved config file
    public string? Name { get; set; }

    // List of particles in the config
    public List<Particle>? Particles { get; set; }

    // Date/time when the config was saved
    public DateTime SavedAt { get; set; }

    // Optional description for metadata or future use
    public string? Description { get; set; }
}
