package model

import "github.com/google/uuid"

type TagSnippet struct {
	UserId    uuid.UUID `gorm:"primaryKey"`
	TagID     uuid.UUID `gorm:"primaryKey"`
	SnippetId uuid.UUID `gorm:"primaryKey"`
}
