package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Tag struct {
	gorm.Model
	ID          uuid.UUID
	UserID      uuid.UUID
	Text        string `gorm:"unique"`
	Description string
}
