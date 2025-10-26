import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PostFastApi implements ICredentialType {
	name = 'postFastApi';
	displayName = 'PostFast API';
	documentationUrl = 'https://github.com/peturgeorgievv/n8n-nodes-postfast';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your PostFast API key',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.postfa.st',
			required: true,
			description: 'Override for staging/self-hosted PostFast instances',
			placeholder: 'https://api.postfa.st',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'pf-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/social-media/my-social-accounts',
			method: 'GET',
		},
	};
}