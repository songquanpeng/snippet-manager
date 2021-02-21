package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Snippet struct {
	gorm.Model
	Id          uuid.UUID
	UserId      uuid.UUID
	Language    string
	Code        string
	Title       string
	Description string
}
