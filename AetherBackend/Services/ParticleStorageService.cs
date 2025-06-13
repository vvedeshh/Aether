/*
 * ParticleStorageService.cs
 * --------------------------
 * Description:
 * Handles core file storage operations for particle configs:
 * saving, loading, deleting, and listing JSON files in a fixed directory.
 * This class wraps and simplifies direct file I/O operations.
 *
 * ICS4U Course Concepts Used:
 * - File I/O: Reads and writes JSON files using File and JsonSerializer.
 * - Lists: Returns collections of config names using IEnumerable and LINQ.
 * - OOP: Uses private fields, constructor logic, and method encapsulation.
 */

using System.Text.Json;
using AetherBackend.Models;

namespace AetherBackend.Services;


public class ParticleStorageService
{
    // Root directory for storing JSON files
    private readonly string SaveDir = Path.Combine(Directory.GetCurrentDirectory(), "SavedConfigs");

    // Constructor ensures the save directory exists
    public ParticleStorageService()
    {
        if (!Directory.Exists(SaveDir))
            Directory.CreateDirectory(SaveDir);
    }

    // Saves a ParticleConfig as a formatted JSON file
    public void SaveConfig(ParticleConfig config)
    {
        // Avoid saving temporary in-memory configs like "__snapshot"
        if (config.Name == "__snapshot") return;

        var path = GetFilePath(config.Name!);
        var json = JsonSerializer.Serialize(config, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(path, json);
    }

    // Loads a ParticleConfig from disk by name
    public ParticleConfig? LoadConfig(string name)
    {
        var path = GetFilePath(name);
        if (!File.Exists(path)) return null;

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<ParticleConfig>(json);
    }

    // Returns all saved config names (excluding empty/invalid)
    public IEnumerable<string> ListConfigs()
    {
        return Directory.GetFiles(SaveDir, "*.json")
                        .Select(f => Path.GetFileNameWithoutExtension(f))
                        .Where(name => !string.IsNullOrWhiteSpace(name))!;
    }

    // Deletes a config file by name
    public void DeleteConfig(string name)
    {
        var path = GetFilePath(name);
        if (File.Exists(path))
            File.Delete(path);
    }

    // Checks if a config exists
    public bool Exists(string name)
    {
        return File.Exists(GetFilePath(name));
    }

    // Internal helper to get full path of a given config name
    private string GetFilePath(string name)
    {
        return Path.Combine(SaveDir, $"{name}.json");
    }
}
