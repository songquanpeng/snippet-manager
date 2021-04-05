package cache

import (
	"fmt"
	"github.com/google/uuid"
	"snippet-manager/model"
	"sync"
)

var tagCache = sync.Map{}

func GetTagID(userID uuid.UUID, text string) (uuid.UUID, bool) {
	key := userID.String() + text
	tagId, ok := tagCache.Load(key)
	if !ok {
		tag := &model.Tag{
			Text:   text,
			UserID: userID,
		}
		// Check the database
		if err := model.DB.Where("text = ?", text).FirstOrCreate(tag).Error; err != nil {
			fmt.Print(err)
			return uuid.UUID{}, false
		}
		tagId = tag.ID
		tagCache.Store(key, tagId)
	}
	return tagId.(uuid.UUID), true
}
