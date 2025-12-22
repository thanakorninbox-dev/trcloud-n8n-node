import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Trcloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TRCLOUD',
		name: 'trcloud',
		icon: 'file:trcloud.svg',
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["method"] + " " + $parameter["baseUrl"] + $parameter["midPath"] + $parameter["endpointPath"]}}',
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
				description:
					'Optional cURL command to import (method, URL, headers, and body will be parsed)',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const methodParam = this.getNodeParameter('method', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;
			const midPath = this.getNodeParameter('midPath', i) as string;
			const endpointPath = this.getNodeParameter('endpointPath', i) as string;
			const urlParam = buildTrcloudUrl(baseUrl, midPath, endpointPath);
			const useCurl = this.getNodeParameter('useCurl', i, false) as boolean;
			const applyCurl = this.getNodeParameter('applyCurl', i, false) as boolean;
			const curlCommand = useCurl
				? ((this.getNodeParameter('curlCommand', i, '') as string) || '').trim()
				: '';
			const sendHeaders = this.getNodeParameter('sendHeaders', i, false) as boolean;
			const headers = this.getNodeParameter('headers', i, {}) as {
				parameters?: Array<{ name: string; value: string }>;
			};

			let method = methodParam;
			let url = urlParam;
			let parsedHeaders: Record<string, string> = {};
			let parsedBody: string | undefined;

			if (applyCurl && curlCommand) {
				const parsed = parseCurl(curlCommand);
				method = parsed.method ?? methodParam;
				url = parsed.url ?? urlParam;
				parsedHeaders = parsed.headers ?? {};
				parsedBody = parsed.body;
			}

			const options: IHttpRequestOptions = {
				method: method as IHttpRequestMethods,
				url,
				headers: {},
				json: true,
			};

			if (sendHeaders && headers.parameters) {
				for (const header of headers.parameters) {
					(options.headers as Record<string, string>)[header.name] = header.value;
				}
			}

			// Merge any headers imported from cURL (node params take precedence)
			for (const [key, value] of Object.entries(parsedHeaders)) {
				if (!(options.headers as Record<string, string>)[key]) {
					(options.headers as Record<string, string>)[key] = value;
				}
			}

			if (method === 'POST') {
				const sendBody = this.getNodeParameter('sendBody', i, false) as boolean || !!parsedBody;
				if (sendBody) {
					const bodyMode = this.getNodeParameter('bodyMode', i, 'json') as string;

					if (bodyMode === 'json' || bodyMode === 'form-urlencoded') {
						const bodyParameters = this.getNodeParameter('bodyParameters', i, {}) as {
							parameters?: Array<{ name: string; value: string }>;
						};
						const body: Record<string, string> = parsedBody
							? (JSON.parse(parsedBody) as Record<string, string>)
							: {};
						if (bodyParameters.parameters) {
							for (const parameter of bodyParameters.parameters) {
								body[parameter.name] = parameter.value;
							}
						}
						if (bodyMode === 'json') {
							options.body = body;
							options.json = true;
							(options.headers as Record<string, string>)['Content-Type'] ??= 'application/json';
						} else {
							(options as unknown as IDataObject).form = body;
							options.json = true;
							(options.headers as Record<string, string>)['Content-Type'] ??=
								'application/x-www-form-urlencoded';
						}
					} else if (bodyMode === 'raw') {
						const rawBody = parsedBody ?? (this.getNodeParameter('rawBody', i) as string);
						const rawContentType = this.getNodeParameter('rawContentType', i) as string;
						options.body = rawBody;
						options.json = false;
						if (rawContentType) {
							(options.headers as Record<string, string>)['Content-Type'] = rawContentType;
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
				returnData.push({ json: parsedResponse as IDataObject });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
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

function buildTrcloudUrl(baseUrl: string, midPath: string, endpointPath: string): string {
	const normalizedBase = baseUrl.replace(/\/+$/, '');
	const normalizedMid = `/${midPath.replace(/^\/+|\/+$/g, '')}/`;
	const normalizedEndpoint = endpointPath.replace(/^\/+/, '');
	return `${normalizedBase}${normalizedMid}${normalizedEndpoint}`;
}

function parseCurl(command: string): {
	method?: string;
	url?: string;
	headers?: Record<string, string>;
	body?: string;
} {
	const headers: Record<string, string> = {};
	let body: string | undefined;
	let url: string | undefined;
	let method: string | undefined;

	// Method
	const methodMatch = command.match(/-X\s+([A-Z]+)/i);
	if (methodMatch) {
		method = methodMatch[1].toUpperCase();
	}

	// URL (first argument after curl or any https?://)
	const urlMatch = command.match(/curl\s+['"]?(https?:\/\/[^\s'"]+)/i) ?? command.match(/(https?:\/\/[^\s'"]+)/i);
	if (urlMatch) {
		url = urlMatch[1];
	}

	// Headers (-H 'Key: Value')
	const headerRegex = /-H\s+['"]?([^:'"]+):\s*([^'"]+)['"]?/gi;
	let headerMatch;
	while ((headerMatch = headerRegex.exec(command)) !== null) {
		headers[headerMatch[1]] = headerMatch[2];
	}

	// Body (-d/--data etc.)
	const bodyMatch =
		command.match(/--data-raw\s+(['"])([\s\S]*?)\1/i) ??
		command.match(/--data\b\s+(['"])([\s\S]*?)\1/i) ??
		command.match(/-d\s+(['"])([\s\S]*?)\1/i);
	if (bodyMatch) {
		body = bodyMatch[2];
	}

	return { method, url, headers, body };
}

