# LLM Fraud Checker Extension
The LLM Fraud Checker Extension is a Google Chrome extension which popup page serves as the frontend of our LLM-powered fraud email checker application. 
This extension fetches Gmail messages from a specified Google account using the Gmail API and delivers them to our GPT-3.5-turbo backend server for analysis.
Once a potential fraud is detected by the backend, the warning is sent back to the extension frontend to be delivered on the popup page.
Users may then exercise caution when reading these emails in their inbox.

## Features
- Intuitive and simple user interface for displaying detected frauds
- Batch email posting to LLM backend for efficient http requests
- LLM analysis displayed to help users understand what entails fraud
- Triggered with a simple click of the extension

## Prerequisites
Before you begin, ensure you have met the following requirements:

- npm and Node.JS installed on local machine
- Gmail API Service enabled on Google Cloud Console


## Installation
Clone the repository to your local machine:

```
git clone https://github.com/aisg-2024/csit_track.git
cd csit_track
```

Install the dependencies:

```
npm install
```

Unpack and install the extension to chrome:
- Go to Chrome Extension bar and click **Manage Extensions**
- Click on **Load Unpacked** and choose to unpack the entire "csit_track" project folder
- Take note of the **Extension ID** generated for the LLM Fraud Checker Extension

  In this example, the ID is **pkjpimjdoggfaeeiccemillhpijjpggo**

![image](https://github.com/aisg-2024/csit_track/assets/111041948/1a227ab2-99f3-4227-ae45-9678c747b8ec)

Add credentials to Gmail API Service:
- Open up Google Cloud Console
- Navigate to **Menu menu > APIs & Services > Credentials**
- Click on **+ Create Credentials**
- Choose **Oauth Client ID** as credential type
- Under application type, choose **Chrome Extension**
- Give the Oauth Client an appropriate name, such as **CSIT LLM Fraud Checker**
- Under **Item ID**, use the Extension ID obtained from extension bar
- Skip the optional **Verify app ownership**
- Click **Create** and wait for successful creation
- Take note of the **Client ID** generated for the credential, it should be in the format **"(...).apps.googleusercontent.com"**

Configure OAuth consent:
- Navigate to **Menu menu > APIs & Services > OAuth consent screen**.
- Select **External** user type, then click **Create**
- Under **Oauth Consent Screen**, give the consent app an appropriate name and enter a valid **User support email** and **Developer contact email**
- Under **Scopes**, click **Add or Remove Scopes**, search for and add the scopes **"https://mail.google.com/"** and **".../auth/gmail.modify"**
- Under **Test users**, click **Add users** and enter the **email address(es)** of test users whose gmail accounts the extension can have access to 
- Click **Back to Dashboard**

Update Oauth2 client ID in codebase:
- Navigate to the "csit_track" project folder
- Go to **manifest.json** in the codebase
- Locate **oauth2 > client_id** and replace with the **Client ID** generated under Credentials

## Usage
To use the extension, follow the following steps:

1) Pin the extension under the accessible extension bar
2) Click on the extension
3) Wait for the badge on the extension to change colour from grey to either red or green
- A red badge indicates that potential frauds have been detected and the number of potential frauds is displayed on the badge
- A green badge indicates that among all the fetched emails no potential frauds have been detected
4) If the badge changes to red, close and reopen the extension popup to show the flagged emails accompanied by LLM analysis

## Under the Hood

The extension is powered by a background worker JS script which is responsible for fetching the first 50 unread gmails from the linked Google account, extracting the necessary information from them, parsing them into a suitable format, and posting them to the LLM backend through batch requests. The response from the LLM backend is then received and processed by this script.

The popup page is served as a HTML page running a separate popup JS script for managing dynamic content. Responses from the LLM backend are sent from the background worker script to this popup script through runtime messages and displayed dynamically on the popup page.

## Acknowledgements
- Google for providing the Gmail API
- Functions adapted from various sources acknowledged under code comments

## Contact
Should you have any questions, feedback, or require support, please don't hesitate to reach out to the repository maintainers or submit an issue in the GitHub repository.
