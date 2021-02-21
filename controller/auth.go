package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
	"snippet-manager/model"
)

func Auth(c *gin.Context) {
	var user model.User
	err := c.ShouldBind(&user)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}

	// TODO: fetch user from database, do not use this one
	user.IsAdmin = false
	user.IsBanned = true

	// TODO: verify the username & password
	if user.Username == "admin" && user.Password == "123456" {
		tokenString, _ := common.GenerateToken(user)
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusOk,
			"message": "ok",
			"data":    gin.H{"token": tokenString},
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusInvalidParameter,
		"message": "invalid pair of username and password",
	})
	return
}
