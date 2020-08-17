import React, { Component, useEffect, useCallback, useMemo, useRef } from 'react';
import { RefreshControl, View, FlatList } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { PageContainer, ScrollTabBar } from '~/components';
import WithdrawLog from './components/WithdrawLog';
import IncomeAndExpenditure from './components/IncomeAndExpenditure';
import ContributionLog from './components/ContributionLog';

class WithdrawHistory extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <PageContainer title="我的账单" white>
                <ScrollableTabView
                    renderTabBar={(props) => <ScrollTabBar {...this.props} tabUnderlineWidth={pixel(30)} />}
                    initialPage={this.props.route.params?.tabPage ?? 0}
                    prerenderingSiblingsNumber={this.props.route.params?.tabPage ?? 0}>
                    <WithdrawLog navigation={navigation} tabLabel="提现" />
                    <ContributionLog navigation={navigation} tabLabel={Config.limitAlias} />
                    <IncomeAndExpenditure navigation={navigation} tabLabel="明细" />
                </ScrollableTabView>
            </PageContainer>
        );
    }
}

export default WithdrawHistory;
