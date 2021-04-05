package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Snippet struct {
	ID          uuid.UUID `gorm:"primaryKey"`
	UserID      uuid.UUID
	Language    string
	Code        string
	Title       string
	Tags        string
	Description string
}

func (s *Snippet) BeforeCreate(*gorm.DB) (err error) {
	s.ID = uuid.New()
	return
}

type BriefSnippet struct {
	ID    uuid.UUID
	Title string
}
