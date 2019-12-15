import React, { Component , useEffect, useCallback,useMemo, useRef} from 'react';
import { RefreshControl ,View,FlatList} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { PageContainer,ScrollTabBar } from '@src/components';
import WithdrawLog from './components/WithdrawLog';
import IncomeAndExpenditure from './components/IncomeAndExpenditure';


class WithdrawHistory extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <PageContainer title="我的账单" white>
           <ScrollableTabView
            renderTabBar={props => <ScrollTabBar {...props} tabUnderlineWidth={PxDp(30)} />}
          >
            <WithdrawLog navigation={navigation} tabLabel="提现" />
            <IncomeAndExpenditure navigation={navigation} tabLabel="明细" />

          </ScrollableTabView>
       
      </PageContainer>
    );
  }
}

export default WithdrawHistory;
