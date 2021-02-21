package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"snippet-manager/model"
)

func main() {
	if os.Getenv("MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	db, _ := model.DB.DB()
	defer db.Close()

	server := gin.Default()
	server.Use(cors.Default())
	SetApiRouter(server)
	SetIndexRouter(server)
	var port = "3000"
	if len(os.Args) > 1 {
		port = os.Args[1]
	} else {
		if os.Getenv("PORT") != "" {
			port = os.Getenv("PORT")
		}
	}
	fmt.Println("Server listen on port: " + port)
	log.Fatal(server.Run(":" + port))
}
