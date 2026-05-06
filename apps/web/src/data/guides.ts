import type { ReactNode } from "react";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  readTime: string;
  content: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "warning-signs",
    title: "Common Warning Signs",
    description: "Learn to recognize the red flags that appear in most scam attempts.",
    icon: "AlertTriangle",
    color: "yellow",
    readTime: "4 min read",
    content: `
## Common Warning Signs

Most scams share similar patterns. Learning to recognize these warning signs can protect you from the majority of scam attempts.

### 1. Urgency and Pressure

Scammers create artificial urgency to bypass your critical thinking:

- "Your account will be suspended in 24 hours!"
- "Act now or lose this opportunity forever!"
- "This offer expires at midnight!"

Legitimate organizations give you time to think and never pressure immediate action.

### 2. Requests for Sensitive Information

No legitimate company or government agency will ask for:

- Passwords or PINs
- OTP codes sent to your phone
- Full credit card numbers via email/phone
- Social Security Number via unsolicited contact
- Copies of your ID or passport via email

### 3. Suspicious Payment Methods

Scammers prefer payment methods that are hard to trace or reverse:

- Gift cards (iTunes, Google Play, etc.)
- Cryptocurrency
- Wire transfers
- Payment apps (Venmo, CashApp) to strangers

Legitimate businesses accept standard payment methods and don't demand specific untraceable options.

### 4. Too Good to Be True

If an offer seems unbelievable, it probably is:

- "Work from home and earn $5,000/week!"
- "Double your money in 24 hours!"
- "Free luxury vacation - just pay the taxes!"

Remember: there's no such thing as easy money.

### 5. Impersonation

Scammers pretend to be:

- Bank fraud departments
- Government agencies (IRS, Social Security)
- Tech support (Microsoft, Apple)
- Love interests (romance scams)
- Family members in distress

Always verify independently using official contact information.

### What to Do

1. **Stop** - Don't act immediately
2. **Verify** - Contact the organization directly using official channels
3. **Don't send** - Never send money, credentials, or personal data
4. **Report** - Tell the platform and authorities
`,
  },
  {
    slug: "verify-messages",
    title: "How to Verify Suspicious Messages",
    description: "Steps to take when you receive a suspicious message or call.",
    icon: "Search",
    color: "cyan",
    readTime: "5 min read",
    content: `
## How to Verify Suspicious Messages

When you receive a suspicious message, call, or email, follow these steps to verify its legitimacy.

### Step 1: Don't Act Immediately

Scammers rely on urgency. Take a breath and:

- Don't click any links
- Don't call any phone numbers in the message
- Don't reply to the message
- Don't download any attachments

### Step 2: Verify Independently

Contact the organization using information YOU find:

1. **For banks**: Call the number on your card or statement
2. **For government**: Use the official website (.gov) or phone directory
3. **For companies**: Type the company name into your browser (don't use links)
4. **For family**: Call them directly on their known number

### Step 3: Check the Details

Look for these red flags:

- Email address doesn't match the organization's domain
- Links point to suspicious URLs (check before clicking)
- Poor grammar and spelling
- Threatening or urgent language
- Requests for sensitive information

### Step 4: Use Online Tools

- **Reverse image search** profile photos on dating sites
- **Google the phone number** or email address
- **Check ScamRadar's library** for similar scams
- **Search "[company] scam"** to see others' experiences

### Step 5: Trust Your Instincts

If something feels wrong, it probably is. It's better to:

- Miss out on a "great deal" that was fake anyway
- "Offend" someone by verifying their identity
- Take extra time to confirm legitimacy

### Emergency?

If you've already:

- **Sent money**: Contact your bank/payment provider IMMEDIATELY
- **Shared passwords**: Change them immediately on the real site
- **Downloaded software**: Run a full antivirus scan
- **Given remote access**: Disconnect internet and change all passwords
`,
  },
  {
    slug: "after-sending",
    title: "What to Do After Sending Money",
    description: "Immediate actions to take if you've sent money or credentials to a scammer.",
    icon: "Lightbulb",
    color: "green",
    readTime: "6 min read",
    content: `
## What to Do After Sending Money

If you've sent money or shared credentials with a scammer, act quickly. Every minute counts.

### Immediate Actions (Within 1 Hour)

#### 1. Contact Your Bank/Payment Provider

- Call the fraud department immediately
- Tell them it was a scam and you need to reverse the transaction
- For wire transfers: Contact the sending bank AND receiving bank
- For credit cards: Dispute the charge as fraudulent
- For payment apps (Venmo, CashApp): Report to customer support immediately

#### 2. Change All Passwords

- Change passwords for any accounts you mentioned to the scammer
- Start with email, banking, and payment accounts
- Use a different device if possible (the scammer may have installed malware)
- Enable two-factor authentication everywhere

#### 3. Contact the Platform

- **eBay, Amazon, etc.**: Report the seller/buyer
- **Dating sites**: Report the profile
- **Social media**: Report the account
- **Email provider**: Mark as phishing/spam

### Within 24 Hours

#### File Official Reports

1. **FTC**: ReportFraud.ftc.gov
2. **FBI IC3**: ic3.gov (for internet crimes)
3. **Local police**: File a report for your records
4. **Your bank**: Follow up with written documentation

#### Gather Evidence

- Screenshots of all communications
- Transaction receipts and reference numbers
- Profile information of the scammer
- Dates, times, and methods of contact

### Recovery Steps by Payment Method

| Method | Action |
|--------|--------|
| Credit Card | Dispute charge, call fraud dept |
| Debit Card | Contact bank immediately, may be harder to reverse |
| Wire Transfer | Contact both banks, act within hours |
| Gift Cards | Report to gift card company, low recovery chance |
| Crypto | Trace on blockchain, report to exchange |
| Payment Apps | Report to app support, change passwords |

### When Money Was NOT Recovered

- Accept the loss - chasing further will lead to recovery scams
- Learn from the experience
- Share your story to warn others
- Focus on protecting your remaining assets
- Consider the emotional impact and seek support

### Warning: Recovery Scams

After being scammed, you're a target for "recovery scammers" who:

- Claim they can get your money back (they can't)
- Ask for upfront fees (never pay these)
- Pretend to be law enforcement or lawyers
- Use high-pressure tactics

**Remember**: Legitimate recovery services don't guarantee results and don't ask for upfront payment.
`,
  },
  {
    slug: "protect-yourself",
    title: "Proactive Protection Tips",
    description: "Preventive measures to stay safe from scams and fraud.",
    icon: "ShieldCheck",
    color: "blue",
    readTime: "5 min read",
    content: `
## Proactive Protection Tips

Prevention is the best defense against scams. These proactive measures will significantly reduce your risk.

### 1. Strengthen Your Digital Security

#### Use Strong, Unique Passwords
- Use a password manager (1Password, Bitwarden)
- Never reuse passwords across sites
- Make passwords at least 12 characters long
- Include uppercase, lowercase, numbers, and symbols

#### Enable Two-Factor Authentication (2FA)
- Enable on ALL accounts that offer it
- Use authenticator apps (Google Authenticator, Authy) not SMS when possible
- Backup codes in a secure location

#### Keep Software Updated
- Enable automatic updates on all devices
- Update browsers, operating systems, and apps promptly
- Use reputable antivirus software

### 2. Protect Your Personal Information

#### Social Media Privacy
- Set profiles to private
- Don't share personal details publicly (birthday, address, phone)
- Be careful what you post - scammers use this for impersonation
- Remove friends you don't know personally

#### Be Careful with Public Wi-Fi
- Avoid accessing banking/payment sites on public Wi-Fi
- Use a VPN if you must use public networks
- Disable auto-connect to open Wi-Fi networks

### 3. Verify Before You Trust

#### Research Before You Buy
- Read reviews on multiple sites
- Check Better Business Bureau ratings
- Google "[company name] scam" before purchasing
- Verify website security (look for HTTPS and padlock icon)

#### Verify Identities
- Video call before trusting someone you met online
- Reverse image search profile photos
- Ask for verifiable information (but don't share yours)
- Meet in public places for in-person transactions

### 4. Financial Protection

#### Monitor Your Accounts
- Check bank/credit card statements weekly
- Set up transaction alerts
- Review credit reports annually (annualcreditreport.com)
- Consider credit monitoring services

#### Smart Payment Practices
- Use credit cards (better fraud protection than debit)
- Avoid wire transfers to strangers
- Never pay with gift cards
- Be skeptical of payment requests via email

### 5. Build a Healthy Skepticism

- If it sounds too good to be true, it is
- Legitimate organizations don't pressure immediate action
- Government agencies don't initiate contact via phone/email for payments
- Real love interests don't ask for money
- No one can guarantee investment returns

### Create Your Personal Rules

1. I will never send money to someone I haven't met in person
2. I will always verify independently before acting
3. I will never share OTPs, passwords, or PINs
4. I will take time to think before making financial decisions
5. I will trust my instincts when something feels wrong
`,
  },
  {
    slug: "advising-victims",
    title: "Advising Potential Victims",
    description:
      "How to help family, friends, and coworkers who may be involved with a scammer.",
    icon: "ShieldCheck",
    color: "blue",
    readTime: "7 min read",
    content: `
## Advising Potential Victims

When someone you care about is being scammed, it's a delicate situation. Victims are often embarrassed, defensive, emotionally attached, isolated, financially pressured, or convinced that outsiders don't understand.

### Understanding the Victim's Perspective

Before intervening, understand why victims struggle to see the truth:

- **Emotional attachment**: Romance scam victims truly believe they're in love
- **Embarrassment**: They feel stupid and don't want others to judge them
- **Isolation**: Scammers often isolate victims from support networks
- **Financial pressure**: They've already lost money and want to "win it back"
- **Trust**: They trust the scammer more than skeptical outsiders
- **Defensive**: Being told "you're being scammed" feels like an attack on their intelligence

### Starting the Conversation

#### Do's:
- **Be calm and non-judgmental**: "I'm worried about you, can we talk?"
- **Express concern for THEM**: "I care about your safety and wellbeing"
- **Use "I" statements**: "I feel concerned when I see these red flags"
- **Pick the right time**: Private, calm moment (not during a crisis)
- **Listen first**: Let them explain without interrupting
- **Suggest verification**: "Can we verify this together?"

#### Don'ts:
- **Don't shame or insult**: "How could you be so stupid?"
- **Don't be confrontational**: "You're being scammed, end it now!"
- **Don't attack the scammer directly**: "That person is obviously a scammer!"
- **Don't issue ultimatums**: "Choose between me and them!"
- **Don't take over their accounts** unless safety requires it
- **Don't confront the scammer** - it pushes the victim away

### For Specific Scam Types

#### Romance Scams
1. Suggest a video call: "I'd love to meet them too, can you set up a video call?"
2. Express curiosity: "That's interesting, can you show me their profile?"
3. Suggest reverse image search together
4. Share information about romance scams gently

#### Investment Scams
1. Offer to help research: "Let's look up this company together"
2. Suggest checking with a financial advisor
3. Point out guarantees are unrealistic
4. Share stories of others' experiences

#### Job Scams
1. Offer to review the offer together
2. Point out legitimate jobs don't charge fees
3. Suggest checking the company on LinkedIn/Glassdoor
4. Offer to help find legitimate opportunities

#### Recovery Scams
1. Acknowledge their loss: "I know you're hurting from the lost money"
2. Explain that real recovery services don't guarantee results
3. Offer to help find legitimate help (lawyer, police)
4. Warn that paying more will lead to more losses

#### Fake Support Scams
1. Offer to call the real company together
2. Show them how to find official contact info
3. Explain that real tech support doesn't call you
4. Help them run a legitimate antivirus scan

#### Family Emergency Impersonation
1. Verify through other family members
2. Create a "safe word" for real emergencies
3. Call the person they claim to be directly
4. Stay calm and verify before sending anything

### Steps to Take Together

1. **Gather evidence safely**: Screenshots, transaction records
2. **Contact banks/platforms**: Help them report and potentially reverse charges
3. **File reports**: FTC, FBI IC3, local police
4. **Change passwords**: Help them secure all accounts
5. **Warn others**: Post on social media to prevent more victims
6. **Seek support**: Therapy/counseling for the emotional impact

### When They Won't Listen

If they're defensive or refuse to believe it's a scam:

1. **Plant seeds of doubt**: "I just want you to be safe, can we verify together?"
2. **Share educational resources**: Send them ScamRadar guides
3. **Involve trusted third parties**: Another family member, their doctor, a lawyer
4. **Document everything**: They may need evidence later
5. **Protect yourself**: Don't cosign loans or send money "just this once"
6. **Be patient**: Many victims only realize after losing more money

### What NOT to Do

- **Don't secretly take over their accounts** (unless they're cognitively impaired)
- **Don't confront the scammer directly** (it alienates the victim)
- **Don't pay more money** to "prove it's a scam"
- **Don't shame or insult them** (they already feel terrible)
- **Don't give up on them** - your support is crucial

### Recovery: After the Scam Ends

- Validate their feelings: "I know this is painful"
- Help them secure accounts and finances
- Encourage therapy for emotional recovery
- Celebrate their strength in ending it
- Help them warn others to prevent more victims
- Remind them: it's not their fault, scammers are professionals

### Remember

Your goal is to **support, not to be right**. If you approach with love, patience, and genuine concern, you're much more likely to help them see the truth and escape the scam.
`,
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
