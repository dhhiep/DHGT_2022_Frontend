export const assetPath = (fileName) => {
  return require(`@/assets/images/${fileName}`);
};

export const resize = (imageUrl, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute('crossorigin', 'anonymous');

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const b64Data = canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
      const file = base64toBlob(b64Data, 'image/jpeg');
      resolve(URL.createObjectURL(file));
    };

    img.src = imageUrl;
  });
};

function base64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new File(byteArrays, 'pot', { type: contentType });
}
