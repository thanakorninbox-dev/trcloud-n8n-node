"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrcloudApi = void 0;
class TrcloudApi {
    constructor() {
        this.name = 'trcloudApi';
        this.displayName = 'Trcloud API';
        this.documentationUrl = 'https://trcloud.co';
        this.icon = {
            light: 'file:icons/trcloud.svg',
            dark: 'file:icons/trcloud.dark.svg',
        };
        this.testedBy = ['trcloud'];
        this.test = {
            request: {
                baseURL: 'https://demo.trcloud.co',
                url: '/',
            },
        };
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.TrcloudApi = TrcloudApi;
//# sourceMappingURL=TrcloudApi.credentials.js.map