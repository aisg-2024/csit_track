![image](https://github.com/aisg-2024/csit_track/assets/111041948/33a3674a-b8af-43cf-838b-46705ab010a3)# LLM Fraud Checker Extension
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

- Gmail API service running on Google Cloud Console.
- npm and Node.JS installed on local machine.


## Installation
Clone the repository to your local machine:

```git clone https://github.com/aisg-2024/csit_track.git
cd csit_track
```

Install the dependencies:

```npm install```

Unpack and install the extension to chrome:

- Go to Chrome Extension bar and click "Manage Extensions"
![image](https://github.com/aisg-2024/csit_track/assets/111041948/f9f5770d-5895-415c-972d-925163d9e139)
![image](https://github.com/aisg-2024/csit_track/assets/111041948/998ed798-3ac2-40ea-88bd-23089961445a)

- Click on "Load Unpacked" and choose to unpack the entire "csit_track" project folder
![image](https://github.com/aisg-2024/csit_track/assets/111041948/5e9ba3da-617b-4cb4-8d69-593e5ddd944b)

- Take note of the Extension ID generated for the LLM Fraud Checker Extension
![image](https://github.com/aisg-2024/csit_track/assets/111041948/1a227ab2-99f3-4227-ae45-9678c747b8ec)


## Usage
To use the extension, follow the following steps:



License
This project is open-sourced under the MIT license. See the LICENSE file for more information.

Acknowledgements
Google for providing the Gmail API.

Contact
Should you have any questions, feedback, or require support, please don't hesitate to reach out to the repository maintainers or submit an issue in the GitHub repository.
