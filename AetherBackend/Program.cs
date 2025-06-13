/*
 * Program.cs
 * --------------------------
 * Entry point and configuration for the backend.
 *
 * ICS4U Course Concepts Used:
 * - File I/O: Enabled via ParticleStorageService and FileStorageService
 * - OOP: Services are registered and injected into controllers
 * - Data Structures: Uses BST and LinkedList for sorting configs
 */

using AetherBackend.Services;


var builder = WebApplication.CreateBuilder(args);

// Register controller services (enables [ApiController] routing)
builder.Services.AddControllers();

// API documentation setup (Swagger/OpenAPI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register backend services as singletons (shared instances for app lifetime)
builder.Services.AddSingleton<ParticleStorageService>();
builder.Services.AddSingleton<FileStorageService>();
builder.Services.AddSingleton<SortedConfigService>();
builder.Services.AddSingleton<ConfigBST>();
builder.Services.AddSingleton<ConfigLinkedList>();

// Enable CORS so the frontend can talk to the backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // frontend port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Apply CORS policy to allow frontend communication
app.UseCors("AllowFrontend");

// Show Swagger UI in development for API testing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP to HTTPS (optional in dev, useful in prod)
app.UseHttpsRedirection();

// Use ASP.NET's built-in authorization pipeline (can be ignored if unused)
app.UseAuthorization();

// Map API endpoints to controller routes
app.MapControllers();

// Start the app
app.Run();
