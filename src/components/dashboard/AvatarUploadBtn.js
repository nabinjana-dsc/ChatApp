import React from 'react';
import { useState, useRef } from 'react';
import { Button, Modal, Alert } from 'rsuite';
import { storage, database } from '../../misc/firebase'; // Import the firebase object
// import DisplayProfile from './DisplayProfile';
import { useProfile } from '../../context/profile.context';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';

const fileInputTypes = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const isValidFile = file => acceptedFileTypes.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();

  const { profile } = useProfile();
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();

  const onFileInputChange = ev => {
    const currFiles = ev.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong File Type: ${file.type}`, 4000);
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);

      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');

      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const updates = await getUserUpdates(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );

      await database.ref().update(updates);

      setIsLoading(false);
      Alert.info('Avatar uploaded successfully!', 4000);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select New Avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>

        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and Upload new Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}

                  /* <img
                  src={URL.createObjectURL(img)}
                  alt="Selected"
                  style={{ maxWidth: '50%' }} */
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button block appearance="primary" onClick={close}>
              Cancel
            </Button>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
