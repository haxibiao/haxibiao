'use strict';
import React, { Component } from 'react';
import { PageContainer } from '~components';
import PrivacyPolicyView from './PrivacyPolicyView';

class PrivacyPolicyScreen extends Component {
	render() {
		return (
			<PageContainer title="隐私协议" white>
				<PrivacyPolicyView />
			</PageContainer>
		);
	}
}

export default PrivacyPolicyScreen;
