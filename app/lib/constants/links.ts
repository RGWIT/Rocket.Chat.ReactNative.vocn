import { getBundleId, isIOS } from '../methods/helpers/deviceInfo';

const APP_STORE_ID = '1628430389';

export const PLAY_MARKET_LINK = `https://play.google.com/store/apps/details?id=${getBundleId}`;
export const FDROID_MARKET_LINK = 'https://f-droid.org/en/packages/chat.rocket.android';
export const APP_STORE_LINK = `https://itunes.apple.com/app/id${APP_STORE_ID}`;
export const LICENSE_LINK = 'https://vocn.org/mit/';
export const STORE_REVIEW_LINK = isIOS
	? `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`
	: `market://details?id=${getBundleId}`;
