package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// JSONField helper for GORM MySQL JSON columns
type JSONField json.RawMessage

func (j JSONField) Value() (driver.Value, error) {
	if len(j) == 0 {
		return "{}", nil
	}
	return string(j), nil
}

func (j *JSONField) Scan(value interface{}) error {
	if value == nil {
		*j = JSONField("{}")
		return nil
	}
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("cannot scan type into JSONField")
	}
	*j = JSONField(bytes)
	return nil
}

// Service represents a corporate digital service offering
type Service struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ServiceCode      string    `gorm:"size:32;uniqueIndex;not null" json:"service_code"`
	Slug             string    `gorm:"size:150;uniqueIndex;not null" json:"slug"`
	Title            string    `gorm:"size:200;not null" json:"title"`
	ShortDescription string    `gorm:"type:text" json:"short_description"`
	IconName         string    `gorm:"size:100" json:"icon_name"`
	ThumbnailURL     string    `gorm:"size:500" json:"thumbnail_url"`
	HeroConfig       JSONField `gorm:"type:json;not null" json:"hero_config"`
	PageBlocks       JSONField `gorm:"type:json;not null" json:"page_blocks"`
	SEOMeta          JSONField `gorm:"type:json;not null" json:"seo_meta"`
	IsPublished      bool      `gorm:"default:true" json:"is_published"`
	DisplayOrder     int       `gorm:"default:0" json:"display_order"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	// Relationships
	Projects     []Project     `gorm:"foreignKey:ServiceCode;references:ServiceCode" json:"projects,omitempty"`
	Testimonials []Testimonial `gorm:"foreignKey:ServiceCode;references:ServiceCode" json:"testimonials,omitempty"`
}

// Page represents standalone landing or corporate pages
type Page struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	PageKey    string    `gorm:"size:50;uniqueIndex;not null" json:"page_key"`
	Slug       string    `gorm:"size:150;uniqueIndex;not null" json:"slug"`
	Title      string    `gorm:"size:200;not null" json:"title"`
	HeroConfig JSONField `gorm:"type:json;not null" json:"hero_config"`
	PageBlocks JSONField `gorm:"type:json;not null" json:"page_blocks"`
	SEOMeta    JSONField `gorm:"type:json;not null" json:"seo_meta"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Project represents a portfolio case study linked to a ServiceCode
type Project struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Slug            string    `gorm:"size:150;uniqueIndex;not null" json:"slug"`
	Title           string    `gorm:"size:200;not null" json:"title"`
	ClientName      string    `gorm:"size:150" json:"client_name"`
	ServiceCode     string    `gorm:"size:32;not null" json:"service_code"`
	CategoryBadge   string    `gorm:"size:100;not null" json:"category_badge"`
	ThumbnailURL    string    `gorm:"size:500;not null" json:"thumbnail_url"`
	Summary         string    `gorm:"type:text" json:"summary"`
	CaseStudyBlocks JSONField `gorm:"type:json" json:"case_study_blocks"`
	SEOMeta         JSONField `gorm:"type:json;not null" json:"seo_meta"`
	IsFeatured      bool      `gorm:"default:true" json:"is_featured"`
	CreatedAt       time.Time `json:"created_at"`
}

// Testimonial represents client reviews
type Testimonial struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ClientName  string    `gorm:"size:150;not null" json:"client_name"`
	ClientRole  string    `gorm:"size:150" json:"client_role"`
	AvatarURL   string    `gorm:"size:500" json:"avatar_url"`
	Rating      float32   `gorm:"type:decimal(2,1);default:5.0" json:"rating"`
	ReviewText  string    `gorm:"type:text;not null" json:"review_text"`
	ServiceCode *string   `gorm:"size:32" json:"service_code"`
	IsFeatured  bool      `gorm:"default:true" json:"is_featured"`
	CreatedAt   time.Time `json:"created_at"`
}

// Blog represents SEO insights & articles
type Blog struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	Slug          string     `gorm:"size:200;uniqueIndex;not null" json:"slug"`
	Title         string     `gorm:"size:255;not null" json:"title"`
	Excerpt       string     `gorm:"type:text" json:"excerpt"`
	CoverImage    string     `gorm:"size:500" json:"cover_image"`
	Category      string     `gorm:"size:100" json:"category"`
	ServiceCode   *string    `gorm:"size:32" json:"service_code"`
	ContentBlocks JSONField  `gorm:"type:json;not null" json:"content_blocks"`
	SEOMeta       JSONField  `gorm:"type:json;not null" json:"seo_meta"`
	PublishedAt   *time.Time `json:"published_at"`
	IsPublished   bool       `gorm:"default:false" json:"is_published"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// SEORedirect represents automated 301 redirects to protect SEO rankings
type SEORedirect struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	OldPath    string    `gorm:"size:255;uniqueIndex;not null" json:"old_path"`
	NewPath    string    `gorm:"size:255;not null" json:"new_path"`
	StatusCode int       `gorm:"default:301" json:"status_code"`
	CreatedAt  time.Time `json:"created_at"`
}

// Lead represents inquiries and proposal requests
type Lead struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	FullName    string    `gorm:"size:150;not null" json:"full_name"`
	Email       string    `gorm:"size:150;not null" json:"email"`
	Phone       string    `gorm:"size:50;not null" json:"phone"`
	ServiceCode *string   `gorm:"size:32" json:"service_code"`
	BudgetRange string    `gorm:"size:100" json:"budget_range"`
	Message     string    `gorm:"type:text" json:"message"`
	SourcePage  string    `gorm:"size:200" json:"source_page"`
	Status      string    `gorm:"size:50;default:'new'" json:"status"` // new, contacted, qualified, closed
	CreatedAt   time.Time `json:"created_at"`
}
