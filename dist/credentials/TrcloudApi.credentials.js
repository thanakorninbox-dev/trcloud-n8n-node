"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrcloudApi = void 0;
class TrcloudApi {
    constructor() {
        this.name = 'trcloudApi';
        this.displayName = 'Trcloud API';
        this.documentationUrl = 'https://trcloud.co';
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