package handlers

import (
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// CreateLead handles proposal / contact form submissions
func CreateLead(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var lead models.Lead
		if err := c.BodyParser(&lead); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid lead submission payload"})
		}

		if lead.FullName == "" || lead.Email == "" || lead.Phone == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Full name, email, and phone number are required"})
		}

		if err := db.Create(&lead).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "Thank you! Your proposal request has been received by Sunraise Solutions.",
			"lead_id": lead.ID,
		})
	}
}

// GetLeads returns all captured leads for admin review
func GetLeads(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var leads []models.Lead
		query := db.Order("id DESC")
		if status := c.Query("status"); status != "" {
			query = query.Where("status = ?", status)
		}
		if err := query.Find(&leads).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(leads)
	}
}

// UpdateLeadStatus modifies lead triage status (new, contacted, qualified, closed)
func UpdateLeadStatus(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		var lead models.Lead
		if err := db.First(&lead, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Lead not found"})
		}

		type StatusPayload struct {
			Status string `json:"status"`
		}
		var p StatusPayload
		if err := c.BodyParser(&p); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid status"})
		}

		lead.Status = p.Status
		if err := db.Save(&lead).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(lead)
	}
}
