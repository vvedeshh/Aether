/*
 * ConfigsController.cs
 * ---------------------
 * Author: Vedesh Panday
 * Description:
 *   API controller that manages a list of particle configurations.
 *   Allows clients to fetch, save, and clear configs.
 *
 * Course Concepts Applied:
 * - OOP: ParticleConfig is a structured data model.
 * - Lists: Configs are stored and manipulated using a List<T>.
 */

using Microsoft.AspNetCore.Mvc;
using AetherBackend.Models;

namespace AetherBackend.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ConfigsController : ControllerBase
{
    // list of particle configurations
    private static readonly List<ParticleConfig> _configs = new();

    // GET /api/configs
    // Returns all stored configs
    [HttpGet]
    public IActionResult GetAll() => Ok(_configs);

    // POST /api/configs
    // Adds a new config to the list
    [HttpPost]
    public IActionResult Save([FromBody] ParticleConfig config)
    {
        _configs.Add(config);
        return Ok(new { message = "Config saved", total = _configs.Count });
    }

    // DELETE /api/configs
    // Clears all saved configs
    [HttpDelete]
    public IActionResult Clear()
    {
        _configs.Clear();
        return Ok(new { message = "All configs cleared." });
    }
}
