import { memo, type ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import I18n from '../i18n';
import { useTheme } from '../theme';
import sharedStyles from './Styles';
import { useAppSelector } from '../lib/hooks/useAppSelector';
import VocnLoading from '../containers/VocnLoading';

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	textWrap: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 80
	},
	text: {
		fontSize: 16,
		...sharedStyles.textRegular,
		...sharedStyles.textAlignCenter
	}
});

const AuthLoadingView = memo((): ReactElement => {
	const text = useAppSelector(state => state.app.text);
	const { colors } = useTheme();
	return (
		<View style={styles.container}>
			<VocnLoading />
			{text ? (
				<View style={styles.textWrap} pointerEvents='none'>
					<Text style={[styles.text, { color: colors.fontDefault }]}>{`${text}\n${I18n.t('Please_wait')}`}</Text>
				</View>
			) : null}
		</View>
	);
});

export default AuthLoadingView;
