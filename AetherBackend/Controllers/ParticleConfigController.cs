/*
 * ParticleConfigController.cs
 * ----------------------------
 * Author: Vedesh Panday
 * Description:
 *   API controller for managing particle configs using the file-backed ParticleStorageService.
 *   Supports saving, loading, deleting, and sorting configs by particle count or recency.
 *
 * Course Concepts Applied:
 * - OOP: Uses ParticleConfig objects to represent structured data.
 * - File I/O: Loads and saves JSON files using ParticleStorageService.
 * - Lists: Stores configs in List<string> form, uses LINQ for filtering/mapping.
 * - BST: Uses ConfigBST to sort configs by particle count.
 */

using Microsoft.AspNetCore.Mvc;
using AetherBackend.Models;
using AetherBackend.Services;

namespace AetherBackend.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ParticleConfigController : ControllerBase
{
    private readonly ParticleStorageService _storage;

    public ParticleConfigController(ParticleStorageService storage)
    {
        _storage = storage;
    }

    // GET /api/ParticleConfig
    // Returns all saved config filenames
    [HttpGet]
    public IEnumerable<string> GetAllConfigs()
    {
        return _storage.ListConfigs();
    }

    // GET /api/ParticleConfig/{name}
    // Loads a single config by name
    [HttpGet("{name}")]
    public IActionResult Get(string name)
    {
        var config = _storage.LoadConfig(name);
        return config == null ? NotFound($"Config '{name}' not found.") : Ok(config);
    }

    // POST /api/ParticleConfig
    // Saves a new config (if valid and not a duplicate)
    [HttpPost]
    public IActionResult SaveConfig([FromBody] ParticleConfig config)
    {
        if (string.IsNullOrWhiteSpace(config.Name))
            return BadRequest(new { message = "Name is required." });

        if (config.SavedAt == default)
            config.SavedAt = DateTime.UtcNow;

        if (_storage.Exists(config.Name))
            return Conflict(new { message = "A config with this name already exists." });

        _storage.SaveConfig(config);
        return Ok(new { message = "Config saved." });
    }

    // DELETE /api/ParticleConfig/{name}
    // Deletes a config by name
    [HttpDelete("{name}")]
    public IActionResult Delete(string name)
    {
        if (!_storage.Exists(name))
            return NotFound($"Config '{name}' does not exist.");

        _storage.DeleteConfig(name);
        return Ok();
    }

    // GET /api/ParticleConfig/sorted/count
    // Returns configs sorted by particle count using a binary search tree (BST)
    [HttpGet("sorted/count")]
    public IActionResult GetSortedByCount()
    {
        var files = _storage.ListConfigs();
        var bst = new ConfigBST();

        foreach (var name in files)
        {
            var config = _storage.LoadConfig(name);
            if (config != null)
                bst.Insert(config);
        }

        var result = bst.InOrderTraversal().Select(cfg => new
        {
            name = cfg.Name,
            savedAt = cfg.SavedAt,
            particleCount = cfg.Particles?.Count ?? 0
        });

        return Ok(result);
    }

    // GET /api/ParticleConfig/sorted/recent
    // Returns configs sorted by most recently saved
    [HttpGet("sorted/recent")]
    public IActionResult GetSortedByRecent()
    {
        var files = _storage.ListConfigs()
                            .Select(name => _storage.LoadConfig(name))
                            .Where(cfg => cfg != null)
                            .OrderByDescending(cfg => cfg!.SavedAt)
                            .Select(cfg => new
                            {
                                name = cfg!.Name,
                                particleCount = cfg.Particles?.Count ?? 0,
                                savedAt = cfg.SavedAt
                            });

        return Ok(files);
    }
}
