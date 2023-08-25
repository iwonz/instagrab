import { useStore } from 'effector-react';
import * as React from 'react';
import * as styles from './App.module.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ActiveModal, ActivePage } from '../../types';
import { useActionButtonLabel } from '../../hooks/useActionButtonLabel';
import { $activeModal, $activePage, $activePostCode, $username, setActiveModal } from '../../store/page';
import { downloadPost, downloadPostFx, downloadPostsFx, loadUserFx } from '../../store/downloaders/posts';
import { UserData } from '../UserData/UserData';
import LoadingButton from '@mui/lab/LoadingButton';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';

export const App = (): JSX.Element => {
  const activePage = useStore($activePage);
  const activeModal = useStore($activeModal);
  const actionButtonLabel = useActionButtonLabel();
  const isActionButtonVisible = activePage !== ActivePage.UNKNOWN && activeModal !== ActiveModal.USER_DATA;
  const isDownloadingPost = useStore(downloadPostFx.pending);
  const isGrabbingProfile = useStore(loadUserFx.pending);
  const isDownloadingPosts = useStore(downloadPostsFx.pending);
  const username = useStore($username);
  const activePostCode = useStore($activePostCode);

  const isActionButtonLoading = isDownloadingPost || isGrabbingProfile || isDownloadingPosts;

  const onActionButtonClick = () => {
    switch (activePage) {
      case ActivePage.PROFILE:
        setActiveModal(ActiveModal.USER_DATA);
        break;
      case ActivePage.POST:
        downloadPost({
          username,
          postCode: activePostCode,
        });
        break;
      case ActivePage.STORY:
        alert('Feature in progress...');
        break;
      case ActivePage.HIGHLIGHT:
        alert('Feature in progress...');
        break;
    }
  };

  let startIcon = <FileDownloadOutlinedIcon />;
  switch (activePage) {
    case ActivePage.PROFILE:
      startIcon = <ImageSearchOutlinedIcon />;
      break;
  }

  const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: '10px',
  };

  return (
    <div className={styles.wrapper}>
      {isActionButtonVisible && (
        <LoadingButton
          loading={isActionButtonLoading}
          disabled={isActionButtonLoading}
          loadingPosition="start"
          startIcon={startIcon}
          color="secondary"
          size="small"
          variant="contained"
          onClick={onActionButtonClick}
        >
          {actionButtonLabel}
        </LoadingButton>
      )}

      <Modal
        open={activeModal === ActiveModal.USER_DATA}
        onClose={() => setActiveModal(null)}
      >
        <Box sx={modalStyles}>
          <UserData />
        </Box>
      </Modal>
    </div>
  );
};