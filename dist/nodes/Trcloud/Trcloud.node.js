"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trcloud = void 0;
const crypto_1 = require("crypto");
class Trcloud {
    constructor() {
        this.description = {
            displayName: 'TRCLOUD',
            name: 'trcloud',
            icon: 'file:trcloud.svg',
            group: ['transform'],
            version: 1,
            usableAsTool: true,
            subtitle: 'HTTP Request',
            description: 'Make an HTTP request to any Trcloud endpoint',
            defaults: {
                name: 'Trcloud',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'trcloudApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Method',
                    name: 'method',
                    type: 'options',
                    options: [
                        { name: 'POST', value: 'POST' },
                        { name: 'GET', value: 'GET' },
                    ],
                    default: 'POST',
                },
                {
                    displayName: 'Base URL',
                    name: 'baseUrl',
                    type: 'string',
                    default: '',
                    placeholder: 'https://demo.trcloud.co/',
                    required: true,
                    description: 'Base URL with protocol for your TRCLOUD instance',
                },
                {
                    displayName: 'Middle Path',
                    name: 'midPath',
                    type: 'string',
                    default: '/application/api-connector2/end-point/',
                    required: true,
                    description: 'Defaults to /application/api-connector2/end-point/; change only if needed',
                },
                {
                    displayName: 'Endpoint Path',
                    name: 'endpointPath',
                    type: 'string',
                    default: '',
                    placeholder: 'so/read.php',
                    required: true,
                    description: 'Document/action path, e.g. so/read.php',
                },
                {
                    displayName: 'Send Headers',
                    name: 'sendHeaders',
                    type: 'boolean',
                    default: false,
                },
                {
                    displayName: 'Headers',
                    name: 'headers',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Header',
                    default: {},
                    displayOptions: {
                        show: {
                            sendHeaders: [true],
                        },
                    },
                    options: [
                        {
                            name: 'parameters',
                            displayName: 'Header',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: 'Origin',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'http://localhost',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Send Body',
                    name: 'sendBody',
                    type: 'boolean',
                    default: true,
                    displayOptions: {
                        show: {
                            method: ['POST'],
                        },
                    },
                    description: 'Whether to include a request body',
                },
                {
                    displayName: 'Body Mode',
                    name: 'bodyMode',
                    type: 'options',
                    default: 'json',
                    displayOptions: {
                        show: {
                            sendBody: [true],
                            method: ['POST'],
                        },
                    },
                    options: [
                        { name: 'JSON', value: 'json' },
                        { name: 'Form-Urlencoded', value: 'form-urlencoded' },
                        { name: 'Raw', value: 'raw' },
                        { name: 'None', value: 'none' },
                    ],
                },
                {
                    displayName: 'Body Parameters',
                    name: 'bodyParameters',
                    type: 'fixedCollection',
                    displayOptions: {
                        show: {
                            sendBody: [true],
                            bodyMode: ['json', 'form-urlencoded'],
                            method: ['POST'],
                        },
                    },
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: 'Add Parameter',
                    default: {},
                    options: [
                        {
                            name: 'parameters',
                            displayName: 'Parameter',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Raw Body',
                    name: 'rawBody',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    displayOptions: {
                        show: {
                            sendBody: [true],
                            bodyMode: ['raw'],
                            method: ['POST'],
                        },
                    },
                    default: '',
                    description: 'Raw body to send as-is',
                },
                {
                    displayName: 'Raw Content Type',
                    name: 'rawContentType',
                    type: 'string',
                    displayOptions: {
                        show: {
                            sendBody: [true],
                            bodyMode: ['raw'],
                            method: ['POST'],
                        },
                    },
                    default: 'text/plain',
                    description: 'Content-Type header to use with raw body',
                },
            ],
        };
    }
    async execute() {
        var _a, _b;
        var _c, _d;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const credentials = await this.getCredentials('trcloudApi');
            const companyId = credentials.company_id;
            const passkey = credentials.passkey;
            const encryptHead = credentials.encrypt_head;
            const timestamp = Math.floor(new Date().getTime() / 1000);
            const securekey = (0, crypto_1.createHash)('md5')
                .update(encryptHead + 't' + timestamp)
                .digest('hex');
            const methodParam = this.getNodeParameter('method', i);
            const baseUrl = this.getNodeParameter('baseUrl', i);
            const midPath = this.getNodeParameter('midPath', i);
            const endpointPath = this.getNodeParameter('endpointPath', i);
            const url = buildTrcloudUrl(baseUrl, midPath, endpointPath);
            const sendHeaders = this.getNodeParameter('sendHeaders', i, false);
            const headers = this.getNodeParameter('headers', i, {});
            const options = {
                method: methodParam,
                url,
                headers: {
                    'encrypt-head': encryptHead,
                },
                json: true,
            };
            if (sendHeaders && headers.parameters) {
                for (const header of headers.parameters) {
                    options.headers[header.name] = header.value;
                }
            }
            if (methodParam === 'POST') {
                const sendBody = this.getNodeParameter('sendBody', i, false);
                if (sendBody) {
                    const bodyMode = this.getNodeParameter('bodyMode', i, 'json');
                    if (bodyMode === 'json' || bodyMode === 'form-urlencoded') {
                        const bodyParameters = this.getNodeParameter('bodyParameters', i, {});
                        const jsonBody = {
                            company_id: companyId,
                            passkey: passkey,
                            securekey: securekey,
                            timestamp: timestamp,
                        };
                        if (bodyParameters.parameters) {
                            for (const parameter of bodyParameters.parameters) {
                                let value = parameter.value;
                                if (typeof value === 'string' && value.trim().startsWith('{')) {
                                    try {
                                        value = JSON.parse(value);
                                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                            Object.assign(jsonBody, value);
                                            continue;
                                        }
                                    }
                                    catch {
                                    }
                                }
                                if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
                                    const numValue = Number(value);
                                    if (!isNaN(numValue)) {
                                        value = numValue;
                                    }
                                }
                                if (typeof value === 'string') {
                                    const lowerValue = value.toLowerCase().trim();
                                    if (lowerValue === 'true')
                                        value = true;
                                    if (lowerValue === 'false')
                                        value = false;
                                }
                                jsonBody[parameter.name] = value;
                            }
                        }
                        const body = {
                            json: JSON.stringify(jsonBody),
                        };
                        if (bodyMode === 'json') {
                            options.body = body;
                            options.json = true;
                            (_a = (_c = options.headers)['Content-Type']) !== null && _a !== void 0 ? _a : (_c['Content-Type'] = 'application/json');
                        }
                        else {
                            options.form = body;
                            options.json = true;
                            (_b = (_d = options.headers)['Content-Type']) !== null && _b !== void 0 ? _b : (_d['Content-Type'] = 'application/x-www-form-urlencoded');
                        }
                    }
                    else if (bodyMode === 'raw') {
                        const rawBody = this.getNodeParameter('rawBody', i);
                        const rawContentType = this.getNodeParameter('rawContentType', i);
                        options.body = rawBody;
                        options.json = false;
                        if (rawContentType) {
                            options.headers['Content-Type'] = rawContentType;
                        }
                    }
                }
            }
            try {
                const response = await this.helpers.httpRequest.call(this, options);
                let parsedResponse;
                if (typeof response === 'string') {
                    try {
                        parsedResponse = JSON.parse(response);
                    }
                    catch {
                        parsedResponse = { raw: response };
                    }
                }
                else {
                    parsedResponse = response;
                }
                returnData.push({ json: parsedResponse });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Trcloud = Trcloud;
function buildTrcloudUrl(baseUrl, midPath, endpointPath) {
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    const normalizedMid = `/${midPath.replace(/^\/+|\/+$/g, '')}/`;
    const normalizedEndpoint = endpointPath.replace(/^\/+/, '');
    return `${normalizedBase}${normalizedMid}${normalizedEndpoint}`;
}
//# sourceMappingURL=Trcloud.node.js.map