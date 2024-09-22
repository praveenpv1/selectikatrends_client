
const appGlobalState = {
  settings: {
    apploading: true,
    env: process.env.REACT_APP_ENV,
    api: {
      apiBaseUrl: process.env.REACT_APP_APIBASEURL,
      apiRequestHeaders: {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      },
    },
    
  },
  feedposts: {
    data: [],
    dataItemTemplate: [
      'attached_carousel_media_urls',
      'attached_media_display_url',
      'attached_video_url',
      'owner_username',
      'created_time',
      'attached_media_content',
      
      'attached_media_tagged_users',
      
      'coauthor_producers',
      'comments_count',
      
      // id: null,
      'is_comments_disabled',
      'is_video',
      'like_and_view_counts_disabled',
      'likes_count',
      'location_id',
      'owner_id',
      
      'product_type',
      'related_posts',
      'shortcode',
      'sponsors',
      'text',
      'text_lang',
      'text_tagged_users',
      'text_tags',
      'timestamp',
      'video_plays_count',
      'video_views_count',
    ]
  }
  
};

export default appGlobalState;
