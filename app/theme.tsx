import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';

import { colors } from './constants/colors';
import { IThemePreference } from './definitions/ITheme';
import { TNavigationOptions } from './definitions/navigationTypes';

export type TSupportedThemes = keyof typeof colors;
export type TColors = typeof colors[TSupportedThemes];

interface IThemeContextProps {
	theme: string;
	themePreferences?: IThemePreference;
	setTheme?: (newTheme?: {}) => void;
	colors: TColors;
}

export const ThemeContext = React.createContext<IThemeContextProps>({ theme: 'light', colors: colors.light });

export function withTheme<T extends object>(Component: React.ComponentType<T> & TNavigationOptions): typeof Component {
	const ThemedComponent = (props: T) => (
		<ThemeContext.Consumer>{contexts => <Component {...props} {...contexts} />}</ThemeContext.Consumer>
	);

	hoistNonReactStatics(ThemedComponent, Component);
	return ThemedComponent;
}

export const useTheme = (): IThemeContextProps => React.useContext(ThemeContext);
