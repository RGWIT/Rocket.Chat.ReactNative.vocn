import { StyleSheet, Dimensions } from 'react-native';

import sharedStyles from '../Styles';

const Width = Dimensions.get('window').width;

export default StyleSheet.create({
	serverName: {
		...sharedStyles.textSemibold,
		fontSize: 16,
		marginBottom: 4
	},
	serverUrl: {
		...sharedStyles.textRegular,
		fontSize: 14,
		marginBottom: 24
	},
	registrationText: {
		fontSize: 14,
		...sharedStyles.textRegular,
		...sharedStyles.textAlignCenter
	},
	alignItemsCenter: {
		alignItems: 'center'
	},
	imageView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#38b4d6'
	},
	image: {
		height: 300,
		width: Width
	}
});
