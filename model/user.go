package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Id       uuid.UUID
	Username string
	Password string
	IsAdmin  bool
	IsBanned bool
}
