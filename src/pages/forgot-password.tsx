import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../gen/gql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);
	const [forgotPassword] = useForgotPasswordMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async values => {
					await forgotPassword({ variables: values });
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box>
							if an account with that email exists, we sent you an email
						</Box>
					) : (
						<Form>
							<Box mb='4'>Forgot password?</Box>
							<InputField
								name='email'
								placeholder='email'
								label='Email'
								type='email'
							/>
							<Button
								mt={4}
								type='submit'
								isLoading={isSubmitting}
								colorScheme='twitter'
							>
								Send
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(ForgotPassword);
