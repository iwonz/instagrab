import { downloadZip, InputWithMeta } from 'client-zip';

export const downloadZipFile = (files: InputWithMeta[], fileName: string) => {
  return downloadZip(files).blob().then((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.zip`;
    link.click();
    link.remove();
  });
};
