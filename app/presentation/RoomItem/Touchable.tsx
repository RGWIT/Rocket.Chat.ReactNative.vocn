import React from 'react';
import { I18nManager } from 'react-native';
import Animated, {
	useAnimatedGestureHandler,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS
} from 'react-native-reanimated';
import { LongPressGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';

import Touch from '../../utils/touch';
import { ACTION_WIDTH, LONG_SWIPE, SMALL_SWIPE } from './styles';
import { themes } from '../../constants/colors';
import { LeftActions, RightActions } from './Actions';

interface ITouchableProps {
	children: JSX.Element;
	type: string;
	onPress(): void;
	onLongPress(): void;
	testID: string;
	width: number;
	favorite: boolean;
	isRead: boolean;
	rid: string;
	toggleFav: Function;
	toggleRead: Function;
	hideChannel: Function;
	theme: string;
	isFocused: boolean;
	swipeEnabled: boolean;
	displayMode: string;
}

const Touchable = (props: ITouchableProps): JSX.Element => {
	const { testID, isRead, width, favorite, children, theme, isFocused, swipeEnabled, displayMode } = props;

	const rowOffSet = useSharedValue(0);
	const transX = useSharedValue(0);
	const rowState = useSharedValue(0); // 0: closed, 1: right opened, -1: left opened
	let _value = 0;

	const close = () => {
		rowState.value = 0;
		transX.value = withSpring(0, { overshootClamping: true });
		rowOffSet.value = 0;
	};

	const toggleFav = () => {
		const { toggleFav, rid, favorite } = props;
		if (toggleFav) {
			toggleFav(rid, favorite);
		}
		close();
	};

	const toggleRead = () => {
		const { toggleRead, rid, isRead } = props;
		if (toggleRead) {
			toggleRead(rid, isRead);
		}
	};

	const hideChannel = () => {
		const { hideChannel, rid, type } = props;
		if (hideChannel) {
			hideChannel(rid, type);
		}
	};

	const onToggleReadPress = () => {
		toggleRead();
		close();
	};

	const onHidePress = () => {
		hideChannel();
		close();
	};

	const onPress = () => {
		if (rowState.value !== 0) {
			close();
			return;
		}
		const { onPress } = props;
		if (onPress) {
			onPress();
		}
	};

	const onLongPress = () => {
		const { onLongPress } = props;
		if (rowState.value !== 0) {
			close();
			return;
		}

		if (onLongPress) {
			onLongPress();
		}
	};

	const onLongPressHandlerStateChange = ({ nativeEvent }: any) => {
		if (nativeEvent.state === State.ACTIVE) {
			onLongPress();
		}
	};

	const handleRelease = (event: any) => {
		const { translationX } = event;
		_value += translationX;
		let toValue = 0;
		if (rowState.value === 0) {
			// if no option is opened
			if (translationX > 0 && translationX < LONG_SWIPE) {
				if (I18nManager.isRTL) {
					toValue = 2 * ACTION_WIDTH;
				} else {
					toValue = ACTION_WIDTH;
				}
				rowState.value = -1;
			} else if (translationX >= LONG_SWIPE) {
				toValue = 0;
				if (I18nManager.isRTL) {
					hideChannel();
				} else {
					toggleRead();
				}
			} else if (translationX < 0 && translationX > -LONG_SWIPE) {
				// open trailing option if he swipe left
				if (I18nManager.isRTL) {
					toValue = -ACTION_WIDTH;
				} else {
					toValue = -2 * ACTION_WIDTH;
				}
				rowState.value = 1;
			} else if (translationX <= -LONG_SWIPE) {
				toValue = 0;
				rowState.value = 1;
				if (I18nManager.isRTL) {
					toggleRead();
				} else {
					hideChannel();
				}
			} else {
				toValue = 0;
			}
		} else if (rowState.value === -1) {
			// if left option is opened
			if (_value < SMALL_SWIPE) {
				toValue = 0;
				rowState.value = 0;
			} else if (_value > LONG_SWIPE) {
				toValue = 0;
				rowState.value = 0;
				if (I18nManager.isRTL) {
					hideChannel();
				} else {
					toggleRead();
				}
			} else if (I18nManager.isRTL) {
				toValue = 2 * ACTION_WIDTH;
			} else {
				toValue = ACTION_WIDTH;
			}
		} else if (rowState.value === 1) {
			// if right option is opened
			if (_value > -2 * SMALL_SWIPE) {
				toValue = 0;
				rowState.value = 0;
			} else if (_value < -LONG_SWIPE) {
				toValue = 0;
				rowState.value = 0;
				if (I18nManager.isRTL) {
					toggleRead();
				} else {
					hideChannel();
				}
			} else if (I18nManager.isRTL) {
				toValue = -ACTION_WIDTH;
			} else {
				toValue = -2 * ACTION_WIDTH;
			}
		}
		transX.value = withSpring(toValue, { overshootClamping: true });
		rowOffSet.value = toValue;
		_value = toValue;
	};

	const onGestureEvent = useAnimatedGestureHandler({
		onActive: event => {
			transX.value = event.translationX + rowOffSet.value;
		},
		onEnd: event => {
			// https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS
			runOnJS(handleRelease)(event);
		}
	});

	const animatedStyles = useAnimatedStyle(() => ({ transform: [{ translateX: transX.value }] }));

	return (
		<LongPressGestureHandler onHandlerStateChange={onLongPressHandlerStateChange}>
			<Animated.View>
				<PanGestureHandler activeOffsetX={[-20, 20]} onGestureEvent={onGestureEvent} enabled={swipeEnabled}>
					<Animated.View>
						<LeftActions
							transX={transX}
							isRead={isRead}
							width={width}
							onToggleReadPress={onToggleReadPress}
							theme={theme}
							displayMode={displayMode}
						/>
						<RightActions
							transX={transX}
							favorite={favorite}
							width={width}
							toggleFav={toggleFav}
							onHidePress={onHidePress}
							theme={theme}
							displayMode={displayMode}
						/>
						<Animated.View style={animatedStyles}>
							<Touch
								onPress={onPress}
								theme={theme}
								testID={testID}
								style={{
									backgroundColor: isFocused ? themes[theme].chatComponentBackground : themes[theme].backgroundColor
								}}>
								{children}
							</Touch>
						</Animated.View>
					</Animated.View>
				</PanGestureHandler>
			</Animated.View>
		</LongPressGestureHandler>
	);
};

export default Touchable;
