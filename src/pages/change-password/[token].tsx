import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../gen/gql';
import { toErrorMap } from '../../utils/toErrorMap';

export const ChangePassword: NextPage = () => {
	const router = useRouter();
	const [changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ newPassword: '' }}
				onSubmit={async (values, { setErrors }) => {
					const changePasswordRes = await changePassword({
						variables: {
							newPassword: values.newPassword,
							token:
								typeof router.query.token === 'string'
									? router.query.token
									: '',
						},
					});
					if (changePasswordRes.data?.changePassword.errors) {
						const errorMap = toErrorMap(
							changePasswordRes.data.changePassword.errors
						);
						if ('token' in errorMap) {
							setTokenError(errorMap.token);
						}

						setErrors(errorMap);
					} else if (changePasswordRes.data?.changePassword.user) {
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='newPassword'
							placeholder='new password'
							label='New Password'
							type='password'
						/>
						{tokenError ? (
							<Flex>
								<Box mr={2} style={{ color: 'red' }}>
									{tokenError}
								</Box>
								<NextLink href='/forgot-password'>
									<Link>click here to try again</Link>
								</NextLink>
							</Flex>
						) : null}
						<Button
							mt={4}
							type='submit'
							isLoading={isSubmitting}
							colorScheme='twitter'
						>
							change password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default ChangePassword;
