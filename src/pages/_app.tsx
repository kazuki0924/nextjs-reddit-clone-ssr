import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import React from 'react';
import { PaginatedPosts } from '../gen/gql';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
	return (
		// <ApolloProvider client={client}>
		<ChakraProvider resetCSS theme={theme}>
			<ColorModeProvider
				options={{
					useSystemColorMode: true,
				}}
			>
				<Component {...pageProps} />
			</ColorModeProvider>
		</ChakraProvider>
		// </ApolloProvider>
	);
}

export default MyApp;
