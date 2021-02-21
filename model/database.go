package model

import (
	"errors"
	"fmt"
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
	user := User{}
	if err := db.First(&user).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		user.Username = "admin"
		user.Password = "123456"
		user.IsAdmin = true
		if err := DB.Create(&user).Error; err != nil {
			fmt.Println(err.Error())
		}
	}

	return
}
