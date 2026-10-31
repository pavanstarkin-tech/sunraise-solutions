package handlers

import (
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetProjects returns projects filtered optionally by service_code
func GetProjects(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var projects []models.Project
		query := db.Order("id DESC")
		if sc := c.Query("service_code"); sc != "" {
			query = query.Where("service_code = ?", sc)
		}
		if cat := c.Query("category"); cat != "" {
			query = query.Where("category_badge = ?", cat)
		}
		if err := query.Find(&projects).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(projects)
	}
}

// GetProjectBySlug returns single project
func GetProjectBySlug(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		slug := c.Params("slug")
		var project models.Project
		if err := db.Where("slug = ?", slug).First(&project).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Project not found"})
		}
		return c.JSON(project)
	}
}

// UpsertProject handles create/update of portfolio items
func UpsertProject(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload models.Project
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}
		if err := db.Save(&payload).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(payload)
	}
}

// DeleteProject deletes a project
func DeleteProject(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := db.Delete(&models.Project{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "Project deleted"})
	}
}
