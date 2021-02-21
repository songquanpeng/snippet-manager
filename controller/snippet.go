package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"snippet-manager/common"
	"snippet-manager/model"
	"strings"
)

func GetSnippet(c *gin.Context) {
	id := c.Param("id")
	snippet := &model.Snippet{}
	if err := model.DB.Where("id = ?", id).First(snippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"snippet": snippet},
	})
}

func CreateSnippet(c *gin.Context) {
	var snippet *model.Snippet
	if err := c.ShouldBind(&snippet); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}
	if err := model.DB.Create(&snippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"snippet": snippet},
	})
}

func getUserId(c *gin.Context) (id uuid.UUID, ok bool) {
	// First check the cache.
	value, ok := c.Get("id")
	if ok {
		return value.(uuid.UUID), true
	}
	// Cache miss.
	value, ok = c.Get("username")
	if !ok {
		return id, false
	}
	username := value.(string)
	user := &model.User{}
	if err := model.DB.Where("username = ?", username).First(user).Error; err != nil {
		return id, false
	}
	// Save to cache
	c.Set("id", user.ID)
	return user.ID, true
}

func UpdateSnippet(c *gin.Context) {
	userId, ok := getUserId(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	var newSnippet model.Snippet
	if err := c.ShouldBind(&newSnippet); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}
	oldSnippet := &model.Snippet{}
	if err := model.DB.Where("id = ?", newSnippet.ID).Where("user_id", userId).First(oldSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	if err := model.DB.Save(newSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    gin.H{"snippet": newSnippet},
	})
}

func DeleteSnippet(c *gin.Context) {
	id := c.Param("id")
	userId, ok := getUserId(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	oldSnippet := &model.Snippet{}
	if err := model.DB.Where("id = ?", id).Where("user_id", userId).First(oldSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	if err := model.DB.Unscoped().Delete(oldSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
	})
}

func SearchSnippet(c *gin.Context) {
	query := c.Param("query")
	query = strings.ToLower(query)
	var snippets []*model.Snippet
	if err := model.DB.Where("title LIKE ? or description LIKE ? or code LIKE ? or language LIKE ?", "%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%").Order("id desc").Find(&snippets).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    snippets,
	})
}
