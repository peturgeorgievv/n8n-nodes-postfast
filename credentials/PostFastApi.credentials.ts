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
			typeOptions: { password: true },
			default: '',
			description: 'Your PostFast API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'pf-api-key': '{{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.postfa.st',
			url: '/social-media/my-social-accounts',
			method: 'GET',
		},
	};
}