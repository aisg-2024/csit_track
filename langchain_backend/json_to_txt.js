const emailData = {
  "id": "18dd84df4be36bdd",
  "threadId": "18dd84df4be36bdd",
  "labelIds": [
    "UNREAD",
    "CATEGORY_PERSONAL",
    "INBOX"
  ],
  "snippet": "Spino Man Stories for Spino Man @spinoman_79938·Become a member Medium daily digest Today&#39;s highlights Shirsh Shukla Shirsh Shukla· 7 min read What&#39;s new in Flutter 3.19, let&#39;s discuss the",
  "payload": {
    "partId": "",
    "mimeType": "multipart/alternative",
    "filename": "",
    "headers": [
      {
        "name": "Delivered-To",
        "value": "manjc330@gmail.com"
      },
      {
        "name": "Received",
        "value": "by 2002:a05:6504:304f:b0:258:3f54:2804 with SMTP id f15csp166409lth;        Fri, 23 Feb 2024 15:30:04 -0800 (PST)"
      },
      {
        "name": "X-Google-Smtp-Source",
        "value": "AGHT+IFQD5nUssJKo2jGdyd7DJ0KiQRHY0M1J9ZNYqY2cnrF01gUcnVMSoIfWLBcTU2jQA2J3qF4"
      },
      {
        "name": "X-Received",
        "value": "by 2002:a05:6358:e4a3:b0:178:f482:6e59 with SMTP id by35-20020a056358e4a300b00178f4826e59mr1513279rwb.3.1708731004031;        Fri, 23 Feb 2024 15:30:04 -0800 (PST)"
      },
      {
        "name": "ARC-Seal",
        "value": "i=1; a=rsa-sha256; t=1708731004; cv=none;        d=google.com; s=arc-20160816;        b=hQsrumuj5ooW9vgT6zGWnF8INvAmsEBL8MIMmfScd+48GEETLWyPm/RWALlf7Sein4         FXl+Z0olV2cowuaTYD6sM/aWMAiDLWqgL19PMxvQPJ2yi2O9fuquadhfPb5MzTu0NAKV         wODXVSqM66gV1yth7ZrEPN9swcuo68Jew1/ohXBO46EGP2KC2873oiYIau12mpQtMpZo         zfjyHI5D8A0Lj/dhYeGI6U985eyvOptAfY2AJybLq+x9gvbdA0QrBYoebhO+nzf6wt18         jt5KJE192D+rleSMBWIHP4vXvmBpntZ1gi1swxo+3gayxor4dhNMA1TcnM81T/oc14Y7         mUKw=="
      },
      {
        "name": "ARC-Message-Signature",
        "value": "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;        h=to:list-unsubscribe:reply-to:subject:message-id:mime-version:from         :date:dkim-signature:dkim-signature;        bh=75Cw1L+BbKESNzMjbYXN00OSX/I9QSKLejRtMzu5LtQ=;        fh=mnIhqg0vRyg88mD6Z0WJkTQYEDLS/7j0GokWd3Ldexo=;        b=CrklkoYuIGrHfSLkRxNW2jUMs5yUJUALKcQhk2EFa3E/HdIBfLN0FUjqk6NdhyahZr         BKrEBcSCBlJW87biMUOU//kZwZ71qgLwbFVP4mD3MMVQE08wLYCxXPgxVYtTgDvQZ2Js         haOJo5FF8JB5B+IkpKwc+16nzQQcRJ0cLA5OmdUmftkb8icveVWoMc5AmzLQLvccmlSA         pxOIz6dSHYNr1J6nDkffnx0MGaDxK1cnNBWQVuvphkUQIrumHWjdVvLvcM19iEijwcp9         i8bstcidadED+yz/soGe28gGwZ8+0QfT8Ysc54z+ZBw+nRem6VNFDptcd+pMv+OYA4vX         AWhA==;        dara=google.com"
      },
      {
        "name": "ARC-Authentication-Results",
        "value": "i=1; mx.google.com;       dkim=pass header.i=@medium.com header.s=m1 header.b=dURGnjHM;       dkim=pass header.i=@sendgrid.info header.s=smtpapi header.b=Aaz6JrXU;       spf=pass (google.com: domain of bounces+1823144-b2f7-manjc330=gmail.com@email.medium.com designates 149.72.133.6 as permitted sender) smtp.mailfrom=\"bounces+1823144-b2f7-manjc330=gmail.com@email.medium.com\";       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=medium.com"
      },
      {
        "name": "Return-Path",
        "value": "<bounces+1823144-b2f7-manjc330=gmail.com@email.medium.com>"
      },
      {
        "name": "Received",
        "value": "from o11.email.medium.com (o11.email.medium.com. [149.72.133.6])        by mx.google.com with ESMTPS id t4-20020ac85304000000b0042c0fb47a11si3031qtn.281.2024.02.23.15.30.02        for <manjc330@gmail.com>        (version=TLS1_3 cipher=TLS_AES_128_GCM_SHA256 bits=128/128);        Fri, 23 Feb 2024 15:30:04 -0800 (PST)"
      },
      {
        "name": "Received-SPF",
        "value": "pass (google.com: domain of bounces+1823144-b2f7-manjc330=gmail.com@email.medium.com designates 149.72.133.6 as permitted sender) client-ip=149.72.133.6;"
      },
      {
        "name": "Authentication-Results",
        "value": "mx.google.com;       dkim=pass header.i=@medium.com header.s=m1 header.b=dURGnjHM;       dkim=pass header.i=@sendgrid.info header.s=smtpapi header.b=Aaz6JrXU;       spf=pass (google"
      }
    ]
  }
};

// Function to extract email content
function extractEmailContent(data) {
  let content = "";
  if (data.payload && data.payload.parts) {
    data.payload.parts.forEach(part => {
      if (part.mimeType === "text/plain") {
        content = part.body.data;
      }
    });
  }
  return content;
}

// Extract email content
const emailContent = extractEmailContent(emailData);
console.log(emailContent);
