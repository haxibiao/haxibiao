import React, { Component } from 'react';
import UserAgreementView from './UserAgreementView';

import { PageContainer } from '@src/components';


class UserAgreementScreen extends Component {
    render() {
        return (
            <PageContainer title="用户协议" white>
                <UserAgreementView />
            </PageContainer>
        );
    }
}

export default UserAgreementScreen;
