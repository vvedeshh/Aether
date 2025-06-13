/*
 * ConfigSortingService.cs
 * -------------------------
 * Description:
 * This file contains two custom data structures:
 * - ConfigBST: A Binary Search Tree used to sort particle configs by particle count.
 * - ConfigLinkedList: A singly linked list used to maintain configs in recent-first order.
 *
 * ICS4U Course Concepts Used:
 * - Binary Search Tree (BST): Sorts configs by particle count.
 * - Linked List: Maintains configs in reverse chronological (recent-first) order.
 * - Recursion: Used in BST insertion and in-order traversal.
 * - Lists: Both structures return a List<ParticleConfig> for compatibility with controllers.
 * - Sorting: Particle configurations are inserted into the BST based on their count, 
 *            and retrieved in sorted order via in-order traversal.
 */

using AetherBackend.Models;

namespace AetherBackend.Services;


public class ConfigNode
{
    public ParticleConfig Config { get; set; }
    public ConfigNode? Left { get; set; }
    public ConfigNode? Right { get; set; }

    public ConfigNode(ParticleConfig config)
    {
        Config = config;
    }
}

public class ConfigBST
{
    private ConfigNode? root;

    // Inserts a new config into the tree based on particle count
    public void Insert(ParticleConfig config)
    {
        root = InsertRecursive(root, config);
    }

    // Recursively insert a node into the correct place in the BST
    private ConfigNode InsertRecursive(ConfigNode? node, ParticleConfig config)
    {
        if (node == null)
            return new ConfigNode(config);

        int count = config.Particles?.Count ?? 0;
        int nodeCount = node.Config.Particles?.Count ?? 0;

        if (count < nodeCount)
            node.Left = InsertRecursive(node.Left, config);
        else
            node.Right = InsertRecursive(node.Right, config);

        return node;
    }

    // Returns a sorted list of configs using in-order traversal
    public List<ParticleConfig> InOrderTraversal()
    {
        var result = new List<ParticleConfig>();
        InOrderRecursive(root, result);
        return result;
    }

    // Recursively traverse the BST in-order
    private void InOrderRecursive(ConfigNode? node, List<ParticleConfig> result)
    {
        if (node == null) return;

        InOrderRecursive(node.Left, result);
        result.Add(node.Config);
        InOrderRecursive(node.Right, result);
    }
}

// --------------------------
// Linked List (Recent First)
// --------------------------

public class ConfigLinkedList
{
    public class Node
    {
        public ParticleConfig Config { get; set; }
        public Node? Next { get; set; }

        public Node(ParticleConfig config)
        {
            Config = config;
        }
    }

    private Node? head;

    // Adds a new config to the front of the list (most recent first)
    public void Add(ParticleConfig config)
    {
        var node = new Node(config);
        node.Next = head;
        head = node;
    }

    // Converts the linked list to a standard List<ParticleConfig>
    public List<ParticleConfig> ToList()
    {
        var list = new List<ParticleConfig>();
        var current = head;
        while (current != null)
        {
            list.Add(current.Config);
            current = current.Next;
        }
        return list;
    }
}
