package model

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func init() {
	db, err := gorm.Open(sqlite.Open("./.snippet-manager.db"), &gorm.Config{})
	if err == nil {
		DB = db
		_ = db.AutoMigrate(&User{}, &Snippet{})
	} else {
		log.Fatal(err)
	}
	return
}
