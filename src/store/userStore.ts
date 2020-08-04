import { observable, action, runInAction } from 'mobx';
import { Keys, Storage } from './localStorage';

export interface UserScheme {
	id?: string;
	name?: string;
	avatar?: string;
	token?: string;
	count_articles?: number;
	count_followings?: number;
	count_followers?: number;
	introduction?: string;
	phone?: string;
	wallet?: object;
	[key: string]: any;
}

class UserStore {
	// launched ==> 从Storage获取用户数据完成，避免重复创建client
	@observable launched: boolean = false;
	@observable me: UserScheme = {};
	@observable login: boolean = false;
	@observable firstInstall: boolean = true;

	constructor() {
		this.recall();
	}

	@action.bound
	async recall() {
		const profile = await Storage.getItem(Keys.me);
		const firstinstall = await Storage.getItem(Keys.firstInstall);
		console.log('第一次下载字段 firstInstall from storage : ', firstinstall);
		if (firstinstall == null) {
			Storage.setItem(Keys.firstInstall, true);
		} else {
			if (firstinstall !== true) {
				this.firstInstall = false;
			}
		}
		if (profile) {
			this.signIn(profile);
		}
		this.launched = true;
	}

	@action.bound
	signIn(user: UserScheme) {
		Storage.setItem(Keys.me, user);
		TOKEN = user.token;
		this.me = user;
		this.login = true;
	}

	@action.bound
	signOut() {
		this.me = {};
		this.login = false;
		this.firstInstall = false;
		TOKEN = null;
		Storage.removeItem(Keys.me);
		// 主动注销后设置 firstInstall 为 false
		Storage.setItem(Keys.firstInstall, false);
	}

	@action.bound
	changeProfile(prop: string, value: any) {
		this.me[prop] = value;
		Storage.setItem(Keys.me, this.me);
	}
	@action.bound
	changeAvatar(avatarUrl: string) {
		this.me.avatar = avatarUrl;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changeGender(gender: string) {
		this.me.gender = gender;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changeName(name: string) {
		this.me.name = name;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changeIntroduction(introduction: any) {
		this.me.introduction = introduction;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changePhone(phone: string) {
		this.me.phone = phone;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changeBirthday(birthday_msg: string) {
		this.me.birthday_msg = birthday_msg;
		Storage.setItem(Keys.me, this.me);
	}

	@action.bound
	changeAlipay(real_name: string, pay_account: string) {
		this.me.wallet = {
			...this.me.wallet,
			real_name,
			pay_account,
		};
		Storage.setItem(Keys.me, this.me);
	}
}

export default new UserStore();
