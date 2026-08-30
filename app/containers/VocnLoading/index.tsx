import { Dimensions, Image, StyleSheet, View } from 'react-native';

const Width = Dimensions.get('window').width;

const VocnLoading = () => (
	<View style={styles.imageView} testID='vocn-loading'>
		<Image source={require('../../assests/VOCN_loading.gif')} style={styles.image} resizeMode='contain' />
	</View>
);

const styles = StyleSheet.create({
	imageView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	image: {
		height: 300,
		width: Width
	}
});

export default VocnLoading;
