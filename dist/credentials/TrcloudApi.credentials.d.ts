import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class TrcloudApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    testedBy: string[];
    test: {
        request: {
            baseURL: string;
            url: string;
        };
    };
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
