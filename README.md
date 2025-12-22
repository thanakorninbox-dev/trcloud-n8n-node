# n8n-nodes-trcloud

This community node provides a lightweight **Trcloud** HTTP Request action. It wraps a generic HTTP client with an API key header so you can call any Trcloud REST endpoint from your n8n workflows.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## What it does

- Call any HTTP method: GET, POST, PUT, PATCH, DELETE
- Add query parameters and custom headers
- Send JSON, form-urlencoded, or raw bodies
- Choose how the response is returned (JSON or text)

## Credentials

Add a **Trcloud API** credential with your API key. The node sends it as an `Authorization` header on every request.

## Usage

1. Add the **Trcloud** node to your workflow.
2. Set the method and full URL for the endpoint you want to call.
3. (Optional) Add query parameters, headers, and a request body.
4. Choose the response format (JSON or text).
5. Execute the workflow to see the response payload.

## Compatibility

Compatible with n8n v1.60.0 or later.

## Resources

- [Trcloud](https://trcloud.co)
- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)
