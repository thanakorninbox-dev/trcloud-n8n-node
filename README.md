# n8n-nodes-trcloud

This community node provides a lightweight **Trcloud** HTTP Request action. It wraps a generic HTTP client so you can call any Trcloud REST endpoint from your n8n workflows.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

### Install via n8n UI

1. Open n8n
2. Go to **Settings → Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-trcloud`
5. Restart n8n

## What it does

- Call HTTP methods such as GET and POST
- Add query parameters and custom headers
- Send JSON, form-urlencoded, or raw bodies
- Choose how the response is returned (JSON or text)

## Authentication

This node does not manage n8n credentials.

TRCLOUD authentication parameters (such as `company_id`, `passkey`, `securekey`, and `timestamp`) must be provided in the request body or headers, depending on your endpoint.

All fields support n8n expressions.

## Usage

1. Add the **Trcloud** node to your workflow.
2. Set the method and full URL for the endpoint you want to call.
3. (Optional) Add query parameters, headers, and a request body.
4. Choose the response format (JSON or text).
5. Execute the workflow to see the response payload.

## Compatibility

Compatible with n8n v1.60.0 or later.

## Example

The following example shows authentication parameters passed in the JSON request body:

- Method: `POST`
- Base URL: `https://demo.trcloud.co`
- Middle Path: `/application/api-connector2/end-point/`
- Endpoint Path: `so/read.php`
- Send Header: Name: `Origin`, Value: `http://localhost`
- Send Body: Name: `json`, Value:
    ```json
    {
    "company_id": "x",
    "passkey": "xxxxx",
    "securekey": "{{ ('xxxxx' + 't' + Math.floor(new Date().getTime() / 1000)).hash('md5') }}",
    "timestamp": "{{ Math.floor(new Date().getTime() / 1000) }}",
    "id": xxx
    }
- Response format: `JSON`

This returns the raw API response so you can chain it to other n8n nodes.

## License

MIT

## Troubleshooting

- **401 Unauthorized**  
  Check that your authentication parameters in the request body (such as `company_id`, `passkey`, and `securekey`) are valid.

- **Invalid JSON response**  
  Make sure the response format matches the API output.

## Resources

- [Trcloud](https://trcloud.co)
- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)
