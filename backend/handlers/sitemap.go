package handlers

import (
	"encoding/xml"
	"fmt"
	"os"
	"sunraise-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type URL struct {
	Loc        string  `xml:"loc"`
	LastMod    string  `xml:"lastmod,omitempty"`
	ChangeFreq string  `xml:"changefreq,omitempty"`
	Priority   float32 `xml:"priority,omitempty"`
}

type URLSet struct {
	XMLName xml.Name `xml:"urlset"`
	XMLNS   string   `xml:"xmlns,attr"`
	URLs    []URL    `xml:"url"`
}

// GenerateDynamicSitemap generates live, search-engine-ready XML sitemap from MySQL data
func GenerateDynamicSitemap(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		baseURL := os.Getenv("SITE_BASE_URL")
		if baseURL == "" {
			baseURL = "https://sunraisesolutions.com"
		}

		nowStr := time.Now().Format("2006-01-02")
		urlset := URLSet{
			XMLNS: "http://www.sitemaps.org/schemas/sitemap/0.9",
			URLs: []URL{
				{Loc: fmt.Sprintf("%s/", baseURL), LastMod: nowStr, ChangeFreq: "weekly", Priority: 1.0},
				{Loc: fmt.Sprintf("%s/about", baseURL), LastMod: nowStr, ChangeFreq: "monthly", Priority: 0.8},
				{Loc: fmt.Sprintf("%s/projects", baseURL), LastMod: nowStr, ChangeFreq: "weekly", Priority: 0.9},
				{Loc: fmt.Sprintf("%s/blog", baseURL), LastMod: nowStr, ChangeFreq: "daily", Priority: 0.8},
				{Loc: fmt.Sprintf("%s/contact", baseURL), LastMod: nowStr, ChangeFreq: "monthly", Priority: 0.7},
			},
		}

		// Services
		var services []models.Service
		if err := db.Where("is_published = ?", true).Find(&services).Error; err == nil {
			for _, s := range services {
				urlset.URLs = append(urlset.URLs, URL{
					Loc:        fmt.Sprintf("%s/services/%s", baseURL, s.Slug),
					LastMod:    s.UpdatedAt.Format("2006-01-02"),
					ChangeFreq: "weekly",
					Priority:   0.9,
				})
			}
		}

		// Projects
		var projects []models.Project
		if err := db.Find(&projects).Error; err == nil {
			for _, p := range projects {
				urlset.URLs = append(urlset.URLs, URL{
					Loc:        fmt.Sprintf("%s/projects/%s", baseURL, p.Slug),
					LastMod:    p.CreatedAt.Format("2006-01-02"),
					ChangeFreq: "monthly",
					Priority:   0.7,
				})
			}
		}

		// Blogs
		var blogs []models.Blog
		if err := db.Where("is_published = ?", true).Find(&blogs).Error; err == nil {
			for _, b := range blogs {
				urlset.URLs = append(urlset.URLs, URL{
					Loc:        fmt.Sprintf("%s/blog/%s", baseURL, b.Slug),
					LastMod:    b.UpdatedAt.Format("2006-01-02"),
					ChangeFreq: "monthly",
					Priority:   0.7,
				})
			}
		}

		output, err := xml.MarshalIndent(urlset, "", "  ")
		if err != nil {
			return c.Status(500).SendString(err.Error())
		}

		c.Set("Content-Type", "application/xml; charset=utf-8")
		return c.Send([]byte(xml.Header + string(output)))
	}
}
