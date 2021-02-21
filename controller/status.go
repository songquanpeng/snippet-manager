package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
)

func GetStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "server is online",
		"data": gin.H{
			"version":         common.Version,
			"name":            common.AppName,
			"tokenExpireHour": common.TokenExpireHour,
		},
	})
}
