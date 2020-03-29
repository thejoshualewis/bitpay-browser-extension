export enum ClaimCodeType {
  barcode = 'barcode',
  code = 'code',
  link = 'link'
}

export interface GiftCardDiscount {
  hidden: boolean;
  code: string;
  type: 'flatrate' | 'percentage';
  amount: number;
}

export interface GiftCardActivationFee {
  amountRange: {
    min: number;
    max: number;
  };
  fee: number;
  type: 'fixed' | 'percentage';
}

export interface CommonCardConfig {
  activationFees?: GiftCardActivationFee[];
  cardImage: string;
  currency: string;
  defaultClaimCodeType: ClaimCodeType;
  description: string;
  discounts?: GiftCardDiscount[];
  displayName: string;
  emailRequired: boolean;
  featured?: boolean;
  hidden?: boolean;
  hidePin?: boolean;
  icon: string;
  integersOnly?: boolean;
  logo: string;
  logoBackgroundColor: string;
  minAmount?: number;
  maxAmount?: number;
  printRequired?: boolean;
  redeemButtonText?: string;
  redeemInstructions?: string;
  redeemUrl?: string;
  terms: string;
  website: string;
}

export interface CardConfig extends CommonCardConfig {
  name: string;
  supportedAmounts?: number[];
}

export interface GiftCard {
  accessKey: string;
  amount: number;
  archived: boolean;
  barcodeData?: string;
  barcodeFormat?: string;
  barcodeImage?: string;
  claimCode: string;
  claimLink?: string;
  currency: string;
  date: string;
  displayName: string;
  invoiceId: string;
  invoiceTime?: number;
  name: string;
  pin?: string;
  status: string;
  clientId: string;
  totalDiscount?: number;
}

export type GiftCardSaveParams = Partial<{
  error: string;
  status: string;
  remove: boolean;
}>;

export interface ApiCard extends CommonCardConfig {
  amount?: number;
  type: 'fixed' | 'range';
}

export interface GiftCardInvoiceParams {
  brand: string;
  currency: string;
  amount: number;
  clientId: string;
  discounts: string[];
  email?: string;
}

export interface GiftCardOrder {
  accessKey: string;
  invoiceId: string;
  totalDiscount: number;
}

export interface GiftCardRedeemParams {
  accessKey: string;
  clientId: string;
  invoiceId: string;
}

export interface GiftCardInvoiceMessage {
  data: { status: 'closed' | 'paid' | 'confirmed' | 'complete' };
}

export type ApiCardConfig = ApiCard[];

export interface AvailableCardMap {
  [cardName: string]: ApiCardConfig;
}

export interface CardConfigMap {
  [cardName: string]: CardConfig;
}
