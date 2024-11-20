import { CartItemData } from '../CartItem';
import { sendCartEmail as sendCartEmailService } from '../../../services/emailService';

export const emailCart = async (items: CartItemData[], email: string) => {
  try {
    await sendCartEmailService(items, email);
    return true;
  } catch (error) {
    console.error('Error sending cart email:', error);
    return false;
  }
};
