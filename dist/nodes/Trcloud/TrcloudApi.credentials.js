"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrcloudApi = void 0;
class TrcloudApi {
    constructor() {
        this.name = 'trcloudApi';
        this.displayName = 'TRCLOUD API';
        this.icon = {
            light: 'file:../../icons/trcloud.svg',
            dark: 'file:../../icons/trcloud.dark.svg',
        };
        this.documentationUrl = 'https://github.com/thanakorninbox-dev/trcloud-n8n-node';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'encrypt-head': '={{$credentials.encrypt_head}}',
                },
            },
        };
    }
}
exports.TrcloudApi = TrcloudApi;
//# sourceMappingURL=TrcloudApi.credentials.js.map