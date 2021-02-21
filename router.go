package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
	"snippet-manager/controller"
	"snippet-manager/middleware"
)

func SetIndexRouter(router *gin.Engine) {
	router.GET("/status", controller.GetStatus)
	router.POST("/auth", controller.Auth)
	router.Use(static.Serve("/", static.LocalFile("./web/build", true)))
	router.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path == "/" {
			c.Redirect(http.StatusSeeOther, common.FallbackFrontendAddress)
		} else {
			c.JSON(http.StatusNotFound, gin.H{
				"code":    common.StatusError,
				"message": "the requested url does not exist",
			})
		}
	})
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
			basicAuth.PUT("/snippet", controller.UpdateSnippet)
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
		apiGroup.GET("/search/snippet", controller.SearchSnippet)
		apiGroup.GET("/search/snippet/:query", controller.SearchSnippet)
		apiGroup.POST("/user", controller.CreateUser)
	}
}
