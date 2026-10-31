package handlers

import (
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetTestimonials returns reviews
func GetTestimonials(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var testimonials []models.Testimonial
		query := db.Order("id DESC")
		if sc := c.Query("service_code"); sc != "" {
			query = query.Where("service_code = ? OR service_code IS NULL", sc)
		}
		if err := query.Find(&testimonials).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(testimonials)
	}
}

// UpsertTestimonial creates or updates a review
func UpsertTestimonial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload models.Testimonial
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}
		if err := db.Save(&payload).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(payload)
	}
}

// DeleteTestimonial removes a review
func DeleteTestimonial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := db.Delete(&models.Testimonial{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "Testimonial deleted"})
	}
}
