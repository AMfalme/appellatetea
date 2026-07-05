import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './config';

export interface UploadProgress {
  progress: number;
  error?: Error;
  downloadUrl?: string;
}

export const uploadFile = async (
  path: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress });
      },
      (error) => {
        onProgress?.({ progress: 0, error: new Error(error.message) });
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress?.({ progress: 100, downloadUrl });
        resolve(downloadUrl);
      }
    );
  });
};

export const getFileURL = async (path: string) => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};