package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Snippet struct {
	gorm.Model
	ID          uuid.UUID
	UserId      uuid.UUID
	Language    string
	Code        string
	Title       string
	Tags        string // Spilt by "," without space.
	Description string
}

func (s *Snippet) BeforeCreate(*gorm.DB) (err error) {
	s.ID = uuid.New()
	return
}