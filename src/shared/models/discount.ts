import { DISCOUNT_FIXED, DISCOUNT_PERCENT, DISCOUNT_TYPE } from '../enums/discount';

export interface Discount {
  type: DISCOUNT_TYPE;
  value: DISCOUNT_PERCENT | DISCOUNT_FIXED;
}
