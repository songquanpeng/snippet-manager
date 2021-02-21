package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
)

func GetUser(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "GetUser",
	})
}

func CreateUser(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "CreateUser",
	})
}

func UpdateUser(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "UpdateUser",
	})
}

func DeleteUser(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    common.StatusOk,
		"message": "DeleteUser",
	})
}
