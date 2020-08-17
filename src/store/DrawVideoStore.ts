import { observable, action, computed } from 'mobx';

interface User {
    id: number;
    name: string;
    avatar: string;
    followed_user_status: number;
}

interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    cover?: string;
}

interface Post {
    id: number;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    user: User;
    video: Video;
}

class DrawVideoStore {
    readonly rewardLimit: number = 30; // 奖励频率
    public playedVideoIds: number[] = []; // 后端需记录用户浏览的视频

    @observable public dataSource: Post[] = [];
    @observable public isLoading: boolean = true;
    @observable public isError: boolean = false;
    @observable public isFinish: boolean = false;
    @observable public isRefreshing: boolean = false;
    @observable public isLoadMore: boolean = false;
    @observable public currentPage: number = 0;
    @observable public viewableItemIndex: number = -1;
    @observable public rewardProgress: number = 0;
    @observable public getReward = [];

    @computed get currentItem(): Post {
        return this.dataSource[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    @action.bound
    public reset() {
        this.dataSource = [];
        this.isLoading = true;
        this.isError = false;
        this.isFinish = false;
        this.isRefreshing = false;
        this.isLoadMore = false;
        this.viewableItemIndex = -1;
        this.rewardProgress = 0;
        this.getReward = [];
    }

    @action.bound
    public addSource(source: Post[]) {
        this.currentPage++;
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    public addGetRewardId(id: any) {
        this.getReward = this.getReward.concat(id);
        console.log('this.getReward', this.getReward);
    }
}

export default new DrawVideoStore();
