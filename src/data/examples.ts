import { ScamAnalysisReport } from '../types';

export interface ExampleMessage {
  id: 'job' | 'payment' | 'prize';
  label: string;
  category: string;
  text: string;
  report: ScamAnalysisReport;
}

export const SCAM_EXAMPLES: ExampleMessage[] = [
  {
    id: 'job',
    label: 'Job Scam',
    category: 'Job / Employment Scam',
    text: `URGENT OFFER: Congratulations! You have been shortlisted for an exclusive Remote Data Entry & Assistant position at Apex Global Logistics. Earn $55/hr ($3,200/wk) with zero previous experience required. Training starts immediately. To secure your placement and receive your company MacBook setup check, contact our recruiter on Telegram @ApexCareers_Desk today. A mandatory $150 onboarding registration and training fee is required within 24 hours to finalize your employment contract.`,
    report: {
      riskLevel: 'HIGH RISK',
      riskPercentage: 94,
      scamType: 'Job / Employment Scam',
      redFlags: [
        'Upfront registration or training fee',
        'Unrealistic salary or easy-money promise',
        'Unverified recruiter or company',
        'Urgent pressure to act'
      ],
      explanation: 'This message exhibits classic characteristics of an employment scam. Legitimate employers never require candidates to pay upfront registration or training fees, promise exceptionally high wages for basic tasks, or conduct official hiring solely through anonymous chat apps under urgent deadlines.',
      safetyAdvice: [
        'Do not send money for registration, software, or equipment.',
        'Do not deposit checks from unverified employers.',
        'Do not click suspicious links or share sensitive identity documents.',
        'Verify the company through its official website and job board.',
        'Report or block the sender if appropriate.'
      ],
      originalMessage: `URGENT OFFER: Congratulations! You have been shortlisted for an exclusive Remote Data Entry & Assistant position at Apex Global Logistics. Earn $55/hr ($3,200/wk) with zero previous experience required. Training starts immediately. To secure your placement and receive your company MacBook setup check, contact our recruiter on Telegram @ApexCareers_Desk today. A mandatory $150 onboarding registration and training fee is required within 24 hours to finalize your employment contract.`,
      analyzedAt: 'Just now'
    }
  },
  {
    id: 'payment',
    label: 'Payment Scam',
    category: 'Payment & Banking Scam',
    text: `CHASE SECURITY ALERT: Your debit card has been temporarily suspended due to an unauthorized Zelle transfer request of $2,480.00 to CryptoPay Global. To reverse this charge and prevent permanent account restriction, you must immediately transfer your funds to our secure holding account or call our fraud department at (800) 555-0194. Tap http://chase-security-restore.cc/auth to verify your identity now.`,
    report: {
      riskLevel: 'HIGH RISK',
      riskPercentage: 89,
      scamType: 'Payment & Banking Scam',
      redFlags: [
        'Urgent account suspension or unauthorized-charge claim',
        'Request to transfer money',
        'Suspicious payment method',
        'Unverified phone number or link'
      ],
      explanation: 'This message uses artificial panic about an unauthorized charge and threatened account suspension. Financial institutions never instruct customers to transfer funds into "safe holding accounts" or direct users to unverified third-party websites to cancel transactions.',
      safetyAdvice: [
        'Do not send money or transfer funds to any requested account.',
        'Do not share OTPs, passwords, or account credentials.',
        'Do not click suspicious links or call phone numbers in the text.',
        'Verify the company through its official website or the number on your card.',
        'Report or block the sender if appropriate.'
      ],
      originalMessage: `CHASE SECURITY ALERT: Your debit card has been temporarily suspended due to an unauthorized Zelle transfer request of $2,480.00 to CryptoPay Global. To reverse this charge and prevent permanent account restriction, you must immediately transfer your funds to our secure holding account or call our fraud department at (800) 555-0194. Tap http://chase-security-restore.cc/auth to verify your identity now.`,
      analyzedAt: 'Just now'
    }
  },
  {
    id: 'prize',
    label: 'Prize Scam',
    category: 'Prize / Lottery Scam',
    text: `OFFICIAL NOTIFICATION: Your phone number has been drawn as the lucky 1st place winner in our 2026 National Customer Rewards Sweepstakes! You have won $50,000 cash plus a new Apple iPhone 16 Pro Max. To release your winnings, you must confirm your full legal name, banking details, and remit a $250 courier processing and tax clearance fee before 5:00 PM today at http://claim-national-rewards.vip/claim.`,
    report: {
      riskLevel: 'HIGH RISK',
      riskPercentage: 96,
      scamType: 'Prize / Lottery Scam',
      redFlags: [
        'Unexpected prize notification',
        'Request for processing/tax/registration fee',
        'Urgent deadline',
        'Request for personal or financial information'
      ],
      explanation: 'This message is a fraudulent prize sweepstakes lure. You cannot win a contest or lottery you never entered. Legitimate sweepstakes never require winners to pay an upfront processing, courier, or tax fee to receive winnings, nor do they demand immediate submission of sensitive financial details.',
      safetyAdvice: [
        'Do not send money or pay any fee to claim a prize.',
        'Do not share OTPs, passwords, or personal banking information.',
        'Do not click suspicious links or adhere to artificial countdowns.',
        'Remember that genuine lotteries never require advance fees.',
        'Report or block the sender if appropriate.'
      ],
      originalMessage: `OFFICIAL NOTIFICATION: Your phone number has been drawn as the lucky 1st place winner in our 2026 National Customer Rewards Sweepstakes! You have won $50,000 cash plus a new Apple iPhone 16 Pro Max. To release your winnings, you must confirm your full legal name, banking details, and remit a $250 courier processing and tax clearance fee before 5:00 PM today at http://claim-national-rewards.vip/claim.`,
      analyzedAt: 'Just now'
    }
  }
];
