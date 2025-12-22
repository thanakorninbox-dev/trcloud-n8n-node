import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class TrcloudApi implements ICredentialType {
    name = 'trcloudApi';
    displayName = 'Trcloud API';
    documentationUrl = 'https://trcloud.co';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{$credentials.apiKey}}',
            },
        },
    };
}
