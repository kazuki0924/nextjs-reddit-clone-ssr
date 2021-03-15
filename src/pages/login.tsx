import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { MeDocument, MeQuery, useLoginMutation } from '../gen/gql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

const Login: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [login] = useLoginMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					{
						const res = await login({
							variables: values,
							update: (cache, { data }) => {
								cache.writeQuery<MeQuery>({
									query: MeDocument,
									data: {
										__typename: 'Query',
										me: data?.login.user,
									},
								});
								cache.evict({ fieldName: 'posts:{}' });
							},
						});
						if (res.data?.login.errors) {
							setErrors(toErrorMap(res.data.login.errors));
						} else if (res.data?.login.user) {
							if (typeof router.query.next === 'string') {
								router.push(router.query.next);
							} else {
								router.push('/');
							}
						}
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='usernameOrEmail'
							placeholder='username or email'
							label='Username or Email'
						/>
						<Box mt={4}>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
						</Box>
						<Flex>
							<NextLink href='/forgot-password'>
								<Link ml='auto'>forgot password?</Link>
							</NextLink>
						</Flex>
						<Button
							mt={4}
							type='submit'
							isLoading={isSubmitting}
							colorScheme='twitter'
						>
							login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(Login);
