import SplashGuide from './SplashGuide';

import MainTabNavigator from '~router/MainTabNavigator';
import AskQuestion from '~screens/creation/AskQuestionScreen';
import SelectCategory from '~screens/creation/SelectCategoryScreen';

// login
import LoginScreen from '~screens/login';
import RetrievePasswordScreen from '~screens/login/RetrievePasswordScreen';
import VerificationScreen from '~screens/login/VerificationScreen';

// wallet
import Wallet from '~screens/wallet';
import WithdrawApply from '~screens/wallet/WithdrawApply';
import WithdrawHistory from '~screens/wallet/WithdrawHistory';
import VerifyAccount from '~screens/wallet/VerifyAccount';
import WithdrawDetail from '~screens/wallet/WithdrawDetail';
import BindAlipay from '~screens/wallet/BindAlipay';

// user
import UserHomeScreen from '~screens/user/HomeScreen';
import SocietyScreen from '~screens/user/Society';
import WorksScreen from '~screens/user/WorksScreen';
import LikedArticlesScreen from '~screens/user/LikedArticlesScreen';

import UserBlockScreen from '~screens/user/UserBlock';

// my
import BrowsingHistoryScreen from '~screens/my/HistoryScreen';
import CommonQuestionScreen from '~screens/my/CommonQuestionScreen';
import FavoritedArticlesScreen from '~screens/my/FavoritedArticlesScreen';
import EditProfileScreen from '~screens/profile/HomeScreen';

// content
import ArticleDetailScreen from '~screens/article/DetailScreen';
import CommentScreen from '~screens/comment/CommentScreen';
import Report from '~screens/comment/Report';
import PostDetailScreen from '~screens/post';

// category
import CategoryScreen from '~screens/category';

//notification
// import NewChatScreen from '~screens/chat/NewChatScreen';
import NotificationPage from '~screens/notification/NotificationPage';
import ChatScreen from '~screens/chat';
import ChatSettingScreen from '~screens/chat/ChatSetting';
import CommentsScreen from '~screens/notification/CommentsScreen';
import BeLikedScreen from '~screens/notification/BeLikedScreen';
import FollowNotificationsScreen from '~screens/notification/FollowScreen';
import OtherRemindScreen from '~screens/notification/OtherRemindScreen';

// settings
import SettingsScreen from '~screens/settings/HomeScreen';
import AboutUsScreen from '~screens/settings/AboutUsScreen';
import UserAgreementScreen from '~screens/settings/UserAgreementScreen';
import PrivacyPolicyScreen from '~screens/settings/PrivacyPolicyScreen';
import AccountSafety from '~screens/settings/AccountSafety';
import ModifyPassword from '~screens/settings/ModifyPassword';
import AccountSecurity from '~screens/settings/AccountSecurity';
import ModifyAliPay from '~screens/settings/ModifyAliPay';
import LogoutAccount from '~screens/settings/LogoutAccount';
import CancellationAgreement from '~screens/settings/CancellationAgreement';
import PhoneVerification from '~screens/settings/PhoneVerification';
import BindDongdezhuan from '~screens/settings/BindDongdezhuan';

// feedback
import FeedbackScreen from '~screens/Feedback';
import FeedbackDetail from '~screens/Feedback/FeedbackDetail';

// Task
import TaskScreen from '~screens/task';
import TaskSleepScreen from '~screens/task/sleep';
import TaskDrinkWaterScreen from '~screens/task/drinkWaters';
import Praise from '~screens/task/Praise';
import SpiderVideo from '~screens/task/SpiderVideoTask';
import TaskRewardVideo from '~screens/task/rewardVideo';
import TaskNewUserBook from '~screens/task/newuser';

export default {
	SplashGuide: {
		component: SplashGuide,
		path: 'splash/:route',
	},
	主页: {
		component: MainTabNavigator,
		path: 'mainTab/:route',
	},
	Login: {
		component: LoginScreen,
	},
	AskQuestion: {
		component: AskQuestion,
	},
	SpiderVideo: {
		component: SpiderVideo,
	},
	SelectCategory: {
		component: SelectCategory,
	},
	Wallet: {
		component: Wallet,
	},
	WithdrawApply: {
		component: WithdrawApply,
	},
	WithdrawHistory: {
		component: WithdrawHistory,
	},
	VerifyAccount: {
		component: VerifyAccount,
	},
	WithdrawDetail: {
		component: WithdrawDetail,
	},
	BindAlipay: {
		component: BindAlipay,
	},
	BindDongdezhuan: {
		component: BindDongdezhuan,
	},
	CommentNotification: {
		component: CommentsScreen,
	},
	FollowNotification: {
		component: FollowNotificationsScreen,
	},
	BeLikedNotification: {
		component: BeLikedScreen,
	},
	OtherRemindNotification: {
		component: OtherRemindScreen,
	},
	Works: {
		component: WorksScreen,
	},
	Society: {
		component: SocietyScreen,
	},
	CommonQuestion: {
		component: CommonQuestionScreen,
	},
	Setting: {
		component: SettingsScreen,
		path: 'setting/:route',
	},
	编辑个人资料: {
		component: EditProfileScreen,
	},
	AboutUs: {
		component: AboutUsScreen,
	},
	UserProtocol: {
		component: UserAgreementScreen,
	},
	PrivacyPolicy: {
		component: PrivacyPolicyScreen,
	},
	ModifyPassword: {
		component: ModifyPassword,
	},
	文章详情: {
		component: ArticleDetailScreen,
	},
	Category: {
		component: CategoryScreen,
	},
	Comment: {
		component: CommentScreen,
	},
	PostDetail: {
		component: PostDetailScreen,
	},
	Chat: {
		component: ChatScreen,
	},
	ChatSetting: {
		component: ChatSettingScreen,
	},
	// 新消息: {
	//     component: NewChatScreen,
	// },
	User: {
		component: UserHomeScreen,
	},
	Report: {
		component: Report,
	},

	喜欢: {
		component: LikedArticlesScreen,
	},
	找回密码: {
		component: RetrievePasswordScreen,
	},
	获取验证码: {
		component: VerificationScreen,
	},
	我的收藏: {
		component: FavoritedArticlesScreen,
	},
	浏览记录: {
		component: BrowsingHistoryScreen,
	},
	账号安全: {
		component: AccountSafety,
	},
	AccountSecurity: {
		component: AccountSecurity,
	},
	Feedback: {
		component: FeedbackScreen,
	},
	FeedbackDetail: {
		component: FeedbackDetail,
	},
	ModifyAliPay: {
		component: ModifyAliPay,
	},
	LogoutAccount: {
		component: LogoutAccount,
	},

	CancellationAgreement: {
		component: CancellationAgreement,
	},
	TaskScreen: {
		component: TaskScreen,
	},
	TaskDrinkWater: {
		component: TaskDrinkWaterScreen,
		path: 'task/TaskDrinkWater',
	},
	TaskSleep: {
		component: TaskSleepScreen,
		path: 'task/TaskSleep',
	},
	TaskRewardVideo: {
		component: TaskRewardVideo,
		path: 'task/TaskRewardVideo',
	},
	Praise: {
		component: Praise,
	},
	PhoneVerification: {
		component: PhoneVerification,
	},
	NotificationPage: {
		component: NotificationPage,
	},
	TaskNewUserBook: {
		component: TaskNewUserBook,
	},
	UserBlockScreen: {
		component: UserBlockScreen,
	},
};
