import React from 'react';
import PropTypes from 'prop-types';
import { Href, VpnLogo } from 'react-components';
import { c } from 'ttag';

const PublicHeader = ({ action }) => (
    <header className="flex-item-noshrink flex flex-align-items-center no-print mb2">
        <div className="no-mobile flex-item-fluid">
            <span className="opacity-50">{c('Label').t`Back to:`}</span>{' '}
            <Href
                url="https://protonvpn.com"
                className="inline-block color-white text-no-decoration hover-same-color"
                target="_self"
            >{c('Link').t`protonvpn.com`}</Href>
        </div>
        <div className="w150p center">
            <Href url="https://protonvpn.com" target="_self">
                <VpnLogo className="fill-primary" />
            </Href>
        </div>
        <div className="no-mobile flex-item-fluid text-right">{action}</div>
    </header>
);

PublicHeader.propTypes = {
    action: PropTypes.node,
};

export default PublicHeader;
