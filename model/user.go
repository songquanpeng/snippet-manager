package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       uuid.UUID
	Username string `gorm:"unique"`
	Password string
	IsAdmin  bool
	IsBanned bool
	Tags     string // Spilt by "," without space.
}

func (u *User) BeforeCreate(*gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
