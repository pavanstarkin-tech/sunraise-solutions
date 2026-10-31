package middleware

import (
	"context"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v2"
)

// FirebaseAuthMiddleware verifies Firebase JWT token on protected admin endpoints
func FirebaseAuthMiddleware(app *firebase.App) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Allow dev mode bypass if env DEV_MODE=true for testing without active Firebase keys
		if os.Getenv("DEV_MODE") == "true" {
			c.Locals("uid", "dev_admin_user")
			return c.Next()
		}

		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "Missing or invalid Authorization header",
				"message": "Bearer token is required for admin actions",
			})
		}
		idToken := strings.TrimPrefix(authHeader, "Bearer ")

		// If app is nil (e.g. initial setup without serviceAccountKey.json), handle gracefully
		if app == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Firebase Admin SDK not initialized",
			})
		}

		client, err := app.Auth(context.Background())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to initialize Firebase Auth client",
			})
		}

		token, err := client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired Firebase ID token",
			})
		}

		c.Locals("uid", token.UID)
		c.Locals("claims", token.Claims)
		return c.Next()
	}
}
