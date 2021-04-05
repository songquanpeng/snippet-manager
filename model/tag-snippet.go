package model

import "github.com/google/uuid"

type TagSnippet struct {
	UserID    uuid.UUID `gorm:"primaryKey"`
	TagID     uuid.UUID `gorm:"primaryKey"`
	SnippetID uuid.UUID `gorm:"primaryKey"`
}
