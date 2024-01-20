import { useState } from 'react';
import { Button, Modal, Alert } from 'rsuite';
import { storage, auth } from '../../misc/firebase'; // Import the firebase object
import DisplayProfile from './DisplayProfile';
import { useProfile } from '../../context/profile.context';
import AvatarEditor from 'react-avatar-editor';
import { useModelState } from '../../misc/custom-hooks';

const fileInputTypes = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const isValidFile = file => {
  return acceptedFileTypes.includes(file.type);
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModelState();

  const { profile } = useProfile();

  const [img, setImg] = useState(null);

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
    if (img) {
      try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`avatars/${auth.currentUser.uid}`);

        const uploadTask = fileRef.put(img);

        uploadTask.on(
          'state_changed',
          null,
          error => {
            console.error('Upload error:', error);
            Alert.error('An error occurred while uploading avatar.', 4000);
          },
          async () => {
            try {
              const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();

              // Update the user's profile with the new avatar URL
              await auth.currentUser.updateProfile({
                photoURL: downloadURL,
              });

              Alert.success('Avatar uploaded successfully!', 4000);
              close();
            } catch (error) {
              console.error('Download URL error:', error);
              Alert.error('An error occurred while updating profile.', 4000);
            }
          }
        );
      } catch (error) {
        console.error('Storage error:', error);
        Alert.error('An error occurred while uploading avatar.', 4000);
      }
    } else {
      Alert.warning('No image selected.', 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <DisplayProfile
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
            <Button block appearance="ghost" onClick={onUploadClick}>
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
