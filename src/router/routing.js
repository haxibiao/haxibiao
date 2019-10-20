import MainTabNavigator from './MainTabNavigator';
import AskQuestion from '../screens/creation/AskQuestionScreen';
import SelectCategory from '../screens/creation/SelectCategoryScreen';

// login
import LoginScreen from '../screens/login';
import RetrievePasswordScreen from '../screens/login/RetrievePasswordScreen';
import VerificationScreen from '../screens/login/VerificationScreen';

// wallet
import Wallet from '../screens/wallet';
import WithdrawApply from '../screens/wallet/WithdrawApply';
import WithdrawHistory from '../screens/wallet/WithdrawHistory';
import VerifyAccount from '../screens/wallet/VerifyAccount';
import WithdrawDetail from '../screens/wallet/WithdrawDetail';
import BindAlipay from '../screens/wallet/BindAlipay';

// user
import UserHomeScreen from '../screens/user/HomeScreen';
import SocietyScreen from '../screens/user/Society';
import WorksScreen from '../screens/user/WorksScreen';
import LikedArticlesScreen from '../screens/user/LikedArticlesScreen';

// my
import BrowsingHistoryScreen from '../screens/my/HistoryScreen';
import CommonQuestionScreen from '../screens/my/CommonQuestionScreen';
// import OpenArticlesScreen from '../screens/my/OpenArticlesScreen';
import FavoritedArticlesScreen from '../screens/my/FavoritedArticlesScreen';
import EditProfileScreen from '../screens/profile/HomeScreen';
// import EditIntroduceScreen from '../screens/profile/IntroduceScreen';
// import ResetPasswordScreen from '../screens/profile/ResetPasswordScreen';
// import PasswordVerificationScreen from '../screens/profile/PasswordVerificationScreen';

// article
import ArticleDetailScreen from '../screens/article/DetailScreen';
import CommentScreen from '../screens/comment/CommentScreen';

// POST
import PostDetailScreen from '../screens/post';

//notification
import ChatScreen from '../screens/chat';
import ChatSettingScreen from '../screens/chat/ChatSetting';
// import NewChatScreen from '../screens/chat/NewChatScreen';
import CommentsScreen from '../screens/notification/CommentsScreen';
import BeLikedScreen from '../screens/notification/BeLikedScreen';
import FollowNotificationsScreen from '../screens/notification/FollowScreen';
import OtherRemindScreen from '../screens/notification/OtherRemindScreen';

// settings
import SettingsScreen from '../screens/settings/HomeScreen';
import AboutUsScreen from '../screens/settings/AboutUsScreen';
import UserAgreementScreen from '../screens/settings/UserAgreementScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import AccountSafety from '../screens/settings/AccountSafety';
import ModifyPassword from '../screens/settings/ModifyPassword';
import AccountSecurity from '../screens/settings/AccountSecurity';
import ModifyAliPay from '../screens/settings/ModifyAliPay';

// feedback
import FeedbackScreen from '../screens/Feedback';
import FeedbackDetail from '../screens/Feedback/FeedbackDetail';

export default {
    主页: {
        screen: MainTabNavigator,
    },
    Login: {
        screen: LoginScreen,
    },
    AskQuestion: {
        screen: AskQuestion,
    },
    SelectCategory: {
        screen: SelectCategory,
    },
    Wallet: {
        screen: Wallet,
        auth: true,
    },
    WithdrawApply: {
        screen: WithdrawApply,
    },
    WithdrawHistory: {
        screen: WithdrawHistory,
    },
    VerifyAccount: {
        screen: VerifyAccount,
    },
    WithdrawDetail: {
        screen: WithdrawDetail,
    },
    BindAlipay: {
        screen: BindAlipay,
    },
    CommentNotification: {
        screen: CommentsScreen,
        auth: true,
    },
    FollowNotification: {
        screen: FollowNotificationsScreen,
        auth: true,
    },
    BeLikedNotification: {
        screen: BeLikedScreen,
        auth: true,
    },
    OtherRemindNotification: {
        screen: OtherRemindScreen,
        auth: true,
    },
    Works: {
        screen: WorksScreen,
    },
    Society: {
        screen: SocietyScreen,
    },
    CommonQuestion: {
        screen: CommonQuestionScreen,
    },
    Setting: {
        screen: SettingsScreen,
    },
    编辑个人资料: {
        screen: EditProfileScreen,
        auth: true,
    },
    // 简介编辑: {
    //     screen: EditIntroduceScreen,
    //     auth: true,
    // },
    // 重置密码: {
    //     screen: ResetPasswordScreen,
    // },
    // 密码验证: {
    //     screen: PasswordVerificationScreen,
    // },
    AboutUs: {
        screen: AboutUsScreen,
    },
    UserProtocol: {
        screen: UserAgreementScreen,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
    },
    ModifyPassword: {
        screen: ModifyPassword,
    },
    文章详情: {
        screen: ArticleDetailScreen,
    },
    Comment: {
        screen: CommentScreen,
    },
    PostDetail: {
        screen: PostDetailScreen,
    },
    Chat: {
        screen: ChatScreen,
        auth: true,
    },
    ChatSetting: {
        screen: ChatSettingScreen,
    },
    // 新消息: {
    //     screen: NewChatScreen,
    //     auth: true,
    // },
    User: {
        screen: UserHomeScreen,
    },
    喜欢: {
        screen: LikedArticlesScreen,
        auth: true,
    },
    找回密码: {
        screen: RetrievePasswordScreen,
        auth: true,
    },
    获取验证码: {
        screen: VerificationScreen,
        auth: true,
    },
    // 私密作品: {
    //     screen: DraftsScreen,
    //     auth: true,
    // },
    // 我的发布: {
    //     screen: OpenArticlesScreen,
    //     auth: true,
    // },
    我的收藏: {
        screen: FavoritedArticlesScreen,
        auth: true,
    },
    // 推送通知: {
    //     screen: NotificationSettingScreen,
    // },
    浏览记录: {
        screen: BrowsingHistoryScreen,
    },
    账号安全: {
        screen: AccountSafety,
    },
    AccountSecurity: {
        screen: AccountSecurity,
    },
    Feedback: {
        screen: FeedbackScreen,
        auth: true,
    },
    FeedbackDetail: {
        screen: FeedbackDetail,
    },
    ModifyAliPay: {
        screen: ModifyAliPay,
    },
};
