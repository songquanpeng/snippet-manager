package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
)

func GetSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "GetSnippet",
	})
}

func CreateSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "CreateSnippet",
	})
}

func UpdateSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "UpdateSnippet",
	})
}

func DeleteSnippet(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "DeleteSnippet",
	})
}
