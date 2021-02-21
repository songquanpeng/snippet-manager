package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Snippet struct {
	gorm.Model
	Id          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	UserId      uuid.UUID
	Language    string
	Code        string
	Title       string
	Description string
}
