package handlers

import (
	"sunraise-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetBlogs returns articles
func GetBlogs(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var blogs []models.Blog
		query := db.Order("id DESC")
		if c.Query("include_drafts") != "true" {
			query = query.Where("is_published = ?", true)
		}
		if cat := c.Query("category"); cat != "" {
			query = query.Where("category = ?", cat)
		}
		if err := query.Find(&blogs).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(blogs)
	}
}

// GetBlogDetail returns single article
func GetBlogDetail(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		slug := c.Params("slug")
		var blog models.Blog
		if err := db.Where("slug = ?", slug).First(&blog).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Blog post not found"})
		}
		return c.JSON(blog)
	}
}

// UpsertBlog creates or updates an article
func UpsertBlog(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload models.Blog
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}
		if payload.IsPublished && payload.PublishedAt == nil {
			now := time.Now()
			payload.PublishedAt = &now
		}
		if err := db.Save(&payload).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(payload)
	}
}

// DeleteBlog removes an article
func DeleteBlog(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := db.Delete(&models.Blog{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "Blog post deleted"})
	}
}
