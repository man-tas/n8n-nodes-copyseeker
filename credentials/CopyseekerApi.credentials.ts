import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CopyseekerApi implements ICredentialType {
	name = 'copyseekerApi';
	displayName = 'Copyseeker API';
	documentationUrl = 'https://copyseeker.net';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your RapidAPI key for Copyseeker',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-RapidAPI-Key': '={{$credentials.apiKey}}',
				'X-RapidAPI-Host': 'reverse-image-search-by-copyseeker.p.rapidapi.com',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://reverse-image-search-by-copyseeker.p.rapidapi.com',
			url: '/',
			method: 'GET',
			qs: {
				imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
			},
		},
	};
}
