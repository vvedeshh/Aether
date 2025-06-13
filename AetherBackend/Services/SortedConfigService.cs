/*
 * SortedConfigService.cs
 * --------------------------
 * Description:
 * Maintains and provides sorted views of saved particle configurations.
 * Uses a LinkedList for recency-based sorting and a Binary Search Tree for particle count-based sorting.
 *
 * ICS4U Course Concepts Used:
 * - Linked Lists: Stores configs with the most recent first.
 * - Binary Search Tree (BST): Stores configs sorted by particle count.
 * - OOP: Encapsulation and object interactions between services.
 */

using AetherBackend.Models;

namespace AetherBackend.Services;


public class SortedConfigService
{
    // Most recently added configs (linked list for recent-first sorting)
    private readonly LinkedList<ParticleConfig> recentList = new();

    // Binary Search Tree for sorting by particle count
    private readonly ConfigBST sizeTree = new();

    // Adds a config to both structures (maintains dual sorting)
    public void Add(ParticleConfig config)
    {
        recentList.AddFirst(config); //  most recent at front
        sizeTree.Insert(config);     //  insert into BST
    }

    // Returns configs sorted by recency (linked list order)
    public List<ParticleConfig> GetSortedByRecent() =>
        recentList.ToList();

    // Returns configs sorted by particle count (in-order traversal of BST)
    public List<ParticleConfig> GetSortedBySize() =>
        sizeTree.InOrderTraversal();
}
