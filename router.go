package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"snippet-manager/controller"
	"snippet-manager/middleware"
)

func SetIndexRouter(router *gin.Engine) {
	router.POST("/auth", controller.Auth)
	router.Use(static.Serve("/", static.LocalFile("./web/build", true)))
}

func SetApiRouter(router *gin.Engine) {
	apiGroup := router.Group("/api/")
	{
		basicAuth := apiGroup.Group("/")
		basicAuth.Use(middleware.JWTAuthMiddleware())
		{
			basicAuth.GET("/user", controller.CreateUser)
			basicAuth.POST("/user", controller.CreateUser)
			basicAuth.PUT("/user", controller.UpdateUser)

			basicAuth.POST("/snippet", controller.CreateSnippet)
			basicAuth.PUT("/snippet/:id", controller.UpdateSnippet)
			basicAuth.DELETE("/snippet/:id", controller.DeleteSnippet)

			adminAuth := basicAuth.Group("/")
			adminAuth.Use(middleware.AdminAuthMiddleware())
			{
				adminAuth.GET("/user/:id", controller.GetUser)
				adminAuth.PUT("/user/:id", controller.UpdateUser)
				adminAuth.DELETE("/user/:id", controller.DeleteUser)
			}
		}
		apiGroup.GET("/snippet/:id", controller.GetSnippet)
	}
}
