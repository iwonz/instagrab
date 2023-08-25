import { useStore } from 'effector-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import * as styles from './UserData.module.css';
import Button from '@mui/material/Button';
import { getPostsMaterialsCount } from '../../utils/getPostsMaterialsCount';
import { Progress } from '../Progress/Progress';
import { $username } from '../../store/page';
import { $posts, $postsDownloadingStatus, $users, downloadPosts, downloadPostsFx, loadUser, loadUserFx } from '../../store/downloaders/posts';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { UserDataTab } from './types';

export const UserData = (): JSX.Element => {
  const username = useStore($username);
  const users = useStore($users);
  const posts = useStore($posts);
  const user = users[username];
  const userPosts = posts[username];
  const isUserDataLoading = useStore(loadUserFx.pending);
  const isDownloadingPosts = useStore(downloadPostsFx.pending);
  const { totalDownloadedCount } = useStore($postsDownloadingStatus);
  const { photosCount, videosCount, totalCount } = getPostsMaterialsCount(userPosts);

  useEffect(() => {
    if (username) {
      loadUser(username);
    }
  }, [username]);

  const [activeTab, setActiveTab] = useState<UserDataTab>(UserDataTab.POSTS);
  const onTabChange = (event: React.SyntheticEvent, newValue: UserDataTab) => {
    setActiveTab(newValue);
  };

  return (
    <div className={styles.wrapper}>
      {isUserDataLoading ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={styles.userInfo}>
            <img className={styles.avatar} src={user?.profile_pic_url_hd} alt={user?.full_name} />
            <div className={styles.userName}>
              <b>{user?.full_name}</b>
              <div>@{user?.username}</div>
            </div>
          </div>
          <div className={styles.details}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={onTabChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab label="Posts" value={UserDataTab.POSTS} />
                </TabList>
              </Box>
              <TabPanel sx={{ padding: 0 }} value={UserDataTab.POSTS}>
                <p>{userPosts?.length} posts founded ({totalCount} materials: {photosCount} photos + {videosCount} videos).</p>
                {isDownloadingPosts ? (
                  <>
                    <p>Downloading materials and creating archives ({totalDownloadedCount} from {totalCount} are ready).</p>
                    <Progress progress={totalDownloadedCount / totalCount * 100} />
                  </>
                ) : (
                  <Button variant="contained" onClick={() => downloadPosts(username)} disabled={isDownloadingPosts}>
                    Download all
                  </Button>
                )}
              </TabPanel>
            </TabContext>

          </div>
        </>
      )}
    </div>
  );
};
