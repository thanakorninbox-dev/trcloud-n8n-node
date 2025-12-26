import type {
	IAuthenticateGeneric,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

// eslint-disable-next-line @n8n/community-nodes/credential-test-required
export class TrcloudApi implements ICredentialType {
	name = 'trcloudApi';

	displayName = 'TRCLOUD API';

	icon: Icon = {
		light: 'file:../../icons/trcloud.svg',
		dark: 'file:../../icons/trcloud.dark.svg',
	};

	documentationUrl = 'https://github.com/thanakorninbox-dev/trcloud-n8n-node';

	properties: INodeProperties[] = [
		{
			displayName: 'Company ID',
			name: 'company_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Your TRCLOUD company ID',
		},
		{
			displayName: 'Passkey',
			name: 'passkey',
			type: 'string',
			required: true,
			default: '',
			description: 'Your TRCLOUD passkey',
		},
		{
			displayName: 'Encrypt Head',
			name: 'encrypt_head',
			type: 'string',
			required: true,
			default: '',
			description: 'Your TRCLOUD encryption header value (used to compute securekey)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'encrypt-head': '={{$credentials.encrypt_head}}',
			},
		},
	};
}

