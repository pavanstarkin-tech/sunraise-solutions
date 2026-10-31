package main

import (
	"context"
	"fmt"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"google.golang.org/api/option"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"sunraise-backend/handlers"
	"sunraise-backend/middleware"
	"sunraise-backend/models"
)

func main() {
	// 1. Establish Database Connection (Hostinger MySQL)
	dbUser := getEnv("DB_USER", "u123456789_sunraise")
	dbPass := getEnv("DB_PASS", "Sunraise#Secret2026")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "sunraise_cms")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[WARNING] Hostinger MySQL connection (%s) failed: %v", dsn, err)
		log.Println("[INFO] Please ensure Hostinger MySQL credentials in .env are active or import schema.sql.")
	} else {
		log.Println("[SUCCESS] Connected to Hostinger MySQL Database:", dbName)
		// Auto Migrate models if required
		_ = db.AutoMigrate(
			&models.Service{},
			&models.Page{},
			&models.Project{},
			&models.Testimonial{},
			&models.Blog{},
			&models.SEORedirect{},
			&models.Lead{},
		)
	}

	// 2. Initialize Firebase Admin SDK (Optional credentials file)
	var fbApp *firebase.App
	serviceAccountKeyPath := getEnv("FIREBASE_SERVICE_ACCOUNT_KEY", "serviceAccountKey.json")
	if _, err := os.Stat(serviceAccountKeyPath); err == nil {
		opt := option.WithCredentialsFile(serviceAccountKeyPath)
		app, fbErr := firebase.NewApp(context.Background(), nil, opt)
		if fbErr != nil {
			log.Printf("[WARNING] Firebase initialization error: %v\n", fbErr)
		} else {
			fbApp = app
			log.Println("[SUCCESS] Firebase Admin SDK initialized with service account key")
		}
	} else {
		log.Println("[INFO] Firebase serviceAccountKey.json not detected. DEV_MODE bypass active for local development.")
		fbApp, _ = firebase.NewApp(context.Background(), nil)
	}

	// 3. Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName: "Sunraise Solutions Corporate API & CMS v1.0",
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, HEAD, PUT, DELETE, PATCH, OPTIONS",
		AllowCredentials: false,
	}))

	// Dynamic SEO 301 Redirect Interceptor
	if db != nil {
		app.Use(middleware.SEORedirectMiddleware(db))
	}

	// Root Health & Metadata
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"app":         "Sunraise Solutions Corporate API & Custom Visual CMS",
			"version":     "1.0.0",
			"status":      "operational",
			"head_office": "Hyderabad, Telangana",
			"branch":      "Rajahmundry, Andhra Pradesh",
			"sitemap":     "/sitemap.xml",
		})
	})

	// Dynamic SEO XML Sitemap
	if db != nil {
		app.Get("/sitemap.xml", handlers.GenerateDynamicSitemap(db))
	}

	// API v1 Routing
	api := app.Group("/api/v1")

	if db != nil {
		// Public Endpoints
		api.Get("/services", handlers.GetAllServices(db))
		api.Get("/services/:slug", handlers.GetServiceDetailWithLinks(db))
		api.Get("/pages/:key", handlers.GetPageByKey(db))
		api.Get("/projects", handlers.GetProjects(db))
		api.Get("/projects/:slug", handlers.GetProjectBySlug(db))
		api.Get("/testimonials", handlers.GetTestimonials(db))
		api.Get("/blogs", handlers.GetBlogs(db))
		api.Get("/blogs/:slug", handlers.GetBlogDetail(db))
		api.Post("/leads", handlers.CreateLead(db))

		// Protected Admin CMS Endpoints
		admin := api.Group("/admin", middleware.FirebaseAuthMiddleware(fbApp))
		admin.Post("/services", handlers.UpsertServiceWithSEOGuard(db))
		admin.Put("/services/:id/blocks", handlers.UpdateServiceBlocks(db))
		admin.Delete("/services/:id", handlers.DeleteService(db))
		admin.Put("/pages/:key", handlers.UpdateStandalonePage(db))
		admin.Post("/projects", handlers.UpsertProject(db))
		admin.Delete("/projects/:id", handlers.DeleteProject(db))
		admin.Post("/testimonials", handlers.UpsertTestimonial(db))
		admin.Delete("/testimonials/:id", handlers.DeleteTestimonial(db))
		admin.Post("/blogs", handlers.UpsertBlog(db))
		admin.Delete("/blogs/:id", handlers.DeleteBlog(db))
		admin.Get("/leads", handlers.GetLeads(db))
		admin.Patch("/leads/:id", handlers.UpdateLeadStatus(db))
	}

	port := getEnv("PORT", "8080")
	log.Printf("Server listening on port :%s\n", port)
	log.Fatal(app.Listen(":" + port))
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
