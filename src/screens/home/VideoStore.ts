import { observable, action, computed, runInAction } from 'mobx';

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

class VideoStore {
    readonly rewardLimit: number = 30; // 奖励频率
    public playedVideoIds: number[] = []; // 后端需记录用户浏览的视频

    @observable public dataSource: Post[] = [];
    @observable public isLoading: boolean = true;
    @observable public isError: boolean = false;
    @observable public isFinish: boolean = false;
    @observable public isRefreshing: boolean = false;
    @observable public isLoadMore: boolean = false;
    @observable public videoPaused: boolean = false;
    @observable public currentPage: number = 0;
    @observable public viewableItemIndex: number = -1;
    @observable public rewardProgress: number = 0;

    @computed get currentItem(): Post {
        return this.dataSource[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    @action.bound
    public addSource(source: Post[]) {
        this.currentPage++;
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    public play() {
        this.videoPaused = false;
    }

    @action.bound
    public pause() {
        this.videoPaused = true;
    }
}

export default new VideoStore();
