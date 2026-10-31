package handlers

import (
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetPageByKey returns standalone page content
func GetPageByKey(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := c.Params("key")
		var page models.Page
		if err := db.Where("page_key = ?", key).First(&page).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Page not found"})
		}
		return c.JSON(page)
	}
}

// UpdateStandalonePage updates content or blocks of a page
func UpdateStandalonePage(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := c.Params("key")
		var page models.Page
		if err := db.Where("page_key = ?", key).First(&page).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Page not found"})
		}

		if err := c.BodyParser(&page); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		page.PageKey = key
		if err := db.Save(&page).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(page)
	}
}
