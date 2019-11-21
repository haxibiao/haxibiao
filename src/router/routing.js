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
import FavoritedArticlesScreen from '../screens/my/FavoritedArticlesScreen';
import EditProfileScreen from '../screens/profile/HomeScreen';

// content
import ArticleDetailScreen from '../screens/article/DetailScreen';
import CommentScreen from '../screens/comment/CommentScreen';
import PostDetailScreen from '../screens/post';

// category
import CategoryScreen from '../screens/category';

//notification
// import NewChatScreen from '../screens/chat/NewChatScreen';
import ChatScreen from '../screens/chat';
import ChatSettingScreen from '../screens/chat/ChatSetting';
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
    },
    FollowNotification: {
        screen: FollowNotificationsScreen,
    },
    BeLikedNotification: {
        screen: BeLikedScreen,
    },
    OtherRemindNotification: {
        screen: OtherRemindScreen,
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
    },
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
    Category: {
        screen: CategoryScreen,
    },
    Comment: {
        screen: CommentScreen,
    },
    PostDetail: {
        screen: PostDetailScreen,
    },
    Chat: {
        screen: ChatScreen,
    },
    ChatSetting: {
        screen: ChatSettingScreen,
    },
    // 新消息: {
    //     screen: NewChatScreen,
    // },
    User: {
        screen: UserHomeScreen,
    },
    喜欢: {
        screen: LikedArticlesScreen,
    },
    找回密码: {
        screen: RetrievePasswordScreen,
    },
    获取验证码: {
        screen: VerificationScreen,
    },
    我的收藏: {
        screen: FavoritedArticlesScreen,
    },
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
    },
    FeedbackDetail: {
        screen: FeedbackDetail,
    },
    ModifyAliPay: {
        screen: ModifyAliPay,
    },
};
