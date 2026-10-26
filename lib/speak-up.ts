// The copy-and-send complaint email offered on /speak-up (and in VICTORIA's
// wind-down follow-up, which carries the same text in mindful-lms
// src/lib/wind-down.ts — keep the two in step).

export const SPEAK_UP_TO = [
  "michele.carter1@dwd.wisconsin.gov",
  "Julie.Cayo@employmilwaukee.org",
  "todd.miller@milwaukee.gov",
  "Russell.StamperII@milwaukee.gov",
];
export const SPEAK_UP_CC = "reginald@mindfulstaff.com";
export const SPEAK_UP_SUBJECT = "Complaint: I chose The Mindful Group for training and could not get enrolled";

export const SPEAK_UP_BODY = `To the Wisconsin Department of Workforce Development, Employ Milwaukee, the Office of Mayor Cavalier Johnson, and Alderman Stamper:

My name is [your full name] and I live in [your ZIP code]. Around [month/year], I chose The Mindful Group for [CNA/CBRF or construction] training. I have not been able to start, and The Mindful Group has now told me it can no longer train because students like me are not being enrolled with them.

Under WIOA, I have the right to choose my training provider from the state's approved list. I am asking you to:
1. Tell me in writing why I could not be enrolled with the provider I chose.
2. Treat this email as a formal complaint and tell me the next steps and deadlines.
3. Allow me to train with the provider I chose.

Phone: [your phone]
Email: [your email]

Sincerely,
[your name]`;

export function speakUpCopyText(): string {
  return `To: ${SPEAK_UP_TO.join("; ")}
CC: ${SPEAK_UP_CC}
Subject: ${SPEAK_UP_SUBJECT}

${SPEAK_UP_BODY}`;
}

export function speakUpMailto(): string {
  const q = `cc=${encodeURIComponent(SPEAK_UP_CC)}&subject=${encodeURIComponent(SPEAK_UP_SUBJECT)}&body=${encodeURIComponent(SPEAK_UP_BODY)}`;
  return `mailto:${SPEAK_UP_TO.join(",")}?${q}`;
}
