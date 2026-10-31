package middleware

import (
	"sunraise-backend/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// SEORedirectMiddleware checks if incoming path matches any preserved 301 redirects
func SEORedirectMiddleware(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.Path()

		// Ignore API, assets, and health checks
		if path == "" || path == "/" || len(path) > 4 && path[:5] == "/api/" || path == "/sitemap.xml" {
			return c.Next()
		}

		var redirect models.SEORedirect
		if err := db.Where("old_path = ?", path).First(&redirect).Error; err == nil {
			return c.Redirect(redirect.NewPath, redirect.StatusCode)
		}

		return c.Next()
	}
}
