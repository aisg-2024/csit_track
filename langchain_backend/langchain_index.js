const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const fs = require("fs");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const fraudDetectionPrompt = `
  prompt: Detect and flag any potential fraud elements within the given email.

  fraud_elements:
  - Unrealistic Demands/Threats:
    - Phrases:
      - "Your [...] account is being compromised, need credentials to restore account"
      - "Delivery not successful, need payment to fix the issue"
      - "[...] processing paused, need payment/bank account to proceed"
      - "Family/friend needs financial help"
    - Phrasing Instilling Urgency:
      - "please handle this as soon as possible"
      - "it's urgent"
      - "click here to update your account details."
      - "urgent action required"
      - "account closed"
      - "send these details within 24 hours"
      - "you have been a victim of crime, click here immediately"
      - "Get started now"
      - Phrases containing 'now', 'immediate', and exclamation marks
  - Poor Spelling and Writing:
    - Examples:
      - "Youre"
      - "Please fill this form..."
      - "...account locked!!"
    - Grammatical, punctuation, and spelling mistakes
    - Imaginary words and phrases
  - Inconsistent or Faulty URLs:
    - Hyperlink addresses don’t match the embedded link
    - Buttons with hyperlinks leading to suspicious websites
  - Asking for Confidential Information:
    - Asking for [...] account details
    - Asking for bank account details
  - Vague Salutations:
    - Generic or no greetings
    - Examples:
      - "Dear valued member"
      - "Dear account holder"
      - "Dear customer"
      - "Dear member"
  - Generic or Improper Company Domains:
    - Using non-existent domains
    - Using generic domains
    - Using domains with characters and numbers appended
  - Inconsistent Sender Details and Email Header:
    - Sender name doesn't correlate with the sign-off name
    - Sender's IP address doesn't match the email service
    - "From" field does not match the "Return-Path" field
  - Incorrect Company Information:
    - Company details do not match real details
    - Sender email address does not correspond with the company details
    - Example:
      - British company not using a British address and phone number
      - Company motto/mission/values are incorrect
      - Company details are gibberish
  - Offering Unrealistic Rewards:
    - Wording that promises incredible monetary rewards
    - Example:
      - "Your reward is waiting"
  - Suspicious Attachments:
    - Attachments leading to malicious websites
    - Attachment files of high-risk types likely to contain malware (e.g., .scr, .exe, .zip)
  - Whole Email is Just a Hyperlink Leading to Malicious Website
  `;

async function main() {
  const chatModel = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
  });

  const emailInput = fs.readFileSync("fraud.txt", "utf8").trim();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a world class technical documentation writer." + fraudDetectionPrompt],
    ["user", emailInput],
  ]);

  const outputParser = new StringOutputParser();

  const llmChain = prompt.pipe(chatModel).pipe(outputParser);

  try {
    const response = await llmChain.invoke();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

main();
