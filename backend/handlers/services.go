package handlers

import (
	"encoding/json"
	"fmt"
	"strings"
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetAllServices returns all published services ordered by display_order
func GetAllServices(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var services []models.Service
		query := db.Order("display_order ASC, id ASC")
		if c.Query("include_unpublished") != "true" {
			query = query.Where("is_published = ?", true)
		}
		if err := query.Find(&services).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(services)
	}
}

// GetServiceDetailWithLinks returns service details including linked projects and testimonials
func GetServiceDetailWithLinks(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		slug := c.Params("slug")
		var service models.Service
		if err := db.Where("slug = ?", slug).First(&service).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Service not found"})
		}

		// Load linked projects
		var projects []models.Project
		db.Where("service_code = ?", service.ServiceCode).Find(&projects)
		service.Projects = projects

		// Load linked testimonials
		var testimonials []models.Testimonial
		db.Where("service_code = ? OR service_code IS NULL", service.ServiceCode).Find(&testimonials)
		service.Testimonials = testimonials

		return c.JSON(service)
	}
}

// UpsertServiceWithSEOGuard validates SEO integrity, records 301 redirects on slug change, and updates service
func UpsertServiceWithSEOGuard(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload models.Service
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		if payload.ServiceCode == "" || payload.Slug == "" || payload.Title == "" {
			return c.Status(400).JSON(fiber.Map{"error": "service_code, slug, and title are required"})
		}

		// Check if updating existing service
		var existing models.Service
		res := db.Where("id = ? OR service_code = ?", payload.ID, payload.ServiceCode).First(&existing)
		if res.Error == nil {
			// Check if slug changed
			oldSlug := existing.Slug
			newSlug := payload.Slug
			if oldSlug != "" && newSlug != "" && oldSlug != newSlug {
				oldPath := fmt.Sprintf("/services/%s", oldSlug)
				newPath := fmt.Sprintf("/services/%s", newSlug)

				// Register automatic 301 redirect
				redirect := models.SEORedirect{
					OldPath:    oldPath,
					NewPath:    newPath,
					StatusCode: 301,
				}
				db.Where("old_path = ?", oldPath).Assign(redirect).FirstOrCreate(&redirect)
			}
			payload.ID = existing.ID
			if err := db.Save(&payload).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": err.Error()})
			}
			return c.JSON(payload)
		}

		// Create new
		if err := db.Create(&payload).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(201).JSON(payload)
	}
}

// UpdateServiceBlocks saves drag-and-drop page blocks with heading hierarchy validation
func UpdateServiceBlocks(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		var service models.Service
		if err := db.First(&service, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Service not found"})
		}

		type BlockPayload struct {
			Blocks json.RawMessage `json:"blocks"`
		}
		var p BlockPayload
		if err := c.BodyParser(&p); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid blocks payload"})
		}

		// SEO Sanitization: Auto downgrade accidental <h1> tags to <h2> inside blocks
		blockStr := string(p.Blocks)
		sanitizedBlockStr := strings.ReplaceAll(blockStr, "<h1", "<h2")
		sanitizedBlockStr = strings.ReplaceAll(sanitizedBlockStr, "</h1>", "</h2>")

		service.PageBlocks = models.JSONField(sanitizedBlockStr)
		if err := db.Save(&service).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(fiber.Map{
			"message": "Page blocks updated successfully with SEO heading safety",
			"service": service,
		})
	}
}

// DeleteService removes a service
func DeleteService(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		if err := db.Delete(&models.Service{}, id).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "Service deleted successfully"})
	}
}
