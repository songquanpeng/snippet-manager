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

	realUser := &model.User{}
	if err := model.DB.Where("username = ?", user.Username).First(realUser).Error; err == nil {
		if realUser.Password == user.Password {
			tokenString, _ := common.GenerateToken(*realUser)
			c.JSON(http.StatusOK, gin.H{
				"code":    common.StatusOk,
				"message": "ok",
				"data":    gin.H{"token": tokenString},
			})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusInvalidParameter,
		"message": "invalid pair of username and password",
	})
}
