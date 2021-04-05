package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Tag struct {
	ID          uuid.UUID `gorm:"primaryKey"`
	UserID      uuid.UUID
	Text        string `gorm:"unique"`
	Description string
}

func (t *Tag) BeforeCreate(*gorm.DB) (err error) {
	t.ID = uuid.New()
	return
}
