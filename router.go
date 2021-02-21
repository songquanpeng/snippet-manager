package main

import "github.com/gin-gonic/gin"

func SetIndexRouter(router *gin.Engine) {
	router.Static("/", "./web/build")
}

func SetApiRouter(router *gin.Engine) {

}
