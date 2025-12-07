import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CopyseekerApi implements ICredentialType {
	name = 'copyseekerApi';
	displayName = 'Copyseeker API';
	documentationUrl = 'https://copyseeker.net';
	properties: INodeProperties[] = [
		{
			displayName: 'RapidAPI Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your RapidAPI key for Copyseeker',
		},
	];
}
