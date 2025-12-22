"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trcloud = void 0;
class Trcloud {
    constructor() {
        this.description = {
            displayName: 'TRCLOUD',
            name: 'trcloud',
            icon: 'file:trcloud.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["method"] + " " + $parameter["baseUrl"] + $parameter["midPath"] + $parameter["endpointPath"]}}',
            description: 'Make an HTTP request to any Trcloud endpoint',
            defaults: {
                name: 'Trcloud',
            },
            inputs: ['main'],
            outputs: ['main'],
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
                    displayName: 'Import from cURL',
                    name: 'useCurl',
                    type: 'boolean',
                    default: false,
                    description: 'Toggle to import request details from a cURL command',
                },
                {
                    displayName: 'cURL Command',
                    name: 'curlCommand',
                    type: 'string',
                    typeOptions: {
                        rows: 3,
                    },
                    default: '',
                    description: 'Optional cURL command to import (method, URL, headers, and body will be parsed)',
                    displayOptions: {
                        show: {
                            useCurl: [true],
                        },
                    },
                },
                {
                    displayName: 'Apply cURL',
                    name: 'applyCurl',
                    type: 'boolean',
                    default: false,
                    description: 'Enable to apply the cURL command to this request (method, URL, headers, body)',
                    displayOptions: {
                        show: {
                            useCurl: [true],
                        },
                    },
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
                    default: 'so/read.php',
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
                    displayName: 'Send Body',
                    name: 'sendBody',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            method: ['POST'],
                        },
                    },
                    description: 'Enable to include a request body (or import from cURL)',
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
                            method: ['POST', 'PUT', 'PATCH', 'DELETE'],
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
        var _a, _b, _c, _d, _e;
        var _f, _g;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const methodParam = this.getNodeParameter('method', i);
            const baseUrl = this.getNodeParameter('baseUrl', i);
            const midPath = this.getNodeParameter('midPath', i);
            const endpointPath = this.getNodeParameter('endpointPath', i);
            const urlParam = buildTrcloudUrl(baseUrl, midPath, endpointPath);
            const useCurl = this.getNodeParameter('useCurl', i, false);
            const applyCurl = this.getNodeParameter('applyCurl', i, false);
            const curlCommand = useCurl
                ? (this.getNodeParameter('curlCommand', i, '') || '').trim()
                : '';
            const sendHeaders = this.getNodeParameter('sendHeaders', i, false);
            const headers = this.getNodeParameter('headers', i, {});
            let method = methodParam;
            let url = urlParam;
            let parsedHeaders = {};
            let parsedBody;
            if (applyCurl && curlCommand) {
                const parsed = parseCurl(curlCommand);
                method = (_a = parsed.method) !== null && _a !== void 0 ? _a : methodParam;
                url = (_b = parsed.url) !== null && _b !== void 0 ? _b : urlParam;
                parsedHeaders = (_c = parsed.headers) !== null && _c !== void 0 ? _c : {};
                parsedBody = parsed.body;
            }
            const options = {
                method: method,
                url,
                headers: {},
                json: true,
            };
            if (sendHeaders && headers.parameters) {
                for (const header of headers.parameters) {
                    options.headers[header.name] = header.value;
                }
            }
            for (const [key, value] of Object.entries(parsedHeaders)) {
                if (!options.headers[key]) {
                    options.headers[key] = value;
                }
            }
            if (method === 'POST') {
                const sendBody = this.getNodeParameter('sendBody', i, false) || !!parsedBody;
                if (sendBody) {
                    const bodyMode = this.getNodeParameter('bodyMode', i, 'json');
                    if (bodyMode === 'json' || bodyMode === 'form-urlencoded') {
                        const bodyParameters = this.getNodeParameter('bodyParameters', i, {});
                        const body = parsedBody
                            ? JSON.parse(parsedBody)
                            : {};
                        if (bodyParameters.parameters) {
                            for (const parameter of bodyParameters.parameters) {
                                body[parameter.name] = parameter.value;
                            }
                        }
                        if (bodyMode === 'json') {
                            options.body = body;
                            options.json = true;
                            (_d = (_f = options.headers)['Content-Type']) !== null && _d !== void 0 ? _d : (_f['Content-Type'] = 'application/json');
                        }
                        else {
                            options.form = body;
                            options.json = true;
                            (_e = (_g = options.headers)['Content-Type']) !== null && _e !== void 0 ? _e : (_g['Content-Type'] = 'application/x-www-form-urlencoded');
                        }
                    }
                    else if (bodyMode === 'raw') {
                        const rawBody = parsedBody !== null && parsedBody !== void 0 ? parsedBody : this.getNodeParameter('rawBody', i);
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
                let parsedResponse = response;
                if (typeof response === 'string') {
                    parsedResponse = JSON.parse(response);
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
function parseCurl(command) {
    var _a, _b, _c;
    const headers = {};
    let body;
    let url;
    let method;
    const methodMatch = command.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) {
        method = methodMatch[1].toUpperCase();
    }
    const urlMatch = (_a = command.match(/curl\s+['"]?(https?:\/\/[^\s'"]+)/i)) !== null && _a !== void 0 ? _a : command.match(/(https?:\/\/[^\s'"]+)/i);
    if (urlMatch) {
        url = urlMatch[1];
    }
    const headerRegex = /-H\s+['"]?([^:'"]+):\s*([^'"]+)['"]?/gi;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(command)) !== null) {
        headers[headerMatch[1]] = headerMatch[2];
    }
    const bodyMatch = (_c = (_b = command.match(/--data-raw\s+(['"])([\s\S]*?)\1/i)) !== null && _b !== void 0 ? _b : command.match(/--data\b\s+(['"])([\s\S]*?)\1/i)) !== null && _c !== void 0 ? _c : command.match(/-d\s+(['"])([\s\S]*?)\1/i);
    if (bodyMatch) {
        body = bodyMatch[2];
    }
    return { method, url, headers, body };
}
//# sourceMappingURL=Trcloud.node.js.map