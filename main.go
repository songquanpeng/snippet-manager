package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"snippet-manager/model"
)

func setupServer() *gin.Engine {
	if os.Getenv("MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}
	server := gin.Default()
	server.Use(cors.Default())
	SetApiRouter(server)
	SetIndexRouter(server)
	return server
}

func main() {
	db, _ := model.DB.DB()
	defer db.Close()

	server := setupServer()
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
