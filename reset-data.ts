/**
 * Data Reset Utility
 *
 * This script purges all data from all ORM tables in the application.
 * Use with caution - this will DELETE ALL DATA!
 */

import { UserORM } from './src/components/data/orm/orm_user';
import { ArtistProfileORM } from './src/components/data/orm/orm_artist_profile';
import { BuyerProfileORM } from './src/components/data/orm/orm_buyer_profile';
import { TimelinePostORM } from './src/components/data/orm/orm_timeline_post';
import { CommissionRequestORM } from './src/components/data/orm/orm_commission_request';
import { CommissionOfferORM } from './src/components/data/orm/orm_commission_offer';
import { ConversationORM } from './src/components/data/orm/orm_conversation';
import { MessageORM } from './src/components/data/orm/orm_message';
import { PaymentTransactionORM } from './src/components/data/orm/orm_payment_transaction';
import { ArtistSwipeORM } from './src/components/data/orm/orm_artist_swipe';

async function resetAllData() {
  console.log('🚨 RESETTING ALL DATA 🚨');
  console.log('This will delete all data from all tables...\n');

  try {
    // Purge all tables
    console.log('Purging Users...');
    await UserORM.getInstance().purgeAllUser();

    console.log('Purging Artist Profiles...');
    await ArtistProfileORM.getInstance().purgeAllArtistProfile();

    console.log('Purging Buyer Profiles...');
    await BuyerProfileORM.getInstance().purgeAllBuyerProfile();

    console.log('Purging Timeline Posts...');
    await TimelinePostORM.getInstance().purgeAllTimelinePost();

    console.log('Purging Commission Requests...');
    await CommissionRequestORM.getInstance().purgeAllCommissionRequest();

    console.log('Purging Commission Offers...');
    await CommissionOfferORM.getInstance().purgeAllCommissionOffer();

    console.log('Purging Conversations...');
    await ConversationORM.getInstance().purgeAllConversation();

    console.log('Purging Messages...');
    await MessageORM.getInstance().purgeAllMessage();

    console.log('Purging Payment Transactions...');
    await PaymentTransactionORM.getInstance().purgeAllPaymentTransaction();

    console.log('Purging Artist Swipes...');
    await ArtistSwipeORM.getInstance().purgeAllArtistSwipe();

    console.log('\n✅ All data has been successfully reset!');
    console.log('The database is now empty.');
  } catch (error) {
    console.error('❌ Error resetting data:', error);
    throw error;
  }
}

// Run the reset
resetAllData()
  .then(() => {
    console.log('\n✨ Reset complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Reset failed:', error);
    process.exit(1);
  });
