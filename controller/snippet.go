package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": "GetSnippet",
	})
}

func CreateSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": "CreateSnippet",
	})
}

func UpdateSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": "UpdateSnippet",
	})
}

func DeleteSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": "DeleteSnippet",
	})
}
