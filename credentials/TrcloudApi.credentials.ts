import type {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
    Icon,
} from 'n8n-workflow';

export class TrcloudApi implements ICredentialType {
    name = 'trcloudApi';
    displayName = 'Trcloud API';
    documentationUrl = 'https://trcloud.co';
    icon: Icon = {
        light: 'file:../icons/trcloud.svg',
        dark: 'file:../icons/trcloud.dark.svg',
    };
    testedBy = ['trcloud'];
    test = {
        request: {
            baseURL: 'https://demo.trcloud.co',
            url: '/',
        },
    };
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
