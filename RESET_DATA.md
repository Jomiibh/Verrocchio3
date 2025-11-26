# Data Reset Guide

This guide explains how to reset all data in the Verrocchio application.

## What Gets Reset

Running the data reset script will **permanently delete all data** from the following tables:

- **Users** - All user accounts
- **Artist Profiles** - Artist profile information
- **Buyer Profiles** - Buyer profile information
- **Timeline Posts** - All feed posts
- **Commission Requests** - All commission requests
- **Commission Offers** - All commission offers
- **Conversations** - All message conversations
- **Messages** - All individual messages
- **Payment Transactions** - All payment records
- **Artist Swipes** - All swipe history

## How to Reset Data

### Option 1: Using npm script (Recommended)

```bash
npm run reset-data
```

### Option 2: Running the script directly

```bash
tsx reset-data.ts
```

## Warning

⚠️ **THIS ACTION CANNOT BE UNDONE!**

All data will be permanently deleted from the cloud database. Make sure you really want to do this before proceeding.

## What Happens After Reset

After resetting the data:

1. All users will be logged out
2. The application will show empty states (no artists, no posts, etc.)
3. You will need to create new accounts and add new content
4. All previously uploaded images will still exist in cloud storage but won't be referenced

## Troubleshooting

If the reset fails:

- Check your internet connection (data is stored in Creao cloud)
- Make sure you're authenticated with valid credentials
- Check the console output for specific error messages

## Technical Details

The reset script (`reset-data.ts`) uses the ORM `purgeAll*()` methods to delete all records from each table in the Creao DataStore API.
