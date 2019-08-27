import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bordered, Block, InlineLinkButton, useNotifications, useApiResult, useModals } from 'react-components';
import { c } from 'ttag';
import { queryEmailVerificationCode, queryCheckVerificationCode } from 'proton-shared/lib/api/user';
import VerificationInput from './VerificationInput';
import VerificationEmailInput from './VerificationEmailInput';
import LoginSignupModal from './LoginSignupModal';

const EmailVerification = ({ email, onVerificationDone, onChangeEmail, onError }) => {
    const { createModal } = useModals();
    const { createNotification } = useNotifications();
    const { loading: codeLoading, request: requestCode, error: codeError } = useApiResult(queryEmailVerificationCode);
    const { loading: verifyLoading, request: requestVerification, error: verificationError } = useApiResult(
        ({ Token, TokenType }) => queryCheckVerificationCode(Token, TokenType, 2)
    );

    useEffect(() => {
        requestCode(email);
    }, []);

    useEffect(() => {
        const error = codeError || verificationError;
        if (error) {
            // TODO: preferably not show the error toast
            if (error.data.Code === 12220) {
                createModal(<LoginSignupModal />);
            }
            onError();
        }
    }, [verificationError, codeError]);

    const handleSendClick = async (email) => {
        await requestCode(email);
        createNotification({ text: c('Notification').jt`Verification code sent to: ${email}` });
        onChangeEmail(email);
    };

    // TODO: debounce maybe
    const handleResendClick = async () => {
        await requestCode(email);
        createNotification({ text: c('Notification').jt`New code sent to: ${email}` });
    };

    const handleValidateClick = async (code) => {
        const tokenData = { Token: `${email}:${code}`, TokenType: 'email' };
        await requestVerification(tokenData);
        onVerificationDone(tokenData);
    };

    const resendButton = (
        <InlineLinkButton onClick={handleResendClick} disabled={codeLoading} className="ml0-25">{c('Action')
            .t`resend`}</InlineLinkButton>
    );

    if (codeError) {
        return (
            <Bordered>
                <Block>{c('Info')
                    .t`We are having trouble resending verification code, you can try a different email.`}</Block>
                <VerificationEmailInput loading={codeLoading} onSendClick={handleSendClick} />
            </Bordered>
        );
    }

    return (
        <Bordered>
            <Block>{c('Info').t`Please check your email and enter the code below`}</Block>
            <Block>{c('Info').jt`The verification email is on it's way to ${<strong>{email}</strong>}`}</Block>
            <VerificationInput isLoading={verifyLoading} onValidate={handleValidateClick} />

            <div className="flex-items-center flex">
                {c('Info').t`Didn't receive the email?`}
                <strong className="flex-items-center flex ml0-25">{c('Info')
                    .jt`Check your spam folder or ${resendButton}`}</strong>
            </div>
        </Bordered>
    );
};

EmailVerification.propTypes = {
    email: PropTypes.string.isRequired,
    onVerificationDone: PropTypes.func.isRequired,
    onChangeEmail: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
};

export default EmailVerification;