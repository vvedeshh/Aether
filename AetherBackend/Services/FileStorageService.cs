/*
 * FileStorageService.cs
 * -------------------------
 * Description:
 * This service handles saving, loading, listing, and deleting particle config files
 * on the local server as JSON files inside a "SavedConfigs" folder.
 *
 * ICS4U Course Concepts Used:
 * - File I/O: Reads and writes JSON data.
 * - Lists: Used to return the list of saved filenames.
 */

using AetherBackend.Models;
using System.Text.Json;

namespace AetherBackend.Services;


public class FileStorageService
{
    // Path to the directory where configs will be saved
    private readonly string SaveDir;

    // Constructor creates the directory if it doesn't exist
    public FileStorageService()
    {
        SaveDir = Path.Combine(Directory.GetCurrentDirectory(), "SavedConfigs");
        if (!Directory.Exists(SaveDir))
            Directory.CreateDirectory(SaveDir);
    }

    // Save a ParticleConfig object to a file as pretty-printed JSON
    public void Save(ParticleConfig config)
    {
        var path = Path.Combine(SaveDir, $"{config.Name}.json");
        var json = JsonSerializer.Serialize(config, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(path, json);
    }

    // Return a list of all saved config names (without file extensions)
    public List<string> List()
    {
        return Directory.GetFiles(SaveDir, "*.json")
                        .Select(f => Path.GetFileNameWithoutExtension(f))
                        .ToList();
    }

    // Load and deserialize a ParticleConfig from a file
    public ParticleConfig? Load(string name)
    {
        var path = Path.Combine(SaveDir, $"{name}.json");
        if (!File.Exists(path)) return null;

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<ParticleConfig>(json);
    }

    // Delete a config file by name
    public bool Delete(string name)
    {
        var path = Path.Combine(SaveDir, $"{name}.json");
        if (!File.Exists(path)) return false;

        File.Delete(path);
        return true;
    }

    // Check if a config file with the given name exists
    public bool Exists(string name)
    {
        var path = Path.Combine(SaveDir, $"{name}.json");
        return File.Exists(path);
    }
}
