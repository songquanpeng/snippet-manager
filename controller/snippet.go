package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"snippet-manager/cache"
	"snippet-manager/common"
	"snippet-manager/model"
	"sort"
	"strings"
)

func getUserID(c *gin.Context) (id uuid.UUID, ok bool) {
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

// Pagination
func GetSnippetsByUser(c *gin.Context) {
	userId, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	var snippets []*model.Snippet
	if err := model.DB.Where("user_id", userId).Order("updated_at desc").Find(&snippets).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    snippets,
	})
}

func GetSnippetsByTag(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	tagID := c.Param("tagID")

	var briefSnippets []*model.BriefSnippet
	if err := model.DB.Table("tag_snippets").Where("tag_id", tagID).Where("tag_snippets.user_id", userID).Select("snippets.id, snippets.title").Joins("left join snippets on snippets.id = tag_snippets.snippet_id").Order("updated_at desc").Scan(&briefSnippets).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    briefSnippets,
	})
}

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
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	var snippet *model.Snippet
	if err := c.ShouldBind(&snippet); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "invalid parameters",
		})
		return
	}
	snippet.UserID = userID

	if err := model.DB.Create(&snippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	message := "ok"
	for _, tag := range strings.Split(snippet.Tags, " ") {
		if tagId, ok := cache.GetTagID(userID, tag); ok {
			tagSnippet := model.TagSnippet{
				UserID:    userID,
				SnippetID: snippet.ID,
				TagID:     tagId,
			}
			if err := model.DB.FirstOrCreate(&tagSnippet).Error; err != nil {
				message = err.Error()
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": message,
		"data":    gin.H{"snippet": snippet},
	})
}

func UpdateSnippet(c *gin.Context) {
	userID, ok := getUserID(c)
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
	if err := model.DB.Where("id = ?", newSnippet.ID).Where("user_id", userID).First(oldSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}

	// Check if tags are changed.
	if oldSnippet.Tags != newSnippet.Tags {
		oldTags := strings.Split(oldSnippet.Tags, " ")
		newTags := strings.Split(newSnippet.Tags, " ")
		sort.Strings(oldTags)
		sort.Strings(newTags)
		for i := 0; i < len(oldTags) || i < len(newTags); i++ {
			if i < len(oldTags) && i < len(newTags) {
				if oldTags[i] == newTags[i] {
					continue
				}
			}
			// Delete abandoned tags.
			if i < len(oldTags) {
				if tagId, ok := cache.GetTagID(userID, oldTags[i]); ok {
					if err := model.DB.Where("snippet_id", oldSnippet.ID).Where("tag_id", tagId).Delete(model.TagSnippet{}).Error; err != nil {
						fmt.Print(err)
					}
				}
			}
			// Create new added tags.
			if i < len(newTags) {
				if tagId, ok := cache.GetTagID(userID, newTags[i]); ok {
					tagSnippet := model.TagSnippet{
						UserID:    userID,
						SnippetID: oldSnippet.ID,
						TagID:     tagId,
					}
					if err := model.DB.FirstOrCreate(&tagSnippet).Error; err != nil {
						fmt.Println(err)
					}
				}
			}

		}
	}

	newSnippet.UserID = userID
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
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusInvalidParameter,
			"message": "unable to get your id",
		})
	}
	oldSnippet := &model.Snippet{}
	if err := model.DB.Where("id = ?", id).Where("user_id", userID).First(oldSnippet).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusRecordNotFound,
			"message": "record not found",
		})
		return
	}
	if err := model.DB.Where("snippet_id", oldSnippet.ID).Delete(model.TagSnippet{}).Error; err != nil {
		fmt.Print(err)
	}
	if err := model.DB.Delete(oldSnippet).Error; err != nil {
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
	if err := model.DB.Where("title LIKE ? or description LIKE ? or code LIKE ? or language LIKE ? or tags LIKE ?", "%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%", "%"+query+"%").Order("updated_at desc").Find(&snippets).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    common.StatusError,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    common.StatusOk,
		"message": "ok",
		"data":    snippets,
	})
}
