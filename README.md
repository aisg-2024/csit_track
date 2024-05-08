# LLM Phishing Email Checker Extension
The LLM Phishing Email Checker Extension is a Google Chrome extension which side-panel interface serves as the frontend of our LLM-powered phishing email checker application. 
This extension fetches Gmail messages from a specified Google account using the Gmail API and delivers them to our GPT-3.5-turbo backend server for analysis.
Once a potential fraud is detected by the backend, the warning is sent back to the extension frontend to be delivered on the interface.
Users may then exercise caution when reading these emails in their inbox as well as learn of phishing email characteristics.

## Features
- Intuitive and simple user interface for displaying detected frauds
- Batch email posting to LLM backend for efficient http requests
- Customisable number of emails to be checked by LLM
- LLM analysis displayed to help users understand what entails phishing emails
- Triggered with a simple click of a button

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

1) Unpack and install the extension again to reload it
2) Pin the extension under the accessible extension bar
3) Open **a new webpage** and **visit a site with a valid link**
- The extension interface <ins>**will not load**</ins> if the webpage is the default chrome homepage or any chrome extension/store page
5) Click on the extension to display the user interface
6) Enter the number of latest unread emails to check through and click **LLM Check**
-  If 20 was entered in the input area, the LLm will look for phishing emails in the latest 20 unread emails of user's inbox
6) Wait for the status bar to display **Analysis Complete** and look out for the LLM reply
- Any red message indicates a fraud is detected and the email details along with the LLM's reasoning are shown
- A single green message indicates that among all the fetched emails no potential frauds have been detected
7) If an error message shows, it could indicate a possible API or server problem. Wait for some time before retrying or reach out to us.

## Under the Hood

The extension is powered by a content JS script which is responsible for fetching the latest unread gmails from the user's Google account, extracting the necessary information from them, parsing them into a suitable format, and posting them to the LLM backend through batch requests. The response from the LLM backend is then received and processed by this script. A background worker JS script monitors for user interactions with the extension, and opens the side-panel as an iframe serving a HTML page when user click is detected. The HTML page runs the content JS script to 
dynamically change its contents as the LLM check progresses.

## Acknowledgements
- Google for providing the Gmail API and Oauth Client
- Functions adapted from various sources acknowledged under code comments

## Contact
Should you have any questions, feedback, or require support, please don't hesitate to reach out to the repository maintainers or submit an issue in the GitHub repository.
