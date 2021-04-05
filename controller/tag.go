package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
	"snippet-manager/model"
)

func GetTags(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	var tags []*model.Tag
	if err := model.DB.Where("user_id", userID).Order("text desc").Find(&tags).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    tags,
	})
}

func DeleteTag(c *gin.Context) {
	// TODO: delete tag

	// Remove from database

	// Clear cache
}
