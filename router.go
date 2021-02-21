package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"snippet-manager/controller"
	"snippet-manager/middleware"
)

func SetIndexRouter(router *gin.Engine) {
	router.GET("/status", controller.GetStatus)
	router.POST("/auth", controller.Auth)
	router.Use(static.Serve("/", static.LocalFile("./web/build", true)))
}

func SetApiRouter(router *gin.Engine) {
	apiGroup := router.Group("/api/")
	{
		basicAuth := apiGroup.Group("/")
		basicAuth.Use(middleware.JWTAuthMiddleware())
		{
			basicAuth.GET("/user", controller.GetUser)
			basicAuth.PUT("/user", controller.UpdateUser)

			basicAuth.POST("/snippet", controller.CreateSnippet)
			basicAuth.PUT("/snippet/:id", controller.UpdateSnippet)
			basicAuth.DELETE("/snippet/:id", controller.DeleteSnippet)

			adminAuth := basicAuth.Group("/")
			adminAuth.Use(middleware.AdminAuthMiddleware())
			{
				adminAuth.GET("/user/:username", controller.GetUser)
				adminAuth.PUT("/user/:username", controller.UpdateUser)
				adminAuth.DELETE("/user/:username", controller.DeleteUser)
			}
		}
		apiGroup.GET("/snippet/:id", controller.GetSnippet)
		apiGroup.POST("/user", controller.CreateUser)
	}
}
