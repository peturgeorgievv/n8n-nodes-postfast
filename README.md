# n8n-nodes-postfast

This is an n8n community node for [PostFast](https://postfa.st) - a comprehensive social media management and scheduling platform. It allows you to create, manage, and schedule posts across multiple social media channels directly from your n8n workflows.

**Node Name in n8n:** PostFast - Social Media Management

## Features

- 🚀 **Multi-Platform Support**: Facebook, Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Pinterest
- 📸 **Media Management**: Upload images and videos with pre-signed S3 URLs
- 📅 **Advanced Scheduling**: Schedule posts using UTC timestamps (ISO 8601 format)
- 🎯 **Platform-Specific Controls**: Reels, Stories, Shorts, Carousels, Drafts
- 🔍 **Smart Filtering**: Query posts by platform, status, and date ranges
- 📊 **Pagination Support**: Handle large datasets efficiently
- 🔐 **Secure Authentication**: API key-based authentication

## Installation

### In n8n (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Search for `n8n-nodes-postfast`
3. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-postfast
```

## Authentication

To use this node, you'll need:

1. **PostFast API Key**:
   - Log in to your PostFast account
   - Navigate to Settings → API Keys
   - Create a new API key
   - Copy the key (you won't be able to see it again)

2. **Add Credentials in n8n**:
   - In n8n, go to Credentials
   - Create new "PostFast API" credentials
   - Enter your API key

## Resources & Operations

### 📁 File Resource

#### Get Upload URL
Generate pre-signed S3 URLs for uploading media files.

**Parameters:**
- **Content Type**: MIME type (image/jpeg, image/png, image/gif, video/mp4, video/quicktime, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation)
- **Count**: Number of URLs to generate (1-10)

**Limits:**
- Max file size: 250 MB (video), 10 MB (image)
- Rate limit: 150 requests per day

**Usage Example:**
1. Use this operation to get S3 upload URLs
2. Upload your files directly to S3 using the signed URLs
3. Use the returned `key` in your social posts

---

### 👥 Social Account Resource

#### Get All
Retrieve all connected social media accounts for your workspace.

**Returns:**
- Account IDs (needed for posting)
- Platform types
- Account names and handles
- Connection status

**Rate limit:** 90 requests per hour

#### Get Pinterest Boards
Retrieve Pinterest boards for a connected Pinterest account. Use the returned `boardId` in the `Pinterest Board ID` control when creating Pinterest posts.

**Parameters:**
- **Social Media Account ID**: ID of the connected Pinterest account (from Get All)

**Rate limit:** 90 requests per hour

#### Get YouTube Playlists
Retrieve YouTube playlists for a connected YouTube account. Use the returned `playlistId` in the `YouTube Playlist ID` control when creating YouTube posts.

**Parameters:**
- **Social Media Account ID**: ID of the connected YouTube account (from Get All)

**Rate limit:** 90 requests per hour

---

### 📝 Social Post Resource

#### Create Post
Create and schedule posts with platform-specific features.

**Core Parameters:**
- **Platform**: Facebook, Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Pinterest
- **Social Media Account ID**: From Social Account > Get All
- **Content**: Post text with emoji support
- **Scheduled At**: ISO 8601 datetime
- **Media Items**: Images/videos with S3 keys
- **First Comment**: Automatic first comment posted ~10 seconds after publish (supported on X, Instagram, Facebook, YouTube, and Threads)

**Platform-Specific Controls:**

**X (Twitter):**
- Community ID for posting to X Communities
- Quote Tweet URL for quoting tweets with commentary
- Retweet URL for retweeting without changes

**Facebook:**
- Content Types: Post, Reel, Story
- Reels collaborators
- Multi-image support

**Instagram:**
- Publish Types: Timeline, Story, Reel
- Grid posting option
- Collaborators
- Carousel support (up to 10 items)

**TikTok:**
- Privacy: Public, Mutual Friends, Only Me
- Allow Comments/Duet/Stitch
- Draft mode
- Brand Organic / Brand Content flags
- Auto-add music
- Carousel posts (2-35 images)

**YouTube:**
- Title, Privacy (Public, Private, Unlisted)
- Tags, Category ID
- Shorts support
- Made for Kids (COPPA) flag
- Playlist ID (from Social Account > Get YouTube Playlists)

**LinkedIn:**
- Document attachments (PDF, DOC, DOCX, PPT, PPTX)
- Attachment title

**Pinterest:**
- Board ID (required, from Social Account > Get Pinterest Boards)
- Destination link URL
- Content parsing: first line → title, remaining → description
- Carousel pins (2-5 static images)

#### Get Many Posts
Query and filter your scheduled posts with advanced options.

**Filter Options:**
- **Platforms**: Filter by one or more platforms
- **Statuses**: DRAFT, SCHEDULED, PUBLISHED, FAILED
- **Date Range**: From/To dates (ISO 8601)
- **Pagination**: Page-based navigation

**Return Options:**
- Return all results (auto-pagination)
- Limit results (1-50 per page)

**Response Includes:**
- Post content and media
- Scheduling information
- Publishing status
- Error messages (for failed posts)
- Platform-specific metadata

#### Delete Post
Remove scheduled or failed posts.

**Parameters:**
- **Post ID**: Unique identifier of the post

**Rate limit:** 160 requests per hour

## Workflow Examples

### 1. Content Calendar Automation
```
Notion Database → PostFast (Create) → Multiple Platforms
```
Pull content from Notion and schedule across all platforms.

### 2. Media Processing Pipeline
```
Dropbox → Image Processing → PostFast (Get Upload URL) → S3 Upload → PostFast (Create)
```
Process images and videos before posting.

### 3. Failed Post Recovery
```
Schedule Trigger → PostFast (Get Many: status=FAILED) → Error Handler → Retry/Notify
```
Monitor and handle failed posts automatically.

### 4. Cross-Platform Campaign
```
RSS Feed → AI Content Generator → PostFast (Create: Multiple Platforms)
```
Generate and distribute content across all channels.

## Rate Limits

**Global Limits (per API key):**
- 60 requests per minute
- 150 requests per 5 minutes
- 300 requests per hour
- 1000 requests per day

**Endpoint-Specific:**
- File uploads: 150/day
- Post creation: 75/day
- Post queries: 90/hour
- Post deletion: 160/hour

## Error Handling

The node provides detailed error messages for common scenarios:

- `401`: Invalid API key
- `404`: Resource not found (check IDs)
- `429`: Rate limit exceeded
- `400`: Invalid parameters

## Platform Requirements

- **Node.js**: v18.0.0 or higher
- **n8n**: v1.0.0 or higher
- **API Key**: PostFast workspace API key

## Advanced Features

### Batch Operations
Process multiple items in a single workflow execution for efficiency.

### Error Recovery
Built-in error handling with detailed messages for debugging.

### Pagination Handling
Automatic pagination when fetching all results.

### Media Validation
Automatic MIME type detection and size validation.

## Development

### Setup
```bash
git clone https://github.com/peturgeorgievv/n8n-nodes-postfast.git
cd n8n-nodes-postfast
npm install
```

### Testing
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Check code quality
```

### Publishing
```bash
npm login
npm publish --access public
```

## Support

- **Documentation**: [PostFast API Docs](https://api.postfa.st/docs)
- **Issues**: [GitHub Issues](https://github.com/peturgeorgievv/n8n-nodes-postfast/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io)
- **Developer Support**: [me@peturgeorgievv.com](mailto:me@peturgeorgievv.com)

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### v0.1.0
- Initial release with full PostFast API support
- Multi-platform posting capabilities
- Advanced filtering and pagination
- Media upload management
- Platform-specific controls for all major social networks