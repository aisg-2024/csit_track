# LLM Fraud Checker Extension
The LLM Fraud Checker Extension is a Google Chrome extension which popup page serves as the frontend of our LLM-powered fraud email checker application. 
Upon installing the extension on Chrome, the extension requests read and write access to the gmail 
A background Javascript script runs each time the extension is used to fetch the first 50 unread emails from the
The popup page is served as a HTML page which dynamic content is managed by a separate popup JS script.


OpenAI Model utilised: gpt-3.5-turbo (best performance-price ratio)

## Features
- OAuth2 authentication to ensure user data security.
- Intuitive and simple user interface for displaying detected frauds.
- Batch email posting to LLM backend for efficient http requests.
- Triggered with a simple click of the extension.

## Prerequisites
Before you begin, ensure you have met the following requirements:

Gmail API service running on Google Cloud Console.


## Installation
Clone the repository to your local machine:

git clone https://github.com/aisg-2024/langchain_backend.git
cd langchain_backend
Install the dependencies:

yarn install
Create an .env file in the root directory and add your OpenAI API key:

OPENAI_API_KEY=your_openai_api_key_here
Usage
To run the server, execute the following command:

node app.js
API Endpoints
POST /detect-fraud
Accepts JSON content with an emailContent field and returns an analysis with potential fraud detection.

Request Example

{
  "emailContent": "Subject: Urgent Action Required - Your Account is Compromised\n\nDear valued customer,\n\nWe regret to inform you that we have detected suspicious activity on your account. It appears that your account is being compromised by unauthorized access.\n\nTo prevent any further unauthorized access and secure your account, we urgently require you to verify your identity by providing your account credentials. Please click on the following link to update your account details immediately: [maliciouslink.com]\n\nFailure to take immediate action may result in permanent account closure or financial loss. Your prompt attention to this matter is highly appreciated.\n\nThank you for your cooperation.\n\nSincerely,\nCustomer Support Team"
}
Response Example

{
  "response": "Detailed response from OpenAI model...",
  "fraudDetected": 1
}
Running on Render
The application is configured to be easily deployed on Render with the following setup commands:

render doc render express doc

Runtime: Node Build Command: yarn Start Command: node app.js

Testing
A simple endpoint to ensure the server is running can be accessed via:

GET /
Which will return a 'Hello, World!' message.


Fraud Detection Prompt Explanation
This section explains the criteria and methodology used to detect and flag potential fraud elements within emails. Our system scans emails for specific fraud indicators, listed in an ordered manner below. If an email does not contain any of these fraud elements, our response will be "this email is clean."


License
This project is open-sourced under the MIT license. See the LICENSE file for more information.

Acknowledgements
Google for providing the Gmail API.

Contact
Should you have any questions, feedback, or require support, please don't hesitate to reach out to the repository maintainers or submit an issue in the GitHub repository.
