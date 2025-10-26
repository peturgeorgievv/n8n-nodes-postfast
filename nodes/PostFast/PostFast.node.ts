import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';

export class PostFast implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PostFast - Social Media Management',
		name: 'postFast',
		icon: 'file:postfast.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Schedule and manage social media posts across Facebook, Instagram, TikTok, Twitter/X, LinkedIn, YouTube, and Pinterest',
		defaults: {
			name: 'PostFast - Social Media',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'postFastApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'File',
						value: 'file',
						description: 'Manage file uploads',
					},
					{
						name: 'Social Account',
						value: 'socialAccount',
						description: 'Manage social media accounts',
					},
					{
						name: 'Social Post',
						value: 'socialPost',
						description: 'Create and manage social media posts',
					},
				],
				default: 'socialPost',
			},

			// File Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
				options: [
					{
						name: 'Get Upload URL',
						value: 'getUploadUrl',
						description: 'Generate pre-signed URLs for uploading media files',
						action: 'Get upload URL',
					},
				],
				default: 'getUploadUrl',
			},

			// Social Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['socialAccount'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all connected social media accounts',
						action: 'Get all social accounts',
					},
				],
				default: 'getAll',
			},

			// Social Post Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['socialPost'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create and schedule one or more social media posts',
						action: 'Create social posts',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a scheduled or failed post',
						action: 'Delete social post',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Query and paginate social posts',
						action: 'Get many social posts',
					},
				],
				default: 'create',
			},

			// ===========================
			// File: Get Upload URL
			// ===========================
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['getUploadUrl'],
					},
				},
				options: [
					{
						name: 'Image (JPEG)',
						value: 'image/jpeg',
					},
					{
						name: 'Image (PNG)',
						value: 'image/png',
					},
					{
						name: 'Image (GIF)',
						value: 'image/gif',
					},
					{
						name: 'Video (MP4)',
						value: 'video/mp4',
					},
					{
						name: 'Video (MOV)',
						value: 'video/quicktime',
					},
				],
				default: 'image/jpeg',
				description: 'MIME type of the file to upload',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['getUploadUrl'],
					},
				},
				description: 'Number of upload URLs to generate',
			},

			// ===========================
			// Social Post: Create
			// ===========================
			{
				displayName: 'Posts',
				name: 'posts',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['create'],
					},
				},
				default: {},
				placeholder: 'Add Post',
				options: [
					{
						name: 'post',
						displayName: 'Post',
						values: [
							{
								displayName: 'Social Media Account ID',
								name: 'socialMediaId',
								type: 'string',
								default: '',
								required: true,
								description: 'ID of the connected social media account (get from Social Account > Get All)',
								placeholder: '550e8400-e29b-41d4-a716-446655440001',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								required: true,
								typeOptions: {
									rows: 4,
								},
								description: 'The text content of the post',
							},
							{
								displayName: 'Scheduled At',
								name: 'scheduledAt',
								type: 'dateTime',
								default: '',
								description: 'When to publish the post (ISO 8601 format). Required unless status is DRAFT.',
							},
							{
								displayName: 'Status',
								name: 'status',
								type: 'options',
								options: [
									{
										name: 'Scheduled',
										value: 'SCHEDULED',
									},
									{
										name: 'Draft',
										value: 'DRAFT',
									},
								],
								default: 'SCHEDULED',
								description: 'Post status',
							},
							{
								displayName: 'Approval Status',
								name: 'approvalStatus',
								type: 'options',
								options: [
									{
										name: 'Approved',
										value: 'APPROVED',
									},
									{
										name: 'Pending Approval',
										value: 'PENDING_APPROVAL',
									},
								],
								default: 'APPROVED',
								description: 'Approval status for the post',
							},
							{
								displayName: 'Media Items',
								name: 'mediaItems',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								options: [
									{
										name: 'media',
										displayName: 'Media',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
												required: true,
												description: 'S3 key of the uploaded media file (from File > Get Upload URL)',
												placeholder: 'image/a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg',
											},
											{
												displayName: 'Type',
												name: 'type',
												type: 'options',
												options: [
													{
														name: 'Image',
														value: 'IMAGE',
													},
													{
														name: 'Video',
														value: 'VIDEO',
													},
												],
												default: 'IMAGE',
												required: true,
											},
											{
												displayName: 'Sort Order',
												name: 'sortOrder',
												type: 'number',
												default: 0,
												required: true,
												description: 'Order of media in carousel posts',
											},
											{
												displayName: 'Cover Timestamp',
												name: 'coverTimestamp',
												type: 'string',
												default: '',
												description: 'Timestamp in seconds for video thumbnail',
												displayOptions: {
													show: {
														type: ['VIDEO'],
													},
												},
											},
										],
									},
								],
							},
						],
					},
				],
			},

			// Platform-Specific Controls (applies to all posts in the batch)
			{
				displayName: 'Platform Controls (Applies to All Posts)',
				name: 'controls',
				type: 'collection',
				placeholder: 'Add Control',
				default: {},
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['create'],
					},
				},
				description: 'Platform-specific controls that apply to ALL posts in this batch',
				options: [
					// X (Twitter) Controls
					{
						displayName: 'X Community ID',
						name: 'xCommunityId',
						type: 'string',
						default: '',
						description: 'Community ID for X posts',
					},
					// Facebook Controls
					{
						displayName: 'Facebook Content Type',
						name: 'facebookContentType',
						type: 'options',
						options: [
							{
								name: 'Post',
								value: 'POST',
								description: 'Up to 10 photos or 1 video',
							},
							{
								name: 'Reel',
								value: 'REEL',
								description: '1 video only',
							},
							{
								name: 'Story',
								value: 'STORY',
								description: '1 image or 1 video',
							},
						],
						default: 'POST',
						description: 'Type of Facebook content to create',
					},
					{
						displayName: 'Facebook Reels Collaborators',
						name: 'facebookReelsCollaborators',
						type: 'string',
						default: '',
						description: 'Comma-separated Facebook usernames for Reel collaboration',
						placeholder: 'username1,username2',
					},
					// Instagram Controls
					{
						displayName: 'Instagram Publish Type',
						name: 'instagramPublishType',
						type: 'options',
						options: [
							{
								name: 'Timeline',
								value: 'TIMELINE',
							},
							{
								name: 'Story',
								value: 'STORY',
							},
							{
								name: 'Reel',
								value: 'REEL',
							},
						],
						default: 'TIMELINE',
						description: 'Type of Instagram content to create',
					},
					{
						displayName: 'Instagram Post to Grid',
						name: 'instagramPostToGrid',
						type: 'boolean',
						default: true,
						description: 'Whether to post to Instagram profile grid',
					},
					{
						displayName: 'Instagram Collaborators',
						name: 'instagramCollaborators',
						type: 'string',
						default: '',
						description: 'Comma-separated Instagram usernames for collaboration',
						placeholder: 'username1,username2',
					},
					// TikTok Controls
					{
						displayName: 'TikTok Privacy',
						name: 'tiktokPrivacy',
						type: 'options',
						options: [
							{
								name: 'Public',
								value: 'PUBLIC',
							},
							{
								name: 'Mutual Friends',
								value: 'MUTUAL_FRIENDS',
							},
							{
								name: 'Only Me',
								value: 'ONLY_ME',
							},
						],
						default: 'PUBLIC',
						description: 'Privacy setting for TikTok post',
					},
					{
						displayName: 'TikTok Is Draft',
						name: 'tiktokIsDraft',
						type: 'boolean',
						default: false,
						description: 'Whether to save as draft on TikTok',
					},
					{
						displayName: 'TikTok Allow Comments',
						name: 'tiktokAllowComments',
						type: 'boolean',
						default: true,
						description: 'Whether to allow comments on TikTok',
					},
					{
						displayName: 'TikTok Allow Duet',
						name: 'tiktokAllowDuet',
						type: 'boolean',
						default: true,
						description: 'Whether to allow duets on TikTok',
					},
					{
						displayName: 'TikTok Allow Stitch',
						name: 'tiktokAllowStitch',
						type: 'boolean',
						default: true,
						description: 'Whether to allow stitch on TikTok',
					},
					{
						displayName: 'TikTok Brand Organic',
						name: 'tiktokBrandOrganic',
						type: 'boolean',
						default: false,
						description: 'Whether this is brand organic content',
					},
					{
						displayName: 'TikTok Brand Content',
						name: 'tiktokBrandContent',
						type: 'boolean',
						default: false,
						description: 'Whether this is branded content',
					},
					{
						displayName: 'TikTok Auto Add Music',
						name: 'tiktokAutoAddMusic',
						type: 'boolean',
						default: false,
						description: 'Whether to auto-add music',
					},
					// YouTube Controls
					{
						displayName: 'YouTube Title',
						name: 'youtubeTitle',
						type: 'string',
						default: '',
						description: 'Video title. If not provided, first 100 chars of content will be used.',
					},
					{
						displayName: 'YouTube Privacy',
						name: 'youtubePrivacy',
						type: 'options',
						options: [
							{
								name: 'Public',
								value: 'PUBLIC',
							},
							{
								name: 'Private',
								value: 'PRIVATE',
							},
							{
								name: 'Unlisted',
								value: 'UNLISTED',
							},
						],
						default: 'PUBLIC',
						description: 'YouTube video privacy setting',
					},
					{
						displayName: 'YouTube Tags',
						name: 'youtubeTags',
						type: 'string',
						default: '',
						description: 'Comma-separated tags for the video',
						placeholder: 'tag1,tag2,tag3',
					},
					{
						displayName: 'YouTube Category ID',
						name: 'youtubeCategoryId',
						type: 'string',
						default: '',
						description: 'YouTube category ID',
					},
					{
						displayName: 'YouTube Is Short',
						name: 'youtubeIsShort',
						type: 'boolean',
						default: true,
						description: 'Whether this is a YouTube Short',
					},
					{
						displayName: 'YouTube Made for Kids',
						name: 'youtubeMadeForKids',
						type: 'boolean',
						default: false,
						description: 'COPPA compliance flag',
					},
				],
			},

			// ===========================
			// Social Post: Get Many
			// ===========================
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['getMany'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['getMany'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				default: 20,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Platforms',
						name: 'platforms',
						type: 'multiOptions',
						options: [
							{
								name: 'Facebook',
								value: 'FACEBOOK',
							},
							{
								name: 'Instagram',
								value: 'INSTAGRAM',
							},
							{
								name: 'TikTok',
								value: 'TIKTOK',
							},
							{
								name: 'Twitter/X',
								value: 'X',
							},
							{
								name: 'LinkedIn',
								value: 'LINKEDIN',
							},
							{
								name: 'YouTube',
								value: 'YOUTUBE',
							},
							{
								name: 'Pinterest',
								value: 'PINTEREST',
							},
						],
						default: [],
						description: 'Filter posts by platform',
					},
					{
						displayName: 'Statuses',
						name: 'statuses',
						type: 'multiOptions',
						options: [
							{
								name: 'Draft',
								value: 'DRAFT',
							},
							{
								name: 'Scheduled',
								value: 'SCHEDULED',
							},
							{
								name: 'Published',
								value: 'PUBLISHED',
							},
							{
								name: 'Failed',
								value: 'FAILED',
							},
						],
						default: [],
						description: 'Filter posts by status',
					},
					{
						displayName: 'From Date',
						name: 'from',
						type: 'dateTime',
						default: '',
						description: 'Filter posts scheduled from this date (ISO 8601)',
					},
					{
						displayName: 'To Date',
						name: 'to',
						type: 'dateTime',
						default: '',
						description: 'Filter posts scheduled until this date (ISO 8601)',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 0,
						description: 'Page number for pagination (0-based)',
					},
				],
			},

			// ===========================
			// Social Post: Delete
			// ===========================
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['socialPost'],
						operation: ['delete'],
					},
				},
				default: '',
				description: 'ID of the post to delete',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('postFastApi');
		const baseUrl = 'https://api.postfa.st';

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				const options: any = {
					headers: {
						'pf-api-key': credentials.apiKey,
						'Content-Type': 'application/json',
					},
					method: 'GET',
					url: '',
					json: true,
				};

				// ===========================
				// File Resource
				// ===========================
				if (resource === 'file') {
					if (operation === 'getUploadUrl') {
						const contentType = this.getNodeParameter('contentType', i) as string;
						const count = this.getNodeParameter('count', i) as number;

						options.method = 'POST';
						options.url = `${baseUrl}/file/get-signed-upload-urls`;
						options.body = {
							contentType,
							count,
						};

						responseData = await this.helpers.httpRequest(options);
					}
				}

				// ===========================
				// Social Account Resource
				// ===========================
				else if (resource === 'socialAccount') {
					if (operation === 'getAll') {
						options.url = `${baseUrl}/social-media/my-social-accounts`;
						responseData = await this.helpers.httpRequest(options);
					}
				}

				// ===========================
				// Social Post Resource
				// ===========================
				else if (resource === 'socialPost') {
					if (operation === 'create') {
						const postsInput = this.getNodeParameter('posts', i) as IDataObject;
						const controlsInput = this.getNodeParameter('controls', i) as IDataObject;

						// Build posts array
						const posts: any[] = [];
						if (postsInput.post && Array.isArray(postsInput.post)) {
							for (const postItem of postsInput.post) {
								const post: any = {
									socialMediaId: postItem.socialMediaId,
									content: postItem.content,
								};

								// Add optional fields
								if (postItem.scheduledAt) {
									post.scheduledAt = postItem.scheduledAt;
								}
								if (postItem.status) {
									post.status = postItem.status;
								}
								if (postItem.approvalStatus) {
									post.approvalStatus = postItem.approvalStatus;
								}

								// Add media items if provided
								if (postItem.mediaItems && (postItem.mediaItems as IDataObject).media) {
									const mediaArray = (postItem.mediaItems as IDataObject).media as IDataObject[];
									if (Array.isArray(mediaArray) && mediaArray.length > 0) {
										post.mediaItems = mediaArray;
									}
								}

								posts.push(post);
							}
						}

						// Build controls object
						const controls: IDataObject = {};

						// Handle string arrays that come as comma-separated strings
						if (controlsInput.facebookReelsCollaborators) {
							const collabs = controlsInput.facebookReelsCollaborators as string;
							controls.facebookReelsCollaborators = collabs.split(',').map(s => s.trim()).filter(s => s);
						}
						if (controlsInput.instagramCollaborators) {
							const collabs = controlsInput.instagramCollaborators as string;
							controls.instagramCollaborators = collabs.split(',').map(s => s.trim()).filter(s => s);
						}
						if (controlsInput.youtubeTags) {
							const tags = controlsInput.youtubeTags as string;
							controls.youtubeTags = tags.split(',').map(s => s.trim()).filter(s => s);
						}

						// Add other controls
						Object.keys(controlsInput).forEach((key) => {
							if (!['facebookReelsCollaborators', 'instagramCollaborators', 'youtubeTags'].includes(key) &&
								controlsInput[key] !== undefined && controlsInput[key] !== '') {
								controls[key] = controlsInput[key];
							}
						});

						options.method = 'POST';
						options.url = `${baseUrl}/social-posts`;
						options.body = {
							posts,
						};

						// Add controls if any were set
						if (Object.keys(controls).length > 0) {
							options.body.controls = controls;
						}

						responseData = await this.helpers.httpRequest(options);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const qs: IDataObject = {};

						// Handle pagination
						if (returnAll) {
							qs.limit = 50; // Maximum allowed
						} else {
							qs.limit = this.getNodeParameter('limit', i) as number;
						}

						// Add page parameter
						if (filters.page !== undefined) {
							qs.page = filters.page;
						} else {
							qs.page = 0;
						}

						// Add platform filter
						if (filters.platforms && Array.isArray(filters.platforms) && filters.platforms.length > 0) {
							qs.platforms = filters.platforms.join(',');
						}

						// Add status filter
						if (filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0) {
							qs.statuses = filters.statuses.join(',');
						}

						// Add date filters
						if (filters.from) {
							qs.from = filters.from;
						}
						if (filters.to) {
							qs.to = filters.to;
						}

						options.url = `${baseUrl}/social-posts`;
						options.qs = qs;

						if (returnAll) {
							// Handle pagination to get all results
							const allData: IDataObject[] = [];
							let hasNextPage = true;
							let currentPage = 0;

							while (hasNextPage) {
								options.qs.page = currentPage;
								const response = await this.helpers.httpRequest(options);

								if (response.data && Array.isArray(response.data)) {
									allData.push(...response.data);
								}

								hasNextPage = response.pageInfo?.hasNextPage || false;
								currentPage++;

								// Safety limit to prevent infinite loops
								if (currentPage > 100) break;
							}

							responseData = allData;
						} else {
							responseData = await this.helpers.httpRequest(options);
							// Extract just the data array if it exists
							if (responseData.data) {
								responseData = responseData.data;
							}
						}
					} else if (operation === 'delete') {
						const postId = this.getNodeParameter('postId', i) as string;

						options.method = 'DELETE';
						options.url = `${baseUrl}/social-posts/${postId}`;

						responseData = await this.helpers.httpRequest(options);
					}
				}

				// Handle response data
				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({ json: item });
					}
				} else if (responseData && typeof responseData === 'object') {
					returnData.push({ json: responseData });
				} else {
					returnData.push({ json: { response: responseData } });
				}
			} catch (error: any) {
				// Enhanced error handling
				if (error.response) {
					const statusCode = error.response.statusCode;
					const errorMessage = error.response.body?.message || error.response.body?.error || error.message;

					let friendlyMessage = `PostFast API Error (${statusCode}): ${errorMessage}`;

					// Add context-specific error messages
					if (statusCode === 401) {
						friendlyMessage = 'Authentication failed. Please check your API key in the PostFast credentials.';
					} else if (statusCode === 404) {
						friendlyMessage = 'Resource not found. Please check the endpoint or ID.';
					} else if (statusCode === 429) {
						friendlyMessage = 'Rate limit exceeded. Please wait before making more requests. Note: X (Twitter) has a limit of 5 posts per account per day.';
					} else if (statusCode === 400) {
						friendlyMessage = `Invalid request: ${errorMessage}. Please check your input parameters.`;
					}

					throw new NodeApiError(this.getNode(), error, {
						message: friendlyMessage,
						description: `Operation: ${resource}.${operation}`,
					});
				} else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
					throw new NodeOperationError(
						this.getNode(),
						`Cannot connect to PostFast API. Please check your API key and network connection.`,
						{ itemIndex: i }
					);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unexpected error during ${operation}: ${error.message}`,
						{ itemIndex: i }
					);
				}
			}
		}

		return [returnData];
	}
}