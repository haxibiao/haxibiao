import { useEffect, useRef, useCallback } from 'react';
import VideoStore from '!/src/store/DrawVideoStore';

const AdRewardProgress = (focus: boolean) => {
    const currentTime = useRef(0);
    const flag = useRef(focus);
    const timer = useRef(0);

    const setRewardProgress = useCallback((): any => {
        return setTimeout(() => {
            if (flag.current && currentTime.current < VideoStore.rewardLimit) {
                VideoStore.rewardProgress += 0.1;
                currentTime.current += 0.1;
                setRewardProgress();
            }
        }, 100);
    }, []);

    useEffect(() => {
        if (focus) {
            flag.current = true;
            timer.current = setRewardProgress();
        } else {
            flag.current = false;
        }
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [focus]);
};

export default AdRewardProgress;
